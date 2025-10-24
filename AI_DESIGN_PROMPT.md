# Path of Heroes - UI/UX Design Mockup Prompt

## Master Prompt for AI Image Generation

**Target LLMs**: DALL-E, Midjourney, Stable Diffusion, Adobe Firefly

---

## 🎨 **Global Design Guidelines**

### Art Style
- **Theme**: Dark fantasy RPG, dungeon crawler aesthetic
- **Color Palette**: Dark browns, golden amber accents, deep blacks
- **Visual Style**: Modern mobile game UI (similar to Hades, Slay the Spire, Dead Cells)
- **Screen Format**: Mobile portrait (9:16 aspect ratio, 360x640 to 412x915px)

### Color Scheme
```
Primary Gold:      #d4a656 (golden amber for highlights, borders, titles)
Dark Brown:        #5c4423 (secondary backgrounds, buttons)
Light Cream Text:  #f8e4c0 (all readable text)
Background:        Radial gradient from dark brown (#1a0f0a) to black (#000000)

Rarity Colors:
- Common:     #95a5a6 (gray)
- Uncommon:   #27ae60 (green)
- Rare:       #3498db (blue)
- Epic:       #9b59b6 (purple)
- Mythic:     #e67e22 (orange)
- Legendary:  #f1c40f (gold)

Health/Mana:
- Health Bar:  Red-orange gradient (#8b0000 → #ff4500 → #ff6347)
- Mana Bar:    Blue gradient (#191970 → #4169e1 → #87ceeb)
- Energy Bar:  Yellow-green gradient
```

### Typography Hierarchy
```
Screen Titles:    24px bold, golden (#d4a656)
Section Headers:  18px bold, golden
Card Titles:      16px bold, cream (#f8e4c0)
Body Text:        14px regular, cream
Small Labels:     12px regular, cream (70% opacity)
Tiny Stats:       10px regular, cream (60% opacity)
```

### Standard UI Elements
```
Buttons:
- Primary:   px-6 py-2, 16px text, golden background, dark text
- Secondary: px-4 py-2, 14px text, brown background, light text
- Small:     px-3 py-1, 12px text, brown background, light text

Cards:
- Background: Semi-transparent dark brown (#5c4423 at 80%)
- Border:     2px golden (#d4a656)
- Padding:    12px (all sides)
- Border Radius: 8px rounded corners

Icons/Emojis:
- Large (Feature):  48px (treasure chests, buff icons)
- Medium (Avatar):  30px (enemy faces, player avatar)
- Small (UI):       20px (stat icons like ⚔️ 🛡️ ⚡)
- Tiny (Inline):    16px (inline decorative icons)

Stat Bars:
- Height:    8px
- Background: Dark gray (#1a1a1a)
- Fill:      Gradient based on type (health/mana/xp)
- Width:     100% of container
```

---

## 📱 **Screen-by-Screen Specifications**

### **SCREEN 1: Main Menu**
**Purpose**: First screen after language selection, character/mode selection

**Layout Structure**:
```
┌─────────────────────────────────────┐
│         [Title: 48px bold]          │ ← "Path of Heroes"
│      [Subtitle: 18px regular]       │ ← "Choose Your Hero"
│                                     │
│     [🌍 Language Button: small]     │ ← Top-right corner
│                                     │
│  ┌───────────────────────────────┐  │
│  │   [Play Game Button: large]   │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │   [Soul Forge Button]         │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │   [Options Button]            │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │   [Credits Button]            │  │
│  └───────────────────────────────┘  │
│                                     │
│  [🐛 Debug] [📊 Analytics]          │ ← Bottom-right corner icons
└─────────────────────────────────────┘
```

**Specific Details**:
- Title: "Path of Heroes" in large glowing golden text (48px)
- Subtitle: "Choose Your Hero" in cream text (18px)
- 4 vertical stacked buttons, equal width, 12px gaps
- Each button: Golden border, dark brown fill, 16px text
- Language toggle: Small circular button (32px), 🌍 icon
- Debug/Analytics: Small circular buttons (32px each), right-aligned

---

