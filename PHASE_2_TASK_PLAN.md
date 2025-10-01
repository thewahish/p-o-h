# Phase 2 Implementation - Task Execution Plan
## Path of Heroes - Character-Specific Gameplay Enhancement

**Created:** September 30, 2025
**Project:** Path of Heroes (p-o-h-clone)
**Phase:** 2 - Enhanced Gameplay Features
**Estimated Duration:** 2-3 weeks (60-80 developer hours)

---

## Executive Summary

This document provides a comprehensive, atomic task breakdown for Phase 2 implementation, focusing on character-specific gameplay enhancements that leverage the existing save system architecture from Phase 1.

**Core Objectives:**
1. Character-specific enemy encounters based on progression paths
2. Character-specific rewards tailored to each hero's playstyle
3. Auto-save system for progress preservation
4. Enhanced room events with strategic variety

**Success Criteria:**
- Each character faces enemies aligned with their progression path
- Rewards are meaningfully different between characters
- Player progress is automatically preserved
- Room events provide strategic depth beyond combat

---

## I. TASK BREAKDOWN BY FEATURE

### Feature 1: Character-Specific Enemy Encounters

#### Task 1.1: Enemy Type System Foundation
**Priority:** P0 (Critical Path)
**Estimated Effort:** 3-4 hours
**Dependencies:** None
**Sprint:** Week 1, Days 1-2

**Description:**
Implement enemy type classification system to enable character-specific encounter matching.

**Acceptance Criteria:**
- [ ] Add `enemyType` property to all enemies in `EnemyDatabase`
- [ ] Map enemy types: `brute`, `physical`, `magical`, `undead`, `fast`, `elite`
- [ ] Verify all 12 enemies have appropriate types assigned
- [ ] Update enemy generation to respect type filters

**Implementation Details:**
```javascript
// File: src/constants/enemies.js
// Add enemyType to each enemy:
goblin: {
    id: 'goblin',
    enemyType: ['physical', 'brute'], // Multiple types supported
    // ... rest of properties
}
```

**Testing Strategy:**
- Unit test: Verify all enemies have at least one type
- Integration test: Generate encounters and verify type filtering works

---

#### Task 1.2: Character-Specific Encounter Generator
**Priority:** P0 (Critical Path)
**Estimated Effort:** 4 hours
**Dependencies:** Task 1.1
**Sprint:** Week 1, Day 2

**Description:**
Create intelligent encounter generation that favors character-preferred enemy types while maintaining variety.

**Acceptance Criteria:**
- [ ] 70% of encounters match character's `preferredEnemyTypes`
- [ ] 30% of encounters are random for variety
- [ ] Boss encounters always match character progression
- [ ] Elite encounters heavily weighted toward character types (85%)

**Implementation Details:**
```javascript
// File: src/systems/dungeon.js
function getCharacterAppropriateEnemy(characterId, floor, isElite = false) {
    const character = Characters[characterId.toUpperCase()];
    const preferredTypes = character.preferredEnemyTypes || [];
    const availableEnemies = getFloorEnemies(floor);

    // Filter enemies by preferred types
    const matchingEnemies = availableEnemies.filter(enemyId => {
        const enemy = EnemyDatabase[enemyId];
        return enemy.enemyType.some(type => preferredTypes.includes(type));
    });

    // 70% chance for preferred type (85% for elite)
    const threshold = isElite ? 0.85 : 0.70;
    if (Math.random() < threshold && matchingEnemies.length > 0) {
        return matchingEnemies[Math.floor(Math.random() * matchingEnemies.length)];
    }

    // Fall back to any enemy
    return availableEnemies[Math.floor(Math.random() * availableEnemies.length)];
}
```

**Testing Strategy:**
- Generate 100 encounters for each character
- Verify distribution matches 70/30 split
- Test edge cases (no matching enemies for floor)

---

#### Task 1.3: Encounter Validation & Balance Testing
**Priority:** P1 (High)
**Estimated Effort:** 2 hours
**Dependencies:** Task 1.2
**Sprint:** Week 1, Day 3

**Description:**
Validate that character-specific encounters maintain game balance and provide appropriate challenge progression.

**Acceptance Criteria:**
- [ ] Run simulation for 10 floors per character
- [ ] Verify no character gets significantly easier/harder enemies
- [ ] Confirm encounter variety remains high (no repetitive battles)
- [ ] Document any balance concerns

**Implementation Details:**
- Create test script: `balance-simulation-encounters.js`
- Generate 1000 encounters per character
- Track: enemy difficulty, type distribution, variety score

**Testing Strategy:**
- Statistical analysis of generated encounters
- Playtest 3 runs per character to verify "feel"

---

### Feature 2: Character-Specific Rewards

#### Task 2.1: Reward Pool Architecture
**Priority:** P0 (Critical Path)
**Estimated Effort:** 3 hours
**Dependencies:** None
**Sprint:** Week 1, Day 3

**Description:**
Create reward pool system that maps character progression paths to appropriate loot tables.

