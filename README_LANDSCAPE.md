# 🌄 Landscape Experiment - Quick Start

## 🎯 What Is This?

**Parallel experiment** to test **landscape orientation (16:9)** vs current **portrait (9:16)**.

### Current Status
- ✅ Branch created: `landscape-experiment`
- ✅ Main backed up: `v1.0-portrait-stable` (tag)
- ✅ Design system updated for landscape
- ⏳ Screens: Ready to migrate

---

## 🔀 Switching Between Versions

### View Portrait Version (Stable)
```bash
git checkout main
npm run dev
```

### View Landscape Experiment
```bash
git checkout landscape-experiment
npm run dev
```

---

## 📂 Branch Structure

```
main (portrait)
├── v1.0-portrait-stable (tag) ← Backup point
├── design-system-foundation (tag) ← 4/12 screens migrated
│
landscape-experiment (experimental)
├── Based on: v1.0-portrait-stable
├── Purpose: Test landscape orientation
└── Status: Foundation complete, screens pending
```

---

## 📐 Key Differences

| Feature | Portrait (main) | Landscape (experiment) |
|---------|----------------|------------------------|
| **Aspect Ratio** | 9:16 (360x640 to 412x915) | 16:9 (640x360 to 915x412) |
| **Battle Layout** | Vertical stack | Side-by-side split |
| **Dungeon Grid** | 5x9 (taller) | 9x5 (wider) |
| **Shop Items** | 3 items vertical | 6+ items in grid |
| **Stats Display** | Top bar | Right sidebar |
| **Orientation** | Mobile-first | Game console-style |

---

## 📋 What's Been Done

### ✅ Completed
1. **Branch Setup**
   - Created `landscape-experiment` branch
   - Tagged backup: `v1.0-portrait-stable`
   - Pushed to remote

2. **Documentation**
   - `LANDSCAPE_EXPERIMENT.md` - Full specification
   - `README_LANDSCAPE.md` - This file
   - Screen redesigns documented

3. **Design System**
   - Added landscape layout tokens
   - Created split-screen components:
     - `LandscapeSplit` - Full split wrapper
     - `LandscapeHalf` - 50/50 panels
     - `LandscapeSidebar` - Stats panel
     - `LandscapeMain` - Content area
   - Extended grids: cols4, cols5, cols6

### ⏳ Pending
1. **Screen Migrations** (0/12)
   - Battle (proof of concept)
   - Exploration
   - Shop
   - Inventory
   - All others

2. **CSS Updates**
   - Force landscape orientation
   - Media queries
   - Responsive breakpoints

3. **Testing**
   - Gameplay feel
   - Usability
   - Visual polish

---

## 🚀 Next Steps

### Immediate (Current Session)
- [x] Create branch and backup
- [x] Update design system
- [x] Document changes
- [ ] Migrate battle screen (proof of concept)

### Short Term
- [ ] Test battle screen gameplay
- [ ] Migrate 2-3 more screens
- [ ] Generate landscape mockups with AI
- [ ] Gather user feedback

### Decision Point
- Compare portrait vs landscape
- Decide which to keep
- Merge winner to main or archive experiment

---

## 📖 Key Documents

| File | Purpose |
|------|---------|
| `LANDSCAPE_EXPERIMENT.md` | Full specification and redesigns |
| `README_LANDSCAPE.md` | This quick start guide |
| `DESIGN_SYSTEM.md` | Design system documentation |
| `AI_DESIGN_PROMPT.md` | Generate mockups (update for landscape) |
| `MIGRATION_STATUS.md` | Track screen migrations |

---

## 🎨 New Components Available

### Landscape Layouts
```jsx
import {
  LandscapeSplit,
  LandscapeHalf,
  LandscapeSidebar,
  LandscapeMain
} from '../design-system/components';

// Example: Battle screen split
<LandscapeSplit>
  <LandscapeHalf>
    {/* Enemy side */}
  </LandscapeHalf>
  <LandscapeHalf>
    {/* Player side */}
  </LandscapeHalf>
</LandscapeSplit>
```

### Extended Grids
```jsx
import { FourColumnGrid, FiveColumnGrid } from '../design-system/components';

// Example: Shop items
<FourColumnGrid>
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
  <Card>Item 4</Card>
</FourColumnGrid>
```

---

## ⚠️ Important Notes

### Don't Merge Yet!
This is an **experiment**. Keep both versions until we decide which is better.

### Sync Carefully
If you make changes on `main` that you want in `landscape-experiment`:
```bash
git checkout landscape-experiment
git merge main
# Resolve conflicts (landscape takes priority)
```

### Backup
Portrait version is safe at tag: `v1.0-portrait-stable`
```bash
# To restore portrait version if needed:
git checkout main
git reset --hard v1.0-portrait-stable
```

---

## 🎯 Success Criteria

Landscape wins if:
- ✅ Battle feels more immersive
- ✅ Dungeon navigation is easier
- ✅ Shop/Inventory browsing improves
- ✅ No awkward empty space
- ✅ Comfortable gameplay on devices

Portrait wins if:
- ✅ One-handed play is important
- ✅ Mobile-first is priority
- ✅ Landscape feels cramped
- ✅ Portrait design is already good

---

## 🔧 Development Workflow

### Current Branch
```bash
git branch
# * landscape-experiment
```

### Make Changes
```bash
# Edit files
# Test locally
git add .
git commit -m "feat: migrate battle screen to landscape"
git push
```

### Switch to Compare
```bash
# View portrait version
git checkout main
npm run dev

# Back to landscape
git checkout landscape-experiment
npm run dev
```

---

## 📊 Progress Tracking

Check `LANDSCAPE_EXPERIMENT.md` for:
- [ ] Phase 1: Core layout changes
- [ ] Phase 2: Screen migrations (0/12)
- [ ] Phase 3: Testing
- [ ] Phase 4: Polish & decision

---

## 💡 Tips

1. **Test Both**: Switch between branches to compare
2. **Document Feedback**: Note what feels better/worse
3. **Iterate**: Don't expect perfect on first try
4. **Ask Users**: Get feedback from others
5. **Be Open**: Either orientation might win

---

## 🆘 Troubleshooting

**Problem**: Can't switch branches
```bash
# Commit or stash changes first
git stash
git checkout main
git stash pop
```

**Problem**: Merge conflicts
```bash
# Landscape changes should generally take priority
# Keep landscape-specific layouts, accept shared bugfixes
```

**Problem**: Lost portrait version
```bash
# Restore from tag
git checkout v1.0-portrait-stable
git checkout -b main-restored
```

---

*Experiment Started: 2025-01-XX*
*Current Branch: landscape-experiment*
*Portrait Backup: v1.0-portrait-stable*

**Remember**: This is an experiment! Keep both versions until you're certain which is better. 🎮
