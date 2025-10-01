# Phase 2 Quick Reference Guide
## Path of Heroes - Implementation Cheat Sheet

**Last Updated:** September 30, 2025

---

## OVERVIEW

**Phase 2 Goal:** Character-specific gameplay enhancement with 4 core features
**Timeline:** 2-3 weeks
**Total Effort:** 45-60 hours
**Team Size:** 1-2 developers

---

## QUICK STATS

| Metric | Value |
|--------|-------|
| **Total Tasks** | 13 atomic tasks |
| **Critical Path** | 5 tasks (15 hours) |
| **New Files** | 5 systems + 1 component |
| **Modified Files** | 8 existing files |
| **Priority Breakdown** | P0: 5, P1: 4, P2: 4 |
| **Parallel Streams** | 3 workstreams available |

---

## FEATURE CHECKLIST

### Feature 1: Character-Specific Enemy Encounters ✓
- [ ] Task 1.1: Add enemyType to all enemies (4h)
- [ ] Task 1.2: Implement encounter generator (4h)
- [ ] Task 1.3: Balance testing & validation (2h)
- **Total:** 10 hours | **Priority:** P0-P1

### Feature 2: Character-Specific Rewards ✓
- [ ] Task 2.1: Create reward pools (3h)
- [ ] Task 2.2: Treasure room integration (2h)
- [ ] Task 2.3: Battle victory drops (3h)
- [ ] Task 2.4: Shrine customization (2h)
- **Total:** 10 hours | **Priority:** P0-P2

### Feature 3: Auto-Save System ✓
- [ ] Task 3.1: Save trigger points (2h)
- [ ] Task 3.2: UI feedback toast (1h)
- [ ] Task 3.3: Recovery system (2h)
- **Total:** 5 hours | **Priority:** P0-P2

### Feature 4: Enhanced Room Events ✓
- [ ] Task 4.1: Shop enhancement (3h)
- [ ] Task 4.2: Campfire system (3h)
- [ ] Task 4.3: Mystery events (4h)
- **Total:** 10 hours | **Priority:** P1-P2

---

## DAILY SCHEDULE

### Week 1: Core Systems (28-30 hours)

**Day 1 (6-7h):**
- [ ] Task 1.1: Enemy Type System (3-4h)
- [ ] Task 1.2: Encounter Generator (start, 3h)

**Day 2 (5h):**
- [ ] Task 1.2: Encounter Generator (finish, 1h)
- [ ] Task 1.3: Balance Testing (2h)
- [ ] Task 2.1: Reward Pools (start, 2h)

**Day 3 (4h):**
- [ ] Task 2.1: Reward Pools (finish, 1h)
- [ ] Task 2.2: Treasure Integration (2h)
- [ ] Task 2.3: Battle Drops (start, 1h)

**Day 4 (5h):**
- [ ] Task 2.3: Battle Drops (finish, 2h)
- [ ] Task 2.4: Shrine Blessings (2h)
- [ ] Integration testing (1h)

**Day 5 (8h):**
- [ ] Full integration testing
- [ ] Bug fixes and polish
- [ ] Playtest Week 1 features

### Week 2: Auto-Save & Events (15-20 hours)

**Day 1 (5h):**
- [ ] Task 3.1: Auto-Save Triggers (2h)
- [ ] Task 3.2: Save UI Feedback (1h)
- [ ] Task 3.3: Recovery System (2h)

**Day 2 (4h):**
- [ ] Task 4.1: Shop Enhancement (3h)
- [ ] Integration testing (1h)

**Day 3 (3h):**
- [ ] Task 4.2: Campfire System (3h)

**Day 4 (4h):**
- [ ] Task 4.3: Mystery Events (4h)

**Day 5 (8h):**
- [ ] Full Phase 2 integration testing
- [ ] Bug fixes and balance
- [ ] Documentation updates

---

## TASK PRIORITY MATRIX

```
HIGH IMPACT / HIGH URGENCY (Do First)
┌─────────────────────────────────┐
│ • Task 1.1: Enemy Types         │ P0
│ • Task 1.2: Encounter Generator │ P0
│ • Task 2.1: Reward Pools        │ P0
│ • Task 3.1: Auto-Save Triggers  │ P0
└─────────────────────────────────┘

HIGH IMPACT / MEDIUM URGENCY (Do Second)
┌─────────────────────────────────┐
│ • Task 2.2: Treasure Rewards    │ P0
│ • Task 2.3: Battle Drops        │ P1
│ • Task 1.3: Balance Testing     │ P1
└─────────────────────────────────┘

MEDIUM IMPACT / MEDIUM URGENCY (Do Third)
┌─────────────────────────────────┐
│ • Task 4.1: Shop Enhancement    │ P1
│ • Task 3.2: Save UI Feedback    │ P1
│ • Task 4.2: Campfire Events     │ P2
└─────────────────────────────────┘

MEDIUM IMPACT / LOW URGENCY (Do Last)
┌─────────────────────────────────┐
│ • Task 2.4: Shrine Blessings    │ P2
│ • Task 3.3: Save Recovery       │ P2
│ • Task 4.3: Mystery Events      │ P2
└─────────────────────────────────┘
```

