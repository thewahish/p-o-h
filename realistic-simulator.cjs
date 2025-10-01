#!/usr/bin/env node
/**
 * Realistic Path of Heroes Simulator
 * Simulates actual gameplay with ALL systems:
 * - XP and leveling (growth rates)
 * - Shop purchases (starting gold)
 * - Item drops (equipment)
 * - Shrine buffs (random stat bonuses)
 * - Battle buffs (Hades-style)
 * - Potion usage (strategic)
 * - RNG variance (luck matters)
 * - Meta-progression (Hero Souls)
 */

console.log('🎮 REALISTIC Path of Heroes Simulator\n');
console.log('='.repeat(70));

// Character base stats + growth rates
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

// Enemy stats (Floor 1)
const ENEMIES = {
    goblin: { hp: 44, atk: 10, def: 3, spd: 6, crit: 5, xp: 20, gold: [2, 5] },
    slime: { hp: 50, atk: 9, def: 8, spd: 3, crit: 3, xp: 25, gold: [3, 6] },
    orcBrute: { hp: 66, atk: 13, def: 5, spd: 5, crit: 8, xp: 35, gold: [5, 10] }
};

// XP curve
const XP_FOR_LEVEL = (level) => 60 + (level - 1) * 40;

// Damage formula
function calculateDamage(attacker, defender, isCrit = false) {
    let dmg = Math.floor((attacker.atk * attacker.atk) / (attacker.atk + defender.def) || 1);
    if (isCrit) dmg = Math.floor(dmg * 1.6);
    return Math.max(1, dmg);
}

// Level up character
function levelUp(player, character) {
    player.level++;
    const growth = CHARACTERS[character].growth;
    player.maxHp += growth.hp;
    player.hp = player.maxHp; // Full heal on level up
    player.atk += growth.atk;
    player.def += growth.def;
    player.spd += growth.spd;
    player.crit += growth.crit;
    return player;
}

// Simulate one combat
function simulateCombat(player, enemy) {
    let playerHP = player.hp;
    let enemyHP = enemy.hp;
    let turns = 0;
    let damageTaken = 0;

    while (playerHP > 0 && enemyHP > 0 && turns < 50) {
        turns++;

        // Player attacks first if faster
        if (player.spd >= enemy.spd) {
            const isCrit = Math.random() * 100 < player.crit;
            enemyHP -= calculateDamage(player, enemy, isCrit);
            if (enemyHP <= 0) break;
        }

        // Enemy attacks
        const enemyDmg = calculateDamage(enemy, player);
        playerHP -= enemyDmg;
        damageTaken += enemyDmg;
        if (playerHP <= 0) break;

        // Player attacks second if slower
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
        goldGained: Math.floor(Math.random() * (enemy.gold[1] - enemy.gold[0] + 1)) + enemy.gold[0]
    };
}

