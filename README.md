# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.



Path of Heroes – Consolidated Master README v3.0
Last Updated: August 4, 2025
Status: In Development (Prototype Stage)
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

The Dungeon: The run begins on Floor 1. Each floor is a randomly generated 7x7 grid.

Exploration: The player moves one tile at a time on the grid, revealing adjacent rooms.

Events: Moving into a room triggers an event (Battle, Shop, Campfire, etc.). The room is consumed after the event is completed.

Progression: After defeating the Floor Boss, the player advances to the next, more challenging floor.

Defeat: If the player's HP drops to zero, the run ends. They lose a portion of their run-specific currency but retain all Hero Souls.

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
Floor progression is handled via exploration of a 7x7 grid.

Generation: Each floor generates a new grid. The player starts at the bottom-center, and the boss room is at the top-center. A main path is generated, but side-rooms and branches offer risk-reward opportunities.

Movement: The player can move to any adjacent, revealed room. Moving into a room consumes it and triggers its event.

Room Types & Icons:

Battle $⚔️$: A standard combat encounter.

Elite Battle $💀$: A combat encounter with a powerful "Elite" enemy that gives better rewards.

Shop $🏪$: Spend gold on items and equipment.

Campfire $🔥$: A safe room to either heal or upgrade a stat.

Shrine $⛩️$: Receive a powerful, passive blessing (Relic).

Mystery $❓$: A random event with a variety of outcomes.

Boss $👹$: A fight against the area's boss to proceed to the next floor.

⚔️ Combat System
Combat is the core challenge of the game and is designed to be strategic and turn-based.

System: Turn-based combat where turn order is determined by the Speed (SPD) stat of each combatant.

Core Stats:

ATK (Attack): Determines physical damage.

POW (Power): Determines magical damage and the potency of effects (like DoTs, heals).

DEF (Defense): Reduces incoming damage.

SPD (Speed): Determines turn order.

Actions: On their turn, a character can Attack, use a Skill, use an Item, or Defend.

Resource Regeneration: The player regenerates a small amount of their primary resource (Vigor, Mana, Energy) at the start of each of their turns.

Status Effects: The core strategic layer.

Vulnerable: Target takes increased damage (e.g., +50%).

Weak: Target deals reduced damage (e.g., -50%).

Additional effects like Poison, Burn, Stun, and Shield will be added.

🧙 Playable Characters
Each character offers a distinct playstyle. All data will be stored in a central constants file.

Warrior (Taha / طه)

Role: Tank / Melee

Resource: Vigor

Mechanics: Focuses on high HP and DEF. Uses skills that scale with ATK and DEF.

Starting Skill: Shield Slam - A high-impact defensive or utility skill.

Sorceress (Mais / ميس)

Role: Ranged Mage

Resource: Mana

Mechanics: Focuses on high POW for devastating spells. Low defenses.

Starting Skill: Fireball - A powerful, high-damage spell.

Rogue (Ibrahim / إبراهيم)

Role: Assassin / DoT Specialist

Resource: Energy

Mechanics: Focuses on high SPD and applying Damage-over-Time effects that scale with POW.

Starting Skill: Poison Strike - Applies a potent Poison effect.

📈 Progression & Leveling (In-Run)
Experience (XP): Players gain XP from defeating enemies.

Leveling Up: Upon reaching an XP threshold, the hero levels up. This provides a core stat increase based on their class's statGainsPerLevel and fully restores HP and resources.

Rewards: After winning a battle, players are taken to a reward screen where they can choose one of three random upgrades, such as a temporary stat increase, a new piece of equipment, or a new skill.

✨ Meta-Progression: The Soul Forge
To ensure every run feels meaningful, the game features a robust meta-progression system.

Permanent Currency: Players earn Hero Souls during each run, based on performance (floors cleared, elites defeated). A portion of these souls is retained even upon death.

The Soul Forge: From the main menu, players spend Hero Souls on permanent, global upgrades that affect all future runs.

Example Upgrades:

Increase a hero's starting HP or Gold.

Unlock new characters (Sorceress, Rogue).

Improve the quality of rewards found after combat.

Unlock new skills or items to be found during runs.

Start every run with a free potion.

🎒 Inventory, Loot & Potions
Equipment Slots: Characters have 8 equipment slots: Head, Shoulders, Chest, Legs, Feet, Hands, Weapon, and an Accessory.

Loot Drops: Enemies have a chance to drop equipment. The quality of loot is determined by rarity colors (Common, Uncommon, Rare, Epic, Legendary).

Potions: Players can find or buy run-specific consumable potions (e.g., Health Potion, Mana Potion). These are lost upon death. Using a potion in combat costs a turn.

Management: Inventory can be managed at the Campfire or outside of combat. During combat, inventory can be viewed, but equipment cannot be changed.

⛺ Event Scene Breakdown
Each non-combat room offers a strategic choice.

Shop $🏪$: Spend gold on a selection of equipment, relics, and potions.

Campfire $🔥$: Choose one of two options:

Rest: Heal for a significant percentage of Max HP.

Sharpen: Gain a small, permanent stat boost for the remainder of the run (e.g., +2 ATK).

Shrine $⛩️$: Be offered a choice of one of three powerful, passive blessings (Relics) that provide run-altering effects.

Mystery $❓$: A random event with a variety of outcomes, from finding treasure to being ambushed.

⚙️ Technical Architecture
Frontend: React 18

Build Tool: Vite

Styling: TailwindCSS (locked to v3.4.17 for consistency). Custom global styles in index.css.

Icons: lucide-react

State Management: Initial state via React Hooks (useState, useContext). Will consider a dedicated library (e.g., Zustand) as complexity grows.

File Structure:

p-o-h/
├── src/
│   ├── components/  # Reusable components (e.g., BattleScreen.jsx, MainMenu.jsx)
│   ├── constants/   # Game data (e.g., characters.js, items.js, localization.js)
│   ├── utils/       # Helper functions (e.g., damageCalculator.js)
│   ├── App.jsx      # Main game logic and state management
│   └── main.jsx     # Application entry point
├── deploy-poh.bat   # Deployment script
└── package.json
🐛 Known Issues & Development Roadmap
Known Issues:

Placeholder combat functionality (win/lose buttons).

Shop, Shrine, and other event screens are placeholders.

No XP or leveling system implemented.

No inventory or equipment system implemented.

Development Roadmap:

Combat System Implementation: Build the <BattleScreen> component with the full turn-based logic, stats, and effects.

Character & Data: Move all static game data (characters, enemies, items) into src/constants/.

Inventory & Equipment: Develop the UI and logic for the 8-slot inventory system.

Meta-Progression: Create the Soul Forge UI and logic for purchasing permanent upgrades.

Event Components: Build out the functional components for the Shop, Campfire, and Shrine events.

Bilingual Support: Implement the language toggle and localization system.
