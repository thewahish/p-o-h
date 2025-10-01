// filename: src/systems/combat.js

import { GameState } from "../core/state.js";
import { GameConfig } from "../constants/config.js";
import Logger from "../core/logger.js";
import { t, Localization } from "../core/localization.js";
import { BuffSystem } from "./buffs.js";
import { BreakSystem } from "./break-system.js";
import { UltimateSystem, UltimatePointGains } from "./ultimate-system.js";
import { getAbilityElement, getElementalMultiplier } from "../constants/elements.js";

export class CombatSystem {
  constructor({ forceUpdate }) {
    this.updateCallback = forceUpdate;
    this.onLog = () => {}; // This will be set by startBattle to update the UI combat log
  }

  startBattle(enemies, options = {}) {
    this.onLog = options.onLog || (() => {});
    GameState.update('battleInProgress', true);
    if (GameState.current.player) GameState.current.player.isAlive = true;

    // Initialize buff system for this battle
    BuffSystem.initializeBattle();

    // Initialize ultimate gauge
    UltimateSystem.resetUltimateGauge();

    // Initialize break data for all enemies
    const currentFloor = GameState.current.currentFloor || 1;
    enemies.forEach(enemy => {
      BreakSystem.initializeEnemyBreakData(enemy, currentFloor);
    });

    // Wave combat system: organize enemies into waves
    this.organizeWaves(enemies);
    
    // Start with first wave
    this.currentWave = 1;
    this.spawnWave(1);
    
    const totalEnemies = enemies.length;
    const startMessage = t('combat.messages.battleBegins', {enemies: `${totalEnemies} enemies in ${this.totalWaves} waves`});
    Logger.log(startMessage, 'COMBAT');
    this.onLog(startMessage);

    this.calculateTurnOrder();
    this.processTurn();
  }
  
  organizeWaves(enemies) {
    // Organize enemies into waves for better pacing
    this.allWaveEnemies = enemies;
    this.waves = [];
    
    if (enemies.length <= 2) {
      // Single wave for 1-2 enemies
      this.waves = [enemies];
    } else if (enemies.length === 3) {
      // 2 waves: 2 + 1 for triple encounters
      this.waves = [
        enemies.slice(0, 2),
        enemies.slice(2, 3)
      ];
    } else {
      // For larger encounters (shouldn't happen often but just in case)
      const waveSize = Math.ceil(enemies.length / Math.ceil(enemies.length / 2));
      for (let i = 0; i < enemies.length; i += waveSize) {
        this.waves.push(enemies.slice(i, i + waveSize));
      }
    }
    
    this.totalWaves = this.waves.length;
    Logger.log(`Combat organized into ${this.totalWaves} waves: ${this.waves.map(w => w.length).join(', ')} enemies`, 'COMBAT');
  }
  
  spawnWave(waveNumber) {
    const waveEnemies = this.waves[waveNumber - 1];
    if (!waveEnemies) return;
    
    GameState.current.enemies = waveEnemies.map((enemy, index) => ({
      ...enemy,
      originalIndex: index,
      isAlive: true,
      statusEffects: [],
    }));
    
    const waveMessage = waveNumber === 1 ? 
      t('combat.messages.waveBegins', {wave: waveNumber, total: this.totalWaves}) :
      t('combat.messages.waveSpawn', {
        wave: waveNumber, 
        total: this.totalWaves, 
        enemies: waveEnemies.map(e => e.level ? `Lv.${e.level} ${e.nameKey ? t(e.nameKey) : 'Enemy'}` : (e.nameKey ? t(e.nameKey) : 'Enemy')).join(', ')
      });
    
    this.onLog(waveMessage);
    Logger.log(waveMessage, 'COMBAT');
  }

  calculateTurnOrder() {
    const player = { ...GameState.current.player, id: 'player' };
    const enemies = GameState.current.enemies.map(e => ({ ...e, id: `enemy_${e.originalIndex}` }));
    GameState.current.turnOrder = [...enemies, player].sort((a, b) => b.stats.spd - a.stats.spd).map(unit => unit.id);
    GameState.current.currentTurnIndex = 0;
    GameState.update('turnOrder', GameState.current.turnOrder);
  }

  isPlayerTurn() {
    if (!GameState.current.battleInProgress) return false;
    const id = GameState.current.turnOrder[GameState.current.currentTurnIndex];
    return id === 'player';
  }

