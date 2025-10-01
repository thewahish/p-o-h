# MASTER SIMULATION SPECIFICATION
**Version:** 1.0
**Date:** October 1, 2025
**Purpose:** Complete testing criteria for Path of Heroes balance simulation

---

## 🎯 SIMULATION OBJECTIVES

### Primary Goals
1. **Difficulty Calibration**: Win rate should make game challenging but fair (15-25% for 30-floor completion)
2. **Resource Balance**: Abilities should be strategic choices, not spammable
3. **Character Parity**: All 3 characters should have similar win rates (±5%)
4. **Economic Balance**: Gold, potions, and rewards should feel meaningful
5. **Progression Pacing**: Players should reach floor 15-20 on average death

### Target Metrics
- **30-Floor Win Rate**: 25-35% (challenging but achievable)
- **Average Death Floor**: 15-20 (mid-game challenge)
- **Potion Usage**: 80-100% of starting potions consumed
- **Ability Usage Rate**: 30-40% of combat turns (strategic, not spammy)
- **Resource Starvation**: Should happen 10-20% of battles (creates tension)
- **Character Balance**: All characters within ±5% win rate

---

## 🎮 COMPLETE GAME SYSTEMS TO SIMULATE

### 1. COMBAT SYSTEM
#### Turn-Based Mechanics
- Turn order by SPD stat
- Player turn: Attack, Ability, Defend, Flee, or Use Potion
- Enemy turn: Attack player
- Multi-enemy encounters (1-3 enemies per battle)
- Wave system (split enemies into waves)

#### Damage Calculation
```
Base Damage = (ATK² / (ATK + DEF))
Critical Hit = Base Damage × 1.6
Ability Damage = Base Damage × Ability Multiplier
Defending = Damage × 0.5
```

#### Combat AI Strategy
- **Basic Attack**: Default when resource low
- **Ability Usage**: When resource >= cost AND (enemy HP > threshold OR multi-enemy)
- **Defend**: When HP < 20% and no healing available
- **Potion Usage**:
  - HP potion when HP < 30%
  - Resource potion when resource < ability cost AND resource potions available
- **Flee**: Never (for simulation consistency)

#### Status Effects
- Poison (Venom Strike): 8 damage per turn, 3 turns
- Attack Debuff (Shield Bash): -30% enemy ATK, 2 turns

---

### 2. RESOURCE SYSTEM

#### Resource Types
- **Warrior**: Vigor (🟣) - Base 55, +2/level
- **Sorceress**: Mana (🔵) - Base 80, +2.5/level
- **Rogue**: Energy (🟢) - Base 60, +2.2/level

#### Resource Regeneration (CURRENT)
```
Base Regen = 8 per turn
Level Bonus = (Level - 1) × 0.5
Mana Surge Buff = Base × 1.5
Battle Focus Buff = Ability cost × 0.75 (25% reduction)
Lucky Strikes Buff = 20% chance to refund ability cost
```

#### Ability Costs (CURRENT)
- Shield Bash: 12 Vigor (0.9× damage + debuff)
- Fireball: 20 Mana (0.8× damage, AoE)
- Venom Strike: 15 Energy (1.3× damage + poison)

#### Test Scenarios
1. **Current Values** (8 base regen)
2. **Reduced Regen** (6 base regen)
3. **Reduced Regen** (5 base regen)
4. **Minimal Regen** (4 base regen)
5. **Level-Only Regen** (0 base + level scaling)

---

### 3. BUFF SYSTEM (HADES-STYLE)

#### Buff Selection
- 3 random buffs offered before EACH battle
- Player selects 1 buff
- Buffs stack across multiple battles
- Buffs persist entire battle (duration: 'battle')

#### All 9 Buff Types
1. **Berserker Rage** (🔥): +25% ATK this battle
2. **Precision Strike** (🎯): +15% Crit chance
3. **Swift Reflexes** (⚡): +30% SPD
4. **Iron Skin** (🛡️): +40% DEF
5. **Vampiric Aura** (🩸): Heal 20% of damage dealt
6. **Mana Surge** (💫): +50% resource regen
7. **Battle Focus** (🎭): -25% ability cost
8. **Lucky Strikes** (🍀): 20% chance to save resource on ability use
9. **Second Wind** (🌪️): Heal 15 HP per turn

#### Buff Selection Strategy (AI)
- Random selection from 3 offered buffs
- Track which buffs lead to highest win rates
- Test with no buffs vs with buffs

---

### 4. POTION SYSTEM

