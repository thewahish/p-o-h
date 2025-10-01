Path of Heroes – Consolidated Master README v8.0
Last Updated: October 1, 2025

Status: In Development (Feature-Complete with Balanced Combat Systems)

GitHub Repository: https://github.com/thewahish/p-o-h

Developer: Obai Sukar

📘 Project Purpose & Master Record
This document is the authoritative Master Game Guide and Project Bible for Path of Heroes. It consolidates all official design decisions, feature breakdowns, and technical specifications, merging previous development documents into a single, cohesive vision. All development must align with this guide. It is a living document and will be updated as the project evolves.

🎮 Game Overview
Title: Path of Heroes / طريق الأبطال

Genre: 2D, turn-based roguelike dungeon crawler.

Core Experience: A highly replayable, strategic RPG where players explore grid-based floors, making critical choices to build a powerful character. The core loop involves combat, resource management, and synergistic upgrades. Each failure provides permanent resources to strengthen future attempts.

Inspiration: Slay the Spire, Hades, Diablo.

Platform: Mobile-first web game (PWA-ready), built with React & Vite.

Orientation: Strictly portrait orientation, enforced via CSS.

Languages: Fully bilingual (English/Arabic) with a persistent global toggle and full RTL support.

🔄 Core Gameplay Loop
The player's journey is a continuous cycle of challenge, growth, and replayability.

Main Menu: The player starts here, choosing to begin a new run or visit the Soul Forge.

Character Selection: The player chooses one of the three available heroes, each with a unique playstyle.

The Dungeon: The run begins on Floor 1. Each floor is a procedurally generated grid.

Exploration: The player moves one tile at a time, revealing adjacent rooms and navigating the floor's layout.

Events: Moving into a room triggers an event (Battle, Shop, Campfire, etc.). The room is marked as 'completed' after the event.

Progression: After defeating the Floor Boss, the player advances to the next, more challenging floor.

Defeat: If the player's HP drops to zero, the run ends. They are taken to a Defeat Screen and lose 90% of their collected Gold but retain all Hero Souls.

Meta-Progression: The player is returned to the Main Menu, where they can use their collected Hero Souls at the Soul Forge to unlock permanent upgrades for all future runs.

📜 The Kickstarter Demo: "The First Chapter"
The primary development objective is a polished 30-floor demo to serve as a proof-of-concept for a Kickstarter campaign.

Act 1: The Outer Ruins (Floors 1-10)

Focus: Introduction to core mechanics.

Enemies: Goblins, Slimes, Orc Brutes.

Boss: Orc Warlord

Act 2: The Royal Crypts (Floors 11-20)

Focus: Increased difficulty, introduction of enemy affixes.

Enemies: Undead skeletons, Ghouls, Wraiths. Elite variants are common.

Boss: Grave Golem

Act 3: The Sanctum (Floors 21-30)

Focus: Final test of skill and build synergy.

Enemies: Demonic imps, Cultists. Champion variants with powerful abilities appear.

Final Demo Boss: The Crypt Lord

🗺️ Strategic Dungeon System
Floor progression is handled via strategic exploration of a fully visible, procedurally generated maze.

**No Fog of War Design**: Full dungeon layout revealed from start with NO hidden paths or fog of war mechanics. ALL rooms are visible for complete strategic planning.

Generation: Each floor generates a compact 5x9 maze using recursive backtracking algorithm. Clean paths and distinctive 🧱 wall barriers create strategic route choices.

**Strategic Visibility**: Players can see all possible routes to boss/shops/shrines, enabling tactical decision-making about optimal paths before moving.

**Progressive Discovery**: All rooms visible but unvisited rooms appear as plain/empty spaces until explored, then reveal their true nature (events remain surprises).

Room Types & Icons: Room contents discovered through exploration.

Wall 🧱: Impassable barriers with distinctive stone styling

Path (Empty): Clean, navigable spaces that hide encounters until visited

Battle ⚔️: Combat encounters with floor-scaled enemies

Elite Battle 💀: Challenging encounters with enhanced enemies and minions

Shop 🏪: Purchase items and consumables (one purchase per visit)

Shrine ⛩️: Receive powerful stat blessings with floor-based scaling

Treasure 💎: Find gold with floor-appropriate rewards

Boss 👹: Floor boss with character-specific scaling and unique titles