  playerAttack(targetIndex) {
    if (!this.isPlayerTurn()) return;
    const target = GameState.current.enemies.find(e => e.originalIndex === targetIndex);
    if (!target || !target.isAlive) return;

    // Basic attacks are always physical
    const attackElement = 'physical';

    // Calculate damage with elemental multipliers
    let dmg = this.calculateDamageWithElements(GameState.current.player, target, 1.0, attackElement);

    target.stats.hp = Math.max(0, target.stats.hp - dmg);

    const targetName = target.level ? `Lv.${target.level} ${target.nameKey ? t(target.nameKey) : 'Enemy'}` : (target.nameKey ? t(target.nameKey) : 'Enemy');
    this.onLog(t('combat.messages.youAttack', {target: targetName, damage: dmg}));

    // Deal toughness damage
    const breakResult = BreakSystem.dealToughnessDamage(target, attackElement, this.onLog.bind(this));
    if (breakResult.broken) {
      // Award bonus ultimate points for breaking
      UltimateSystem.addUltimatePoints(UltimatePointGains.BREAK_ENEMY, 'breaking enemy', this.onLog.bind(this));
    }

    // Process buff effects after dealing damage (e.g., vampiric)
    BuffSystem.processBuffEffects('damage_dealt', { damage: dmg, onLog: this.onLog.bind(this) });

    // Gain ultimate points for basic attack
    UltimateSystem.addUltimatePoints(UltimatePointGains.BASIC_ATTACK, 'basic attack', this.onLog.bind(this));

    if (target.stats.hp <= 0) this.killUnit(target);
    this.updateCallback(); // ← ADDED UI UPDATE
    this.nextTurn();
  }

  playerSkill(targetIndex) {
    if (!this.isPlayerTurn()) return;
    const player = GameState.current.player;
    const skillId = player.abilities[0];
    const skillData = GameConfig.ABILITIES[skillId];
    if (!skillData) {
      Logger.log(`Skill not found: ${skillId}`, 'ERROR');
      return;
    }

    const resourceBefore = player.resource.current;
    if (!GameState.spendResource(skillData.cost)) {
      const resourceName = player.resource.nameKey ? t(player.resource.nameKey) : 'Resource';
      const skillName = typeof skillData.name === 'object' ? skillData.name.en : skillData.name;
      this.onLog(`Not enough ${resourceName} for ${skillName}.`);
      return;
    }
    const resourceAfterSpend = player.resource.current;

    // Log resource expenditure
    const resourceName = player.resource.nameKey ? t(player.resource.nameKey) : 'Resource';
    const skillName = typeof skillData.name === 'object' ? (skillData.name[Localization.getCurrentLanguage()] || skillData.name.en) : skillData.name;
    this.onLog(`Used ${skillName} (-${skillData.cost} ${resourceName})`);
    Logger.log(`[COMBAT] Resource before: ${resourceBefore}, after spend: ${resourceAfterSpend}, cost: ${skillData.cost}`, 'COMBAT');

    // Process buff effects when ability is used (e.g., lucky strikes for resource save chance)
    const buffResult = BuffSystem.processBuffEffects('ability_used', { cost: skillData.cost, onLog: this.onLog.bind(this) });

    this.onLog(t('combat.messages.youUseSkill', {skill: skillName}));

    // Get ability element
    const abilityElement = getAbilityElement(skillId);

    const targets = skillData.target === 'all'
      ? GameState.current.enemies.filter(e => e.isAlive)
      : [GameState.current.enemies.find(e => e.originalIndex === targetIndex)].filter(Boolean);

    targets.forEach(target => {
      if (skillData.damageMultiplier) {
          // Use elemental damage calculation
          const dmg = this.calculateDamageWithElements(player, target, skillData.damageMultiplier, abilityElement);
          target.stats.hp = Math.max(0, target.stats.hp - dmg);
          const skillName = typeof skillData.name === 'object' ? (skillData.name[Localization.getCurrentLanguage()] || skillData.name.en) : skillData.name;
          const targetName = target.level ? `Lv.${target.level} ${target.nameKey ? t(target.nameKey) : 'Enemy'}` : (target.nameKey ? t(target.nameKey) : 'Enemy');
          this.onLog(t('combat.messages.skillHits', {skill: skillName, target: targetName, damage: dmg}));

          // Deal toughness damage
          const breakResult = BreakSystem.dealToughnessDamage(target, abilityElement, this.onLog.bind(this));
          if (breakResult.broken) {
            // Award bonus ultimate points for breaking
            UltimateSystem.addUltimatePoints(UltimatePointGains.BREAK_ENEMY, 'breaking enemy', this.onLog.bind(this));
          }

          // Process buff effects after skill damage (e.g., vampiric)
          BuffSystem.processBuffEffects('damage_dealt', { damage: dmg, onLog: this.onLog.bind(this) });

          if (target.stats.hp <= 0) this.killUnit(target);
      }
      if (skillData.effect && target.isAlive) {
          const existingEffect = target.statusEffects.find(e => e.type === skillData.effect.type);
          if (existingEffect) {
              existingEffect.duration = skillData.effect.duration;
          } else {
              target.statusEffects.push({ ...skillData.effect });
          }
          const targetName = target.level ? `Lv.${target.level} ${target.nameKey ? t(target.nameKey) : 'Enemy'}` : (target.nameKey ? t(target.nameKey) : 'Enemy');
          this.onLog(t('combat.messages.targetAfflicted', {target: targetName, effect: skillData.effect.type}));
      }
    });

    // Gain ultimate points for using ability
    UltimateSystem.addUltimatePoints(UltimatePointGains.USE_ABILITY, 'using ability', this.onLog.bind(this));

    this.updateCallback(); // ← ADDED UI UPDATE
    this.nextTurn();
  }
  
