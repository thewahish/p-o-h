// filename: src/constants/balanced-characters.js

/**
 * Balanced character configurations with improved HP pools, resource management, and growth rates
 */
export const Characters = {
    WARRIOR: {
        id: 'warrior',
        nameKey: 'characters.warrior.name',
        resourceKey: 'resources.vigor',
        resourceIcon: '🟣',
        roleKey: 'characters.warrior.role',
        descriptionKey: 'characters.warrior.description',
        traits: ['characters.warrior.traits.highDefense', 'characters.warrior.traits.resolute', 'characters.warrior.traits.areaStrikes'],
        baseStats: {
            hp: 115, // Increased from 100 for better survivability
            resource: 55, // Increased from 50 for more ability usage
            atk: 13, // Increased from 12 for better damage
            def: 11, // Increased from 10 for better defense
            spd: 6,
            crit: 12 // Increased from 10 for better burst
        },
        growthRates: { 
            hp: 6, // Higher HP growth
            atk: 1.2, 
            def: 1.8, // Strong defensive growth
            spd: 0.4, 
            crit: 0.2 
        },
        abilities: ['shield_bash'],
        // Character-specific progression path
        progressionPath: 'defensive_tank',
        preferredEnemyTypes: ['brute', 'physical'],
        bossScalingModifier: 1.0,
        uniqueRewards: ['heavy_armor', 'shields'],
    },
    SORCERESS: {
        id: 'sorceress',
        nameKey: 'characters.sorceress.name',
        resourceKey: 'resources.mana',
        resourceIcon: '🔵',
        roleKey: 'characters.sorceress.role',
        descriptionKey: 'characters.sorceress.description',
        traits: ['characters.sorceress.traits.elementalMagic', 'characters.sorceress.traits.spellMastery', 'characters.sorceress.traits.ancientKnowledge'],
        baseStats: {
            hp: 95, // Increased from 80 for better survivability
            resource: 80, // Increased from 70 for more spell casts
            atk: 15, // Increased from 14 for better damage
            def: 7, // Increased from 6 for better defense
            spd: 7,
            crit: 14 // Increased from 12 for better burst
        },
        growthRates: { 
            hp: 4, // Better HP growth
            atk: 1.4, // Strong magical growth
            def: 0.6, 
            spd: 0.6, 
            crit: 0.4 
        },
        abilities: ['fireball'],
        // Character-specific progression path
        progressionPath: 'elemental_mage',
        preferredEnemyTypes: ['magical', 'undead'],
        bossScalingModifier: 1.0,
        uniqueRewards: ['staves', 'mana_crystals'],
    },
    ROGUE: {
        id: 'rogue',
        nameKey: 'characters.rogue.name',
        resourceKey: 'resources.energy',
        resourceIcon: '🟢',
        roleKey: 'characters.rogue.role',
        descriptionKey: 'characters.rogue.description',
        traits: ['characters.rogue.traits.berserkerRage', 'characters.rogue.traits.rawStrength', 'characters.rogue.traits.intimidating'],
        baseStats: {
            hp: 90,
            resource: 60,
            atk: 13, // Reduced from 15 for balance
            def: 7,
            spd: 9, // Reduced from 10 for balance
            crit: 14 // Reduced from 18 for balance
        },
        growthRates: { 
            hp: 5, // Good HP growth
            atk: 1.5, // Excellent attack growth
            def: 0.9, 
            spd: 0.8, // Good speed growth
            crit: 0.6 // Excellent crit growth
        },
        abilities: ['venom_strike'],
        // Character-specific progression path
        progressionPath: 'assassin_berserker',
        preferredEnemyTypes: ['fast', 'elite'],
        bossScalingModifier: 1.0,
        uniqueRewards: ['daggers', 'poisons'],
    }
};