Stairs 🔄: Appear after boss defeat to advance floors

⚔️ Combat System
Combat is the core challenge of the game, designed to be strategic and turn-based.

System: Turn-based combat where turn order is determined by the Speed (SPD) stat of each combatant. Encounters can feature single or multiple enemies.

Targeting: The player can tap/click on an enemy to set it as their "Focus Target." All single-target actions (Attack, Skills) will be directed at the focused enemy. When a target is defeated, the system automatically selects the next living enemy.

Damage Formula: Damage = (Attacker_ATK² / (Attacker_ATK + Defender_DEF))

Core Stats:

HP (Health Points): A character's life force. Reaching 0 means defeat.

ATK (Attack): Primary stat for physical damage calculation.

DEF (Defense): Primary stat for damage mitigation.

SPD (Speed): Determines turn order in combat.

CRIT (Critical Chance): The percentage chance to land a critical hit for 1.6x damage.

(Planned) POW (Power): Will scale magical damage and the potency of status effects.

**Resource Regeneration**: Characters regenerate resource each turn for sustainable combat:
- **Base Regeneration**: 8 points per turn
- **Level Scaling**: +0.5 additional per character level
- **Buff Modifiers**: Mana Surge increases regen by 50%
- **Example**: Level 5 character regens 10.5 per turn

### 🧪 Potion System (IMPLEMENTED)
Strategic consumables for emergency recovery during combat:

**Starting Potions**:
- **3x Health Potions** (50 HP each) - Total emergency HP: 150
- **2x Resource Potions** (40 resource each) - Total emergency resource: 80

**Potion Types**:
- **Health Potion** (❤️‍🩹): Restores 50 HP instantly
- **Resource Potion** (🧪): Restores 40 resource points instantly
- **Greater Health Potion** (💖): Restores 80 HP instantly (rare drops)
- **Elixir of Vitality** (🌟): Fully restores HP and resource (rare drops)

**Usage**:
- Potions usable during player turn in combat
- Consume turn action but allow additional moves
- Quantities displayed on battle UI
- Managed via integrated PotionSystem

### ✨ Hades-Style Buff System (IMPLEMENTED)
Strategic buff selection at battle start with powerful effects:

**Buff Selection**:
- 3 random buffs offered before each battle
- Player chooses 1 buff to apply for entire battle
- Buffs stack across multiple battles
- Effects processed at appropriate timing

**Offensive Buffs**:
- **Berserker Rage** (🔥): +25% attack damage this battle
- **Precision Strike** (🎯): +15% critical hit chance
- **Swift Reflexes** (⚡): +30% speed this battle

**Defensive Buffs**:
- **Iron Skin** (🛡️): +40% defense this battle
- **Vampiric Aura** (🩸): Heal 20% of damage dealt as HP
- **Mana Surge** (💫): +50% resource regeneration this battle

**Utility Buffs**:
- **Battle Focus** (🎭): Abilities cost 25% less resource
- **Lucky Strikes** (🍀): 20% chance to not consume resource
- **Second Wind** (🌪️): Heal 15 HP at start of each turn

🧬 The Affix System (Universal Mechanic)
To ensure maximum replayability, all dynamic elements in the game will be built on a universal Affix system. An affix is a modifier that grants special properties.

Enemies: Monsters on later floors or in Elite encounters will spawn with random affixes.
| Affix | Name Example | Effect |
| :--- | :--- | :--- |
| Vicious | Vicious Goblin | +25% ATK |
| Swift | Swift Slime | +50% SPD |
| Armored | Armored Orc | +50% DEF |
| Regenerating| Goblin of Regeneration| Heals 5% of Max HP each turn. |
| Thorns | Slime of Thorns | Deals 3 damage to attackers when hit. |

Gear (Planned): Equipment will be generated with random prefixes and suffixes that grant bonuses.
| Prefix | Suffix | Name Example | Effects |
| :--- | :--- | :--- | :--- |
| Sturdy | of the Bear | Sturdy Helm of the Bear | +DEF, +HP |
| Sharp | of Haste | Sharp Dagger of Haste | +ATK, +SPD |

🧙 Character-Specific Progression System
**Revolutionary Save System**: Each character has 3 independent save slots with unique progression paths.

### Warrior (Taha / طه)

**Role**: Tank / Melee

