# Phase 2 Implementation Timeline
## Path of Heroes - Visual Schedule & Gantt Chart

**Created:** September 30, 2025
**Project Duration:** 2-3 weeks (45-60 hours)
**Work Pattern:** 5-8 hours per day, 5 days per week

---

## VISUAL TIMELINE

### Week 1: Core Systems Development

```
Day 1 (6-7 hours)
├─ 09:00-12:00 │██████████│ Task 1.1: Enemy Type System (3-4h) [P0]
├─ 12:00-13:00 │ LUNCH    │
└─ 13:00-16:00 │██████████│ Task 1.2: Encounter Generator - Part 1 (3h)

Day 2 (5 hours)
├─ 09:00-10:00 │████│ Task 1.2: Encounter Generator - Part 2 (1h) [P0]
├─ 10:00-12:00 │████████│ Task 1.3: Balance Testing (2h) [P1]
├─ 12:00-13:00 │ LUNCH  │
└─ 13:00-15:00 │████████│ Task 2.1: Reward Pools - Part 1 (2h) [P0]

Day 3 (4 hours)
├─ 09:00-10:00 │████│ Task 2.1: Reward Pools - Part 2 (1h) [P0]
├─ 10:00-12:00 │████████│ Task 2.2: Treasure Integration (2h) [P0]
├─ 12:00-13:00 │ LUNCH  │
└─ 13:00-14:00 │████│ Task 2.3: Battle Drops - Part 1 (1h) [P1]

Day 4 (5 hours)
├─ 09:00-11:00 │████████│ Task 2.3: Battle Drops - Part 2 (2h) [P1]
├─ 11:00-13:00 │████████│ Task 2.4: Shrine Blessings (2h) [P2]
├─ 13:00-14:00 │ LUNCH  │
└─ 14:00-15:00 │████│ Integration Testing (1h)

Day 5 (8 hours)
├─ 09:00-12:00 │████████████│ Full Integration Testing
├─ 12:00-13:00 │ LUNCH      │
├─ 13:00-16:00 │████████████│ Bug Fixes & Polish
└─ 16:00-17:00 │████│ Playtest Week 1 Features

Week 1 Deliverable: ✓ Character encounters + rewards working
```

### Week 2: Auto-Save & Room Events

```
Day 1 (5 hours)
├─ 09:00-11:00 │████████│ Task 3.1: Auto-Save Triggers (2h) [P0]
├─ 11:00-12:00 │████│ Task 3.2: Save UI Feedback (1h) [P1]
├─ 12:00-13:00 │ LUNCH  │
└─ 13:00-15:00 │████████│ Task 3.3: Save Recovery (2h) [P2]

Day 2 (4 hours)
├─ 09:00-12:00 │████████████│ Task 4.1: Shop Enhancement (3h) [P1]
├─ 12:00-13:00 │ LUNCH      │
└─ 13:00-14:00 │████│ Integration Testing (1h)

Day 3 (3 hours)
├─ 09:00-12:00 │████████████│ Task 4.2: Campfire System (3h) [P2]
└─ 12:00-13:00 │ LUNCH      │

Day 4 (4 hours)
├─ 09:00-13:00 │████████████████│ Task 4.3: Mystery Events (4h) [P2]
└─ 13:00-14:00 │ LUNCH          │

Day 5 (8 hours)
├─ 09:00-12:00 │████████████│ Full Phase 2 Integration Testing
├─ 12:00-13:00 │ LUNCH      │
├─ 13:00-16:00 │████████████│ Bug Fixes & Balance Tuning
└─ 16:00-17:00 │████│ Documentation Updates

Week 2 Deliverable: ✓ Phase 2 complete and tested
```

### Week 3 (Optional): Polish & Expansion

```
Day 1-2 (8 hours)
└─ Content Expansion: Additional mystery events, reward items

Day 3 (4 hours)
└─ Balance Simulation: Run 1000+ encounter tests

Day 4 (4 hours)
└─ Bug Fixes: Address edge cases and playtester feedback

Day 5 (2 hours)
└─ Documentation: Complete localization, update guides
```

---

## GANTT CHART (Text-Based)

