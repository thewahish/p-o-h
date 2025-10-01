# Weakness/Break + Ultimate Gauge System Design

## Overview
Two interconnected systems to make turn-based combat more engaging without requiring timing inputs.

---

## 1. WEAKNESS/BREAK SYSTEM

### Elemental Types
**7 Element Types:**
- **Physical** ⚔️ (normal attacks, physical abilities)
- **Fire** 🔥 (warrior AOE, burn damage)
- **Ice** ❄️ (sorceress freeze, slow)
- **Lightning** ⚡ (sorceress single-target burst)
- **Poison** ☠️ (rogue DoT)
- **Shadow** 🌑 (rogue stealth, assassinate)
- **Holy** ✨ (healing, cleanse - future)

### Enemy Weaknesses
Each enemy has **1-2 weaknesses** and **1 resistance**:

**Example Enemy Types:**
- **Goblin**: Weak to Fire/Lightning, Resists Physical
- **Slime**: Weak to Ice/Lightning, Resists Poison
- **Skeleton**: Weak to Holy/Fire, Resists Physical
- **Orc Brute**: Weak to Poison/Ice, Resists Fire
- **Wraith**: Weak to Holy/Physical, Resists Shadow

### Break Mechanics

**Break Bar (Toughness):**
- Displayed above enemy HP as a **shield icon + number**
- Starting Toughness = `50 + (floor * 10)` (e.g., Floor 1 = 60, Floor 5 = 100)
- Each weakness hit reduces toughness by **20 points**
- Normal hits reduce by **5 points** (slow break)
- Resistant hits reduce by **2 points** (very slow)

**When Broken (Toughness reaches 0):**
1. Enemy is **STUNNED** for 1 turn (skips next turn)
2. Takes **50% bonus damage** while stunned
3. Visual effect: "⚠️ BROKEN!" text, enemy shakes/flashes
4. Break damage: Instant damage based on element used
   - Fire Break: 30 burn damage over 2 turns
   - Ice Break: Freeze (skip turn) + 20 damage
   - Lightning Break: 40 instant damage
   - Poison Break: 15 damage per turn for 3 turns
   - Physical Break: 25 instant damage
   - Shadow Break: -30% DEF for 2 turns

**After Break:**
- Enemy recovers toughness to **50%** of max on their next turn
- Can be broken again

### Damage Modifiers
- **Weakness Hit**: 1.5x damage + 20 toughness damage
- **Normal Hit**: 1.0x damage + 5 toughness damage
- **Resistant Hit**: 0.75x damage + 2 toughness damage

---

## 2. ULTIMATE GAUGE SYSTEM

### Gauge Mechanics
**Ultimate Points (UP):**
- Max gauge: **100 UP**
- Starts at **0 UP** each battle
- Displayed as bar below HP (golden/glowing)

**Gaining Ultimate Points:**
- Basic Attack: +10 UP
- Use Ability: +15 UP
- Take Damage: +8 UP per hit
- Break Enemy: +25 UP (bonus)
- Ally Defeated (future): +50 UP
- Perfect Turn (no damage taken): +5 UP bonus

### Ultimate Abilities

**Each Character Gets 1 Ultimate:**

**Warrior (Taha) - "Titan's Wrath"** 🔥⚔️
- Cost: 100 UP
- Effect: Deal 300% damage to all enemies + self heal 30% max HP
- Element: Fire + Physical
- Visual: Screen shake, fire explosion effect

**Sorceress (Mais) - "Elemental Cataclysm"** ⚡❄️🔥
- Cost: 100 UP
- Effect: Deal 250% damage to all enemies, hits ALL weaknesses (always breaks)
- Element: Multi-elemental
- Visual: Swirling elemental vortex

**Rogue (Ibrahim) - "Shadow Assassination"** 🌑💀
- Cost: 100 UP
- Effect: Deal 500% damage to single target + apply Death Mark (enemies take +50% damage for 2 turns)
- Element: Shadow
- Visual: Screen goes dark, slash effect

### Ultimate Charge Display
**Visual Indicators:**
- 0-33 UP: Red bar, dim glow
- 34-66 UP: Orange bar, medium glow
- 67-99 UP: Yellow bar, bright glow, pulsing
- 100 UP: **READY!** Golden bar, intense pulse, button glows

---

## 3. ABILITY ELEMENT ASSIGNMENTS

### Warrior Abilities
- **Power Strike**: Physical ⚔️
- **Defensive Stance**: None (buff)
- **Shield Bash**: Physical ⚔️
- **Battle Cry**: None (buff)
- **Whirlwind Attack**: Physical ⚔️
- **Iron Will**: Holy ✨ (heal)
- **Execute**: Physical ⚔️
- **Last Stand**: Fire 🔥 (burning rage)

### Sorceress Abilities
- **Magic Missile**: Lightning ⚡
- **Mana Shield**: None (buff)
- **Fireball**: Fire 🔥
- **Ice Shard**: Ice ❄️
- **Lightning Bolt**: Lightning ⚡
- **Arcane Intellect**: None (buff)
- **Meteor**: Fire 🔥
- **Time Warp**: None (utility)

### Rogue Abilities
- **Quick Strike**: Physical ⚔️
- **Evasion**: None (buff)
- **Venom Strike**: Poison ☠️
- **Shadow Step**: Shadow 🌑
- **Fan of Knives**: Physical ⚔️ + Poison ☠️
- **Deadly Precision**: None (buff)
- **Backstab**: Shadow 🌑
- **Death Mark**: Shadow 🌑

