# Path of Heroes - Final Demo Balance (V.40.1)

## Overview
This document summarizes the final balance settings for the 30-floor demo version of Path of Heroes, targeting a 4-6 hour first completion time with roguelike difficulty.

## Core Balance Settings

### Starting Resources
- **Starting Potions**: 2x Health Potions (50 HP each = 100 HP total emergency healing)
- **Starting Gold**: 100 gold
- **Effective Starting HP**: Base HP + 100 HP from potions

### Experience & Leveling
- **XP Curve**: 70 + (level - 1) × 50
  - Level 1→2: 70 XP
  - Level 2→3: 120 XP
  - Level 3→4: 170 XP
  - Level 4→5: 220 XP
- **Purpose**: Moderate leveling curve prevents rapid power spikes

### Enemy Stats (Floor 1 Base)

#### Goblin
- HP: 48 (+20% from original 40)
- ATK: 10 (+25% from original 8)
- DEF: 3
- SPD: 6
- CRIT: 5%

#### Slime
- HP: 54 (+20% from original 45)
- ATK: 9 (+29% from original 7)
- DEF: 8
- SPD: 3
- CRIT: 3%

#### Orc Brute
- HP: 72 (+20% from original 60)
- ATK: 14 (+17% from original 12)
- DEF: 5
- SPD: 5
- CRIT: 8%

### Enemy Scaling System

The game uses **level-based scaling** (not floor-based):
- Enemies scale to player level with ±1 level variance
- **12% stat increase per enemy level** above level 1
- Bosses are always at least player level +1
- This creates a fair, MMO-style difficulty curve

### Meta-Progression (Hero Souls)

#### Soul Earning Rate
- **Per Floor**: 5 + floor ÷ 2 souls
  - Floor 1: 5 souls
  - Floor 10: 10 souls
  - Floor 20: 15 souls
  - Floor 30: 20 souls
- **On Death**: floor(battles won ÷ 3) souls

#### Soul Upgrades
1. **+10% HP** (50 souls)
2. **+10% ATK** (50 souls)
3. **+15% DEF** (100 souls)
4. **+15% HP, +10% ATK** (150 souls)

**Total Cost**: 350 souls for all upgrades

### In-Run Progression

#### Item Drops (25% chance per battle)
- **ATK**: +1 to +3 per item
- **DEF**: +0 to +2 per item
- Average: ~10-15 bonus stats by floor end

#### Shrines (15% chance per encounter)
- **HP Boost**: +4-7 max HP and immediate heal
- **ATK Boost**: +1-3 ATK
- **DEF Boost**: +1-2 DEF

#### Shops
- Appear at battle #5 in each floor
- **Health Potion**: 30 gold (restores 50 HP)
- Limited to 1 purchase per shop visit

## Character Balance

### Warrior (Taha)
- **Base**: 100 HP, 12 ATK, 10 DEF, 6 SPD, 10% CRIT
- **Growth**: +6 HP, +1.2 ATK, +1.8 DEF, +0.4 SPD, +0.2% CRIT per level
- **Role**: Tank with high survivability

### Sorceress (Mais)
- **Base**: 80 HP, 14 ATK, 6 DEF, 7 SPD, 12% CRIT
- **Growth**: +4 HP, +1.4 ATK, +0.6 DEF, +0.6 SPD, +0.4% CRIT per level
- **Role**: High damage glass cannon

### Rogue (Ibrahim)
- **Base**: 90 HP, 15 ATK, 7 DEF, 10 SPD, 18% CRIT
- **Growth**: +5 HP, +1.5 ATK, +0.9 DEF, +0.8 SPD, +0.6% CRIT per level
- **Role**: Critical strike specialist

## Expected Progression Timeline

### First-Time Player (No Meta-Progression)
- **Floor 1 Clear**: 5-15 runs (15-30 minutes)
- **Floor 10 Clear**: 40-80 runs (1-2 hours)
- **Floor 15 Clear**: 100-200 runs (3-5 hours)
- **Full Demo (Floor 30)**: Requires additional equipment/skill systems

### Experienced Player (With Meta-Progression)
- **Floor 1 Clear**: 1-3 runs (3-5 minutes)
- **Floor 10 Clear**: 10-30 runs (30-60 minutes)
- **Floor 15 Clear**: 50-100 runs (2-3 hours)

## Design Philosophy

### Roguelike Elements
1. **Death is Progress**: Earn Hero Souls on every run, even failed ones
2. **Strategic Choices**: Potion timing, shop purchases, character selection
3. **RNG Management**: Item drops and shrines add variability
4. **Meta-Progression**: Permanent upgrades make each run stronger

### Balance Pillars
1. **Fair Challenge**: Early floors are tough but beatable
2. **Steady Progression**: Meta-upgrades provide visible power increases
3. **Skill Expression**: Potion timing and resource management matter
4. **Replayability**: Character variety and RNG create unique runs

## Known Limitations (Demo Version)

### Floors 16-30 Require Additional Systems
The current balance supports **Floors 1-15** well. For Floors 16-30 (Act 3), players will need:
- Equipment system (weapons, armor, accessories)
- Skill trees and ability unlocks
- Advanced meta-progression (prestige, ascension)
- More Soul upgrade tiers

These systems are planned for the full game and not part of the demo scope.

## Simulation Results (30-Floor Demo)

### Test Run Analysis
- **Floor 1-10**: ~55 minutes (good pacing)
- **Floor 11-15**: 2-5 hours (challenging progression)
- **Floor 16+**: Requires equipment/skill systems

### Balance Verdict
✅ **Floors 1-15 Balanced** - Achievable with current systems
⚠️ **Floors 16-30 Gated** - Need additional progression systems
✅ **Roguelike Feel** - Death is rewarding, meta-progression works
✅ **4-6 Hour Demo** - Floors 1-15 provide solid demo experience

## Future Enhancements (Full Game)

### Equipment System
- Weapon slots with ATK/CRIT bonuses
- Armor slots with HP/DEF bonuses
- Rarity tiers (Common → Legendary)
- Set bonuses for synergy

### Skill Trees
- Character-specific ability unlocks
- Passive stat bonuses
- Build variety (tank/DPS/hybrid)

### Advanced Meta-Progression
- Prestige system (reset for permanent bonuses)
- Ascension mechanics (harder difficulty, better rewards)
- More Soul upgrade tiers
- Character-specific progression paths

---

**Version**: V.40.1
**Last Updated**: 2025-09-30
**Target**: 30-Floor Demo (Acts 1-2, partial Act 3)
