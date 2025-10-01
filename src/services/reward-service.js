// filename: src/services/reward-service.js

/**
 * @fileoverview Character-specific reward generation system
 * Handles character-specific loot tables and reward customization
 */

import { Characters } from '../constants/characters.js';
import { GameConfig } from '../constants/config.js';
import Logger from '../core/logger.js';

/**
 * Reward service configuration
 */
const REWARD_SERVICE_CONFIG = {
    UNIQUE_REWARD_CHANCE: 0.25,          // 25% chance for unique rewards
    PREFERRED_ITEM_WEIGHT: 2.5,          // 2.5x chance for character-preferred items
    RARITY_BOOST_CHANCE: 0.15,           // 15% chance to boost rarity by 1 tier
    GOLD_VARIANCE: 0.2,                  // ±20% gold variance
};

/**
 * Character-specific reward type mappings
 */
const REWARD_TYPE_ITEMS = {
    // Warrior rewards
    'heavy_armor': {
        slot: 'chest',
        baseStats: { def: 8, hp: 10 },
        nameKey: 'items.heavy_armor',
        icon: '🛡️'
    },
    'shields': {
        slot: 'weapon',
        baseStats: { def: 6, atk: 4 },
        nameKey: 'items.shield',
        icon: '🛡️'
    },

    // Sorceress rewards
    'staves': {
        slot: 'weapon',
        baseStats: { atk: 10, crit: 3 },
        nameKey: 'items.staff',
        icon: '🪄'
    },
    'mana_crystals': {
        slot: 'head',
        baseStats: { atk: 5, spd: 2 },
        nameKey: 'items.mana_crystal',
        icon: '💎'
    },

    // Rogue rewards
    'daggers': {
        slot: 'weapon',
        baseStats: { atk: 8, spd: 4, crit: 5 },
        nameKey: 'items.dagger',
        icon: '🗡️'
    },
    'poisons': {
        slot: null,
        consumable: true,
        nameKey: 'items.poison_vial',
        icon: '🧪',
        effect: 'poison',
        value: 12
    }
};

/**
 * Character-specific reward generation service
 */
export class RewardService {
    constructor() {
        this.currentCharacterId = null;
        this.characterConfig = null;
    }

    /**
     * Initialize service with character
     * @param {string} characterId - Character ID (warrior, sorceress, rogue)
     */
    initialize(characterId) {
        const characterKey = characterId.toUpperCase();
        this.characterConfig = Characters[characterKey];

        if (!this.characterConfig) {
            Logger.log(`RewardService: Invalid character ID: ${characterId}`, 'ERROR');
            return false;
        }

        this.currentCharacterId = characterId;
        Logger.log(`RewardService: Initialized for ${characterId}`, 'SYSTEM');
        return true;
    }

    /**
     * Get character's unique reward types
     * @returns {string[]} Array of unique reward type identifiers
     */
    getUniqueRewardTypes() {
        if (!this.characterConfig) {
            return [];
        }
        return this.characterConfig.uniqueRewards || [];
    }

    /**
     * Check if item type is preferred for character
     * @param {string} itemType - Item base type
     * @returns {boolean} True if preferred
     */
    isPreferredItemType(itemType) {
        const uniqueRewards = this.getUniqueRewardTypes();

        // Check if item type matches any unique reward types
        if (uniqueRewards.includes(itemType)) {
            return true;
        }

        // Check by slot for broader matching
        const itemConfig = REWARD_TYPE_ITEMS[itemType] || GameConfig.ITEM_TYPES[itemType];
        if (!itemConfig) return false;

        // Warrior prefers chest/shields
        if (this.currentCharacterId === 'warrior') {
            return itemConfig.slot === 'chest' || itemType.includes('shield');
        }

        // Sorceress prefers weapons (staves) and magical items
        if (this.currentCharacterId === 'sorceress') {
            return itemConfig.slot === 'weapon' || itemType.includes('staff') || itemType.includes('mana');
        }

        // Rogue prefers weapons (daggers) and speed items
        if (this.currentCharacterId === 'rogue') {
            return itemConfig.slot === 'weapon' || itemType.includes('dagger') || itemType.includes('poison');
        }

        return false;
    }

