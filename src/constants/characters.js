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
            hp: 100, // Increased from 70 for survivability
            resource: 50, // Increased from 35 for more ability usage
            atk: 12, 
            def: 10, // Increased defense
            spd: 6, 
            crit: 10 // Increased crit
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
            hp: 80, // Increased from 50 for better survivability
            resource: 70, // Increased from 50 for multiple casts
            atk: 14, // Higher attack for mage
            def: 6, 
            spd: 7, 
            crit: 12 
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
            hp: 90, // Increased from 60
            resource: 60, // Increased from 40
            atk: 15, // Highest attack
            def: 7, 
            spd: 10, // Highest speed
            crit: 18 // Highest crit
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