  playerDefend() {
    if (!this.isPlayerTurn()) return;
    this.onLog(t('combat.messages.defensiveStance'));
    GameState.current.player.defending = true;
    this.updateCallback(); // ← ADDED UI UPDATE
    this.nextTurn();
  }

  playerUltimate(targetIndex) {
    if (!this.isPlayerTurn()) return;

    const characterId = GameState.current.player.characterId;
    const focusedEnemy = GameState.current.enemies.find(e => e.originalIndex === targetIndex);
    const targets = [focusedEnemy].filter(Boolean);

    const success = UltimateSystem.useUltimate(characterId, targets, this, this.onLog.bind(this));

    if (success) {
      this.updateCallback();
      this.nextTurn();
    }
  }

  playerFlee() {
    if (!this.isPlayerTurn()) return;
    if (Math.random() < GameConfig.COMBAT.fleeChance) {
      this.onLog(t('combat.messages.successfulEscape'));
      GameState.current.onBattleEnd(false, null);
    } else {
      this.onLog(t('combat.messages.failedEscape'));
      this.updateCallback(); // ← ADDED UI UPDATE
      this.nextTurn();
    }
  }

  enemyAttack(enemy) {
    // Check if enemy should skip turn due to being broken
    if (BreakSystem.shouldSkipTurn(enemy)) {
      const enemyName = enemy.level ? `Lv.${enemy.level} ${enemy.nameKey ? t(enemy.nameKey) : 'Enemy'}` : (enemy.nameKey ? t(enemy.nameKey) : 'Enemy');
      this.onLog(`⚠️ ${enemyName} is STUNNED! Turn skipped!`);
      this.updateCallback();
      return; // Enemy loses turn
    }

    const player = GameState.current.player;
    let dmg = this.calculateDamage(enemy, player);
    if (player.defending) {
        dmg = Math.floor(dmg * 0.5);
        this.onLog(t('combat.messages.defenseReduced'));
    }
    player.stats.hp = Math.max(0, player.stats.hp - dmg);
    const enemyName = enemy.level ? `Lv.${enemy.level} ${enemy.nameKey ? t(enemy.nameKey) : 'Enemy'}` : (enemy.nameKey ? t(enemy.nameKey) : 'Enemy');
    this.onLog(t('combat.messages.enemyAttacks', {enemy: enemyName, damage: dmg}));

    // Gain ultimate points for taking damage
    UltimateSystem.addUltimatePoints(UltimatePointGains.TAKE_DAMAGE, 'taking damage', this.onLog.bind(this));

    if (player.stats.hp <= 0) this.killUnit(player);
    this.updateCallback(); // ← ADDED UI UPDATE
  }
  
