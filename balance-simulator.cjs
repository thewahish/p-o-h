#!/usr/bin/env node
/**
 * Game Balance Simulator
 * Simulates 25 full game runs to analyze difficulty balance
 */

console.log('🎮 Game Balance Simulator - Running 25 Full Simulations\n');
console.log('='.repeat(70));

// Character stats (Level 1)
const characters = {
    warrior: { hp: 100, atk: 12, def: 10, spd: 6, crit: 10, resource: 50 },
    sorceress: { hp: 80, atk: 14, def: 6, spd: 7, crit: 12, resource: 70 },
    rogue: { hp: 90, atk: 15, def: 7, spd: 10, crit: 18, resource: 60 }
};

// Enemy stats (Floor 1 base)
const enemies = {
    goblin: { hp: 40, atk: 8, def: 3, spd: 6, crit: 5 },
    slime: { hp: 45, atk: 7, def: 8, spd: 3, crit: 3 },
    orcBrute: { hp: 60, atk: 12, def: 5, spd: 5, crit: 8 }
};

// Damage formula: (ATK² / (ATK + DEF))
function calculateDamage(attacker, defender, multiplier = 1.0, isCrit = false) {
    let baseDmg = (attacker.atk * attacker.atk) / (attacker.atk + defender.def);
    if (baseDmg < 1) baseDmg = 1;
    let finalDmg = Math.floor(baseDmg * multiplier);
    if (isCrit) {
        finalDmg = Math.floor(finalDmg * 1.6); // Crit multiplier
    }
    return Math.max(1, finalDmg);
}

function simulateCombat(player, enemy, simulationId, combatNum) {
    let playerHP = player.hp;
    let enemyHP = enemy.hp;
    let turns = 0;
    let playerDamageTaken = 0;
    const maxTurns = 50; // Prevent infinite loops

    while (playerHP > 0 && enemyHP > 0 && turns < maxTurns) {
        turns++;

        // Player turn (goes first if SPD >= enemy SPD)
        if (player.spd >= enemy.spd) {
            const isCrit = Math.random() * 100 < player.crit;
            const dmg = calculateDamage(player, enemy, 1.0, isCrit);
            enemyHP -= dmg;
            if (enemyHP <= 0) break;
        }

        // Enemy turn
        const enemyDmg = calculateDamage(enemy, player);
        playerHP -= enemyDmg;
        playerDamageTaken += enemyDmg;
        if (playerHP <= 0) break;

        // Player turn (if enemy went first)
        if (player.spd < enemy.spd) {
            const isCrit = Math.random() * 100 < player.crit;
            const dmg = calculateDamage(player, enemy, 1.0, isCrit);
            enemyHP -= dmg;
        }
    }

    return {
        won: playerHP > 0,
        playerHP: Math.max(0, playerHP),
        turns,
        damageTaken: playerDamageTaken
    };
}

function runFullSimulation(characterType, simNumber) {
    const player = { ...characters[characterType] };
    let totalCombats = 0;
    let combatsWon = 0;
    let totalDamageTaken = 0;
    let deaths = 0;
    let floorsCompleted = 0;

    // Simulate Floor 1 (assume ~10 combat encounters)
    const floor1Combats = 10;

    for (let i = 0; i < floor1Combats; i++) {
        // Random enemy
        const enemyTypes = Object.keys(enemies);
        const enemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
        const enemy = { ...enemies[enemyType] };

        totalCombats++;
        const result = simulateCombat(player, enemy, simNumber, i + 1);

        if (result.won) {
            combatsWon++;
            player.hp = result.playerHP; // HP carries over
            totalDamageTaken += result.damageTaken;
        } else {
            deaths++;
            break; // Game over
        }
    }

    if (deaths === 0) {
        floorsCompleted = 1;
    }

    return {
        character: characterType,
        floorsCompleted,
        combatsWon,
        totalCombats,
        deaths,
        avgDamagePerCombat: totalCombats > 0 ? Math.round(totalDamageTaken / totalCombats) : 0,
        survivalRate: Math.round((combatsWon / totalCombats) * 100)
    };
}

// Run 25 simulations (mix of characters)
const simulations = [];
const characterTypes = ['warrior', 'sorceress', 'rogue'];

console.log('\n📊 Running Simulations...\n');

for (let i = 1; i <= 25; i++) {
    const charType = characterTypes[(i - 1) % 3];
    const result = runFullSimulation(charType, i);
    simulations.push(result);

    const status = result.deaths === 0 ? '✅ SURVIVED' : '💀 DIED';
    console.log(`Sim ${String(i).padStart(2)}: ${charType.padEnd(10)} | ${status} | Combats: ${result.combatsWon}/${result.totalCombats} | Avg Dmg: ${result.avgDamagePerCombat}`);
}

// Analyze results
console.log('\n' + '='.repeat(70));
console.log('📈 ANALYSIS\n');