#### Starting Inventory
- **HP Potions**: 3 (50 HP each = 150 total emergency HP)
- **Resource Potions**: 2 (40 resource each = 80 total emergency resource)

#### Potion Types (Rare Drops - Not Tested Yet)
- Greater HP Potion: 80 HP
- Elixir of Vitality: Full HP + Full Resource

#### Potion Usage Strategy
```python
if player.hp < player.maxHP * 0.30 and potions.hp > 0:
    use_hp_potion()

if player.resource < ability_cost and potions.resource > 0 and should_use_ability():
    use_resource_potion()
```

#### Metrics to Track
- Average HP potions used per run
- Average Resource potions used per run
- % of runs where all potions consumed
- Potion efficiency (HP restored / Max possible)

---

### 5. DUNGEON EXPLORATION

#### Floor Structure
- **Grid**: 5×9 compact maze
- **Room Types**: Battle, Elite, Boss, Shop, Shrine, Treasure, Stairs
- **Room Distribution** (per floor):
  - Battle: 8-12 rooms
  - Elite: 1-2 rooms
  - Shop: 1 room
  - Shrine: 1-2 rooms
  - Treasure: 1-2 rooms
  - Boss: 1 room (spawns stairs on defeat)

#### Room Events
- **Battle**: 1-2 enemies (3 on floor 5+, rare)
- **Elite**: Scaled enemy + possible minions (floor 3+)
- **Boss**: Major scaled enemy (furthest from start)
- **Shop**: Purchase 1 item, close shop
- **Shrine**: Random stat blessing (+3 ATK/DEF/SPD or +5 Crit + floor scaling)
- **Treasure**: Random gold (3-10 base + 20% per floor)

#### Shrine Blessing Options
```
Strength: +3 ATK + floor_bonus (0.5 per floor)
Fortitude: +2 DEF + floor_bonus
Swiftness: +2 SPD + floor_bonus
Fortune: +5 Crit + floor_bonus × 2
```

#### Navigation Strategy (AI)
- Prioritize: Shrine → Treasure → Shop → Battle → Boss
- Avoid Elite unless required path to boss
- Visit all non-combat rooms before boss when possible

---

### 6. ENEMY SCALING

#### Base Enemies (Floor 1)
```
Goblin:    HP: 52, ATK: 10, DEF: 3, SPD: 6, Crit: 5%
Slime:     HP: 59, ATK: 9,  DEF: 8, SPD: 3, Crit: 3%
Orc Brute: HP: 78, ATK: 14, DEF: 5, SPD: 5, Crit: 8%
```

#### Scaling Formula
```
Scale Factor = 1 + (Floor - 1) × 0.03  // 3% per floor
HP = Base HP × Scale Factor
ATK = Base ATK × Scale Factor
DEF = Base DEF × Scale Factor
SPD = Base SPD (no scaling)
Crit = Base Crit (no scaling)
```

#### Elite Scaling
```
Elite HP = Base HP × 1.5
Elite ATK = Base ATK × 1.2
Elite DEF = Base DEF × 1.2
Prefix: "Elite" (e.g., "Elite Goblin")
Minions: 30% chance on floor 3+ (1 weak enemy)
```

#### Boss Scaling
```
Boss HP = Base HP × 1.8
Boss ATK = Base ATK × 1.5
Boss DEF = Base DEF × 1.5
Title: "Floor X [character_path] Nemesis"
Character Modifier: 1.0× (equal for all characters)
```

#### Multi-Enemy Encounters
```
Floor 1-4: 30% chance 2 enemies, 70% chance 1 enemy
Floor 5-9: 40% chance 2 enemies, 10% chance 3 enemies
Floor 10+: 50% chance 2 enemies, 20% chance 3 enemies
```

---

### 7. CHARACTER PROGRESSION

#### Experience System
```
XP Required = 100 + (Level - 1) × 120
// Level 1→2: 100 XP
// Level 2→3: 220 XP
// Level 3→4: 340 XP
```

#### XP Rewards
```
Enemy XP = Base XP × Floor Scale Factor
Goblin: 20 XP base
Slime: 25 XP base
Orc Brute: 35 XP base
Elite: Base XP × 1.5
Boss: Base XP × 2.0
```

#### Level Up Benefits
- Full HP/Resource restoration
- Stat increases per growth rates:

```
WARRIOR:
HP: +6, Resource: +2, ATK: +1.2, DEF: +1.8, SPD: +0.4, Crit: +0.2%

SORCERESS:
HP: +4, Resource: +2.5, ATK: +1.4, DEF: +0.6, SPD: +0.6, Crit: +0.4%

ROGUE:
HP: +5, Resource: +2.2, ATK: +1.5, DEF: +0.9, SPD: +0.8, Crit: +0.6%
```

