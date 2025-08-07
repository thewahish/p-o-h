// filename: src/systems/potions.js

import { GameState } from '../core/state.js';
import { GameConfig } from '../constants/config.js';
import Logger from '../core/logger.js';
import { t } from '../core/localization.js';

/**
 * Potion and consumables management system
 */
export class PotionSystem {
    
    /**
     * Initialize player's starting potions
     */
    static initializeStartingPotions() {
        if (!GameState.current.potions) {
            GameState.current.potions = {};
        }
        
        const startingPotions = GameConfig.INVENTORY.startingPotions || [];
        startingPotions.forEach(({ type, quantity }) => {
            GameState.current.potions[type] = (GameState.current.potions[type] || 0) + quantity;
        });
        
        Logger.log(`Initialized starting potions: ${JSON.stringify(GameState.current.potions)}`, 'SYSTEM');
        GameState._notify();
    }

    /**
     * Use a potion during combat
     * @param {string} potionType - The type of potion to use
     * @returns {boolean} - Whether the potion was successfully used
     */
    static usePotion(potionType) {
        if (!GameState.current.potions || !GameState.current.potions[potionType] || GameState.current.potions[potionType] <= 0) {
            Logger.log(`No ${potionType} available`, 'SYSTEM');
            return false;
        }

        const potionConfig = GameConfig.ITEM_TYPES[potionType];
        if (!potionConfig || !potionConfig.consumable) {
            Logger.log(`Invalid potion type: ${potionType}`, 'ERROR');
            return false;
        }

        const player = GameState.current.player;
        let effectMessage = '';

        switch (potionConfig.effect) {
            case 'heal_hp':
                const healAmount = Math.min(potionConfig.value, player.maxStats.hp - player.stats.hp);
                player.stats.hp += healAmount;
                effectMessage = `Healed ${healAmount} HP`;
                break;

            case 'restore_resource':
                const resourceAmount = Math.min(potionConfig.value, player.resource.max - player.resource.current);
                player.resource.current += resourceAmount;
                effectMessage = `Restored ${resourceAmount} ${t(player.resource.nameKey)}`;
                break;

            case 'full_heal':
                const hpHealed = player.maxStats.hp - player.stats.hp;
                const resourceRestored = player.resource.max - player.resource.current;
                player.stats.hp = player.maxStats.hp;
                player.resource.current = player.resource.max;
                effectMessage = `Fully healed (+${hpHealed} HP, +${resourceRestored} ${t(player.resource.nameKey)})`;
                break;

            default:
                Logger.log(`Unknown potion effect: ${potionConfig.effect}`, 'ERROR');
                return false;
        }

        // Consume the potion
        GameState.current.potions[potionType]--;
        Logger.log(`Used ${potionType}: ${effectMessage}`, 'SYSTEM');
        GameState._notify();
        
        return { success: true, message: effectMessage };
    }

    /**
     * Get available potions for UI display
     * @returns {Array} Array of available potions with their quantities
     */
    static getAvailablePotions() {
        if (!GameState.current.potions) return [];
        
        return Object.entries(GameState.current.potions)
            .filter(([type, quantity]) => quantity > 0)
            .map(([type, quantity]) => ({
                type,
                quantity,
                config: GameConfig.ITEM_TYPES[type],
                name: t(`items.${type}`) || GameConfig.ITEM_TYPES[type]?.name?.en || type
            }));
    }

    /**
     * Add potions to inventory (for rewards, shops, etc.)
     * @param {string} potionType 
     * @param {number} quantity 
     */
    static addPotion(potionType, quantity = 1) {
        if (!GameState.current.potions) {
            GameState.current.potions = {};
        }
        
        GameState.current.potions[potionType] = (GameState.current.potions[potionType] || 0) + quantity;
        Logger.log(`Added ${quantity}x ${potionType}`, 'SYSTEM');
        GameState._notify();
    }

    /**
     * Check if player has enough of a specific potion
     * @param {string} potionType 
     * @param {number} quantity 
     * @returns {boolean}
     */
    static hasPotion(potionType, quantity = 1) {
        return GameState.current.potions && 
               GameState.current.potions[potionType] && 
               GameState.current.potions[potionType] >= quantity;
    }
}