  processTurn() {
    if (!GameState.current.battleInProgress) return;
    const unit = this.getCurrentTurnUnit();
    if (!unit || !unit.isAlive) {
        this.nextTurn();
        return;
    }
    this.processStatusEffects(unit);
    if (!unit.isAlive) {
        this.nextTurn();
        return;
    }
    if (this.isPlayerTurn()) {
        // Regenerate player resource at turn start
        const player = GameState.current.player;
        const baseRegen = GameConfig.COMBAT.resourceRegeneration.baseAmount;
        const levelBonus = (GameState.current.level - 1) * (GameConfig.COMBAT.resourceRegeneration.levelScaling || 0.5);
        let resourceRegen = Math.floor(baseRegen + levelBonus);

        // Apply buff modifiers to regeneration
        const modifiedRegen = BuffSystem.getModifiedResourceRegen(resourceRegen);

        // Add regenerated resource (capped at max)
        const oldResource = player.resource.current;
        player.resource.current = Math.min(player.resource.max, player.resource.current + modifiedRegen);
        const actualRegen = player.resource.current - oldResource;

        const resourceName = player.resource.nameKey ? t(player.resource.nameKey) : 'Resource';
        if (actualRegen > 0) {
            this.onLog(`[Regen] +${actualRegen} ${resourceName} (${oldResource} → ${player.resource.current})`);
            Logger.log(`[COMBAT] Resource regeneration: +${actualRegen} (${oldResource} → ${player.resource.current})`, 'COMBAT');
        }
        // Classic Mode: No resource regeneration - no message needed

        // Process buff effects at turn start
        BuffSystem.processBuffEffects('turn_start', { onLog: this.onLog.bind(this) });

        this.onLog(t('combat.messages.yourTurn'));
        GameState.current.player.defending = false;
        this.updateCallback();
    } else {
        setTimeout(() => {
            if(unit.isAlive && GameState.current.battleInProgress) {
                this.enemyAttack(unit);
            }
            this.nextTurn();
        }, 800);
    }
  }

  nextTurn() {
    if (!GameState.current.battleInProgress) return;
    const battleOutcome = this.checkBattleEnd();
    if (battleOutcome !== null) {
        const rewards = battleOutcome ? GameState.current.enemies.map(e => ({
            gold: e.goldReward ? (Math.floor(Math.random() * (e.goldReward.max - e.goldReward.min + 1)) + e.goldReward.min) : 0, 
            xp: e.xpReward || 0 
        })) : null;
        GameState.current.onBattleEnd(battleOutcome, rewards);
        return;
    }
    GameState.current.currentTurnIndex = (GameState.current.currentTurnIndex + 1) % GameState.current.turnOrder.length;
    GameState.update('currentTurnIndex', GameState.current.currentTurnIndex);
    if (GameState.current.turnOrder.length > 0) {
        this.processTurn();
    }
  }
  
  checkBattleEnd() {
    const allEnemiesDead = GameState.current.enemies.every(e => !e.isAlive);
    const playerDead = GameState.current.player.stats.hp <= 0;
    
    if (allEnemiesDead) {
        // Check if there are more waves to spawn
        if (this.currentWave < this.totalWaves) {
            this.onLog(t('combat.messages.waveCleared', {wave: this.currentWave, next: this.currentWave + 1}));
            
            // Award small bonus for clearing wave (except the final one)
            GameState.awardSouls(1, `Clearing wave ${this.currentWave}`);
            
            // Brief pause before next wave (for dramatic effect)
            setTimeout(() => {
                this.currentWave++;
                this.spawnWave(this.currentWave);
                this.calculateTurnOrder();
                this.processTurn();
                this.updateCallback(); // Update UI to show new wave
            }, 1500); // 1.5 second pause
            
            return null; // Battle continues
        } else {
            // All waves completed
            this.onLog(t('combat.messages.allEnemiesDefeated'));
            GameState.update('battleInProgress', false);
            return true;
        }
    } else if (playerDead) {
        this.onLog(t('combat.messages.youDefeated'));
        GameState.update('battleInProgress', false);
        return false;
    }
    return null;
  }

  killUnit(unit) {
    unit.isAlive = false;
    if (unit.id === 'player') {
        this.onLog(t('combat.messages.youDefeated'));
    } else {
        const unitName = unit.level ? `Lv.${unit.level} ${unit.nameKey ? t(unit.nameKey) : 'Enemy'}` : (unit.nameKey ? t(unit.nameKey) : 'Enemy');
        this.onLog(t('combat.messages.unitDefeated', {unit: unitName}));
        // Award Hero Soul for enemy defeat
        GameState.awardSouls(3, `Defeating ${unitName}`); // Increased from 1 to 3 for meaningful early gains
    }
    this.updateCallback();
  }
  