**Acceptance Criteria:**
- [ ] Define reward pools for each `uniqueRewards` category
- [ ] Implement weighted reward selection (common 50%, uncommon 30%, rare 15%, epic 5%)
- [ ] Create fallback for rewards not yet implemented (temp placeholder items)

**Implementation Details:**
```javascript
// File: src/systems/rewards.js (NEW FILE)
export const RewardPools = {
    // Warrior rewards
    heavy_armor: [
        { id: 'iron_helm', rarity: 'common', stats: { def: 5, hp: 10 } },
        { id: 'steel_plate', rarity: 'uncommon', stats: { def: 8, hp: 15 } },
        { id: 'knights_armor', rarity: 'rare', stats: { def: 12, hp: 25, atk: 3 } },
        { id: 'titans_plate', rarity: 'epic', stats: { def: 18, hp: 40, atk: 5 } }
    ],
    shields: [
        { id: 'wooden_shield', rarity: 'common', stats: { def: 3 } },
        { id: 'iron_shield', rarity: 'uncommon', stats: { def: 6, hp: 10 } },
        { id: 'tower_shield', rarity: 'rare', stats: { def: 10, hp: 20 } }
    ],
    // Sorceress rewards
    staves: [
        { id: 'apprentice_staff', rarity: 'common', stats: { atk: 4, resource: 10 } },
        { id: 'mage_staff', rarity: 'uncommon', stats: { atk: 7, resource: 15 } },
        { id: 'archmage_staff', rarity: 'rare', stats: { atk: 12, resource: 25, crit: 5 } }
    ],
    mana_crystals: [
        { id: 'minor_crystal', rarity: 'common', stats: { resource: 15 } },
        { id: 'crystal_focus', rarity: 'uncommon', stats: { resource: 25, atk: 3 } }
    ],
    // Rogue rewards
    daggers: [
        { id: 'rusty_dagger', rarity: 'common', stats: { atk: 5, spd: 2 } },
        { id: 'sharp_dagger', rarity: 'uncommon', stats: { atk: 8, spd: 3, crit: 3 } },
        { id: 'assassins_blade', rarity: 'rare', stats: { atk: 12, spd: 5, crit: 8 } }
    ],
    poisons: [
        { id: 'weak_poison', rarity: 'common', stats: { atk: 3 } },
        { id: 'venom_vial', rarity: 'uncommon', stats: { atk: 5, crit: 5 } }
    ]
};

export function getCharacterReward(characterId, rewardSource = 'battle') {
    const character = Characters[characterId.toUpperCase()];
    const rewardCategories = character.uniqueRewards || ['heavy_armor'];

    // Choose random category from character's pool
    const category = rewardCategories[Math.floor(Math.random() * rewardCategories.length)];
    const pool = RewardPools[category] || [];

    if (pool.length === 0) return null;

    // Weighted random selection based on rarity
    const roll = Math.random();
    let filteredPool = pool;

    if (roll < 0.05) filteredPool = pool.filter(r => r.rarity === 'epic');
    else if (roll < 0.20) filteredPool = pool.filter(r => r.rarity === 'rare');
    else if (roll < 0.50) filteredPool = pool.filter(r => r.rarity === 'uncommon');
    else filteredPool = pool.filter(r => r.rarity === 'common');

    // Fall back to common if no items in rarity tier
    if (filteredPool.length === 0) filteredPool = pool.filter(r => r.rarity === 'common');

    return filteredPool[Math.floor(Math.random() * filteredPool.length)];
}
```

**Testing Strategy:**
- Generate 1000 rewards per character
- Verify rarity distribution matches weights
- Confirm no character gets duplicate categories

---

#### Task 2.2: Treasure Room Reward Integration
**Priority:** P0 (Critical Path)
**Estimated Effort:** 2 hours
**Dependencies:** Task 2.1
**Sprint:** Week 1, Day 4

**Description:**
Replace generic treasure room rewards with character-specific loot drops.

**Acceptance Criteria:**
- [ ] Treasure rooms grant gold + character-specific item (50% chance)
- [ ] Gold scales with floor: `base * (1 + floor * 0.2)`
- [ ] Item drop rate: 50% for regular treasures, 100% for special treasures
- [ ] Integrate with existing `RewardPopup` component

**Implementation Details:**
```javascript
// File: src/App.jsx - handleRoomEvent function
case RoomTypes.TREASURE:
    const goldReward = Math.floor((3 + Math.random() * 7) * (1 + floor * 0.2));
    GameState.earnGold(goldReward);

    let itemReward = null;
    if (Math.random() < 0.5) {
        itemReward = getCharacterReward(gameState.selectedCharacter, 'treasure');
    }

    setRewardPopup({
        type: 'treasure',
        gold: goldReward,
        item: itemReward,
        onClose: () => {
            setRewardPopup(null);
            completeRoom();
        }
    });
    break;
```

**Testing Strategy:**
- Test treasure room entry for all 3 characters
- Verify gold scaling across floors 1-10
- Confirm items are character-appropriate