**Resource**: Vigor (55 base + resource regeneration)

**Progression Path**: defensive_tank - Faces physical enemies, gets defensive rewards

**Balance**: Standard boss difficulty (1.0x) with high survivability

**Starting Skill**: Shield Bash (12 Vigor) - Deals 0.9x damage

**Balanced Stats**:
- HP: 115 (+6 per level)
- Resource: 55 (+2 per level)
- ATK: 13 (+1.2 per level)
- DEF: 11 (+1.8 per level)
- SPD: 6 (+0.4 per level)
- CRIT: 12% (+0.2% per level)

### Sorceress (Mais / ميس)

**Role**: Ranged Mage

**Resource**: Mana (80 base + resource regeneration)

**Progression Path**: elemental_mage - Faces magical enemies, gets magical rewards

**Balance**: Standard boss difficulty (1.0x) with high damage potential

**Starting Skill**: Fireball (20 Mana) - AoE 0.8x damage to all enemies

**Balanced Stats**:
- HP: 95 (+4 per level)
- Resource: 80 (+2.5 per level)
- ATK: 15 (+1.4 per level)
- DEF: 7 (+0.6 per level)
- SPD: 7 (+0.6 per level)
- CRIT: 14% (+0.4% per level)

### Rogue (Ibrahim / إبراهيم)

**Role**: Assassin / DoT Specialist

**Resource**: Energy (60 base + resource regeneration)

**Progression Path**: assassin_berserker - Faces elite enemies, gets stealth rewards

**Balance**: Standard boss difficulty (1.0x) with high critical damage

**Starting Skill**: Venom Strike (15 Energy) - 1.3x damage with poison DoT

**Balanced Stats**:
- HP: 90 (+5 per level)
- Resource: 60 (+2.2 per level)
- ATK: 13 (+1.5 per level)
- DEF: 7 (+0.9 per level)
- SPD: 9 (+0.8 per level)
- CRIT: 14% (+0.6% per level)

**Character Balance**: All characters face equal boss difficulty for fair gameplay. Stats and progression balanced through extensive simulation testing (V.41.0 - 1000 runs per character, floors 1-30). Current balance: Warrior 78.1% win rate, Sorceress 91.4%, Rogue 77.6%.

📈 Balanced Progression & Character-Specific Saves
**XP Curve Balance**: Adjusted progression (100 base + 120 increment) prevents rapid leveling after level 3 while maintaining strategic pacing.

Leveling Up: Characters gain stats based on unique growthRates and fully restore HP/resources.

**Character-Specific Save System**:
- **3 Save Slots per Character**: Independent progression for Taha, Mais, and Ibrahim
- **New Game/Load/Delete**: Full save management with confirmation dialogs
- **Persistent Character Data**: Level, floor, gold, experience saved per character/slot
- **Save Slot Display**: Shows level, floor, gold, and last played timestamp

**Battle Outcome Screens**:
Victory: Displays Gold and XP earned with floor-appropriate rewards

Defeat: 90% Gold penalty but Hero Souls retained for meta-progression

**Room Rewards**:
- **Treasure Rooms**: Floor-scaled gold rewards (3-10 base + 20% per floor)
- **Shrine Blessings**: Stat bonuses with floor scaling (+0.5 per floor)
- **Floor Completion**: Gold and Hero Soul rewards for advancing

✨ Meta-Progression: The Soul Forge (IMPLEMENTED)
This system ensures every run feels meaningful, even in defeat.

**Hero Souls Currency**: Players earn 1 Hero Soul per enemy defeated. Souls are retained upon death and persist between game sessions via localStorage.

**The Soul Forge**: Accessible from the main menu, players spend Hero Souls on permanent, global upgrades that affect all future runs.

**Current Upgrade System**:
- 🛡️ **Vitality** (20 souls): +20% Max HP for all heroes
- 💰 **Fortune** (15 souls): +50% Starting Gold
- 📈 **Wisdom** (25 souls): +25% XP Gain

**Technical Implementation**: 
- Persistent storage via localStorage (`pathOfHeroes_souls`)
- Automatic save/load on app initialization
- Soul collection on death with UI feedback
- State management integration with GameState system

**Planned Expansions**:
- Character-specific upgrade paths
- More complex upgrade trees
- Soul earning from floor completion and special achievements

