# 🌄 Landscape Experiment - Parallel Branch

## 📋 Overview

This is an experimental branch to redesign **Path of Heroes** for **landscape orientation (16:9)** instead of portrait (9:16).

### Branch Structure
- **Main Branch**: `main` - Portrait version (stable)
  - Tagged: `v1.0-portrait-stable`
  - Tagged: `design-system-foundation`
- **Experiment Branch**: `landscape-experiment` - Landscape version (testing)

### Rationale
- Test if landscape provides better gameplay experience
- Utilize horizontal space for side-by-side layouts
- Compare both orientations before final decision
- Keep portrait version as fallback

---

## 🎯 Landscape Design Goals

### Layout Advantages
- **Battle Screen**: Enemy on left, Player on right (side-by-side)
- **Exploration**: Dungeon grid with stats panel on side
- **Shop/Inventory**: Item grid with details sidebar
- **Buff Selection**: Horizontal card layout
- **Main Menu**: Horizontal button layout with artwork

### Screen Real Estate
- **Portrait (9:16)**: 360x640 to 412x915 pixels
- **Landscape (16:9)**: 640x360 to 915x412 pixels

**Benefit**: 2.5x more horizontal space for side panels

---

## 🔄 Changes Required

### 1. Design System Updates

#### Typography (unchanged)
```
Screen Titles:    24px (text-2xl)
Section Headers:  18px (text-lg)
Card Titles:      16px (text-base)
Body Text:        14px (text-sm)
Small Text:       12px (text-xs)
```

#### Layout Patterns (NEW)
```
Before (Portrait):
- Vertical stacking
- Single column layouts
- Max-width: 600px

After (Landscape):
- Horizontal split layouts
- Two/three column grids
- Max-width: 1200px
- Use flexbox row instead of column
```

#### Grid Layouts
```
Portrait:
- 1 column (mobile)
- 2-3 columns (large screens)

Landscape:
- 2-3 columns default
- 4-5 columns (large screens)
```

---

## 📐 Screen-by-Screen Redesign

### **Battle Screen** (Biggest Change)

**Portrait Layout:**
```
┌─────────────────┐
│     Header      │
│                 │
│    Enemy Card   │
│                 │
│   Player Card   │
│                 │
│  Action Buttons │
└─────────────────┘
```

**Landscape Layout:**
```
┌──────────────────────────────────────┐
│            Header                    │
├──────────────┬───────────────────────┤
│              │                       │
│ Enemy Card   │   Player Card         │
│ (Left 50%)   │   (Right 50%)         │
│              │                       │
│              │   Action Buttons      │
│              │   (Bottom Right)      │
└──────────────┴───────────────────────┘
```

**Benefits:**
- See both combatants simultaneously
- More immersive combat view
- Better tactical overview
- Larger character cards

---

### **Exploration Screen**

**Portrait Layout:**
```
┌─────────────────┐
│   Stats Bar     │
├─────────────────┤
│                 │
│  Dungeon Grid   │
│    (5x9)        │
│                 │
└─────────────────┘
```

**Landscape Layout:**
```
┌────────────────────┬──────────┐
│                    │  Stats   │
│  Dungeon Grid      │  Panel   │
│    (9x5)           │          │
│  Larger cells      │  HP/XP   │
│                    │  Gold    │
│                    │  Floor   │
│                    │          │
│                    │ Inventory│
└────────────────────┴──────────┘
```

**Benefits:**
- Grid rotated to 9x5 (wider)
- Permanent stats sidebar
- Larger, more visible dungeon cells
- No need for top stats bar

---

### **Shop Screen**

**Portrait Layout:**
```
┌─────────────────┐
│   Title/Gold    │
├─────────────────┤
│   Item 1        │
│   Item 2        │
│   Item 3        │
│                 │
│  Leave Button   │
└─────────────────┘
```

