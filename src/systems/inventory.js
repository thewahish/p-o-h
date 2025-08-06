// filename: src/systems/inventory.js

import { GameConfig } from '../constants/config.js';
import { GameState } from '../core/state.js';
import Logger from '../core/logger.js';

export class InventorySystem {
    constructor({ getSystem }) {
        this.getSystem = getSystem;
    }

    init() {
        Logger.log('InventorySystem initialized.', 'SYSTEM');
    }

    // A simplified function to get a random rarity based on configured chances
    getRandomRarity() {
        const rand = Math.random() * 100;
        let cumulativeChance = 0;
        for (const rarity in GameConfig.RARITIES) {
            cumulativeChance += GameConfig.RARITIES[rarity].chance;
            if (rand < cumulativeChance) {
                return { id: rarity, ...GameConfig.RARITIES[rarity] };
            }
        }
        return { id: 'common', ...GameConfig.RARITIES.common }; // Fallback
    }

    generateItem(floor = 1) {
        const itemTypes = Object.keys(GameConfig.ITEM_TYPES).filter(type => !GameConfig.ITEM_TYPES[type].consumable);
        const randomTypeKey = itemTypes[Math.floor(Math.random() * itemTypes.length)];
        const itemTemplate = GameConfig.ITEM_TYPES[randomTypeKey];
        const rarity = this.getRandomRarity();

        const newItem = {
            id: `item_${Date.now()}_${Math.random()}`,
            baseType: randomTypeKey,
            nameKey: `items.${randomTypeKey}`, // Use localization key
            slot: itemTemplate.slot,
            rarity: rarity.id,
            stats: { ...itemTemplate.baseStats },
        };

        // Scale stats by rarity and floor
        const scaleFactor = rarity.statMult + ((floor - 1) * 0.1);
        for (const stat in newItem.stats) {
            newItem.stats[stat] = Math.ceil(newItem.stats[stat] * scaleFactor);
        }
        
        // Add prefix/suffix for more variety (optional)
        if (Math.random() < 0.3) {
            const prefixIndex = Math.floor(Math.random() * GameConfig.ITEM_PREFIXES.length);
            const prefix = GameConfig.ITEM_PREFIXES[prefixIndex];
            // Store prefix key for localization - use index to determine key
            newItem.prefixKey = prefixIndex === 0 ? 'prefixes.sturdy' : 'prefixes.sharp';
            for(const stat in prefix.statMod) {
                newItem.stats[stat] = (newItem.stats[stat] || 0) + prefix.statMod[stat];
            }
        }

        // Calculate price
        newItem.price = (10 * rarity.statMult) + (floor * 5);
        newItem.price = Math.floor(newItem.price);

        Logger.log(`Generated item: ${newItem.nameKey} (Rarity: ${rarity.id})`, 'INVENTORY');
        return newItem;
    }

    generateItemsForShop(count = 3, floor = 1) {
        return Array.from({ length: count }, () => this.generateItem(floor));
    }
}