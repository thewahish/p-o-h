# GAME DEPTH REDESIGN
**Path of Heroes - Strategic Roguelike RPG Overhaul**

Version: 1.0
Created: 2025-10-01
Status: Design Phase

---

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [Current Problems](#current-problems)
3. [Core Design Philosophy](#core-design-philosophy)
4. [Expanded Ability System](#expanded-ability-system)
5. [Defensive Action System](#defensive-action-system)
6. [Skill Progression & Unlocks](#skill-progression--unlocks)
7. [Equipment & Loot Overhaul](#equipment--loot-overhaul)
8. [Combat Combo Mechanics](#combat-combo-mechanics)
9. [Resource Management Redesign](#resource-management-redesign)
10. [UI/UX Considerations](#uiux-considerations)
11. [Implementation Roadmap](#implementation-roadmap)
12. [Balance Testing Requirements](#balance-testing-requirements)

---

## Executive Summary

Path of Heroes currently lacks the strategic depth and variety expected of a roguelike RPG. This document proposes a comprehensive redesign introducing:

- **8 abilities per character** (2 starting, 6 unlockable)
- **Defensive actions** (Block, Dodge, Counter)
- **Skill unlock progression** tied to level milestones
- **Meaningful equipment system** with stats and special effects
- **Combo mechanics** rewarding strategic ability sequencing
- **Resource management** that creates tactical decisions

**Goal**: Transform the game from "click attack repeatedly" into a strategic RPG where every turn matters and builds/playstyles emerge organically.

---

## Current Problems

### Gameplay Loop Issues:
1. **No meaningful choices**: 95% of turns are basic attacks
2. **No build variety**: Every Warrior plays identically
3. **No defensive options**: Can only reduce damage through stats
4. **No progression excitement**: Leveling only increases numbers
5. **No replayability**: Each run feels the same
6. **No skill expression**: No way for skilled players to excel

### Technical Gaps:
- Only 2 abilities per character
- No equipment besides visual flavor
- Buffs are one-time choices with no synergy
- Combat is purely numerical (no mechanics)
- No unlocks, no skill trees, no customization

---

## Core Design Philosophy

### Guiding Principles:

**1. Depth Through Simplicity**
- Easy to learn, hard to master
- Every ability should feel impactful
- Clear visual/audio feedback for actions

**2. Meaningful Choices**
- Every turn should present decisions
- Multiple viable strategies per character
- Risk/reward trade-offs

**3. Build Variety**
- 3-5 distinct playstyles per character
- Synergies between abilities/equipment/buffs
- No obvious "best build"

**4. Progressive Mastery**
- Early runs teach basics
- Mid runs explore builds
- Late runs optimize strategies

**5. Mobile-First Design**
- Touch-friendly combat actions
- Clear visual feedback
- No twitch reflexes required

---

## Expanded Ability System

### Ability Framework

Each character now has **8 total abilities**:
- **2 Starting Abilities**: Available from level 1
- **6 Unlockable Abilities**: Gained at levels 3, 6, 9, 12, 15, 18

### Ability Categories:

1. **Basic Attacks** (low cost, reliable damage)
2. **Power Attacks** (high cost, high damage)
3. **Debuffs** (weaken enemies)
4. **Buffs** (strengthen self)
5. **DoTs** (damage over time)
6. **AoE** (multi-target)
7. **Utility** (healing, resource, special effects)
8. **Ultimate** (powerful, high cost)

---

### WARRIOR (Taha) - Complete Ability Pool

**Theme**: Defensive Tank / Sustained Fighter
**Resource**: Vigor (50 base, +5/level)
**Playstyles**: Tank, Bruiser, Berserker

#### Starting Abilities (Level 1):

**1. Power Strike** 🗡️
- **Cost**: 8 Vigor
- **Type**: Basic Attack
- **Effect**: Deal 150% weapon damage to single target
- **Cooldown**: None
- **Strategy**: Bread-and-butter damage ability

**2. Defensive Stance** 🛡️
- **Cost**: 10 Vigor
- **Type**: Buff (Self)
- **Effect**: +50% DEF for 2 turns, regenerate 5 HP per turn
- **Cooldown**: 3 turns
- **Strategy**: Survive tough encounters

#### Unlockable Abilities:

**3. Shield Bash** (Level 3) 💥
- **Cost**: 12 Vigor
- **Type**: Attack + Debuff
- **Effect**: Deal 90% damage + reduce enemy ATK by 30% for 2 turns
- **Cooldown**: None
- **Strategy**: Weaken dangerous enemies

**4. Battle Cry** (Level 6) 📢
- **Cost**: 15 Vigor
- **Type**: Buff (Self)
- **Effect**: +25% ATK and +2 SPD for 3 turns
- **Cooldown**: 4 turns
- **Strategy**: Burst damage phase

**5. Whirlwind Attack** (Level 9) 🌪️
- **Cost**: 20 Vigor
- **Type**: AoE Attack
- **Effect**: Deal 70% damage to ALL enemies
- **Cooldown**: None
- **Strategy**: Multi-enemy encounters

**6. Iron Will** (Level 12) 💪
- **Cost**: 25 Vigor
- **Type**: Buff (Self)
- **Effect**: Heal 30 HP + gain 20% damage resistance for 2 turns
- **Cooldown**: 5 turns
- **Strategy**: Emergency recovery

**7. Execute** (Level 15) ⚔️
- **Cost**: 18 Vigor
- **Type**: Power Attack
- **Effect**: Deal 200% damage, +100% bonus if enemy HP < 30%
- **Cooldown**: 2 turns
- **Strategy**: Finish wounded enemies

**8. Last Stand** (Level 18) 🔥
- **Cost**: 40 Vigor
- **Type**: Ultimate
- **Effect**: Deal 250% damage to all enemies + heal 20% of damage dealt
- **Cooldown**: 6 turns
- **Strategy**: Game-changing ultimate

---

### SORCERESS (Mais) - Complete Ability Pool

**Theme**: Elemental Mage / High Burst Damage
**Resource**: Mana (70 base, +7/level)
**Playstyles**: Fire Burst, Ice Control, Lightning Crit

#### Starting Abilities (Level 1):

**1. Magic Missile** ✨
- **Cost**: 8 Mana
- **Type**: Basic Attack
- **Effect**: Deal 140% magic damage to single target, never misses
- **Cooldown**: None
- **Strategy**: Reliable damage

**2. Mana Shield** 🔮
- **Cost**: 12 Mana
- **Type**: Buff (Self)
- **Effect**: Absorb next 40 damage taken (lasts 3 turns)
- **Cooldown**: 4 turns
- **Strategy**: Protect fragile HP pool

#### Unlockable Abilities:

**3. Fireball** (Level 3) 🔥
- **Cost**: 20 Mana
- **Type**: AoE Attack
- **Effect**: Deal 80% fire damage to ALL enemies
- **Cooldown**: None
- **Strategy**: Multi-target nuking

**4. Ice Shard** (Level 6) ❄️
- **Cost**: 15 Mana
- **Type**: Attack + Debuff
- **Effect**: Deal 120% damage + slow enemy (-30% SPD) for 2 turns
- **Cooldown**: None
- **Strategy**: Control fast enemies

**5. Lightning Bolt** (Level 9) ⚡
- **Cost**: 18 Mana
- **Type**: Power Attack
- **Effect**: Deal 180% damage + 40% crit chance (stacks with base crit)
- **Cooldown**: 2 turns
- **Strategy**: High-roll damage

**6. Arcane Intellect** (Level 12) 🧠
- **Cost**: 25 Mana
- **Type**: Buff (Self)
- **Effect**: +40% ATK and +20 max Mana for rest of battle
- **Cooldown**: Once per battle
- **Strategy**: Power spike

**7. Meteor** (Level 15) ☄️
- **Cost**: 35 Mana
- **Type**: AoE Power Attack
- **Effect**: Deal 120% damage to all enemies + 20% burn damage over 2 turns
- **Cooldown**: 4 turns
- **Strategy**: Heavy AoE burst

**8. Time Warp** (Level 18) ⏰
- **Cost**: 50 Mana
- **Type**: Ultimate
- **Effect**: Take an extra turn immediately + restore 20 Mana
- **Cooldown**: 7 turns
- **Strategy**: Game-winning combo setup

---

### ROGUE (Ibrahim) - Complete Ability Pool

**Theme**: Assassin / High Crit / DoT Specialist
**Resource**: Energy (60 base, +6/level)
**Playstyles**: Assassin, Poison, Shadow

#### Starting Abilities (Level 1):

**1. Quick Strike** 🗡️
- **Cost**: 7 Energy
- **Type**: Basic Attack
- **Effect**: Deal 130% damage + 20% bonus crit chance
- **Cooldown**: None
- **Strategy**: Fast, reliable damage

**2. Evasion** 💨
- **Cost**: 10 Energy
- **Type**: Buff (Self)
- **Effect**: +40% dodge chance (avoid damage) for 2 turns
- **Cooldown**: 4 turns
- **Strategy**: Avoid big hits

#### Unlockable Abilities:

**3. Venom Strike** (Level 3) ☠️
- **Cost**: 15 Energy
- **Type**: Attack + DoT
- **Effect**: Deal 130% damage + poison (10 damage/turn for 3 turns)
- **Cooldown**: None
- **Strategy**: Sustained damage

**4. Shadow Step** (Level 6) 👤
- **Cost**: 12 Energy
- **Type**: Buff (Self)
- **Effect**: Next attack deals +60% damage and cannot miss
- **Cooldown**: 3 turns
- **Strategy**: Guaranteed big hit

**5. Fan of Knives** (Level 9) 🔪
- **Cost**: 20 Energy
- **Type**: AoE Attack
- **Effect**: Deal 60% damage to all enemies + apply weak poison (5 dmg/turn)
- **Cooldown**: None
- **Strategy**: Multi-target pressure

**6. Deadly Precision** (Level 12) 🎯
- **Cost**: 25 Energy
- **Type**: Buff (Self)
- **Effect**: +50% crit chance and +30% crit damage for 3 turns
- **Cooldown**: 5 turns
- **Strategy**: Crit build payoff

**7. Backstab** (Level 15) 🗡️💀
- **Cost**: 22 Energy
- **Type**: Power Attack
- **Effect**: Deal 250% damage to single target, guaranteed crit
- **Cooldown**: 3 turns
- **Strategy**: Assassinate priority targets

**8. Death Mark** (Level 18) 💀
- **Cost**: 45 Energy
- **Type**: Ultimate
- **Effect**: Mark enemy - all attacks deal +50% damage to marked target for 4 turns
- **Cooldown**: 6 turns
- **Strategy**: Boss killer

---

## Defensive Action System

### New Combat Options

Combat is no longer just offense. Players can now choose **defensive actions** on their turn.

### Defensive Actions:

#### 1. Block 🛡️
- **Cost**: 15% of max resource
- **Effect**: Reduce next incoming attack by 50%
- **Duration**: Until next enemy attack
- **Strategy**: Tank one big hit
- **Cooldown**: None

#### 2. Dodge Roll 💨
- **Cost**: 20% of max resource
- **Effect**: 70% chance to avoid next attack completely
- **Duration**: Until next enemy attack
- **Strategy**: High-risk avoidance
- **Cooldown**: 2 turns

#### 3. Counter Stance ⚔️
- **Cost**: 25% of max resource
- **Effect**: Block 30% damage + deal 80% weapon damage back to attacker
- **Duration**: Until next enemy attack
- **Strategy**: Offensive defense
- **Cooldown**: 3 turns

#### 4. Parry (Unlock at Level 10) 🗡️
- **Cost**: 30% of max resource
- **Effect**: If timed correctly (skill check?), negate attack + stun enemy 1 turn
- **Duration**: Until next enemy attack
- **Strategy**: High skill ceiling defense
- **Cooldown**: 4 turns

### Combat Turn Structure:

**Player Turn Options**:
1. Basic Attack (free, no resource)
2. Use Ability (costs resource)
3. Use Defensive Action (costs resource %)
4. Use Potion (free action, doesn't end turn)
5. Flee (60% chance)

**Key Design**: Defensive actions compete with abilities for resources, creating tactical decisions.

---

## Skill Progression & Unlocks

### Leveling Milestones

| Level | Unlock |
|-------|--------|
| 1 | 2 starting abilities + Block + Dodge |
| 3 | Ability #3 unlocked |
| 6 | Ability #4 unlocked |
| 9 | Ability #5 unlocked |
| 10 | **Parry** defensive action unlocked |
| 12 | Ability #6 unlocked |
| 15 | Ability #7 unlocked + **Talent Point** |
| 18 | Ability #8 (Ultimate) unlocked |
| 20 | **Talent Point** |
| 25 | **Talent Point** |
| 30 | **Talent Point** |

### Talent System (Optional Enhancement)

**Talent Points**: Earned at levels 15, 20, 25, 30

**Talent Trees** (3 per character):

#### Warrior Talents:
- **Tank Tree**: +HP, +DEF, blocking more effective
- **Bruiser Tree**: +ATK, +HP regen, lifesteal
- **Berserker Tree**: +ATK, +crit, lose DEF gain damage

#### Sorceress Talents:
- **Fire Tree**: +fire damage, burn effects stronger
- **Ice Tree**: +slow effects, freeze chance
- **Lightning Tree**: +crit chance, chain lightning

#### Rogue Talents:
- **Assassin Tree**: +crit damage, +backstab bonus
- **Poison Tree**: +poison damage, poison spreads
- **Shadow Tree**: +dodge, +evasion, stealth attacks

**Note**: Talents are **persistent across runs** (unlocked with Hero Souls or permanent progression currency).

---

## Equipment & Loot Overhaul

### Equipment Slots

**Active Equipment Slots**:
1. **Weapon** (ATK, special effects)
2. **Armor** (DEF, HP)
3. **Accessory** (Utility: crit, speed, resource)

### Equipment Tiers

| Tier | Stat Multiplier | Special Effects | Drop Rate |
|------|-----------------|-----------------|-----------|
| Common | 1.0x | None | 60% |
| Uncommon | 1.2x | +1 minor stat | 25% |
| Rare | 1.5x | +1 major stat or small effect | 10% |
| Epic | 1.9x | +2 stats or medium effect | 4% |
| Mythic | 2.4x | +3 stats or powerful effect | 0.8% |
| Legendary | 3.0x | Unique game-changing effect | 0.2% |

### Special Equipment Effects

**Weapon Effects**:
- **Vampiric**: Heal 10-20% of damage dealt
- **Flaming**: +15% fire damage + burn chance
- **Frost**: Attacks slow enemies
- **Lightning**: Chain to nearby enemies
- **Critical**: +20% crit chance
- **Cleaving**: AoE basic attacks

**Armor Effects**:
- **Spiked**: Reflect 10-15% damage
- **Regenerating**: +5-10 HP regen per turn
- **Warded**: +20% magic resistance
- **Sturdy**: Block 5-10 flat damage
- **Evasive**: +10-15% dodge chance

**Accessory Effects**:
- **Resourceful**: +15-25% max resource
- **Lucky**: +10% rare drop chance
- **Swift**: +2-4 SPD
- **Mighty**: +10-15% all damage
- **Protective**: +10-15% all resistance

### Loot Sources

1. **Treasure Rooms**: Guaranteed equipment drop
2. **Boss Kills**: High chance of Rare+ equipment
3. **Elite Enemies**: Chance for Uncommon+ equipment
4. **Shop**: Can buy specific equipment types
5. **Shrine Blessings**: Can upgrade equipped items

### Equipment Durability System

**All equipment has durability** that degrades on death, creating meaningful consequences without being too punishing.

#### Durability Mechanics:

**Max Durability**: 100 for all equipment

**Durability Loss on Death**: 25-50% (random)
- First death: Might lose 30 durability (70/100 remaining)
- Second death: Might lose 40 durability (30/100 remaining)
- Third death: Might lose 35 durability → **0/100 BROKEN**

**Broken Equipment**:
- Equipment at 0 durability **loses all stats and effects**
- Still appears in equipment slot but provides **NO BENEFITS**
- Cannot be destroyed or lost - you always keep the item
- Must repair to restore functionality
- Can continue playing with broken equipment (just no bonuses)

**Durability Display**:
- Shown on equipment tooltip: "Legendary Sword (85/100)"
- Color-coded warnings:
  - 100-70: Green (good condition) - full stats
  - 69-40: Yellow (needs attention) - full stats
  - 39-1: Red (danger - near breaking!) - full stats
  - 0: Gray (BROKEN - no stats!) - **provides 0 stats until repaired**

#### Repair System:

**Shop Repairs**:
- New shop option: "Repair Equipment"
- Repairs restore equipment to **100/100 durability**
- Repair costs scale with rarity:

| Rarity | Repair Cost |
|--------|-------------|
| Common | 20 gold |
| Uncommon | 50 gold |
| Rare | 100 gold |
| Epic | 200 gold |
| Mythic | 400 gold |
| Legendary | 800 gold |

**Strategic Considerations**:
- Legendary equipment is **expensive to maintain** (800 gold per repair)
- **Broken equipment still exists** - just provides 0 stats until repaired
- Can't afford repairs? Continue with broken gear (harder but playable)
- Save up gold to repair important items
- Rare equipment might be more economical than legendary (100g repairs vs 800g)
- No pressure to repair immediately - equipment never disappears

#### Death Penalty (Complete):

**When player dies**:
1. **Lose 90% of current gold** (major penalty)
2. **All equipped items lose 25-50% durability** (random per item)
3. Respawn at main menu with damaged equipment
4. Hero Souls retained (permanent progression currency)

**Example Death**:
```
Before Death:
- Gold: 1000 → After: 100 (lost 900)
- Legendary Sword: 100/100 → After: 60/100 (lost 40, still works!)
- Epic Armor: 80/100 → After: 50/100 (lost 30, still works!)
- Rare Ring: 100/100 → After: 70/100 (lost 30, still works!)

Next Run:
- All equipment still functions normally
- Can continue playing with damaged gear
- Save up 800g to repair sword eventually

After 3 More Deaths Without Repairs:
- Legendary Sword: 0/100 → BROKEN (provides NO ATK bonus)
- Epic Armor: 0/100 → BROKEN (provides NO DEF bonus)
- Rare Ring: 0/100 → BROKEN (provides NO stats)
- Still have items, but playing with base character stats only
- Need 1100g total to repair everything
```

**Creates Tension**:
- Can't afford to repair everything immediately
- Must prioritize which gear to repair first
- Can continue playing with broken gear (harder but possible)
- Equipment never disappears - just becomes useless until repaired
- Death is punishing but **not run-ending** (gear becomes "dormant" not "destroyed")

---

## Combat Combo Mechanics

### Combo System

Abilities can **chain together** for bonus effects.

### Combo Types:

#### 1. Elemental Combos (Sorceress)
- **Fire + Ice = Steam Explosion**: +50% damage
- **Lightning + Water = Conductivity**: Chain to all enemies
- **Ice + Lightning = Frozen Shatter**: Stun + bonus damage

#### 2. Status Combos (Rogue)
- **Poison + Bleed = Hemorrhage**: Double DoT damage
- **Shadow Step + Backstab = Assassination**: +100% crit damage
- **Venom Strike → Fan of Knives**: Spread poison to all enemies

#### 3. Tactical Combos (Warrior)
- **Shield Bash + Power Strike = Devastating Blow**: +80% damage
- **Battle Cry + Whirlwind = Rampage**: AoE with bonus damage
- **Defensive Stance + Counter = Retribution**: Counter deals double damage

#### 4. Buff Synergies
- **Berserker Rage + Execute**: Massive damage on low HP enemies
- **Precision Strike + Lightning Bolt**: Near-guaranteed crits
- **Vampiric Aura + Whirlwind**: Huge healing from AoE

### Combo Indicators

**UI shows combo opportunities**:
- Highlight abilities that combo with last action
- Show expected bonus damage/effect
- Tutorial teaches basic combos

---

## Resource Management Redesign

### Resource System Changes

**Problem**: Current 8 base regen makes resources infinite
**Solution**: Dynamic resource system with trade-offs

### New Resource Rules:

1. **Base Regeneration**: 4 per turn (reduced from 8)
2. **Level Scaling**: +0.5 per level (unchanged)
3. **Resource Caps**: Cannot exceed 100% (prevents hoarding)
4. **Over-cap Penalty**: Regeneration wasted if at max

### Resource Generation Sources:

- **Base Regen**: 4 per turn
- **Level Bonus**: +0.5 per level
- **Buff (Mana Surge)**: +50% regen
- **Kills**: +10% max resource per enemy killed
- **Crits**: +5% max resource on crit
- **Equipment**: +resource generation bonuses

### Strategic Resource Decisions:

**Spend Early or Save?**
- Spend early to kill fast = less damage taken
- Save for big abilities = risk taking damage
- Balance between offense and defense

**Defensive Actions vs Abilities?**
- Block costs 15% resource = can't use ability
- Dodge costs 20% resource = ~1 ability worth
- Must choose: survive or damage?

---

## UI/UX Considerations

### Battle Screen Layout

**Current Layout Issues**:
- Too many buttons (overwhelming)
- No clear action categories
- Ability descriptions hidden

**Proposed Layout**:

```
┌─────────────────────────────────────┐
│  Enemy Info & HP Bars               │
├─────────────────────────────────────┤
│  [Active Buffs Display]             │
├─────────────────────────────────────┤
│  Player: HP ████████ 85/100         │
│          Vigor ██████ 38/50         │
├─────────────────────────────────────┤
│  ABILITIES:                         │
│  [Power Strike 8]  [Def Stance 10]  │
│  [Shield Bash 12]  [Battle Cry 15]  │
│  [Whirlwind 20]    [Iron Will 25]   │
│  [Execute 18]      [Last Stand 40]  │
│  ↓ SWIPE DOWN FOR DEFENSIVE ↓      │
├─────────────────────────────────────┤
│  DEFENSIVE: (swipe to reveal)       │
│  [Block 15%]  [Dodge 20%]           │
│  [Counter 25%] [Parry 30%]          │
├─────────────────────────────────────┤
│  [Basic Attack] [Potions] [Flee]    │
└─────────────────────────────────────┘
```

### Ability Tooltips

**Long-press any ability** to see:
- Full description
- Damage calculation
- Cooldown status
- Combo opportunities
- Resource cost

### Visual Feedback

- **Combo Ready**: Glowing borders on combo abilities
- **Cooldown**: Grayed out with turn counter
- **Low Resource**: Red resource bar + shake animation
- **Unlocked**: New ability notification with tutorial

---

## Implementation Roadmap

### Phase 1: Foundation (Week 1-2)
- [ ] Implement 8 abilities per character
- [ ] Add ability unlock system (level milestones)
- [ ] Update character progression to grant abilities
- [ ] Test ability balance in simulator

### Phase 2: Defensive Actions (Week 2-3)
- [ ] Implement Block/Dodge/Counter mechanics
- [ ] Add resource % cost calculation
- [ ] Update combat UI to show defensive options
- [ ] Add Parry unlock at level 10

### Phase 3: Equipment System (Week 3-4)
- [ ] Redesign equipment to have real stats
- [ ] Implement equipment drops from treasure/bosses
- [ ] Add special equipment effects
- [ ] Implement durability system (100 max, 25-50% loss on death)
- [ ] Add broken equipment mechanics (0 durability = 0 stats, but item kept)
- [ ] Update shop to sell equipment AND repair (20-800g based on rarity)
- [ ] Add durability display on equipment tooltips (color-coded)
- [ ] Equipment at 0 durability provides NO stats but never disappears

### Phase 4: Combo System (Week 4-5)
- [ ] Implement combo detection logic
- [ ] Add combo bonus damage calculations
- [ ] UI indicators for combo opportunities
- [ ] Tutorial for basic combos

### Phase 5: Polish & Balance (Week 5-6)
- [ ] Run comprehensive simulations
- [ ] Balance all 24 abilities (8 × 3 characters)
- [ ] Balance defensive actions vs abilities
- [ ] Balance equipment drop rates and effects
- [ ] Update all documentation

### Phase 6: Optional Enhancements
- [ ] Talent system (if desired)
- [ ] More combo types
- [ ] Equipment upgrading/enchanting
- [ ] Skill customization

---

## Balance Testing Requirements

### Updated Simulation Criteria

**New Metrics to Track**:
1. **Ability Usage Distribution**: Which abilities used most/least?
2. **Defensive Action Usage**: How often do players block/dodge?
3. **Resource Starvation**: How often do players run out?
4. **Combo Frequency**: How often do combos trigger?
5. **Equipment Impact**: Win rate with vs without good equipment?
6. **Level Milestones**: Do players survive to key unlocks (3, 6, 9)?
7. **Build Diversity**: Are multiple playstyles viable?

### Success Criteria

**Balance Goals**:
- Win rate: 25-35% (10 deaths per victory)
- Average death floor: 8-12 (gradual progression)
- Ability usage: 40-50% of turns (more abilities = more use)
- Defensive action usage: 15-25% of turns
- All 8 abilities used: Each ability used >5% of the time
- Resource starvation: 10-20% of battles
- Equipment matters: 10-15% win rate improvement with good gear

### Simulation Updates Needed

1. **Implement ability unlock progression**: Simulator grants abilities at correct levels
2. **Add defensive action AI**: AI decides when to block/dodge
3. **Equipment system**: Generate and equip items
4. **Combo detection**: Track and apply combo bonuses
5. **Strategic AI**: Make smarter ability choices based on situation

---

## Open Questions for Discussion

### Critical Decisions:

1. **Talent System**: Include persistent talent trees or skip for now?
2. **Equipment Persistence**: Keep equipment between runs (roguelite) or lose on death (roguelike)?
3. **Ability Cooldowns**: Use cooldowns + resource costs, or just resource costs?
4. **Combo Complexity**: Simple 2-ability combos or deeper 3+ ability chains?
5. **Defensive Action Timing**: Real-time parry timing or turn-based decisions only?
6. **Tutorial Integration**: How do we teach 8 abilities + defensive actions + combos?
7. **Mobile vs Desktop Balance**: Different controls for mobile vs keyboard?

### Balance Questions:

1. **Resource Costs**: Should ultimates cost 40-50 resource (most of pool)?
2. **Cooldowns**: Should powerful abilities have 4-6 turn cooldowns?
3. **Equipment Power**: How much should Legendary equipment change gameplay?
4. **Level Pacing**: Reach level 18 (ultimate unlock) by floor 15-20?
5. **Combo Damage**: Should combos add +30-50% bonus damage?

---

## Conclusion

This redesign transforms Path of Heroes from a shallow clicker into a strategic roguelike RPG with:

✅ **24 unique abilities** (8 per character)
✅ **4 defensive actions** creating tactical decisions
✅ **Meaningful equipment** with game-changing effects
✅ **Combo system** rewarding strategic play
✅ **Progression unlocks** that feel exciting
✅ **Build variety** enabling multiple playstyles

**Next Steps**:
1. Review and approve design direction
2. Prioritize features (all vs MVP subset)
3. Begin Phase 1 implementation
4. Update MASTER_SIMULATION_SPEC.md
5. Create detailed ability balance spreadsheet

**Estimated Timeline**: 5-6 weeks for full implementation + testing

---

**Document Version**: 1.0
**Last Updated**: 2025-10-01
**Status**: Awaiting Approval
