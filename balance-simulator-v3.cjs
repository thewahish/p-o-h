#!/usr/bin/env node
/**
 * Game Balance Simulator V3 - Option B (Moderate Balance)
 * Tests V.39.1 balance changes
 */

console.log('🎮 Balance Simulator V3 - Testing V.39.1 (Option B - Moderate)\n');
console.log('='.repeat(70));

// Option B Character stats (V.39.1 - Moderate balance)
const characters = {
    warrior: { hp: 80, atk: 11, def: 10, spd: 6, crit: 10, resource: 50 },
    sorceress: { hp: 65, atk: 13, def: 6, spd: 7, crit: 12, resource: 70 },
    rogue: { hp: 72, atk: 14, def: 7, spd: 10, crit: 18, resource: 60 }
};

// Enemy stats (same as V.39.0 - +20% HP, +40% ATK)
const enemies = {
    goblin: { hp: 48, atk: 11, def: 3, spd: 6, crit: 5 },
    slime: { hp: 54, atk: 10, def: 8, spd: 3, crit: 3 },
    orcBrute: { hp: 72, atk: 17, def: 5, spd: 5, crit: 8 }
};

// Damage formula: (ATK² / (ATK + DEF))
function calculateDamage(attacker, defender, multiplier = 1.0, isCrit = false) {
    let baseDmg = (attacker.atk * attacker.atk) / (attacker.atk + defender.def);
    if (baseDmg < 1) baseDmg = 1;
    let finalDmg = Math.floor(baseDmg * multiplier);
    if (isCrit) {
        finalDmg = Math.floor(finalDmg * 1.6);
    }
    return Math.max(1, finalDmg);
}

