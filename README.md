Path of Heroes – Consolidated Master README v6.2
Last Updated: August 5, 2025

Status: In Development (Core Combat Loop Stable)

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

🗺️ Exploration & The Grid System
Floor progression is handled via strategic exploration of a procedurally generated grid.

Generation: Each floor generates a new grid larger than 7x7 (e.g., 9x9 or 11x11). The player starts at a designated entrance, and the boss room is at a designated exit. The generation algorithm creates impassable walls and maze-like paths, ensuring the player cannot simply walk in a straight line to the boss. Branches and dead-ends will hide risk-reward opportunities.

Room Types & Icons: A room's icon indicates the event within.

Battle ⚔️: A combat encounter with one or more enemies, scaled to the current floor.

Elite Battle 💀: A difficult combat encounter with powerful "Elite" enemies that drop a guaranteed Relic upon victory.

Shop 🏪: Spend gold on items, potions, and relics. One purchase per visit.

Campfire 🔥: A safe room to either heal OR upgrade a skill.

Shrine ⛩️: Be offered a choice between three powerful, passive blessings (Relics).

Mystery ❓: A random narrative or choice-based event.

Boss 👹: A fight against the area's boss to proceed to the next floor.

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

CRIT (Critical Chance): The percentage chance to land a critical hit for 1.5x damage.

(Planned) POW (Power): Will scale magical damage and the potency of status effects.

Resource Regeneration (Planned): The player will regenerate a small, fixed amount of their primary resource at the start of each of their turns.

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

🧙 Playable Characters
Warrior (Taha / طه)

Role: Tank / Melee

Resource: Vigor

Flavor: A stoic guardian of a forgotten citadel, Taha's strength comes from his unyielding resolve and mastery of shield and blade.

Starting Skill: Shield Bash - Deals minor damage and applies the Weaken debuff to an enemy.

Sorceress (Mais / ميس)

Role: Ranged Mage

Resource: Mana

Flavor: A scholar who delved too deep into forbidden texts, Mais wields raw elemental power at the cost of her own physical resilience.

Starting Skill: Fireball - Deals damage to all enemies.

Rogue (Ibrahim / إبراهيم)

Role: Assassin / DoT Specialist

Resource: Energy

Flavor: A former royal spy betrayed by his own, Ibrahim now walks the shadows, using potent alchemical poisons and lightning-fast strikes to dispatch his foes.

Starting Skill: Venom Strike - Deals high initial damage and applies a potent Poison effect.

📈 Progression & Rewards (In-Run)
Leveling Up: Upon reaching an XP threshold, the hero levels up, gaining core stats based on their growthRates and fully restoring HP and resources.

Battle Outcome Screen: After a battle, a dedicated screen appears.

Victory: Displays Gold and XP earned. (Planned) Will also present a choice of 3 random "reward cards" (e.g., a new item, a new skill, a stat boost).

Defeat: Displays the 90% Gold penalty and returns the player to the Main Menu.

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

🎒 Inventory, Loot & Potions (Planned)
Equipment Slots: Characters have 8 equipment slots: Head, Shoulders, Chest, Legs, Feet, Hands, Weapon, and an Accessory.

Loot Drops: Enemies have a chance to drop equipment with random rarities and affixes.

Potions: Players can find or buy run-specific consumable potions. Using a potion in combat costs the player's turn.

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

Styling: TailwindCSS (v3.4.17).

State Management: A global singleton object (src/core/state.js) with a subscription model.

Debugging: A persistent, global debugger (persistent-debugger.jsx + logger.js) and a system of in-game developer hotkeys for testing.
| Key | Action | Use Case |
| :--- | :--- | :--- |
| 1 | Heal Player to Full | "Survive a tough fight to see the enemy's full pattern." |
| 2 | Add 100 Gold | "Test the shop without having to grind for gold." |
| 3 | Gain one Level | "See how the player feels at Level 5 vs. Level 1." |
| 5 | Instantly Win Battle | "Bypass a standard fight to get to the next room quickly." |
| 0 | Toggle Invincibility | A "God Mode" that prevents damage and one-shots enemies. |

File Naming Convention: All components and modules in src use kebab-case (e.g., battle-screen.jsx).

File Structure:

p-o-h/
└── src/
    ├── components/
    │   ├── battle-screen.jsx
    │   ├── debug-panel.jsx
    │   ├── outcome-screen.jsx
    │   ├── persistent-debugger.jsx
    │   └── shop-screen.jsx
    │
    ├── constants/
    │   ├── characters.js
    │   ├── config.js
    │   ├── enemies.js
    │   └── localization.js
    │
    ├── core/
    │   ├── logger.js
    │   └── state.js
    │
    ├── systems/
    │   ├── combat.js
    │   ├── dungeon.js
    │   └── inventory.js
    │
    ├── App.jsx
    ├── main.jsx
    └── index.css
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

🎯 PHASE 1: Making Runs Feel Worthwhile (CRITICAL - Week 1-2)

1. Multi-Floor Progression System: 3-5 floors per run with boss progression and healing between floors.

2. ~~Basic Hero Souls Meta-Progression~~: ✅ **COMPLETED** - Persistent currency, 3 permanent upgrades (Vitality, Fortune, Wisdom).

3. Functional Room Events: Working shop (potions/upgrades), shrine blessings, treasure rooms.

🎯 PHASE 2: Depth & Replayability (HIGH - Week 3-4)

4. Enemy Variety: Affix system (Vicious, Swift, Armored) and elite encounters.

5. Basic Equipment System: 3-4 item slots with random drops and simple bonuses.

6. Build Variety: Character specialization through gear and upgrade choices.

🎯 PHASE 3: Polish & Expansion (MEDIUM/LOW - Week 5+)

7. Advanced Soul Forge: Complex upgrade trees and character-specific paths.

8. Full 8-Slot Inventory: Complete equipment system with crafting.

9. 30-Floor Campaign: Multiple acts with unique themes and bosses.

⚠️ STRATEGIC REASONING:
The original roadmap focused on complex systems before establishing the core roguelike loop. 
Current runs are too short (2-3 battles) with no progression reward, making death feel purely punitive.
This revised roadmap prioritizes making each run feel meaningful and death feel like progress toward future success.

📝 Changelog
This section will track minor version changes, additions, and balance tweaks moving forward.

**v6.3 (August 6, 2025)**: 🎉 **MAJOR UPDATE - Hero Souls Meta-Progression System**
- ✅ **Implemented complete Hero Souls system** with persistent localStorage storage
- ✅ **Added Soul Forge** accessible from main menu with 3 permanent upgrades
- ✅ **Soul earning**: 1 soul per enemy defeated, displayed on outcome screens
- ✅ **Permanent upgrades**: Vitality (+20% HP), Fortune (+50% gold), Wisdom (+25% XP)
- ✅ **UI enhancements**: Purple soul theme, upgrade status indicators
- ✅ **Death now feels rewarding**: Souls collected automatically, persist through resets
- 🔧 **Fixed combat system**: Added missing UI updates after all player actions
- 🔧 **Fixed battle screen**: Ensured action buttons always visible
- 📖 **Updated README**: Comprehensive documentation of Hero Souls implementation

v6.2 (August 5, 2025): Fully expanded all sections to serve as a complete, standalone master document. Added detailed explanations for all planned and implemented features. Formalized the final Developer/AI collaboration protocol.

v6.1 (August 5, 2025): Added detailed documentation for the Developer Hotkey System to the Technical Architecture section.