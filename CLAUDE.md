# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Path of Heroes is a mobile-first React roguelike dungeon crawler built with Vite and TailwindCSS. It features turn-based combat, procedural dungeon generation, and a persistent debug system.

## Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run deploy   # Deploy to GitHub Pages
```

## Architecture

### State Management
- **Global State**: Single singleton object in `src/core/state.js` with subscription model
- **Save System**: Character-specific saves with 3 slots per character in localStorage
- **State Updates**: All state changes go through `GameState.update()` or dedicated methods
- **Reactivity**: Components subscribe to state changes via `GameState.subscribe()`

### Core Systems
- **Combat**: `src/systems/combat.js` - Turn-based combat with damage formula: `(ATK² / (ATK + DEF))`
- **Dungeon**: `src/systems/dungeon.js` - Procedural 5x9 maze generation with character-specific boss scaling
- **Inventory**: `src/systems/inventory.js` - Item and equipment management (planned)
- **Save System**: Character-specific progression paths with individual save slots (`src/components/save-slot-screen.jsx`)

### Screen Navigation
Screens are controlled by `GameState.current.currentScreen`:
- `'main-menu'` - Character selection with Soul Forge access
- `'save-slots'` - Save slot management (New Game/Load/Delete with confirmations)
- `'exploration'` - Dungeon grid navigation
- `'battle'` - Turn-based combat UI
- `'shop'` - Item purchasing
- `'outcome'` - Post-battle results

### File Structure Conventions
- All React components use kebab-case naming (e.g., `battle-screen.jsx`)
- Constants organized in `src/constants/` directory
- Core game logic in `src/systems/`
- UI components in `src/components/`

## Key Game Systems

### Combat System
- Turn order determined by Speed (SPD) stat
- Multi-enemy encounters with focus targeting
- Status effects (poison, defend stance)
- God mode and instant win debug features

### Character System
- Three playable characters with unique resources (Vigor, Mana, Energy)
- **Character-Specific Progression**: Each character has unique progression paths and boss scaling
- **Balanced Progression**: XP curve adjusted (100 base + 120 increment) to prevent rapid leveling after level 3
- **Balanced Stats**: Lower starting stats for more strategic gameplay
- **Resource Management**: Reduced resource pools require careful ability usage
- **Individual Save System**: 3 save slots per character with separate progression
- **Boss Scaling**: All characters face the same boss difficulty (1.0x) for fair balance
- Character growth rates balanced for long-term progression

### Dungeon System
- **Grid Size**: 5x9 compact maze layout (optimized for large, visible squares)
- **No Fog of War**: ALL rooms are visible from the start - no hidden paths or fog of war mechanics
- **Strategic Visibility**: Full dungeon path revealed from start for strategic planning of optimal routes
- **Clean Path Display**: Unvisited paths appear plain/empty until explored, events remain surprises
- **Maze Generation**: Recursive backtracking algorithm creates unique layouts each floor
- **Wall System**: Hard walls (⬛) block movement, creating strategic path choices
- **Room Placement**: Strategic positioning prevents direct access to boss/shrine rooms
- **Room Types**: Wall 🧱, Path (empty), Battle ⚔️, Elite 💀, Shop 🏪, Shrine ⛩️, Treasure 💎, Boss 👹, Stairs 🔄
- **Navigation**: WASD/Arrow keys + click adjacent rooms to move
- **Progressive Discovery**: Room types revealed only when entered
- **Replayability**: Each floor generates a completely new maze layout

### Floor Progression System
- **Stairs Mechanic**: Defeat boss to spawn stairs (🔄) to next floor
- **Floor Transitions**: Automatic dungeon reset and generation for new floor
- **Balanced Rewards**: Much lower gold/reward scaling for challenging economy
- **Partial Healing**: 25% HP restoration when advancing floors

### Dynamic Difficulty Scaling
- **Enemy Stats**: Base 20% + 5% exponential scaling per floor (significantly increased from previous versions)
- **Multi-Enemy Encounters**: 30% base chance + 10% per floor (max 60%)
- **Triple Encounters**: Available from floor 5+ (20% chance)
- **Elite Scaling**: 50% base + 10% per floor bonus, may have minions (floor 3+)
- **Boss Scaling**: 80% base + 15% per floor bonus, with character-specific modifiers
- **Character-Specific Boss Naming**: Bosses get unique titles based on character progression path (e.g., "Floor 2 defensive_tank Nemesis")
- **Reward Scaling**: Treasures give 20% more gold per floor, shrine bonuses increase (all significantly reduced from previous versions)

### Floor Progression
- Enemy scaling: Enhanced compound scaling (base + exponential)
- Elite enemies: Floor-scaling bonuses with "Elite" prefix and possible minions
- Boss encounters: Enhanced scaling with unique "Floor X Lord" titles
- Boss placement: Always positioned furthest from starting location  
- Death penalty: 90% gold loss, Hero Souls retained

## Combat Balance & Systems (V38.2)

### Combat Rebalance Overview
Complete overhaul addressing resource costs, survivability, and strategic depth:
- **Increased HP pools**: 60-100% improvement across all characters
- **Enhanced resource pools**: 25-40% more mana/vigor/energy
- **Reduced ability costs**: 20-33% reduction for frequent usage
- **Resource regeneration**: 8+ points per turn for sustainability
- **Starting potions**: Emergency healing and resource restoration
- **Hades-style buffs**: Strategic choices at battle start

### Potion System (`src/systems/potions.js`)
Consumable items available during combat for tactical recovery:

#### Starting Potions
- **3x Health Potions** (50 HP each) - Total emergency HP: 150
- **2x Resource Potions** (40 resource each) - Total emergency resource: 80

#### Potion Types
- **Health Potion** (❤️‍🩹): Restores 50 HP instantly
- **Resource Potion** (🧪): Restores 40 resource points instantly  
- **Greater Health Potion** (💖): Restores 80 HP instantly
- **Elixir of Vitality** (🌟): Fully restores HP and resource

#### Usage
- Potions usable during player turn in combat
- Consume turn but don't end turn (can still move/act)
- Quantities displayed on battle UI
- Managed via `PotionSystem.usePotion(type)`

### Hades-Style Buff System (`src/systems/buffs.js`)
Strategic buff selection at battle start with stackable effects:

#### Buff Categories

**Offensive Buffs:**
- **Berserker Rage** (🔥): +25% attack damage this battle
- **Precision Strike** (🎯): +15% critical hit chance
- **Swift Reflexes** (⚡): +30% speed this battle

**Defensive Buffs:**
- **Iron Skin** (🛡️): +40% defense this battle
- **Vampiric Aura** (🩸): Heal 20% of damage dealt as HP
- **Mana Surge** (💫): +50% resource regeneration this battle

**Utility Buffs:**
- **Battle Focus** (🎭): Abilities cost 25% less resource
- **Lucky Strikes** (🍀): 20% chance to not consume resource
- **Second Wind** (🌪️): Heal 15 HP at start of each turn

#### Buff Selection
- 3 random buffs offered at battle start (from pool of 9+)
- Player chooses 1 buff to apply for entire battle
- Buffs are stackable across multiple battles
- Effects processed at appropriate timing (`turn_start`, `damage_dealt`, etc.)

### Resource Regeneration System
Characters now regenerate resources each turn for sustainable combat:
- **Base Regeneration**: 8 points per turn
- **Level Scaling**: +0.5 additional per character level
- **Buff Modifiers**: Mana Surge increases regen by 50%
- **Example**: Level 5 character regens 10.5 per turn

### Balanced Character Stats
Enhanced starting stats for better survivability and gameplay:

#### Warrior (Taha)
- **HP**: 70 → 100 (+30 survivability)
- **Vigor**: 35 → 50 (+15 for more Shield Bash usage)
- **Shield Bash Cost**: 15 → 12 (-20% cost reduction)

#### Sorceress (Mais) 
- **HP**: 50 → 80 (+30 survivability) 
- **Mana**: 50 → 70 (+20 for multiple Fireball casts)
- **Fireball Cost**: 30 → 20 (-33% cost reduction)

#### Rogue (Ibrahim)
- **HP**: 60 → 90 (+30 survivability)
- **Energy**: 40 → 60 (+20 for more Venom Strike usage) 
- **Venom Strike Cost**: 20 → 15 (-25% cost reduction)

### Battle UI Enhancements
Redesigned battle interface for new systems:
- **Compact action buttons**: 4-column grid for main combat actions
- **Potion row**: Dedicated buttons showing quantities (HP, MP, G.HP, Elixir)
- **Buff indicators**: Active buffs shown with icons and effects
- **Resource tracking**: Enhanced resource bars with regeneration display

## Debug Features

### Developer Hotkeys (Global)
- `0` - Toggle God Mode (invincibility + 9999 damage)
- `1` - Restore HP to full
- `2` - Restore resource (Mana/Vigor/Energy) to full
- `3` - Add 100 gold
- `4` - Gain one level
- `5` - Instantly win current battle

### Persistent Debugger
- Always-visible debug panel (`src/components/persistent-debugger.jsx`)
- Integrated logging system (`src/core/logger.js`)
- Log categories: SYSTEM, COMBAT, STATE, UI, INPUT, ERROR

## Character-Specific Save System

### Save System Implementation
- **3 Save Slots per Character**: Each character (Taha, Mais, Ibrahim) has independent save data
- **Character Selection Flow**: Main Menu → Character Selection → Save Slot Management → Game
- **Save Data Structure**: Includes characterId, level, floor, gold, experience, and character-specific progression
- **Confirmation Dialogs**: New Game overwrites, Load Game, and Delete operations all require confirmation
- **Automatic Saving**: Game state is automatically saved during progression (manual save functionality available)

### Character Progression Paths
Each character has unique progression characteristics defined in `src/constants/characters.js`:

#### Taha (Warrior)
- **Progression Path**: `defensive_tank`
- **Boss Scaling**: 1.0x (same difficulty as all characters)
- **Preferred Enemy Types**: `brute`, `physical`
- **Unique Rewards**: `heavy_armor`, `shields`

#### Mais (Sorceress)  
- **Progression Path**: `elemental_mage`
- **Boss Scaling**: 1.0x (same difficulty as all characters)
- **Preferred Enemy Types**: `magical`, `undead`
- **Unique Rewards**: `staves`, `mana_crystals`

#### Ibrahim (Rogue)
- **Progression Path**: `assassin_berserker`
- **Boss Scaling**: 1.0x (same difficulty as all characters)
- **Preferred Enemy Types**: `fast`, `elite`
- **Unique Rewards**: `daggers`, `poisons`

### Save System Usage
- Save slots display: Level, Floor, Gold, and Last Played timestamp
- Empty slots show "Empty Slot" with option to start New Game
- Existing saves show Load/Delete options with confirmation
- Character-specific save keys: `pathOfHeroes_save_${characterId}_${slotNumber}`

## Important Implementation Notes

### Documentation Maintenance (CRITICAL RULE)
- **ALWAYS update README.md** to match all CLAUDE.md changes after implementing new features
- README.md serves as user-facing documentation and must stay synchronized
- Check both files for consistency before completing any major feature implementation
- Version numbers and changelogs must be updated in both files simultaneously

### State Management Patterns
- Never mutate `GameState.current` directly - use provided methods
- Always call `GameState._notify()` after state changes
- Components should subscribe to state in `useEffect` with cleanup
- Use character-specific save methods: `GameState.saveGame(characterId, slotNumber)`
- Load character data with: `GameState.loadGame(characterId, slotNumber)`

### Combat Implementation
- Combat is turn-based with automatic enemy AI after 800ms delay
- All damage calculations go through `CombatSystem.calculateDamage()`
- Status effects are processed at start of each unit's turn

### Dungeon Implementation
- Maze generation uses recursive backtracking for guaranteed solvable paths
- All movement respects wall boundaries - no free navigation
- Room revelation system shows adjacent accessible rooms only
- Strategic room distribution: boss furthest from start, special rooms scattered
- Player movement restricted to path tiles only (walls block access)

### UI Patterns  
- Mobile-first design with strict portrait orientation
- TailwindCSS utility classes for styling
- 5x9 compact grid with large, clearly visible squares
- Full-screen layout maximizing square size and usability
- Large text (3xl) and increased spacing for better visibility
- Click/tap navigation for adjacent accessible rooms only
- Combat UI shows turn indicators and action buttons

### Visual Indicators
- **Clean Paths**: Unvisited path rooms appear plain/empty (clean and uncluttered)
- **Discovered Rooms**: Actual room type icons after visiting (⚔️, 💀, 🏪, etc.)
- **Completed Rooms**: Color-coded backgrounds (green for battles, blue for stairs, etc.)
- **Wall Blocks**: Stone-colored 🧱 icons, clearly blocking and non-interactive
- **Player Position**: Amber pulsing background with character icon (🧍)
- **Strategic Planning**: Full maze layout visible for route planning to boss/shops

## Testing & Debugging

Use the developer hotkeys for rapid testing of game states. The persistent debugger shows real-time game state and logs all system operations.

The game enforces portrait orientation and is optimized for mobile devices with touch controls alongside keyboard support.

## Comprehensive Localization System

### Master Translation Files (Editable by User)
All game text is stored in external JSON files for easy editing:
- `public/locales/en.json` - English translations
- `public/locales/ar.json` - Arabic translations

**No code changes needed to update translations!** See `LOCALIZATION.md` for complete editing guide.

### Implementation Pattern
All components use the centralized localization system:

```javascript
import { t } from '../core/localization.js';

function MyComponent() {
    return <div>{t('game.title')}</div>;
}
```

### Language Selection
- Automatic language selection screen on first launch
- Language toggle available on main menu (🌍 button)
- Persistent language preference in localStorage
- Automatic RTL support for Arabic

### Adding New Translations
1. Add new keys to both `en.json` and `ar.json` files
2. Use descriptive nested keys: `characters.warrior.name`, `combat.victory`
3. Support template strings: `{placeholder}` for dynamic values
4. Use `t('key', {placeholder: value})` for dynamic text

### Current Integration Status
- ✅ Complete bilingual system with external JSON files
- ✅ Language selection screen at startup
- ✅ All UI elements fully localized
- ✅ Character names, enemy names, skills localized
- ✅ Hero Souls system fully localized
- ✅ Main menu with language toggle
- ✅ Save slot system fully localized with confirmation dialogs
- ✅ RTL support for Arabic interface

## Dark RPG Theme Colors

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