---

## DEPENDENCY FLOW

```
START
  │
  ├─► Task 1.1 (Enemy Types) ────┬─► Task 1.2 (Encounter Gen) ─► Task 1.3 (Balance)
  │                               │
  ├─► Task 2.1 (Reward Pools) ───┼─► Task 2.2 (Treasure) ───────┐
  │                               │                              │
  │                               └─► Task 2.3 (Battle Drops) ───┤
  │                                                              │
  ├─► Task 3.1 (Auto-Save) ──┬─► Task 3.2 (UI Feedback)        │
  │                           │                                  │
  │                           └─► Task 3.3 (Recovery)           │
  │                                                              │
  └─► Task 4.x (Events) ───────────────────────────────────────┤
      (All tasks independent)                                   │
                                                                │
                                    INTEGRATION TESTING ◄───────┘
                                            │
                                        COMPLETE
```

---

## FILES ROADMAP

### New Files to Create

| File | Purpose | Lines | Created In |
|------|---------|-------|------------|
| `src/systems/rewards.js` | Reward pools & generation | ~200 | Task 2.1 |
| `src/systems/shrines.js` | Shrine blessing system | ~100 | Task 2.4 |
| `src/systems/mystery-events.js` | Mystery event definitions | ~150 | Task 4.3 |
| `src/components/auto-save-toast.jsx` | Save notification UI | ~40 | Task 3.2 |
| `balance-simulation-encounters.js` | Encounter testing script | ~100 | Task 1.3 |

### Files to Modify

| File | Changes | Tasks |
|------|---------|-------|
| `src/constants/enemies.js` | Add enemyType property | 1.1 |
| `src/systems/dungeon.js` | Update encounter generation | 1.2 |
| `src/systems/combat.js` | Add item drops | 2.3 |
| `src/systems/inventory.js` | Enhance shop system | 4.1 |
| `src/core/state.js` | Add autoSave() method | 3.1, 3.3 |
| `src/App.jsx` | Add event handlers | 4.2, 4.3 |
| `public/locales/en.json` | Add translations | 4.x |
| `public/locales/ar.json` | Add translations | 4.x |

---

## TESTING MATRIX

### Unit Tests (Per Task)

| Task | Test Focus | Method |
|------|-----------|--------|
| 1.1 | All enemies have types | Validation script |
| 1.2 | 70/30 distribution | Generate 100 encounters |
| 2.1 | Rarity weights (50/30/15/5) | Generate 1000 rewards |
| 2.3 | Drop rates (20/50/100) | Simulate 100 battles |
| 3.1 | Save triggers fire | Monitor save calls |
| 4.3 | Outcome probabilities | Run 100 events |

### Integration Tests (Per Feature)

| Feature | Test Scenario | Expected Result |
|---------|---------------|-----------------|
| F1 | Play 3 floors as Warrior | Face primarily brute/physical enemies |
| F2 | Complete 5 battles per char | Get character-appropriate items |
| F3 | Advance 3 floors | Auto-save triggers correctly |
| F4 | Visit shop/campfire/mystery | Events offer strategic choices |

### Playtest Checklist

- [ ] Complete floors 1-10 as Warrior
- [ ] Complete floors 1-10 as Sorceress
- [ ] Complete floors 1-10 as Rogue
- [ ] Verify encounters feel character-appropriate
- [ ] Verify rewards feel meaningful
- [ ] Verify auto-save works reliably
- [ ] Verify room events are engaging

---

## RISK DASHBOARD

### Active Risks

| Risk | Severity | Probability | Mitigation Status |
|------|----------|-------------|-------------------|
| Repetitive encounters | 🔴 High | 30% | Plan in place (variety boost) |
| Insufficient reward items | 🟡 Medium | 60% | Plan in place (12+ items/char) |
| Auto-save performance | 🟢 Low | 10% | Plan in place (debouncing) |
| Character balance issues | 🟡 Medium | 40% | Testing in Task 1.3 |
| Unfair mystery outcomes | 🟢 Low | 35% | Clear telegraphing |

### Mitigation Actions

**If Encounter Repetition Occurs:**
1. Reduce character-specific percentage to 60%
2. Implement "last seen" tracking
3. Increase random enemy pool diversity

**If Reward Pool Too Small:**
1. Use procedural prefix/suffix system
2. Share universal items across characters
3. Add stat-boost consumables as fillers

**If Auto-Save Lags:**
1. Implement save debouncing (max 1/3sec)
2. Compress JSON data
3. Move to web worker if necessary

