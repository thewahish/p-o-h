# MVP IMPLEMENTATION PLAN
**Path of Heroes - Strategic Depth MVP**

Version: 1.0
Created: 2025-10-01
Status: Ready to Implement

---

## Table of Contents
1. [MVP Scope](#mvp-scope)
2. [Phase 1: Expanded Abilities](#phase-1-expanded-abilities)
3. [Phase 2: Defensive Actions](#phase-2-defensive-actions)
4. [Phase 3: Equipment System](#phase-3-equipment-system)
5. [Testing & Balance](#testing--balance)
6. [File-by-File Implementation](#file-by-file-implementation)
7. [Success Criteria](#success-criteria)

---

## MVP Scope

### What's Included:
✅ **24 New Abilities** (8 per character)
✅ **Ability Unlock System** (levels 3, 6, 9, 12, 15, 18)
✅ **Defensive Actions** (Block, Dodge, Counter, Parry)
✅ **Equipment with Real Stats** (ATK, DEF, HP bonuses)
✅ **Equipment Special Effects** (Vampiric, Spiked, etc.)
✅ **Durability System** (100 max, 25-50% loss on death, 0 = no stats)
✅ **Shop Repairs** (20-800g based on rarity)

### What's Deferred (Post-MVP):
⏸️ **Combo System** (add after abilities tested)
⏸️ **Talent System** (optional enhancement)
⏸️ **Advanced Combos** (3+ ability chains)
⏸️ **Equipment Upgrading** (post-launch feature)

### Timeline:
- **Week 1**: Phase 1 (Abilities + Unlocks)
- **Week 2**: Phase 2 (Defensive Actions)
- **Week 3**: Phase 3 (Equipment + Durability)
- **Week 4**: Testing, Balance, Polish

**Total: ~3-4 weeks to playable MVP**

---

## Phase 1: Expanded Abilities

### Goal:
Replace current 2-ability system with 8 abilities per character that unlock through progression.

### Implementation Steps:

#### Step 1.1: Update GameConfig with All Abilities

**File**: `src/constants/config.js`

**Add to `ABILITIES` object**:

```javascript
ABILITIES: {
    // WARRIOR ABILITIES
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
        effect: { stat: 'def', multiplier: 1.5, duration: 2, regen: 5, icon: '🛡️' },
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
        effect: { stat: 'atk', multiplier: 1.25, spdBonus: 2, duration: 3, icon: '📢' },
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

    // SORCERESS ABILITIES
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
        effect: { stat: 'atk', multiplier: 1.4, resourceBonus: 20, duration: 'battle', icon: '🧠' },
        cooldown: 999, unlockLevel: 12 // Once per battle
    },
    'meteor': {
        name: { en: 'Meteor', ar: 'نيزك' },
        description: { en: 'Deal 120% damage to all enemies + 20% burn over 2 turns.', ar: 'اصنع 120% ضرر لجميع الأعداء + 20% حرق على مدى دورتين.' },
        cost: 35, target: 'all', type: 'attack_aoe',
        damageMultiplier: 1.2,
        effect: { type: 'burn', damage: 0.2, duration: 2, icon: '☄️' },
        cooldown: 4, unlockLevel: 15
    },
    'time_warp': {
        name: { en: 'Time Warp', ar: 'تشوه الزمن' },
        description: { en: 'Take an extra turn immediately and restore 20 resource.', ar: 'خذ دوراً إضافياً فوراً واستعد 20 مورد.' },
        cost: 50, target: 'self', type: 'utility',
        effect: { type: 'extra_turn', resourceRestore: 20 },
        cooldown: 7, unlockLevel: 18
    },

    // ROGUE ABILITIES
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
        effect: { type: 'dodge', amount: 40, duration: 2, icon: '💨' },
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
}
```

#### Step 1.2: Create Character Ability Mappings

**File**: `src/constants/characters.js`

**Update character objects** with ability lists:

```javascript
export const CHARACTERS = {
    warrior: {
        id: 'warrior',
        name: { en: 'Warrior (Taha)', ar: 'محارب (طه)' },
        // ... existing stats ...
        abilities: [
            'power_strike',      // Level 1
            'defensive_stance',  // Level 1
            'shield_bash',       // Level 3
            'battle_cry',        // Level 6
            'whirlwind_attack',  // Level 9
            'iron_will',         // Level 12
            'execute',           // Level 15
            'last_stand'         // Level 18
        ]
    },
    sorceress: {
        id: 'sorceress',
        name: { en: 'Sorceress (Mais)', ar: 'ساحرة (ميس)' },
        // ... existing stats ...
        abilities: [
            'magic_missile',     // Level 1
            'mana_shield',       // Level 1
            'fireball',          // Level 3
            'ice_shard',         // Level 6
            'lightning_bolt',    // Level 9
            'arcane_intellect',  // Level 12
            'meteor',            // Level 15
            'time_warp'          // Level 18
        ]
    },
    rogue: {
        id: 'rogue',
        name: { en: 'Rogue (Ibrahim)', ar: 'لص (إبراهيم)' },
        // ... existing stats ...
        abilities: [
            'quick_strike',      // Level 1
            'evasion',           // Level 1
            'venom_strike',      // Level 3
            'shadow_step',       // Level 6
            'fan_of_knives',     // Level 9
            'deadly_precision',  // Level 12
            'backstab',          // Level 15
            'death_mark'         // Level 18
        ]
    }
};
```

#### Step 1.3: Create Ability Unlock System

**File**: `src/systems/abilities.js` (NEW)

```javascript
// filename: src/systems/abilities.js

import { GameState } from '../core/state.js';
import { GameConfig } from '../constants/config.js';
import { CHARACTERS } from '../constants/characters.js';
import Logger from '../core/logger.js';

/**
 * Ability system - handles unlocking and managing player abilities
 */
export class AbilitySystem {

    /**
     * Get available abilities for current player based on level
     * @returns {Array} Array of ability keys available to player
     */
    static getAvailableAbilities() {
        const player = GameState.current.player;
        const characterId = GameState.current.characterId;

        if (!characterId || !CHARACTERS[characterId]) {
            Logger.log('Invalid character ID', 'ERROR');
            return [];
        }

        const characterAbilities = CHARACTERS[characterId].abilities;
        const playerLevel = player.level || 1;

        // Filter abilities based on player level
        const available = characterAbilities.filter(abilityKey => {
            const abilityConfig = GameConfig.ABILITIES[abilityKey];
            if (!abilityConfig) return false;

            const unlockLevel = abilityConfig.unlockLevel || 1;
            return playerLevel >= unlockLevel;
        });

        return available;
    }

    /**
     * Get ability details by key
     * @param {string} abilityKey
     * @returns {Object} Ability configuration
     */
    static getAbility(abilityKey) {
        return GameConfig.ABILITIES[abilityKey] || null;
    }

    /**
     * Check if ability is on cooldown
     * @param {string} abilityKey
     * @returns {number} Turns remaining on cooldown (0 if ready)
     */
    static getCooldownRemaining(abilityKey) {
        if (!GameState.current.abilityCooldowns) {
            GameState.current.abilityCooldowns = {};
        }

        return GameState.current.abilityCooldowns[abilityKey] || 0;
    }

    /**
     * Set ability on cooldown
     * @param {string} abilityKey
     * @param {number} turns
     */
    static setCooldown(abilityKey, turns) {
        if (!GameState.current.abilityCooldowns) {
            GameState.current.abilityCooldowns = {};
        }

        GameState.current.abilityCooldowns[abilityKey] = turns;
        GameState._notify();
    }

    /**
     * Reduce all cooldowns by 1 turn (call at start of player turn)
     */
    static tickCooldowns() {
        if (!GameState.current.abilityCooldowns) {
            GameState.current.abilityCooldowns = {};
        }

        Object.keys(GameState.current.abilityCooldowns).forEach(key => {
            if (GameState.current.abilityCooldowns[key] > 0) {
                GameState.current.abilityCooldowns[key]--;
            }
        });

        GameState._notify();
    }

    /**
     * Check if ability is unlocked at current level
     * @param {string} abilityKey
     * @returns {boolean}
     */
    static isUnlocked(abilityKey) {
        const available = this.getAvailableAbilities();
        return available.includes(abilityKey);
    }

    /**
     * Get next ability to unlock and level required
     * @returns {Object|null} { abilityKey, level } or null if all unlocked
     */
    static getNextUnlock() {
        const player = GameState.current.player;
        const characterId = GameState.current.characterId;
        const playerLevel = player.level || 1;

        if (!CHARACTERS[characterId]) return null;

        const allAbilities = CHARACTERS[characterId].abilities;

        // Find next locked ability
        for (const abilityKey of allAbilities) {
            const ability = GameConfig.ABILITIES[abilityKey];
            if (ability && ability.unlockLevel > playerLevel) {
                return {
                    abilityKey,
                    ability,
                    level: ability.unlockLevel
                };
            }
        }

        return null; // All unlocked
    }

    /**
     * Initialize ability system for new game
     */
    static initialize() {
        GameState.current.abilityCooldowns = {};
        GameState._notify();
    }

    /**
     * Clear all cooldowns (e.g., on battle end)
     */
    static clearCooldowns() {
        GameState.current.abilityCooldowns = {};
        GameState._notify();
    }
}
```

#### Step 1.4: Update Battle Screen UI

**File**: `src/components/battle-screen.jsx`

**Changes needed**:
1. Display 8 ability buttons (not just 2)
2. Show locked abilities with unlock level
3. Display cooldown overlays on abilities
4. Show "NEW ABILITY UNLOCKED!" notification when leveling up

**Key additions**:
```jsx
// Get available abilities
const availableAbilities = AbilitySystem.getAvailableAbilities();

// Display abilities in grid
<div className="grid grid-cols-2 gap-2">
    {availableAbilities.map(abilityKey => {
        const ability = AbilitySystem.getAbility(abilityKey);
        const cooldown = AbilitySystem.getCooldownRemaining(abilityKey);
        const canAfford = player.resource.current >= ability.cost;

        return (
            <button
                key={abilityKey}
                disabled={cooldown > 0 || !canAfford}
                className={/* styling */}
            >
                {ability.name[lang]}
                {cooldown > 0 && <div>CD: {cooldown}</div>}
                <div className="text-xs">Cost: {ability.cost}</div>
            </button>
        );
    })}
</div>
```

#### Step 1.5: Update Combat System

**File**: `src/systems/combat.js`

**Changes needed**:
1. Handle cooldowns when abilities used
2. Process new ability effects (shields, DoTs, etc.)
3. Tick cooldowns at start of player turn

**Key additions**:
```javascript
// In processTurn() at start of player turn
AbilitySystem.tickCooldowns();

// In playerSkill() method
const cooldownTurns = skillData.cooldown || 0;
if (cooldownTurns > 0) {
    AbilitySystem.setCooldown(skillKey, cooldownTurns);
}
```

---

## Phase 2: Defensive Actions

### Goal:
Add Block, Dodge, Counter, and Parry as turn options that cost resource % instead of flat amounts.

### Implementation Steps:

#### Step 2.1: Define Defensive Actions

**File**: `src/constants/config.js`

**Add new config section**:

```javascript
DEFENSIVE_ACTIONS: {
    'block': {
        name: { en: 'Block', ar: 'حظر' },
        description: { en: 'Reduce next incoming attack by 50%.', ar: 'قلل الهجوم القادم بنسبة 50%.' },
        icon: '🛡️',
        resourceCost: 0.15, // 15% of max resource
        effect: { type: 'damage_reduction', amount: 0.5, duration: 1 },
        unlockLevel: 1
    },
    'dodge': {
        name: { en: 'Dodge Roll', ar: 'تفادي' },
        description: { en: '70% chance to avoid next attack completely.', ar: '70% فرصة لتجنب الهجوم التالي تماماً.' },
        icon: '💨',
        resourceCost: 0.20, // 20% of max resource
        effect: { type: 'dodge', chance: 0.7, duration: 1 },
        cooldown: 2,
        unlockLevel: 1
    },
    'counter': {
        name: { en: 'Counter Stance', ar: 'موقف الهجوم المضاد' },
        description: { en: 'Block 30% damage + deal 80% weapon damage back.', ar: 'احجب 30% من الضرر + اصنع 80% من ضرر السلاح عائداً.' },
        icon: '⚔️',
        resourceCost: 0.25, // 25% of max resource
        effect: { type: 'counter', damageReduction: 0.3, damageMultiplier: 0.8, duration: 1 },
        cooldown: 3,
        unlockLevel: 1
    },
    'parry': {
        name: { en: 'Parry', ar: 'صد' },
        description: { en: 'Negate attack completely and stun enemy for 1 turn (50% success).', ar: 'إلغاء الهجوم تماماً وصعق العدو لدور واحد (50% نجاح).' },
        icon: '🗡️',
        resourceCost: 0.30, // 30% of max resource
        effect: { type: 'parry', successChance: 0.5, duration: 1 },
        cooldown: 4,
        unlockLevel: 10
    }
}
```

#### Step 2.2: Create Defensive System

**File**: `src/systems/defensive.js` (NEW)

```javascript
// filename: src/systems/defensive.js

import { GameState } from '../core/state.js';
import { GameConfig } from '../constants/config.js';
import Logger from '../core/logger.js';

/**
 * Defensive action system
 */
export class DefensiveSystem {

    /**
     * Get available defensive actions based on level
     * @returns {Array} Array of defensive action keys
     */
    static getAvailableActions() {
        const player = GameState.current.player;
        const playerLevel = player.level || 1;

        return Object.keys(GameConfig.DEFENSIVE_ACTIONS).filter(key => {
            const action = GameConfig.DEFENSIVE_ACTIONS[key];
            const unlockLevel = action.unlockLevel || 1;
            return playerLevel >= unlockLevel;
        });
    }

    /**
     * Use defensive action
     * @param {string} actionKey
     * @returns {boolean} Success
     */
    static useDefensiveAction(actionKey) {
        const action = GameConfig.DEFENSIVE_ACTIONS[actionKey];
        if (!action) return false;

        const player = GameState.current.player;
        const resourceCost = Math.floor(player.resource.max * action.resourceCost);

        // Check resource
        if (player.resource.current < resourceCost) {
            Logger.log('Not enough resource for defensive action', 'COMBAT');
            return false;
        }

        // Check cooldown
        const cooldownRemaining = this.getCooldownRemaining(actionKey);
        if (cooldownRemaining > 0) {
            Logger.log(`${actionKey} on cooldown for ${cooldownRemaining} turns`, 'COMBAT');
            return false;
        }

        // Spend resource
        player.resource.current -= resourceCost;

        // Apply defensive effect
        if (!GameState.current.defensiveStance) {
            GameState.current.defensiveStance = {};
        }

        GameState.current.defensiveStance = {
            action: actionKey,
            effect: action.effect,
            remainingTurns: action.effect.duration
        };

        // Set cooldown
        if (action.cooldown) {
            this.setCooldown(actionKey, action.cooldown);
        }

        Logger.log(`Used defensive action: ${actionKey}`, 'COMBAT');
        GameState._notify();
        return true;
    }

    /**
     * Process defensive effect when enemy attacks
     * @param {number} incomingDamage
     * @param {Object} attacker
     * @returns {Object} { damage, counterDamage }
     */
    static processDefensiveEffect(incomingDamage, attacker) {
        const stance = GameState.current.defensiveStance;
        if (!stance || stance.remainingTurns <= 0) {
            return { damage: incomingDamage, counterDamage: 0 };
        }

        const effect = stance.effect;
        let finalDamage = incomingDamage;
        let counterDamage = 0;

        switch (effect.type) {
            case 'damage_reduction':
                finalDamage = Math.floor(incomingDamage * (1 - effect.amount));
                Logger.log(`[DEFENSIVE] Block reduced damage: ${incomingDamage} → ${finalDamage}`, 'COMBAT');
                break;

            case 'dodge':
                const dodgeSuccess = Math.random() < effect.chance;
                if (dodgeSuccess) {
                    finalDamage = 0;
                    Logger.log(`[DEFENSIVE] Dodge successful! Avoided ${incomingDamage} damage`, 'COMBAT');
                } else {
                    Logger.log(`[DEFENSIVE] Dodge failed!`, 'COMBAT');
                }
                break;

            case 'counter':
                finalDamage = Math.floor(incomingDamage * (1 - effect.damageReduction));
                const player = GameState.current.player;
                counterDamage = Math.floor(this.calculateCounterDamage(player, attacker, effect.damageMultiplier));
                Logger.log(`[DEFENSIVE] Counter: reduced ${incomingDamage} → ${finalDamage}, counter for ${counterDamage}`, 'COMBAT');
                break;

            case 'parry':
                const parrySuccess = Math.random() < effect.successChance;
                if (parrySuccess) {
                    finalDamage = 0;
                    attacker.stunned = 1; // Stun for 1 turn
                    Logger.log(`[DEFENSIVE] Parry successful! Enemy stunned!`, 'COMBAT');
                } else {
                    Logger.log(`[DEFENSIVE] Parry failed!`, 'COMBAT');
                }
                break;
        }

        // Consume defensive stance
        stance.remainingTurns--;
        if (stance.remainingTurns <= 0) {
            GameState.current.defensiveStance = null;
        }

        GameState._notify();
        return { damage: finalDamage, counterDamage };
    }

    /**
     * Calculate counter damage
     */
    static calculateCounterDamage(player, enemy, multiplier) {
        const atk = player.stats.atk || player.atk;
        const def = enemy.def;
        const baseDamage = (atk * atk) / (atk + def);
        return Math.floor(baseDamage * multiplier);
    }

    /**
     * Cooldown management (similar to abilities)
     */
    static getCooldownRemaining(actionKey) {
        if (!GameState.current.defensiveCooldowns) {
            GameState.current.defensiveCooldowns = {};
        }
        return GameState.current.defensiveCooldowns[actionKey] || 0;
    }

    static setCooldown(actionKey, turns) {
        if (!GameState.current.defensiveCooldowns) {
            GameState.current.defensiveCooldowns = {};
        }
        GameState.current.defensiveCooldowns[actionKey] = turns;
        GameState._notify();
    }

    static tickCooldowns() {
        if (!GameState.current.defensiveCooldowns) {
            GameState.current.defensiveCooldowns = {};
        }

        Object.keys(GameState.current.defensiveCooldowns).forEach(key => {
            if (GameState.current.defensiveCooldowns[key] > 0) {
                GameState.current.defensiveCooldowns[key]--;
            }
        });

        GameState._notify();
    }

    static initialize() {
        GameState.current.defensiveCooldowns = {};
        GameState.current.defensiveStance = null;
        GameState._notify();
    }
}
```

#### Step 2.3: Update Battle UI with Defensive Panel

**File**: `src/components/battle-screen.jsx`

**Add expandable defensive panel**:
```jsx
// Defensive actions panel (swipe/click to reveal)
<div className="defensive-panel">
    <div className="text-center text-sm opacity-75">
        ⬇️ Defensive Actions ⬇️
    </div>
    {showDefensive && (
        <div className="grid grid-cols-2 gap-2">
            {DefensiveSystem.getAvailableActions().map(actionKey => {
                const action = GameConfig.DEFENSIVE_ACTIONS[actionKey];
                const cost = Math.floor(player.resource.max * action.resourceCost);
                const cooldown = DefensiveSystem.getCooldownRemaining(actionKey);

                return (
                    <button
                        key={actionKey}
                        onClick={() => handleDefensiveAction(actionKey)}
                        disabled={cooldown > 0 || player.resource.current < cost}
                    >
                        {action.icon} {action.name[lang]}
                        <div className="text-xs">Cost: {cost}</div>
                        {cooldown > 0 && <div>CD: {cooldown}</div>}
                    </button>
                );
            })}
        </div>
    )}
</div>
```

#### Step 2.4: Update Combat System

**File**: `src/systems/combat.js`

**Integrate defensive processing**:
```javascript
// When enemy attacks player
const incomingDamage = this.calculateDamage(enemy, player);
const { damage, counterDamage } = DefensiveSystem.processDefensiveEffect(incomingDamage, enemy);

player.stats.hp -= damage;

if (counterDamage > 0) {
    enemy.hp -= counterDamage;
    this.onLog(`⚔️ Counter attack dealt ${counterDamage} damage!`);
}
```

---

## Phase 3: Equipment System

### Goal:
Make equipment provide real stats, special effects, and durability that degrades on death.

### Implementation Steps:

#### Step 3.1: Update Equipment Configuration

**File**: `src/constants/config.js`

**Update ITEM_TYPES with stats**:

```javascript
ITEM_TYPES: {
    // WEAPONS
    sword: {
        name: { en: 'Sword', ar: 'سيف' },
        slot: 'weapon', icon: '🗡️',
        baseStats: { atk: 8 }
    },
    staff: {
        name: { en: 'Staff', ar: 'عصا' },
        slot: 'weapon', icon: '🪄',
        baseStats: { atk: 10 }
    },
    dagger: {
        name: { en: 'Dagger', ar: 'خنجر' },
        slot: 'weapon', icon: '🗡️',
        baseStats: { atk: 6, crit: 5 }
    },

    // ARMOR
    light_armor: {
        name: { en: 'Light Armor', ar: 'درع خفيف' },
        slot: 'armor', icon: '👕',
        baseStats: { def: 5, spd: 2 }
    },
    heavy_armor: {
        name: { en: 'Heavy Armor', ar: 'درع ثقيل' },
        slot: 'armor', icon: '🛡️',
        baseStats: { def: 12, hp: 20 }
    },

    // ACCESSORIES
    ring: {
        name: { en: 'Ring', ar: 'خاتم' },
        slot: 'accessory', icon: '💍',
        baseStats: { /* varies by effect */ }
    },
    amulet: {
        name: { en: 'Amulet', ar: 'تميمة' },
        slot: 'accessory', icon: '📿',
        baseStats: { /* varies by effect */ }
    }
}
```

**Add equipment special effects**:

```javascript
EQUIPMENT_EFFECTS: {
    // Weapon effects
    'vampiric': {
        name: { en: 'Vampiric', ar: 'مصاص دماء' },
        description: { en: 'Heal 15% of damage dealt as HP', ar: 'استعد 15% من الضرر كصحة' },
        type: 'on_damage_dealt',
        value: 0.15
    },
    'flaming': {
        name: { en: 'Flaming', ar: 'ملتهب' },
        description: { en: '+20% fire damage', ar: '+20% ضرر ناري' },
        type: 'damage_bonus',
        element: 'fire',
        value: 0.20
    },
    'frost': {
        name: { en: 'Frost', ar: 'صقيع' },
        description: { en: 'Attacks slow enemies (-20% SPD)', ar: 'الهجمات تبطئ الأعداء (-20% سرعة)' },
        type: 'on_hit_debuff',
        stat: 'spd',
        value: 0.8
    },

    // Armor effects
    'spiked': {
        name: { en: 'Spiked', ar: 'مسنن' },
        description: { en: 'Reflect 12% of damage taken', ar: 'عكس 12% من الضرر المتلقى' },
        type: 'damage_reflection',
        value: 0.12
    },
    'regenerating': {
        name: { en: 'Regenerating', ar: 'متجدد' },
        description: { en: '+8 HP regeneration per turn', ar: '+8 تجديد صحة لكل دور' },
        type: 'hp_regen',
        value: 8
    },

    // Accessory effects
    'resourceful': {
        name: { en: 'Resourceful', ar: 'موارد' },
        description: { en: '+20% max resource', ar: '+20% مورد أقصى' },
        type: 'resource_bonus',
        value: 0.20
    },
    'lucky': {
        name: { en: 'Lucky', ar: 'محظوظ' },
        description: { en: '+15% rare drop chance', ar: '+15% فرصة إسقاط نادر' },
        type: 'drop_bonus',
        value: 0.15
    }
}
```

#### Step 3.2: Create Equipment System

**File**: `src/systems/equipment.js` (NEW)

```javascript
// filename: src/systems/equipment.js

import { GameState } from '../core/state.js';
import { GameConfig } from '../constants/config.js';
import Logger from '../core/logger.js';

/**
 * Equipment system with stats, effects, and durability
 */
export class EquipmentSystem {

    /**
     * Generate equipment with rarity and stats
     */
    static generateEquipment(itemType, rarity = null) {
        if (!rarity) {
            rarity = this.rollRarity();
        }

        const itemConfig = GameConfig.ITEM_TYPES[itemType];
        const rarityConfig = GameConfig.RARITIES[rarity];

        if (!itemConfig || !rarityConfig) {
            Logger.log('Invalid item or rarity', 'ERROR');
            return null;
        }

        // Calculate stats with rarity multiplier
        const stats = {};
        Object.entries(itemConfig.baseStats).forEach(([stat, value]) => {
            stats[stat] = Math.floor(value * rarityConfig.statMult);
        });

        // Roll special effect for Rare+ items
        let specialEffect = null;
        if (rarity === 'rare' || rarity === 'epic' || rarity === 'mythic' || rarity === 'legendary') {
            specialEffect = this.rollSpecialEffect(itemConfig.slot);
        }

        return {
            id: `${itemType}_${Date.now()}_${Math.random()}`,
            type: itemType,
            name: itemConfig.name,
            icon: itemConfig.icon,
            slot: itemConfig.slot,
            rarity,
            stats,
            specialEffect,
            durability: 100,
            maxDurability: 100
        };
    }

    /**
     * Roll rarity based on drop chances
     */
    static rollRarity() {
        const roll = Math.random() * 100;
        let cumulative = 0;

        const rarities = ['legendary', 'mythic', 'epic', 'rare', 'uncommon', 'common'];

        for (const rarity of rarities) {
            const config = GameConfig.RARITIES[rarity];
            cumulative += config.chance;
            if (roll <= cumulative) {
                return rarity;
            }
        }

        return 'common';
    }

    /**
     * Roll special effect based on equipment slot
     */
    static rollSpecialEffect(slot) {
        const effectPool = Object.keys(GameConfig.EQUIPMENT_EFFECTS).filter(key => {
            const effect = GameConfig.EQUIPMENT_EFFECTS[key];
            // Filter effects appropriate for slot
            if (slot === 'weapon') {
                return ['on_damage_dealt', 'damage_bonus', 'on_hit_debuff'].includes(effect.type);
            } else if (slot === 'armor') {
                return ['damage_reflection', 'hp_regen', 'damage_reduction'].includes(effect.type);
            } else {
                return ['resource_bonus', 'drop_bonus', 'stat_bonus'].includes(effect.type);
            }
        });

        if (effectPool.length === 0) return null;

        const effectKey = effectPool[Math.floor(Math.random() * effectPool.length)];
        return {
            key: effectKey,
            ...GameConfig.EQUIPMENT_EFFECTS[effectKey]
        };
    }

    /**
     * Equip item to player
     */
    static equipItem(item) {
        const player = GameState.current.player;

        if (!player.equipment) {
            player.equipment = {};
        }

        // Unequip existing item in slot
        if (player.equipment[item.slot]) {
            this.unequipItem(item.slot);
        }

        // Equip new item
        player.equipment[item.slot] = item;

        // Apply stat bonuses
        this.recalculateStats();

        Logger.log(`Equipped ${item.name.en} to ${item.slot}`, 'SYSTEM');
        GameState._notify();
    }

    /**
     * Unequip item from slot
     */
    static unequipItem(slot) {
        const player = GameState.current.player;
        if (player.equipment && player.equipment[slot]) {
            delete player.equipment[slot];
            this.recalculateStats();
            GameState._notify();
        }
    }

    /**
     * Recalculate player stats based on equipment
     */
    static recalculateStats() {
        const player = GameState.current.player;

        // Reset to base stats (stored separately)
        if (!player.baseStats) {
            // First time - store current stats as base
            player.baseStats = { ...player.stats };
        }

        player.stats = { ...player.baseStats };

        // Apply equipment bonuses
        if (player.equipment) {
            Object.values(player.equipment).forEach(item => {
                // Only apply stats if durability > 0
                if (item.durability > 0) {
                    Object.entries(item.stats).forEach(([stat, value]) => {
                        player.stats[stat] = (player.stats[stat] || 0) + value;
                    });
                }
            });
        }

        GameState._notify();
    }

    /**
     * Apply durability damage on death
     */
    static applyDeathPenalty() {
        const player = GameState.current.player;

        if (!player.equipment) return;

        Object.values(player.equipment).forEach(item => {
            // Lose 25-50% durability (random)
            const loss = Math.floor(item.maxDurability * (0.25 + Math.random() * 0.25));
            item.durability = Math.max(0, item.durability - loss);

            Logger.log(`${item.name.en} durability: ${item.durability + loss} → ${item.durability}`, 'SYSTEM');
        });

        // Recalculate stats (broken items provide 0 stats)
        this.recalculateStats();
        GameState._notify();
    }

    /**
     * Repair equipment at shop
     */
    static repairEquipment(item, cost) {
        const player = GameState.current.player;

        if (player.gold < cost) {
            Logger.log('Not enough gold to repair', 'ERROR');
            return false;
        }

        player.gold -= cost;
        item.durability = item.maxDurability;

        // Recalculate stats
        this.recalculateStats();

        Logger.log(`Repaired ${item.name.en} for ${cost} gold`, 'SYSTEM');
        GameState._notify();
        return true;
    }

    /**
     * Get repair cost for item
     */
    static getRepairCost(item) {
        const costs = {
            common: 20,
            uncommon: 50,
            rare: 100,
            epic: 200,
            mythic: 400,
            legendary: 800
        };

        return costs[item.rarity] || 50;
    }

    /**
     * Process equipment effects during combat
     */
    static processEffects(timing, context = {}) {
        const player = GameState.current.player;
        if (!player.equipment) return;

        Object.values(player.equipment).forEach(item => {
            if (item.durability <= 0 || !item.specialEffect) return;

            const effect = item.specialEffect;

            switch (timing) {
                case 'damage_dealt':
                    if (effect.type === 'on_damage_dealt' && context.damage) {
                        // Vampiric healing
                        const heal = Math.floor(context.damage * effect.value);
                        player.stats.hp = Math.min(player.maxStats.hp, player.stats.hp + heal);
                        if (context.onLog) {
                            context.onLog(`${item.icon} ${effect.name.en}: Healed ${heal} HP`);
                        }
                    }
                    break;

                case 'damage_taken':
                    if (effect.type === 'damage_reflection' && context.damage) {
                        // Reflect damage back to attacker
                        const reflect = Math.floor(context.damage * effect.value);
                        context.attacker.hp -= reflect;
                        if (context.onLog) {
                            context.onLog(`${item.icon} ${effect.name.en}: Reflected ${reflect} damage`);
                        }
                    }
                    break;

                case 'turn_start':
                    if (effect.type === 'hp_regen') {
                        const regen = Math.min(effect.value, player.maxStats.hp - player.stats.hp);
                        player.stats.hp += regen;
                        if (context.onLog && regen > 0) {
                            context.onLog(`${item.icon} ${effect.name.en}: +${regen} HP`);
                        }
                    }
                    break;
            }
        });

        GameState._notify();
    }
}
```

#### Step 3.3: Update Shop Screen

**File**: `src/components/shop-screen.jsx`

**Add repair functionality**:

```jsx
// Repair section
<div className="repair-section">
    <h3>{t('shop.repair_equipment')}</h3>

    {Object.entries(player.equipment || {}).map(([slot, item]) => {
        const repairCost = EquipmentSystem.getRepairCost(item);
        const needsRepair = item.durability < item.maxDurability;

        if (!needsRepair) return null;

        return (
            <div key={slot} className="repair-item">
                {item.icon} {item.name[lang]}
                <div>Durability: {item.durability}/{item.maxDurability}</div>
                <button
                    onClick={() => handleRepair(item, repairCost)}
                    disabled={player.gold < repairCost}
                >
                    Repair ({repairCost} gold)
                </button>
            </div>
        );
    })}
</div>
```

---

## Testing & Balance

### Testing Checklist:

**Phase 1 Testing**:
- [ ] All 24 abilities function correctly
- [ ] Abilities unlock at correct levels
- [ ] Cooldowns work properly
- [ ] Ability costs balanced (not too cheap/expensive)
- [ ] Level 18 reached by floor 15-20
- [ ] UI shows all abilities clearly

**Phase 2 Testing**:
- [ ] Defensive actions cost correct % resource
- [ ] Block reduces damage by 50%
- [ ] Dodge 70% success rate
- [ ] Counter deals damage back
- [ ] Parry stuns enemy on success
- [ ] Cooldowns prevent spamming
- [ ] UI toggle works smoothly

**Phase 3 Testing**:
- [ ] Equipment provides stats correctly
- [ ] Broken equipment (0 durability) gives 0 stats
- [ ] Durability loss on death (25-50%)
- [ ] Repair costs scale properly
- [ ] Special effects trigger correctly
- [ ] Equipment drops from treasure/bosses
- [ ] UI shows durability clearly

### Balance Simulation:

Run updated simulator with all new systems:
- 8 abilities per character
- Defensive action usage (15-25% of turns)
- Equipment impact on survival
- Resource costs balanced for 4 base regen

**Target Metrics**:
- Win rate: 25-35%
- Average death floor: 8-12
- Ability usage: 40-50% of turns
- Defensive usage: 15-25% of turns
- Equipment matters: +10-15% win rate with good gear

---

## File-by-File Implementation

### Files to Create:
1. `src/systems/abilities.js` - Ability unlock and cooldown management
2. `src/systems/defensive.js` - Defensive action system
3. `src/systems/equipment.js` - Equipment with stats/effects/durability

### Files to Modify:
1. `src/constants/config.js` - Add all abilities, defensive actions, equipment effects
2. `src/constants/characters.js` - Add ability lists per character
3. `src/components/battle-screen.jsx` - Update UI for 8 abilities + defensive panel
4. `src/systems/combat.js` - Integrate abilities, defensive actions, equipment effects
5. `src/components/shop-screen.jsx` - Add equipment repair functionality
6. `src/App.jsx` - Handle equipment drops from treasure/bosses

### Files to Update (Minor):
1. `src/core/state.js` - Add equipment, cooldowns to state structure
2. `public/locales/en.json` - Add translations for new abilities/actions
3. `public/locales/ar.json` - Add Arabic translations

---

## Success Criteria

### MVP is Complete When:

✅ **Abilities**: All 24 abilities implemented and tested
✅ **Progression**: Abilities unlock at correct levels with visual feedback
✅ **Defensive Actions**: Block, Dodge, Counter, Parry all functional
✅ **Equipment**: Stats, effects, and durability all working
✅ **Shop**: Can repair equipment at shop
✅ **Balance**: Win rate 25-35%, ability usage 40-50%, defensive 15-25%
✅ **Polish**: UI clean, no bugs, smooth gameplay
✅ **Documentation**: All code documented, README updated

### Post-MVP Enhancements:

🔮 **Phase 4**: Combo system (ability chains)
🔮 **Phase 5**: Talent trees (persistent upgrades)
🔮 **Phase 6**: Equipment upgrading/enchanting
🔮 **Phase 7**: More enemy variety and mechanics

---

## Next Steps

1. **Review this plan** - Confirm scope and approach
2. **Start Phase 1** - Begin with abilities (biggest impact)
3. **Test each phase** before moving to next
4. **Update documentation** as we go
5. **Run simulations** after Phase 3 complete

**Ready to begin Phase 1?**

---

**Document Version**: 1.0
**Last Updated**: 2025-10-01
**Status**: Ready for Implementation
**Estimated Timeline**: 3-4 weeks to MVP
