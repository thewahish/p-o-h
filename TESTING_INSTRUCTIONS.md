# 🧪 Phase 2 Testing - Quick Start Guide

## ⚡ Quick Test (5 minutes)

### 1. Start Development Server
```bash
cd /Volumes/Raid/Claude/p-o-h-clone
npm run dev
```

### 2. Open Browser
Navigate to: `http://localhost:5173`

### 3. Basic Functionality Test
- ✅ Select any character
- ✅ Start new game (slot 1)
- ✅ Play 2-3 battles
- ✅ Visit a shop
- ✅ Complete floor (defeat boss)
- ✅ Watch for save indicator (💾 "Game Saved!")

**Expected**: No errors, smooth gameplay, save indicator appears

---

## 🎯 Critical Tests to Perform

### Test 1: Auto-Save System (2 min)
**Goal**: Verify saves trigger correctly

1. Play until boss defeated
2. **Expected**: Save indicator appears
3. Take stairs to next floor
4. **Expected**: Save indicator appears again
5. Open browser DevTools → Application → Local Storage
6. **Expected**: See updated save data

**Pass Criteria**: ✅ Save indicator shows, localStorage updated

---

### Test 2: Character-Specific Encounters (5 min)
**Goal**: Verify each character sees preferred enemies

**Warrior Test**:
1. New game as Taha (Warrior)
2. Play 5+ battles
3. Note enemies encountered
4. **Expected**: More Goblins, Orcs, Skeletons (physical/brute types)

**Sorceress Test**:
1. New game as Mais (Sorceress)
2. Play 5+ battles
3. Note enemies encountered
4. **Expected**: More Slimes, Wraiths, Cultists (magical/undead types)

**Rogue Test**:
1. New game as Ibrahim (Rogue)
2. Play 5+ battles
3. Note enemies encountered
4. **Expected**: More Goblins, Ghouls, Imps (fast types)

**Pass Criteria**: ✅ ~60%+ battles feature character-preferred enemies

---

### Test 3: Character-Specific Loot (3 min)
**Goal**: Verify shop offers character-appropriate items

1. Play as Warrior, visit 3 shops
   - **Expected**: More Heavy Armor, Shields
2. Play as Sorceress, visit 3 shops
   - **Expected**: More Staves, Mana Crystals
3. Play as Rogue, visit 3 shops
   - **Expected**: More Daggers, Poison Vials

**Pass Criteria**: ✅ ~40%+ shop items match character type

---

### Test 4: Security - Debug Hotkeys (2 min)
**Goal**: Verify debug features disabled in production

**Development Mode** (current):
```bash
# Already running npm run dev
```
1. Press `0` → God mode activates ✅
2. Press `2` → +100 gold ✅
3. Press `3` → Level up ✅

**Production Mode**:
```bash
# Stop dev server (Ctrl+C)
npm run build
npm run preview
```
1. Press `0` → Nothing happens ✅
2. Press `2` → Nothing happens ✅
3. Press `3` → Nothing happens ✅

**Pass Criteria**: ✅ Hotkeys work in dev, disabled in production

---

### Test 5: Security - XSS Fix (1 min)
**Goal**: Verify shop errors display safely

1. Visit shop with only 5 gold
2. Try to buy expensive item (30+ gold)
3. **Expected**: Red button shows "Not enough gold!"
4. Open DevTools → Elements
5. Inspect error message
6. **Expected**: No `<script>` tags, text displayed safely

**Pass Criteria**: ✅ Error displays as text, no script execution

---

## 🏁 Full Test Results

After completing tests, check:
- [ ] No console errors
- [ ] Save system works (indicator appears)
- [ ] Character encounters feel unique
- [ ] Shop items match character
- [ ] Debug hotkeys restricted
- [ ] XSS vulnerability fixed

---

## 📊 Automated Verification

✅ **Build Status**: PASSED (756ms)
✅ **Syntax Check**: All files valid
✅ **Dependencies**: 0 vulnerabilities
✅ **Integration**: 7 points verified
✅ **Type Coverage**: 100% (11/11 enemies)

---

## 🚀 If All Tests Pass

Proceed to Phase 3:
- Buff System Integration
- Potion System Integration
- Enhanced Combat UI

---

## 🐛 If Issues Found

1. Document the issue
2. Check console for errors
3. Review TEST_REPORT.md for details
4. Report findings

---

**Ready to Test?** 🎮

Run: `npm run dev` and follow the tests above!
