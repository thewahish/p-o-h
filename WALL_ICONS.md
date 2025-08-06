# Wall Icon Options

You can easily change the wall icon by editing `src/systems/dungeon.js` line 24:

## Current: 
```javascript
[RoomTypes.WALL]: '🧱', // Brick wall
```

## Alternative Wall Icons:

### Stone/Rock Options:
- `🪨` - Rock/Stone
- `⬛` - Black square (original)
- `🔳` - White square outline
- `⬜` - White square
- `🟫` - Brown square
- `🟤` - Brown circle

### Nature/Fantasy Options:
- `🌳` - Tree (forest walls)
- `🏔️` - Mountain
- `🪵` - Log/Wood
- `🌿` - Leaves/Foliage

### Dungeon/Gothic Options:
- `🕳️` - Void/Pit
- `⚫` - Black circle
- `🔒` - Locked
- `⛔` - Blocked
- `🚫` - Forbidden

### Mechanical Options:
- `⚙️` - Gear/Mechanical
- `🔩` - Bolt/Screw
- `⚡` - Electric barrier
- `🔴` - Red warning

## Easy to Change Later:
When you add custom images/assets, just replace the emoji with an `<img>` tag or CSS class name in the same location.