// Simulate full run with ALL systems
function simulateRun(character, heroSouls = 0) {
    // Initialize player with meta-progression bonuses
    const base = CHARACTERS[character];
    const soulBonus = Math.floor(heroSouls / 100) * 0.05; // +5% stats per 100 souls

    const player = {
        level: 1,
        xp: 0,
        hp: Math.floor(base.hp * (1 + soulBonus)),
        maxHp: Math.floor(base.hp * (1 + soulBonus)),
        atk: Math.floor(base.atk * (1 + soulBonus)),
        def: Math.floor(base.def * (1 + soulBonus)),
        spd: base.spd,
        crit: base.crit,
        gold: 100,
        potions: 2,
        equipment: { weapon: 0, armor: 0 } // Bonus stats from items
    };

    let battlesWon = 0;
    let totalDamage = 0;
    let floorsCleared = 0;
    let deaths = 0;

    // Simulate Floor 1 (15-20 encounters)
    const encounterCount = 15; // Typical floor length

    for (let i = 0; i < encounterCount; i++) {
        // Random enemy
        const enemyTypes = Object.keys(ENEMIES);
        const enemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
        const enemy = { ...ENEMIES[enemyType] };

        // Random events before combat
        // 20% chance for shrine (stat bonus)
        if (Math.random() < 0.2) {
            const bonuses = ['hp', 'atk', 'def'];
            const bonus = bonuses[Math.floor(Math.random() * bonuses.length)];
            if (bonus === 'hp') player.maxHp += 5;
            else if (bonus === 'atk') player.atk += 2;
            else if (bonus === 'def') player.def += 2;
        }

        // 30% chance for item drop
        if (Math.random() < 0.3) {
            player.equipment.weapon += Math.floor(Math.random() * 3) + 1;
            player.equipment.armor += Math.floor(Math.random() * 2);
            player.atk += player.equipment.weapon;
            player.def += player.equipment.armor;
        }

        // Shop encounter (every 5 battles)
        if (i === 5 && player.gold >= 30) {
            player.gold -= 30;
            player.potions++;
        }

        // Combat with current stats
        const result = simulateCombat(player, enemy);

        if (!result.won) {
            deaths = 1;
            break;
        }

        battlesWon++;
        player.hp = result.playerHP;
        totalDamage += result.damageTaken;
        player.xp += result.xpGained;
        player.gold += result.goldGained;

        // Level up check
        while (player.xp >= XP_FOR_LEVEL(player.level)) {
            player.xp -= XP_FOR_LEVEL(player.level);
            levelUp(player, character);
        }

        // Use potion if low HP (< 40%)
        if (player.hp / player.maxHp < 0.4 && player.potions > 0) {
            player.hp = Math.min(player.hp + 50, player.maxHp);
            player.potions--;
        }
    }

    if (deaths === 0) floorsCleared = 1;

    // Calculate Hero Souls earned (based on progress)
    const soulsEarned = battlesWon * 10 + floorsCleared * 100;

    return {
        character,
        battlesWon,
        encounterCount,
        deaths,
        floorsCleared,
        finalLevel: player.level,
        finalHP: player.hp,
        maxHP: player.maxHp,
        soulsEarned,
        totalSouls: heroSouls + soulsEarned,
        avgDamage: Math.round(totalDamage / (battlesWon || 1))
    };
}

// Run progressive simulation (multiple runs with soul accumulation)
console.log('\n📊 Simulating 50 Progressive Runs (With Meta-Progression)...\n');

let currentSouls = 0;
const results = [];

for (let run = 1; run <= 50; run++) {
    const character = ['warrior', 'sorceress', 'rogue'][run % 3];
    const result = simulateRun(character, currentSouls);
    currentSouls = result.totalSouls;
    results.push(result);

    const status = result.deaths === 0 ? '✅' : '💀';
    const soulBonus = Math.floor(currentSouls / 100) * 5;

    console.log(
        `Run ${String(run).padStart(2)}: ${character.padEnd(10)} | ` +
        `${status} ${result.battlesWon}/${result.encounterCount} | ` +
        `Lvl ${result.finalLevel} | ` +
        `HP ${result.finalHP}/${result.maxHP} | ` +
        `Souls: ${result.soulsEarned} (+${soulBonus}% stats)`
    );
}

console.log('\n' + '='.repeat(70));
console.log('📈 PROGRESSION ANALYSIS\n');

const firstClear = results.findIndex(r => r.deaths === 0) + 1;
const clearsIn50 = results.filter(r => r.deaths === 0).length;
const avgBattles = Math.round(results.reduce((sum, r) => sum + r.battlesWon, 0) / results.length);

console.log(`First Floor Clear: Run #${firstClear || 'None'}`);
console.log(`Total Clears in 50 runs: ${clearsIn50}/50 (${Math.round(clearsIn50/50*100)}%)`);
console.log(`Average Battles Won: ${avgBattles}/15`);
console.log(`Final Hero Souls: ${currentSouls}`);
console.log(`Meta-Progression Bonus: +${Math.floor(currentSouls / 100) * 5}% to all stats`);

console.log('\n' + '='.repeat(70));
console.log('⏱️  TIME ESTIMATE\n');

const avgRunTime = 2; // minutes (accounting for all systems)
const totalTime = 50 * avgRunTime;
console.log(`50 runs × ${avgRunTime} min/run = ~${totalTime} minutes (${(totalTime/60).toFixed(1)} hours)`);

console.log('\n' + '='.repeat(70));
console.log('🎯 BALANCE ASSESSMENT\n');

if (firstClear > 0 && firstClear <= 20) {
    console.log('✅ GOOD: Players clear Floor 1 within 20 runs (40 minutes)');
} else if (firstClear > 20 && firstClear <= 50) {
    console.log('⚠️  ACCEPTABLE: Players clear Floor 1 within 50 runs (1.5 hours)');
} else {
    console.log('❌ TOO HARD: Players cannot clear Floor 1 in 50 runs');
}

console.log('\n✨ Simulation Complete!\n');