---

#### Task 2.3: Battle Victory Reward Integration
**Priority:** P1 (High)
**Estimated Effort:** 3 hours
**Dependencies:** Task 2.1
**Sprint:** Week 1, Day 4

**Description:**
Add character-specific item drops to battle victories with balanced drop rates.

**Acceptance Criteria:**
- [ ] Regular battles: 20% item drop chance
- [ ] Elite battles: 50% item drop chance
- [ ] Boss battles: 100% item drop (guaranteed epic/rare)
- [ ] Display items on `OutcomeScreen` component

**Implementation Details:**
```javascript
// File: src/systems/combat.js - endBattle function
const dropChance = isBoss ? 1.0 : (isElite ? 0.5 : 0.2);
let itemDrop = null;

if (Math.random() < dropChance) {
    itemDrop = getCharacterReward(
        GameState.current.selectedCharacter,
        isBoss ? 'boss' : (isElite ? 'elite' : 'battle')
    );
}

// Pass to outcome screen
GameState.update('battleResults', {
    victory: true,
    goldEarned,
    xpEarned,
    itemDrop, // NEW
    totalEnemiesDefeated: allWaveEnemiesDefeated
});
```

**Testing Strategy:**
- Run 100 battles per character type
- Verify drop rate distribution
- Confirm boss battles always drop items

---

#### Task 2.4: Shrine Blessing Customization
**Priority:** P2 (Medium)
**Estimated Effort:** 2 hours
**Dependencies:** Task 2.1
**Sprint:** Week 1, Day 5

**Description:**
Tailor shrine blessings to benefit character-specific playstyles.

**Acceptance Criteria:**
- [ ] Warrior shrines favor: +HP, +DEF, +vigor regeneration
- [ ] Sorceress shrines favor: +ATK, +mana, +spell damage
- [ ] Rogue shrines favor: +CRIT, +SPD, +energy, +dodge
- [ ] All shrines offer 3 choices with character-weighted randomization

**Implementation Details:**
```javascript
// File: src/systems/shrines.js (NEW FILE)
const ShrineBlessings = {
    warrior: [
        { id: 'iron_resolve', stats: { hp: 20, def: 5 }, weight: 3 },
        { id: 'bulwark', stats: { def: 10 }, weight: 3 },
        { id: 'vigor_surge', effect: 'vigor_regen_+2', weight: 2 },
        { id: 'strength_of_ages', stats: { atk: 8, hp: 15 }, weight: 2 }
    ],
    sorceress: [
        { id: 'arcane_power', stats: { atk: 12 }, weight: 3 },
        { id: 'mana_well', stats: { resource: 30 }, weight: 3 },
        { id: 'spell_focus', stats: { atk: 8, crit: 5 }, weight: 2 },
        { id: 'elemental_mastery', effect: 'spell_damage_+15%', weight: 2 }
    ],
    rogue: [
        { id: 'assassins_edge', stats: { crit: 10 }, weight: 3 },
        { id: 'shadow_step', stats: { spd: 8 }, weight: 3 },
        { id: 'deadly_precision', stats: { atk: 10, crit: 5 }, weight: 2 },
        { id: 'adrenaline_rush', effect: 'energy_regen_+3', weight: 2 }
    ]
};
```

**Testing Strategy:**
- Visit shrines 50 times per character
- Verify blessing distribution matches weights
- Confirm stat bonuses apply correctly

---

### Feature 3: Auto-Save System

#### Task 3.1: Auto-Save Trigger Points
**Priority:** P0 (Critical Path)
**Estimated Effort:** 2 hours
**Dependencies:** None
**Sprint:** Week 2, Day 1

**Description:**
Implement automatic save triggers at critical game progression points.

**Acceptance Criteria:**
- [ ] Auto-save on floor advancement (stairs)
- [ ] Auto-save after battle victory
- [ ] Auto-save after level up
- [ ] Auto-save after room completion (treasure, shrine, shop)
- [ ] Visual feedback: "Game Saved" toast notification

**Implementation Details:**
```javascript
// File: src/core/state.js - Add autoSave method
autoSave() {
    if (!this.current.gameStarted || !this.current.selectedCharacter) return;

    const characterId = this.current.selectedCharacter;
    const slotNumber = this.current.currentSaveSlot || 1;

    try {
        this.saveGame(characterId, slotNumber);
        Logger.log(`Auto-saved ${characterId} slot ${slotNumber}`, 'SYSTEM');

        // Trigger save notification (handled by App.jsx)
        this.update('lastAutoSave', Date.now());
    } catch (error) {
        Logger.log(`Auto-save failed: ${error}`, 'ERROR');
    }
}
```

**Testing Strategy:**
- Trigger each save point manually
- Verify save file updates with correct data
- Test save failure scenarios (localStorage full)

---

#### Task 3.2: Auto-Save UI Feedback
**Priority:** P1 (High)
**Estimated Effort:** 1 hour
**Dependencies:** Task 3.1
**Sprint:** Week 2, Day 1

