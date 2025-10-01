// filename: src/systems/ultimate-system.js

import { GameState } from '../core/state.js';
import Logger from '../core/logger.js';
import { t } from '../core/localization.js';

/**
 * Ultimate Gauge system for powerful finisher abilities
 */
export class UltimateSystem {

    /**
     * Initialize ultimate gauge for player
     */
    static initializeUltimateGauge() {
        if (!GameState.current.player.ultimate) {
            GameState.current.player.ultimate = {
                current: 0,
                max: 100,
                ready: false
            };
            Logger.log('Ultimate gauge initialized', 'COMBAT');
        }
    }

    /**
     * Add ultimate points
     */
    static addUltimatePoints(amount, reason, onLog) {
        this.initializeUltimateGauge();

        const ultimate = GameState.current.player.ultimate;
        const oldValue = ultimate.current;

        ultimate.current = Math.min(ultimate.max, ultimate.current + amount);
        ultimate.ready = ultimate.current >= ultimate.max;

        if (onLog && amount > 0) {
            onLog(`⚡ +${amount} Ultimate! (${oldValue} → ${ultimate.current}/${ultimate.max})`);
        }

        Logger.log(`Ultimate: +${amount} from ${reason} (${oldValue} → ${ultimate.current})`, 'COMBAT');

        if (ultimate.ready && oldValue < ultimate.max) {
            if (onLog) {
                onLog(`💥 ULTIMATE READY! 💥`);
            }
            Logger.log('Ultimate gauge READY!', 'COMBAT');
        }

        GameState._notify();
    }

    /**
     * Use ultimate ability
     */
    static useUltimate(characterId, targets, combatSystem, onLog) {
        this.initializeUltimateGauge();

        const ultimate = GameState.current.player.ultimate;

        if (!ultimate.ready || ultimate.current < ultimate.max) {
            if (onLog) {
                onLog('❌ Ultimate not ready!');
            }
            return false;
        }

        // Get ultimate ability based on character
        const ultimateAbility = this.getUltimateAbility(characterId);
        if (!ultimateAbility) {
            Logger.log(`No ultimate ability found for character: ${characterId}`, 'ERROR');
            return false;
        }

        // Execute ultimate
        this.executeUltimate(ultimateAbility, targets, combatSystem, onLog);

        // Consume ultimate gauge
        ultimate.current = 0;
        ultimate.ready = false;

        GameState._notify();
        return true;
    }

    /**
     * Get ultimate ability for character
     */
    static getUltimateAbility(characterId) {
        const ultimates = {
            warrior: {
                id: 'titans_wrath',
                name: { en: "Titan's Wrath", ar: 'غضب الجبار' },
                description: { en: 'Deal 300% damage to all enemies + heal 30% max HP', ar: 'اصنع 300% ضرر لجميع الأعداء + استعادة 30% من الصحة القصوى' },
                element: 'fire',
                damageMultiplier: 3.0,
                targetAll: true,
                selfHeal: 0.3,
                icon: '🔥⚔️'
            },
            sorceress: {
                id: 'elemental_cataclysm',
                name: { en: 'Elemental Cataclysm', ar: 'كارثة عنصرية' },
                description: { en: 'Deal 250% damage to all enemies, hits ALL weaknesses', ar: 'اصنع 250% ضرر لجميع الأعداء، يصيب كل نقاط الضعف' },
                element: 'multi',
                damageMultiplier: 2.5,
                targetAll: true,
                hitsAllWeaknesses: true,
                icon: '⚡❄️🔥'
            },
            rogue: {
                id: 'shadow_assassination',
                name: { en: 'Shadow Assassination', ar: 'اغتيال الظل' },
                description: { en: 'Deal 500% damage to single target + Death Mark (50% bonus damage for 2 turns)', ar: 'اصنع 500% ضرر لهدف واحد + علامة الموت (50% ضرر إضافي لمدة دورتين)' },
                element: 'shadow',
                damageMultiplier: 5.0,
                targetAll: false,
                deathMark: true,
                icon: '🌑💀'
            }
        };

        return ultimates[characterId] || null;
    }

