// filename: src/systems/combat.js

import { GameState } from "../core/state.js";
import { GameConfig } from "../constants/config.js";

export class CombatSystem {
  constructor({ getSystem }) {
    this.getSystem = getSystem;
    this.logCallback = null;
    this.updateCallback = null;
  }

  startBattle(enemies, options = {}) {
    this.logCallback = options.onLog || (() => {});
    this.updateCallback = options.onUpdate || (() => {});
    const loc = this.getSystem("localization");

    GameState.current.battleInProgress = true;
    // Make sure player starts battle 'alive' for consistent checks
    if(GameState.current.player) GameState.current.player.isAlive = true;

    GameState.current.enemies = enemies.map((enemy) => ({
      ...enemy,
      stats: { ...enemy.stats },
      maxStats: { ...enemy.maxStats },
      isAlive: true,
      statusEffects: [], // Initialize status effects array
    }));

    this.log(`A battle begins! Enemies: ${enemies.map(e => e.name).join(", ")}`);

    this.calculateTurnOrder();

    this.processTurn();
  }

  calculateTurnOrder() {
    const player = { ...GameState.current.player, id: 'player', isPlayer: true };
    const enemies = GameState.current.enemies.map((e, i) => ({ ...e, id: `${e.name}_${i}`, isPlayer: false }));

    GameState.current.turnOrder = [...enemies, player]
      .sort((a, b) => b.stats.spd - a.stats.spd)
      .map(unit => unit.id);

    GameState.current.currentTurnIndex = 0;
  }

  getCurrentTurnUnit() {
    const id = GameState.current.turnOrder[GameState.current.currentTurnIndex];
    if (id === "player") {
      return GameState.current.player;
    }
    return GameState.current.enemies.find(e => `${e.name}_${GameState.current.enemies.indexOf(e)}` === id);
  }
    
    isPlayerTurn() {
        if (!GameState.current.battleInProgress) return false;
        const id = GameState.current.turnOrder[GameState.current.currentTurnIndex];
        return id === 'player';
    }

  playerAttack(targetIndex = 0) {
    if (!this.isPlayerTurn()) {
      this.log("It's not your turn!");
      return;
    }
    const target = GameState.current.enemies[targetIndex];
    if (!target || !target.isAlive) {
      this.log("Invalid target!");
      return;
    }
    const dmg = this.calculateDamage(GameState.current.player, target);
    target.stats.hp = Math.max(0, target.stats.hp - dmg);
    this.log(`You attack ${target.name} for ${dmg} damage!`);

    if (target.stats.hp <= 0) {
      this.killUnit(target);
    }
    this.nextTurn();
  }

  playerDefend() {
    if (!this.isPlayerTurn()) {
      this.log("It's not your turn!");
      return;
    }
    this.log("You take a defensive stance!");
    GameState.current.player.defending = true;
    this.nextTurn();
  }

  playerSkill(targetIndex = 0) {
    if (!this.isPlayerTurn()) {
      this.log("It's not your turn!");
      return;
    }
    const player = GameState.current.player;
    const skillId = player.abilities[0];
    const skillData = GameConfig.ABILITIES[skillId];
    const loc = this.getSystem("localization");

    if (!skillData) {
        this.log("Skill not found!");
        return;
    }

    if (!GameState.spendResource(skillData.cost)) {
        const resourceName = loc.get(`${player.resource.name.toLowerCase()}Resource`);
        this.log(loc.get('insufficientResource').replace('{resourceName}', resourceName));
        return;
    }
    
    const skillName = loc.get(`skill_${skillId}_name`);
    this.log(loc.get('combat_use_skill').replace('{character}', player.name).replace('{skill}', skillName));

    const targets = skillData.target === 'all' 
        ? GameState.current.enemies.filter(e => e.isAlive)
        : [GameState.current.enemies[targetIndex]].filter(e => e && e.isAlive);

    if (targets.length === 0) {
        this.log("No valid targets!");
        this.nextTurn();
        return;
    }
        
    targets.forEach(target => {
        // Apply damage
        if (skillData.damageMultiplier) {
            const dmg = this.calculateDamage(player, target, skillData.damageMultiplier);
            target.stats.hp = Math.max(0, target.stats.hp - dmg);
            this.log(`${player.name}'s ${skillName} hits ${target.name} for ${dmg} damage!`);
            if (target.stats.hp <= 0) {
                this.killUnit(target);
            }
        }

        // Apply status effect
        if (skillData.effect && target.isAlive) {
            // Check if the effect from the same source already exists
            const existingEffectIndex = target.statusEffects.findIndex(
                e => e.type === skillData.effect.type && e.source === player.id
            );

            if (existingEffectIndex > -1) {
                // Refresh duration of existing effect
                target.statusEffects[existingEffectIndex].duration = skillData.effect.duration;
                this.log(`${target.name}'s ${skillData.effect.type} duration was refreshed.`);
            } else {
                // Apply new effect
                target.statusEffects.push({ ...skillData.effect, source: player.id });
                if(skillData.effect.type === 'poison') {
                    this.log(`${target.name} is poisoned!`);
                } else if (skillData.effect.type === 'weaken') {
                    this.log(loc.get('combat_weaken_applied').replace('{target}', target.name));
                }
            }
        }
    });

    this.nextTurn();
  }

