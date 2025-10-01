// filename: src/constants/balanced-config.js

/**
 * @fileoverview Balanced configuration settings for the Path of Heroes game.
 * Complete rebalance addressing resource costs, damage scaling, and adding potions/buff systems.
 */

export const GameConfig = {
    DEBUG_MODE: import.meta.env.DEV, // Only enabled in development mode
    GAME_VERSION: "V.40.1", // Final demo balance - 2 starting potions, moderate difficulty
    LOADING_DURATION_MS: 1000,

    SCREENS: {
        'intro': {
            html: 'screens/intro.html',
            js: 'js/screens/intro.js'
        },
        'character-select': {
            html: 'screens/character-select.html',
            js: 'js/screens/character-select.js'
        },
        'battle': {
            html: 'screens/battle.html',
            js: 'js/screens/battle.js'
        }
    },

    DEFAULT_LANGUAGE: 'en',
    AUTOSAVE_FLOORS: [1, 5, 10],

    INVENTORY: {
        startingGold: 100, // Starting gold for shop purchases
        maxSlots: 20,
        // Starting potions for balanced roguelike challenge
        startingPotions: [
            { type: 'hp_potion', quantity: 3 },         // 150 HP emergency healing total
            { type: 'resource_potion', quantity: 2 }    // 80 resource emergency restoration
        ]
    },

    XP_CURVE: {
        baseXP: 70,     // Moderate leveling curve (Option 4)
        increment: 50,  // Balanced curve for steady progression
        maxLevel: 60,
    },

    RARITIES: {
        common: { name: { en: 'Common', ar: 'شائع' }, chance: 60, statMult: 1.0, color: '#95a5a6' },
        uncommon: { name: { en: 'Uncommon', ar: 'غير شائع' }, chance: 25, statMult: 1.2, color: '#27ae60' },
        rare: { name: { en: 'Rare', ar: 'نادر' }, chance: 10, statMult: 1.5, color: '#3498db' },
        epic: { name: { en: 'Epic', ar: 'ملحمي' }, chance: 4, statMult: 1.9, color: '#9b59b6' },
        mythic: { name: { en: 'Mythic', ar: 'أسطوري' }, chance: 0.8, statMult: 2.4, color: '#e67e22' },
        legendary: { name: { en: 'Legendary', ar: 'خارق' }, chance: 0.2, statMult: 3.0, color: '#f1c40f' },
    },

    EQUIPMENT_SLOTS: {
        weapon: { name: { en: 'Weapon', ar: 'سلاح' }, icon: '⚔️' },
        head: { name: { en: 'Head', ar: 'رأس' }, icon: '👑' },
        chest: { name: { en: 'Chest', ar: 'صدر' }, icon: '👕' },
    },

    ITEM_TYPES: {
        // Weapons
        sword: {
            name: { en: 'Sword', ar: 'سيف' }, slot: 'weapon', icon: '🗡️',
            baseStats: { atk: 5 }
        },
        staff: {
            name: { en: 'Staff', ar: 'عصا' }, slot: 'weapon', icon: '🪄',
            baseStats: { atk: 7 }
        },
        // Consumables - Enhanced potion system
        hp_potion: {
            name: { en: 'Health Potion', ar: 'جرعة صحة' }, slot: null, icon: '❤️‍🩹', consumable: true,
            effect: 'heal_hp', value: 50, description: { en: 'Restores 50 HP instantly.', ar: 'يستعيد 50 نقطة صحة فوراً.' }
        },
        resource_potion: {
            name: { en: 'Resource Potion', ar: 'جرعة المورد' }, slot: null, icon: '🧪', consumable: true,
            effect: 'restore_resource', value: 40, description: { en: 'Restores 40 resource points.', ar: 'يستعيد 40 نقطة مورد.' }
        },
        greater_hp_potion: {
            name: { en: 'Greater Health Potion', ar: 'جرعة صحة كبيرة' }, slot: null, icon: '💖', consumable: true,
            effect: 'heal_hp', value: 80, description: { en: 'Restores 80 HP instantly.', ar: 'يستعيد 80 نقطة صحة فوراً.' }
        },
        elixir_of_vitality: {
            name: { en: 'Elixir of Vitality', ar: 'إكسير الحيوية' }, slot: null, icon: '🌟', consumable: true,
            effect: 'full_heal', value: 100, description: { en: 'Fully restores HP and resource.', ar: 'يستعيد الصحة والمورد بالكامل.' }
        }
    },

    ITEM_PREFIXES: [
        { name: { en: 'Sturdy', ar: 'متين' }, statMod: { def: 2 } },
        { name: { en: 'Sharp', ar: 'حاد' }, statMod: { atk: 2 } },
    ],
    ITEM_SUFFIXES: [
        { name: { en: 'of Speed', ar: 'السرعة' }, statMod: { spd: 1 } },
        { name: { en: 'of Power', ar: 'القوة' }, statMod: { atk: 1, def: 1 } },
    ],

    COMBAT: {
        baseCritMultiplier: 1.6, // Slightly increased crit multiplier
        fleeChance: 0.6, // Increased flee chance for better escape options
        // Resource regeneration per turn
        resourceRegeneration: {
            baseAmount: 8, // Base resource regen per turn
            levelScaling: 0.5 // Additional regen per level
        }
    },

    // Rebalanced abilities with reduced costs and better effects
    ABILITIES: {
        'power_strike': {
            name: { en: 'Power Strike', ar: 'ضربة قوية' }, cost: 8, target: 'single',
            type: 'attack', damageMultiplier: 1.5
        },
        'shield_bash': {
            name: { en: 'Shield Bash', ar: 'ضربة الدرع' },
            description: { en: 'Deals damage and reduces enemy ATK for 2 turns.', ar: 'يسبب ضررًا ويقلل هجوم العدو لدورتين.' },
            cost: 12, target: 'single', type: 'attack_debuff', // Reduced from 15 to 12
            damageMultiplier: 0.9,
            effect: { type: 'weaken', stat: 'atk', amount: 0.7, duration: 2, icon: '📉' }
        },
        'fireball': {
            name: { en: 'Fireball', ar: 'كرة نارية' },
            description: { en: 'Engulfs all enemies in flame, dealing magic damage.', ar: 'تلتهم كل الأعداء في اللهب، وتسبب ضررًا سحريًا.' },
            cost: 20, target: 'all', type: 'attack_aoe', // Reduced from 30 to 20
            damageMultiplier: 0.8
        },
        'venom_strike': {
            name: { en: 'Venom Strike', ar: 'ضربة سامة' },
            description: { en: 'A vicious strike that also poisons the target for 3 turns.', ar: 'ضربة شرسة تسمم الهدف أيضًا لمدة 3 أدوار.' },
            cost: 15, target: 'single', type: 'attack_dot', // Reduced from 20 to 15
            damageMultiplier: 1.3,
            effect: { type: 'poison', damage: 8, duration: 3, icon: '☠️' }
        }
    },

    // Hades-style buff system
    BATTLE_BUFFS: {
        // Offensive Buffs
        'berserker_rage': {
            name: { en: 'Berserker Rage', ar: 'غضب البرسيركر' },
            description: { en: '+25% attack damage for the next battle', ar: '+25% ضرر الهجوم للمعركة القادمة' },
            icon: '🔥',
            effect: { stat: 'atk', multiplier: 1.25, duration: 'battle' }
        },
        'precision_strike': {
            name: { en: 'Precision Strike', ar: 'ضربة دقيقة' },
            description: { en: '+15% critical hit chance for the next battle', ar: '+15% فرصة الضربة الحاسمة للمعركة القادمة' },
            icon: '🎯',
            effect: { stat: 'crit', bonus: 15, duration: 'battle' }
        },
        'swift_reflexes': {
            name: { en: 'Swift Reflexes', ar: 'ردود فعل سريعة' },
            description: { en: '+30% speed for the next battle', ar: '+30% سرعة للمعركة القادمة' },
            icon: '⚡',
            effect: { stat: 'spd', multiplier: 1.3, duration: 'battle' }
        },

        // Defensive Buffs
        'iron_skin': {
            name: { en: 'Iron Skin', ar: 'جلد حديدي' },
            description: { en: '+40% defense for the next battle', ar: '+40% دفاع للمعركة القادمة' },
            icon: '🛡️',
            effect: { stat: 'def', multiplier: 1.4, duration: 'battle' }
        },
        'vampiric_aura': {
            name: { en: 'Vampiric Aura', ar: 'هالة مصاص الدماء' },
            description: { en: 'Heal 20% of damage dealt as HP', ar: 'استعيد 20% من الضرر كصحة' },
            icon: '🩸',
            effect: { type: 'vampiric', percentage: 20, duration: 'battle' }
        },
        'mana_surge': {
            name: { en: 'Mana Surge', ar: 'تدفق مانا' },
            description: { en: '+50% resource regeneration for the next battle', ar: '+50% تجديد المورد للمعركة القادمة' },
            icon: '💫',
            effect: { type: 'resource_boost', multiplier: 1.5, duration: 'battle' }
        },

        // Utility Buffs
        'battle_focus': {
            name: { en: 'Battle Focus', ar: 'تركيز القتال' },
            description: { en: 'Abilities cost 25% less resource', ar: 'المهارات تكلف 25% أقل' },
            icon: '🎭',
            effect: { type: 'cost_reduction', percentage: 25, duration: 'battle' }
        },
        'lucky_strikes': {
            name: { en: 'Lucky Strikes', ar: 'ضربات محظوظة' },
            description: { en: '20% chance to not consume resource on ability use', ar: '20% عدم استهلاك مورد' },
            icon: '🍀',
            effect: { type: 'resource_save', chance: 20, duration: 'battle' }
        },
        'second_wind': {
            name: { en: 'Second Wind', ar: 'نفس ثاني' },
            description: { en: 'Heal 15 HP at start of each turn', ar: 'استعيد 15 صحة في بداية كل دور' },
            icon: '🌪️',
            effect: { type: 'regeneration', amount: 15, duration: 'battle' }
        }
    },

    DIFFICULTIES: {
        'easy': { enemyHp: 0.8, enemyAtk: 0.8, xpGain: 1.0, goldGain: 1.0, playerDmgMult: 1.2, enemyDmgMult: 0.7 },
        'normal': { enemyHp: 1.0, enemyAtk: 1.0, xpGain: 1.1, goldGain: 1.1, playerDmgMult: 1.0, enemyDmgMult: 1.0 },
        'hard': { enemyHp: 1.3, enemyAtk: 1.2, xpGain: 1.3, goldGain: 1.2, playerDmgMult: 0.9, enemyDmgMult: 1.2 }
    },
};