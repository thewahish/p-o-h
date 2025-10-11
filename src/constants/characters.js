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
            hp: 100, // Balanced survivability 
            resource: 50, // Vigor for Shield Bash usage
            atk: 12, // Solid damage
            def: 10, // Strong defense
            spd: 6,
            crit: 10 // Moderate burst
        },
        growthRates: { 
            hp: 6, // Higher HP growth
            atk: 1.2, 
            def: 1.8, // Strong defensive growth
            spd: 0.4, 
            crit: 0.2 
        },
        abilities: [
            'power_strike',      // Level 1
            'defensive_stance',  // Level 1
            'shield_bash',       // Level 3
            'battle_cry',        // Level 6
            'whirlwind_attack',  // Level 9
            'iron_will',         // Level 12
            'execute',           // Level 15
            'last_stand'         // Level 18
        ],
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
            hp: 80, // Balanced survivability
            resource: 70, // Mana for multiple Fireball casts
            atk: 14, // Strong magical damage
            def: 6, // Light defense
            spd: 7,
            crit: 12 // Good burst potential
        },
        growthRates: { 
            hp: 4, // Better HP growth
            atk: 1.4, // Strong magical growth
            def: 0.6, 
            spd: 0.6, 
            crit: 0.4 
        },
        abilities: [
            'magic_missile',     // Level 1
            'mana_shield',       // Level 1
            'fireball',          // Level 3
            'ice_shard',         // Level 6
            'lightning_bolt',    // Level 9
            'arcane_intellect',  // Level 12
            'meteor',            // Level 15
            'time_warp'          // Level 18
        ],
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
            atk: 15, // High damage potential
            def: 7,
            spd: 10, // Fastest character
            crit: 18 // Excellent critical hit chance
        },
        growthRates: { 
            hp: 5, // Good HP growth
            atk: 1.5, // Excellent attack growth
            def: 0.9, 
            spd: 0.8, // Good speed growth
            crit: 0.6 // Excellent crit growth
        },
        abilities: [
            'quick_strike',      // Level 1
            'evasion',           // Level 1
            'venom_strike',      // Level 3
            'shadow_step',       // Level 6
            'fan_of_knives',     // Level 9
            'deadly_precision',  // Level 12
            'backstab',          // Level 15
            'death_mark'         // Level 18
        ],
        // Character-specific progression path
        progressionPath: 'assassin_berserker',
        preferredEnemyTypes: ['fast', 'elite'],
        bossScalingModifier: 1.0,
        uniqueRewards: ['daggers', 'poisons'],
    }
};