**Description:**
Add non-intrusive UI feedback to confirm auto-save execution.

**Acceptance Criteria:**
- [ ] Toast notification appears for 2 seconds
- [ ] Shows "Game Saved ✓" with timestamp
- [ ] Positioned top-right corner
- [ ] Does not block gameplay
- [ ] Animated fade-in/fade-out

**Implementation Details:**
```javascript
// File: src/components/auto-save-toast.jsx (NEW FILE)
export default function AutoSaveToast({ timestamp }) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(false), 2000);
        return () => clearTimeout(timer);
    }, [timestamp]);

    if (!visible) return null;

    return (
        <div className="fixed top-4 right-4 bg-green-900 text-green-100 px-4 py-2 rounded shadow-lg animate-fade-in z-50">
            <span className="text-sm">✓ {t('system.gameSaved')}</span>
        </div>
    );
}
```

**Testing Strategy:**
- Test toast appearance on all save triggers
- Verify animation smoothness
- Test multiple rapid saves (no overlap)

---

#### Task 3.3: Save Slot Recovery System
**Priority:** P2 (Medium)
**Estimated Effort:** 2 hours
**Dependencies:** Task 3.1
**Sprint:** Week 2, Day 2

**Description:**
Implement recovery mechanism for corrupted or failed saves.

**Acceptance Criteria:**
- [ ] Create backup copy of save before overwriting
- [ ] Validate save data integrity before loading
- [ ] Restore from backup if current save fails
- [ ] Show error message with recovery option

**Implementation Details:**
```javascript
// File: src/core/state.js - Enhanced saveGame method
saveGame(characterId, slotNumber) {
    const saveKey = `pathOfHeroes_save_${characterId}_${slotNumber}`;
    const backupKey = `${saveKey}_backup`;

    // Backup existing save
    const existingSave = localStorage.getItem(saveKey);
    if (existingSave) {
        localStorage.setItem(backupKey, existingSave);
    }

    const saveData = {
        version: '2.0',
        characterId,
        level: this.current.level,
        floor: this.current.currentFloor,
        gold: this.current.gold,
        experience: this.current.experience || 0,
        inventory: this.current.inventory || [],
        player: this.current.player,
        lastSaved: Date.now(),
        checksum: this.generateChecksum() // Integrity check
    };

    try {
        localStorage.setItem(saveKey, JSON.stringify(saveData));
        Logger.log(`Saved ${characterId} to slot ${slotNumber}`, 'STATE');
    } catch (error) {
        // Restore from backup
        if (existingSave) {
            localStorage.setItem(saveKey, existingSave);
        }
        throw error;
    }
}
```

**Testing Strategy:**
- Simulate corrupted save file
- Verify backup restoration works
- Test with full localStorage (quota exceeded)

---

### Feature 4: Enhanced Room Events

#### Task 4.1: Shop Enhancement - Item Variety
**Priority:** P1 (High)
**Estimated Effort:** 3 hours
**Dependencies:** Task 2.1
**Sprint:** Week 2, Day 3

**Description:**
Enhance shop system to offer character-appropriate items with better variety.

**Acceptance Criteria:**
- [ ] Shop offers 4 items (was 3): 2 character-specific, 2 universal
- [ ] Universal items: health potions, resource potions, stat boosters
- [ ] Prices scale with floor and item rarity
- [ ] Can purchase multiple items (no longer one-purchase limit)

**Implementation Details:**
```javascript
// File: src/systems/inventory.js - Enhanced generateItemsForShop
generateItemsForShop(count = 4, floor = 1) {
    const characterId = GameState.current.selectedCharacter;
    const items = [];

    // 2 character-specific items
    for (let i = 0; i < 2; i++) {
        const item = getCharacterReward(characterId, 'shop');
        if (item) {
            item.price = this.calculatePrice(item, floor);
            items.push(item);
        }
    }

    // 2 universal items
    items.push(this.generateConsumable('health_potion', floor));
    items.push(this.generateConsumable('resource_potion', floor));

    return items;
}

calculatePrice(item, floor) {
    const rarityMultiplier = {
        common: 1.0,
        uncommon: 2.0,
        rare: 4.0,
        epic: 8.0
    };

    const basePrice = 10;
    const floorMultiplier = 1 + (floor - 1) * 0.15;
    const rarity = rarityMultiplier[item.rarity] || 1.0;

    return Math.floor(basePrice * floorMultiplier * rarity);
}
```

**Testing Strategy:**
- Visit shops on floors 1, 5, 10
- Verify price scaling and item variety
- Test purchasing all items (no limit)

---

#### Task 4.2: Campfire Event System
**Priority:** P2 (Medium)
**Estimated Effort:** 3 hours
**Dependencies:** None
**Sprint:** Week 2, Day 4

**Description:**
Implement campfire rest and upgrade choices as described in README.

