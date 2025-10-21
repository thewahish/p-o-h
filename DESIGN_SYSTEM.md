# Path of Heroes - Design System

## Overview
This document defines the unified design system for consistent UI/UX across all screens.

---

## 🎨 Design Tokens

### Typography Scale
```
Screen Titles:     text-2xl (24px)  - Main screen headers
Section Headers:   text-lg (18px)   - Section dividers
Card Titles:       text-base (16px) - Cards, items, enemies
Body Text:         text-sm (14px)   - Main content
Small Text:        text-xs (12px)   - Labels, hints
Tiny Text:         text-[10px]      - Stats, metadata
```

### Spacing Scale
```
Screen Padding:    p-3 (12px)       - Outer screen padding
Section Gap:       space-y-3 (12px) - Between sections
Card Padding:      p-3 (12px)       - Inner card padding
Item Gap:          space-y-2 (8px)  - Between list items
Tight Spacing:     space-y-1 (4px)  - Compact layouts
```

### Icon Sizes
```
Large Icons:       text-5xl (48px)  - Feature cards, buff selection
Medium Icons:      text-3xl (30px)  - Enemy/player avatars in battle
Small Icons:       text-xl (20px)   - UI icons, buttons
Tiny Icons:        text-base (16px) - Inline icons, stats
```

### Button Sizes
```
Primary:    px-6 py-2 text-base  - Main actions (Continue, Confirm)
Secondary:  px-4 py-2 text-sm    - Secondary actions (Skip, Back)
Small:      px-3 py-1 text-xs    - Tertiary actions (Close, Info)
```

### Stat Bars
```
Height:     h-2 (8px)            - All health, mana, XP bars
Padding:    mb-1 (4px)           - Space below bars
Text:       text-xs (12px)       - Bar labels and numbers
```

---

## 📱 Layout Patterns

### Screen Container
All full-screen views should use:
```jsx
<ScreenContainer>
  <ScreenContent>
    {/* Your content */}
  </ScreenContent>
</ScreenContainer>
```
- Uses: `min-h-screen max-h-screen` for responsive height
- Auto-scrolls when content exceeds viewport
- Consistent padding across all screens

### Modal/Popup
All overlays should use:
```jsx
<Modal>
  <ModalContent>
    {/* Your content */}
  </ModalContent>
</Modal>
```
- Uses: `max-h-[95vh]` to prevent overflow
- Centered with backdrop blur
- Consistent border and shadow

---

## 🧩 Component Library

### Buttons
```jsx
import { PrimaryButton, SecondaryButton, SmallButton } from './design-system/components';

<PrimaryButton onClick={handleClick}>Continue</PrimaryButton>
<SecondaryButton onClick={handleSkip}>Skip</SecondaryButton>
<SmallButton onClick={handleClose}>✕</SmallButton>
```

### Typography
```jsx
import { ScreenTitle, SectionHeader, CardTitle, BodyText, SmallText } from './design-system/components';

<ScreenTitle>⚔️ Battle ⚔️</ScreenTitle>
<SectionHeader>Enemies</SectionHeader>
<CardTitle>Elite Goblin</CardTitle>
<BodyText>You have defeated all enemies.</BodyText>
<SmallText>Click to continue...</SmallText>
```

### Cards
```jsx
import { Card } from './design-system/components';

<Card highlighted={isSelected}>
  {/* Card content */}
</Card>
```

### Stats
```jsx
import { StatBar, StatDisplay } from './design-system/components';

<StatBar current={hp} max={maxHp} color="bg-health-full" label="HP" />
<StatDisplay icon="⚔️" value={attack} label="ATK" />
```

### Icons
```jsx
import { LargeIcon, MediumIcon, SmallIcon } from './design-system/components';

<LargeIcon>🎁</LargeIcon>     {/* 48px - Treasure, rewards */}
<MediumIcon>👹</MediumIcon>   {/* 30px - Enemies, avatars */}
<SmallIcon>⚔️</SmallIcon>     {/* 20px - UI elements */}
```

### Grids
```jsx
import { TwoColumnGrid, ThreeColumnGrid } from './design-system/components';

<ThreeColumnGrid>
  <Card>Buff 1</Card>
  <Card>Buff 2</Card>
  <Card>Buff 3</Card>
</ThreeColumnGrid>
```

---

## 🎯 Screen Patterns

### Battle Screen
- Enemy cards: Medium icons (text-3xl), text-base names, text-xs stats
- Player card: Medium icon (text-3xl), text-base name, text-xs stats
- Buttons: Primary size (px-6 py-2 text-base)
- Stat bars: h-2 height consistently

### Shop Screen
- Item cards: Large icons (text-5xl), text-base names, text-xs descriptions
- Price buttons: Secondary size (px-4 py-2 text-sm)
- Gold display: text-base bold

### Buff Selection
- Buff cards: Large icons (text-5xl), text-base names, text-xs descriptions
- Selection buttons: Primary size at bottom

### Outcome Screen
- Title: text-2xl
- Body text: text-base
- Stats: text-sm
- Button: Primary size

---

## 📐 Consistency Rules

### ✅ DO:
- Use design system components for all new UI
- Follow the typography scale exactly
- Use consistent icon sizes per context
- Apply standard spacing (p-3, space-y-3, gap-3)
- Use stat bars at h-2 height everywhere

### ❌ DON'T:
- Mix button sizes on the same screen
- Use custom text sizes outside the scale
- Create one-off padding/margin values
- Hardcode colors (use Tailwind classes)
- Make icons different sizes in same context

---

## 🔧 Usage Guide

### Step 1: Import Components
```jsx
import {
  ScreenContainer,
  ScreenContent,
  ScreenTitle,
  PrimaryButton,
  Card,
  StatBar
} from '../design-system/components';
```

### Step 2: Build with Consistency
```jsx
export default function MyScreen() {
  return (
    <ScreenContainer>
      <ScreenContent>
        <ScreenTitle>My Screen</ScreenTitle>

        <Card>
          <StatBar current={50} max={100} label="HP" />
        </Card>

        <PrimaryButton onClick={handleContinue}>
          Continue
        </PrimaryButton>
      </ScreenContent>
    </ScreenContainer>
  );
}
```

---

## 🎨 Customization

To modify the design system:

1. **Update tokens**: Edit `/src/design-system/tokens.js`
2. **Add components**: Add to `/src/design-system/components.jsx`
3. **Update this guide**: Document changes here

All changes propagate automatically to all screens using the system.

---

## 📋 Migration Checklist

To migrate existing screens to the design system:

- [ ] Battle Screen
- [ ] Buff Selection Screen
- [ ] Shop Screen
- [ ] Outcome Screen
- [ ] Event Interim Screen
- [ ] Inventory Screen
- [ ] Save Slots Screen
- [ ] Main Menu
- [ ] Exploration Screen
- [ ] Analytics Dashboard
- [ ] Soul Forge

---

## 🚀 Benefits

✅ **Consistency**: All screens look and feel unified
✅ **Maintainability**: Change once, update everywhere
✅ **Speed**: Build new screens faster with pre-made components
✅ **Quality**: Enforced best practices and accessibility
✅ **Documentation**: Clear reference for all developers
