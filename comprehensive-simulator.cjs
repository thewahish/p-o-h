#!/usr/bin/env node
/**
 * COMPREHENSIVE Path of Heroes Simulator
 *
 * Master Instructions - Simulation Factors:
 *
 * 1. ACCURATE PROGRESSION SYSTEMS:
 *    - Correct Hero Souls earning (2 souls per floor, scaling slowly)
 *    - XP and leveling (60 + level*40 XP curve)
 *    - Growth rates per character (Warrior +6 HP/level, etc.)
 *    - Shop purchases (100g start, items cost 20-50g)
 *    - Item drops (30% chance, +1-5 ATK/DEF variance)
 *    - Shrine bonuses (20% chance, +2-5 stat boost)
 *    - Battle buffs (Hades-style, 3 random choices)
 *
 * 2. LUCK FACTORS (RNG Variance):
 *    - Enemy encounters (random from 3 types)
 *    - Item drops (30% chance, variable stats)
 *    - Shrine spawns (20% chance)
 *    - Critical hits (character-specific rates)
 *    - Shop spawns (appears at specific points)
 *    - Battle buff options (random pool)
 *
 * 3. TIME & ENGAGEMENT METRICS:
 *    - Battle time: 15-30 seconds per combat
 *    - Shop time: 10 seconds for decisions
 *    - Total run time: 2-5 minutes depending on progress
 *    - Session fatigue: Track repetitive deaths
 *    - Variety score: Track unique builds/strategies
 *
 * 4. BOREDOM PREVENTION:
 *    - Build diversity (buffs + items create unique runs)
 *    - Progress feeling (souls earned, floors cleared)
 *    - Skill expression (potion timing, buff choices)
 *    - Meta unlocks (new upgrades every 100 souls)
 *
 * 5. REWARD PSYCHOLOGY:
 *    - Small wins (each battle = gold + XP)
 *    - Medium wins (floor clear = souls)
 *    - Big wins (boss defeat = major souls)
 *    - Meta-progression feeling (permanent upgrades)
 *
 * 6. TARGET METRICS:
 *    - First Floor 1 clear: 10-20 runs (20-60 minutes)
 *    - First Floor 5 clear: 50-100 runs (2-3 hours)
 *    - First Floor 10 clear: 150-250 runs (4-6 hours)
 *    - Boredom threshold: Max 5 deaths in same spot before frustration
 *    - Variety threshold: Min 3 different build types per 10 runs
 */

console.log('🎮 COMPREHENSIVE Path of Heroes Simulator');
console.log('Testing Real Game Balance with ALL Systems\n');
console.log('='.repeat(70));

// ===== CHARACTER DEFINITIONS =====
const CHARACTERS = {
    warrior: {
        hp: 100, atk: 12, def: 10, spd: 6, crit: 10,
        growth: { hp: 6, atk: 1.2, def: 1.8, spd: 0.4, crit: 0.2 }
    },
    sorceress: {
        hp: 80, atk: 14, def: 6, spd: 7, crit: 12,
        growth: { hp: 4, atk: 1.4, def: 0.6, spd: 0.6, crit: 0.4 }
    },
    rogue: {
        hp: 90, atk: 15, def: 7, spd: 10, crit: 18,
        growth: { hp: 5, atk: 1.5, def: 0.9, spd: 0.8, crit: 0.6 }
    }
};

// ===== ENEMY DEFINITIONS (Floor 1) =====
const ENEMIES = {
    goblin: { hp: 44, atk: 10, def: 3, spd: 6, crit: 5, xp: 20, gold: [2, 5] },
    slime: { hp: 50, atk: 9, def: 8, spd: 3, crit: 3, xp: 25, gold: [3, 6] },
    orcBrute: { hp: 66, atk: 13, def: 5, spd: 5, crit: 8, xp: 35, gold: [5, 10] }
};

// ===== BATTLE BUFFS (Hades-style) =====
const BATTLE_BUFFS = {
    berserker_rage: { stat: 'atk', multiplier: 1.25 },
    iron_skin: { stat: 'def', multiplier: 1.4 },
    swift_reflexes: { stat: 'spd', multiplier: 1.3 },
    precision_strike: { stat: 'crit', bonus: 15 }
};