  playerFlee() {
    if (Math.random() < GameConfig.COMBAT.fleeChance) {
      this.log("You successfully escaped from battle!");
      this.endBattle(false);
    } else {
      this.log("You couldn't escape!");
      this.nextTurn();
    }
  }

  enemyAttack(enemy) {
    const player = GameState.current.player;
    let dmg = this.calculateDamage(enemy, player);
    
    if (player.defending) {
      dmg = Math.floor(dmg * 0.5);
      this.log("Your defensive stance reduces the damage!");
      player.defending = false;
    }
    
    player.stats.hp = Math.max(0, player.stats.hp - dmg);
    this.log(`${enemy.name} attacks you for ${dmg} damage!`);

    if (player.stats.hp <= 0) {
      this.killUnit(player);
    }
  }
    
  processTurn() {
    if (!GameState.current.battleInProgress) return;

    const unitId = GameState.current.turnOrder[GameState.current.currentTurnIndex];
    const isPlayer = unitId === 'player';
    const unit = isPlayer ? GameState.current.player : GameState.current.enemies.find(e => `${e.name}_${GameState.current.enemies.indexOf(e)}` === unitId);

    if (!unit || !unit.isAlive) {
        this.nextTurn();
        return;
    }

    // Process status effects at the start of the turn
    this.processStatusEffects(unit);
    
    // Check if status effects killed the unit
    if (!unit.isAlive) {
        this.nextTurn();
        return;
    }
    
    if (isPlayer) {
        // Player's turn is handled by UI events
        this.log(`It's your turn!`);
        GameState.current.player.defending = false; // Defend only lasts for one enemy attack
        this.updateCallback();
    } else {
        // Enemy AI
        setTimeout(() => {
            if(unit.isAlive && GameState.current.battleInProgress) {
                this.enemyAttack(unit);
            }
            this.nextTurn();
        }, 800);
    }
  }

  processStatusEffects(unit) {
      if (!unit.statusEffects) unit.statusEffects = [];
      const remainingEffects = [];
      const loc = this.getSystem("localization");

      unit.statusEffects.forEach(effect => {
          // Apply DoT damage
          if (effect.type === 'poison') {
              const poisonDmg = effect.damage;
              unit.stats.hp = Math.max(0, unit.stats.hp - poisonDmg);
              this.log(loc.get('combat_poison_damage').replace('{target}', unit.name).replace('{damage}', poisonDmg));
              if (unit.stats.hp <= 0) {
                  this.killUnit(unit);
              }
          }
          
          // Decrement duration
          effect.duration--;
          if (effect.duration > 0) {
              remainingEffects.push(effect);
          } else {
              this.log(loc.get('combat_status_wore_off').replace('{character}', unit.name).replace('{effect}', effect.type));
          }
      });
      unit.statusEffects = remainingEffects;
  }

  nextTurn() {
    if (!GameState.current.battleInProgress) return;

    this.checkBattleEnd();
    if (!GameState.current.battleInProgress) return;

    GameState.current.currentTurnIndex = (GameState.current.currentTurnIndex + 1) % GameState.current.turnOrder.length;
    
    // This is a safeguard against an empty turn order.
    if (GameState.current.turnOrder.length > 0) {
        this.processTurn();
    }
  }

  calculateDamage(attacker, defender, multiplier = 1.0) {
      // Apply stat modifications from status effects
      let attackerAtk = attacker.stats.atk;
      attacker.statusEffects?.forEach(effect => {
          if (effect.type === 'weaken' && effect.stat === 'atk') {
              attackerAtk *= effect.amount;
          }
      });

    let dmg = attackerAtk - defender.stats.def;
    if (dmg < 1) dmg = 1;
    dmg = Math.floor(dmg * multiplier);

    if (Math.random() * 100 < attacker.stats.crit) {
      dmg = Math.floor(dmg * GameConfig.COMBAT.baseCritMultiplier);
      this.log(`Critical hit!`);
    }
    return Math.max(1, dmg);
  }

  killUnit(unit) {
      // Set the unit's isAlive flag to false
      unit.isAlive = false;

      if (unit.id === 'player') {
          this.log(`You have been defeated...`);
      } else {
          this.log(`${unit.name} is defeated!`);
          
          // The checkBattleEnd function will handle removing from turn order now
          // This simplifies logic and prevents race conditions with turn index
      }
      this.updateCallback();
  }
    
  checkBattleEnd() {
    const allEnemiesDead = GameState.current.enemies.every(e => !e.isAlive);
    const playerDead = GameState.current.player.stats.hp <= 0;

    if (allEnemiesDead) {
      this.log(`Victory! You defeated all enemies.`);
      const goldReward = 10 + GameState.current.currentFloor * 5;
      const xpReward = 25 + GameState.current.currentFloor * 10;
      GameState.addGold(goldReward);
      GameState.addExperience(xpReward);
      this.log(`You gained ${goldReward} gold and ${xpReward} XP!`);
      this.endBattle(true);
    } else if (playerDead) {
      this.endBattle(false);
    }
  }
    
  endBattle(victory) {
    if (!GameState.current.battleInProgress) return; // Prevent double execution
    GameState.current.battleInProgress = false;
    // Clear status effects from player
    if(GameState.current.player) {
        GameState.current.player.statusEffects = [];
        GameState.current.player.defending = false;
    }
    GameState.current.onBattleEnd?.(victory);
  }

  log(msg) {
    if (this.logCallback) {
      this.logCallback(msg);
    }
    console.log(msg);
  }
}