**Acceptance Criteria:**
- [ ] Campfire offers 2 choices: Rest or Sharpen
- [ ] Rest: Heal 30% of max HP
- [ ] Sharpen: Permanently increase random stat (ATK/DEF/SPD) by 3-5 points
- [ ] Can only choose one option per campfire
- [ ] Uses `EventInterimScreen` for presentation

**Implementation Details:**
```javascript
// File: src/App.jsx - Add campfire case to handleRoomEvent
case RoomTypes.CAMPFIRE:
    setInterimScreen({
        type: 'intro',
        eventType: 'campfire',
        eventData: {
            choices: [
                {
                    id: 'rest',
                    label: t('events.campfire.rest'),
                    description: t('events.campfire.restDesc'),
                    icon: '💤'
                },
                {
                    id: 'sharpen',
                    label: t('events.campfire.sharpen'),
                    description: t('events.campfire.sharpenDesc'),
                    icon: '⚔️'
                }
            ]
        },
        onContinue: (choiceId) => {
            if (choiceId === 'rest') {
                const healAmount = Math.floor(gameState.player.maxStats.hp * 0.3);
                GameState.current.player.stats.hp = Math.min(
                    gameState.player.stats.hp + healAmount,
                    gameState.player.maxStats.hp
                );
                Logger.log(`Rested and healed ${healAmount} HP`, 'PLAYER');
            } else if (choiceId === 'sharpen') {
                const stats = ['atk', 'def', 'spd'];
                const stat = stats[Math.floor(Math.random() * stats.length)];
                const boost = 3 + Math.floor(Math.random() * 3); // 3-5

                GameState.current.player.stats[stat] += boost;
                GameState.current.player.maxStats[stat] += boost;
                Logger.log(`Sharpened ${stat.toUpperCase()} by ${boost}`, 'PLAYER');
            }

            setInterimScreen(null);
            completeRoom();
            GameState.autoSave();
        }
    });
    break;
```

**Testing Strategy:**
- Test both choices multiple times
- Verify stat boosts persist across battles
- Confirm can't use campfire twice

---

#### Task 4.3: Mystery Event System
**Priority:** P2 (Medium)
**Estimated Effort:** 4 hours
**Dependencies:** None
**Sprint:** Week 2, Day 5

**Description:**
Create random narrative mystery events with risk/reward choices.

**Acceptance Criteria:**
- [ ] Pool of 5 mystery events with 2 choices each
- [ ] Outcomes: gain gold, lose gold, gain item, trigger trap (lose HP), gain stat
- [ ] 20% chance mystery room appears instead of treasure
- [ ] Uses localization for all text

**Implementation Details:**
```javascript
// File: src/systems/mystery-events.js (NEW FILE)
export const MysteryEvents = [
    {
        id: 'crumbling_chest',
        titleKey: 'events.mystery.crumbling_chest.title',
        descriptionKey: 'events.mystery.crumbling_chest.description',
        choices: [
            {
                id: 'open',
                labelKey: 'events.mystery.crumbling_chest.open',
                outcomes: [
                    { type: 'gold', value: 20, chance: 0.6 },
                    { type: 'trap', value: 15, chance: 0.4 } // Lose 15 HP
                ]
            },
            {
                id: 'leave',
                labelKey: 'events.mystery.crumbling_chest.leave',
                outcomes: [
                    { type: 'nothing', chance: 1.0 }
                ]
            }
        ]
    },
    {
        id: 'wounded_adventurer',
        titleKey: 'events.mystery.wounded_adventurer.title',
        descriptionKey: 'events.mystery.wounded_adventurer.description',
        choices: [
            {
                id: 'help',
                labelKey: 'events.mystery.wounded_adventurer.help',
                outcomes: [
                    { type: 'item', chance: 0.7 },
                    { type: 'gold', value: 30, chance: 0.3 }
                ]
            },
            {
                id: 'rob',
                labelKey: 'events.mystery.wounded_adventurer.rob',
                outcomes: [
                    { type: 'gold', value: 15, chance: 1.0 },
                    { type: 'stat_loss', stat: 'def', value: 2, chance: 0.5 }
                ]
            }
        ]
    }
    // ... 3 more events
];

export function getRandomMysteryEvent() {
    return MysteryEvents[Math.floor(Math.random() * MysteryEvents.length)];
}

export function executeMysteryOutcome(outcome, characterId) {
    switch (outcome.type) {
        case 'gold':
            GameState.earnGold(outcome.value);
            return t('events.mystery.outcome.gold', { amount: outcome.value });
        case 'trap':
            GameState.current.player.stats.hp = Math.max(
                1,
                GameState.current.player.stats.hp - outcome.value
            );
            return t('events.mystery.outcome.trap', { damage: outcome.value });
        case 'item':
            const item = getCharacterReward(characterId, 'mystery');
            if (item) GameState.current.inventory.push(item);
            return t('events.mystery.outcome.item', { item: item.nameKey });
        // ... other outcome types
    }
}
```

**Testing Strategy:**
- Trigger all 5 mystery events
- Test all choice combinations
- Verify outcome probabilities match design

---

## II. SPRINT BREAKDOWN