    /**
     * Get random rarity with character-specific boosts
     * @param {number} floor - Current floor for scaling
     * @returns {Object} Rarity object with id and config
     */
    getRandomRarity(floor = 1) {
        const rand = Math.random() * 100;
        let cumulativeChance = 0;

        // Floor-based rarity boost (higher floors = better loot)
        const floorBoost = Math.min(floor * 0.5, 15); // Max +15% boost

        for (const rarity in GameConfig.RARITIES) {
            const rarityConfig = GameConfig.RARITIES[rarity];
            let chance = rarityConfig.chance;

            // Boost rare+ items on higher floors
            if (rarity !== 'common' && rarity !== 'uncommon') {
                chance += floorBoost;
            }

            cumulativeChance += chance;
            if (rand < cumulativeChance) {
                return { id: rarity, ...rarityConfig };
            }
        }

        return { id: 'common', ...GameConfig.RARITIES.common };
    }

    /**
     * Boost rarity to next tier
     * @param {string} currentRarity - Current rarity ID
     * @returns {string} Boosted rarity ID
     */
    boostRarity(currentRarity) {
        const rarities = ['common', 'uncommon', 'rare', 'epic', 'mythic', 'legendary'];
        const currentIndex = rarities.indexOf(currentRarity);

        if (currentIndex === -1 || currentIndex >= rarities.length - 1) {
            return currentRarity;
        }

        return rarities[currentIndex + 1];
    }

    /**
     * Generate character-specific item
     * @param {number} floor - Current floor for scaling
     * @returns {Object} Generated item object
     */
    generateItem(floor = 1) {
        if (!this.characterConfig) {
            Logger.log('RewardService: Not initialized, using default generation', 'ERROR');
            return this._generateDefaultItem(floor);
        }

        const uniqueRewards = this.getUniqueRewardTypes();
        let itemBaseType = null;
        let itemTemplate = null;

        // 25% chance to generate unique reward for character
        if (Math.random() < REWARD_SERVICE_CONFIG.UNIQUE_REWARD_CHANCE && uniqueRewards.length > 0) {
            const randomUniqueType = uniqueRewards[Math.floor(Math.random() * uniqueRewards.length)];
            itemTemplate = REWARD_TYPE_ITEMS[randomUniqueType];
            itemBaseType = randomUniqueType;

            if (GameConfig.DEBUG_MODE) {
                Logger.log(`RewardService: Generated unique reward type: ${randomUniqueType}`, 'SYSTEM');
            }
        }

        // Fallback to weighted standard item
        if (!itemTemplate) {
            const allItemTypes = Object.keys(GameConfig.ITEM_TYPES).filter(
                type => !GameConfig.ITEM_TYPES[type].consumable
            );

            // Build weighted pool
            const weightedPool = [];
            allItemTypes.forEach(type => {
                const weight = this.isPreferredItemType(type)
                    ? REWARD_SERVICE_CONFIG.PREFERRED_ITEM_WEIGHT
                    : 1.0;
                const count = Math.floor(weight * 10);
                for (let i = 0; i < count; i++) {
                    weightedPool.push(type);
                }
            });

            itemBaseType = weightedPool[Math.floor(Math.random() * weightedPool.length)];
            itemTemplate = GameConfig.ITEM_TYPES[itemBaseType];
        }

        // Generate rarity
        let rarity = this.getRandomRarity(floor);

        // 15% chance to boost rarity for preferred items
        if (this.isPreferredItemType(itemBaseType) && Math.random() < REWARD_SERVICE_CONFIG.RARITY_BOOST_CHANCE) {
            const boostedRarityId = this.boostRarity(rarity.id);
            rarity = { id: boostedRarityId, ...GameConfig.RARITIES[boostedRarityId] };

            if (GameConfig.DEBUG_MODE) {
                Logger.log(`RewardService: Boosted rarity to ${boostedRarityId}`, 'SYSTEM');
            }
        }

        // Build item
        const newItem = {
            id: `item_${Date.now()}_${Math.random()}`,
            baseType: itemBaseType,
            nameKey: itemTemplate.nameKey || `items.${itemBaseType}`,
            slot: itemTemplate.slot,
            rarity: rarity.id,
            stats: { ...itemTemplate.baseStats },
        };

        // Scale stats by rarity and floor
        const scaleFactor = rarity.statMult + ((floor - 1) * 0.1);
        for (const stat in newItem.stats) {
            newItem.stats[stat] = Math.ceil(newItem.stats[stat] * scaleFactor);
        }

        // Add prefix/suffix for variety
        if (Math.random() < 0.3) {
            const prefixIndex = Math.floor(Math.random() * GameConfig.ITEM_PREFIXES.length);
            const prefix = GameConfig.ITEM_PREFIXES[prefixIndex];
            newItem.prefixKey = prefixIndex === 0 ? 'prefixes.sturdy' : 'prefixes.sharp';
            for (const stat in prefix.statMod) {
                newItem.stats[stat] = (newItem.stats[stat] || 0) + prefix.statMod[stat];
            }
        }

        // Calculate price
        newItem.price = (10 * rarity.statMult) + (floor * 5);
        newItem.price = Math.floor(newItem.price);

        Logger.log(`RewardService: Generated ${itemBaseType} (${rarity.id}) for ${this.currentCharacterId}`, 'SYSTEM');
        return newItem;
    }

