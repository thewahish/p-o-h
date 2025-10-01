// filename: realistic-combat-simulator-v2.cjs
/**
 * Comprehensive Combat Simulator V2
 * Based on MASTER_SIMULATION_SPEC.md
 * Tests resource regeneration balance with complete game systems
 */

const fs = require('fs');

// ==================== CONFIGURATION ====================

const SCENARIOS = {
    C: { base: 4, perLevel: 0.5, name: 'Scenario C (4 base + 0.5/level) - PRIORITY TEST' }
};

const CHARACTERS = {
    warrior: {
        name: 'Warrior (Taha)',
        hp: 100,
        maxHp: 100,
        resource: 50,
        maxResource: 50,
        resourceName: 'Vigor',
        atk: 15,
        def: 12,
        spd: 8,
        crit: 5,
        abilities: {
            power_strike: { cost: 8, damageMultiplier: 1.5, target: 'single' },
            shield_bash: { cost: 12, damageMultiplier: 0.9, target: 'single', effect: 'weaken' }
        },
        hpPerLevel: 15,
        resourcePerLevel: 5,
        atkPerLevel: 3,
        defPerLevel: 2,
        spdPerLevel: 1
    },
    sorceress: {
        name: 'Sorceress (Mais)',
        hp: 80,
        maxHp: 80,
        resource: 70,
        maxResource: 70,
        resourceName: 'Mana',
        atk: 18,
        def: 8,
        spd: 10,
        crit: 8,
        abilities: {
            power_strike: { cost: 8, damageMultiplier: 1.5, target: 'single' },
            fireball: { cost: 20, damageMultiplier: 0.8, target: 'all' }
        },
        hpPerLevel: 12,
        resourcePerLevel: 7,
        atkPerLevel: 4,
        defPerLevel: 1.5,
        spdPerLevel: 1.5
    },
    rogue: {
        name: 'Rogue (Ibrahim)',
        hp: 90,
        maxHp: 90,
        resource: 60,
        maxResource: 60,
        resourceName: 'Energy',
        atk: 16,
        def: 10,
        spd: 12,
        crit: 12,
        abilities: {
            power_strike: { cost: 8, damageMultiplier: 1.5, target: 'single' },
            venom_strike: { cost: 15, damageMultiplier: 1.3, target: 'single', effect: 'poison' }
        },
        hpPerLevel: 13,
        resourcePerLevel: 6,
        atkPerLevel: 3.5,
        defPerLevel: 2,
        spdPerLevel: 2
    }
};

const BUFFS = {
    berserker_rage: { stat: 'atk', multiplier: 1.25 },
    precision_strike: { stat: 'crit', bonus: 15 },
    swift_reflexes: { stat: 'spd', multiplier: 1.3 },
    iron_skin: { stat: 'def', multiplier: 1.4 },
    vampiric_aura: { type: 'vampiric', percentage: 20 },
    mana_surge: { type: 'resource_boost', multiplier: 1.5 },
    battle_focus: { type: 'cost_reduction', percentage: 25 },
    lucky_strikes: { type: 'resource_save', chance: 20 },
    second_wind: { type: 'regeneration', amount: 15 }
};

const STARTING_POTIONS = {
    hp: 3,
    resource: 2
};

const POTION_VALUES = {
    hp: 50,
    resource: 40
};

// ==================== UTILITY FUNCTIONS ====================

function calculateDamage(attacker, defender) {
    const atk = attacker.atk;
    const def = defender.def;
    const baseDamage = (atk * atk) / (atk + def);

    // Crit check
    const isCrit = Math.random() * 100 < attacker.crit;
    const critMultiplier = isCrit ? 1.6 : 1.0;

    return Math.floor(baseDamage * critMultiplier);
}

function applyBuff(player, buffKey) {
    const buff = BUFFS[buffKey];
    if (!buff) return;

    if (buff.stat && buff.multiplier) {
        player[buff.stat] = Math.floor(player[buff.stat] * buff.multiplier);
    } else if (buff.stat && buff.bonus) {
        player[buff.stat] += buff.bonus;
    }

    player.activeBuff = { key: buffKey, ...buff };
}

