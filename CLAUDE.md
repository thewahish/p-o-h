# Path of Heroes - RPG Dungeon Crawler

<!-- Inherits from MASTER_CLAUDE.md and game-development.md -->

## 🎯 Project Overview
**Type**: Game Development
**Status**: Active Development
**Domain Module**: `modules/domains/game-development.md`

Mobile-first React roguelike dungeon crawler built with Vite and TailwindCSS. Features turn-based combat, procedural dungeon generation, character progression, and comprehensive localization system.

## 📋 Project-Specific Overrides

### Agent Pipeline Customization
```
Recommended Pipeline: 0 → 2 → 4 → 6 → 7 → 8 → 11
Complexity Level: Complex
Quality Gates: Game Balance, Performance (60fps), Save System Integrity, Localization
```

### Game Development Enhancements
- **Turn-Based Combat**: Complex damage formulas and status effects
- **Procedural Generation**: 5x9 maze dungeons with strategic room placement
- **Character Progression**: Individual save systems with balanced XP curves
- **Bilingual Support**: Complete Arabic/English localization with RTL support
- **Mobile Optimization**: Portrait orientation, touch-friendly interface

## 🔧 Technical Configuration

### Technology Stack
- **Framework**: React 18 with Vite 7
- **Styling**: TailwindCSS 3.4.17
- **Build Tools**: Vite, PostCSS, Autoprefixer
- **Deployment**: GitHub Pages
- **Testing**: Manual playtesting, balance simulation scripts

### Development Commands
```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to GitHub Pages
npm run deploy
```

### Repository Information
- **GitHub URL**: [To be created in sync phase]
- **Deployment URL**: [GitHub Pages URL when created]
- **Documentation**: README.md + comprehensive CLAUDE.md

## 🎯 Project-Specific Quality Gates

### Must-Have Checks
- [ ] Frame rate maintains 60fps on mobile devices
- [ ] Save/load system works across all 3 character save slots
- [ ] Game balance validated through automated simulation
- [ ] Arabic/English localization complete and functional
- [ ] Touch interface responsive on 320px+ screens
- [ ] Combat formulas produce expected win rates (60% player advantage)
- [ ] Dungeon generation creates solvable mazes consistently

### Performance Targets
- **Frame Rate**: Stable 60fps
- **Save Operations**: < 1 second
- **Scene Transitions**: < 3 seconds
- **Memory Usage**: < 100MB
- **Bundle Size**: Optimized for mobile loading

## 📂 File Structure Notes

### Important Files
- **src/core/state.js**: Global game state management with subscription model
- **src/systems/**: Core game systems (combat, dungeon, inventory, etc.)
- **src/constants/**: Game configuration, characters, enemies, localization
- **public/locales/**: Arabic and English translation files (user-editable)
- **src/components/**: React UI components for all game screens

### Special Considerations
- **State Management**: Single singleton object with subscription model for React integration
- **Save System**: Character-specific saves with 3 slots per character in localStorage
- **Localization**: External JSON files allow non-developer translation updates
- **Balance Testing**: Automated simulation scripts for combat and progression validation

## 🔒 Project-Specific Safety Protocols

### Critical Rules
- **Game Balance**: Never adjust balance without running simulation tests
- **Save Integrity**: All save operations must be tested across character transitions
- **Performance**: Combat animations must not drop below 55fps on mobile
- **Localization**: Both languages must be functionally complete before release

### Never Do
- ❌ Modify character stats without updating balance simulation
- ❌ Change save format without migration system
- ❌ Add features that break mobile portrait orientation
- ❌ Use English-only text anywhere in the interface

### Always Do
- ✅ Run balance simulation after any combat system changes
- ✅ Test save/load functionality after state management updates
- ✅ Verify both Arabic and English interfaces after UI changes
- ✅ Performance test on actual mobile devices

## 🎮 Game-Specific Guidelines

### Balance Philosophy
- **Player Advantage**: Target 60% win rate against same-level enemies
- **Progression Curve**: 100 base XP + 120 increment per level to prevent rapid early leveling
- **Resource Management**: Balanced costs encourage strategic ability usage
- **Difficulty Scaling**: 20% base + 5% exponential per floor

### Combat System
- **Damage Formula**: `(ATK² / (ATK + DEF))` for balanced scaling
- **Turn Order**: Speed (SPD) stat determines initiative
- **Status Effects**: Poison, defend stance, buffs system
- **Multi-Enemy**: 30% base chance + 10% per floor (max 60%)

### Localization Requirements
- **Complete Coverage**: All UI text, character names, skills, and system messages
- **RTL Support**: Proper Arabic text direction and layout
- **Cultural Sensitivity**: Appropriate character names and themes for both cultures
- **External Editing**: JSON files allow translators to work without code access

## 📊 Success Metrics

### Primary Goals
1. **Engaging Gameplay**: Average session > 10 minutes
2. **Balanced Progression**: Playtesting validates difficulty curve
3. **Cultural Accessibility**: Both language communities can fully enjoy the game

### Measurement Methods
- **Retention**: Day 7 retention tracking through local analytics
- **Balance Validation**: Automated simulation confirms 60% win rates
- **Performance**: Frame rate monitoring during extended play sessions
- **Localization**: User feedback from both language communities

## 🔄 Maintenance Notes

### Regular Updates Needed
- **Balance Tuning**: Monthly review of progression metrics and player feedback
- **Localization Updates**: Add new content in both languages simultaneously
- **Performance Optimization**: Monitor and optimize for new mobile devices

### Known Issues
- **Memory Growth**: Extended play sessions may show memory increase
- **Arabic Font Loading**: Initial load may show brief font swap
- **Save Migration**: No migration system for save format changes

## 📞 Stakeholder Information

### Primary Contacts
- **Game Designer**: Claude Code - Balance, mechanics, progression
- **Localization**: Community contributors for Arabic/English
- **Technical**: React/Vite development stack

### Approval Process
1. **Balance Testing**: Automated simulation validates changes
2. **Localization Review**: Both languages functionally tested
3. **Performance Validation**: Mobile testing confirms smooth operation

---

## 🔗 Inheritance Chain

```
MASTER_CLAUDE.md (Universal orchestrator)
    ↓
modules/domains/game-development.md (Game-specific patterns)
    ↓
p-o-h/CLAUDE.md (Project-specific overrides)
```

### From Master System
- 12-Agent Framework with complex game development pipeline
- TodoWrite workflow for multi-step feature development
- Quality gates ensuring performance and stability
- Git management for version control and deployment

### From Game Development Module
- Game loop architecture with 60fps targeting
- Save system patterns with version compatibility
- Balance testing frameworks and automation
- Performance monitoring and optimization strategies

### Project Overrides
- Turn-based combat with specific damage formulas
- Character-specific save system with 3 slots per character
- Bilingual localization with external JSON management
- Mobile-first design with portrait orientation requirement
- Procedural dungeon generation with 5x9 grid constraints

---

*Last Updated: October 2024*
*Version: 38.2 (Combat Rebalance)*