---

## SUCCESS CRITERIA

### Minimum Viable (P0 Only)
- [x] Character encounters match progression 70% of time
- [x] Treasure rooms drop character-specific items
- [x] Auto-save triggers on floor advancement
- **Completion Time:** 15 hours

### Complete Phase 2 (P0 + P1)
- [x] All P0 criteria met
- [x] Battle victories drop items at correct rates
- [x] Shop offers character-appropriate items
- [x] Auto-save UI feedback working
- **Completion Time:** 26 hours

### Polished Phase 2 (P0 + P1 + P2)
- [x] All P1 criteria met
- [x] Shrine blessings customized per character
- [x] Campfire rest/upgrade working
- [x] Mystery events functional
- [x] Save recovery system in place
- **Completion Time:** 45 hours

---

## RESOURCE CALCULATOR

### Time Estimates by Developer Experience

| Experience | P0 Tasks | P0+P1 Tasks | Full Phase 2 |
|------------|----------|-------------|--------------|
| Senior Dev | 12h | 20h | 35h |
| Mid-Level Dev | 15h | 26h | 45h |
| Junior Dev | 20h | 35h | 60h |

### Parallel Work Distribution

**2-Developer Team:**
- **Dev 1:** Tasks 1.x, 2.1, 2.2, 2.3, 3.x (Core systems)
- **Dev 2:** Tasks 2.4, 4.x (Content & events)
- **Timeline:** 1.5 weeks (with 50% time overlap)

**1-Developer Team:**
- Follow daily schedule in Section "Daily Schedule"
- **Timeline:** 2-3 weeks (depending on experience)

---

## CODE SNIPPETS

### Quick Copy-Paste Templates

#### Adding Enemy Type (Task 1.1)
```javascript
// In src/constants/enemies.js
goblin: {
    id: 'goblin',
    enemyType: ['physical', 'brute'], // ADD THIS LINE
    nameKey: 'enemies.goblin',
    // ... rest of properties
}
```

#### Character-Specific Encounter (Task 1.2)
```javascript
// In src/systems/dungeon.js
function getCharacterAppropriateEnemy(characterId, floor) {
    const character = Characters[characterId.toUpperCase()];
    const preferredTypes = character.preferredEnemyTypes || [];
    const availableEnemies = getFloorEnemies(floor);

    const matchingEnemies = availableEnemies.filter(enemyId => {
        const enemy = EnemyDatabase[enemyId];
        return enemy.enemyType.some(type => preferredTypes.includes(type));
    });

    if (Math.random() < 0.70 && matchingEnemies.length > 0) {
        return matchingEnemies[Math.floor(Math.random() * matchingEnemies.length)];
    }

    return availableEnemies[Math.floor(Math.random() * availableEnemies.length)];
}
```

#### Auto-Save Trigger (Task 3.1)
```javascript
// In src/core/state.js
autoSave() {
    if (!this.current.gameStarted || !this.current.selectedCharacter) return;

    const characterId = this.current.selectedCharacter;
    const slotNumber = this.current.currentSaveSlot || 1;

    try {
        this.saveGame(characterId, slotNumber);
        Logger.log(`Auto-saved ${characterId} slot ${slotNumber}`, 'SYSTEM');
        this.update('lastAutoSave', Date.now());
    } catch (error) {
        Logger.log(`Auto-save failed: ${error}`, 'ERROR');
    }
}
```