### **SCREEN 2: Character Selection**
**Purpose**: Choose between 3 playable heroes (Omar, Salma, Shadi)

**Layout Structure**:
```
┌─────────────────────────────────────┐
│    [Title: "Choose Your Champion"]  │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  👤 48px                    │   │ ← Omar (Warrior)
│  │  OMAR                        │   │
│  │  Role: Warrior               │   │
│  │  ❤️ 100  ⚔️ 12  🛡️ 15       │   │
│  │  [High Defense trait badge]  │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  🧙 48px                    │   │ ← Salma (Sorceress)
│  │  SALMA                       │   │
│  │  Role: Ranged Mage           │   │
│  │  ❤️ 80  ⚔️ 18  🛡️ 8         │   │
│  │  [Elemental Magic badge]     │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  🗡️ 48px                     │   │ ← Shadi (Rogue)
│  │  SHADI                       │   │
│  │  Role: Assassin              │   │
│  │  ❤️ 90  ⚔️ 15  🛡️ 10        │   │
│  │  [Berserker Rage badge]      │   │
│  └─────────────────────────────┘   │
│                                     │
│        [← Back Button]              │
└─────────────────────────────────────┘
```

**Specific Details**:
- 3 character cards stacked vertically
- Each card: Semi-transparent dark background, golden border (2px)
- Character icon: 48px emoji at top-left
- Name: 18px bold, cream color
- Role: 14px regular, 70% opacity
- Base stats: Horizontal row, 12px text with stat icons (16px)
- Trait badge: Small pill-shaped badge, colored by trait type
- Hover state: Brighter golden border, subtle scale (105%)
- Selected state: Glowing golden border with pulsing animation

---

### **SCREEN 3: Save Slot Selection**
**Purpose**: Choose from 3 save slots (New Game, Load, Delete)

**Layout Structure**:
```
┌─────────────────────────────────────┐
│      [Title: "Select a Save Slot"]  │
│      [Character Name: "Omar"]       │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  SLOT 1                      │   │
│  │  ─────────────────────────   │   │
│  │  Empty Slot                  │   │
│  │  [New Game Button]           │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  SLOT 2                      │   │
│  │  ─────────────────────────   │   │
│  │  Level 5 • Floor 3           │   │
│  │  💰 1,250 Gold               │   │
│  │  Last Played: 2h ago         │   │
│  │  [Load] [Delete]             │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  SLOT 3                      │   │
│  │  ─────────────────────────   │   │
│  │  Empty Slot                  │   │
│  │  [New Game Button]           │   │
│  └─────────────────────────────┘   │
│                                     │
│        [← Back Button]              │
└─────────────────────────────────────┘
```

**Specific Details**:
- Title: "Select a Save Slot" (24px bold, golden)
- Character name: Below title (18px, cream)
- 3 equal-height slots (fills screen evenly)
- Empty slot: Gray text "Empty Slot", single green "New Game" button
- Filled slot:
  - Level/Floor info (16px bold)
  - Gold amount with icon (14px)
  - Timestamp (12px, 60% opacity)
  - Two buttons: "Load" (green), "Delete" (red)
- Accordion behavior: Click to expand/collapse details

---

### **SCREEN 4: Exploration/Dungeon Grid**
**Purpose**: Navigate 5x9 dungeon grid maze

