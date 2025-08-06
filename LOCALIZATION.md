# Path of Heroes - Localization System

This document explains how to manage translations for Path of Heroes without touching code.

## Quick Start

All translations are stored in JSON files that you can edit directly:

- **English**: `public/locales/en.json`
- **Arabic**: `public/locales/ar.json`

Simply edit these files to change any text in the game. The changes will appear immediately when you reload the game.

## How It Works

### Language Selection
- First-time players see a language selection screen
- Language preference is saved automatically
- Players can switch languages anytime using the 🌍 button on the main menu

### Translation Files Structure

Each translation file is organized by game feature:

```json
{
  "game": {
    "title": "Path of Heroes",
    "subtitle": "Choose Your Hero"
  },
  "characters": {
    "warrior": {
      "name": "Taha",
      "role": "Tank/Warrior",
      "description": "A formidable warrior..."
    }
  },
  "enemies": {
    "goblin": "Goblin",
    "orcWarlord": "Orc Warlord"
  }
}
```

### Making Changes

**To change any text in the game:**

1. Find the text you want to change in the game
2. Open `public/locales/en.json` for English or `public/locales/ar.json` for Arabic
3. Search for the current text or browse by category
4. Change the value (keep the key the same)
5. Save the file
6. Reload the game to see changes

**Example:**
```json
// To change the game title from "Path of Heroes" to "Heroes' Journey"
"game": {
  "title": "Heroes' Journey",  // ← Change this value
  "subtitle": "Choose Your Hero"
}
```

## Translation Categories

### Core Game Elements
- `game.*` - Game title, loading messages
- `menu.*` - Main menu buttons and options
- `language.*` - Language selection screen

### Characters & Combat
- `characters.*` - Hero names, descriptions, roles
- `enemies.*` - All enemy names
- `skills.*` - Ability names and descriptions
- `combat.*` - Battle screen buttons and messages

### Game Systems
- `stats.*` - HP, ATK, DEF, etc.
- `resources.*` - Vigor, Mana, Energy
- `rooms.*` - Shop, Shrine, Battle Room, etc.
- `souls.*` - Hero Souls system text
- `upgrades.*` - Soul Forge upgrades

### Dynamic Text
Some text uses placeholders that get filled in automatically:

```json
"combat": {
  "insufficientResource": "Not enough {resource}!"
}
```

The `{resource}` will be replaced with "Vigor", "Mana", or "Energy" automatically.

## Translation Guidelines

### For English (en.json)
- Use clear, concise language
- Keep consistent terminology (e.g., always "Hero Souls", never mix with "Soul Points")
- Use title case for proper nouns and UI elements

### For Arabic (ar.json)
- Ensure proper Arabic grammar and flow
- Use appropriate Arabic gaming terminology
- Consider cultural context for names and descriptions
- The system automatically handles RTL (right-to-left) text direction

### Adding New Text
When developers add new features, they'll add new translation keys. To add translations:

1. Find the new key in the English file (it will have an English value)
2. Add the corresponding Arabic translation in `ar.json`
3. Both files should have the same structure and keys

## Character Names

Character names can be localized:

```json
// English version
"characters": {
  "warrior": {
    "name": "Taha"
  }
}

// Arabic version  
"characters": {
  "warrior": {
    "name": "طه"
  }
}
```

The Arabic version uses the original Arabic name, while English keeps it as "Taha" for authenticity.

## Testing Your Changes

1. Make your changes to the JSON files
2. Save the files
3. Refresh the game in your browser
4. Switch between languages using the 🌍 button to test both versions
5. Play through different parts of the game to see your changes in context

## Common Issues

**Text not updating?**
- Check that the JSON syntax is valid (no missing commas, quotes, brackets)
- Ensure you saved the file
- Hard refresh your browser (Ctrl+F5)

**Missing translations?**
- If Arabic text shows English, add the missing key to `ar.json`
- All keys in `en.json` should exist in `ar.json`

**Special characters?**
- Arabic text should display correctly
- If you see boxes or question marks, check the file encoding (should be UTF-8)

## File Backup

Before making major changes, consider backing up the translation files:
- Copy `public/locales/en.json` to `en-backup.json`
- Copy `public/locales/ar.json` to `ar-backup.json`

This way you can restore the originals if something goes wrong.

---

*This system allows you to fully customize the game's language and text without any programming knowledge. All changes are immediately visible in the game.*