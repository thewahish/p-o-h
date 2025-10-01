#!/usr/bin/env node
/**
 * DEMO BALANCE SIMULATOR - 30 Floors
 *
 * Final demo balance (4-6 hour completion target):
 * - 2 starting potions (100 HP emergency healing)
 * - Moderate XP curve (70 + level*50)
 * - Floor 1 enemies: +30% HP/ATK from original
 * - Better Hero Souls (5 + floor/2)
 * - 3% per floor scaling
 * - 30 total floors (DEMO VERSION)
 */

console.log('🎮 DEMO BALANCE SIMULATOR - 30 Floors');
console.log('Target: 4-6 hour completion for demo\n');
console.log('='.repeat(70));

// ===== CHARACTERS =====
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

// ===== ENEMY BASE STATS (Floor 1) =====
const BASE_ENEMIES = {
    goblin: { hp: 52, atk: 10, def: 3, spd: 6, crit: 5, xp: 20, gold: [2, 5] },
    slime: { hp: 59, atk: 9, def: 8, spd: 3, crit: 3, xp: 25, gold: [3, 6] },
    orcBrute: { hp: 78, atk: 14, def: 5, spd: 5, crit: 8, xp: 35, gold: [5, 10] }
};

// ===== HELPERS =====
function rng(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function xpForLevel(level) {
    return 70 + (level - 1) * 50;
}

function soulsForFloor(floor) {
    return 5 + Math.floor(floor / 2);
}

function scaleEnemy(baseEnemy, floor) {
    const scaleFactor = 1 + (floor - 1) * 0.03; // 3% per floor
    return {
        hp: Math.ceil(baseEnemy.hp * scaleFactor),
        atk: Math.ceil(baseEnemy.atk * scaleFactor),
        def: Math.ceil(baseEnemy.def * scaleFactor),
        spd: baseEnemy.spd,
        crit: baseEnemy.crit,
        xp: Math.ceil(baseEnemy.xp * scaleFactor),
        gold: baseEnemy.gold
    };
}

function calculateDamage(attacker, defender, isCrit = false) {
    let dmg = Math.floor((attacker.atk * attacker.atk) / (attacker.atk + defender.def) || 1);
    if (isCrit) dmg = Math.floor(dmg * 1.6);
    return Math.max(1, dmg);
}

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
        timeSeconds: turns * 2
    };
}

function simulateFloor(character, floor, metaSouls, unlockedUpgrades) {
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
        equipment: { weapon: 0, armor: 0 }
    };

    // Apply meta-progression (every 100 souls = +10% stats)
    const soulBonus = Math.floor(metaSouls / 100) * 0.1;
    player.maxHp = Math.floor(player.maxHp * (1 + soulBonus));
    player.hp = player.maxHp;
    player.atk = Math.floor(player.atk * (1 + soulBonus));
    player.def = Math.floor(player.def * (1 + soulBonus));

    // Apply specific upgrades
    unlockedUpgrades.forEach(upgrade => {
        if (upgrade.hp) {
            player.maxHp += Math.floor(base.hp * upgrade.hp / 100);
            player.hp = player.maxHp;
        }
        if (upgrade.atk) player.atk += Math.floor(base.atk * upgrade.atk / 100);
        if (upgrade.def) player.def += Math.floor(base.def * upgrade.def / 100);
    });

    let battlesWon = 0;
    let totalTime = 0;
    let deaths = 0;
    let deathLocation = null;

    const encounterCount = 15;

    for (let i = 0; i < encounterCount; i++) {
        const enemyTypes = Object.keys(BASE_ENEMIES);
        const enemyType = enemyTypes[rng(0, enemyTypes.length - 1)];
        const enemy = scaleEnemy(BASE_ENEMIES[enemyType], floor);

        // Shrine (15% chance)
        if (Math.random() < 0.15) {
            const boost = ['hp', 'atk', 'def'][rng(0, 2)];
            if (boost === 'hp') {
                player.maxHp += rng(4, 7);
                player.hp = Math.min(player.hp + rng(4, 7), player.maxHp);
            } else if (boost === 'atk') player.atk += rng(1, 3);
            else if (boost === 'def') player.def += rng(1, 2);
            totalTime += 5;
        }

        // Item drop (25% chance)
        if (Math.random() < 0.25) {
            player.atk += rng(1, 3);
            player.def += rng(0, 2);
            totalTime += 3;
        }

        // Shop
        if (i === 5 && player.gold >= 30) {
            player.gold -= 30;
            player.potions++;
            totalTime += 10;
        }

        // Combat
        const result = simulateCombat(player, enemy);
        totalTime += result.timeSeconds;

        if (!result.won) {
            deaths = 1;
            deathLocation = `Floor ${floor}, Battle ${i + 1}`;
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
            player.hp = player.maxHp;
            player.atk += growth.atk;
            player.def += growth.def;
            player.spd += growth.spd;
            player.crit += growth.crit;
        }

        // Potion use
        if (player.hp / player.maxHp < 0.4 && player.potions > 0) {
            player.hp = Math.min(player.hp + 50, player.maxHp);
            player.potions--;
        }
    }

    const soulsEarned = deaths === 0 ? soulsForFloor(floor) : Math.floor(battlesWon / 3);

    return {
        character,
        floor,
        battlesWon,
        deaths,
        deathLocation,
        soulsEarned,
        timeSeconds: totalTime,
        finalLevel: player.level
    };
}