### Sprint 1: Week 1 (Core Systems)
**Focus:** Character-specific encounters and rewards foundation

#### Day 1-2: Enemy Encounter System
- Task 1.1: Enemy Type System Foundation (3-4h)
- Task 1.2: Character-Specific Encounter Generator (4h)
- **Deliverable:** Characters face appropriate enemy types

#### Day 3: Encounter Validation & Reward Architecture
- Task 1.3: Encounter Validation & Balance Testing (2h)
- Task 2.1: Reward Pool Architecture (3h)
- **Deliverable:** Reward pools created for all 3 characters

#### Day 4: Reward Integration
- Task 2.2: Treasure Room Reward Integration (2h)
- Task 2.3: Battle Victory Reward Integration (3h)
- **Deliverable:** Character-specific loot drops working

#### Day 5: Polish & Testing
- Task 2.4: Shrine Blessing Customization (2h)
- Integration testing for Features 1 & 2
- Bug fixes and balance adjustments
- **Deliverable:** Week 1 features fully functional

**Week 1 Total Effort:** 28-30 hours

---

### Sprint 2: Week 2 (Auto-Save & Room Events)
**Focus:** Progress preservation and gameplay variety

#### Day 1-2: Auto-Save System
- Task 3.1: Auto-Save Trigger Points (2h)
- Task 3.2: Auto-Save UI Feedback (1h)
- Task 3.3: Save Slot Recovery System (2h)
- **Deliverable:** Auto-save fully functional with recovery

#### Day 3: Shop Enhancement
- Task 4.1: Shop Enhancement - Item Variety (3h)
- Integration testing with reward system
- **Deliverable:** Enhanced shop with character items

#### Day 4: Campfire System
- Task 4.2: Campfire Event System (3h)
- Localization for campfire text
- **Deliverable:** Campfire rest/upgrade working

#### Day 5: Mystery Events & Integration
- Task 4.3: Mystery Event System (4h)
- Full Phase 2 integration testing
- **Deliverable:** All 4 features integrated

**Week 2 Total Effort:** 15 hours

---

### Sprint 3: Week 3 (Optional - Polish & Content)
**Focus:** Balance, testing, and content expansion

#### Tasks:
- Add 3 more mystery events (2h)
- Expand reward pools with more items (3h)
- Balance testing with simulation (4h)
- Bug fixes and edge cases (4h)
- Documentation updates (2h)
- Localization completion (3h)

**Week 3 Total Effort:** 18 hours

---

## III. DEPENDENCY GRAPH

```
Critical Path (Must be completed in sequence):
┌──────────────┐
│  Task 1.1    │ Enemy Type System
│  (3-4h)      │
└──────┬───────┘
       │
       v
┌──────────────┐
│  Task 1.2    │ Encounter Generator
│  (4h)        │
└──────┬───────┘
       │
       v
┌──────────────┐
│  Task 1.3    │ Validation
│  (2h)        │
└──────────────┘

Parallel Path 1 (Can run alongside critical path after Task 1.1):
┌──────────────┐
│  Task 2.1    │ Reward Pool Architecture
│  (3h)        │
└──────┬───────┘
       │
       ├─────────┐─────────┐
       v         v         v
┌──────────┐ ┌──────────┐ ┌──────────┐
│ Task 2.2 │ │ Task 2.3 │ │ Task 2.4 │
│  (2h)    │ │  (3h)    │ │  (2h)    │
└──────────┘ └──────────┘ └──────────┘
(Parallel execution possible)

Independent Path (No dependencies):
┌──────────────┐
│  Task 3.1    │ Auto-Save Triggers
│  (2h)        │
└──────┬───────┘
       │
       v
┌──────────────┐    ┌──────────────┐
│  Task 3.2    │    │  Task 3.3    │
│  (1h)        │    │  (2h)        │
└──────────────┘    └──────────────┘
(Parallel execution possible)

Content Path (Can start anytime):
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Task 4.1    │    │  Task 4.2    │    │  Task 4.3    │
│  (3h)        │    │  (3h)        │    │  (4h)        │
└──────────────┘    └──────────────┘    └──────────────┘
(Parallel execution possible)
```

---

## IV. PRIORITY MATRIX

### P0 - Critical Path (Must Complete)
1. Task 1.1: Enemy Type System Foundation
2. Task 1.2: Character-Specific Encounter Generator
3. Task 2.1: Reward Pool Architecture
4. Task 2.2: Treasure Room Reward Integration
5. Task 3.1: Auto-Save Trigger Points

**Total Critical Path Effort:** 14-15 hours

### P1 - High Priority (Essential for Phase 2)
1. Task 1.3: Encounter Validation & Balance Testing
2. Task 2.3: Battle Victory Reward Integration
3. Task 3.2: Auto-Save UI Feedback
4. Task 4.1: Shop Enhancement

**Total High Priority Effort:** 11 hours

### P2 - Medium Priority (Enhance Experience)
1. Task 2.4: Shrine Blessing Customization
2. Task 3.3: Save Slot Recovery System
3. Task 4.2: Campfire Event System
4. Task 4.3: Mystery Event System