function generateEnemy(floor, isElite = false, isBoss = false) {
    let baseHp = 30;
    let baseAtk = 10;
    let baseDef = 8;
    let baseSpd = 7;

    // Floor scaling: 3% per floor compounding
    const floorMultiplier = Math.pow(1.03, floor - 1);

    if (isElite) {
        baseHp *= 1.5;
        baseAtk *= 1.5;
        baseDef *= 1.3;
        baseSpd *= 1.2;

        // Elite bonus: 50% base + 10% per floor
        const eliteBonus = 1 + (0.5 + (floor * 0.1));
        baseHp = Math.floor(baseHp * eliteBonus);
        baseAtk = Math.floor(baseAtk * eliteBonus);
    }

    if (isBoss) {
        baseHp *= 2.0;
        baseAtk *= 1.5;
        baseDef *= 1.4;
        baseSpd *= 1.3;

        // Boss bonus: 80% base + 15% per floor
        const bossBonus = 1 + (0.8 + (floor * 0.15));
        baseHp = Math.floor(baseHp * bossBonus);
        baseAtk = Math.floor(baseAtk * bossBonus);
    }

    return {
        hp: Math.floor(baseHp * floorMultiplier),
        maxHp: Math.floor(baseHp * floorMultiplier),
        atk: Math.floor(baseAtk * floorMultiplier),
        def: Math.floor(baseDef * floorMultiplier),
        spd: Math.floor(baseSpd * floorMultiplier),
        crit: 5,
        isElite,
        isBoss
    };
}

function shouldUseAbility(player, enemies, scenario) {
    // Strategic ability usage targeting 30-40% of turns

    // Don't use if insufficient resource
    const abilities = Object.values(player.abilities);
    const canAffordAny = abilities.some(a => {
        const cost = player.activeBuff?.type === 'cost_reduction'
            ? Math.floor(a.cost * 0.75)
            : a.cost;
        return player.resource >= cost;
    });

    if (!canAffordAny) return null;

    // Strategic conditions for ability use:
    // 1. Multiple enemies (AOE)
    // 2. High HP enemy (single target nuke)
    // 3. Elite/Boss (debuff/poison)
    // 4. Resource > 50% (use before capping)

    const multipleEnemies = enemies.length > 1;
    const strongEnemy = enemies.some(e => e.hp > 80 || e.isElite || e.isBoss);
    const resourceAboveHalf = player.resource > player.maxResource * 0.5;

    // Use abilities 30-40% of the time strategically
    const strategicUse = (multipleEnemies || strongEnemy || resourceAboveHalf) && Math.random() < 0.35;

    if (!strategicUse) return null;

    // Choose best ability
    if (multipleEnemies && player.abilities.fireball) {
        const cost = player.activeBuff?.type === 'cost_reduction'
            ? Math.floor(player.abilities.fireball.cost * 0.75)
            : player.abilities.fireball.cost;
        if (player.resource >= cost) return 'fireball';
    }

    if (strongEnemy) {
        if (player.abilities.venom_strike) {
            const cost = player.activeBuff?.type === 'cost_reduction'
                ? Math.floor(player.abilities.venom_strike.cost * 0.75)
                : player.abilities.venom_strike.cost;
            if (player.resource >= cost) return 'venom_strike';
        }
        if (player.abilities.shield_bash) {
            const cost = player.activeBuff?.type === 'cost_reduction'
                ? Math.floor(player.abilities.shield_bash.cost * 0.75)
                : player.abilities.shield_bash.cost;
            if (player.resource >= cost) return 'shield_bash';
        }
    }

    // Default to power strike
    const cost = player.activeBuff?.type === 'cost_reduction'
        ? Math.floor(player.abilities.power_strike.cost * 0.75)
        : player.abilities.power_strike.cost;
    if (player.resource >= cost) return 'power_strike';

    return null;
}

function shouldUsePotion(player, potions, inCombat) {
    // HP potion if HP < 30%
    if (player.hp < player.maxHp * 0.3 && potions.hp > 0) {
        return 'hp';
    }

    // Resource potion if in combat and resource < 20% and no abilities can be used
    if (inCombat && player.resource < player.maxResource * 0.2 && potions.resource > 0) {
        return 'resource';
    }

    return null;
}

// ==================== COMBAT SIMULATION ====================

