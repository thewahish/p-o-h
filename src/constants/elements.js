// filename: src/constants/elements.js

/**
 * Elemental system for weakness/break mechanics
 */

export const Elements = {
    PHYSICAL: {
        id: 'physical',
        name: { en: 'Physical', ar: 'جسدي' },
        icon: '⚔️',
        color: '#aaaaaa'
    },
    FIRE: {
        id: 'fire',
        name: { en: 'Fire', ar: 'نار' },
        icon: '🔥',
        color: '#ff4444'
    },
    ICE: {
        id: 'ice',
        name: { en: 'Ice', ar: 'جليد' },
        icon: '❄️',
        color: '#44ccff'
    },
    LIGHTNING: {
        id: 'lightning',
        name: { en: 'Lightning', ar: 'برق' },
        icon: '⚡',
        color: '#ffdd44'
    },
    POISON: {
        id: 'poison',
        name: { en: 'Poison', ar: 'سم' },
        icon: '☠️',
        color: '#aa44ff'
    },
    SHADOW: {
        id: 'shadow',
        name: { en: 'Shadow', ar: 'ظل' },
        icon: '🌑',
        color: '#444444'
    },
    HOLY: {
        id: 'holy',
        name: { en: 'Holy', ar: 'مقدس' },
        icon: '✨',
        color: '#ffff88'
    }
};

/**
 * Enemy weakness/resistance database
 * Each enemy has 1-2 weaknesses and 1 resistance
 */
export const EnemyElementalData = {
    goblin: {
        weaknesses: ['fire', 'lightning'],
        resistances: ['physical'],
        baseToughness: 60
    },
    slime: {
        weaknesses: ['ice', 'lightning'],
        resistances: ['poison'],
        baseToughness: 50
    },
    orcBrute: {
        weaknesses: ['poison', 'ice'],
        resistances: ['fire'],
        baseToughness: 80
    },
    skeleton: {
        weaknesses: ['holy', 'fire'],
        resistances: ['physical'],
        baseToughness: 55
    },
    ghoul: {
        weaknesses: ['fire', 'holy'],
        resistances: ['poison'],
        baseToughness: 70
    },
    wraith: {
        weaknesses: ['holy', 'physical'],
        resistances: ['shadow'],
        baseToughness: 65
    },
    imp: {
        weaknesses: ['ice', 'holy'],
        resistances: ['fire'],
        baseToughness: 60
    },
    cultist: {
        weaknesses: ['physical', 'lightning'],
        resistances: ['shadow'],
        baseToughness: 55
    },
    orcWarlord: {
        weaknesses: ['ice', 'lightning'],
        resistances: ['physical'],
        baseToughness: 120 // Boss
    },
    graveGolem: {
        weaknesses: ['fire', 'lightning'],
        resistances: ['physical'],
        baseToughness: 100 // Boss
    },
    cryptLord: {
        weaknesses: ['holy', 'fire'],
        resistances: ['shadow'],
        baseToughness: 150 // Final Boss
    }
};

/**
 * Ability element assignments
 * Maps ability IDs to their elemental types
 */
export const AbilityElements = {
    // Warrior abilities
    power_strike: 'physical',
    shield_bash: 'physical',
    whirlwind_attack: 'physical',
    execute: 'physical',
    last_stand: 'fire',
    iron_will: 'holy',

    // Sorceress abilities
    magic_missile: 'lightning',
    fireball: 'fire',
    ice_shard: 'ice',
    lightning_bolt: 'lightning',
    meteor: 'fire',

    // Rogue abilities
    quick_strike: 'physical',
    venom_strike: 'poison',
    shadow_step: 'shadow',
    fan_of_knives: 'poison', // Primary element
    backstab: 'shadow',
    death_mark: 'shadow',

    // Basic attacks are always physical
    basic_attack: 'physical'
};

/**
 * Break effect damage/effects by element
 */
export const BreakEffects = {
    physical: {
        name: { en: 'Physical Break', ar: 'كسر جسدي' },
        damage: 25,
        effect: 'instant',
        description: { en: '25 instant damage', ar: '25 ضرر فوري' }
    },
    fire: {
        name: { en: 'Fire Break', ar: 'كسر ناري' },
        damage: 30,
        effect: 'burn',
        duration: 2,
        description: { en: '30 burn damage over 2 turns', ar: '30 ضرر حرق على مدى دورتين' }
    },
    ice: {
        name: { en: 'Ice Break', ar: 'كسر جليدي' },
        damage: 20,
        effect: 'freeze',
        description: { en: 'Freeze + 20 damage', ar: 'تجميد + 20 ضرر' }
    },
    lightning: {
        name: { en: 'Lightning Break', ar: 'كسر برقي' },
        damage: 40,
        effect: 'instant',
        description: { en: '40 instant damage', ar: '40 ضرر فوري' }
    },
    poison: {
        name: { en: 'Poison Break', ar: 'كسر سام' },
        damage: 15,
        effect: 'poison',
        duration: 3,
        description: { en: '15 damage per turn for 3 turns', ar: '15 ضرر لكل دور لمدة 3 أدوار' }
    },
    shadow: {
        name: { en: 'Shadow Break', ar: 'كسر ظلي' },
        damage: 0,
        effect: 'defense_down',
        duration: 2,
        debuff: 0.7, // 30% defense reduction
        description: { en: '-30% DEF for 2 turns', ar: '-30% دفاع لمدة دورتين' }
    },
    holy: {
        name: { en: 'Holy Break', ar: 'كسر مقدس' },
        damage: 35,
        effect: 'instant',
        description: { en: '35 instant damage + cleanse', ar: '35 ضرر فوري + تطهير' }
    }
};

/**
 * Get element info by ID
 */
export function getElement(elementId) {
    return Object.values(Elements).find(e => e.id === elementId) || Elements.PHYSICAL;
}

/**
 * Get enemy elemental data
 */
export function getEnemyElements(enemyTypeKey) {
    return EnemyElementalData[enemyTypeKey] || {
        weaknesses: [],
        resistances: [],
        baseToughness: 60
    };
}

/**
 * Get ability element
 */
export function getAbilityElement(abilityId) {
    return AbilityElements[abilityId] || 'physical';
}

/**
 * Calculate damage multiplier based on element matchup
 */
export function getElementalMultiplier(element, enemyWeaknesses, enemyResistances) {
    if (enemyWeaknesses.includes(element)) {
        return 1.5; // Weakness
    }
    if (enemyResistances.includes(element)) {
        return 0.75; // Resistance
    }
    return 1.0; // Neutral
}

/**
 * Calculate toughness damage based on element matchup
 */
export function getToughnessDamage(element, enemyWeaknesses, enemyResistances) {
    if (enemyWeaknesses.includes(element)) {
        return 20; // Fast break
    }
    if (enemyResistances.includes(element)) {
        return 2; // Very slow break
    }
    return 5; // Normal break
}