**Total Medium Priority Effort:** 11 hours

### P3 - Low Priority (Nice to Have)
1. Additional mystery events (beyond 5)
2. Expanded reward pools (more item variety)
3. Advanced shrine effects (stackable buffs)
4. Save file compression

---

## V. RESOURCE REQUIREMENTS

### Developer Skills Needed
- **JavaScript/React:** All tasks (required)
- **State Management:** Tasks 3.x (GameState architecture)
- **Game Balance:** Tasks 1.3, 2.x (numerical design)
- **Localization:** Tasks 4.x (translation integration)
- **Testing:** Tasks 1.3, integration testing

### Tools & Assets
- **No new tools required** - all work within existing stack
- **Assets needed:**
  - 15+ item icons for reward pools (can use emoji temporarily)
  - 5 mystery event illustrations (optional, text-only acceptable)

### Testing Requirements
- **Unit Tests:** 8 hours (test individual systems)
- **Integration Tests:** 6 hours (test feature combinations)
- **Playtesting:** 4 hours (3 full runs per character)
- **Balance Simulation:** 4 hours (run existing simulation scripts)

---

## VI. RISK ANALYSIS & MITIGATION

### High Risk Items

#### Risk 1: Enemy Type Filtering Creates Repetitive Encounters
**Impact:** High - Reduces gameplay variety
**Probability:** Medium (30%)
**Mitigation:**
- Ensure minimum 6 enemies per type category
- Implement "variety boost" that reduces repeat chances
- Fallback to random enemies if pool is exhausted

#### Risk 2: Reward Pools Lack Depth (Not Enough Items)
**Impact:** Medium - Players see duplicate items quickly
**Probability:** High (60%)
**Mitigation:**
- Create 12+ items per character (4 per rarity tier)
- Use procedural modifiers (prefixes/suffixes) for variety
- Share universal items across all characters

#### Risk 3: Auto-Save Causes Performance Issues
**Impact:** Low - Brief frame drop during save
**Probability:** Low (10%)
**Mitigation:**
- Debounce save triggers (max 1 save per 3 seconds)
- Use async localStorage API where available
- Compress save data with JSON minification

### Medium Risk Items

#### Risk 4: Balance Issues with Character-Specific Encounters
**Impact:** Medium - One character becomes easier/harder
**Probability:** Medium (40%)
**Mitigation:**
- Run extensive simulation testing (Task 1.3)
- Implement dynamic difficulty adjustment
- Monitor playtest feedback closely

#### Risk 5: Mystery Event Outcomes Feel Unfair
**Impact:** Low - Player frustration with RNG
**Probability:** Medium (35%)
**Mitigation:**
- Clearly telegraph outcomes in choice descriptions
- Ensure negative outcomes have positive counterbalance
- Allow players to preview mystery event risks

---

## VII. SUCCESS METRICS

### Quantitative Metrics
1. **Encounter Variety:** 70% character-appropriate, 30% random (Task 1.2)
2. **Reward Distribution:** 50/30/15/5 (common/uncommon/rare/epic) (Task 2.1)
3. **Auto-Save Reliability:** 99.9% success rate (Task 3.1)
4. **Item Drop Rates:** 20% regular, 50% elite, 100% boss (Task 2.3)

### Qualitative Metrics
1. **Character Identity:** Each character feels distinct in encounters/rewards
2. **Progress Security:** Players trust auto-save system
3. **Event Engagement:** Room events feel rewarding and strategic
4. **Balance:** No character is significantly easier/harder

### Testing Benchmarks
- **Simulation:** 1000 encounters per character show expected distribution
- **Playtesting:** 3 full runs (floors 1-10) per character complete without bugs
- **Performance:** Auto-save completes in <100ms on average device

---

## VIII. IMPLEMENTATION NOTES

### Code Quality Standards
- All new functions must have JSDoc comments
- Use TypeScript-style inline type hints where possible
- Follow existing kebab-case naming convention
- Maximum function length: 50 lines

### Localization Requirements
- All user-facing text must use `t('key')` function
- Add new keys to both `en.json` and `ar.json`
- Use descriptive key paths: `events.campfire.rest`
- Support dynamic placeholders: `{amount}`, `{item}`

### Testing Standards
- Unit tests for all reward generation functions
- Integration tests for auto-save triggers
- Manual playtesting checklist per feature
- Performance benchmarks for save operations

### Documentation Updates
After Phase 2 completion, update:
- `README.md`: Add Phase 2 features to changelog (v8.0)
- `CLAUDE.md`: Update architecture section with new systems
- `LOCALIZATION.md`: Add new translation keys
- Create `PHASE_2_RETROSPECTIVE.md` with lessons learned

---

## IX. PARALLEL WORK STREAMS

### Stream 1: Core Systems (Primary Developer)
**Week 1:**
- Days 1-2: Tasks 1.1, 1.2 (Enemy encounters)
- Days 3-4: Tasks 2.1, 2.2, 2.3 (Rewards)
- Day 5: Integration testing