### Basic Attacks
- All characters' basic attacks = **Physical** ⚔️

---

## 4. UI IMPLEMENTATION

### Enemy Display (Battle Screen)
```
┌──────────────────────────────┐
│  Goblin (Lv.3)               │
│  ❤️ HP: ▓▓▓▓▓▓▓░░░ 70/100   │
│  🛡️ Toughness: ▓▓▓░░ 40/60  │
│  Weak: 🔥❄️  Resist: ⚔️      │
└──────────────────────────────┘
```

### Player Ultimate Bar
```
┌──────────────────────────────┐
│  Ultimate: ⚡💥 READY!        │
│  ▓▓▓▓▓▓▓▓▓▓ 100/100          │
│  [USE ULTIMATE] ← Glowing!   │
└──────────────────────────────┘
```

### Break Effect Display
```
  ⚠️⚠️ GOBLIN BROKEN! ⚠️⚠️
  💥 Fire Break: 30 Burn DMG 💥
  Enemy Stunned! (50% Bonus DMG)
```

---

## 5. COMBAT FLOW EXAMPLE

**Turn 1:**
- Player uses Fireball (Fire 🔥) on Goblin (Weak: Fire)
- Damage: 45 * 1.5 = 67 damage (weakness!)
- Toughness: 60 → 40 (-20)
- Ultimate: 0 → 15 UP (+15 for ability)
- Log: "🔥 Weakness Hit! Goblin's toughness reduced!"

**Turn 2:**
- Enemy attacks player for 20 damage
- Ultimate: 15 → 23 UP (+8 for taking damage)

**Turn 3:**
- Player uses Ice Shard (Ice ❄️) on Goblin (Weak: Ice)
- Damage: 50 * 1.5 = 75 damage
- Toughness: 40 → 20 (-20)
- Ultimate: 23 → 38 UP (+15)
- Log: "❄️ Weakness Hit! Goblin nearly broken!"

**Turn 4:**
- Player basic attack (Physical ⚔️) on Goblin (Resist: Physical)
- Damage: 30 * 0.75 = 22 damage (resisted)
- Toughness: 20 → 18 (-2)
- Ultimate: 38 → 48 UP (+10)
- Log: "Goblin resisted the attack!"

**Turn 5:**
- Player uses Lightning Bolt (Lightning ⚡) - NOT a weakness
- Damage: 60 * 1.0 = 60 damage
- Toughness: 18 → 13 (-5)
- Ultimate: 48 → 63 UP (+15)

**Turn 6:**
- Player uses Fireball again (Fire 🔥 - weakness)
- Damage: 45 * 1.5 = 67 damage
- Toughness: 13 → 0 (BROKEN!)
- Ultimate: 63 → 88 UP (+15 ability + 25 break bonus = +40!)
- **BREAK EFFECT**:
  - "⚠️ GOBLIN BROKEN!"
  - Fire Break: 30 burn damage over 2 turns
  - Goblin stunned (skips next turn)
  - Takes 50% bonus damage

**Turn 7:** (Goblin skips - stunned)

**Turn 8:**
- Ultimate: 88 → 100 UP (from combat actions)
- **ULTIMATE READY!** Button glows
- Player activates "Titan's Wrath"
- Screen shakes, fire explosion
- Damage: 300% to all enemies
- Ultimate: 100 → 0 (consumed)
- Self heal 30% max HP

---

## 6. IMPLEMENTATION FILES

### New/Modified Files:
1. **src/systems/break-system.js** (NEW)
   - Break bar tracking
   - Toughness calculations
   - Break effects

2. **src/systems/ultimate-system.js** (NEW)
   - Ultimate gauge tracking
   - UP gain calculations
   - Ultimate ability execution

3. **src/constants/elements.js** (NEW)
   - Element types
   - Enemy weaknesses database
   - Ability element assignments

4. **src/systems/combat.js** (MODIFY)
   - Integrate weakness multipliers
   - Add break checks
   - Add UP gain triggers

5. **src/components/battle-screen.jsx** (MODIFY)
   - Display break bars
   - Display ultimate gauge
   - Add ultimate button
   - Show weakness indicators

---

## 7. BALANCE CONSIDERATIONS

### Preventing Ultimate Spam
- Ultimate only charges during combat
- Resets to 0 at start of each battle
- Cannot save UP between battles

### Break Bar Scaling
- Early game: Easier to break (lower toughness)
- Late game: Requires multiple weakness hits
- Boss enemies: 2x toughness (harder to break)
- Elite enemies: 1.5x toughness

### Strategic Depth
- Players must discover enemy weaknesses
- Team composition matters (bring varied elements)
- Save ultimate for critical moments (boss, tough fight)
- Break timing important (break before they attack)

---

## 8. FUTURE ENHANCEMENTS

**Phase 2:**
- Enemy shields (block break attempts)
- Multi-break bonuses (break multiple enemies = huge UP gain)
- Ultimate upgrades (via Soul Forge)
- Elemental reactions (Fire + Ice = Steam explosion)
- Weakness indicators (show after first hit)

---

## SUMMARY

**Weakness/Break System:**
- Strategic depth through elemental matchups
- Visual satisfaction (breaking enemies)
- No timing required, pure strategy

**Ultimate Gauge System:**
- Reward sustained combat
- "Big moment" spectacle
- Encourages aggressive play

**Together:**
- Break enemies → gain ultimate → unleash ultimate → feel powerful
- Creates satisfying gameplay loop
- Mobile-friendly (tap-based, no timing)