```
Task                          │ Week 1                    │ Week 2                    │
                              │ M  T  W  T  F            │ M  T  W  T  F            │
──────────────────────────────┼───────────────────────────┼───────────────────────────┤
1.1 Enemy Type System         │███                       │                          │
1.2 Encounter Generator       │███░░░                    │                          │
1.3 Balance Testing           │   ░░░                    │                          │
──────────────────────────────┼───────────────────────────┼───────────────────────────┤
2.1 Reward Pools              │      ░░░                 │                          │
2.2 Treasure Integration      │         ░░░              │                          │
2.3 Battle Drops              │            ░░░           │                          │
2.4 Shrine Blessings          │               ░░░        │                          │
──────────────────────────────┼───────────────────────────┼───────────────────────────┤
3.1 Auto-Save Triggers        │                          │░░░                       │
3.2 Save UI Feedback          │                          │░░                        │
3.3 Save Recovery             │                          │   ░░░                    │
──────────────────────────────┼───────────────────────────┼───────────────────────────┤
4.1 Shop Enhancement          │                          │      ░░░                 │
4.2 Campfire System           │                          │         ░░░              │
4.3 Mystery Events            │                          │            ░░░░          │
──────────────────────────────┼───────────────────────────┼───────────────────────────┤
Integration Testing           │                  ████████│                  ████████│
Documentation                 │                          │                      ████│

Legend: ███ = Active Development  ░░░ = In Progress  ████ = Testing/Polish
```

---

## CRITICAL PATH (PERT Chart)

```
START (Day 0)
    │
    ├──[1.1: 4h]──► Enemy Type System
    │                   │
    │                   ▼
    │              [1.2: 4h]──► Encounter Generator
    │                   │
    │                   ▼
    │              [1.3: 2h]──► Balance Testing ─────┐
    │                                                  │
    ├──[2.1: 3h]──► Reward Pools                     │
    │                   │                              │
    │                   ├──[2.2: 2h]──► Treasure ────┤
    │                   │                              │
    │                   └──[2.3: 3h]──► Battle Drops ─┤
    │                                                  │
    └──[3.1: 2h]──► Auto-Save Triggers ──────────────┤
                                                       │
                        INTEGRATION (Week 1 End) ◄────┘
                                │
                                ▼
                        Week 2 Development
                                │
                                ▼
                        COMPLETION (Day 10)

Critical Path Length: 17 hours (Longest sequential dependency chain)
Total Parallel Work Available: 28 hours (Can reduce to ~12 days with 2 devs)
```

---

## PARALLEL WORK STREAMS

### 2-Developer Team Distribution

```
Developer 1 (Backend/Systems Focus)
Week 1:
├─ Day 1-2 │ Tasks 1.1, 1.2, 1.3 (Enemy & Encounter Systems)
├─ Day 3-4 │ Tasks 2.1, 2.2, 2.3 (Reward Systems)
└─ Day 5   │ Integration Testing

Week 2:
├─ Day 1   │ Tasks 3.1, 3.2, 3.3 (Auto-Save System)
├─ Day 2-3 │ Integration Support
└─ Day 4-5 │ Testing & Bug Fixes

Total: ~25 hours


Developer 2 (Content/UI Focus)
Week 1:
├─ Day 1-3 │ Create reward pool items (support Task 2.1)
├─ Day 4   │ Task 2.4 (Shrine Blessings)
└─ Day 5   │ Playtesting & Feedback

Week 2:
├─ Day 1-2 │ Task 4.1 (Shop Enhancement)
├─ Day 3   │ Task 4.2 (Campfire System)
├─ Day 4   │ Task 4.3 (Mystery Events)
└─ Day 5   │ Localization & Documentation

Total: ~20 hours


Combined Timeline: 1.5-2 weeks (with optimal parallelization)
```

---

## MILESTONE TRACKING

### Milestone 1: Enemy Encounters Complete (End of Day 2)
**Deliverables:**
- [x] All enemies have enemyType property
- [x] Encounter generator respects character preferences
- [x] 70/30 distribution validated

**Acceptance Test:**
- Run simulation: Generate 100 encounters for each character
- Verify distribution matches expected percentages
- Confirm no character gets easier/harder enemies

**Blocker Resolution:**
- If distribution is off, adjust threshold in Task 1.2
- If enemies too repetitive, implement "recently seen" tracker

---

### Milestone 2: Reward System Complete (End of Day 4)
**Deliverables:**
- [x] Reward pools created for all 3 characters
- [x] Treasure rooms drop character-specific items
- [x] Battle victories drop items at correct rates
- [x] Shrines offer character-appropriate blessings

**Acceptance Test:**
- Complete 10 battles per character
- Verify items match character progression paths
- Confirm rarity distribution (50/30/15/5)