**Week 2:**
- Days 1-2: Tasks 3.1, 3.2, 3.3 (Auto-save)
- Days 3-5: Integration and polish

### Stream 2: Content Creation (Secondary Developer/Designer)
**Week 1:**
- Create reward pool items (Task 2.1 support)
- Design mystery events (Task 4.3 prep)
- Write localization text for events

**Week 2:**
- Implement Tasks 4.1, 4.2, 4.3 (Room events)
- Balance testing and simulation
- Bug fixes and polish

### Stream 3: Testing & QA (Can be same developer, different time blocks)
**Ongoing:**
- Unit tests after each task completion
- Daily integration testing
- Weekly playtest sessions
- Performance monitoring

---

## X. CRITICAL PATH ANALYSIS

### Longest Path to Completion
```
Task 1.1 (4h) → Task 1.2 (4h) → Task 2.1 (3h) → Task 2.3 (3h) →
Task 3.1 (2h) → Task 4.1 (3h) → Integration (4h) = 23 hours
```

### Minimum Viable Phase 2 (Critical Path Only)
If time-constrained, complete only P0 tasks:
- Tasks 1.1, 1.2: Character encounters (8h)
- Tasks 2.1, 2.2: Basic rewards (5h)
- Task 3.1: Auto-save triggers (2h)
- **Total: 15 hours** for core functionality

### Full Phase 2 Completion
- P0 tasks: 15 hours
- P1 tasks: 11 hours
- P2 tasks: 11 hours
- Integration/Testing: 8 hours
- **Total: 45 hours** for complete Phase 2

---

## XI. HANDOFF CHECKLIST

Before declaring Phase 2 complete, verify:

### Functionality
- [ ] All 3 characters face appropriate enemy types (70/30 split)
- [ ] Rewards are character-specific and balanced
- [ ] Auto-save triggers work at all designated points
- [ ] Shop, campfire, mystery events are fully functional
- [ ] No critical bugs or crashes

### Testing
- [ ] Unit tests pass for all new systems
- [ ] Integration tests pass for feature combinations
- [ ] 3 full playthroughs per character (9 total runs)
- [ ] Simulation shows balanced distribution
- [ ] Performance benchmarks met

### Documentation
- [ ] README.md updated with Phase 2 features
- [ ] CLAUDE.md updated with new architecture
- [ ] LOCALIZATION.md updated with new keys
- [ ] Code comments complete for all new functions

### Polish
- [ ] All UI text uses localization system
- [ ] Auto-save toast notification works
- [ ] Reward popup shows items correctly
- [ ] No placeholder text or missing translations

### Deployment
- [ ] Code committed to repository
- [ ] Build process successful
- [ ] No console errors or warnings
- [ ] Mobile testing completed

---

## XII. CONTACT & ESCALATION

### Technical Questions
Refer to existing architecture in:
- `src/core/state.js` - State management patterns
- `src/systems/dungeon.js` - Enemy generation logic
- `src/systems/combat.js` - Battle and reward flow

### Blocker Resolution
If tasks are blocked:
1. Check dependency graph (Section III)
2. Review risk mitigation strategies (Section VI)
3. Consider de-scoping to P0 tasks only

### Change Requests
If scope changes during implementation:
1. Update priority matrix (Section IV)
2. Recalculate critical path (Section X)
3. Adjust sprint breakdown (Section II)

---

## XIII. APPENDIX

### A. File Creation Checklist
New files to create:
- [ ] `src/systems/rewards.js` - Reward pool and generation
- [ ] `src/systems/shrines.js` - Shrine blessing system
- [ ] `src/systems/mystery-events.js` - Mystery event definitions
- [ ] `src/components/auto-save-toast.jsx` - Save notification UI
- [ ] `balance-simulation-encounters.js` - Encounter testing script

### B. Existing Files to Modify
Files that need updates:
- [ ] `src/constants/enemies.js` - Add enemyType property
- [ ] `src/systems/dungeon.js` - Update encounter generation
- [ ] `src/systems/combat.js` - Add item drops to battle end
- [ ] `src/systems/inventory.js` - Enhance shop generation
- [ ] `src/core/state.js` - Add autoSave() method
- [ ] `src/App.jsx` - Add campfire/mystery handlers
- [ ] `public/locales/en.json` - Add event translations
- [ ] `public/locales/ar.json` - Add event translations

### C. Testing Scripts
Create these test utilities:
- `tests/encounter-distribution.test.js` - Verify 70/30 split
- `tests/reward-balance.test.js` - Verify rarity distribution
- `tests/auto-save-stress.test.js` - Test save reliability

---

**End of Phase 2 Task Execution Plan**

**Document Version:** 1.0
**Created By:** Task Orchestrator Agent
**Date:** September 30, 2025
**Total Estimated Effort:** 45-60 hours (2-3 weeks)
**Next Phase:** Phase 3 - Content & Polish (see README.md)