// ===== SIMULATE PLAYER JOURNEY =====
console.log('\n🎮 DEMO PLAYTHROUGH: 30-Floor Journey...\n');

let runNumber = 0;
let totalSouls = 0;
let unlockedUpgrades = [];
let highestFloorReached = 1;
let totalPlayTime = 0;
let victories = [];

const SOUL_UPGRADES = [
    { cost: 50, bonus: { hp: 10 }, name: '+10% HP' },
    { cost: 50, bonus: { atk: 10 }, name: '+10% ATK' },
    { cost: 100, bonus: { def: 15 }, name: '+15% DEF' },
    { cost: 150, bonus: { hp: 15, atk: 10 }, name: '+15% HP, +10% ATK' },
];

while (highestFloorReached <= 30 && runNumber < 1000) {
    runNumber++;

    const character = ['warrior', 'sorceress', 'rogue'][runNumber % 3];
    const targetFloor = Math.min(highestFloorReached, 30);

    const result = simulateFloor(character, targetFloor, totalSouls, unlockedUpgrades);
    totalSouls += result.soulsEarned;
    totalPlayTime += result.timeSeconds;

    // Check for upgrades
    SOUL_UPGRADES.forEach(upgrade => {
        if (totalSouls >= upgrade.cost && !unlockedUpgrades.includes(upgrade)) {
            unlockedUpgrades.push(upgrade);
            totalSouls -= upgrade.cost;
            console.log(`  🔓 Unlocked: ${upgrade.name} (Cost: ${upgrade.cost}👻)`);
        }
    });

    if (result.deaths === 0) {
        if (targetFloor > highestFloorReached - 1) {
            highestFloorReached = targetFloor + 1;
            victories.push({ run: runNumber, floor: targetFloor, time: Math.floor(totalPlayTime / 60) });
            console.log(
                `Run ${String(runNumber).padStart(3)}: ✅ FLOOR ${targetFloor} CLEARED! ` +
                `(${character}, Lvl ${result.finalLevel}, +${result.soulsEarned}👻) ` +
                `Total: ${totalSouls}👻, Time: ${Math.floor(totalPlayTime / 60)}m`
            );
        }
    } else {
        const status = result.battlesWon >= 10 ? 'Progress' : 'Early Death';
        if (runNumber % 20 === 0 || runNumber <= 30) {
            console.log(
                `Run ${String(runNumber).padStart(3)}: 💀 ${result.deathLocation} ` +
                `(${character}, ${result.battlesWon}/15, +${result.soulsEarned}👻) ` +
                `[${status}]`
            );
        }
    }

    if (highestFloorReached > 30) {
        console.log(`\n🎉🎉🎉 DEMO COMPLETE! Beat Floor 30 on Run #${runNumber}! 🎉🎉🎉\n`);
        break;
    }
}

