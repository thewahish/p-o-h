# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.



Path of Heroes – Consolidated Master README v4.0
Last Updated: August 5, 2025

Status: In Development (Core Gameplay Loop - Rebalancing Phase)

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

Orientation: Strictly portrait orientation.

Languages: Fully bilingual (English/Arabic) with a persistent global toggle and full RTL support.

🔄 Core Gameplay Loop
The player's journey is designed to be a continuous cycle of challenge, growth, and replayability.

Main Menu: The player starts here. They can access the Soul Forge to spend currency from previous runs.

Character Selection: The player chooses one of the three available heroes.

The Dungeon: The run begins on Floor 1. Each floor is a procedurally generated grid with impassable walls, creating a unique maze-like layout.

Exploration: The player moves one tile at a time on the grid, revealing adjacent rooms and navigating the floor's layout.

Events: Moving into a room triggers an event (Battle, Shop, Campfire, etc.). The room is marked as 'completed' after the event.

Progression: After defeating the Floor Boss, the player advances to the next, more challenging floor.

Defeat: If the player's HP drops to zero, the run ends. They lose 90% of their collected Gold but retain all Hero Souls.

Meta-Progression: The player is returned to the Main Menu, where they can use their collected Hero Souls at the Soul Forge to unlock permanent upgrades, making their next run easier.

📜 The Kickstarter Demo: "The First Chapter"
The primary development objective is a polished 30-floor demo to serve as a proof-of-concept for a Kickstarter campaign.

Act 1: The Outer Ruins (Floors 1-10)

Focus: Introduction to core mechanics.

Enemies: Standard enemy types (Goblins, Slimes).

Boss: Orc Warlord

Act 2: The Royal Crypts (Floors 11-20)

Focus: Increased difficulty and strategic challenges.

Enemies: Introduction of Elite enemy variants with special modifiers.

Boss: Grave Golem

Act 3: The Sanctum (Floors 21-30)

Focus: Final test of skill and build synergy.

Enemies: Introduction of Champion enemy variants with powerful, unique abilities.

Final Demo Boss: The Crypt Lord

🗺️ Exploration & The Grid System
Floor progression is handled via strategic exploration of a procedurally generated grid.

Generation: Each floor generates a new grid larger than 7x7. The player starts at a designated entrance, and the boss room is at a designated exit. The generation algorithm creates impassable walls and maze-like paths, ensuring the player cannot simply walk in a straight line to the boss. Branches and dead-ends will hide risk-reward opportunities.

Movement: The player can move to any adjacent, revealed, and accessible room. Moving into a room triggers its event.

Room Types & Icons:

Battle ⚔️: A standard combat encounter.

Elite Battle 💀: A combat encounter with powerful "Elite" enemies that give better rewards.

Shop 🏪: Spend gold on items and equipment.

Campfire 🔥: A safe room to either heal or upgrade a stat for the run.

Shrine ⛩️: Be offered a choice between three powerful, passive blessings (Relics).

Mystery ❓: A random event with a variety of outcomes.

Boss 👹: A fight against the area's boss to proceed to the next floor.

⚔️ Combat System
Combat is the core challenge of the game and is designed to be strategic and turn-based.

System: Turn-based combat where turn order is determined by the Speed (SPD) stat of each combatant.

Damage Formula: Damage = (Attacker_ATK * Attacker_ATK) / (Attacker_ATK + Defender_DEF). This formula uses defense as mitigation and ensures every hit deals at least some damage.

Core Stats:

HP (Health Points): A character's life force. Reaching 0 means defeat.

ATK (Attack): Determines physical damage.

DEF (Defense): Mitigates incoming physical damage.

SPD (Speed): Determines turn order.

CRIT (Critical Chance): The percentage chance to land a critical hit for 1.5x damage.

(Planned) POW (Power): Will determine magical damage and the potency of effects (like DoTs, heals).

Actions: On their turn, a character can Attack, use a Skill, use an Item, or Defend.

