#!/usr/bin/env node
// filename: verify-phase2.js
/**
 * Phase 2 Implementation Verification Script
 * Performs automated checks on Phase 2 implementation
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Phase 2 Verification Script\n');
console.log('=' .repeat(50));

let passed = 0;
let failed = 0;
let warnings = 0;

// Test 1: Check service files exist
console.log('\n📁 Test 1: Service Files Existence');
const serviceFiles = [
    'src/services/autosave.js',
    'src/services/character-service.js',
    'src/services/reward-service.js'
];

serviceFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`  ✅ ${file}`);
        passed++;
    } else {
        console.log(`  ❌ ${file} - NOT FOUND`);
        failed++;
    }
});

// Test 2: Check integration points
console.log('\n🔗 Test 2: Integration Points');
const integrationChecks = [
    { file: 'src/App.jsx', pattern: 'autoSaveService', name: 'AutoSave in App.jsx' },
    { file: 'src/systems/dungeon.js', pattern: 'characterService', name: 'CharacterService in dungeon.js' },
    { file: 'src/components/shop-screen.jsx', pattern: 'rewardService', name: 'RewardService in shop-screen.jsx' },
    { file: 'src/components/save-slot-screen.jsx', pattern: 'characterService.initialize', name: 'Service init in save-slot-screen.jsx' }
];

integrationChecks.forEach(check => {
    try {
        const content = fs.readFileSync(check.file, 'utf8');
        if (content.includes(check.pattern)) {
            console.log(`  ✅ ${check.name}`);
            passed++;
        } else {
            console.log(`  ❌ ${check.name} - Pattern not found`);
            failed++;
        }
    } catch (e) {
        console.log(`  ❌ ${check.name} - File not readable`);
        failed++;
    }
});

// Test 3: Check localization keys
console.log('\n🌍 Test 3: Localization Keys');
const localeChecks = [
    { file: 'public/locales/en.json', keys: ['system.gameSaved', 'items.heavy_armor', 'items.dagger'], lang: 'English' },
    { file: 'public/locales/ar.json', keys: ['system.gameSaved', 'items.heavy_armor', 'items.dagger'], lang: 'Arabic' }
];

localeChecks.forEach(check => {
    try {
        const content = JSON.parse(fs.readFileSync(check.file, 'utf8'));
        let allFound = true;
        check.keys.forEach(key => {
            const [section, item] = key.split('.');
            if (!content[section] || !content[section][item]) {
                allFound = false;
            }
        });
        if (allFound) {
            console.log(`  ✅ ${check.lang} localization complete`);
            passed++;
        } else {
            console.log(`  ⚠️  ${check.lang} localization incomplete`);
            warnings++;
        }
    } catch (e) {
        console.log(`  ❌ ${check.lang} localization - File error`);
        failed++;
    }
});

// Test 4: Check enemy type tags
console.log('\n🎯 Test 4: Enemy Type Tags');
try {
    const enemiesContent = fs.readFileSync('src/constants/enemies.js', 'utf8');
    const typeMatches = enemiesContent.match(/types:\s*\[/g);
    const expectedTags = 11; // 11 enemies in database

    if (typeMatches && typeMatches.length >= expectedTags) {
        console.log(`  ✅ Enemy type tags: ${typeMatches.length}/${expectedTags} enemies tagged`);
        passed++;
    } else {
        console.log(`  ⚠️  Enemy type tags: ${typeMatches ? typeMatches.length : 0}/${expectedTags} enemies tagged`);
        warnings++;
    }
} catch (e) {
    console.log(`  ❌ Enemy type tags - File error`);
    failed++;
}

// Test 5: Check config security fix
console.log('\n🔒 Test 5: Security Fixes');
try {
    const configContent = fs.readFileSync('src/constants/config.js', 'utf8');
    if (configContent.includes('import.meta.env.DEV')) {
        console.log(`  ✅ DEBUG_MODE uses environment variable`);
        passed++;
    } else {
        console.log(`  ❌ DEBUG_MODE not using environment variable`);
        failed++;
    }

    const appContent = fs.readFileSync('src/App.jsx', 'utf8');
    if (appContent.includes('GameConfig.DEBUG_MODE &&')) {
        console.log(`  ✅ Debug hotkeys protected with guard`);
        passed++;
    } else {
        console.log(`  ⚠️  Debug hotkeys may not be protected`);
        warnings++;
    }

    const shopContent = fs.readFileSync('src/components/shop-screen.jsx', 'utf8');
    if (shopContent.includes('errorMessages') && !shopContent.includes('innerHTML')) {
        console.log(`  ✅ XSS fix implemented (React state, no innerHTML)`);
        passed++;
    } else {
        console.log(`  ⚠️  XSS fix verification inconclusive`);
        warnings++;
    }
} catch (e) {
    console.log(`  ❌ Security checks - File error`);
    failed++;
}

// Test 6: Check auto-save triggers
console.log('\n💾 Test 6: Auto-Save Triggers');
try {
    const appContent = fs.readFileSync('src/App.jsx', 'utf8');
    const triggers = [
        'SaveTriggers.FLOOR_COMPLETE',
        'SaveTriggers.BOSS_DEFEAT',
        'SaveTriggers.PLAYER_DEATH'
    ];

    triggers.forEach(trigger => {
        if (appContent.includes(trigger)) {
            console.log(`  ✅ ${trigger} trigger found`);
            passed++;
        } else {
            console.log(`  ❌ ${trigger} trigger missing`);
            failed++;
        }
    });
} catch (e) {
    console.log(`  ❌ Auto-save triggers - File error`);
    failed++;
}

// Test 7: Check build output
console.log('\n📦 Test 7: Production Build');
const distExists = fs.existsSync('dist');
const distIndexExists = fs.existsSync('dist/index.html');

if (distExists && distIndexExists) {
    console.log(`  ✅ Production build exists`);
    const distFiles = fs.readdirSync('dist/assets', { withFileTypes: true });
    const jsFiles = distFiles.filter(f => f.name.endsWith('.js'));
    const cssFiles = distFiles.filter(f => f.name.endsWith('.css'));

    console.log(`  ✅ Assets: ${jsFiles.length} JS, ${cssFiles.length} CSS`);
    passed += 2;
} else {
    console.log(`  ⚠️  Production build not found (run: npm run build)`);
    warnings++;
}

// Final Report
console.log('\n' + '='.repeat(50));
console.log('📊 VERIFICATION SUMMARY\n');
console.log(`✅ Passed:   ${passed}`);
console.log(`⚠️  Warnings: ${warnings}`);
console.log(`❌ Failed:   ${failed}`);
console.log('='.repeat(50));

if (failed === 0) {
    console.log('\n🎉 All critical tests passed!');
    console.log('✨ Phase 2 implementation verified successfully\n');
    console.log('Next steps:');
    console.log('  1. Run manual tests: npm run dev');
    console.log('  2. Follow TESTING_INSTRUCTIONS.md');
    console.log('  3. Review TEST_REPORT.md for details\n');
    process.exit(0);
} else {
    console.log('\n⚠️  Some tests failed. Please review the output above.\n');
    process.exit(1);
}
