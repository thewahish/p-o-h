// filename: src/constants/enemies.js

export const EnemyDatabase = {
    // Act 1: The Outer Ruins (Floors 1-10)
    goblin: {
        id: 'goblin',
        nameKey: 'enemies.goblin',
        baseStats: { hp: 48, atk: 10, def: 3, spd: 6, crit: 5 }, // +20% HP, +25% ATK (Option 4 - Moderate)
        goldReward: { min: 2, max: 5 },
        xpReward: 20,
        abilities: [],
        icon: '👹',
        types: ['physical', 'fast']
    },

    slime: {
        id: 'slime',
        nameKey: 'enemies.slime',
        baseStats: { hp: 54, atk: 9, def: 8, spd: 3, crit: 3 }, // +20% HP, +29% ATK (Option 4 - Moderate)
        goldReward: { min: 3, max: 6 },
        xpReward: 25,
        abilities: [],
        icon: '🟢',
        types: ['magical', 'brute']
    },

    orcBrute: {
        id: 'orcBrute',
        nameKey: 'enemies.orcBrute',
        baseStats: { hp: 72, atk: 14, def: 5, spd: 5, crit: 8 }, // +20% HP, +17% ATK (Option 4 - Moderate)
        goldReward: { min: 5, max: 10 },
        xpReward: 35,
        abilities: [],
        icon: '🗡️',
        types: ['brute', 'physical']
    },

    // Act 1 Boss
    orcWarlord: {
        id: 'orcWarlord',
        nameKey: 'enemies.orcWarlord',
        baseStats: { hp: 144, atk: 23, def: 10, spd: 10, crit: 12 }, // +20% HP, +28% ATK (roguelike balance)
        goldReward: { min: 8, max: 15 },
        xpReward: 100,
        abilities: ['intimidate'],
        icon: '👑',
        isBoss: true,
        types: ['elite', 'brute', 'physical']
    },

    // Act 2: The Royal Crypts (Floors 11-20)
    skeleton: {
        id: 'skeleton',
        nameKey: 'enemies.skeleton',
        baseStats: { hp: 48, atk: 18, def: 12, spd: 6, crit: 15 }, // +20% HP, +26% ATK (roguelike balance)
        goldReward: { min: 3, max: 5 },
        xpReward: 30,
        abilities: ['bone_throw'],
        icon: '💀',
        types: ['undead', 'physical']
    },

    ghoul: {
        id: 'ghoul',
        nameKey: 'enemies.ghoul',
        baseStats: { hp: 72, atk: 20, def: 8, spd: 14, crit: 10 }, // +20% HP, +27% ATK (roguelike balance)
        goldReward: { min: 3, max: 6 },
        xpReward: 35,
        abilities: ['life_drain'],
        icon: '🧟',
        types: ['undead', 'fast']
    },

    wraith: {
        id: 'wraith',
        nameKey: 'enemies.wraith',
        baseStats: { hp: 54, atk: 25, def: 5, spd: 18, crit: 25 }, // +20% HP, +25% ATK (roguelike balance)
        goldReward: { min: 4, max: 7 },
        xpReward: 45,
        abilities: ['phase', 'wail'],
        icon: '👻',
        types: ['undead', 'magical', 'fast']
    },

    // Act 2 Boss
    graveGolem: {
        id: 'graveGolem',
        nameKey: 'enemies.graveGolem',
        baseStats: { hp: 240, atk: 31, def: 20, spd: 5, crit: 5 }, // +20% HP, +24% ATK (roguelike balance)
        goldReward: { min: 10, max: 18 },
        xpReward: 200,
        abilities: ['slam', 'regenerate'],
        icon: '🏗️',
        isBoss: true,
        types: ['elite', 'brute', 'undead']
    },

    // Act 3: The Sanctum (Floors 21-30)
    demonicImp: {
        id: 'demonicImp',
        nameKey: 'enemies.imp',
        baseStats: { hp: 66, atk: 30, def: 10, spd: 20, crit: 18 }, // +20% HP, +24% ATK (roguelike balance)
        goldReward: { min: 4, max: 8 },
        xpReward: 55,
        abilities: ['fireball', 'teleport'],
        icon: '👺',
        types: ['magical', 'fast']
    },

    cultist: {
        id: 'cultist',
        nameKey: 'enemies.cultist',
        baseStats: { hp: 84, atk: 28, def: 15, spd: 12, crit: 15 }, // +20% HP, +27% ATK (roguelike balance)
        goldReward: { min: 5, max: 9 },
        xpReward: 60,
        abilities: ['dark_ritual', 'curse'],
        icon: '🔮',
        types: ['magical', 'elite']
    },

    // Final Demo Boss
    cryptLord: {
        id: 'cryptLord',
        nameKey: 'enemies.cryptLord',
        baseStats: { hp: 360, atk: 44, def: 25, spd: 12, crit: 20 }, // +20% HP, +26% ATK (roguelike balance)
        goldReward: { min: 15, max: 25 },
        xpReward: 500,
        abilities: ['death_ray', 'summon_minions', 'unholy_aura'],
        icon: '☠️',
        isBoss: true,
        types: ['elite', 'magical', 'undead']
    }
};

// Helper function to get enemy encounters by floor
export const getFloorEnemies = (floor) => {
    if (floor <= 10) {
        return ['goblin', 'slime', 'orcBrute'];
    } else if (floor <= 20) {
        return ['skeleton', 'ghoul', 'wraith'];
    } else {
        return ['demonicImp', 'cultist'];
    }
};

// Helper function to get boss for floor
export const getFloorBoss = (floor) => {
    if (floor === 10) return 'orcWarlord';
    if (floor === 20) return 'graveGolem';
    if (floor === 30) return 'cryptLord';
    return null;
};