Resource Regeneration: The player regenerates a small amount of their primary resource (Vigor, Mana, Energy) at the start of each of their turns in combat.

Status Effects:

Weaken: Target deals reduced damage.

Poison: Target takes damage at the start of its turn.

(Planned): Vulnerable (takes increased damage), Stun, Burn, Shield, etc.

🧙 Playable Characters
Warrior (Taha / طه)

Role: Tank / Melee

Resource: Vigor

Mechanics: High HP and DEF. Skills scale with ATK and DEF.

Starting Skill: Shield Bash - Deals minor damage and applies the Weaken debuff to an enemy.

Sorceress (Mais / ميس)

Role: Ranged Mage

Resource: Mana

Mechanics: High ATK (used for spell damage). Low defenses.

Starting Skill: Fireball - Deals damage to all enemies.

Rogue (Ibrahim / إبراهيم)

Role: Assassin / DoT Specialist

Resource: Energy

Mechanics: High SPD and CRIT. Focuses on applying Damage-over-Time effects.

Starting Skill: Venom Strike - Deals high initial damage and applies a potent Poison effect.

📈 Progression (In-Run)
Experience (XP): Players gain XP from defeating enemies.

Leveling Up: Upon reaching an XP threshold, the hero levels up, gaining core stats based on their class's growthRates and fully restoring HP and resources.

Battle Outcome: After a battle, players are taken to a dedicated Outcome Screen.

Victory: Displays Gold and XP earned. A future feature will be to choose one of three random reward cards (e.g., new item, temporary stat boost).

Defeat: Displays the 90% Gold penalty and provides an option to return to the Main Menu.

✨ Meta-Progression: The Soul Forge
(This system is planned for a future development phase and remains unchanged.)

🎒 Inventory, Loot & Potions
(This system is planned for a future development phase and remains unchanged.)

⛺ Event Scene Breakdown
Shop 🏪: Spend gold on a selection of equipment, relics, and potions.

Campfire 🔥: Choose one of two options:

Rest: Heal for a significant percentage of Max HP.

Sharpen: Gain a small, permanent stat boost for the remainder of the run (e.g., +2 ATK).

Shrine ⛩️: Be offered a choice of one of three powerful, passive blessings (Relics) that provide run-altering effects.

Mystery ❓: A random event with a variety of outcomes, from finding treasure to being ambushed.

⚙️ Technical Architecture
Frontend: React 18

Build Tool: Vite

Styling: TailwindCSS (v3.4.17).

State Management: A global singleton object (src/core/state.js) with a subscription model (subscribe/_notify) to update the UI efficiently without polling.

Debugging: A persistent, global debugger (persistent-debugger.jsx + logger.js) that initializes before React to catch startup errors and provide detailed runtime logging.

File Naming Convention: All components and modules in src use kebab-case (e.g., battle-screen.jsx, game-state.js) to prevent case-sensitivity issues.

File Structure:

p-o-h/
└── src/
    ├── components/     # React components (battle-screen.jsx, etc.)
    ├── constants/      # Static game data (characters.js, enemies.js, etc.)
    ├── core/           # Core singletons (state.js, logger.js)
    ├── systems/        # Game logic modules (combat.js, dungeon.js)
    ├── App.jsx         # Main component, router
    └── main.jsx        # Application entry point
🚧 Development Roadmap
Recently Completed (Pending Implementation):

Full Rebalancing Pass (New Damage Formula, Buffed Enemies, Floor Scaling).

Implementation of Battle Outcome Screens (Victory/Defeat).

Implementation of the Death Penalty (90% Gold Loss).

HUD update to include Player Level and XP Bar.

Next Major Features:

Advanced Dungeon Generation: Overhaul the dungeon.js system to create larger, non-linear, maze-like floors with impassable walls.

Floor Progression: Implement the logic for advancing to the next floor after defeating a boss.

Inventory System: Build the UI and logic for equipping and managing items.

Full Event Implementation: Create the functional UIs for the Shop, Campfire, and Shrine choices.