    /**
     * Generate items for shop
     * @param {number} count - Number of items
     * @param {number} floor - Current floor
     * @returns {Object[]} Array of generated items
     */
    generateItemsForShop(count = 3, floor = 1) {
        return Array.from({ length: count }, () => this.generateItem(floor));
    }

    /**
     * Calculate character-specific gold reward
     * @param {number} baseGold - Base gold amount
     * @param {number} floor - Current floor
     * @returns {number} Modified gold amount
     */
    calculateGoldReward(baseGold, floor = 1) {
        // Apply variance
        const variance = 1 + (Math.random() * 2 - 1) * REWARD_SERVICE_CONFIG.GOLD_VARIANCE;
        const goldWithVariance = Math.floor(baseGold * variance);

        // Floor scaling (already applied in base, but add character flavor)
        return Math.max(1, goldWithVariance);
    }

    /**
     * Generate default item (fallback)
     * @param {number} floor - Current floor
     * @returns {Object} Generated item
     * @private
     */
    _generateDefaultItem(floor) {
        const itemTypes = Object.keys(GameConfig.ITEM_TYPES).filter(
            type => !GameConfig.ITEM_TYPES[type].consumable
        );
        const randomTypeKey = itemTypes[Math.floor(Math.random() * itemTypes.length)];
        const itemTemplate = GameConfig.ITEM_TYPES[randomTypeKey];
        const rarity = this.getRandomRarity(floor);

        const newItem = {
            id: `item_${Date.now()}_${Math.random()}`,
            baseType: randomTypeKey,
            nameKey: `items.${randomTypeKey}`,
            slot: itemTemplate.slot,
            rarity: rarity.id,
            stats: { ...itemTemplate.baseStats },
        };

        const scaleFactor = rarity.statMult + ((floor - 1) * 0.1);
        for (const stat in newItem.stats) {
            newItem.stats[stat] = Math.ceil(newItem.stats[stat] * scaleFactor);
        }

        newItem.price = (10 * rarity.statMult) + (floor * 5);
        newItem.price = Math.floor(newItem.price);

        return newItem;
    }

    /**
     * Reset service state
     */
    reset() {
        this.currentCharacterId = null;
        this.characterConfig = null;
        Logger.log('RewardService: Reset', 'SYSTEM');
    }
}

// Create singleton instance
const rewardService = new RewardService();

// Export singleton
export default rewardService;

Logger.log('reward-service.js: Module loaded.', 'SYSTEM');
