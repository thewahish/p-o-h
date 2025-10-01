// filename: src/systems/break-system.js

import { GameState } from '../core/state.js';
import Logger from '../core/logger.js';
import { getEnemyElements, getToughnessDamage, BreakEffects } from '../constants/elements.js';

/**
 * Break/Weakness system for strategic combat
 */
export class BreakSystem {

    /**
     * Initialize enemy with toughness (break bar)
     */
    static initializeEnemyBreakData(enemy, floor = 1) {
        const enemyType = enemy.type || 'goblin';
        const elementalData = getEnemyElements(enemyType);

        // Calculate toughness based on floor
        const baseToughness = elementalData.baseToughness || 60;
        const floorBonus = (floor - 1) * 10;
        const maxToughness = baseToughness + floorBonus;

        enemy.breakData = {
            maxToughness: maxToughness,
            currentToughness: maxToughness,
            weaknesses: elementalData.weaknesses || [],
            resistances: elementalData.resistances || [],
            isBroken: false,
            brokenTurnsRemaining: 0,
            breakEffects: []
        };

        Logger.log(`Enemy ${enemy.type} initialized with toughness: ${maxToughness}, weaknesses: ${enemy.breakData.weaknesses.join(', ')}`, 'COMBAT');

        return enemy;
    }

    /**
     * Deal toughness damage and check for break
     */
    static dealToughnessDamage(enemy, element, onLog) {
        if (!enemy.breakData) {
            this.initializeEnemyBreakData(enemy, GameState.current.currentFloor);
        }

        const breakData = enemy.breakData;

        // Skip if already broken
        if (breakData.isBroken) {
            return { broken: false, toughnessDamage: 0 };
        }

        // Calculate toughness damage
        const toughnessDamage = getToughnessDamage(
            element,
            breakData.weaknesses,
            breakData.resistances
        );

        const oldToughness = breakData.currentToughness;
        breakData.currentToughness = Math.max(0, breakData.currentToughness - toughnessDamage);

        Logger.log(`Toughness damage: ${toughnessDamage} (${oldToughness} → ${breakData.currentToughness})`, 'COMBAT');

        // Check for break
        if (breakData.currentToughness === 0 && oldToughness > 0) {
            return this.breakEnemy(enemy, element, onLog);
        }

        return { broken: false, toughnessDamage };
    }

    /**
     * Break the enemy (toughness reaches 0)
     */
    static breakEnemy(enemy, breakElement, onLog) {
        const breakData = enemy.breakData;

        breakData.isBroken = true;
        breakData.brokenTurnsRemaining = 1; // Stunned for 1 turn

        const breakEffect = BreakEffects[breakElement] || BreakEffects.physical;
        const enemyName = enemy.nameKey || enemy.type;

        // Apply break damage
        let breakDamage = breakEffect.damage || 0;

        if (breakEffect.effect === 'instant') {
            // Instant damage
            enemy.stats.hp = Math.max(0, enemy.stats.hp - breakDamage);
            if (onLog) {
                onLog(`⚠️ ${enemyName.toUpperCase()} BROKEN! 💥 ${breakEffect.name.en}: ${breakDamage} damage!`);
            }
            Logger.log(`Break: ${enemyName} broken by ${breakElement}! Instant damage: ${breakDamage}`, 'COMBAT');

        } else if (breakEffect.effect === 'burn' || breakEffect.effect === 'poison') {
            // DoT effect
            enemy.statusEffects = enemy.statusEffects || [];
            enemy.statusEffects.push({
                type: breakEffect.effect,
                damage: Math.floor(breakEffect.damage / breakEffect.duration),
                duration: breakEffect.duration,
                icon: breakEffect.effect === 'burn' ? '🔥' : '☠️'
            });

            if (onLog) {
                onLog(`⚠️ ${enemyName.toUpperCase()} BROKEN! 💥 ${breakEffect.name.en}: ${breakEffect.description.en}!`);
            }
            Logger.log(`Break: ${enemyName} broken by ${breakElement}! ${breakEffect.effect} applied`, 'COMBAT');

        } else if (breakEffect.effect === 'freeze') {
            // Freeze + damage
            enemy.stats.hp = Math.max(0, enemy.stats.hp - breakDamage);
            breakData.brokenTurnsRemaining = 2; // Freeze extends stun

            if (onLog) {
                onLog(`⚠️ ${enemyName.toUpperCase()} BROKEN! ❄️ Frozen solid! ${breakDamage} damage!`);
            }
            Logger.log(`Break: ${enemyName} frozen! Stunned for 2 turns`, 'COMBAT');

        } else if (breakEffect.effect === 'defense_down') {
            // Defense debuff
            enemy.statusEffects = enemy.statusEffects || [];
            enemy.statusEffects.push({
                type: 'defense_down',
                amount: breakEffect.debuff,
                duration: breakEffect.duration,
                icon: '🛡️💔'
            });

            if (onLog) {
                onLog(`⚠️ ${enemyName.toUpperCase()} BROKEN! 🌑 ${breakEffect.description.en}!`);
            }
            Logger.log(`Break: ${enemyName} defense reduced by ${breakEffect.debuff}`, 'COMBAT');
        }

        // Additional break message
        if (onLog) {
            onLog(`💥 Enemy STUNNED! Takes 50% bonus damage this turn!`);
        }

        return {
            broken: true,
            toughnessDamage: enemy.breakData.maxToughness,
            breakElement: breakElement,
            breakEffect: breakEffect
        };
    }

    /**
     * Recover enemy from broken state
     */
    static recoverFromBreak(enemy, onLog) {
        if (!enemy.breakData || !enemy.breakData.isBroken) return;

        enemy.breakData.brokenTurnsRemaining--;

        if (enemy.breakData.brokenTurnsRemaining <= 0) {
            enemy.breakData.isBroken = false;
            enemy.breakData.brokenTurnsRemaining = 0;

            // Recover 50% toughness
            enemy.breakData.currentToughness = Math.floor(enemy.breakData.maxToughness * 0.5);

            const enemyName = enemy.nameKey || enemy.type;
            if (onLog) {
                onLog(`🔄 ${enemyName} recovered from break! Toughness restored to ${enemy.breakData.currentToughness}`);
            }
            Logger.log(`${enemyName} recovered from break`, 'COMBAT');
        }
    }

    /**
     * Check if enemy is broken (for damage bonus)
     */
    static isBroken(enemy) {
        return enemy.breakData && enemy.breakData.isBroken;
    }

    /**
     * Get broken damage multiplier
     */
    static getBrokenMultiplier(enemy) {
        return this.isBroken(enemy) ? 1.5 : 1.0; // 50% bonus damage
    }

    /**
     * Process break-related status effects at turn start
     */
    static processBreakEffects(enemy, onLog) {
        if (!enemy.breakData) return;

        // Check if enemy should recover from break
        if (enemy.breakData.isBroken) {
            this.recoverFromBreak(enemy, onLog);
        }
    }

    /**
     * Check if enemy should skip turn due to being broken
     */
    static shouldSkipTurn(enemy) {
        return enemy.breakData && enemy.breakData.isBroken && enemy.breakData.brokenTurnsRemaining > 0;
    }
}
