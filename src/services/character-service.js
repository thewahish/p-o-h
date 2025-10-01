// filename: src/services/character-service.js

/**
 * @fileoverview Character-specific encounter generation system
 * Handles character-specific enemy pools and encounter balancing
 */

import { Characters } from '../constants/characters.js';
import { EnemyDatabase, getFloorEnemies } from '../constants/enemies.js';
import Logger from '../core/logger.js';
import { GameConfig } from '../constants/config.js';

/**
 * Character service configuration
 */
const CHARACTER_SERVICE_CONFIG = {
    PREFERRED_TYPE_WEIGHT: 2.0,      // 2x chance for preferred enemy types
    NEUTRAL_TYPE_WEIGHT: 1.0,        // 1x chance for neutral enemy types
    MIN_PREFERRED_PERCENTAGE: 0.4,   // At least 40% preferred enemies per encounter
};

/**
 * Character-specific encounter generation service
 */
export class CharacterService {
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
            Logger.log(`CharacterService: Invalid character ID: ${characterId}`, 'ERROR');
            return false;
        }

        this.currentCharacterId = characterId;
        Logger.log(`CharacterService: Initialized for ${characterId}`, 'SYSTEM');
        return true;
    }

    /**
     * Get character's preferred enemy types
     * @returns {string[]} Array of preferred enemy type tags
     */
    getPreferredEnemyTypes() {
        if (!this.characterConfig) {
            Logger.log('CharacterService: Not initialized', 'ERROR');
            return [];
        }

        return this.characterConfig.preferredEnemyTypes || [];
    }

    /**
     * Check if enemy matches character's preferred types
     * @param {Object} enemyData - Enemy data from EnemyDatabase
     * @returns {boolean} True if enemy has any preferred type
     */
    isPreferredEnemy(enemyData) {
        if (!enemyData.types || !this.characterConfig) {
            return false;
        }

        const preferredTypes = this.getPreferredEnemyTypes();
        return enemyData.types.some(type => preferredTypes.includes(type));
    }

    /**
     * Calculate enemy weight based on character preferences
     * @param {Object} enemyData - Enemy data from EnemyDatabase
     * @returns {number} Weight multiplier for encounter selection
     */
    calculateEnemyWeight(enemyData) {
        if (this.isPreferredEnemy(enemyData)) {
            return CHARACTER_SERVICE_CONFIG.PREFERRED_TYPE_WEIGHT;
        }
        return CHARACTER_SERVICE_CONFIG.NEUTRAL_TYPE_WEIGHT;
    }

    /**
     * Generate character-specific enemy encounter pool
     * @param {number} floor - Current floor number
     * @returns {Object[]} Array of weighted enemy choices
     */
    generateEnemyPool(floor) {
        const baseEnemies = getFloorEnemies(floor);
        const weightedPool = [];

        baseEnemies.forEach(enemyId => {
            const enemyData = EnemyDatabase[enemyId];
            if (!enemyData) return;

            const weight = this.calculateEnemyWeight(enemyData);

            // Add enemy multiple times based on weight
            const count = Math.floor(weight * 10); // Convert weight to count
            for (let i = 0; i < count; i++) {
                weightedPool.push(enemyId);
            }
        });

        if (GameConfig.DEBUG_MODE) {
            Logger.log(`CharacterService: Generated pool for floor ${floor} with ${weightedPool.length} entries`, 'SYSTEM');
        }

        return weightedPool;
    }

    /**
     * Select random enemy from weighted pool
     * @param {string[]} pool - Weighted enemy pool
     * @returns {string} Selected enemy ID
     */
    selectFromPool(pool) {
        if (pool.length === 0) {
            Logger.log('CharacterService: Empty pool, using fallback', 'ERROR');
            return 'goblin'; // Fallback
        }

        const index = Math.floor(Math.random() * pool.length);
        return pool[index];
    }

    /**
     * Generate character-specific encounter
     * @param {number} floor - Current floor number
     * @param {number} count - Number of enemies to generate
     * @returns {string[]} Array of enemy IDs
     */
    generateEncounter(floor, count = 1) {
        if (!this.characterConfig) {
            Logger.log('CharacterService: Not initialized, using default encounters', 'ERROR');
            const baseEnemies = getFloorEnemies(floor);
            return Array(count).fill(baseEnemies[0]);
        }

        const pool = this.generateEnemyPool(floor);
        const encounter = [];

        for (let i = 0; i < count; i++) {
            const enemyId = this.selectFromPool(pool);
            encounter.push(enemyId);
        }

        // Log encounter details
        if (GameConfig.DEBUG_MODE) {
            const preferredCount = encounter.filter(id =>
                this.isPreferredEnemy(EnemyDatabase[id])
            ).length;
            const percentage = Math.round((preferredCount / count) * 100);
            Logger.log(
                `CharacterService: Generated encounter with ${preferredCount}/${count} (${percentage}%) preferred enemies`,
                'SYSTEM'
            );
        }

        return encounter;
    }

    /**
     * Get encounter statistics for debugging
     * @param {number} floor - Floor to analyze
     * @param {number} sampleSize - Number of encounters to generate
     * @returns {Object} Statistics object
     */
    getEncounterStats(floor, sampleSize = 100) {
        if (!this.characterConfig) {
            return { error: 'Service not initialized' };
        }

        const stats = {
            floor,
            character: this.currentCharacterId,
            preferredTypes: this.getPreferredEnemyTypes(),
            enemyCounts: {},
            totalPreferred: 0,
            totalNeutral: 0
        };

        // Generate sample encounters
        for (let i = 0; i < sampleSize; i++) {
            const encounter = this.generateEncounter(floor, 1);
            const enemyId = encounter[0];

            stats.enemyCounts[enemyId] = (stats.enemyCounts[enemyId] || 0) + 1;

            if (this.isPreferredEnemy(EnemyDatabase[enemyId])) {
                stats.totalPreferred++;
            } else {
                stats.totalNeutral++;
            }
        }

        stats.preferredPercentage = Math.round((stats.totalPreferred / sampleSize) * 100);

        return stats;
    }

    /**
     * Get character's boss scaling modifier
     * @returns {number} Boss scaling multiplier
     */
    getBossScalingModifier() {
        if (!this.characterConfig) {
            return 1.0;
        }
        return this.characterConfig.bossScalingModifier || 1.0;
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
     * Get character's progression path
     * @returns {string} Progression path identifier
     */
    getProgressionPath() {
        if (!this.characterConfig) {
            return 'default';
        }
        return this.characterConfig.progressionPath || 'default';
    }

    /**
     * Reset service state
     */
    reset() {
        this.currentCharacterId = null;
        this.characterConfig = null;
        Logger.log('CharacterService: Reset', 'SYSTEM');
    }
}

// Create singleton instance
const characterService = new CharacterService();

// Export singleton
export default characterService;

Logger.log('character-service.js: Module loaded.', 'SYSTEM');
