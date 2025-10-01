#!/usr/bin/env node
/**
 * Game Balance Simulator V5 FINAL - Option C with 2 HP Potions
 * Tests V.39.2 balance changes - Final roguelike difficulty with emergency potions
 */

console.log('🎮 Balance Simulator V5 FINAL - Testing V.39.2 (2 Potions)\n');
console.log('='.repeat(70));

// Option C Character stats (V.39.2 - Custom balance)
// - Player HP reduced 20% (80/65/72)
// - Player ATK kept original (12/14/15)
// - 2 HP Potions (100 HP total) as emergency healing
const characters = {
    warrior: { hp: 80, atk: 12, def: 10, spd: 6, crit: 10, resource: 50, potions: 2 },
    sorceress: { hp: 65, atk: 14, def: 6, spd: 7, crit: 12, resource: 70, potions: 2 },
    rogue: { hp: 72, atk: 15, def: 7, spd: 10, crit: 18, resource: 60, potions: 2 }
};

// Enemy stats (V.39.2 - +20% HP, +25% ATK)
const enemies = {
    goblin: { hp: 48, atk: 10, def: 3, spd: 6, crit: 5 },
    slime: { hp: 54, atk: 9, def: 8, spd: 3, crit: 3 },
    orcBrute: { hp: 72, atk: 15, def: 5, spd: 5, crit: 8 }
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
    let potionsUsed = 0;

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

            // Use potion if HP is critically low (< 35%) and we have one
            const hpPercent = player.hp / characters[characterType].hp;
            if (hpPercent < 0.35 && player.potions > 0) {
                player.hp = Math.min(player.hp + 50, characters[characterType].hp);
                player.potions--;
                potionsUsed++;
            }
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
        finalHP: player.hp,
        potionsUsed
    };
}

const simulations = [];
const characterTypes = ['warrior', 'sorceress', 'rogue'];

console.log('\n📊 Running 25 Simulations (V.39.2 FINAL - 2 Potions)...\n');

for (let i = 1; i <= 25; i++) {
    const charType = characterTypes[(i - 1) % 3];
    const result = runFullSimulation(charType, i);
    simulations.push(result);

    const status = result.deaths === 0 ? '✅ SURVIVED' : '💀 DIED';
    const hpInfo = result.deaths === 0 ? `Final HP: ${result.finalHP}` : '';
    const potionInfo = result.potionsUsed > 0 ? `${result.potionsUsed} potions` : '';
    console.log(`Sim ${String(i).padStart(2)}: ${charType.padEnd(10)} | ${status} | ${result.combatsWon}/10 | Avg Dmg: ${result.avgDamagePerCombat}/turn | ${hpInfo} ${potionInfo}`);
}

console.log('\n' + '='.repeat(70));
console.log('📈 ANALYSIS\n');

const survived = simulations.filter(s => s.deaths === 0).length;
const died = simulations.filter(s => s.deaths > 0).length;
const avgCombatsWon = Math.round(simulations.reduce((sum, s) => sum + s.combatsWon, 0) / simulations.length);
const avgDamagePerCombat = Math.round(simulations.reduce((sum, s) => sum + s.avgDamagePerCombat, 0) / simulations.length);
const totalPotionsUsed = simulations.reduce((sum, s) => sum + s.potionsUsed, 0);

const survivedSims = simulations.filter(s => s.deaths === 0);
const avgFinalHP = survivedSims.length > 0 ?
    Math.round(survivedSims.reduce((sum, s) => sum + s.finalHP, 0) / survivedSims.length) : 0;

console.log(`Total Simulations:  25`);
console.log(`Survived Floor 1:   ${survived}/25 (${Math.round((survived/25)*100)}%)`);
console.log(`Died on Floor 1:    ${died}/25 (${Math.round((died/25)*100)}%)`);
console.log(`Avg Combats Won:    ${avgCombatsWon}/10`);
console.log(`Avg Damage/Combat:  ${avgDamagePerCombat} HP`);
console.log(`Total Potions Used: ${totalPotionsUsed}`);
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
    const charPotions = charSims.reduce((sum, s) => sum + s.potionsUsed, 0);

    const maxHP = characters[char].hp;
    const hpPercent = charAvgFinalHP > 0 ? Math.round((charAvgFinalHP / maxHP) * 100) : 0;

    console.log(`${char.toUpperCase().padEnd(10)}: ${charSurvived}/${charSims.length} survived | Avg Dmg: ${charAvgDmg} HP/combat | Final HP: ${charAvgFinalHP}/${maxHP} (${hpPercent}%) | Potions: ${charPotions}`);
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
    console.log('   Emergency potions provide strategic depth.');
    console.log('\n🎉 READY FOR PRODUCTION - Balance achieved!');
} else if (actualSurvival > 75) {
    console.log('\n⚠️  WARNING: Still slightly too easy');
    console.log('   Consider removing 1 starting potion.');
} else if (actualSurvival < 45) {
    console.log('\n⚠️  WARNING: Too difficult');
    console.log('   Consider adding 1 more potion or increasing enemy ATK by 5%.');
} else {
    console.log('\n✅ GOOD: Balance is acceptable');
    console.log('   Survival rate is close to target.');
}

console.log('\n' + '='.repeat(70));
console.log('💥 DETAILED COMBAT ANALYSIS\n');

console.log('Sample Matchups (V.39.2 FINAL + 2 Potions):\n');

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
console.log('\n✨ V.39.2 FINAL Balance Test Complete!\n');
console.log('📝 Summary:');
console.log('   - Player HP reduced by 20% (Warrior 100→80, Sorceress 80→65, Rogue 90→72)');
console.log('   - Player ATK kept original (Warrior 12, Sorceress 14, Rogue 15)');
console.log('   - Enemy HP increased 20%, ATK increased 25%');
console.log('   - Starting potions: 2 HP potions (100 HP total, down from 150 HP)');
console.log('   - Result: Roguelike-appropriate difficulty with strategic resource management\n');