---

### 8. ECONOMIC SYSTEM

#### Gold Sources
- **Treasure Rooms**: 3-10 base + 20% per floor
- **Enemy Drops**: 2-5 base per enemy
- **Floor Completion**: 20 + (floor × 5) gold
- **Boss Defeat**: 50 + (floor × 10) gold

#### Starting Gold
- 100 gold (with Fortune upgrade: 150 gold)

#### Shop Prices (Estimated - Not Fully Implemented)
- HP Potion: 30 gold
- Resource Potion: 25 gold
- Greater HP Potion: 50 gold
- Equipment: 50-200 gold (rarity-based)

#### Death Penalty
- Lose 90% of gold
- Keep all Hero Souls
- Restart at Floor 1, Level 1

---

### 9. FLOOR PROGRESSION

#### Floor Advancement
1. Defeat boss
2. Stairs appear at boss location
3. Enter stairs to advance
4. New floor generation
5. Heal 25% HP
6. Award floor completion rewards

#### Floor Completion Rewards
```
Gold: 20 + (floor × 5)
Hero Souls: 5 + floor
XP: 50 + (floor × 10)
```

---

## 🧪 SIMULATION TEST MATRIX

### Run Configuration
- **Runs per Scenario**: 100 runs (increased from 10 for statistical significance)
- **Max Floor**: 30
- **Characters**: Warrior, Sorceress, Rogue
- **Random Seed**: Different per run (true randomness)

### Scenarios to Test

#### Scenario A: CURRENT BALANCE (Baseline)
```
Resource Regen: 8 base + 0.5/level
Ability Costs: Shield Bash 12, Fireball 20, Venom Strike 15
Starting Potions: 3 HP, 2 Resource
Enemy Scaling: 3% per floor
```

#### Scenario B: REDUCED REGENERATION
```
Resource Regen: 6 base + 0.5/level
All else same as Scenario A
```

#### Scenario C: MINIMAL REGENERATION
```
Resource Regen: 4 base + 0.5/level
All else same as Scenario A
```

#### Scenario D: LEVEL-ONLY REGENERATION
```
Resource Regen: 0 base + 1.0/level
All else same as Scenario A
```

#### Scenario E: INCREASED ABILITY COSTS
```
Resource Regen: 8 base + 0.5/level
Ability Costs: Shield Bash 15, Fireball 25, Venom Strike 18
All else same as Scenario A
```

#### Scenario F: REDUCED STARTING POTIONS
```
Resource Regen: 8 base + 0.5/level
Starting Potions: 2 HP, 1 Resource
All else same as Scenario A
```

---

## 📊 METRICS TO TRACK (Per Run)

### Victory/Defeat Metrics
- [ ] Did player reach floor 30? (Win/Loss)
- [ ] Floor where death occurred
- [ ] Cause of death (combat loss, flee, other)
- [ ] Final character level at death
- [ ] Total battles fought
- [ ] Total turns taken across all battles

### Combat Performance
- [ ] Total damage dealt
- [ ] Total damage taken
- [ ] Critical hits landed
- [ ] Abilities used (count)
- [ ] Basic attacks used (count)
- [ ] Times defended
- [ ] Ability usage rate (abilities / total turns)

### Resource Management
- [ ] Times resource hit 0 (resource starvation)
- [ ] Average resource at end of battle
- [ ] Total resource regenerated
- [ ] Total resource spent on abilities
- [ ] Resource efficiency (spent / available)

### Potion Usage
- [ ] HP potions used
- [ ] Resource potions used
- [ ] Total HP restored from potions
- [ ] Total resource restored from potions
- [ ] Potion efficiency (used / starting)

### Buff Impact
- [ ] Buffs selected (count per type)
- [ ] Most common buff selected
- [ ] Win rate per buff type
- [ ] Average buffs per successful run

### Economic Tracking
- [ ] Total gold earned
- [ ] Total gold spent
- [ ] Shop visits (count)
- [ ] Items purchased
- [ ] Final gold at death

### Room Events
- [ ] Battles fought
- [ ] Elite encounters
- [ ] Bosses defeated
- [ ] Shops visited
- [ ] Shrines visited (blessings received)
- [ ] Treasures found
- [ ] Total rooms explored

### Stat Progression
- [ ] Final HP
- [ ] Final ATK
- [ ] Final DEF
- [ ] Final SPD
- [ ] Final Crit
- [ ] Final Resource Max
- [ ] Blessings received (count + types)

