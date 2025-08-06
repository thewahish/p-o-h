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
        baseStats: { hp: 120, resource: 60, atk: 15, def: 12, spd: 8, crit: 10 },
        growthRates: { hp: 10, atk: 2, def: 3, spd: 0.5, crit: 0.2 },
        abilities: ['shield_bash'],
    },
    SORCERESS: {
        id: 'sorceress',
        nameKey: 'characters.sorceress.name',
        resourceKey: 'resources.mana',
        resourceIcon: '🔵',
        roleKey: 'characters.sorceress.role',
        descriptionKey: 'characters.sorceress.description',
        traits: ['characters.sorceress.traits.elementalMagic', 'characters.sorceress.traits.spellMastery', 'characters.sorceress.traits.ancientKnowledge'],
        baseStats: { hp: 80, resource: 100, atk: 18, def: 6, spd: 10, crit: 12 },
        growthRates: { hp: 6, atk: 3, def: 1, spd: 1, crit: 0.5 },
        abilities: ['fireball'],
    },
    ROGUE: {
        id: 'rogue',
        nameKey: 'characters.rogue.name',
        resourceKey: 'resources.energy',
        resourceIcon: '🟢',
        roleKey: 'characters.rogue.role',
        descriptionKey: 'characters.rogue.description',
        traits: ['characters.rogue.traits.berserkerRage', 'characters.rogue.traits.rawStrength', 'characters.rogue.traits.intimidating'],
        baseStats: { hp: 100, resource: 80, atk: 20, def: 8, spd: 15, crit: 20 },
        growthRates: { hp: 8, atk: 2.5, def: 2, spd: 1.5, crit: 1 },
        abilities: ['venom_strike'],
    }
};