// ===== HERO SOULS UPGRADES (Costs) =====
const SOUL_UPGRADES = [
    { cost: 100, bonus: { hp: 10 } },      // +10% HP
    { cost: 100, bonus: { atk: 5 } },      // +5% ATK
    { cost: 150, bonus: { def: 10 } },     // +10% DEF
    { cost: 200, bonus: { hp: 15, atk: 5 } }, // +15% HP, +5% ATK
];

// ===== HELPER FUNCTIONS =====
function rng(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function xpForLevel(level) {
    return 60 + (level - 1) * 40;
}

function soulsForFloor(floor) {
    return Math.max(2, Math.floor(floor / 3));
}

function calculateDamage(attacker, defender, isCrit = false) {
    let dmg = Math.floor((attacker.atk * attacker.atk) / (attacker.atk + defender.def) || 1);
    if (isCrit) dmg = Math.floor(dmg * 1.6);
    return Math.max(1, dmg);
}

// ===== SIMULATE ONE COMBAT =====
function simulateCombat(player, enemy) {
    let playerHP = player.hp;
    let enemyHP = enemy.hp;
    let turns = 0;
    let damageTaken = 0;

    while (playerHP > 0 && enemyHP > 0 && turns < 50) {
        turns++;

        if (player.spd >= enemy.spd) {
            const isCrit = Math.random() * 100 < player.crit;
            enemyHP -= calculateDamage(player, enemy, isCrit);
            if (enemyHP <= 0) break;
        }

        const enemyDmg = calculateDamage(enemy, player);
        playerHP -= enemyDmg;
        damageTaken += enemyDmg;
        if (playerHP <= 0) break;

        if (player.spd < enemy.spd) {
            const isCrit = Math.random() * 100 < player.crit;
            enemyHP -= calculateDamage(player, enemy, isCrit);
        }
    }

    return {
        won: playerHP > 0,
        playerHP: Math.max(0, playerHP),
        damageTaken,
        xpGained: enemy.xp,
        goldGained: rng(enemy.gold[0], enemy.gold[1]),
        timeSeconds: turns * 2 // ~2 seconds per turn
    };
}

// ===== SIMULATE ONE FULL RUN =====
function simulateRun(character, metaSouls = 0, unlockedUpgrades = []) {
    // Initialize player with base stats
    const base = CHARACTERS[character];
    const player = {
        level: 1,
        xp: 0,
        hp: base.hp,
        maxHp: base.hp,
        atk: base.atk,
        def: base.def,
        spd: base.spd,
        crit: base.crit,
        gold: 100,
        potions: 2,
        equipment: { weapon: 0, armor: 0 },
        buffs: []
    };

    // Apply meta-progression upgrades
    unlockedUpgrades.forEach(upgrade => {
        if (upgrade.hp) {
            player.maxHp += Math.floor(base.hp * upgrade.hp / 100);
            player.hp = player.maxHp;
        }
        if (upgrade.atk) player.atk += Math.floor(base.atk * upgrade.atk / 100);
        if (upgrade.def) player.def += Math.floor(base.def * upgrade.def / 100);
    });

    // Choose 1 battle buff at start (Hades-style)
    const buffKeys = Object.keys(BATTLE_BUFFS);
    const chosenBuff = BATTLE_BUFFS[buffKeys[rng(0, buffKeys.length - 1)]];
    if (chosenBuff.multiplier) {
        player[chosenBuff.stat] = Math.floor(player[chosenBuff.stat] * chosenBuff.multiplier);
    } else if (chosenBuff.bonus) {
        player[chosenBuff.stat] += chosenBuff.bonus;
    }

    let battlesWon = 0;
    let floorsCleared = 0;
    let totalTime = 0;
    let soulsEarned = 0;
    let deaths = 0;
    let deathLocation = null;

    // Floor 1 simulation (15 encounters)
    const encounterCount = 15;

    for (let i = 0; i < encounterCount; i++) {
        // Random encounter
        const enemyTypes = Object.keys(ENEMIES);
        const enemyType = enemyTypes[rng(0, enemyTypes.length - 1)];
        const enemy = { ...ENEMIES[enemyType] };

        // Random shrine (20% chance)
        if (Math.random() < 0.2) {
            const statBoosts = ['hp', 'atk', 'def'];
            const boost = statBoosts[rng(0, 2)];
            if (boost === 'hp') {
                player.maxHp += rng(3, 8);
                player.hp = Math.min(player.hp + rng(3, 8), player.maxHp);
            } else if (boost === 'atk') player.atk += rng(2, 4);
            else if (boost === 'def') player.def += rng(1, 3);
            totalTime += 5; // Shrine interaction time
        }

        // Random item drop (30% chance)
        if (Math.random() < 0.3) {
            const weaponBonus = rng(1, 4);
            const armorBonus = rng(0, 3);
            player.atk += weaponBonus;
            player.def += armorBonus;
            totalTime += 3; // Item pickup time
        }

        // Shop encounter (every 5 battles)
        if (i === 5 && player.gold >= 30) {
            player.gold -= 30;
            player.potions++;
            totalTime += 10; // Shop decision time
        }

        // Combat
        const result = simulateCombat(player, enemy);
        totalTime += result.timeSeconds;

        if (!result.won) {
            deaths = 1;
            deathLocation = i + 1;
            break;
        }

        battlesWon++;
        player.hp = result.playerHP;
        player.xp += result.xpGained;
        player.gold += result.goldGained;

        // Level up
        while (player.xp >= xpForLevel(player.level)) {
            player.xp -= xpForLevel(player.level);
            player.level++;
            const growth = base.growth;
            player.maxHp += growth.hp;
            player.hp = player.maxHp; // Full heal
            player.atk += growth.atk;
            player.def += growth.def;
            player.spd += growth.spd;
            player.crit += growth.crit;
        }

        // Use potion strategically (< 40% HP)
        if (player.hp / player.maxHp < 0.4 && player.potions > 0) {
            player.hp = Math.min(player.hp + 50, player.maxHp);
            player.potions--;
        }
    }

    // Award souls for progress
    if (deaths === 0) {
        floorsCleared = 1;
        soulsEarned = soulsForFloor(1);
    } else {
        // Partial souls for battles won (1 soul per 5 battles)
        soulsEarned = Math.floor(battlesWon / 5);
    }

    return {
        character,
        battlesWon,
        encounterCount,
        floorsCleared,
        deaths,
        deathLocation,
        finalLevel: player.level,
        finalHP: player.hp,
        maxHP: player.maxHp,
        soulsEarned,
        timeSeconds: totalTime,
        goldEarned: player.gold - 100
    };
}

// ===== PROGRESSION SIMULATION =====
console.log('\n📊 Simulating 100 Progressive Runs with Meta-Progression...\n');

let totalSouls = 0;
let unlockedUpgrades = [];
const results = [];
const firstClearRuns = { floor1: null, floor5: null, floor10: null };
const deathLocations = {};
let consecutiveDeaths = 0;
let lastDeathLocation = null;

for (let run = 1; run <= 100; run++) {
    const character = ['warrior', 'sorceress', 'rogue'][run % 3];
    const result = simulateRun(character, totalSouls, unlockedUpgrades);

    totalSouls += result.soulsEarned;
    results.push(result);

    // Check for upgrade purchases
    SOUL_UPGRADES.forEach((upgrade, idx) => {
        if (totalSouls >= upgrade.cost && !unlockedUpgrades.includes(upgrade)) {
            unlockedUpgrades.push(upgrade);
            totalSouls -= upgrade.cost;
        }
    });

    // Track first clears
    if (!firstClearRuns.floor1 && result.floorsCleared >= 1) {
        firstClearRuns.floor1 = run;
    }

    // Track death locations (boredom metric)
    if (result.deaths > 0) {
        const loc = result.deathLocation;
        deathLocations[loc] = (deathLocations[loc] || 0) + 1;

        if (loc === lastDeathLocation) {
            consecutiveDeaths++;
        } else {
            consecutiveDeaths = 1;
            lastDeathLocation = loc;
        }
    }

    // Display progress
    const status = result.deaths === 0 ? '✅' : '💀';
    const souls = result.soulsEarned > 0 ? `+${result.soulsEarned}👻` : '';
    const time = `${Math.floor(result.timeSeconds / 60)}:${String(result.timeSeconds % 60).padStart(2, '0')}`;

    console.log(
        `Run ${String(run).padStart(3)}: ${character.padEnd(10)} | ` +
        `${status} ${result.battlesWon}/${result.encounterCount} | ` +
        `Lvl ${result.finalLevel} | ` +
        `${time} | ` +
        `${souls.padEnd(6)} | ` +
        `Total: ${totalSouls}👻`
    );

    // Frustration check
    if (consecutiveDeaths >= 5) {
        console.log(`    ⚠️  FRUSTRATION: Died at Battle ${lastDeathLocation} five times in a row!`);
    }
}

// ===== ANALYSIS =====
console.log('\n' + '='.repeat(70));
console.log('📈 COMPREHENSIVE ANALYSIS\n');

const clears = results.filter(r => r.deaths === 0).length;
const avgBattles = Math.round(results.reduce((s, r) => s + r.battlesWon, 0) / results.length);
const avgTime = Math.round(results.reduce((s, r) => s + r.timeSeconds, 0) / results.length);
const totalTime = results.reduce((s, r) => s + r.timeSeconds, 0);

console.log(`Total Runs: 100`);
console.log(`Floor 1 Clears: ${clears}/100 (${clears}%)`);
console.log(`First Clear: Run #${firstClearRuns.floor1 || 'Never'}`);
console.log(`Average Battles Won: ${avgBattles}/15`);
console.log(`Average Run Time: ${Math.floor(avgTime / 60)}m ${avgTime % 60}s`);
console.log(`Total Play Time: ${Math.floor(totalTime / 3600)}h ${Math.floor((totalTime % 3600) / 60)}m`);
console.log(`Final Hero Souls: ${totalSouls}👻`);
console.log(`Upgrades Unlocked: ${unlockedUpgrades.length}/4`);

console.log('\n📍 Death Location Heatmap (Boredom Metric):');
Object.entries(deathLocations)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .forEach(([loc, count]) => {
        console.log(`  Battle ${loc}: ${count} deaths (${Math.round(count/100*100)}%)`);
    });

console.log('\n' + '='.repeat(70));
console.log('🎯 BALANCE VERDICT\n');

if (!firstClearRuns.floor1) {
    console.log('❌ CRITICAL: Cannot clear Floor 1 in 100 runs');
    console.log('   → Game is TOO HARD');
    console.log('   → Recommendation: Increase starting potions to 3');
} else if (firstClearRuns.floor1 <= 5) {
    console.log('❌ WARNING: Floor 1 cleared in first 5 runs');
    console.log('   → Game is TOO EASY');
    console.log('   → Recommendation: Reduce starting potions to 1 or increase enemy stats');
} else if (firstClearRuns.floor1 <= 20) {
    console.log('✅ EXCELLENT: Floor 1 cleared in runs 6-20');
    console.log('   → Perfect difficulty curve for casual roguelike');
    console.log('   → Players feel challenged but not frustrated');
} else if (firstClearRuns.floor1 <= 50) {
    console.log('⚠️  ACCEPTABLE: Floor 1 cleared in runs 21-50');
    console.log('   → Slightly too hard for casual players');
    console.log('   → Recommendation: Small buff (+5% HP or +1 potion)');
}

const timeToFirstClear = results.slice(0, firstClearRuns.floor1).reduce((s, r) => s + r.timeSeconds, 0);
console.log(`\nTime to First Clear: ${Math.floor(timeToFirstClear / 60)} minutes`);

if (timeToFirstClear < 600) {
    console.log('   → Target: 20-60 minutes ⚠️  TOO FAST');
} else if (timeToFirstClear <= 3600) {
    console.log('   → Target: 20-60 minutes ✅ PERFECT');
} else {
    console.log('   → Target: 20-60 minutes ⚠️  TOO SLOW');
}

console.log('\n✨ Simulation Complete!\n');