### Enemy Encounter Stats
- [ ] Single enemy battles
- [ ] Double enemy battles
- [ ] Triple enemy battles
- [ ] Average enemies per battle
- [ ] Hardest enemy type faced

---

## 📈 AGGREGATED METRICS (Across All Runs)

### Character Balance
```
                Win Rate | Avg Floor | Avg Level | Ability % | Potion Use
Warrior:        XX.X%    | XX.X      | XX.X      | XX.X%     | X.X/5.0
Sorceress:      XX.X%    | XX.X      | XX.X      | XX.X%     | X.X/5.0
Rogue:          XX.X%    | XX.X      | XX.X      | XX.X%     | X.X/5.0
```

### Death Distribution (Top 10 Floors)
```
Floor  | Deaths | Percentage
-------|--------|------------
5      | XX     | XX.X%
8      | XX     | XX.X%
12     | XX     | XX.X%
...
```

### Resource Analysis
```
Resource Starvation Rate: XX.X% of battles
Average Resource at Battle End: XX.X / Max
Resource Potions Critical: XX.X% of runs (used all)
```

### Buff Effectiveness
```
Buff Type         | Selection Rate | Win Rate with Buff
------------------|----------------|-------------------
Berserker Rage    | XX.X%         | XX.X%
Vampiric Aura     | XX.X%         | XX.X%
Mana Surge        | XX.X%         | XX.X%
Battle Focus      | XX.X%         | XX.X%
...
```

### Economic Balance
```
Average Gold at Floor 10: XXX
Average Gold at Floor 20: XXX
Average Shop Purchases: X.X per run
Gold Sufficiency: XX.X% (could afford wanted items)
```

---

## 🎯 SUCCESS CRITERIA (What Makes Good Balance?)

### Must-Have (Critical)
- ✅ 30-floor win rate: 25-35%
- ✅ Average death floor: 15-20
- ✅ Character win rates within ±5%
- ✅ Resource starvation: 10-20% of battles
- ✅ Potion usage: 80%+ consumed

### Should-Have (Important)
- ✅ Ability usage: 30-40% of turns
- ✅ All buff types selected at least 5% of time
- ✅ No single buff dominates (>30% selection)
- ✅ Shop visits: 50%+ of runs
- ✅ Economic viability: Can afford 2-3 shop items per run

### Nice-to-Have (Quality)
- ✅ Level progression feels smooth (no sudden difficulty spikes)
- ✅ Death distribution spreads across floors (not clustered)
- ✅ Multi-enemy battles feel challenging but fair
- ✅ Boss battles are climactic (10+ turns)
- ✅ Replay value (different builds/paths viable)

---

## 🔧 IMPLEMENTATION NOTES

### Simulator Requirements
1. **Deterministic Randomness**: Use seeded RNG for reproducibility
2. **Full Game Logic**: Replicate exact combat formulas from game code
3. **AI Decision Trees**: Document all AI strategies used
4. **Logging Level**: Verbose for debugging, summary for final reports
5. **Performance**: Should complete 100 runs in < 5 minutes

### File Outputs
- `simulation_results_scenarioA.json` (raw data)
- `simulation_summary_scenarioA.md` (human-readable)
- `simulation_comparison.md` (compare all scenarios)
- `balance_recommendations.md` (suggested changes)

### Code Location
- Simulator: `/realistic-combat-simulator-v2.cjs`
- Results: `/simulation_results/`
- Spec: `/MASTER_SIMULATION_SPEC.md` (this file)

---

## 📝 CHANGE LOG

### Version 1.0 - October 1, 2025
- Initial comprehensive specification
- All game systems documented
- Test matrix defined
- Success criteria established
- Ready for implementation

---

## ✅ CONFIRMED PARAMETERS (USER APPROVED)

1. **Target Win Rate**: 25-35% ✅
2. **Ability Usage**: 30-40% of combat turns ✅
3. **Simulation Runs**: 100 runs per scenario ✅
4. **Test Priority**: Start with Scenario C (4 base regen) ✅

## ❓ REMAINING QUESTIONS

1. **Potion Count**: Should starting potions be reduced (currently 3 HP + 2 Resource)?
2. **Buff Balance**: Should some buffs be removed/nerfed if they dominate?
3. **Economic Tuning**: Should gold be more scarce to make shops meaningful?
4. **Shop Implementation**: Prioritize implementing shop system for testing?

---

**END OF MASTER SIMULATION SPECIFICATION**
