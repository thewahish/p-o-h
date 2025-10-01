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
        // Resource regeneration per turn - CLASSIC MODE
        resourceRegeneration: {
            baseAmount: 0, // Classic Mode: No auto-regen, rely on potions and planning
            levelScaling: 0 // No scaling - pure classic resource management
        }
    },

    // Complete ability system - 8 abilities per character with progression unlocks
    ABILITIES: {
        // ==================== WARRIOR ABILITIES ====================
        'power_strike': {
            name: { en: 'Power Strike', ar: 'ضربة قوية' },
            description: { en: 'Deal 150% weapon damage to single target.', ar: 'اصنع 150% من ضرر السلاح لهدف واحد.' },
            cost: 8, target: 'single', type: 'attack', damageMultiplier: 1.5,
            unlockLevel: 1
        },
        'defensive_stance': {
            name: { en: 'Defensive Stance', ar: 'موقف دفاعي' },
            description: { en: '+50% DEF and regenerate 5 HP per turn for 2 turns.', ar: '+50% دفاع واستعادة 5 نقطة صحة لكل دور لمدة دورتين.' },
            cost: 10, target: 'self', type: 'buff',
            effect: { type: 'def_buff', stat: 'def', multiplier: 1.5, duration: 2, regen: 5, icon: '🛡️' },
            cooldown: 3, unlockLevel: 1
        },
        'shield_bash': {
            name: { en: 'Shield Bash', ar: 'ضربة الدرع' },
            description: { en: 'Deal 90% damage and reduce enemy ATK by 30% for 2 turns.', ar: 'اصنع 90% ضرر وقلل هجوم العدو بنسبة 30% لمدة دورتين.' },
            cost: 12, target: 'single', type: 'attack_debuff',
            damageMultiplier: 0.9,
            effect: { type: 'weaken', stat: 'atk', amount: 0.7, duration: 2, icon: '📉' },
            unlockLevel: 3
        },
        'battle_cry': {
            name: { en: 'Battle Cry', ar: 'صرخة المعركة' },
            description: { en: '+25% ATK and +2 SPD for 3 turns.', ar: '+25% هجوم و +2 سرعة لمدة 3 أدوار.' },
            cost: 15, target: 'self', type: 'buff',
            effect: { type: 'atk_buff', stat: 'atk', multiplier: 1.25, spdBonus: 2, duration: 3, icon: '📢' },
            cooldown: 4, unlockLevel: 6
        },
        'whirlwind_attack': {
            name: { en: 'Whirlwind Attack', ar: 'هجوم الزوبعة' },
            description: { en: 'Deal 70% damage to ALL enemies.', ar: 'اصنع 70% ضرر لجميع الأعداء.' },
            cost: 20, target: 'all', type: 'attack_aoe',
            damageMultiplier: 0.7,
            unlockLevel: 9
        },
        'iron_will': {
            name: { en: 'Iron Will', ar: 'إرادة حديدية' },
            description: { en: 'Heal 30 HP and gain 20% damage resistance for 2 turns.', ar: 'استعد 30 نقطة صحة واحصل على 20% مقاومة للضرر لمدة دورتين.' },
            cost: 25, target: 'self', type: 'heal_buff',
            healAmount: 30,
            effect: { type: 'resistance', amount: 0.8, duration: 2, icon: '💪' },
            cooldown: 5, unlockLevel: 12
        },
        'execute': {
            name: { en: 'Execute', ar: 'إعدام' },
            description: { en: 'Deal 200% damage, +100% bonus if enemy HP < 30%.', ar: 'اصنع 200% ضرر، +100% مكافأة إذا كانت صحة العدو < 30%.' },
            cost: 18, target: 'single', type: 'attack',
            damageMultiplier: 2.0,
            effect: { type: 'execute', threshold: 0.3, bonusMultiplier: 1.0 },
            cooldown: 2, unlockLevel: 15
        },
        'last_stand': {
            name: { en: 'Last Stand', ar: 'الموقف الأخير' },
            description: { en: 'Deal 250% damage to all enemies and heal 20% of damage dealt.', ar: 'اصنع 250% ضرر لجميع الأعداء واستعد 20% من الضرر المسبب.' },
            cost: 40, target: 'all', type: 'attack_aoe',
            damageMultiplier: 2.5,
            effect: { type: 'vampiric', percentage: 20 },
            cooldown: 6, unlockLevel: 18
        },

        // ==================== SORCERESS ABILITIES ====================
        'magic_missile': {
            name: { en: 'Magic Missile', ar: 'صاروخ سحري' },
            description: { en: 'Deal 140% magic damage to single target, never misses.', ar: 'اصنع 140% ضرر سحري لهدف واحد، لا يخطئ أبداً.' },
            cost: 8, target: 'single', type: 'attack',
            damageMultiplier: 1.4, neverMiss: true,
            unlockLevel: 1
        },
        'mana_shield': {
            name: { en: 'Mana Shield', ar: 'درع المانا' },
            description: { en: 'Absorb next 40 damage taken (lasts 3 turns).', ar: 'امتص الضرر التالي 40 (يدوم 3 أدوار).' },
            cost: 12, target: 'self', type: 'buff',
            effect: { type: 'shield', amount: 40, duration: 3, icon: '🔮' },
            cooldown: 4, unlockLevel: 1
        },
        'fireball': {
            name: { en: 'Fireball', ar: 'كرة نارية' },
            description: { en: 'Deal 80% fire damage to ALL enemies.', ar: 'اصنع 80% ضرر ناري لجميع الأعداء.' },
            cost: 20, target: 'all', type: 'attack_aoe',
            damageMultiplier: 0.8,
            unlockLevel: 3
        },
        'ice_shard': {
            name: { en: 'Ice Shard', ar: 'شظية جليدية' },
            description: { en: 'Deal 120% damage and slow enemy (-30% SPD) for 2 turns.', ar: 'اصنع 120% ضرر وبطء العدو (-30% سرعة) لمدة دورتين.' },
            cost: 15, target: 'single', type: 'attack_debuff',
            damageMultiplier: 1.2,
            effect: { type: 'slow', stat: 'spd', amount: 0.7, duration: 2, icon: '❄️' },
            unlockLevel: 6
        },
        'lightning_bolt': {
            name: { en: 'Lightning Bolt', ar: 'صاعقة برق' },
            description: { en: 'Deal 180% damage with +40% crit chance.', ar: 'اصنع 180% ضرر مع +40% فرصة حرجة.' },
            cost: 18, target: 'single', type: 'attack',
            damageMultiplier: 1.8,
            effect: { type: 'crit_boost', bonus: 40 },
            cooldown: 2, unlockLevel: 9
        },
        'arcane_intellect': {
            name: { en: 'Arcane Intellect', ar: 'ذكاء سري' },
            description: { en: '+40% ATK and +20 max Mana for rest of battle.', ar: '+40% هجوم و +20 مانا كحد أقصى لبقية المعركة.' },
            cost: 25, target: 'self', type: 'buff',
            effect: { type: 'permanent_buff', stat: 'atk', multiplier: 1.4, resourceBonus: 20, duration: 'battle', icon: '🧠' },
            cooldown: 999, unlockLevel: 12 // Once per battle
        },
        'meteor': {
            name: { en: 'Meteor', ar: 'نيزك' },
            description: { en: 'Deal 120% damage to all enemies + 20% burn over 2 turns.', ar: 'اصنع 120% ضرر لجميع الأعداء + 20% حرق على مدى دورتين.' },
            cost: 35, target: 'all', type: 'attack_aoe',
            damageMultiplier: 1.2,
            effect: { type: 'burn', damagePercent: 0.2, duration: 2, icon: '☄️' },
            cooldown: 4, unlockLevel: 15
        },
        'time_warp': {
            name: { en: 'Time Warp', ar: 'تشوه الزمن' },
            description: { en: 'Take an extra turn immediately and restore 20 resource.', ar: 'خذ دوراً إضافياً فوراً واستعد 20 مورد.' },
            cost: 50, target: 'self', type: 'utility',
            effect: { type: 'extra_turn', resourceRestore: 20 },
            cooldown: 7, unlockLevel: 18
        },

        // ==================== ROGUE ABILITIES ====================
        'quick_strike': {
            name: { en: 'Quick Strike', ar: 'ضربة سريعة' },
            description: { en: 'Deal 130% damage with +20% crit chance.', ar: 'اصنع 130% ضرر مع +20% فرصة حرجة.' },
            cost: 7, target: 'single', type: 'attack',
            damageMultiplier: 1.3,
            effect: { type: 'crit_boost', bonus: 20 },
            unlockLevel: 1
        },
        'evasion': {
            name: { en: 'Evasion', ar: 'مراوغة' },
            description: { en: '+40% dodge chance (avoid damage) for 2 turns.', ar: '+40% فرصة المراوغة (تجنب الضرر) لمدة دورتين.' },
            cost: 10, target: 'self', type: 'buff',
            effect: { type: 'dodge_buff', amount: 40, duration: 2, icon: '💨' },
            cooldown: 4, unlockLevel: 1
        },
        'venom_strike': {
            name: { en: 'Venom Strike', ar: 'ضربة سامة' },
            description: { en: 'Deal 130% damage + poison (10 dmg/turn for 3 turns).', ar: 'اصنع 130% ضرر + سم (10 ضرر/دور لمدة 3 أدوار).' },
            cost: 15, target: 'single', type: 'attack_dot',
            damageMultiplier: 1.3,
            effect: { type: 'poison', damage: 10, duration: 3, icon: '☠️' },
            unlockLevel: 3
        },
        'shadow_step': {
            name: { en: 'Shadow Step', ar: 'خطوة الظل' },
            description: { en: 'Next attack deals +60% damage and cannot miss.', ar: 'الهجوم التالي يسبب +60% ضرر ولا يمكن أن يخطئ.' },
            cost: 12, target: 'self', type: 'buff',
            effect: { type: 'guaranteed_hit', bonusMultiplier: 0.6, duration: 1, icon: '👤' },
            cooldown: 3, unlockLevel: 6
        },
        'fan_of_knives': {
            name: { en: 'Fan of Knives', ar: 'مروحة السكاكين' },
            description: { en: 'Deal 60% damage to all enemies + weak poison (5 dmg/turn).', ar: 'اصنع 60% ضرر لجميع الأعداء + سم ضعيف (5 ضرر/دور).' },
            cost: 20, target: 'all', type: 'attack_aoe',
            damageMultiplier: 0.6,
            effect: { type: 'poison', damage: 5, duration: 3, icon: '🔪' },
            unlockLevel: 9
        },
        'deadly_precision': {
            name: { en: 'Deadly Precision', ar: 'دقة قاتلة' },
            description: { en: '+50% crit chance and +30% crit damage for 3 turns.', ar: '+50% فرصة حرجة و +30% ضرر حرج لمدة 3 أدوار.' },
            cost: 25, target: 'self', type: 'buff',
            effect: { type: 'crit_buff', critBonus: 50, critDamageBonus: 0.3, duration: 3, icon: '🎯' },
            cooldown: 5, unlockLevel: 12
        },
        'backstab': {
            name: { en: 'Backstab', ar: 'طعنة في الظهر' },
            description: { en: 'Deal 250% damage to single target, guaranteed crit.', ar: 'اصنع 250% ضرر لهدف واحد، حرج مضمون.' },
            cost: 22, target: 'single', type: 'attack',
            damageMultiplier: 2.5, guaranteedCrit: true,
            cooldown: 3, unlockLevel: 15
        },
        'death_mark': {
            name: { en: 'Death Mark', ar: 'علامة الموت' },
            description: { en: 'Mark enemy - all attacks deal +50% damage to marked target for 4 turns.', ar: 'ضع علامة على العدو - جميع الهجمات تسبب +50% ضرر للهدف المحدد لمدة 4 أدوار.' },
            cost: 45, target: 'single', type: 'debuff',
            effect: { type: 'marked', multiplier: 1.5, duration: 4, icon: '💀' },
            cooldown: 6, unlockLevel: 18
        }
    },

    // Hades-style buff system
    BATTLE_BUFFS: {
        // Offensive Buffs
        'berserker_rage': {
            name: { en: 'Berserker Rage', ar: 'غضب البرسيركر' },
            description: { en: '+25% attack damage this battle', ar: '+25% ضرر الهجوم في هذه المعركة' },
            icon: '🔥',
            effect: { stat: 'atk', multiplier: 1.25, duration: 'battle' }
        },
        'precision_strike': {
            name: { en: 'Precision Strike', ar: 'ضربة دقيقة' },
            description: { en: '+15% critical hit chance this battle', ar: '+15% فرصة الضربة الحاسمة في هذه المعركة' },
            icon: '🎯',
            effect: { stat: 'crit', bonus: 15, duration: 'battle' }
        },
        'swift_reflexes': {
            name: { en: 'Swift Reflexes', ar: 'ردود فعل سريعة' },
            description: { en: '+30% speed this battle', ar: '+30% سرعة في هذه المعركة' },
            icon: '⚡',
            effect: { stat: 'spd', multiplier: 1.3, duration: 'battle' }
        },

        // Defensive Buffs
        'iron_skin': {
            name: { en: 'Iron Skin', ar: 'جلد حديدي' },
            description: { en: '+40% defense this battle', ar: '+40% دفاع في هذه المعركة' },
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
            description: { en: '+50% resource regeneration this battle', ar: '+50% تجديد المورد في هذه المعركة' },
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