#### Auto-Save Toast (Task 3.2)
```javascript
// New file: src/components/auto-save-toast.jsx
import React, { useEffect, useState } from 'react';
import { t } from '../core/localization';

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

---

## LOCALIZATION KEYS

### Required Translation Additions

**English (`public/locales/en.json`):**
```json
{
    "events": {
        "campfire": {
            "title": "Campfire",
            "rest": "Rest",
            "restDesc": "Heal 30% of max HP",
            "sharpen": "Sharpen",
            "sharpenDesc": "Permanently increase a random stat"
        },
        "mystery": {
            "crumbling_chest": {
                "title": "A Crumbling Chest",
                "description": "You find an old chest. It looks fragile...",
                "open": "Open it",
                "leave": "Leave it"
            },
            "outcome": {
                "gold": "You found {amount} gold!",
                "trap": "It was a trap! You took {damage} damage.",
                "item": "You found {item}!"
            }
        }
    },
    "system": {
        "gameSaved": "Game Saved"
    },
    "rewards": {
        "itemDropped": "Item dropped: {item}",
        "noReward": "No items dropped this time"
    }
}
```

**Arabic (`public/locales/ar.json`):**
```json
{
    "events": {
        "campfire": {
            "title": "نار المخيم",
            "rest": "استرح",
            "restDesc": "استعد 30% من نقاط الحياة القصوى",
            "sharpen": "اشحذ",
            "sharpenDesc": "زد إحصائية عشوائية بشكل دائم"
        },
        "mystery": {
            "crumbling_chest": {
                "title": "صندوق متداعٍ",
                "description": "وجدت صندوقًا قديمًا. يبدو هشًا...",
                "open": "افتحه",
                "leave": "اتركه"
            },
            "outcome": {
                "gold": "وجدت {amount} ذهب!",
                "trap": "كان فخًا! تلقيت {damage} ضرر.",
                "item": "وجدت {item}!"
            }
        }
    },
    "system": {
        "gameSaved": "تم حفظ اللعبة"
    }
}
```

---

## COMMIT STRATEGY

### Recommended Git Workflow

**Week 1 Commits:**
```
Day 1: feat: add enemy type classification system (Task 1.1)
Day 2: feat: implement character-specific encounter generator (Task 1.2)
Day 3: test: add encounter balance validation (Task 1.3)
Day 3: feat: create reward pool architecture (Task 2.1)
Day 4: feat: integrate character rewards in treasure rooms (Task 2.2)
Day 4: feat: add item drops to battle victories (Task 2.3)
Day 5: test: Week 1 integration testing and bug fixes
```

**Week 2 Commits:**
```
Day 1: feat: implement auto-save trigger system (Task 3.1)
Day 1: feat: add auto-save UI feedback toast (Task 3.2)
Day 2: feat: add save slot recovery system (Task 3.3)
Day 3: feat: enhance shop with character-specific items (Task 4.1)
Day 4: feat: implement campfire rest/upgrade system (Task 4.2)
Day 5: feat: add mystery event system (Task 4.3)
Day 5: docs: update README and CLAUDE with Phase 2 features
Day 5: chore: Phase 2 complete - version bump to 8.0
```

---

## TROUBLESHOOTING

### Common Issues & Solutions

#### Issue: Encounters Too Repetitive
**Symptoms:** Same enemy appears 3+ times in a row
**Solution:**
```javascript
// Add "recently seen" tracking
let recentEnemies = [];
const maxRecent = 3;

// In encounter generator:
const filtered = matchingEnemies.filter(id => !recentEnemies.includes(id));
const chosen = filtered[Math.floor(Math.random() * filtered.length)];

recentEnemies.push(chosen);
if (recentEnemies.length > maxRecent) recentEnemies.shift();
```

#### Issue: Auto-Save Causes Frame Drops
**Symptoms:** Visible lag when changing floors
**Solution:**
```javascript
// Add debouncing
let saveTimeout;
function debouncedAutoSave() {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        GameState.autoSave();
    }, 300); // Wait 300ms before saving
}
```

#### Issue: Mystery Event Outcomes Feel Unfair
**Symptoms:** Players complain about bad RNG
**Solution:**
- Add outcome preview text: "This choice is risky but rewarding"
- Implement pity timer: After 3 bad outcomes, guarantee good one
- Balance negative outcomes with positive compensation

---

## FINAL CHECKLIST

### Before Starting
- [ ] Read full task plan document
- [ ] Set up development environment
- [ ] Create feature branch: `feature/phase-2-enhancement`
- [ ] Back up current codebase
- [ ] Review existing systems: state.js, dungeon.js, combat.js

### During Development
- [ ] Follow daily schedule
- [ ] Commit after each task completion
- [ ] Run unit tests for each system
- [ ] Update localization files as you go
- [ ] Document any deviations from plan

### Before Completion
- [ ] All 13 tasks marked complete
- [ ] All unit tests passing
- [ ] 3 full playthroughs per character (9 total)
- [ ] No critical bugs or crashes
- [ ] Performance benchmarks met (<100ms save time)
- [ ] All text uses localization system
- [ ] Code comments added for new functions

### Deployment Checklist
- [ ] Update README.md changelog (v8.0)
- [ ] Update CLAUDE.md architecture section
- [ ] Update LOCALIZATION.md with new keys
- [ ] Create PHASE_2_RETROSPECTIVE.md
- [ ] Merge feature branch to main
- [ ] Tag release: `v8.0-phase2-complete`
- [ ] Deploy to production
- [ ] Monitor for bugs in first 48 hours

---

## EMERGENCY CONTACTS

**Technical Blockers:**
- Review existing code in src/systems/
- Check CLAUDE.md for architecture patterns
- Reference balance-simulation.js for testing approach

**Scope Creep:**
- Focus on P0 tasks only (15 hours)
- Defer P2 tasks to Phase 3 if needed
- Document deferred features in PHASE_3_TASKS.md

**Quality Issues:**
- Run simulation: `node balance-simulation.js`
- Increase test coverage
- Request code review from team

---

**End of Quick Reference Guide**

**Version:** 1.0
**Last Updated:** September 30, 2025
**Companion Document:** PHASE_2_TASK_PLAN.md
