#!/usr/bin/env node
console.log('🎮 Balance Simulator V8 FINAL - V.39.2 (3 Potions + 10% HP Reduction)\n');
console.log('='.repeat(70));

const characters = {
    warrior: { hp: 90, atk: 12, def: 10, spd: 6, crit: 10, potions: 3 },
    sorceress: { hp: 72, atk: 14, def: 6, spd: 7, crit: 12, potions: 3 },
    rogue: { hp: 81, atk: 15, def: 7, spd: 10, crit: 18, potions: 3 }
};

const enemies = {
    goblin: { hp: 48, atk: 10, def: 3, spd: 6, crit: 5 },
    slime: { hp: 54, atk: 9, def: 8, spd: 3, crit: 3 },
    orcBrute: { hp: 72, atk: 13, def: 5, spd: 5, crit: 8 }
};

function calculateDamage(attacker, defender, isCrit = false) {
    let baseDmg = (attacker.atk * attacker.atk) / (attacker.atk + defender.def);
    if (baseDmg < 1) baseDmg = 1;
    let finalDmg = Math.floor(baseDmg);
    if (isCrit) finalDmg = Math.floor(finalDmg * 1.6);
    return Math.max(1, finalDmg);
}

function simulateCombat(player, enemy) {
    let playerHP = player.hp, enemyHP = enemy.hp, turns = 0, playerDamageTaken = 0;
    while (playerHP > 0 && enemyHP > 0 && turns < 50) {
        turns++;
        if (player.spd >= enemy.spd) {
            const dmg = calculateDamage(player, enemy, Math.random() * 100 < player.crit);
            enemyHP -= dmg;
            if (enemyHP <= 0) break;
        }
        const enemyDmg = calculateDamage(enemy, player);
        playerHP -= enemyDmg;
        playerDamageTaken += enemyDmg;
        if (playerHP <= 0) break;
        if (player.spd < enemy.spd) {
            const dmg = calculateDamage(player, enemy, Math.random() * 100 < player.crit);
            enemyHP -= dmg;
        }
    }
    return { won: playerHP > 0, playerHP: Math.max(0, playerHP), damageTaken: playerDamageTaken };
}

function runFullSimulation(characterType) {
    const player = { ...characters[characterType] };
    let totalCombats = 0, combatsWon = 0, totalDamageTaken = 0, deaths = 0, potionsUsed = 0;

    for (let i = 0; i < 10; i++) {
        const enemyTypes = Object.keys(enemies);
        const enemy = { ...enemies[enemyTypes[Math.floor(Math.random() * enemyTypes.length)]] };
        totalCombats++;
        const result = simulateCombat(player, enemy);

        if (result.won) {
            combatsWon++;
            player.hp = result.playerHP;
            totalDamageTaken += result.damageTaken;
            if (player.hp / characters[characterType].hp < 0.4 && player.potions > 0) {
                player.hp = Math.min(player.hp + 50, characters[characterType].hp);
                player.potions--;
                potionsUsed++;
            }
        } else {
            deaths++;
            break;
        }
    }

    return {
        character: characterType,
        combatsWon,
        totalCombats,
        deaths,
        avgDamagePerCombat: totalCombats > 0 ? Math.round(totalDamageTaken / totalCombats) : 0,
        finalHP: player.hp,
        potionsUsed
    };
}

const simulations = [];
const characterTypes = ['warrior', 'sorceress', 'rogue'];

console.log('\n📊 Running 25 Simulations...\n');

for (let i = 1; i <= 25; i++) {
    const result = runFullSimulation(characterTypes[(i - 1) % 3]);
    simulations.push(result);
    const status = result.deaths === 0 ? '✅ SURVIVED' : '💀 DIED';
    const hpInfo = result.deaths === 0 ? `Final HP: ${result.finalHP}` : '';
    const potions = result.potionsUsed > 0 ? `${result.potionsUsed} potions` : '';
    console.log(`Sim ${String(i).padStart(2)}: ${result.character.padEnd(10)} | ${status} | ${result.combatsWon}/10 | Avg Dmg: ${result.avgDamagePerCombat}/turn | ${hpInfo} ${potions}`);
}

console.log('\n' + '='.repeat(70));
console.log('📈 ANALYSIS\n');

const survived = simulations.filter(s => s.deaths === 0).length;
const died = 25 - survived;
const survivalRate = Math.round((survived/25)*100);

console.log(`Total Simulations:  25`);
console.log(`Survived Floor 1:   ${survived}/25 (${survivalRate}%)`);
console.log(`Died on Floor 1:    ${died}/25 (${Math.round((died/25)*100)}%)`);

console.log('\n' + '='.repeat(70));
console.log('⚖️  BALANCE ASSESSMENT\n');
console.log(`Target Survival Rate: 65%`);
console.log(`Actual Survival Rate: ${survivalRate}%`);
console.log(`Difference:           ${survivalRate > 65 ? '+' : ''}${survivalRate - 65}%`);

if (survivalRate >= 55 && survivalRate <= 75) {
    console.log('\n✅ EXCELLENT: Balance is perfect for a roguelike!');
    console.log('   🎉 READY FOR PRODUCTION!');
} else if (survivalRate > 75) {
    console.log('\n⚠️  WARNING: Slightly too easy');
} else if (survivalRate < 45) {
    console.log('\n⚠️  WARNING: Too difficult');
} else {
    console.log('\n✅ GOOD: Balance is acceptable');
}

console.log('\n✨ V.39.2 FINAL Balance Complete!\n');