// ===== FINAL ANALYSIS =====
console.log('\n' + '='.repeat(70));
console.log('📊 DEMO BALANCE ANALYSIS (30 Floors)\n');

console.log(`Total Runs: ${runNumber}`);
console.log(`Total Play Time: ${Math.floor(totalPlayTime / 3600)}h ${Math.floor((totalPlayTime % 3600) / 60)}m`);
console.log(`Final Hero Souls: ${totalSouls}👻`);
console.log(`Upgrades Unlocked: ${unlockedUpgrades.length}/${SOUL_UPGRADES.length}`);
console.log(`Highest Floor: ${highestFloorReached - 1}`);

console.log('\n🏆 Major Milestones:');
[1, 5, 10, 15, 20, 25, 30].forEach(floor => {
    const victory = victories.find(v => v.floor === floor);
    if (victory) {
        console.log(`  Floor ${String(floor).padStart(2)}: Run #${String(victory.run).padStart(3)} (${Math.floor(victory.time / 60)}h ${victory.time % 60}m)`);
    }
});

console.log('\n⏱️  Time Investment:');
[
    { floor: 1, label: 'First Floor Clear' },
    { floor: 10, label: 'Act 1 Complete (Floor 10)' },
    { floor: 20, label: 'Act 2 Complete (Floor 20)' },
    { floor: 30, label: 'Demo Complete (Floor 30)' }
].forEach(({ floor, label }) => {
    const victory = victories.find(v => v.floor === floor);
    if (victory) {
        console.log(`  ${label.padEnd(35)}: ${Math.floor(victory.time / 60)}h ${victory.time % 60}m`);
    }
});

console.log('\n🎯 DEMO BALANCE VERDICT:\n');

const firstClear = victories.find(v => v.floor === 1);
if (firstClear) {
    if (firstClear.run <= 5) {
        console.log(`⚠️  Floor 1 too easy (${firstClear.run} runs, ${firstClear.time}m)`);
    } else if (firstClear.run <= 25) {
        console.log(`✅ Floor 1 PERFECT! (${firstClear.run} runs, ${firstClear.time}m - Target: 5-25 runs)`);
    } else {
        console.log(`❌ Floor 1 too hard (${firstClear.run} runs, ${firstClear.time}m)`);
    }
}

const floor10 = victories.find(v => v.floor === 10);
if (floor10) {
    const h = Math.floor(floor10.time / 60), m = floor10.time % 60;
    if (h < 1) {
        console.log(`⚠️  Floor 10 too fast (${h}h ${m}m)`);
    } else if (h <= 3) {
        console.log(`✅ Floor 10 PERFECT! (${h}h ${m}m - Target: 1-3h)`);
    } else {
        console.log(`⚠️  Floor 10 too slow (${h}h ${m}m)`);
    }
}

const demoComplete = victories.find(v => v.floor === 30);
if (demoComplete) {
    const h = Math.floor(demoComplete.time / 60), m = demoComplete.time % 60;
    if (h < 3) {
        console.log(`⚠️  Demo too short (${h}h ${m}m)`);
    } else if (h <= 8) {
        console.log(`✅ DEMO LENGTH PERFECT! (${h}h ${m}m - Target: 4-8h)`);
    } else {
        console.log(`⚠️  Demo too long (${h}h ${m}m)`);
    }
} else {
    console.log(`❌ Demo incomplete after ${runNumber} runs (${Math.floor(totalPlayTime / 3600)}h ${Math.floor((totalPlayTime % 3600) / 60)}m)`);
    console.log(`   Stuck at Floor ${highestFloorReached - 1} - needs balance adjustment`);
}

console.log('\n✨ Demo Simulation Complete!\n');