**Layout Structure**:
```
┌─────────────────────────────────────┐
│ [Floor: 3] [Lvl: 5] [💰 850] [HP]   │ ← Top stats bar
│                                     │
│ [XP Progress Bar ████░░░░░░ 60%]   │
│                                     │
│ ┌─┬─┬─┬─┬─┐                        │
│ │⬛│⬛│⬛│⬛│⬛│                        │ ← Dungeon grid (5x9)
│ ├─┼─┼─┼─┼─┤                        │   Wall blocks (⬛)
│ │⬛│ │⚔️│ │⬛│                        │   Empty paths ( )
│ ├─┼─┼─┼─┼─┤                        │   Events (⚔️🏪⛩️💎)
│ │⬛│🧍│⬛│💀│⬛│                        │   Player (🧍)
│ ├─┼─┼─┼─┼─┤                        │   Boss (👹)
│ │⬛│ │⬛│ │⬛│                        │
│ ├─┼─┼─┼─┼─┤                        │
│ │⬛│🏪│ │⛩️│⬛│                        │
│ ├─┼─┼─┼─┼─┤                        │
│ │⬛│⬛│⬛│⬛│⬛│                        │
│ ├─┼─┼─┼─┼─┤                        │
│ │⬛│ │💎│ │⬛│                        │
│ ├─┼─┼─┼─┼─┤                        │
│ │⬛│⬛│ │⬛│⬛│                        │
│ ├─┼─┼─┼─┼─┤                        │
│ │⬛│ │👹│ │⬛│                        │ ← Boss at far end
│ └─┴─┴─┴─┴─┘                        │
│                                     │
│ [Use WASD/Arrows to navigate]      │ ← Small hint text
│                                     │
│      [🎒 Inventory Button]          │
└─────────────────────────────────────┘
```

**Specific Details**:
- Top stats bar: Horizontal row with Floor, Level, Gold, HP
  - Floor/Level: 12px text
  - Gold: Icon + number (14px)
  - HP: Text display (14px)