function simulateBattle(player, enemies, potions, scenario, stats) {
    let turn = 0;
    const maxTurns = 50;

    while (turn < maxTurns && player.hp > 0 && enemies.some(e => e.hp > 0)) {
        turn++;
        stats.totalTurns++;

        // Player turn - resource regeneration first
        const baseRegen = scenario.base;
        const levelBonus = (player.level - 1) * scenario.perLevel;
        let resourceRegen = Math.floor(baseRegen + levelBonus);

        if (player.activeBuff?.type === 'resource_boost') {
            resourceRegen = Math.floor(resourceRegen * player.activeBuff.multiplier);
        }

        player.resource = Math.min(player.maxResource, player.resource + resourceRegen);

        // Second Wind healing
        if (player.activeBuff?.type === 'regeneration') {
            const heal = Math.min(player.activeBuff.amount, player.maxHp - player.hp);
            player.hp += heal;
        }

        // Check for potion use
        const potionType = shouldUsePotion(player, potions, true);
        if (potionType) {
            if (potionType === 'hp') {
                player.hp = Math.min(player.maxHp, player.hp + POTION_VALUES.hp);
                potions.hp--;
                stats.potionsUsed.hp++;
            } else if (potionType === 'resource') {
                player.resource = Math.min(player.maxResource, player.resource + POTION_VALUES.resource);
                potions.resource--;
                stats.potionsUsed.resource++;
            }
        }

        // Decide: ability or basic attack
        const abilityKey = shouldUseAbility(player, enemies.filter(e => e.hp > 0), scenario);

        if (abilityKey) {
            const ability = player.abilities[abilityKey];
            let cost = ability.cost;

            if (player.activeBuff?.type === 'cost_reduction') {
                cost = Math.floor(cost * 0.75);
            }

            // Lucky Strikes check
            const luckyTrigger = player.activeBuff?.type === 'resource_save'
                && Math.random() * 100 < player.activeBuff.chance;

            if (!luckyTrigger) {
                player.resource -= cost;
            }

            stats.abilitiesUsed++;

            // Apply damage
            const aliveEnemies = enemies.filter(e => e.hp > 0);
            const targets = ability.target === 'all' ? aliveEnemies : [aliveEnemies[0]];

            targets.forEach(target => {
                const damage = Math.floor(calculateDamage(player, target) * ability.damageMultiplier);
                target.hp -= damage;

                // Vampiric healing
                if (player.activeBuff?.type === 'vampiric') {
                    const heal = Math.floor(damage * (player.activeBuff.percentage / 100));
                    player.hp = Math.min(player.maxHp, player.hp + heal);
                }
            });
        } else {
            // Basic attack
            const aliveEnemies = enemies.filter(e => e.hp > 0);
            if (aliveEnemies.length > 0) {
                const damage = calculateDamage(player, aliveEnemies[0]);
                aliveEnemies[0].hp -= damage;

                // Vampiric healing
                if (player.activeBuff?.type === 'vampiric') {
                    const heal = Math.floor(damage * (player.activeBuff.percentage / 100));
                    player.hp = Math.min(player.maxHp, player.hp + heal);
                }
            }
        }

        // Remove dead enemies
        const aliveBefore = enemies.filter(e => e.hp > 0).length;
        enemies = enemies.filter(e => e.hp > 0);

        // Check victory
        if (enemies.length === 0) {
            return { victory: true, turnsTaken: turn };
        }

        // Enemy turns
        enemies.forEach(enemy => {
            const damage = calculateDamage(enemy, player);
            player.hp -= damage;
        });

        // Check defeat
        if (player.hp <= 0) {
            return { victory: false, turnsTaken: turn };
        }
    }

    // Timeout = defeat
    return { victory: false, turnsTaken: turn };
}

// ==================== DUNGEON SIMULATION ====================

