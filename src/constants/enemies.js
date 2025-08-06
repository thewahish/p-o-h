// filename: src/constants/enemies.js

export const EnemyDatabase = {
    // Act 1: The Outer Ruins (Floors 1-10)
    goblin: {
        id: 'goblin',
        nameKey: 'enemies.goblin',
        baseStats: { hp: 40, atk: 8, def: 3, spd: 6, crit: 5 }, // Increased for better balance with level scaling
        goldReward: { min: 2, max: 5 }, // Restored meaningful rewards
        xpReward: 20, // Increased XP for better progression
        abilities: [],
        icon: '👹'
    },
    
    slime: {
        id: 'slime',
        nameKey: 'enemies.slime',
        baseStats: { hp: 45, atk: 7, def: 8, spd: 3, crit: 3 }, // Increased HP and ATK for better challenge
        goldReward: { min: 3, max: 6 }, // Better rewards
        xpReward: 25, // Higher XP gain
        abilities: [],
        icon: '🟢'
    },
    
    orcBrute: {
        id: 'orcBrute',
        nameKey: 'enemies.orcBrute',
        baseStats: { hp: 60, atk: 12, def: 5, spd: 5, crit: 8 }, // Mid-tier enemy with solid stats
        goldReward: { min: 5, max: 10 }, // Better rewards for tougher enemy
        xpReward: 35, // Higher XP reward
        abilities: [],
        icon: '🗡️'
    },

    // Act 1 Boss
    orcWarlord: {
        id: 'orcWarlord',
        nameKey: 'enemies.orcWarlord',
        baseStats: { hp: 120, atk: 18, def: 10, spd: 10, crit: 12 },
        goldReward: { min: 8, max: 15 }, // Boss rewards significantly reduced
        xpReward: 100,
        abilities: ['intimidate'],
        icon: '👑',
        isBoss: true
    },

    // Act 2: The Royal Crypts (Floors 11-20)
    skeleton: {
        id: 'skeleton',
        nameKey: 'enemies.skeleton',
        baseStats: { hp: 40, atk: 14, def: 12, spd: 6, crit: 15 },
        goldReward: { min: 3, max: 5 }, // Much lower gold rewards
        xpReward: 30,
        abilities: ['bone_throw'],
        icon: '💀'
    },
    
    ghoul: {
        id: 'ghoul',
        nameKey: 'enemies.ghoul',
        baseStats: { hp: 60, atk: 16, def: 8, spd: 14, crit: 10 },
        goldReward: { min: 3, max: 6 }, // Much lower gold rewards
        xpReward: 35,
        abilities: ['life_drain'],
        icon: '🧟'
    },
    
    wraith: {
        id: 'wraith',
        nameKey: 'enemies.wraith',
        baseStats: { hp: 45, atk: 20, def: 5, spd: 18, crit: 25 },
        goldReward: { min: 4, max: 7 }, // Much lower gold rewards
        xpReward: 45,
        abilities: ['phase', 'wail'],
        icon: '👻'
    },

    // Act 2 Boss
    graveGolem: {
        id: 'graveGolem',
        nameKey: 'enemies.graveGolem',
        baseStats: { hp: 200, atk: 25, def: 20, spd: 5, crit: 5 },
        goldReward: { min: 10, max: 18 }, // Boss rewards significantly reduced
        xpReward: 200,
        abilities: ['slam', 'regenerate'],
        icon: '🏗️',
        isBoss: true
    },

    // Act 3: The Sanctum (Floors 21-30)
    demonicImp: {
        id: 'demonicImp',
        nameKey: 'enemies.imp',
        baseStats: { hp: 55, atk: 24, def: 10, spd: 20, crit: 18 },
        goldReward: { min: 4, max: 8 }, // Much lower gold rewards
        xpReward: 55,
        abilities: ['fireball', 'teleport'],
        icon: '👺'
    },
    
    cultist: {
        id: 'cultist',
        nameKey: 'enemies.cultist',
        baseStats: { hp: 70, atk: 22, def: 15, spd: 12, crit: 15 },
        goldReward: { min: 5, max: 9 }, // Much lower gold rewards
        xpReward: 60,
        abilities: ['dark_ritual', 'curse'],
        icon: '🔮'
    },

    // Final Demo Boss
    cryptLord: {
        id: 'cryptLord',
        nameKey: 'enemies.cryptLord',
        baseStats: { hp: 300, atk: 35, def: 25, spd: 12, crit: 20 },
        goldReward: { min: 15, max: 25 }, // Boss rewards significantly reduced
        xpReward: 500,
        abilities: ['death_ray', 'summon_minions', 'unholy_aura'],
        icon: '☠️',
        isBoss: true
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