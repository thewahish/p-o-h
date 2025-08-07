// filename: src/systems/buffs.js

import { GameState } from '../core/state.js';
import { GameConfig } from '../constants/config.js';
import Logger from '../core/logger.js';
import { t } from '../core/localization.js';

/**
 * Hades-style buff selection system for combat
 */
export class BuffSystem {
    
    /**
     * Initialize buff system for new battle
     */
    static initializeBattle() {
        if (!GameState.current.battleBuffs) {
            GameState.current.battleBuffs = [];
        }
        
        // Clear any previous battle buffs
        GameState.current.battleBuffs = GameState.current.battleBuffs.filter(
            buff => buff.duration !== 'battle'
        );
    }

    /**
     * Generate random buff choices (Hades-style)
     * @param {number} count - Number of buffs to offer (default 3)
     * @returns {Array} Array of buff options
     */
    static generateBuffChoices(count = 3) {
        const allBuffs = Object.keys(GameConfig.BATTLE_BUFFS);
        const shuffled = allBuffs.sort(() => 0.5 - Math.random());
        
        return shuffled.slice(0, count).map(buffKey => ({
            key: buffKey,
            ...GameConfig.BATTLE_BUFFS[buffKey]
        }));
    }

    /**
     * Apply selected buff to player
     * @param {string} buffKey - The buff to apply
     * @returns {boolean} Success
     */
    static applyBuff(buffKey) {
        const buffConfig = GameConfig.BATTLE_BUFFS[buffKey];
        if (!buffConfig) {
            Logger.log(`Invalid buff: ${buffKey}`, 'ERROR');
            return false;
        }

        const player = GameState.current.player;
        const buff = {
            key: buffKey,
            ...buffConfig,
            appliedAt: Date.now()
        };

        // Apply the buff effect
        switch (buffConfig.effect.type) {
            case 'vampiric':
                // Special handling for vampiric - no immediate stat change
                break;
            case 'resource_boost':
                // Special handling for resource boost - affects regeneration
                break;
            case 'cost_reduction':
                // Special handling for cost reduction - affects ability costs
                break;
            case 'resource_save':
                // Special handling for resource save chance
                break;
            case 'regeneration':
                // Special handling for HP regeneration per turn
                break;
            default:
                // Standard stat modifications
                if (buffConfig.effect.stat && buffConfig.effect.multiplier) {
                    const currentValue = player.stats[buffConfig.effect.stat];
                    const buffedValue = Math.floor(currentValue * buffConfig.effect.multiplier);
                    player.stats[buffConfig.effect.stat] = buffedValue;
                } else if (buffConfig.effect.stat && buffConfig.effect.bonus) {
                    player.stats[buffConfig.effect.stat] += buffConfig.effect.bonus;
                }
        }

        // Add to active buffs
        if (!GameState.current.battleBuffs) {
            GameState.current.battleBuffs = [];
        }
        GameState.current.battleBuffs.push(buff);

        Logger.log(`Applied buff: ${buffKey}`, 'SYSTEM');
        GameState._notify();
        return true;
    }

    /**
     * Process buff effects during combat
     * @param {string} timing - 'turn_start', 'turn_end', 'damage_dealt', 'ability_used'
     * @param {Object} context - Additional context for the timing
     */
    static processBuffEffects(timing, context = {}) {
        if (!GameState.current.battleBuffs) return;

        const player = GameState.current.player;
        
        GameState.current.battleBuffs.forEach(buff => {
            const effect = buff.effect;
            
            switch (timing) {
                case 'turn_start':
                    if (effect.type === 'regeneration') {
                        const healAmount = Math.min(effect.amount, player.maxStats.hp - player.stats.hp);
                        player.stats.hp += healAmount;
                        if (healAmount > 0 && context.onLog) {
                            context.onLog(`${buff.icon} Second Wind: Healed ${healAmount} HP`);
                        }
                    }
                    break;

                case 'damage_dealt':
                    if (effect.type === 'vampiric' && context.damage) {
                        const healAmount = Math.floor(context.damage * (effect.percentage / 100));
                        const actualHeal = Math.min(healAmount, player.maxStats.hp - player.stats.hp);
                        player.stats.hp += actualHeal;
                        if (actualHeal > 0 && context.onLog) {
                            context.onLog(`${buff.icon} Vampiric: Healed ${actualHeal} HP`);
                        }
                    }
                    break;

                case 'ability_used':
                    if (effect.type === 'resource_save' && context.cost) {
                        if (Math.random() < (effect.chance / 100)) {
                            // Refund the resource cost
                            player.resource.current += context.cost;
                            if (context.onLog) {
                                context.onLog(`${buff.icon} Lucky Strike: Resource saved!`);
                            }
                            return { resourceSaved: true };
                        }
                    }
                    break;
            }
        });

        GameState._notify();
    }

    /**
     * Calculate modified ability cost with buffs
     * @param {number} baseCost 
     * @returns {number} Modified cost
     */
    static getModifiedAbilityCost(baseCost) {
        if (!GameState.current.battleBuffs) return baseCost;

        let modifiedCost = baseCost;
        
        GameState.current.battleBuffs.forEach(buff => {
            if (buff.effect.type === 'cost_reduction') {
                const reduction = buff.effect.percentage / 100;
                modifiedCost = Math.floor(modifiedCost * (1 - reduction));
            }
        });

        return Math.max(1, modifiedCost); // Minimum cost of 1
    }

    /**
     * Calculate modified resource regeneration with buffs
     * @param {number} baseRegen 
     * @returns {number} Modified regeneration
     */
    static getModifiedResourceRegen(baseRegen) {
        if (!GameState.current.battleBuffs) return baseRegen;

        let modifiedRegen = baseRegen;
        
        GameState.current.battleBuffs.forEach(buff => {
            if (buff.effect.type === 'resource_boost') {
                modifiedRegen = Math.floor(modifiedRegen * buff.effect.multiplier);
            }
        });

        return modifiedRegen;
    }

    /**
     * Get active buffs for display
     * @returns {Array} Active buffs
     */
    static getActiveBuffs() {
        return GameState.current.battleBuffs || [];
    }

    /**
     * Clear all battle buffs (called at end of combat)
     */
    static clearBattleBuffs() {
        GameState.current.battleBuffs = GameState.current.battleBuffs?.filter(
            buff => buff.duration !== 'battle'
        ) || [];
        GameState._notify();
    }
}