function simulateFloor(player, floor, potions, scenario, stats) {
    // 8 rooms per floor (7 battles + 1 boss)
    const rooms = [];

    // Determine special rooms
    const hasShrine = Math.random() < 0.15;
    const hasTreasure = Math.random() < 0.2;
    const numBattles = 7 - (hasShrine ? 1 : 0) - (hasTreasure ? 1 : 0);

    // Generate room types
    for (let i = 0; i < numBattles; i++) {
        const isElite = Math.random() < Math.min(0.3 + floor * 0.05, 0.5);
        rooms.push({ type: 'battle', isElite });
    }

    if (hasShrine) rooms.push({ type: 'shrine' });
    if (hasTreasure) rooms.push({ type: 'treasure' });
    rooms.push({ type: 'boss' });

    // Process rooms
    for (const room of rooms) {
        if (room.type === 'battle') {
            // Generate enemies
            const multiEnemyChance = Math.min(0.3 + floor * 0.1, 0.6);
            const numEnemies = Math.random() < multiEnemyChance ? 2 : 1;

            const enemies = [];
            for (let i = 0; i < numEnemies; i++) {
                enemies.push(generateEnemy(floor, room.isElite, false));
            }

            // Select buff
            const buffKeys = Object.keys(BUFFS);
            const selectedBuff = buffKeys[Math.floor(Math.random() * buffKeys.length)];
            applyBuff(player, selectedBuff);

            // Simulate battle
            const result = simulateBattle(player, enemies, potions, scenario, stats);

            if (!result.victory) {
                return { success: false, deathFloor: floor };
            }

            stats.battlesWon++;

            // XP and leveling
            const xpGained = 20 + (floor * 5);
            player.xp += xpGained;

            const xpNeeded = 70 + (player.level - 1) * 50;
            if (player.xp >= xpNeeded) {
                player.level++;
                player.xp -= xpNeeded;

                // Stat increases
                player.maxHp += player.hpPerLevel;
                player.hp = player.maxHp;
                player.maxResource += player.resourcePerLevel;
                player.resource = player.maxResource;
                player.atk += player.atkPerLevel;
                player.def += player.defPerLevel;
                player.spd += player.spdPerLevel;

                stats.levelUps++;
            }

        } else if (room.type === 'shrine') {
            // Shrine blessing
            const blessings = [
                { stat: 'maxHp', amount: 15 },
                { stat: 'atk', amount: 3 },
                { stat: 'def', amount: 2 },
                { stat: 'maxResource', amount: 10 }
            ];
            const blessing = blessings[Math.floor(Math.random() * blessings.length)];
            player[blessing.stat] += blessing.amount;
            if (blessing.stat === 'maxHp') player.hp = player.maxHp;
            if (blessing.stat === 'maxResource') player.resource = player.maxResource;

            stats.shrinesVisited++;

        } else if (room.type === 'treasure') {
            // Treasure loot - chance for potions
            if (Math.random() < 0.3) {
                potions.hp++;
                stats.potionsFound.hp++;
            }
            if (Math.random() < 0.2) {
                potions.resource++;
                stats.potionsFound.resource++;
            }

        } else if (room.type === 'boss') {
            // Boss battle
            const boss = generateEnemy(floor, false, true);

            // Select buff
            const buffKeys = Object.keys(BUFFS);
            const selectedBuff = buffKeys[Math.floor(Math.random() * buffKeys.length)];
            applyBuff(player, selectedBuff);

            const result = simulateBattle(player, [boss], potions, scenario, stats);

            if (!result.victory) {
                return { success: false, deathFloor: floor };
            }

            stats.bossesDefeated++;

            // Boss XP
            const xpGained = 50 + (floor * 10);
            player.xp += xpGained;

            const xpNeeded = 70 + (player.level - 1) * 50;
            if (player.xp >= xpNeeded) {
                player.level++;
                player.xp -= xpNeeded;

                player.maxHp += player.hpPerLevel;
                player.hp = player.maxHp;
                player.maxResource += player.resourcePerLevel;
                player.resource = player.maxResource;
                player.atk += player.atkPerLevel;
                player.def += player.defPerLevel;
                player.spd += player.spdPerLevel;

                stats.levelUps++;
            }
        }
    }

    // Floor complete - 25% HP restoration
    player.hp = Math.min(player.maxHp, player.hp + Math.floor(player.maxHp * 0.25));

    return { success: true };
}

// ==================== MAIN SIMULATION ====================

function simulateRun(characterKey, scenario) {
    const characterBase = CHARACTERS[characterKey];
    const player = {
        ...JSON.parse(JSON.stringify(characterBase)),
        level: 1,
        xp: 0
    };

    const potions = { ...STARTING_POTIONS };

    const stats = {
        totalTurns: 0,
        abilitiesUsed: 0,
        battlesWon: 0,
        bossesDefeated: 0,
        levelUps: 0,
        potionsUsed: { hp: 0, resource: 0 },
        potionsFound: { hp: 0, resource: 0 },
        shrinesVisited: 0
    };

    for (let floor = 1; floor <= 30; floor++) {
        const result = simulateFloor(player, floor, potions, scenario, stats);

        if (!result.success) {
            return {
                victory: false,
                deathFloor: result.deathFloor,
                finalLevel: player.level,
                ...stats
            };
        }
    }

    return {
        victory: true,
        deathFloor: 30,
        finalLevel: player.level,
        ...stats
    };
}

