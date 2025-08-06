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
- **Strategic Visibility**: Full dungeon path revealed from start for strategic planning
- **Clean Path Display**: Unvisited paths appear plain/empty until explored
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

## Debug Features

### Developer Hotkeys (Global)
- `0` - Toggle God Mode (invincibility + 9999 damage)
- `1` - Heal player to full HP
- `2` - Add 100 gold  
- `3` - Gain one level
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