**Landscape Layout:**
```
┌──────────────────┬─────────────┐
│  Item 1   Item 2 │             │
│                  │  Selected   │
│  Item 3   Item 4 │  Item       │
│                  │  Details    │
│  Item 5   Item 6 │             │
│                  │  Purchase   │
│  (Grid)          │  Button     │
└──────────────────┴─────────────┘
```

**Benefits:**
- Show 6 items instead of 3
- Preview panel for selected item
- Better browsing experience

---

### **Inventory Screen**

**Portrait Layout:**
```
┌─────────────────┐
│  Filter Tabs    │
├─────────────────┤
│  Item List      │
│  (Vertical)     │
│                 │
│                 │
└─────────────────┘
```

**Landscape Layout:**
```
┌──────────────┬───────────────────┐
│  Filter      │                   │
│  Tabs        │   Item Grid       │
│              │   (3x4)           │
│  Categories  │                   │
│  - Weapons   │   ┌──┬──┬──┐     │
│  - Armor     │   │  │  │  │     │
│  - Items     │   └──┴──┴──┘     │
│              │                   │
│  Equipment   │   Details Panel   │
│  Slots       │   (Selected Item) │
└──────────────┴───────────────────┘
```

**Benefits:**
- Category sidebar
- Grid view for items
- Equipment slots visible
- Detail panel for selected item

---

### **Buff Selection**

**Portrait Layout:**
```
┌─────────────────┐
│     Title       │
├─────────────────┤
│   Buff 1        │
│                 │
│   Buff 2        │
│                 │
│   Buff 3        │
│                 │
│   Buttons       │
└─────────────────┘
```

**Landscape Layout:**
```
┌──────────────────────────────────┐
│            Title                 │
├──────────┬──────────┬──────────┬─┤
│          │          │          │ │
│  Buff 1  │  Buff 2  │  Buff 3  │ │
│          │          │          │ │
│          │          │          │ │
└──────────┴──────────┴──────────┴─┘
│        Skip         Confirm      │
└──────────────────────────────────┘
```

**Benefits:**
- All buffs visible at once
- Easier comparison
- Larger buff cards

---

## 🎨 Design System Adjustments

### New Layout Components

```javascript
// src/design-system/tokens.js additions

layout: {
    // Portrait (keep existing)
    screenContainer: 'min-h-screen max-h-screen flex flex-col overflow-y-auto',

    // NEW: Landscape layouts
    landscapeSplit: 'flex flex-row h-screen',
    landscapeLeft: 'w-1/2 flex flex-col',
    landscapeRight: 'w-1/2 flex flex-col',

    landscapeSidebar: 'w-1/4 flex flex-col',
    landscapeMain: 'w-3/4 flex flex-col',

    // Grid adjustments
    grid: {
        cols2: 'grid grid-cols-2 gap-3',
        cols3: 'grid grid-cols-3 gap-3',
        cols4: 'grid grid-cols-4 gap-3', // NEW
        cols5: 'grid grid-cols-5 gap-3', // NEW
    },
}
```

---

## 🔧 Implementation Steps

### Phase 1: Core Layout Changes
- [ ] Update CSS to force landscape orientation
- [ ] Add `@media (orientation: landscape)` styles
- [ ] Update design system with landscape layouts
- [ ] Create landscape-specific components

### Phase 2: Screen Migrations
- [ ] Battle Screen - Split layout
- [ ] Exploration Screen - Side panel
- [ ] Shop Screen - Grid + preview
- [ ] Inventory Screen - Sidebar + grid
- [ ] Buff Selection - Horizontal cards
- [ ] Main Menu - Horizontal layout
- [ ] Character Selection - Grid view
- [ ] Outcome Screen - Centered modal
- [ ] Event Interim - Full width
- [ ] Save Slots - Grid layout
- [ ] Soul Forge - Grid + sidebar
- [ ] Analytics - Dashboard layout