**Blocker Resolution:**
- If reward pool too small, add universal items
- If drop rates feel wrong, adjust percentages
- If shrines feel generic, add more character-specific options

---

### Milestone 3: Auto-Save Complete (End of Week 2, Day 1)
**Deliverables:**
- [x] Auto-save triggers on all designated points
- [x] UI feedback shows "Game Saved" toast
- [x] Recovery system handles corrupted saves

**Acceptance Test:**
- Trigger all save points: floor advance, battle win, level up
- Verify save file updates correctly
- Test recovery by corrupting save file

**Blocker Resolution:**
- If save causes lag, implement debouncing
- If save fails, add error handling and retry logic
- If recovery doesn't work, restore from backup

---

### Milestone 4: Room Events Complete (End of Week 2, Day 4)
**Deliverables:**
- [x] Shop offers 4 items (2 character-specific, 2 universal)
- [x] Campfire offers rest/upgrade choice
- [x] Mystery events have 5 scenarios with outcomes

**Acceptance Test:**
- Visit each event type multiple times
- Verify choices lead to expected outcomes
- Confirm text is properly localized

**Blocker Resolution:**
- If events feel shallow, add more choices/outcomes
- If rewards feel unbalanced, adjust values
- If text is missing, add to localization files

---

### Milestone 5: Phase 2 Complete (End of Week 2, Day 5)
**Deliverables:**
- [x] All 13 tasks marked complete
- [x] All features integrated and tested
- [x] Documentation updated (README, CLAUDE)
- [x] No critical bugs remaining

**Acceptance Test:**
- Complete 3 full runs per character (9 total playthroughs)
- Run full test suite (unit + integration)
- Performance benchmarks met (save <100ms)

**Blocker Resolution:**
- If critical bugs found, extend timeline by 2-3 days
- If performance issues, optimize save/load functions
- If balance problems, run additional simulations

---

## VELOCITY TRACKING

### Expected Velocity by Week

```
Week 1 Target:
├─ Tasks Completed: 7/13 (54%)
├─ Hours Spent: 28-30
├─ Story Points: 21
└─ Velocity: 0.7 tasks/hour

Week 2 Target:
├─ Tasks Completed: 6/13 (46%)
├─ Hours Spent: 15-20
├─ Story Points: 14
└─ Velocity: 0.4 tasks/hour (lighter week)

Total:
├─ Tasks: 13/13 (100%)
├─ Hours: 43-50
└─ Average Velocity: 0.26 tasks/hour
```

### Velocity Adjustment Factors

**Increase Velocity (+20%):**
- Experienced developer with React/game dev background
- Familiar with existing codebase
- No blockers or dependencies outside control

**Decrease Velocity (-20%):**
- Junior developer or new to React
- First time with codebase
- Frequent context switching or interruptions

**Critical Velocity Drop (-50%):**
- Major blocker discovered (architectural issue)
- Significant scope creep
- Technical debt requires refactoring

---

## BUFFER TIME ALLOCATION

### Built-in Buffers

```
Total Estimated Time: 45 hours (mid-level developer)
Week 1 Buffer: 8 hours (Day 5)
Week 2 Buffer: 8 hours (Day 5)
Week 3 Buffer: 18 hours (entire week optional)

Total Buffer: 34 hours (43% contingency)
```

### Buffer Usage Priority

1. **Critical Bugs** (Must fix before release)
   - Combat-breaking issues
   - Save corruption
   - Game crashes

2. **Balance Issues** (Should fix for good experience)
   - Encounters too easy/hard
   - Rewards feel meaningless
   - Auto-save too frequent/infrequent

3. **Polish** (Nice to have)
   - Additional mystery events
   - More reward items
   - Enhanced UI feedback

---

## DAILY STANDUP QUESTIONS

### Morning Check-in (Start of Day)
1. What tasks did I complete yesterday?
2. What tasks am I tackling today?
3. Do I have any blockers?
4. Am I on track with the timeline?

### Evening Check-out (End of Day)
1. Did I complete today's planned tasks?
2. What challenges did I encounter?
3. What do I need to prepare for tomorrow?
4. Should I adjust tomorrow's schedule?

---

## PROGRESS DASHBOARD

### Week 1 Progress Tracker