  processStatusEffects(unit) {
    if (!unit.statusEffects) unit.statusEffects = [];
    const remainingEffects = [];
    unit.statusEffects.forEach(effect => {
        if (effect.type === 'poison') {
            const poisonDmg = effect.damage;
            unit.stats.hp = Math.max(0, unit.stats.hp - poisonDmg);
            const unitName = unit.nameKey ? t(unit.nameKey) : (unit.id === 'player' ? 'Player' : 'Enemy');
            this.onLog(t('combat.messages.poisonDamage', {unit: unitName, damage: poisonDmg}));
            if (unit.stats.hp <= 0) this.killUnit(unit);
        }
        effect.duration--;
        if (effect.duration > 0) {
            remainingEffects.push(effect);
        } else {
            const unitName = unit.nameKey ? t(unit.nameKey) : (unit.id === 'player' ? 'Player' : 'Enemy');
            this.onLog(t('combat.messages.statusWoreOff', {unit: unitName, effect: effect.type}));
        }
    });
    unit.statusEffects = remainingEffects;
  }
  
  getCurrentTurnUnit() {
    const id = GameState.current.turnOrder[GameState.current.currentTurnIndex];
    if (id === "player") return GameState.current.player;
    const enemyIndex = parseInt(id.split('_')[1]);
    return GameState.current.enemies.find(e => e.originalIndex === enemyIndex);
  }
  
  instantWin() {
    if (!GameState.current.battleInProgress) return;
    Logger.log('DEBUG: Instantly winning battle.', 'SYSTEM');
    GameState.current.enemies.forEach(e => {
        e.stats.hp = 0;
        e.isAlive = false;
    });
    this.updateCallback(); // ← ADDED UI UPDATE
    this.nextTurn();
  }

  calculateDamage(attacker, defender, multiplier = 1.0) {
    if (defender.id === 'player' && GameState.current.godMode) {
        Logger.log('GOD MODE: Player takes 0 damage.', 'SYSTEM');
        return 0;
    }
    if (attacker.id === 'player' && GameState.current.godMode) {
        Logger.log('GOD MODE: Player deals 9999 damage.', 'SYSTEM');
        return 9999;
    }
    
    let attackerAtk = attacker.stats.atk;
    const defenderDef = defender.stats.def;
    let baseDmg = (attackerAtk * attackerAtk) / (attackerAtk + defenderDef);
    if (baseDmg < 1) baseDmg = 1;
    let finalDmg = Math.floor(baseDmg * multiplier);
    if (Math.random() * 100 < attacker.stats.crit) {
        finalDmg = Math.floor(finalDmg * GameConfig.COMBAT.baseCritMultiplier);
        this.onLog(t('combat.messages.criticalHit'));
    }
    return Math.max(1, finalDmg);
  }

  calculateDamageWithElements(attacker, defender, multiplier = 1.0, element = 'physical') {
    // Calculate base damage
    let baseDamage = this.calculateDamage(attacker, defender, multiplier);

    // Apply elemental multiplier only if defender is an enemy with break data
    if (defender.breakData) {
      const elementalMultiplier = getElementalMultiplier(
        element,
        defender.breakData.weaknesses,
        defender.breakData.resistances
      );

      baseDamage = Math.floor(baseDamage * elementalMultiplier);

      // Log elemental effectiveness
      if (elementalMultiplier > 1.0) {
        this.onLog(`🔥 Weakness hit! (${elementalMultiplier}x damage)`);
      } else if (elementalMultiplier < 1.0) {
        this.onLog(`🛡️ Resisted! (${elementalMultiplier}x damage)`);
      }
    }

    // Apply broken multiplier (50% bonus if enemy is broken)
    const brokenMultiplier = BreakSystem.getBrokenMultiplier(defender);
    if (brokenMultiplier > 1.0) {
      baseDamage = Math.floor(baseDamage * brokenMultiplier);
      this.onLog(`💥 BONUS DAMAGE! (Enemy is broken!)`);
    }

    return Math.max(1, baseDamage);
  }
}