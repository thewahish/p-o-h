# PHASE 1 IMPLEMENTATION STATUS
**Path of Heroes - Expanded Abilities System**

**Status**: Foundation Complete, Ready for UI Integration
**Last Updated**: 2025-10-01
**Version**: Phase 1 - Partial (40% Complete)

---

## Table of Contents
1. [Quick Summary](#quick-summary)
2. [What's Been Completed](#whats-been-completed)
3. [What's Remaining](#whats-remaining)
4. [Files Modified](#files-modified)
5. [Next Steps - Detailed Instructions](#next-steps---detailed-instructions)
6. [Testing Checklist](#testing-checklist)
7. [Known Issues](#known-issues)

---

## Quick Summary

### ✅ Completed (40%):
- **24 abilities fully defined** in `config.js` with all stats, costs, cooldowns, effects
- **Character ability mappings** - all 3 characters have 8 abilities assigned
- **AbilitySystem class created** - complete system for unlocks, cooldowns, level progression
- **Design documentation complete** - GAME_DEPTH_REDESIGN.md (600+ lines)
- **MVP plan complete** - MVP_IMPLEMENTATION_PLAN.md (900+ lines)

### ⏸️ Remaining (60%):
- **Battle UI update** - Display 8 abilities, cooldowns, unlock indicators
- **Combat system integration** - Handle new ability effects, cooldowns
- **Translations** - Add new ability names to locale files
- **Testing** - Verify all abilities work correctly
- **Balance** - Ensure costs/cooldowns feel right

---

## What's Been Completed

### 1. GameConfig - All 24 Abilities Defined ✅

**File**: `src/constants/config.js` (Lines 110-294)

**Warriors (Taha) - 8 Abilities**:
1. **Power Strike** (Lvl 1) - 8 cost, 150% damage
2. **Defensive Stance** (Lvl 1) - 10 cost, +50% DEF + 5 HP regen, 3 turn CD
3. **Shield Bash** (Lvl 3) - 12 cost, 90% damage + weaken ATK
4. **Battle Cry** (Lvl 6) - 15 cost, +25% ATK + 2 SPD, 4 turn CD
5. **Whirlwind Attack** (Lvl 9) - 20 cost, 70% AoE damage
6. **Iron Will** (Lvl 12) - 25 cost, heal 30 HP + resistance, 5 turn CD
7. **Execute** (Lvl 15) - 18 cost, 200% damage (+100% if enemy <30% HP), 2 turn CD
8. **Last Stand** (Lvl 18) - 40 cost, 250% AoE + 20% lifesteal, 6 turn CD

**Sorceress (Mais) - 8 Abilities**:
1. **Magic Missile** (Lvl 1) - 8 cost, 140% damage, never misses
2. **Mana Shield** (Lvl 1) - 12 cost, absorb 40 damage, 4 turn CD
3. **Fireball** (Lvl 3) - 20 cost, 80% AoE damage
4. **Ice Shard** (Lvl 6) - 15 cost, 120% damage + slow
5. **Lightning Bolt** (Lvl 9) - 18 cost, 180% damage + 40% crit bonus, 2 turn CD
6. **Arcane Intellect** (Lvl 12) - 25 cost, +40% ATK + 20 max mana (once per battle)
7. **Meteor** (Lvl 15) - 35 cost, 120% AoE + burn DoT, 4 turn CD
8. **Time Warp** (Lvl 18) - 50 cost, extra turn + restore 20 resource, 7 turn CD

**Rogue (Ibrahim) - 8 Abilities**:
1. **Quick Strike** (Lvl 1) - 7 cost, 130% damage + 20% crit bonus
2. **Evasion** (Lvl 1) - 10 cost, +40% dodge for 2 turns, 4 turn CD
3. **Venom Strike** (Lvl 3) - 15 cost, 130% damage + 10 poison/turn
4. **Shadow Step** (Lvl 6) - 12 cost, next attack +60% damage + can't miss, 3 turn CD
5. **Fan of Knives** (Lvl 9) - 20 cost, 60% AoE + 5 poison/turn
6. **Deadly Precision** (Lvl 12) - 25 cost, +50% crit + 30% crit damage, 5 turn CD
7. **Backstab** (Lvl 15) - 22 cost, 250% damage, guaranteed crit, 3 turn CD
8. **Death Mark** (Lvl 18) - 45 cost, mark enemy (+50% damage taken), 6 turn CD

**Key Features**:
- All abilities have `unlockLevel` property (1, 3, 6, 9, 12, 15, 18)
- Cooldown system built-in (`cooldown` property)
- Multiple effect types: buffs, debuffs, DoT, AoE, healing, shields
- Balanced costs (7-50 resource)

---

### 2. Character Ability Mappings ✅

**File**: `src/constants/characters.js` (Lines 30-117)

**Changes Made**:
```javascript
// BEFORE (old system):
abilities: ['shield_bash']  // Only 1 ability

// AFTER (new system):
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
```

All 3 characters (Warrior, Sorceress, Rogue) now have 8 abilities defined in order.

---

### 3. AbilitySystem Class Created ✅

**File**: `src/systems/abilities.js` (NEW - 200 lines)

**Complete API**:

```javascript
// Get abilities available at current level
AbilitySystem.getAvailableAbilities()
// Returns: ['power_strike', 'defensive_stance', 'shield_bash', ...]

// Get ability details
AbilitySystem.getAbility('power_strike')
// Returns: { name, cost, damageMultiplier, ... }

// Cooldown management
AbilitySystem.getCooldownRemaining('shield_bash')  // Returns: number of turns
AbilitySystem.setCooldown('shield_bash', 3)        // Set 3 turn cooldown
AbilitySystem.tickCooldowns()                      // Reduce all by 1 turn

// Check unlocks
AbilitySystem.isUnlocked('execute')  // Returns: boolean
AbilitySystem.getNextUnlock()        // Returns: { abilityKey, ability, level }
AbilitySystem.checkNewUnlocks(6)     // Returns: ['battle_cry'] if just hit level 6

// Display helpers
AbilitySystem.getAllAbilitiesForDisplay()
// Returns: [{ key, ability, unlocked, cooldown }, ...]

// Lifecycle
AbilitySystem.initialize()        // Call on new game
AbilitySystem.clearCooldowns()    // Call on battle end
```

**Features**:
- Level-based unlocking (checks player level vs ability unlockLevel)
- Cooldown tracking per ability
- "New ability unlocked!" detection on level up
- Full display data for UI (locked/unlocked state, cooldowns)
- Comprehensive logging for debugging

---

## What's Remaining

### 4. Battle Screen UI Update ⏸️

**File**: `src/components/battle-screen.jsx` (NEEDS MAJOR UPDATE)

**Current State**:
- Only shows 2 ability buttons (Attack + 1 skill)
- No cooldown indicators
- No locked ability display
- No "NEW ABILITY" notifications

**Required Changes**:

#### A. Import AbilitySystem
```javascript
import { AbilitySystem } from '../systems/abilities';
```

#### B. Get Available Abilities
```javascript
const availableAbilities = AbilitySystem.getAvailableAbilities();
```

#### C. Update UI to Display 8 Abilities

**Current Button Section** (around line 150-200):
```jsx
{/* OLD CODE - 2 buttons */}
<button onClick={handleAttack}>Attack</button>
<button onClick={handleSkill}>Shield Bash</button>
```

**NEW CODE - 8 Ability Grid**:
```jsx
{/* Abilities Section */}
<div className="abilities-grid grid grid-cols-2 gap-2 p-4">
    {availableAbilities.map(abilityKey => {
        const ability = AbilitySystem.getAbility(abilityKey);
        const cooldown = AbilitySystem.getCooldownRemaining(abilityKey);
        const canAfford = player.resource.current >= ability.cost;
        const isDisabled = cooldown > 0 || !canAfford || !isPlayerTurn;

        return (
            <button
                key={abilityKey}
                onClick={() => handleAbilityClick(abilityKey)}
                disabled={isDisabled}
                className={`
                    relative p-3 rounded-lg border-2
                    ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
                    ${cooldown > 0 ? 'border-red-500' : 'border-primary'}
                    bg-secondary text-white
                `}
            >
                {/* Ability Name */}
                <div className="text-sm font-bold">
                    {typeof ability.name === 'object'
                        ? ability.name[Localization.getCurrentLanguage()]
                        : ability.name}
                </div>

                {/* Resource Cost */}
                <div className="text-xs opacity-75 mt-1">
                    Cost: {ability.cost}
                </div>

                {/* Cooldown Overlay */}
                {cooldown > 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 rounded-lg">
                        <span className="text-2xl font-bold">{cooldown}</span>
                    </div>
                )}
            </button>
        );
    })}
</div>
```

#### D. Add Ability Click Handler
```javascript
const handleAbilityClick = (abilityKey) => {
    if (!isPlayerTurn) return;

    const ability = AbilitySystem.getAbility(abilityKey);

    // Check if can afford
    if (player.resource.current < ability.cost) {
        Logger.log('Not enough resource!', 'UI');
        return;
    }

    // Check cooldown
    if (AbilitySystem.getCooldownRemaining(abilityKey) > 0) {
        Logger.log('Ability on cooldown!', 'UI');
        return;
    }

    // Use ability
    combatSystem.playerUseAbility(abilityKey, focusedTargetId);
};
```

#### E. Show Locked Abilities (Optional)
```jsx
{/* Show next unlock preview */}
{(() => {
    const nextUnlock = AbilitySystem.getNextUnlock();
    if (nextUnlock) {
        return (
            <div className="next-unlock-preview p-2 bg-gray-800 rounded mt-2">
                <div className="text-xs opacity-75">
                    🔒 Next Unlock (Level {nextUnlock.level}):
                </div>
                <div className="text-sm">
                    {nextUnlock.ability.name[Localization.getCurrentLanguage()]}
                </div>
            </div>
        );
    }
})()}
```

#### F. "New Ability Unlocked!" Notification

**Add state for notification**:
```javascript
const [newAbilityUnlocked, setNewAbilityUnlocked] = useState(null);

useEffect(() => {
    // Check for level up in combat log
    const lastLog = combatLog[combatLog.length - 1] || '';
    if (lastLog.includes('Level Up!')) {
        const newAbilities = AbilitySystem.checkNewUnlocks(player.level);
        if (newAbilities.length > 0) {
            setNewAbilityUnlocked(newAbilities[0]); // Show first unlocked
            setTimeout(() => setNewAbilityUnlocked(null), 3000); // Clear after 3s
        }
    }
}, [combatLog, player.level]);
```

**Display notification**:
```jsx
{newAbilityUnlocked && (
    <div className="new-ability-notification absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-primary text-white px-6 py-3 rounded-lg shadow-lg animate-bounce">
        <div className="text-lg font-bold">✨ NEW ABILITY UNLOCKED! ✨</div>
        <div>{AbilitySystem.getAbility(newAbilityUnlocked).name[Localization.getCurrentLanguage()]}</div>
    </div>
)}
```

---

### 5. Combat System Integration ⏸️

**File**: `src/systems/combat.js` (NEEDS UPDATES)

**Current State**:
- Has `playerSkill()` method for single hardcoded skill
- No cooldown support
- No support for new ability effects (shields, DoT, buffs, etc.)

**Required Changes**:

#### A. Import AbilitySystem
```javascript
import { AbilitySystem } from './abilities.js';
```

#### B. Replace `playerSkill()` with `playerUseAbility()`

**FIND** (around line 200-250):
```javascript
playerSkill(targetIndex) {
    // Old hardcoded skill logic
}
```

**REPLACE WITH**:
```javascript
/**
 * Player uses an ability by key
 * @param {string} abilityKey - The ability to use
 * @param {number} targetIndex - Target enemy index
 */
playerUseAbility(abilityKey, targetIndex) {
    const player = GameState.current.player;
    const ability = AbilitySystem.getAbility(abilityKey);

    if (!ability) {
        Logger.log(`[COMBAT] Invalid ability: ${abilityKey}`, 'ERROR');
        return;
    }

    // Check cooldown
    if (AbilitySystem.getCooldownRemaining(abilityKey) > 0) {
        this.onLog(`Ability on cooldown!`);
        return;
    }

    // Check resource cost
    if (player.resource.current < ability.cost) {
        this.onLog(`Not enough ${t(player.resource.nameKey)}!`);
        return;
    }

    // Spend resource
    player.resource.current -= ability.cost;

    // Set cooldown if ability has one
    if (ability.cooldown) {
        AbilitySystem.setCooldown(abilityKey, ability.cooldown);
    }

    // Get ability name for logging
    const abilityName = typeof ability.name === 'object'
        ? ability.name[Localization.getCurrentLanguage()]
        : ability.name;

    this.onLog(`Used ${abilityName}!`);

    // Handle ability based on type
    switch (ability.type) {
        case 'attack':
            this.handleAttackAbility(ability, targetIndex);
            break;
        case 'attack_aoe':
            this.handleAoEAbility(ability);
            break;
        case 'attack_debuff':
            this.handleAttackDebuffAbility(ability, targetIndex);
            break;
        case 'attack_dot':
            this.handleDoTAbility(ability, targetIndex);
            break;
        case 'buff':
            this.handleBuffAbility(ability);
            break;
        case 'heal_buff':
            this.handleHealBuffAbility(ability);
            break;
        case 'utility':
            this.handleUtilityAbility(ability);
            break;
        default:
            Logger.log(`[COMBAT] Unknown ability type: ${ability.type}`, 'ERROR');
    }

    // Process turn
    this.processTurn();
}
```

#### C. Add Ability Effect Handlers

**Add these new methods to CombatSystem class**:

```javascript
/**
 * Handle basic attack ability
 */
handleAttackAbility(ability, targetIndex) {
    const enemies = GameState.current.enemies;
    const target = enemies.find(e => e.originalIndex === targetIndex);
    if (!target || !target.isAlive) return;

    const player = GameState.current.player;

    // Calculate damage with multiplier
    let damage = this.calculateDamage(player, target);
    damage = Math.floor(damage * ability.damageMultiplier);

    // Apply crit boost if ability has it
    if (ability.effect?.type === 'crit_boost') {
        const baseCrit = player.stats?.crit || player.crit || 0;
        const boostedCrit = baseCrit + ability.effect.bonus;
        if (Math.random() * 100 < boostedCrit) {
            damage = Math.floor(damage * 1.6);
            this.onLog(`💥 Critical Hit!`);
        }
    }

    // Guaranteed crit
    if (ability.guaranteedCrit) {
        damage = Math.floor(damage * 1.6);
        this.onLog(`💥 Critical Hit!`);
    }

    // Execute bonus
    if (ability.effect?.type === 'execute') {
        const hpPercent = target.hp / target.maxHp;
        if (hpPercent < ability.effect.threshold) {
            damage = Math.floor(damage * (1 + ability.effect.bonusMultiplier));
            this.onLog(`⚔️ Execute! Bonus damage!`);
        }
    }

    target.hp -= damage;
    this.onLog(`Dealt ${damage} damage to ${target.name}!`);

    if (target.hp <= 0) {
        target.isAlive = false;
        this.onLog(`${target.name} defeated!`);
    }

    // Vampiric healing
    if (ability.effect?.type === 'vampiric') {
        const heal = Math.floor(damage * (ability.effect.percentage / 100));
        player.stats.hp = Math.min(player.maxStats.hp, player.stats.hp + heal);
        this.onLog(`Healed ${heal} HP from lifesteal!`);
    }
}

/**
 * Handle AoE ability
 */
handleAoEAbility(ability) {
    const enemies = GameState.current.enemies.filter(e => e.isAlive);
    const player = GameState.current.player;

    enemies.forEach(target => {
        let damage = this.calculateDamage(player, target);
        damage = Math.floor(damage * ability.damageMultiplier);

        target.hp -= damage;
        this.onLog(`Dealt ${damage} damage to ${target.name}!`);

        if (target.hp <= 0) {
            target.isAlive = false;
            this.onLog(`${target.name} defeated!`);
        }

        // Apply DoT effects (burn, poison)
        if (ability.effect?.type === 'poison' || ability.effect?.type === 'burn') {
            if (!target.statusEffects) target.statusEffects = [];
            target.statusEffects.push({
                type: ability.effect.type,
                damage: ability.effect.damage || 0,
                duration: ability.effect.duration,
                icon: ability.effect.icon
            });
            this.onLog(`${target.name} is ${ability.effect.type}ed!`);
        }
    });

    // Vampiric healing for AoE
    if (ability.effect?.type === 'vampiric') {
        const totalDamage = enemies.reduce((sum, e) => {
            const dmg = Math.floor(this.calculateDamage(player, e) * ability.damageMultiplier);
            return sum + dmg;
        }, 0);
        const heal = Math.floor(totalDamage * (ability.effect.percentage / 100));
        player.stats.hp = Math.min(player.maxStats.hp, player.stats.hp + heal);
        this.onLog(`Healed ${heal} HP from lifesteal!`);
    }
}

/**
 * Handle buff ability (self-buffs like Defensive Stance, Battle Cry)
 */
handleBuffAbility(ability) {
    const player = GameState.current.player;

    if (!player.activeBuffs) player.activeBuffs = [];

    // Apply buff
    player.activeBuffs.push({
        source: ability.name,
        effect: ability.effect,
        remainingTurns: ability.effect.duration
    });

    const abilityName = typeof ability.name === 'object'
        ? ability.name[Localization.getCurrentLanguage()]
        : ability.name;

    this.onLog(`${ability.effect.icon} ${abilityName} activated!`);
}

/**
 * Handle heal + buff ability (Iron Will)
 */
handleHealBuffAbility(ability) {
    const player = GameState.current.player;

    // Heal
    if (ability.healAmount) {
        player.stats.hp = Math.min(player.maxStats.hp, player.stats.hp + ability.healAmount);
        this.onLog(`Healed ${ability.healAmount} HP!`);
    }

    // Apply buff if exists
    if (ability.effect) {
        if (!player.activeBuffs) player.activeBuffs = [];
        player.activeBuffs.push({
            source: ability.name,
            effect: ability.effect,
            remainingTurns: ability.effect.duration
        });
    }
}

/**
 * Handle utility abilities (Time Warp)
 */
handleUtilityAbility(ability) {
    const player = GameState.current.player;

    if (ability.effect.type === 'extra_turn') {
        // Restore resource
        player.resource.current = Math.min(
            player.resource.max,
            player.resource.current + ability.effect.resourceRestore
        );
        this.onLog(`⏰ Time Warp! Take another turn!`);

        // Note: Extra turn implementation would need special handling
        // For now, just restore resource
    }
}
```

#### D. Tick Cooldowns at Start of Player Turn

**FIND** `processTurn()` method, add at start of player turn:

```javascript
processTurn() {
    // At start of player turn, tick cooldowns
    if (this.isPlayerTurn()) {
        AbilitySystem.tickCooldowns();

        // ... rest of player turn logic
    }
}
```

---

### 6. Translations ⏸️

**Files**:
- `public/locales/en.json`
- `public/locales/ar.json`

**Required**: Add translations for all new ability names (already in config.js as objects, so translations are embedded).

**No action needed** - abilities already have bilingual names in config!

---

### 7. Testing ⏸️

**Manual Testing Checklist**:
- [ ] Start new game, verify only 2 abilities shown at level 1
- [ ] Level up to 3, verify Shield Bash/Fireball/Venom Strike unlocks
- [ ] Use ability with cooldown, verify cooldown timer appears
- [ ] Verify cooldown counts down each turn
- [ ] Level to 6, 9, 12, 15, 18 - verify all abilities unlock
- [ ] Test all 24 abilities damage/effects work correctly
- [ ] Verify "New Ability Unlocked!" notification appears
- [ ] Check resource costs are deducted properly
- [ ] Verify abilities respect cooldowns (can't use while on CD)

---

## Files Modified

### ✅ Completed Files:
1. **src/constants/config.js** - Added 24 abilities (lines 110-294)
2. **src/constants/characters.js** - Updated all 3 character ability arrays
3. **src/systems/abilities.js** - NEW FILE - Complete ability system (200 lines)

### ⏸️ Files Still Needing Updates:
4. **src/components/battle-screen.jsx** - UI update for 8 abilities + cooldowns
5. **src/systems/combat.js** - Replace playerSkill() with playerUseAbility(), add effect handlers

### 📄 Reference Files (No Changes Needed):
- **public/locales/en.json** - Abilities already have embedded translations
- **public/locales/ar.json** - Abilities already have embedded translations

---

## Next Steps - Detailed Instructions

### Step 1: Update Battle Screen UI (1-2 hours)

**File**: `src/components/battle-screen.jsx`

1. **Import AbilitySystem** at top of file:
   ```javascript
   import { AbilitySystem } from '../systems/abilities';
   ```

2. **Get available abilities** in component:
   ```javascript
   const availableAbilities = AbilitySystem.getAvailableAbilities();
   ```

3. **Replace current skill buttons** with 8-ability grid (see section 4.C above for complete code)

4. **Add ability click handler** (see section 4.D above)

5. **Add "New Ability" notification** (see section 4.F above)

6. **Test in browser** - verify abilities display correctly

### Step 2: Update Combat System (2-3 hours)

**File**: `src/systems/combat.js`

1. **Import AbilitySystem** at top
2. **Replace `playerSkill()`** method with `playerUseAbility()` (see section 5.B above)
3. **Add all effect handler methods** (see section 5.C above - 6 new methods)
4. **Add cooldown ticking** in processTurn() (see section 5.D above)
5. **Test in game** - use abilities and verify effects work

### Step 3: Test Everything (1-2 hours)

1. Start new game with Warrior
2. Verify only Power Strike + Defensive Stance available at level 1
3. Use cheat code `3` to level up repeatedly
4. At level 3: Shield Bash unlocks (verify notification)
5. At level 6: Battle Cry unlocks
6. Continue to level 18: Last Stand unlocks
7. Test all 8 abilities:
   - Verify damage multipliers
   - Verify cooldowns work
   - Verify resource costs
   - Verify AoE hits all enemies
   - Verify buffs/debuffs apply
8. Repeat for Sorceress and Rogue

### Step 4: Balance Tweaking (1+ hour)

After testing, adjust in `config.js`:
- Ability costs (too expensive/cheap?)
- Cooldowns (too long/short?)
- Damage multipliers (too weak/strong?)
- Effect durations

### Step 5: Commit to Git

```bash
git add .
git commit -m "Phase 1: Expanded Abilities System

- Added 24 new abilities (8 per character) with unlock progression
- Created AbilitySystem for cooldowns and level-based unlocks
- Updated battle UI to display all available abilities
- Integrated cooldown system into combat
- Abilities unlock at levels 1, 3, 6, 9, 12, 15, 18

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

git push
```

---

## Testing Checklist

### Core Functionality:
- [ ] **Ability unlocking** - Abilities unlock at correct levels
- [ ] **UI display** - All available abilities shown, locked ones grayed/hidden
- [ ] **Resource costs** - Using ability deducts correct resource amount
- [ ] **Cooldowns** - Abilities go on cooldown after use
- [ ] **Cooldown ticking** - Cooldowns reduce by 1 each turn
- [ ] **Ability effects** - Damage multipliers, AoE, buffs, debuffs work
- [ ] **New ability notification** - "NEW ABILITY UNLOCKED!" appears on level up

### Per Character Testing:

**Warrior**:
- [ ] Power Strike - 150% single target damage
- [ ] Defensive Stance - +50% DEF, 5 HP regen, 2 turns
- [ ] Shield Bash - Damage + weaken ATK
- [ ] Battle Cry - +25% ATK, +2 SPD, 3 turns
- [ ] Whirlwind - AoE damage to all enemies
- [ ] Iron Will - Heal 30 + resistance buff
- [ ] Execute - 200% damage (+100% if enemy <30% HP)
- [ ] Last Stand - AoE damage + lifesteal

**Sorceress**:
- [ ] Magic Missile - 140% damage, never miss
- [ ] Mana Shield - Absorb 40 damage
- [ ] Fireball - AoE damage to all
- [ ] Ice Shard - Damage + slow enemy
- [ ] Lightning Bolt - High damage + crit boost
- [ ] Arcane Intellect - +40% ATK, +20 max mana (once per battle)
- [ ] Meteor - AoE + burn DoT
- [ ] Time Warp - Extra turn + restore resource

**Rogue**:
- [ ] Quick Strike - 130% damage + crit boost
- [ ] Evasion - +40% dodge for 2 turns
- [ ] Venom Strike - Damage + poison DoT
- [ ] Shadow Step - Next attack +60% damage, can't miss
- [ ] Fan of Knives - AoE + weak poison
- [ ] Deadly Precision - +50% crit, +30% crit damage
- [ ] Backstab - 250% guaranteed crit
- [ ] Death Mark - Mark enemy (+50% damage taken)

---

## Known Issues

### Current Issues:
1. **Battle UI not yet updated** - Still shows old 2-button system
2. **Combat system not yet integrated** - playerSkill() hardcoded to old ability
3. **No cooldown display** - UI doesn't show cooldown timers yet
4. **No unlock notifications** - "New Ability" popup not implemented

### Potential Future Issues:
1. **Balance concerns** - Costs/cooldowns may need tweaking after testing
2. **Effect stacking** - Multiple buffs might not stack correctly
3. **AoE targeting** - Need to verify all enemies hit properly
4. **DoT tracking** - Poison/burn effects need proper tracking system
5. **Extra turn** - Time Warp's extra turn mechanic needs special handling

---

## Summary

**Foundation is solid** ✅ - All abilities defined, system created, character mappings done.

**Next milestone**: Battle UI + Combat Integration (~4-6 hours of work)

**After that**: Phase 2 (Defensive Actions) and Phase 3 (Equipment System)

**Full MVP timeline**: ~3-4 weeks total (we're at ~40% of Phase 1)

---

**Document Version**: 1.0
**Created**: 2025-10-01
**Status**: Foundation Complete, Ready for UI Integration
**Next Session**: Start with Step 1 (Battle Screen UI Update)