| Day | Tasks Planned | Tasks Completed | Hours Spent | Status |
|-----|---------------|-----------------|-------------|--------|
| Mon | 1.1, 1.2 (part) | ___ / 2 | ___ / 6-7h | ⏳ |
| Tue | 1.2, 1.3, 2.1 (part) | ___ / 3 | ___ / 5h | ⏳ |
| Wed | 2.1, 2.2, 2.3 (part) | ___ / 3 | ___ / 4h | ⏳ |
| Thu | 2.3, 2.4, testing | ___ / 3 | ___ / 5h | ⏳ |
| Fri | Integration & polish | ___ / 1 | ___ / 8h | ⏳ |

### Week 2 Progress Tracker

| Day | Tasks Planned | Tasks Completed | Hours Spent | Status |
|-----|---------------|-----------------|-------------|--------|
| Mon | 3.1, 3.2, 3.3 | ___ / 3 | ___ / 5h | ⏳ |
| Tue | 4.1, testing | ___ / 2 | ___ / 4h | ⏳ |
| Wed | 4.2 | ___ / 1 | ___ / 3h | ⏳ |
| Thu | 4.3 | ___ / 1 | ___ / 4h | ⏳ |
| Fri | Integration & docs | ___ / 1 | ___ / 8h | ⏳ |

---

## BURNDOWN CHART (Planned)

```
Total Tasks: 13
Total Hours: 45

Week 1 Burndown:
50 │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
45 │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░
40 │ ▓▓▓▓▓▓▓▓▓▓▓▓░░░░
35 │ ▓▓▓▓▓▓▓▓▓░░░░░░░
30 │ ▓▓▓▓▓▓░░░░░░░░░░
25 │ ▓▓▓░░░░░░░░░░░░░
20 │ ░░░░░░░░░░░░░░░░
15 │
10 │
 5 │
 0 └─────────────────
   M  T  W  T  F

Week 2 Burndown:
20 │ ▓▓▓▓▓▓▓▓▓▓
15 │ ▓▓▓▓▓▓▓░░░
10 │ ▓▓▓░░░░░░░
 5 │ ░░░░░░░░░░
 0 └───────────
   M  T  W  T  F

Legend: ▓ = Work Remaining  ░ = Work Completed
```

---

## TIME ZONE CONSIDERATIONS

### Global Team Scheduling

**US Eastern Time (ET):**
```
Week 1-2 Schedule: 9:00 AM - 5:00 PM ET
- Daily standup: 9:00 AM
- Focused work: 9:30 AM - 12:00 PM
- Lunch: 12:00 PM - 1:00 PM
- Focused work: 1:00 PM - 4:00 PM
- Daily wrap-up: 4:00 PM - 5:00 PM
```

**UTC (Universal):**
```
Week 1-2 Schedule: 13:00 - 21:00 UTC
- Daily standup: 13:00 UTC
- Focused work: 13:30 - 16:00 UTC
- Break: 16:00 - 17:00 UTC
- Focused work: 17:00 - 20:00 UTC
- Daily wrap-up: 20:00 - 21:00 UTC
```

**Asian/Pacific Time:**
- Adjust schedule to match local working hours
- Ensure overlap with team for standups/reviews

---

## CONTINGENCY PLANS

### If Running Behind Schedule

**After Week 1, <70% Complete:**
1. Prioritize P0 tasks only (Tasks 1.1, 1.2, 2.1, 2.2, 3.1)
2. Defer P2 tasks to Phase 3
3. Add 1 week extension (Week 3)

**After Week 2, <90% Complete:**
1. Move documentation to async task
2. Launch with known minor bugs (track in backlog)
3. Plan hotfix release for Week 3

**Critical Blocker Discovered:**
1. Pause current work
2. Assess blocker severity and resolution time
3. Re-plan remaining tasks around blocker
4. Escalate to team if resolution >2 days

---

## CELEBRATION MILESTONES

### Mini Celebrations (Morale Boosters)

**End of Day 2:** 🎉
- First character-specific encounter works!
- Reward: Extra coffee break

**End of Day 4:** 🎊
- Character gets first unique item drop!
- Reward: Early finish (leave 30 min early)

**End of Week 1:** 🏆
- 7 tasks complete, core systems working!
- Reward: Weekend off, no work thoughts

**End of Week 2:** 🚀
- Phase 2 complete, all features working!
- Reward: Ship it and celebrate with team dinner

---

**End of Timeline Document**

**Version:** 1.0
**Last Updated:** September 30, 2025
**Companion Documents:**
- PHASE_2_TASK_PLAN.md (Detailed breakdown)
- PHASE_2_QUICK_REFERENCE.md (Quick lookup)
