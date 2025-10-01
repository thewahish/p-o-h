// filename: src/systems/abilities.js

import { GameState } from '../core/state.js';
import { GameConfig } from '../constants/config.js';
import { Characters } from '../constants/characters.js';
import Logger from '../core/logger.js';

/**
 * Ability system - handles unlocking and managing player abilities
 */
export class AbilitySystem {

    /**
     * Get available abilities for current player based on level
     * @returns {Array} Array of ability keys available to player
     */
    static getAvailableAbilities() {
        const player = GameState.current.player;
        const characterId = GameState.current.characterId;

        if (!characterId) {
            Logger.log('No character ID set', 'ERROR');
            return [];
        }

        // Find character config
        const character = Object.values(Characters).find(c => c.id === characterId);
        if (!character) {
            Logger.log(`Invalid character ID: ${characterId}`, 'ERROR');
            return [];
        }

        const characterAbilities = character.abilities || [];
        const playerLevel = player.level || 1;

        // Filter abilities based on player level
        const available = characterAbilities.filter(abilityKey => {
            const abilityConfig = GameConfig.ABILITIES[abilityKey];
            if (!abilityConfig) {
                Logger.log(`Ability not found in config: ${abilityKey}`, 'ERROR');
                return false;
            }

            const unlockLevel = abilityConfig.unlockLevel || 1;
            return playerLevel >= unlockLevel;
        });

        Logger.log(`[ABILITIES] Player level ${playerLevel}, available: ${available.length}`, 'SYSTEM');
        return available;
    }

    /**
     * Get ability details by key
     * @param {string} abilityKey
     * @returns {Object} Ability configuration
     */
    static getAbility(abilityKey) {
        return GameConfig.ABILITIES[abilityKey] || null;
    }

    /**
     * Check if ability is on cooldown
     * @param {string} abilityKey
     * @returns {number} Turns remaining on cooldown (0 if ready)
     */
    static getCooldownRemaining(abilityKey) {
        if (!GameState.current.abilityCooldowns) {
            GameState.current.abilityCooldowns = {};
        }

        return GameState.current.abilityCooldowns[abilityKey] || 0;
    }

    /**
     * Set ability on cooldown
     * @param {string} abilityKey
     * @param {number} turns
     */
    static setCooldown(abilityKey, turns) {
        if (!GameState.current.abilityCooldowns) {
            GameState.current.abilityCooldowns = {};
        }

        GameState.current.abilityCooldowns[abilityKey] = turns;
        Logger.log(`[ABILITIES] ${abilityKey} on cooldown for ${turns} turns`, 'SYSTEM');
        GameState._notify();
    }

    /**
     * Reduce all cooldowns by 1 turn (call at start of player turn)
     */
    static tickCooldowns() {
        if (!GameState.current.abilityCooldowns) {
            GameState.current.abilityCooldowns = {};
        }

        Object.keys(GameState.current.abilityCooldowns).forEach(key => {
            if (GameState.current.abilityCooldowns[key] > 0) {
                GameState.current.abilityCooldowns[key]--;
                Logger.log(`[ABILITIES] ${key} cooldown: ${GameState.current.abilityCooldowns[key] + 1} → ${GameState.current.abilityCooldowns[key]}`, 'SYSTEM');
            }
        });

        GameState._notify();
    }

    /**
     * Check if ability is unlocked at current level
     * @param {string} abilityKey
     * @returns {boolean}
     */
    static isUnlocked(abilityKey) {
        const available = this.getAvailableAbilities();
        return available.includes(abilityKey);
    }

    /**
     * Get next ability to unlock and level required
     * @returns {Object|null} { abilityKey, ability, level } or null if all unlocked
     */
    static getNextUnlock() {
        const player = GameState.current.player;
        const characterId = GameState.current.characterId;
        const playerLevel = player.level || 1;

        const character = Object.values(Characters).find(c => c.id === characterId);
        if (!character) return null;

        const allAbilities = character.abilities || [];

        // Find next locked ability
        for (const abilityKey of allAbilities) {
            const ability = GameConfig.ABILITIES[abilityKey];
            if (ability && ability.unlockLevel > playerLevel) {
                return {
                    abilityKey,
                    ability,
                    level: ability.unlockLevel
                };
            }
        }

        return null; // All unlocked
    }

    /**
     * Check if player just unlocked new abilities (after level up)
     * @param {number} newLevel
     * @returns {Array} Array of newly unlocked ability keys
     */
    static checkNewUnlocks(newLevel) {
        const characterId = GameState.current.characterId;
        const character = Object.values(Characters).find(c => c.id === characterId);
        if (!character) return [];

        const newlyUnlocked = [];
        const allAbilities = character.abilities || [];

        for (const abilityKey of allAbilities) {
            const ability = GameConfig.ABILITIES[abilityKey];
            if (ability && ability.unlockLevel === newLevel) {
                newlyUnlocked.push(abilityKey);
                Logger.log(`[ABILITIES] ✨ NEW ABILITY UNLOCKED: ${abilityKey} at level ${newLevel}`, 'SYSTEM');
            }
        }

        return newlyUnlocked;
    }

    /**
     * Initialize ability system for new game
     */
    static initialize() {
        GameState.current.abilityCooldowns = {};
        Logger.log('[ABILITIES] System initialized', 'SYSTEM');
        GameState._notify();
    }

    /**
     * Clear all cooldowns (e.g., on battle end)
     */
    static clearCooldowns() {
        GameState.current.abilityCooldowns = {};
        Logger.log('[ABILITIES] All cooldowns cleared', 'SYSTEM');
        GameState._notify();
    }

    /**
     * Get all abilities for character (including locked ones) for UI display
     * @returns {Array} Array of { key, ability, unlocked, cooldown }
     */
    static getAllAbilitiesForDisplay() {
        const player = GameState.current.player;
        const characterId = GameState.current.characterId;
        const playerLevel = player.level || 1;

        const character = Object.values(Characters).find(c => c.id === characterId);
        if (!character) return [];

        const allAbilities = character.abilities || [];

        return allAbilities.map(abilityKey => {
            const ability = GameConfig.ABILITIES[abilityKey];
            const unlocked = playerLevel >= (ability?.unlockLevel || 1);
            const cooldown = this.getCooldownRemaining(abilityKey);

            return {
                key: abilityKey,
                ability,
                unlocked,
                cooldown
            };
        });
    }
}