const survived = simulations.filter(s => s.deaths === 0).length;
const died = simulations.filter(s => s.deaths > 0).length;
const avgCombatsWon = Math.round(simulations.reduce((sum, s) => sum + s.combatsWon, 0) / simulations.length);
const avgDamagePerCombat = Math.round(simulations.reduce((sum, s) => sum + s.avgDamagePerCombat, 0) / simulations.length);

console.log(`Total Simulations: 25`);
console.log(`Survived Floor 1: ${survived}/25 (${Math.round((survived/25)*100)}%)`);
console.log(`Died on Floor 1:  ${died}/25 (${Math.round((died/25)*100)}%)`);
console.log(`Avg Combats Won:  ${avgCombatsWon}/10`);
console.log(`Avg Damage/Combat: ${avgDamagePerCombat} HP`);

// Per-character breakdown
console.log('\n📊 Per-Character Results:\n');
characterTypes.forEach(char => {
    const charSims = simulations.filter(s => s.character === char);
    const charSurvived = charSims.filter(s => s.deaths === 0).length;
    const charAvgDmg = Math.round(charSims.reduce((sum, s) => sum + s.avgDamagePerCombat, 0) / charSims.length);

    console.log(`${char.toUpperCase().padEnd(10)}: ${charSurvived}/${charSims.length} survived | Avg Dmg: ${charAvgDmg} HP/combat`);
});

// Balance Assessment
console.log('\n' + '='.repeat(70));
console.log('⚖️  BALANCE ASSESSMENT\n');

const targetSurvival = 60; // Target: 60% survival rate for Floor 1
const actualSurvival = Math.round((survived/25)*100);

console.log(`Target Survival Rate: ${targetSurvival}%`);
console.log(`Actual Survival Rate: ${actualSurvival}%`);

if (actualSurvival > 85) {
    console.log('\n❌ ISSUE: Game is TOO EASY');
    console.log('   Players are surviving too easily. Needs significant difficulty increase.');
    console.log('\n🔧 RECOMMENDATIONS:');
    console.log('   1. REDUCE player HP by 30-40% (Warrior: 100→60, Sorceress: 80→50, Rogue: 90→55)');
    console.log('   2. INCREASE enemy damage by 40-50%');
    console.log('   3. INCREASE enemy HP by 20-30%');
    console.log('   4. REDUCE player starting ATK by 15-20%');
} else if (actualSurvival > 75) {
    console.log('\n⚠️  WARNING: Game is slightly too easy');
    console.log('   Most players are surviving without much challenge.');
    console.log('\n🔧 RECOMMENDATIONS:');
    console.log('   1. REDUCE player HP by 15-20%');
    console.log('   2. INCREASE enemy damage by 20-25%');
} else if (actualSurvival < 45) {
    console.log('\n⚠️  WARNING: Game is too difficult');
    console.log('   Too many players dying. Needs rebalancing.');
    console.log('\n🔧 RECOMMENDATIONS:');
    console.log('   1. INCREASE player HP by 15-20%');
    console.log('   2. REDUCE enemy damage by 15-20%');
} else {
    console.log('\n✅ BALANCE: Game difficulty is appropriate');
    console.log('   Survival rate is within acceptable range.');
}

// Detailed damage analysis
console.log('\n' + '='.repeat(70));
console.log('💥 DAMAGE ANALYSIS\n');

// Simulate specific matchups
console.log('Sample Combat Scenarios (1v1, no crits):\n');

const sampleMatchups = [
    { player: 'warrior', enemy: 'goblin' },
    { player: 'warrior', enemy: 'slime' },
    { player: 'warrior', enemy: 'orcBrute' },
    { player: 'sorceress', enemy: 'goblin' },
    { player: 'rogue', enemy: 'goblin' }
];

sampleMatchups.forEach(matchup => {
    const player = characters[matchup.player];
    const enemy = enemies[matchup.enemy];

    const playerDmg = calculateDamage(player, enemy);
    const enemyDmg = calculateDamage(enemy, player);
    const turnsToKill = Math.ceil(enemy.hp / playerDmg);
    const damageTaken = turnsToKill * enemyDmg;
    const hpRemaining = player.hp - damageTaken;
    const survivalPercent = Math.round((hpRemaining / player.hp) * 100);

    console.log(`${matchup.player.toUpperCase()} vs ${matchup.enemy.toUpperCase()}:`);
    console.log(`  Player deals: ${playerDmg} dmg/turn | Enemy deals: ${enemyDmg} dmg/turn`);
    console.log(`  Turns to kill: ${turnsToKill} | Damage taken: ${damageTaken}/${player.hp} HP (${100-survivalPercent}% HP lost)`);
    console.log(`  Result: ${hpRemaining > 0 ? '✅ WIN' : '💀 LOSS'} with ${Math.max(0, hpRemaining)} HP remaining (${survivalPercent}%)\n`);
});

console.log('='.repeat(70));
console.log('\n✨ Simulation Complete!\n');