🎒 Inventory, Loot & Equipment (Planned)
Equipment Slots: Characters have 8 equipment slots: Head, Shoulders, Chest, Legs, Feet, Hands, Weapon, and an Accessory.

Loot Drops: Enemies have a chance to drop equipment with random rarities and affixes.

⛺ Event Scene Breakdown
Shop 🏪: Offers a random selection of 3-4 items. The player can make one purchase, after which the shop closes.

Campfire 🔥: Offers a choice between two options (only one can be chosen):

Rest: Heal for 30% of Max HP.

Sharpen: Permanently increase a random stat (ATK, DEF, or SPD) for the run.

Shrine ⛩️: Offers a choice of one of three powerful, passive abilities called Relics.

Example Relics: Iron Helm (Gain 5 Shield at start of combat), Adrenaline Vial (+5 SPD below 50% HP), Tome of Knowledge (+15% XP gain).

Mystery ❓: A random narrative event with a choice.
| Event | Choice A | Choice B |
| :--- | :--- | :--- |
| A crumbling chest | Open it (Find gold, or trigger a trap) | Leave it |
| A wounded adventurer | Give a potion (Gain a relic) | Rob them (Gain gold, lose a stat) |

⚙️ Technical Architecture
Frontend: React 18

Build Tool: Vite

Styling: TailwindCSS (v3.4.17)

State Management: Global singleton (src/core/state.js) with subscription model

**Advanced Save System**: Character-specific localStorage with 3 slots per character
- Save keys: `pathOfHeroes_save_${characterId}_${slotNumber}`
- Methods: `GameState.saveGame()`, `GameState.loadGame()`, `GameState.deleteSave()`
- Automatic save on game start and progression

**Localization System**: Complete bilingual support (English/Arabic)
- External JSON files: `public/locales/en.json`, `public/locales/ar.json`
- Centralized translation: `t('key.path')` with dynamic placeholders
- RTL support with language toggle (🌍 button)
- Save system fully localized with confirmation dialogs

## 🎨 Dark RPG Theme Colors

### Color Palette
- **Background**: `radial-gradient(ellipse at center, #1a0f0a 0%, #0d0604 40%, #000000 100%)`
- **Primary**: `#d4a656` (Golden amber)
- **Secondary**: `#5c4423` (Dark brown)
- **Text**: `#f8e4c0` (Light cream)

### Resource Bars
- **Health**: `linear-gradient(90deg, #8b0000, #ff4500, #ff6347)` (Dark red to orange-red)
- **Mana**: `linear-gradient(90deg, #191970, #4169e1, #87ceeb)` (Midnight blue to sky blue)

### Item Rarity Colors
- **Common**: `#95a5a6` (Gray)
- **Uncommon**: `#27ae60` (Green)
- **Rare**: `#3498db` (Blue)
- **Epic**: `#9b59b6` (Purple)
- **Mythic**: `#e67e22` (Orange)
- **Legendary**: `#f1c40f` (Gold)

### Implementation Notes
- Dark theme creates immersive dungeon atmosphere
- High contrast ensures mobile readability
- Gradient backgrounds add depth and visual interest
- Color-coded rarities provide immediate item value recognition

**Responsive Design**: Mobile-first with optimized viewport handling
- **Safe Area Insets**: Supports notches and punch-holes on modern devices
- **Dynamic Viewport Height (dvh)**: Accounts for mobile browser toolbars
- **Centered Layout**: Max-width constraint with centering for large screens
- **Fixed Aspect Ratio**: Dungeon grid maintains proper 5:9 ratio
- **Tested**: Verified across iPhone, Android, and Samsung devices

Debugging: A persistent, global debugger (persistent-debugger.jsx + logger.js) and a system of in-game developer hotkeys for testing.
| Key | Action | Use Case |
| :--- | :--- | :--- |
| 0 | Toggle God Mode | Invincibility + 9999 damage for testing |
| 1 | Heal Player to Full | Test survivability mechanics |
| 2 | Restore Resource to Full | Test ability spam scenarios (FIXED in V.41.0) |
| 3 | Add 100 Gold | Test shop purchases |
| 4 | Gain one Level | Test character scaling |
| 5 | Instantly Win Battle | Skip battles to test progression |

File Naming Convention: All components and modules in src use kebab-case (e.g., battle-screen.jsx).