// ==================== RUN SIMULATIONS ====================

console.log('='.repeat(80));
console.log('COMPREHENSIVE COMBAT SIMULATOR V2');
console.log('Based on MASTER_SIMULATION_SPEC.md');
console.log('='.repeat(80));

const RUNS_PER_SCENARIO = 100;

Object.entries(SCENARIOS).forEach(([scenarioKey, scenario]) => {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`TESTING: ${scenario.name}`);
    console.log(`Resource Regen: ${scenario.base} base + ${scenario.perLevel}/level`);
    console.log(`${'='.repeat(80)}\n`);

    Object.keys(CHARACTERS).forEach(characterKey => {
        const characterName = CHARACTERS[characterKey].name;
        console.log(`\n${'-'.repeat(60)}`);
        console.log(`Character: ${characterName}`);
        console.log(`${'-'.repeat(60)}`);

        const results = [];

        // Run simulations
        for (let i = 0; i < RUNS_PER_SCENARIO; i++) {
            const result = simulateRun(characterKey, scenario);
            results.push(result);

            if ((i + 1) % 10 === 0) {
                process.stdout.write(`\rProgress: ${i + 1}/${RUNS_PER_SCENARIO} runs...`);
            }
        }
        console.log('\n');

        // Calculate statistics
        const victories = results.filter(r => r.victory).length;
        const winRate = (victories / RUNS_PER_SCENARIO * 100).toFixed(1);

        const avgDeathFloor = (results.reduce((sum, r) => sum + r.deathFloor, 0) / RUNS_PER_SCENARIO).toFixed(1);
        const avgLevel = (results.reduce((sum, r) => sum + r.finalLevel, 0) / RUNS_PER_SCENARIO).toFixed(1);
        const avgTurns = (results.reduce((sum, r) => sum + r.totalTurns, 0) / RUNS_PER_SCENARIO).toFixed(0);
        const avgAbilities = (results.reduce((sum, r) => sum + r.abilitiesUsed, 0) / RUNS_PER_SCENARIO).toFixed(0);
        const avgBattles = (results.reduce((sum, r) => sum + r.battlesWon, 0) / RUNS_PER_SCENARIO).toFixed(0);

        const abilityUsageRate = ((avgAbilities / avgTurns) * 100).toFixed(1);

        const avgHpPotions = (results.reduce((sum, r) => sum + r.potionsUsed.hp, 0) / RUNS_PER_SCENARIO).toFixed(1);
        const avgResourcePotions = (results.reduce((sum, r) => sum + r.potionsUsed.resource, 0) / RUNS_PER_SCENARIO).toFixed(1);

        // Print results
        console.log(`RESULTS (${RUNS_PER_SCENARIO} runs):`);
        console.log(`  Win Rate: ${winRate}% (${victories}/${RUNS_PER_SCENARIO}) [Target: 25-35%]`);
        console.log(`  Average Death Floor: ${avgDeathFloor}`);
        console.log(`  Average Final Level: ${avgLevel}`);
        console.log(`  Average Total Turns: ${avgTurns}`);
        console.log(`  Average Battles Won: ${avgBattles}`);
        console.log(`  Average Abilities Used: ${avgAbilities}`);
        console.log(`  Ability Usage Rate: ${abilityUsageRate}% [Target: 30-40%]`);
        console.log(`  Average HP Potions Used: ${avgHpPotions}`);
        console.log(`  Average Resource Potions Used: ${avgResourcePotions}`);

        // Determine if targets met
        const winRateGood = winRate >= 25 && winRate <= 35;
        const abilityRateGood = abilityUsageRate >= 30 && abilityUsageRate <= 40;

        console.log(`\n  STATUS:`);
        console.log(`    Win Rate: ${winRateGood ? '✓ PASS' : '✗ FAIL'}`);
        console.log(`    Ability Usage: ${abilityRateGood ? '✓ PASS' : '✗ FAIL'}`);
    });
});

console.log(`\n${'='.repeat(80)}`);
console.log('SIMULATION COMPLETE');
console.log(`${'='.repeat(80)}\n`);
