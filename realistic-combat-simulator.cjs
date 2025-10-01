#!/usr/bin/env node
/**
 * REALISTIC COMBAT SIMULATOR
 *
 * This simulator models ACTUAL gameplay including:
 * - Resource consumption and regeneration
 * - Ability usage vs basic attacks
 * - Potion usage (HP and Resource potions)
 * - Buff selection and effects
 * - Strategic decision making
 *
 * This replaces the basic simulators which only tested damage calculations.
 */

console.log('🎮 REALISTIC COMBAT SIMULATOR - Full Feature Modeling\n');
console.log('='.repeat(70));

// ===== CONFIGURATION =====
const CHARACTERS = {
    warrior: {
        id: 'warrior',
        hp: 115, resource: 55, atk: 13, def: 11, spd: 6, crit: 12, // BUFFED
        resourceType: 'Vigor',
        abilityId: 'shield_bash',
        abilityCost: 12,
        abilityDamageMultiplier: 0.9,
        growth: { hp: 6, resource: 2, atk: 1.2, def: 1.8, spd: 0.4, crit: 0.2 }
    },
    sorceress: {
        id: 'sorceress',
        hp: 95, resource: 80, atk: 15, def: 7, spd: 7, crit: 14, // BUFFED
        resourceType: 'Mana',
        abilityId: 'fireball',
        abilityCost: 20,
        abilityDamageMultiplier: 0.8, // AOE, hits all
        isAOE: true,
        growth: { hp: 4, resource: 2.5, atk: 1.4, def: 0.6, spd: 0.6, crit: 0.4 }
    },
    rogue: {
        id: 'rogue',
        hp: 90, resource: 60, atk: 13, def: 7, spd: 9, crit: 14, // NERFED
        resourceType: 'Energy',
        abilityId: 'venom_strike',
        abilityCost: 15,
        abilityDamageMultiplier: 1.3,
        growth: { hp: 5, resource: 2.2, atk: 1.5, def: 0.9, spd: 0.8, crit: 0.6 }
    }
};

const BASE_ENEMIES = {
    goblin: { hp: 52, atk: 10, def: 3, spd: 6, crit: 5, xp: 20, gold: [2, 5] },
    slime: { hp: 59, atk: 9, def: 8, spd: 3, crit: 3, xp: 25, gold: [3, 6] },
    orcBrute: { hp: 78, atk: 14, def: 5, spd: 5, crit: 8, xp: 35, gold: [5, 10] }
};

// ===== POTION CONFIGURATION =====
const STARTING_POTIONS = {
    hp: 3,           // 3x HP potions (50 HP each)
    resource: 2      // 2x Resource potions (40 resource each)
};

const POTION_VALUES = {
    hp: 50,
    resource: 40
};

// ===== BUFF SYSTEM =====
const BUFFS = {
    berserker_rage: { type: 'attack_boost', value: 1.25 },      // +25% ATK
    precision_strike: { type: 'crit_boost', value: 15 },        // +15% crit
    swift_reflexes: { type: 'speed_boost', value: 1.30 },       // +30% SPD
    iron_skin: { type: 'defense_boost', value: 1.40 },          // +40% DEF
    vampiric_aura: { type: 'vampiric', value: 0.20 },           // 20% lifesteal
    mana_surge: { type: 'resource_regen_boost', value: 1.50 },  // +50% regen
    battle_focus: { type: 'cost_reduction', value: 0.25 },      // -25% cost
    lucky_strikes: { type: 'resource_save', value: 0.20 },      // 20% save chance
    second_wind: { type: 'turn_heal', value: 15 }               // 15 HP per turn
};

