// filename: src/constants/characters.js
export const Characters = {
    WARRIOR: {
        id: 'warrior',
        nameKey: 'characters.warrior.name',
        resourceKey: 'resources.vigor',
        resourceIcon: '🟣',
        roleKey: 'characters.warrior.role',
        descriptionKey: 'characters.warrior.description',
        traits: ['characters.warrior.traits.highDefense', 'characters.warrior.traits.resolute', 'characters.warrior.traits.areaStrikes'],
        baseStats: { hp: 70, resource: 35, atk: 10, def: 8, spd: 5, crit: 8 },
        growthRates: { hp: 4, atk: 1, def: 1.5, spd: 0.3, crit: 0.1 },
        abilities: ['shield_bash'],
        // Character-specific progression path
        progressionPath: 'defensive_tank',
        preferredEnemyTypes: ['brute', 'physical'], // Faces more physical enemies
        bossScalingModifier: 1.0, // All characters face same boss difficulty
        uniqueRewards: ['heavy_armor', 'shields'], // Gets more defensive items
    },
    SORCERESS: {
        id: 'sorceress',
        nameKey: 'characters.sorceress.name',
        resourceKey: 'resources.mana',
        resourceIcon: '🔵',
        roleKey: 'characters.sorceress.role',
        descriptionKey: 'characters.sorceress.description',
        traits: ['characters.sorceress.traits.elementalMagic', 'characters.sorceress.traits.spellMastery', 'characters.sorceress.traits.ancientKnowledge'],
        baseStats: { hp: 50, resource: 50, atk: 12, def: 5, spd: 6, crit: 10 },
        growthRates: { hp: 2.5, atk: 1.2, def: 0.5, spd: 0.5, crit: 0.3 },
        abilities: ['fireball'],
        // Character-specific progression path
        progressionPath: 'elemental_mage',
        preferredEnemyTypes: ['magical', 'undead'], // Faces more magical enemies
        bossScalingModifier: 1.0, // All characters face same boss difficulty
        uniqueRewards: ['staves', 'mana_crystals'], // Gets more magical items
    },
    ROGUE: {
        id: 'rogue',
        nameKey: 'characters.rogue.name',
        resourceKey: 'resources.energy',
        resourceIcon: '🟢',
        roleKey: 'characters.rogue.role',
        descriptionKey: 'characters.rogue.description',
        traits: ['characters.rogue.traits.berserkerRage', 'characters.rogue.traits.rawStrength', 'characters.rogue.traits.intimidating'],
        baseStats: { hp: 60, resource: 40, atk: 13, def: 6, spd: 8, crit: 15 },
        growthRates: { hp: 3, atk: 1.3, def: 0.8, spd: 0.7, crit: 0.5 },
        abilities: ['venom_strike'],
        // Character-specific progression path
        progressionPath: 'assassin_berserker',
        preferredEnemyTypes: ['fast', 'elite'], // Faces more agile and dangerous enemies
        bossScalingModifier: 1.0, // All characters face same boss difficulty
        uniqueRewards: ['daggers', 'poisons'], // Gets more assassin-focused items
    }
};