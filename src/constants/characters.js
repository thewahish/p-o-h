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
            hp: 100, // Keep original HP (balance via reduced potions instead)
            resource: 50, // Keep resource pool
            atk: 12, // Keep original ATK
            def: 10, // Keep defense
            spd: 6,
            crit: 10
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
            hp: 80, // Keep original HP (balance via reduced potions instead)
            resource: 70, // Keep resource
            atk: 14, // Keep original ATK
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
            hp: 90, // Keep original HP (balance via reduced potions instead)
            resource: 60, // Keep resource
            atk: 15, // Keep original ATK
            def: 7,
            spd: 10, // Keep speed
            crit: 18 // Keep crit
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