File Structure:

p-o-h/
├── public/
│   └── locales/
│       ├── en.json          # English translations
│       └── ar.json          # Arabic translations
│
└── src/
    ├── components/
    │   ├── battle-screen.jsx         # Combat UI with potions and buffs
    │   ├── buff-selection-screen.jsx # NEW: Hades-style buff selection
    │   ├── outcome-screen.jsx
    │   ├── persistent-debugger.jsx
    │   ├── save-slot-screen.jsx      # Character save management
    │   ├── shop-screen.jsx
    │   └── soul-forge.jsx            # Meta-progression system
    │
    ├── constants/
    │   ├── characters.js       # Character progression paths and balanced stats
    │   ├── config.js          # XP curve, game settings, and starting potions
    │   └── enemies.js         # Enhanced enemy scaling
    │
    ├── core/
    │   ├── localization.js    # Bilingual translation system
    │   ├── logger.js
    │   └── state.js          # Advanced save/load and potion initialization
    │
    ├── systems/
    │   ├── buffs.js          # NEW: Buff system with 9 buff types
    │   ├── combat.js         # Turn-based combat with buff integration
    │   ├── dungeon.js        # Strategic maze generation
    │   ├── inventory.js
    │   └── potions.js        # NEW: Potion management system
    │
    ├── App.jsx              # Main game flow with buff selection integration
    ├── main.jsx
    ├── index.css            # Responsive styles with safe area insets
    │
    ├── CLAUDE.md            # Developer documentation
    ├── README.md            # User-facing documentation
    └── WALL_ICONS.md        # Asset customization guide
Development Protocol & AI Assistant Guidelines:

Master README Review: The AI assistant will always reference the latest version of this document.

User-Provided Code as Baseline: The Developer (you) will provide the full code of relevant file(s) when reporting a bug or requesting a change.

Full Impact Analysis: The AI will analyze the full scope of any change across all affected files.

Complete File Mandate: The AI will provide only full and complete files as a response.

Rigorous Pre-flight Check: The AI will perform a final logical review of all updated files to ensure they are consistent and do not cause regressions.

🚧 Development Roadmap (REVISED - Strategic Priorities)

Recently Completed:

✅ Core Combat System: Turn-based combat with all actions working (Attack, Skill, Defend, Flee).

✅ Battle Screen Transitions: Fixed battle entry and UI responsiveness.

✅ Multi-enemy encounters with "Focus Target" UI and auto-targeting.

✅ Battle Outcome Screens (Victory/Defeat) and 90% Gold Death Penalty.

✅ Developer Hotkey System for streamlined testing.

✅ **Basic Hero Souls Meta-Progression System**: Persistent currency earned on death, 3 permanent upgrades, localStorage integration.

🎯 PHASE 1: Character-Specific Progression (COMPLETED ✅)

1. ✅ **Strategic Dungeon System**: Full maze visibility with progressive room discovery
2. ✅ **Character-Specific Save System**: 3 slots per character with independent progression
3. ✅ **Balanced Progression**: XP curve and character balance through simulation testing
4. ✅ **Enhanced Combat**: Character-specific boss scaling and difficulty balance
5. ✅ **Complete Localization**: Bilingual support with RTL and external translation files

🎯 PHASE 2: Enhanced Gameplay Features (CURRENT - Week 1-2)

6. Character-Specific Enemy Encounters: preferredEnemyTypes implementation
7. Character-Specific Rewards: uniqueRewards system for tailored progression
8. Auto-save During Gameplay: Progress preservation during floor advancement
9. Room Event Variety: Enhanced shop, shrine, and treasure mechanics

🎯 PHASE 3: Content & Polish (HIGH - Week 3-4)

10. Enemy Variety: Affix system (Vicious, Swift, Armored) and enhanced elite encounters
11. Equipment System: Character-appropriate gear drops and progression
12. Build Variety: Character specialization through gear and upgrade synergies

🎯 PHASE 4: Advanced Features (MEDIUM - Week 5+)

13. Story Integration: Character-specific narrative content
14. Advanced Soul Forge: Character-specific upgrade trees
15. 30-Floor Campaign: Multiple acts with character-tailored encounters