function simulateCombat(player, enemy, simulationId, combatNum) {
    let playerHP = player.hp;
    let enemyHP = enemy.hp;
    let turns = 0;
    let playerDamageTaken = 0;
    const maxTurns = 50;

    while (playerHP > 0 && enemyHP > 0 && turns < maxTurns) {
        turns++;

        if (player.spd >= enemy.spd) {
            const isCrit = Math.random() * 100 < player.crit;
            const dmg = calculateDamage(player, enemy, 1.0, isCrit);
            enemyHP -= dmg;
            if (enemyHP <= 0) break;
        }

        const enemyDmg = calculateDamage(enemy, player);
        playerHP -= enemyDmg;
        playerDamageTaken += enemyDmg;
        if (playerHP <= 0) break;

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

    const floor1Combats = 10;

    for (let i = 0; i < floor1Combats; i++) {
        const enemyTypes = Object.keys(enemies);
        const enemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
        const enemy = { ...enemies[enemyType] };

        totalCombats++;
        const result = simulateCombat(player, enemy, simNumber, i + 1);

        if (result.won) {
            combatsWon++;
            player.hp = result.playerHP;
            totalDamageTaken += result.damageTaken;
        } else {
            deaths++;
            break;
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
        survivalRate: Math.round((combatsWon / totalCombats) * 100),
        finalHP: player.hp
    };
}

const simulations = [];
const characterTypes = ['warrior', 'sorceress', 'rogue'];

console.log('\n📊 Running 25 Simulations (V.39.1 - Option B)...\n');

for (let i = 1; i <= 25; i++) {
    const charType = characterTypes[(i - 1) % 3];
    const result = runFullSimulation(charType, i);
    simulations.push(result);

    const status = result.deaths === 0 ? '✅ SURVIVED' : '💀 DIED';
    const hpInfo = result.deaths === 0 ? `Final HP: ${result.finalHP}` : '';
    console.log(`Sim ${String(i).padStart(2)}: ${charType.padEnd(10)} | ${status} | ${result.combatsWon}/10 | Avg Dmg: ${result.avgDamagePerCombat}/turn | ${hpInfo}`);
}

console.log('\n' + '='.repeat(70));
console.log('📈 ANALYSIS\n');

const survived = simulations.filter(s => s.deaths === 0).length;
const died = simulations.filter(s => s.deaths > 0).length;
const avgCombatsWon = Math.round(simulations.reduce((sum, s) => sum + s.combatsWon, 0) / simulations.length);
const avgDamagePerCombat = Math.round(simulations.reduce((sum, s) => sum + s.avgDamagePerCombat, 0) / simulations.length);

const survivedSims = simulations.filter(s => s.deaths === 0);
const avgFinalHP = survivedSims.length > 0 ?
    Math.round(survivedSims.reduce((sum, s) => sum + s.finalHP, 0) / survivedSims.length) : 0;

console.log(`Total Simulations:  25`);
console.log(`Survived Floor 1:   ${survived}/25 (${Math.round((survived/25)*100)}%)`);
console.log(`Died on Floor 1:    ${died}/25 (${Math.round((died/25)*100)}%)`);
console.log(`Avg Combats Won:    ${avgCombatsWon}/10`);
console.log(`Avg Damage/Combat:  ${avgDamagePerCombat} HP`);
if (survivedSims.length > 0) {
    console.log(`Avg Final HP:       ${avgFinalHP} HP (survivors)`);
}

console.log('\n📊 Per-Character Results:\n');
characterTypes.forEach(char => {
    const charSims = simulations.filter(s => s.character === char);
    const charSurvived = charSims.filter(s => s.deaths === 0).length;
    const charAvgDmg = Math.round(charSims.reduce((sum, s) => sum + s.avgDamagePerCombat, 0) / charSims.length);
    const charSurvivors = charSims.filter(s => s.deaths === 0);
    const charAvgFinalHP = charSurvivors.length > 0 ?
        Math.round(charSurvivors.reduce((sum, s) => sum + s.finalHP, 0) / charSurvivors.length) : 0;

    const maxHP = characters[char].hp;
    const hpPercent = charAvgFinalHP > 0 ? Math.round((charAvgFinalHP / maxHP) * 100) : 0;

    console.log(`${char.toUpperCase().padEnd(10)}: ${charSurvived}/${charSims.length} survived | Avg Dmg: ${charAvgDmg} HP/combat | Final HP: ${charAvgFinalHP}/${maxHP} (${hpPercent}%)`);
});

console.log('\n' + '='.repeat(70));
console.log('⚖️  BALANCE ASSESSMENT\n');

const targetSurvival = 65; // Target: 65% survival rate
const actualSurvival = Math.round((survived/25)*100);
const diff = actualSurvival - targetSurvival;

console.log(`Target Survival Rate: ${targetSurvival}%`);
console.log(`Actual Survival Rate: ${actualSurvival}%`);
console.log(`Difference:           ${diff > 0 ? '+' : ''}${diff}%`);

if (actualSurvival >= 55 && actualSurvival <= 75) {
    console.log('\n✅ EXCELLENT: Balance is perfect for a roguelike!');
    console.log('   Survival rate is within target range (55-75%).');
    console.log('   Players will feel challenged but not frustrated.');
} else if (actualSurvival > 75) {
    console.log('\n⚠️  WARNING: Still slightly too easy');
    console.log('   Consider minor nerfs (5-10% HP reduction or enemy buff).');
} else if (actualSurvival < 45) {
    console.log('\n⚠️  WARNING: Too difficult');
    console.log('   Consider minor buffs (5-10% HP increase or enemy nerf).');
} else {
    console.log('\n✅ GOOD: Balance is acceptable');
    console.log('   Survival rate is close to target.');
}

console.log('\n' + '='.repeat(70));
console.log('💥 DETAILED COMBAT ANALYSIS\n');

console.log('Sample Matchups (V.39.1 - Option B):\n');

const matchups = [
    { player: 'warrior', enemy: 'goblin' },
    { player: 'warrior', enemy: 'slime' },
    { player: 'warrior', enemy: 'orcBrute' },
    { player: 'sorceress', enemy: 'goblin' },
    { player: 'rogue', enemy: 'orcBrute' }
];

matchups.forEach(matchup => {
    const player = characters[matchup.player];
    const enemy = enemies[matchup.enemy];

    const playerDmg = calculateDamage(player, enemy);
    const enemyDmg = calculateDamage(enemy, player);
    const turnsToKill = Math.ceil(enemy.hp / playerDmg);
    const damageTaken = turnsToKill * enemyDmg;
    const hpRemaining = player.hp - damageTaken;
    const survivalPercent = Math.round((Math.max(0, hpRemaining) / player.hp) * 100);

    console.log(`${matchup.player.toUpperCase()} vs ${matchup.enemy.toUpperCase()}:`);
    console.log(`  Player deals: ${playerDmg} dmg/turn | Enemy deals: ${enemyDmg} dmg/turn`);
    console.log(`  Turns to kill: ${turnsToKill} | Damage taken: ${damageTaken}/${player.hp} HP`);
    console.log(`  Result: ${hpRemaining > 0 ? '✅ WIN' : '💀 LOSS'} with ${Math.max(0, hpRemaining)}/${player.hp} HP (${survivalPercent}%)\n`);
});

console.log('='.repeat(70));
console.log('\n✨ V.39.1 (Option B - Moderate) Balance Test Complete!\n');