    /**
     * Execute ultimate ability
     */
    static executeUltimate(ultimate, targets, combatSystem, onLog) {
        const player = GameState.current.player;
        const ultimateName = typeof ultimate.name === 'string' ? ultimate.name : ultimate.name.en;

        // Visual/audio cue
        if (onLog) {
            onLog(`═══════════════════════════════`);
            onLog(`💥💥💥 ${ultimateName.toUpperCase()}! 💥💥💥`);
            onLog(`═══════════════════════════════`);
        }

        Logger.log(`ULTIMATE: ${ultimateName} activated!`, 'COMBAT');

        // Get targets
        const enemyTargets = ultimate.targetAll
            ? GameState.current.enemies.filter(e => e.isAlive)
            : [targets[0]]; // Single target (focused enemy)

        // Deal damage to each target
        enemyTargets.forEach(enemy => {
            if (!enemy || !enemy.isAlive) return;

            // Calculate ultimate damage
            let baseDamage = combatSystem.calculateDamage(player, enemy, ultimate.damageMultiplier);

            // Apply to enemy
            enemy.stats.hp = Math.max(0, enemy.stats.hp - baseDamage);

            const enemyName = enemy.level ? `Lv.${enemy.level} ${enemy.nameKey ? t(enemy.nameKey) : 'Enemy'}` : (enemy.nameKey ? t(enemy.nameKey) : 'Enemy');

            if (onLog) {
                onLog(`${ultimate.icon} ${enemyName} takes ${baseDamage} damage!`);
            }

            // Check if hits all weaknesses (auto-break)
            if (ultimate.hitsAllWeaknesses && enemy.breakData && !enemy.breakData.isBroken) {
                // Import BreakSystem if needed
                const { BreakSystem } = require('./break-system.js');
                enemy.breakData.currentToughness = 0;
                BreakSystem.breakEnemy(enemy, ultimate.element, onLog);
            }

            // Apply Death Mark if applicable
            if (ultimate.deathMark) {
                enemy.statusEffects = enemy.statusEffects || [];
                enemy.statusEffects.push({
                    type: 'death_mark',
                    multiplier: 1.5, // 50% bonus damage
                    duration: 2,
                    icon: '💀'
                });
                if (onLog) {
                    onLog(`💀 ${enemyName} marked for death! (+50% damage for 2 turns)`);
                }
            }

            // Check if defeated
            if (enemy.stats.hp <= 0) {
                combatSystem.killUnit(enemy);
            }
        });

        // Self heal if applicable
        if (ultimate.selfHeal) {
            const healAmount = Math.floor(player.maxStats.hp * ultimate.selfHeal);
            player.stats.hp = Math.min(player.maxStats.hp, player.stats.hp + healAmount);

            if (onLog) {
                onLog(`💚 Healed ${healAmount} HP! (${player.stats.hp}/${player.maxStats.hp})`);
            }
        }

        if (onLog) {
            onLog(`═══════════════════════════════`);
        }

        GameState._notify();
    }

    /**
     * Reset ultimate gauge (at start of battle)
     */
    static resetUltimateGauge() {
        if (!GameState.current.player.ultimate) {
            this.initializeUltimateGauge();
        } else {
            GameState.current.player.ultimate.current = 0;
            GameState.current.player.ultimate.ready = false;
            Logger.log('Ultimate gauge reset for new battle', 'COMBAT');
        }
    }

    /**
     * Check if ultimate is ready
     */
    static isUltimateReady() {
        this.initializeUltimateGauge();
        return GameState.current.player.ultimate.ready;
    }

    /**
     * Get ultimate gauge percentage
     */
    static getUltimatePercentage() {
        this.initializeUltimateGauge();
        const ultimate = GameState.current.player.ultimate;
        return Math.floor((ultimate.current / ultimate.max) * 100);
    }

    /**
     * Get ultimate bar color based on charge level
     */
    static getUltimateBarColor() {
        const percent = this.getUltimatePercentage();

        if (percent >= 100) return '#ffd700'; // Gold (ready)
        if (percent >= 67) return '#ffff44'; // Yellow
        if (percent >= 34) return '#ff8844'; // Orange
        return '#ff4444'; // Red
    }
}

/**
 * Ultimate point gain amounts
 */
export const UltimatePointGains = {
    BASIC_ATTACK: 10,
    USE_ABILITY: 15,
    TAKE_DAMAGE: 8,
    BREAK_ENEMY: 25,
    PERFECT_TURN: 5,
    ALLY_DEFEATED: 50 // For future party system
};