- XP bar: Full-width, 8px height, blue gradient fill
- Grid: 5 columns × 9 rows, equal square cells
- Cell size: Large enough for clear emoji visibility (40-50px each)
- Wall cells: Dark stone color (#3a3a3a), 🧱 icon
- Empty paths: Transparent/dark background
- Event icons: 24px emojis (⚔️ battle, 🏪 shop, ⛩️ shrine, 💎 treasure, 👹 boss)
- Player position: Amber/yellow pulsing background with 🧍 icon
- Visited rooms: Slightly different background (darker green for battles)
- Inventory button: Bottom, full-width, 14px text with 🎒 icon

---

### **SCREEN 5: Battle Screen**
**Purpose**: Turn-based combat interface

**Layout Structure**:
```
┌─────────────────────────────────────┐
│    ⚔️ BATTLE ⚔️                      │
│    [Wave 1/3] [Your Turn]           │
│                                     │
│  ┌─────────────────────────────┐   │ ← Focused Enemy
│  │  👹 30px   [Elite Goblin]    │   │
│  │  HP: ████████░░ 80/100      │   │
│  │  ⚔️ 15  🛡️ 8  ⚡ 10  💥 5%   │   │
│  │  [🔥 Burning] [💀 Poison]    │   │ ← Status effects
│  └─────────────────────────────┘   │
│                                     │
│  [👹 Slime HP: ████░░░ 40/50]      │ ← Other enemies
│  [👹 Skeleton HP: ███████░ 70/80]  │
│                                     │
│  ┌─────────────────────────────┐   │ ← Player Card
│  │  👤 30px   [Omar] Lvl 5      │   │
│  │  HP: ██████████ 100/100     │   │
│  │  Vigor: ██████░░░░ 60/100   │   │
│  │  ⚔️ 12  🛡️ 15  ⚡ 8  💥 10%  │   │
│  │  [🛡️ Defending]              │   │ ← Active buffs
│  └─────────────────────────────┘   │
│                                     │
│  [XP: ████░░░░░░ 40/100]           │ ← XP Bar
│                                     │
│  [Ultimate: ████████░░ 16/20] ⚡    │ ← Ultimate gauge
│                                     │
│  ┌─┬─┬─┬─┐                         │ ← Action buttons (4 columns)
│  │⚔│🛡│⚡│🧪│                         │
│  └─┴─┴─┴─┘                         │
│  Attack Defend Skill Flee          │
│                                     │
│  ┌─────────────────────────────┐   │ ← Potions row
│  │ ❤️‍🩹(3) 🧪(2) 💖(1) 🌟(0) │   │
│  └─────────────────────────────┘   │
│                                     │
│  [Combat feedback message...]       │ ← Feedback zone
└─────────────────────────────────────┘
```

**Specific Details**:
- Title: "⚔️ BATTLE ⚔️" (18px bold, golden)
- Wave indicator: Small badge (12px) if multi-wave
- Turn indicator: "Your Turn" / "Enemy Turn" (12px)

**Focused Enemy Card**:
- Large card with golden border
- Enemy icon: 30px emoji
- Name: 16px bold, health color (#ff4500)
- HP bar: 8px height, red gradient, shows 80/100
- Stats row: Icons (16px) + numbers (12px)
- Status effects: Small badges with icons and duration counters

**Other Enemies**:
- Compact single-line entries
- Icon (20px) + Name + HP bar (mini version)
- Click to focus

**Player Card**:
- Similar to enemy but with uncommon green border
- Shows both HP and Resource (Vigor/Mana/Energy)
- Active buffs: Badge pills below stats

**XP Bar**:
- Full width, 8px height, blue/cyan gradient

**Ultimate Gauge**:
- Full width, 8px height
- Gray when charging, golden gradient when ready
- Pulsing animation when ready

**Action Buttons**:
- 4-column grid
- Large emoji icons (24px)
- Text labels below (12px)
- Primary button style

**Potions Row**:
- Horizontal layout, 4 potion types
- Icon (20px) + quantity in parentheses
- Disabled style when quantity = 0

**Feedback Zone**:
- 12px height area
- Shows latest combat message
- Italic text, fades after 3 seconds

---

### **SCREEN 6: Buff Selection (Hades-style)**
**Purpose**: Choose 1 of 3 buffs before battle

**Layout Structure**:
```
┌─────────────────────────────────────┐
│  ✨ Choose Your Blessing ✨          │
│  [Select one buff to empower you]   │
│                                     │
│  ┌───────┬───────┬───────┐         │
│  │  🔥   │  🛡️   │  ⚡   │         │ ← Buff icons (48px)
│  │       │       │       │         │
│  │ Rage  │ Iron  │ Swift │         │ ← Names (16px bold)
│  │       │ Skin  │       │         │
│  │ +25%  │ +40%  │ +30%  │         │ ← Effects (14px)
│  │ ATK   │ DEF   │ SPD   │         │
│  │       │       │       │         │
│  │       │ ✓ SEL │       │         │ ← Selection indicator
│  └───────┴───────┴───────┘         │
│                                     │
│  [Buffs stack across battles]       │ ← Hint text (12px)
│                                     │
│  ┌──────────┐  ┌──────────┐        │
│  │   Skip   │  │ Confirm  │        │ ← Action buttons
│  └──────────┘  └──────────┘        │
└─────────────────────────────────────┘
```

**Specific Details**:
- Title: "✨ Choose Your Blessing ✨" (24px bold, golden)
- Subtitle: "Select one buff..." (14px, 80% opacity)
- 3-column grid layout
- Each buff card:
  - Large icon at top (48px emoji)
  - Name (16px bold, golden)
  - Description (12px regular)
  - Selection state: Glowing golden border + "✓ SELECTED" text
- Hint text: Small italics below cards (12px, 60% opacity)
- Buttons: Skip (secondary) + Confirm (primary, disabled if none selected)

---

### **SCREEN 7: Shop Screen**
**Purpose**: Purchase 1 item with gold

**Layout Structure**:
```
┌─────────────────────────────────────┐
│         🏪 Merchant's Shop           │
│                                     │
│  ┌─────────────────────────────┐   │
│  │   💰 850 Gold               │   │ ← Gold display
│  └─────────────────────────────┘   │
│                                     │
│  [You may only make one purchase]   │ ← Warning text
│                                     │
│  ┌─────────────────────────────┐   │
│  │  🗡️   Sharp Sword            │   │ ← Item 1
│  │  Rare Weapon                 │   │
│  │  ⚔️ +8  💥 +5%               │   │
│  │              [250 G] ◄─────  │   │ ← Price button
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  🛡️   Sturdy Shield          │   │ ← Item 2
│  │  Epic Armor                  │   │
│  │  🛡️ +12  ❤️ +20              │   │
│  │              [400 G]         │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  💎   Mana Crystal           │   │ ← Item 3
│  │  Legendary Accessory         │   │
│  │  ⚡ +15  🔮 +30               │   │
│  │              [600 G]         │   │
│  └─────────────────────────────┘   │
│                                     │
│        [Leave Shop Button]          │
└─────────────────────────────────────┘
```

**Specific Details**:
- Title: "🏪 Merchant's Shop" (20px bold, golden)
- Gold display: Large centered box, 16px bold legendary gold color
- Warning: "You may only make one purchase" (12px, 70% opacity)
- 3 item cards stacked vertically
- Each item card:
  - Icon (24px emoji) at left
  - Item name (14px bold) colored by rarity
  - Rarity + slot type (10px, 60% opacity, capitalized)
  - Stat bonuses: Horizontal row, icons (16px) + values (10px)
  - Price button: Right-aligned, shows "250 G" format
  - Disabled state: Red background with "Not enough gold!" text
- After purchase: Cards fade out, "Thank you!" message appears
- Leave button: Full-width secondary button at bottom

---

### **SCREEN 8: Outcome Screen (Victory/Defeat)**
**Purpose**: Show battle results

**Layout Structure (Victory)**:
```
┌─────────────────────────────────────┐
│                                     │
│          🎉 VICTORY! 🎉              │ ← Title (24px, green)
│                                     │
│  ┌─────────────────────────────┐   │
│  │ "Your blade strikes true,    │   │ ← Flavor text
│  │  victory is yours!"          │   │   (14px italic)
│  └─────────────────────────────┘   │
│                                     │
│  You have emerged victorious!       │
│                                     │
│  Gold Acquired: +150 💰             │ ← Rewards
│  Experience Gained: +80 ✨          │
│  Hero Souls Earned: 👻 3            │
│                                     │
│        [Continue Button]            │ ← Primary button
└─────────────────────────────────────┘

Layout (Defeat):
┌─────────────────────────────────────┐
│                                     │
│      💀 You Have Fallen... 💀        │ ← Title (24px, red)
│                                     │
│  ┌─────────────────────────────┐   │
│  │ "The shadows claim another   │   │ ← Flavor text
│  │  brave soul..."              │   │
│  └─────────────────────────────┘   │
│                                     │
│  Your journey ends here...          │
│                                     │
│  Gold Lost: -765 (85 remaining)     │ ← Penalties
│  Hero Souls Earned: 👻 2            │
│  Souls are kept for upgrades!       │
│                                     │
│      [Return to Menu Button]        │ ← Primary button
└─────────────────────────────────────┘
```

**Specific Details**:
- Modal overlay: Semi-transparent black backdrop (90% opacity)
- Card: Centered, max-width 400px, 12px padding
- Victory title: 24px bold, uncommon green color
- Defeat title: 24px bold, health-full red color
- Flavor text box:
  - Gradient border (green for victory, red for defeat)
  - 12px padding, 14px italic text
  - Colored text matching title
- Results section:
  - 16px regular text
  - Values in bold with appropriate colors:
    - Gold: Legendary gold (#f1c40f)
    - XP: Mana blue (#87ceeb)
    - Souls: Epic purple (#9b59b6)
- Button: Full-width primary button

---

### **SCREEN 9: Event Interim Screen**
**Purpose**: Brief transition between exploration and events

**Layout Structure**:
```
┌─────────────────────────────────────┐
│                                     │
│                                     │
│            ⚔️                        │ ← Event icon (72px)
│          (pulsing)                  │   Animated
│                                     │
│   You have encountered:             │
│   Elite Goblin, Slime               │ ← Event details (24px)
│                                     │
│       Preparing for battle...       │ ← Status text (16px)
│                                     │
│       Auto-advancing...             │ ← Hint (12px, gray)
│                                     │
│                                     │
│                                     │
└─────────────────────────────────────┘
```

**Specific Details**:
- Full screen, gradient background based on event type:
  - Battle: Red-to-black gradient
  - Boss: Purple-to-black gradient
  - Shop: Blue-to-black gradient
  - Shrine: Yellow-to-black gradient
  - Treasure: Amber-to-black gradient
- Event icon: 72px emoji, centered, pulsing animation
- Event message: 24px bold, white text
- Status text: 16px regular, light gray
- Auto-advance: Automatically transitions after 2 seconds
- Optional manual button: "Continue" (if auto-advance disabled)

---

### **SCREEN 10: Inventory Screen**
**Purpose**: View and manage collected items

**Layout Structure**:
```
┌─────────────────────────────────────┐
│     🎒 Inventory [✕]                │ ← Header with close
│                                     │
│  ┌─────────────────────────────┐   │
│  │   💰 850 Gold   👻 15 Souls │   │ ← Currency display
│  └─────────────────────────────┘   │
│                                     │
│  [All] [Weapons] [Armor] [Items]   │ ← Filter tabs
│     ▔▔▔                             │   Active underline
│                                     │
│  ┌───────────────────┐             │
│  │ 🗡️ Sharp Sword    │ EQUIPPED    │ ← Item 1
│  │ Rare Weapon       │             │
│  │ ⚔️ +8  💥 +5%     │             │
│  └───────────────────┘             │
│                                     │
│  ┌───────────────────┐             │
│  │ 🛡️ Iron Shield    │   [Equip]   │ ← Item 2
│  │ Common Armor      │             │
│  │ 🛡️ +5             │             │
│  └───────────────────┘             │
│                                     │
│  ┌───────────────────┐             │
│  │ ❤️‍🩹 Health Pot ×3 │   [Use]     │ ← Item 3
│  │ Consumable        │             │
│  │ Restores 50 HP    │             │
│  └───────────────────┘             │
│                                     │
│  [Empty slots...]                   │
│                                     │
│        [Close Inventory]            │ ← Bottom button
└─────────────────────────────────────┘
```

**Specific Details**:
- Header: "🎒 Inventory" (20px bold) with close button (✕) at right
- Currency bar: Gold + Souls display, centered
- Filter tabs: 4 tabs (All, Weapons, Armor, Items)
  - Active tab: Underline indicator, brighter text
  - 14px text
- Item cards: Scrollable list
  - Icon (24px) + Name (14px bold, rarity colored)
  - Type/rarity (10px, 60% opacity)
  - Stats/description (12px)
  - Right side: "EQUIPPED" label or action button
  - Equipped items: Golden glow effect
- Empty state: Gray placeholder cards with dashed borders
- Close button: Full-width secondary button

---

### **SCREEN 11: Soul Forge (Permanent Upgrades)**
**Purpose**: Spend Hero Souls on permanent account-wide upgrades

**Layout Structure**:
```
┌─────────────────────────────────────┐
│       👻 Soul Forge [✕]             │
│                                     │
│  ┌─────────────────────────────┐   │
│  │   Hero Souls: 15 👻          │   │ ← Currency display
│  └─────────────────────────────┘   │
│                                     │
│  Permanent upgrades for all heroes  │ ← Description
│                                     │
│ ┌─── General Upgrades ───┐         │
│ │                         │         │
│ │ 💪 Vitality             │ OWNED   │ ← Purchased upgrade
│ │ +20% Max HP             │         │
│ │ Cost: 5 Souls           │         │
│ │                         │         │
│ ├─────────────────────────┤         │
│ │ 💰 Fortune              │ [Buy]   │ ← Available upgrade
│ │ +50% Starting Gold      │ 10💎    │
│ │ Cost: 10 Souls          │         │
│ │                         │         │
│ ├─────────────────────────┤         │
│ │ 🧠 Wisdom               │ [Need   │ ← Locked upgrade
│ │ +25% XP Gain            │  25💎]  │
│ │ Cost: 25 Souls          │         │
│ └─────────────────────────┘         │
│                                     │
│ ┌─── Warrior Upgrades ───┐         │
│ │ 🛡️ Shield Mastery       │ OWNED   │
│ │ Enhanced Shield Bash    │         │
│ └─────────────────────────┘         │
│                                     │
│        [Close Forge]                │
└─────────────────────────────────────┘
```

**Specific Details**:
- Title: "👻 Soul Forge" (20px bold, epic purple)
- Currency: Large display showing available Hero Souls
- Description: Small gray text explaining purpose
- Upgrade sections: Grouped by category (General, Warrior, Sorceress, Rogue)
- Each upgrade card:
  - Icon (20px) + Name (16px bold)
  - Description (12px regular)
  - Cost (14px with soul icon)
  - Right side: Status or button
    - "OWNED" (gray text) if purchased
    - "Buy" button (green) if affordable
    - "Need X 💎" (red) if can't afford
- Hover state: Card highlights with golden border
- Scrollable list for many upgrades

---

### **SCREEN 12: Analytics Dashboard**
**Purpose**: View gameplay statistics and charts

**Layout Structure**:
```
┌─────────────────────────────────────┐
│     📊 Analytics [✕]                │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Total Runs: 45              │   │ ← Summary stats
│  │ Victories: 28 (62%)         │   │
│  │ Highest Floor: 12           │   │
│  │ Total Souls: 234            │   │
│  └─────────────────────────────┘   │
│                                     │
│  [Overview] [Combat] [Progress]     │ ← Tabs
│     ▔▔▔▔▔▔▔▔                        │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  Floor Reached Distribution  │   │ ← Chart 1
│  │                             │   │
│  │  █░░░░░░░░░ Floor 1-3: 40%  │   │
│  │  ████░░░░░░ Floor 4-6: 35%  │   │
│  │  ██░░░░░░░░ Floor 7-9: 15%  │   │
│  │  █░░░░░░░░░ Floor 10+: 10%  │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  Character Usage             │   │ ← Chart 2
│  │                             │   │
│  │  Omar: ████████░░ 20 runs   │   │
│  │  Salma: ███████░░░ 15 runs  │   │
│  │  Shadi: █████░░░░░ 10 runs  │   │
│  └─────────────────────────────┘   │
│                                     │
│        [Export Data]                │ ← Action button
│        [Close]                      │
└─────────────────────────────────────┘
```

**Specific Details**:
- Title: "📊 Analytics" (20px bold)
- Summary card: Key stats in grid layout (16px bold numbers)
- Tabs: 3 sections (Overview, Combat, Progress)
- Charts: Bar charts using filled/empty blocks
  - Chart title (14px bold)
  - Bar labels (12px)
  - Percentage/count display
- Export button: Secondary button
- Close button: Primary button

---

## 🎯 **Prompt Templates for Each Screen**

### Usage Instructions:
Copy the template below and replace `[SCREEN_NAME]` with the desired screen.

```
Create a dark fantasy mobile RPG UI mockup for [SCREEN_NAME].

Art Style:
- Mobile game interface (9:16 portrait, 412x915px)
- Dark fantasy dungeon crawler aesthetic (similar to Hades, Slay the Spire)
- Color palette: Dark brown/black gradients with golden amber accents (#d4a656)
- Modern, clean UI with semi-transparent cards and glowing borders

Visual Requirements:
- Background: Radial gradient from dark brown (#1a0f0a) to black (#000000)
- Primary color: Golden amber (#d4a656) for titles, borders, highlights
- Text: Light cream (#f8e4c0) for all readable text
- Cards: Semi-transparent dark brown with 2px golden borders, 8px rounded corners
- Buttons: Golden background with dark text for primary, brown for secondary
- Icons: Use clear, recognizable emojis at specified sizes

[PASTE SPECIFIC SCREEN LAYOUT FROM ABOVE]

Technical Notes:
- Ensure high contrast for mobile readability
- Clear visual hierarchy with proper spacing
- Professional game UI quality
- All text should be crisp and legible
- Buttons should have clear hover/active states indicated
```

---

## 📸 **Individual Screen Prompts**

### For DALL-E, Midjourney, etc:

**Main Menu:**
```
Create a dark fantasy mobile RPG main menu UI mockup. 9:16 portrait format. Dark brown to black radial gradient background. Title "Path of Heroes" in large glowing golden text (48px) at top center. Subtitle "Choose Your Hero" in cream text below. 4 vertically stacked buttons with golden borders and dark brown fill: "Play Game", "Soul Forge", "Options", "Credits". Small language toggle button (🌍) in top-right. Small debug/analytics icons in bottom-right corner. Professional mobile game UI quality, similar to Hades or Slay the Spire. High contrast, clean design.
```

**Character Selection:**
```
Create a dark fantasy mobile RPG character selection screen. 9:16 portrait. Title "Choose Your Champion" in golden text. 3 vertically stacked character cards, each with semi-transparent dark background and golden border. Each card shows: character emoji icon (48px), name (Omar/Salma/Shadi), role, base stats (HP, ATK, DEF with icons), and trait badge. Middle card has glowing golden border indicating selection. Back button at bottom. Professional mobile game UI, dark brown/black gradient background.
```

**Battle Screen:**
```
Create a dark fantasy mobile RPG turn-based battle interface. 9:16 portrait. Title "⚔️ BATTLE ⚔️" with wave indicator. Focused enemy card at top: enemy emoji (30px), name, HP bar (red gradient), stats row (attack, defense, speed, crit), status effect badges. Below: compact list of other enemies. Player card in center: player emoji, name, HP bar, resource bar (vigor/mana), stats, buffs. XP bar and ultimate gauge below. Bottom section: 4-column action buttons grid (Attack, Defend, Skill, Flee) with large emoji icons. Potions row with quantities. Combat feedback message area. Professional mobile game UI, dark gradient background.
```

**Shop Screen:**
```
Create a dark fantasy mobile RPG shop interface. 9:16 portrait. Title "🏪 Merchant's Shop" in golden text. Gold display box showing current gold amount. Warning text "You may only make one purchase". 3 vertically stacked item cards, each showing: item emoji icon (24px), name colored by rarity (Sharp Sword, Sturdy Shield, Mana Crystal), rarity label (Rare/Epic/Legendary), stat bonuses with icons, price button on right (250G/400G/600G). Leave Shop button at bottom. Dark brown/black background, semi-transparent cards with golden borders.
```

**Victory Screen:**
```
Create a dark fantasy mobile RPG victory modal. Centered card on semi-transparent black backdrop. Title "🎉 VICTORY! 🎉" in large green text. Flavor text box with green gradient border and italic text "Your blade strikes true, victory is yours!". Results section showing: "Gold Acquired: +150 💰", "Experience Gained: +80 ✨", "Hero Souls Earned: 👻 3". Large "Continue" button at bottom. Professional mobile game UI, max-width 400px card.
```

---

## 💡 **Tips for Best Results**

1. **Be Specific**: Always include "9:16 portrait mobile game UI" in prompt
2. **Reference Games**: Mention "similar to Hades, Slay the Spire, Dead Cells"
3. **Color Codes**: Include hex codes for exact colors (#d4a656, #1a0f0a)
4. **Size References**: Specify "48px emoji icon" or "24px bold golden title"
5. **Professional Quality**: Request "professional mobile game UI quality"
6. **Iterate**: Generate 3-4 variations and pick the best elements from each

---

## 🔄 **Iterative Refinement**

After generating initial mockups:

1. **Identify Issues**: Note any inconsistencies or unclear elements
2. **Refine Prompt**: Add specific corrections like "make buttons larger" or "increase contrast"
3. **Combine Best Elements**: Use image editing to merge best parts of multiple generations
4. **Annotate Screenshots**: Mark exact pixel sizes, spacing, colors on final mockups
5. **Provide to Developer**: Share annotated images with specifications

---

## 📋 **Checklist for Complete Design**

- [ ] Main Menu mockup generated
- [ ] Character Selection mockup generated
- [ ] Save Slot Selection mockup generated
- [ ] Exploration/Dungeon Grid mockup generated
- [ ] Battle Screen mockup generated
- [ ] Buff Selection mockup generated
- [ ] Shop Screen mockup generated
- [ ] Victory/Defeat mockups generated
- [ ] Event Interim mockup generated
- [ ] Inventory mockup generated
- [ ] Soul Forge mockup generated
- [ ] Analytics mockup generated

Once complete, compile all mockups with annotations and share with development team for implementation.
