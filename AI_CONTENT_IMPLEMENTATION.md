# AI Content Generator Implementation

## Overview
The AI Content Generator system adds dynamic, procedurally-generated flavor text throughout the game, making each playthrough feel more immersive and unique.

## Features Implemented

### 1. Dynamic Battle Introductions
- **Boss Battles**: Character-specific intros based on progression path
  - Defensive Tank: Focuses on durability and challenge themes
  - Elemental Mage: Emphasizes magical power and elemental forces
  - Assassin Berserker: Highlights speed and deadly precision
- **Elite Enemies**: Type-specific intros (brute, magical, fast, undead, elite)
- **Regular Battles**: Rotating selection of combat flavor text

### 2. Floor Atmosphere Descriptions
- 10 levels of dungeon descriptions that grow darker and more ominous
- Multiple variations per floor for replayability
- Atmosphere builds from "entrance to the dungeon" to "no light reaches this abyss"

### 3. Victory/Defeat Flavor Text
- **Victory Types**:
  - Quick Victory (< 15 seconds): "Swift and decisive"
  - Normal Victory (15-45 seconds): Standard triumph text
  - Hard Victory (> 45 seconds): Close-call survival themes
  - Boss Victory: Epic triumph with legendary flair
- **Defeat Text**: Encouraging messages emphasizing Hero Souls and returning stronger

### 4. Room-Specific Descriptions
- Battle rooms: Ominous combat warnings
- Elite rooms: Heavy presence and menace
- Boss rooms: Final chamber drama
- Shop rooms: Merchant interactions
- Treasure rooms: Loot discovery excitement
- Shrine rooms: Divine energy and healing
- Stairs rooms: Deeper descent warnings

## Files Created

### `src/systems/content-generator.js` (350+ lines)
Core content generation system with:
- Floor descriptions (1-10)
- Boss intro templates by character path
- Elite intro templates by enemy type
- Room atmosphere descriptions
- Victory/defeat flavor texts
- Combat flavor generation
- Helper functions for random selection

## Files Modified

### `src/components/battle-screen.jsx`
- Imported ContentGenerator
- Added `battleIntro` state that generates on component mount
- Detects boss/elite/regular battles automatically
- Displays intro text with golden border styling
- Adapts to character progression path

```javascript
const [battleIntro] = useState(() => {
  const floor = GameState.current.currentFloor || 1;
  const characterPath = GameState.current.player?.progressionPath || 'defensive_tank';

  const isBoss = initialEnemies.some(e => e.isBoss);
  const isElite = initialEnemies.some(e => e.isElite);

  if (isBoss) {
    return ContentGenerator.generateBossIntro(floor, characterPath);
  } else if (isElite) {
    return ContentGenerator.generateEliteIntro(initialEnemies[0]?.type || 'elite');
  } else {
    // Regular battle flavor
    return flavorTexts[Math.floor(Math.random() * flavorTexts.length)];
  }
});
```

### `src/components/outcome-screen.jsx`
- Imported ContentGenerator
- Added `battleContext` prop (duration, isBoss, floor)
- Generates victory/defeat flavor text using `React.useMemo`
- Displays flavor text with color-coded styling (green for victory, red for defeat)
- Adapts message based on battle duration and boss status

```javascript
const flavorText = React.useMemo(() => {
  if (!battleContext) return null;

  if (victory) {
    return ContentGenerator.getVictoryText(battleContext.duration, battleContext.isBoss);
  } else {
    return ContentGenerator.getDefeatText();
  }
}, [victory, battleContext]);
```

### `src/App.jsx`
- Added `battleContext` state to track battle metadata
- Modified `endBattle` to capture battle duration, boss status, and floor
- Passes `battleContext` to OutcomeScreen component
- Resets context in `handleOutcomeContinue`

```javascript
// Set battle context for dynamic flavor text
setBattleContext({
  duration: battleDuration || 30,
  isBoss: currentRoom.type === RoomTypes.BOSS,
  floor: GameState.current.currentFloor
});
```

## Visual Design

### Battle Intro Display
- Golden gradient background (`via-[#d4a656]/20`)
- Left/right golden borders (4px)
- Italic text styling
- Fade-in animation
- Centered alignment

### Outcome Flavor Text
- **Victory**: Green uncommon color scheme
- **Defeat**: Red health-full color scheme
- Gradient background matching outcome type
- Border-left and border-right styling
- Italic text for narrative feel
- Fade-in animation

## Content Examples

### Boss Intro (Defensive Tank)
> "A hulking brute emerges from the shadows, shield raised. It seeks an immovable object to test."

### Elite Intro (Brute)
> "A towering brute blocks the way. Its muscles ripple with barely contained rage."

### Quick Victory
> "Swift and decisive. The enemy never stood a chance."

### Hard Victory
> "You survived. Barely. That was too close."

### Boss Victory
> "VICTORY! The dungeon trembles at your might!"

### Defeat
> "Darkness claims you. Your story ends here... for now."

## Technical Details

### Performance
- Text generation uses simple random selection (O(1) complexity)
- No external API calls - all content is local
- Minimal memory footprint (~50KB for all text templates)
- `React.useMemo` prevents unnecessary re-generation

### Extensibility
- Easy to add new text variations to existing arrays
- Character progression paths can be extended
- Floor descriptions can go beyond level 10
- New room types can be added easily

## Future Enhancements

1. **Localization**: Add support for Arabic translations of flavor text
2. **Player Stats Integration**: Reference player stats in flavor text (e.g., "Your shield held firm")
3. **Enemy-Specific Intros**: Custom text for specific enemy types
4. **Combo System**: Special flavor text for combat combos
5. **Achievement Triggers**: Unique text for special achievements

## Usage

The system works automatically - no player interaction required:

1. **Starting Battle**: Flavor text appears at top of battle screen
2. **Battle End**: Victory/defeat flavor appears on outcome screen
3. **Context Awareness**: Text adapts to:
   - Character progression path
   - Battle difficulty (boss/elite/regular)
   - Battle duration (quick/normal/hard)
   - Current floor number

## Testing Checklist

- [x] Boss battles show character-specific intros
- [x] Elite battles show elite-specific intros
- [x] Regular battles show generic combat flavor
- [x] Quick victories show appropriate text
- [x] Hard victories show appropriate text
- [x] Boss victories show epic text
- [x] Defeats show encouraging text
- [x] All text displays with proper styling
- [x] No console errors during battles
- [x] Text generation is fast and doesn't impact FPS

## Version Info
- **Version**: 1.2
- **Feature**: AI Content Generator
- **Lines Added**: ~450 (350 content-generator.js + 100 modifications)
- **Dependencies**: None (pure JavaScript)
- **Commit Tag**: v1.2-content-generator