// ===== HELPERS =====
function rng(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function xpForLevel(level) {
    return 100 + (level - 1) * 120; // Updated XP curve
}

function scaleEnemy(baseEnemy, floor) {
    const scaleFactor = 1 + (floor - 1) * 0.03; // 3% per floor
    return {
        hp: Math.ceil(baseEnemy.hp * scaleFactor),
        maxHp: Math.ceil(baseEnemy.hp * scaleFactor),
        atk: Math.ceil(baseEnemy.atk * scaleFactor),
        def: Math.ceil(baseEnemy.def * scaleFactor),
        spd: baseEnemy.spd,
        crit: baseEnemy.crit,
        xp: Math.ceil(baseEnemy.xp * scaleFactor),
        gold: baseEnemy.gold
    };
}

function calculateDamage(attacker, defender, isCrit = false, multiplier = 1.0) {
    let dmg = Math.floor((attacker.atk * attacker.atk) / (attacker.atk + defender.def) || 1);
    dmg = Math.floor(dmg * multiplier);
    if (isCrit) dmg = Math.floor(dmg * 1.6);
    return Math.max(1, dmg);
}

function applyBuff(player, buff) {
    switch (buff.type) {
        case 'attack_boost':
            player.atk = Math.floor(player.atk * buff.value);
            break;
        case 'defense_boost':
            player.def = Math.floor(player.def * buff.value);
            break;
        case 'speed_boost':
            player.spd = Math.floor(player.spd * buff.value);
            break;
        case 'crit_boost':
            player.crit += buff.value;
            break;
    }
}

// ===== REALISTIC COMBAT SIMULATION =====
function simulateCombat(player, enemies, potions) {
    let playerHP = player.hp;
    let resource = player.resource;
    const maxHP = player.hp;
    const maxResource = player.resource;
    let turns = 0;
    let damageTaken = 0;
    let potionsUsed = { hp: 0, resource: 0 };

    // Resource regeneration per turn
    const baseRegen = 8;
    const resourceRegen = player.activeBuff?.type === 'resource_regen_boost'
        ? Math.floor(baseRegen * player.activeBuff.value)
        : baseRegen;

    // Ability cost after buffs
    let abilityCost = player.abilityCost;
    if (player.activeBuff?.type === 'cost_reduction') {
        abilityCost = Math.floor(abilityCost * (1 - player.activeBuff.value));
    }

    while (playerHP > 0 && enemies.some(e => e.hp > 0) && turns < 100) {
        turns++;

        // === PLAYER TURN ===
        // Turn start: buff healing
        if (player.activeBuff?.type === 'turn_heal') {
            const heal = Math.min(player.activeBuff.value, maxHP - playerHP);
            playerHP += heal;
        }

        // Regenerate resource
        resource = Math.min(maxResource, resource + resourceRegen);

        // Strategy: Use potion if HP < 30% or resource < ability cost
        if (playerHP < maxHP * 0.3 && potions.hp > 0) {
            playerHP = Math.min(maxHP, playerHP + POTION_VALUES.hp);
            potions.hp--;
            potionsUsed.hp++;
        }
        if (resource < abilityCost && potions.resource > 0) {
            resource = Math.min(maxResource, resource + POTION_VALUES.resource);
            potions.resource--;
            potionsUsed.resource++;
        }

        // Decide: Use ability or basic attack?
        const useAbility = resource >= abilityCost;
        let totalDamage = 0;

        if (useAbility) {
            // Use ability
            resource -= abilityCost;

            // Lucky strikes: 20% chance to save resource
            if (player.activeBuff?.type === 'resource_save' && Math.random() < player.activeBuff.value) {
                resource += abilityCost; // Refund
            }

            if (player.isAOE) {
                // AOE ability (Fireball)
                enemies.forEach(enemy => {
                    if (enemy.hp > 0) {
                        const isCrit = Math.random() * 100 < player.crit;
                        const dmg = calculateDamage(player, enemy, isCrit, player.abilityDamageMultiplier);
                        enemy.hp = Math.max(0, enemy.hp - dmg);
                        totalDamage += dmg;
                    }
                });
            } else {
                // Single target ability
                const target = enemies.find(e => e.hp > 0);
                if (target) {
                    const isCrit = Math.random() * 100 < player.crit;
                    const dmg = calculateDamage(player, target, isCrit, player.abilityDamageMultiplier);
                    target.hp = Math.max(0, target.hp - dmg);
                    totalDamage = dmg;
                }
            }
        } else {
            // Basic attack
            const target = enemies.find(e => e.hp > 0);
            if (target) {
                const isCrit = Math.random() * 100 < player.crit;
                const dmg = calculateDamage(player, target, isCrit);
                target.hp = Math.max(0, target.hp - dmg);
                totalDamage = dmg;
            }
        }

        // Vampiric buff: heal from damage
        if (player.activeBuff?.type === 'vampiric' && totalDamage > 0) {
            const heal = Math.min(Math.floor(totalDamage * player.activeBuff.value), maxHP - playerHP);
            playerHP += heal;
        }

        // === ENEMY TURNS ===
        enemies.forEach(enemy => {
            if (enemy.hp > 0 && playerHP > 0) {
                const enemyDmg = calculateDamage(enemy, player);
                playerHP -= enemyDmg;
                damageTaken += enemyDmg;
            }
        });
    }

    const victory = playerHP > 0;
    return { victory, playerHP, turns, damageTaken, potionsUsed };
}

// ===== FLOOR SIMULATION =====
function simulateFloor(character, floor, potions) {
    const player = {
        hp: character.hp + (floor - 1) * character.growth.hp,
        maxHp: character.hp + (floor - 1) * character.growth.hp,
        resource: character.resource + (floor - 1) * character.growth.resource,
        maxResource: character.resource + (floor - 1) * character.growth.resource,
        atk: character.atk + (floor - 1) * character.growth.atk,
        def: character.def + (floor - 1) * character.growth.def,
        spd: character.spd + (floor - 1) * character.growth.spd,
        crit: character.crit + (floor - 1) * character.growth.crit,
        abilityCost: character.abilityCost,
        abilityDamageMultiplier: character.abilityDamageMultiplier,
        isAOE: character.isAOE || false
    };

    // Random buff selection
    const buffKeys = Object.keys(BUFFS);
    const selectedBuff = BUFFS[buffKeys[Math.floor(Math.random() * buffKeys.length)]];
    player.activeBuff = selectedBuff;
    applyBuff(player, selectedBuff);

    // Generate encounter
    const enemyTypes = Object.values(BASE_ENEMIES);
    const numEnemies = floor >= 5 ? (Math.random() < 0.2 ? 3 : 2) : (Math.random() < 0.3 + floor * 0.1 ? 2 : 1);

    const enemies = [];
    for (let i = 0; i < numEnemies; i++) {
        const baseEnemy = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
        enemies.push(scaleEnemy(baseEnemy, floor));
    }

    return simulateCombat(player, enemies, { ...potions });
}

// ===== RUN SIMULATIONS =====
function runSimulations(characterId, maxFloor = 30, runs = 1000) {
    const character = CHARACTERS[characterId];
    console.log(`\n${'='.repeat(70)}`);
    console.log(`Simulating: ${characterId.toUpperCase()} (${character.resourceType})`);
    console.log(`Ability: ${character.abilityId} (Cost: ${character.abilityCost} ${character.resourceType})`);
    console.log(`Runs: ${runs} | Max Floor: ${maxFloor}`);
    console.log(`Starting Potions: ${STARTING_POTIONS.hp} HP, ${STARTING_POTIONS.resource} Resource`);
    console.log(`${'='.repeat(70)}`);

    const stats = {
        totalRuns: 0,
        wins: 0,
        losses: 0,
        avgTurns: 0,
        avgPotionsUsed: { hp: 0, resource: 0 },
        floorDeaths: {},
        avgFloorReached: 0
    };

    for (let run = 0; run < runs; run++) {
        let currentFloor = 1;
        let potions = { ...STARTING_POTIONS };
        let gameOver = false;

        while (currentFloor <= maxFloor && !gameOver) {
            const result = simulateFloor(character, currentFloor, potions);

            potions.hp -= result.potionsUsed.hp;
            potions.resource -= result.potionsUsed.resource;

            stats.avgTurns += result.turns;
            stats.avgPotionsUsed.hp += result.potionsUsed.hp;
            stats.avgPotionsUsed.resource += result.potionsUsed.resource;

            if (!result.victory) {
                stats.losses++;
                stats.floorDeaths[currentFloor] = (stats.floorDeaths[currentFloor] || 0) + 1;
                stats.avgFloorReached += currentFloor;
                gameOver = true;
            } else {
                currentFloor++;
                if (currentFloor > maxFloor) {
                    stats.wins++;
                    stats.avgFloorReached += maxFloor;
                }
            }
        }
        stats.totalRuns++;
    }

    // Calculate averages
    stats.avgTurns = (stats.avgTurns / stats.totalRuns).toFixed(1);
    stats.avgPotionsUsed.hp = (stats.avgPotionsUsed.hp / stats.totalRuns).toFixed(1);
    stats.avgPotionsUsed.resource = (stats.avgPotionsUsed.resource / stats.totalRuns).toFixed(1);
    stats.avgFloorReached = (stats.avgFloorReached / stats.totalRuns).toFixed(1);
    stats.winRate = ((stats.wins / stats.totalRuns) * 100).toFixed(1);

    // Print results
    console.log(`\n📊 RESULTS:`);
    console.log(`   Wins: ${stats.wins}/${stats.totalRuns} (${stats.winRate}%)`);
    console.log(`   Avg Floor Reached: ${stats.avgFloorReached}`);
    console.log(`   Avg Turns per Battle: ${stats.avgTurns}`);
    console.log(`   Avg Potions Used: ${stats.avgPotionsUsed.hp} HP, ${stats.avgPotionsUsed.resource} Resource`);

    console.log(`\n💀 Death Distribution (Top 10 Floors):`);
    const sortedDeaths = Object.entries(stats.floorDeaths).sort((a, b) => b[1] - a[1]).slice(0, 10);
    sortedDeaths.forEach(([floor, deaths]) => {
        const percent = ((deaths / stats.totalRuns) * 100).toFixed(1);
        console.log(`   Floor ${floor}: ${deaths} deaths (${percent}%)`);
    });

    return stats;
}

// ===== MAIN =====
console.log('\n🎯 Starting Realistic Combat Simulations...\n');

const results = {};
['warrior', 'sorceress', 'rogue'].forEach(charId => {
    results[charId] = runSimulations(charId, 30, 1000);
});

console.log(`\n${'='.repeat(70)}`);
console.log('📈 COMPARISON SUMMARY');
console.log(`${'='.repeat(70)}`);
console.log('Character      | Win Rate | Avg Floor | Avg Turns | HP Potions | Resource Potions');
console.log('-'.repeat(70));
Object.entries(results).forEach(([charId, stats]) => {
    console.log(`${charId.padEnd(14)} | ${(stats.winRate + '%').padEnd(8)} | ${stats.avgFloorReached.padEnd(9)} | ${stats.avgTurns.padEnd(9)} | ${stats.avgPotionsUsed.hp.padEnd(10)} | ${stats.avgPotionsUsed.resource}`);
});
console.log('='.repeat(70));

console.log('\n✅ Simulation complete!');
console.log('💡 This simulator models realistic gameplay with resources, abilities, potions, and buffs.');