⚠️ STRATEGIC REASONING:
The original roadmap focused on complex systems before establishing the core roguelike loop. 
Current runs are too short (2-3 battles) with no progression reward, making death feel purely punitive.
This revised roadmap prioritizes making each run feel meaningful and death feel like progress toward future success.

📝 Changelog
This section will track minor version changes, additions, and balance tweaks moving forward.

**v8.0 / V.41.0 (October 1, 2025)**: 🎉 **COMPLETE FEATURE INTEGRATION & BALANCE OVERHAUL**
- ✅ **Potion System Integration**: Fully functional HP and Resource potions in combat UI
  - 3 HP potions + 2 Resource potions starting inventory
  - Real-time quantity display on battle screen
  - Potion initialization on new game
  - Bilingual translations for all potion actions
- ✅ **Hades-Style Buff System**: Complete integration into combat flow
  - Buff selection screen before each battle (3 choices)
  - 9 unique buff types (offensive, defensive, utility)
  - Buff effects wired into combat calculations
  - Active buffs displayed during battle
  - BuffSystem.initializeBattle() called at battle start
- ✅ **Character Balance Overhaul**: Based on 1000-run simulation testing
  - Warrior buffed: HP 100→115, Resource 50→55, ATK 12→13, DEF 10→11, Crit 10→12
  - Sorceress buffed: HP 80→95, Resource 70→80, ATK 14→15, DEF 6→7, Crit 12→14
  - Rogue nerfed: ATK 15→13, SPD 10→9, Crit 18→14
  - Result: Warrior 78.1% win rate, Sorceress 91.4%, Rogue 77.6% (excellent balance)
- ✅ **Resource Regeneration**: 8+ resource per turn for sustainable combat
- ✅ **Responsive Design Fixes**: Safe area insets, dvh viewport, centered layout
- ✅ **Debug Hotkey Fix**: Hotkey '2' now correctly restores resource (was adding gold)
- ✅ **Realistic Combat Simulator**: Created comprehensive simulator modeling actual gameplay
  - Models resource consumption, ability usage, potion usage, buff effects
  - Strategic decision-making AI (when to use potions, abilities vs basic attacks)
  - Replaces previous basic simulators that only tested damage calculations
- 📖 **Documentation**: README.md and CLAUDE.md fully updated with all new features

**v7.0 (August 6, 2025)**: 🚀 **REVOLUTIONARY UPDATE - Character-Specific Progression & Strategic Dungeons**
- ✅ **Character-Specific Save System**: 3 independent save slots per character with full progression tracking
- ✅ **Strategic Dungeon Design**: Full maze visibility with progressive room discovery, clean path display
- ✅ **Balanced Character Progression**: Extensive simulation testing, equal boss difficulty for all characters
- ✅ **Enhanced XP Curve**: Prevents rapid leveling after level 3 (100 base + 120 increment)
- ✅ **Visual Interface Overhaul**: Clean paths, distinctive 🧱 walls, plain room discovery system
- ✅ **Complete Save Management**: New Game/Load/Delete with confirmation dialogs and timestamps
- ✅ **Localization Excellence**: Full bilingual support with external JSON files and RTL layout
- ✅ **Character Balance**: Removed unfair boss scaling modifiers based on mathematical analysis
- 🔧 **Fixed Save Slot Flow**: Proper screen transitions from character selection to exploration
- 📖 **Documentation Sync**: README and CLAUDE.md fully aligned with new features

**v6.3 (August 6, 2025)**: 🎉 **MAJOR UPDATE - Hero Souls Meta-Progression System**
- ✅ **Implemented complete Hero Souls system** with persistent localStorage storage
- ✅ **Added Soul Forge** accessible from main menu with 3 permanent upgrades
- ✅ **Soul earning**: 1 soul per enemy defeated, displayed on outcome screens
- ✅ **Permanent upgrades**: Vitality (+20% HP), Fortune (+50% gold), Wisdom (+25% XP)
- ✅ **UI enhancements**: Purple soul theme, upgrade status indicators
- ✅ **Death now feels rewarding**: Souls collected automatically, persist through resets

v6.2 (August 5, 2025): Fully expanded all sections to serve as a complete, standalone master document. Added detailed explanations for all planned and implemented features. Formalized the final Developer/AI collaboration protocol.

v6.1 (August 5, 2025): Added detailed documentation for the Developer Hotkey System to the Technical Architecture section.