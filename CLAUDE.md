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
- **State Updates**: All state changes go through `GameState.update()` or dedicated methods
- **Reactivity**: Components subscribe to state changes via `GameState.subscribe()`

### Core Systems
- **Combat**: `src/systems/combat.js` - Turn-based combat with damage formula: `(ATK² / (ATK + DEF))`
- **Dungeon**: `src/systems/dungeon.js` - Procedural maze generation with 11x11 grid and wall-based pathfinding
- **Inventory**: `src/systems/inventory.js` - Item and equipment management (planned)

### Screen Navigation
Screens are controlled by `GameState.current.currentScreen`:
- `'main-menu'` - Character selection
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
- Level-up system with stat growth rates
- XP curve: baseXP + (level-1) * increment

### Dungeon System
- **Grid Size**: 5x9 compact maze layout (optimized for large, visible squares)
- **Screen Optimization**: Maximum square size utilizing full screen space
- **Maze Generation**: Recursive backtracking algorithm creates unique layouts each floor
- **Wall System**: Hard walls (⬛) block movement, creating strategic path choices
- **Room Placement**: Strategic positioning prevents direct access to boss/shrine rooms
- **Room Types**: Wall ⬛, Battle ⚔️, Elite 💀, Shop 🏪, Shrine ⛩️, Treasure 💎, Boss 👹
- **Navigation**: WASD/Arrow keys + click adjacent rooms to move
- **Replayability**: Each floor generates a completely new maze layout

### Floor Progression
- Enemy scaling: 20% stat increase per floor
- Elite enemies: +50% stat bonus over regular encounters
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

## Important Implementation Notes

### State Management Patterns
- Never mutate `GameState.current` directly - use provided methods
- Always call `GameState._notify()` after state changes
- Components should subscribe to state in `useEffect` with cleanup

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
- ✅ RTL support for Arabic interface