### Phase 3: Testing
- [ ] Test on 640x360 (smallest landscape)
- [ ] Test on 915x412 (Pixel 7 landscape)
- [ ] Test on 1280x720 (HD landscape)
- [ ] Ensure no scrolling on standard screens
- [ ] Test all interactive elements

### Phase 4: Polish
- [ ] Generate landscape mockups with AI
- [ ] Adjust spacing for horizontal layouts
- [ ] Optimize text sizes for wider screens
- [ ] Add landscape-specific backgrounds
- [ ] Test with real gameplay

---

## 📊 Comparison Matrix

| Aspect | Portrait (9:16) | Landscape (16:9) |
|--------|----------------|------------------|
| **Battle View** | Stacked (Enemy → Player) | Side-by-side |
| **Dungeon Grid** | 5x9 (taller) | 9x5 (wider) |
| **Item Display** | 3 items vertical | 6+ items grid |
| **Thumb Reach** | Easier one-handed | Requires two hands |
| **Immersion** | Mobile-friendly | Game-like |
| **Screen Usage** | 60% utilized | 85% utilized |

---

## 🎯 Success Criteria

Landscape experiment succeeds if:
- ✅ Battle feels more immersive
- ✅ Dungeon easier to navigate
- ✅ Inventory/Shop easier to browse
- ✅ No awkward empty space
- ✅ Comfortable to play on devices
- ✅ Matches game UX expectations

If criteria met: **Merge to main**
If not: **Keep portrait, archive experiment**

---

## 🔀 Branch Management

### Switching Between Versions

**To Portrait (stable):**
```bash
git checkout main
npm run dev
```

**To Landscape (experiment):**
```bash
git checkout landscape-experiment
npm run dev
```

### Syncing Changes
```bash
# On landscape-experiment branch
git fetch origin main
git merge origin/main

# Resolve conflicts if any
# Landscape-specific changes take priority
```

---

## 📁 Modified Files (Tracking)

### Design System
- [ ] `src/design-system/tokens.js` - Add landscape layouts
- [ ] `src/design-system/components.jsx` - Add split/sidebar components

### Documentation
- [x] `LANDSCAPE_EXPERIMENT.md` - This file
- [ ] `AI_DESIGN_PROMPT.md` - Update for landscape mockups
- [ ] `DESIGN_SYSTEM.md` - Add landscape patterns

### Screens (to modify)
- [ ] `src/components/battle-screen.jsx`
- [ ] `src/components/shop-screen.jsx`
- [ ] `src/components/buff-selection-screen.jsx`
- [ ] `src/components/inventory-screen.jsx`
- [ ] `src/components/outcome-screen.jsx`
- [ ] `src/components/event-interim-screen.jsx`
- [ ] `src/components/save-slot-screen.jsx`
- [ ] `src/App.jsx` (exploration, menu, character selection)

### CSS
- [ ] `src/index.css` - Force landscape orientation
- [ ] Add landscape media queries

---

## 💡 Key Design Principles

### 1. Utilize Horizontal Space
- Split layouts instead of stacking
- Sidebar panels for persistent info
- Grid views instead of lists

### 2. Maintain Readability
- Don't stretch text too wide
- Use columns to break up space
- Keep cards max-width reasonable

### 3. Comfortable Gameplay
- Important actions within thumb reach
- Consider two-handed grip
- Buttons at bottom corners

### 4. Visual Hierarchy
- Main content left/center
- Details/stats right sidebar
- Actions bottom right

---

## 🚀 Getting Started

1. **Current State**: On `landscape-experiment` branch
2. **Backup**: `main` branch tagged `v1.0-portrait-stable`
3. **Next Step**: Update design system for landscape
4. **Then**: Migrate battle screen as proof of concept
5. **Finally**: Decide which orientation to keep

---

*Experiment Started: 2025-01-XX*
*Branch: landscape-experiment*
*Base: v1.0-portrait-stable*
