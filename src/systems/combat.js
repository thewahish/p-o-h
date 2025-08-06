// filename: src/systems/combat.js

import { GameState } from "../core/state.js";
import { GameConfig } from "../constants/config.js";
import Logger from "../core/logger.js";
import { t, Localization } from "../core/localization.js";

export class CombatSystem {
  constructor({ forceUpdate }) {
    this.updateCallback = forceUpdate;
    this.onLog = () => {}; // This will be set by startBattle to update the UI combat log
  }

  startBattle(enemies, options = {}) {
    this.onLog = options.onLog || (() => {});
    GameState.update('battleInProgress', true);
    if (GameState.current.player) GameState.current.player.isAlive = true;

    GameState.current.enemies = enemies.map((enemy, index) => ({
      ...enemy,
      originalIndex: index,
      isAlive: true,
      statusEffects: [],
    }));

    const enemyNames = enemies.map(e => e.nameKey ? t(e.nameKey) : 'Enemy').join(', ');
    const startMessage = t('combat.messages.battleBegins', {enemies: enemyNames});
    Logger.log(startMessage, 'COMBAT');
    this.onLog(startMessage);

    this.calculateTurnOrder();
    this.processTurn();
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

    const dmg = this.calculateDamage(GameState.current.player, target);
    target.stats.hp = Math.max(0, target.stats.hp - dmg);
    this.onLog(t('combat.messages.youAttack', {target: target.nameKey ? t(target.nameKey) : 'Enemy', damage: dmg}));
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
    if (!GameState.spendResource(skillData.cost)) {
      const resourceName = player.resource.nameKey ? t(player.resource.nameKey) : 'Resource';
      const skillName = typeof skillData.name === 'object' ? skillData.name.en : skillData.name;
      this.onLog(`Not enough ${resourceName} for ${skillName}.`);
      return;
    }
    const skillName = typeof skillData.name === 'object' ? (skillData.name[Localization.getCurrentLanguage()] || skillData.name.en) : skillData.name;
    this.onLog(t('combat.messages.youUseSkill', {skill: skillName}));
    
    const targets = skillData.target === 'all' 
      ? GameState.current.enemies.filter(e => e.isAlive)
      : [GameState.current.enemies.find(e => e.originalIndex === targetIndex)].filter(Boolean);
    
    targets.forEach(target => {
      if (skillData.damageMultiplier) {
          const dmg = this.calculateDamage(player, target, skillData.damageMultiplier);
          target.stats.hp = Math.max(0, target.stats.hp - dmg);
          const skillName = typeof skillData.name === 'object' ? (skillData.name[Localization.getCurrentLanguage()] || skillData.name.en) : skillData.name;
          const targetName = target.nameKey ? t(target.nameKey) : 'Enemy';
          this.onLog(t('combat.messages.skillHits', {skill: skillName, target: targetName, damage: dmg}));
          if (target.stats.hp <= 0) this.killUnit(target);
      }
      if (skillData.effect && target.isAlive) {
          const existingEffect = target.statusEffects.find(e => e.type === skillData.effect.type);
          if (existingEffect) {
              existingEffect.duration = skillData.effect.duration;
          } else {
              target.statusEffects.push({ ...skillData.effect });
          }
          const targetName = target.nameKey ? t(target.nameKey) : 'Enemy';
          this.onLog(t('combat.messages.targetAfflicted', {target: targetName, effect: skillData.effect.type}));
      }
    });
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
    const player = GameState.current.player;
    let dmg = this.calculateDamage(enemy, player);
    if (player.defending) {
        dmg = Math.floor(dmg * 0.5);
        this.onLog(t('combat.messages.defenseReduced'));
    }
    player.stats.hp = Math.max(0, player.stats.hp - dmg);
    const enemyName = enemy.nameKey ? t(enemy.nameKey) : 'Enemy';
    this.onLog(t('combat.messages.enemyAttacks', {enemy: enemyName, damage: dmg}));
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
        this.onLog(t('combat.messages.allEnemiesDefeated'));
        GameState.update('battleInProgress', false); // ← ADDED BATTLE END STATE
        return true;
    } else if (playerDead) {
        this.onLog(t('combat.messages.youDefeated'));
        GameState.update('battleInProgress', false); // ← ADDED BATTLE END STATE
        return false;
    }
    return null;
  }

  killUnit(unit) {
    unit.isAlive = false;
    if (unit.id === 'player') {
        this.onLog(t('combat.messages.youDefeated'));
    } else {
        const unitName = unit.nameKey ? t(unit.nameKey) : 'Enemy';
        this.onLog(t('combat.messages.unitDefeated', {unit: unitName}));
        // Award Hero Soul for enemy defeat
        GameState.awardSouls(1, `Defeating ${unitName}`);
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
}