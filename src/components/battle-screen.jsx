// filename: src/components/battle-screen.jsx

import React, { useState, useEffect } from 'react';
import { GameState } from '../core/state';
import { GameConfig } from '../constants/config';
import Logger from '../core/logger';
import { t, Localization } from '../core/localization';
import { PotionSystem } from '../systems/potions';
import { UltimateSystem } from '../systems/ultimate-system';
import { getElement } from '../constants/elements';

export default function BattleScreen({ player, enemies: initialEnemies, combatSystem, combatLog }) {
    const [localLogs, setLocalLogs] = useState(combatLog || []);
    const [feedbackMessages, setFeedbackMessages] = useState([]);
    const [floatingNumbers, setFloatingNumbers] = useState([]);
    const [focusedTargetId, setFocusedTargetId] = useState(() => {
        const firstAliveEnemy = initialEnemies.find(e => e.isAlive);
        return firstAliveEnemy ? firstAliveEnemy.originalIndex : null;
    });

    // --- FIX: This effect now correctly detects when an enemy dies and retargets ---
    useEffect(() => {
        const enemies = GameState.current.enemies;
        const focusedEnemy = enemies.find(e => e.originalIndex === focusedTargetId);

        // If the focused target doesn't exist or is dead, find a new one
        if (!focusedEnemy || !focusedEnemy.isAlive) {
            const firstAlive = enemies.find(e => e.isAlive);
            const newTargetId = firstAlive ? firstAlive.originalIndex : null;
            if (focusedTargetId !== newTargetId) {
                Logger.log(`Target defeated or invalid. Auto-targeting next enemy: index ${newTargetId}.`, 'UI');
                setFocusedTargetId(newTargetId);
            }
        }
    }, [combatLog, focusedTargetId]); // Using combatLog as a trigger for re-evaluation
    
    useEffect(() => {
        setLocalLogs(combatLog);

        // Add new combat log message as fading feedback
        if (combatLog && combatLog.length > 0) {
            const latestMessage = combatLog[combatLog.length - 1];
            if (latestMessage) {
                addFeedbackMessage(latestMessage);

                // Parse combat message for damage numbers
                // Example: "You attack Goblin for 25 damage!" or "Critical Hit! 45 damage!"
                const damageMatch = latestMessage.match(/(\d+)\s*damage/i);
                const isCrit = /critical/i.test(latestMessage) || /💥/i.test(latestMessage);

                if (damageMatch && focusedTargetId !== null) {
                    const damage = parseInt(damageMatch[1], 10);
                    addFloatingNumber(focusedTargetId, damage, isCrit ? 'crit' : 'damage');
                }

                // Check for healing
                const healMatch = latestMessage.match(/heal(?:ed)?\s*(\d+)/i);
                if (healMatch) {
                    const heal = parseInt(healMatch[1], 10);
                    // Healing on player would need player entity ID, skip for now
                }
            }
        }
    }, [combatLog, focusedTargetId]);

    // Add fading feedback message
    const addFeedbackMessage = (text, duration = 2000) => {
        const id = Date.now() + Math.random();
        const newMessage = { id, text, timestamp: Date.now() };

        setFeedbackMessages(prev => {
            // Keep only last 3 messages to avoid clutter
            const updated = [...prev, newMessage].slice(-3);
            return updated;
        });

        // Auto-remove after duration
        setTimeout(() => {
            setFeedbackMessages(prev => prev.filter(m => m.id !== id));
        }, duration);
    };

    // Add floating damage number over enemy
    const addFloatingNumber = (entityId, value, type = 'damage') => {
        const id = Date.now() + Math.random();
        const newNumber = {
            id,
            entityId,
            value,
            type, // 'damage', 'heal', 'crit', 'miss'
            timestamp: Date.now()
        };

        setFloatingNumbers(prev => [...prev, newNumber]);

        // Auto-remove after animation (1.5s)
        setTimeout(() => {
            setFloatingNumbers(prev => prev.filter(n => n.id !== id));
        }, 1500);
    };

    const handleAttack = () => {
        if (focusedTargetId !== null) combatSystem.playerAttack(focusedTargetId);
    };

    const handleSkill = () => {
        if (focusedTargetId !== null) combatSystem.playerSkill(focusedTargetId);
    };

    const handleUsePotion = (potionType) => {
        if (!isPlayerTurn) return;
        const success = PotionSystem.usePotion(potionType);
        if (success) {
            const potionName = t(`items.${potionType}`);
            const message = t('combat.messages.usedPotion', { potion: potionName });
            Logger.log(message, 'COMBAT');
            setLocalLogs(prev => [...prev, message]);
            // Don't end turn, allow player to still act
        }
    };

    // --- HELPER FUNCTIONS ---
    const getHpPercent = (entity) => {
        if (!entity || !entity.stats) return 0;
        const maxHp = entity.maxStats?.hp || entity.stats.hp || 1;
        return Math.max(0, (entity.stats.hp / maxHp) * 100);
    };
    const getResourcePercent = (p) => {
        if (!p || !p.resource) return 0;
        return Math.max(0, (p.resource.current / p.resource.max) * 100);
    };
    const getResourceColor = (resourceNameKey) => {
        // Handle both nameKey and direct names for backward compatibility
        const translatedName = resourceNameKey ? t(resourceNameKey) : '';
        switch(translatedName) {
            case 'Vigor': case 'قوة': return 'bg-vigor-full';
            case 'Mana': case 'مانا': return 'bg-mana-full';
            case 'Energy': case 'طاقة': return 'bg-energy-full';
            default: return 'bg-common';
        }
    };
    
    const getResourceEmptyColor = (resourceNameKey) => {
        const translatedName = resourceNameKey ? t(resourceNameKey) : '';
        switch(translatedName) {
            case 'Vigor': case 'قوة': return 'bg-vigor-empty';
            case 'Mana': case 'مانا': return 'bg-mana-empty';
            case 'Energy': case 'طاقة': return 'bg-energy-empty';
            default: return 'bg-common';
        }
    };
    const getXpInfo = () => {
        const level = GameState.current.level;
        const experience = GameState.current.experience || 0;
        if (level >= GameConfig.XP_CURVE.maxLevel) return { percentage: 100, current: 'MAX', required: 'LEVEL' };
        const currentLevelXpStart = GameState.getRequiredExperience(level - 1);
        const nextLevelXp = GameState.getRequiredExperience(level);
        const totalXpForLevel = nextLevelXp - currentLevelXpStart;
        const xpIntoLevel = experience - currentLevelXpStart;
        const percentage = totalXpForLevel === 0 ? 0 : Math.max(0, Math.min(100, (xpIntoLevel / totalXpForLevel) * 100));
        return { percentage, current: Math.max(0, xpIntoLevel), required: totalXpForLevel };
    };
    // --- END HELPER FUNCTIONS ---

    const isPlayerTurn = combatSystem.isPlayerTurn();
    const playerSkillData = player ? GameConfig.ABILITIES[player.abilities[0]] : null;
    const xpInfo = getXpInfo();
    const enemies = GameState.current.enemies || [];
    const aliveEnemies = enemies.filter(e => e.isAlive);
    const focusedEnemy = enemies.find(e => e.originalIndex === focusedTargetId);
    const otherEnemies = enemies.filter(e => e.isAlive && e.originalIndex !== focusedTargetId);
    const currentLanguage = Localization.getCurrentLanguage();

    return (
        <>
            {/* Combat Feedback CSS Animations */}
            <style>{`
                @keyframes fadeInOut {
                    0% { opacity: 0; transform: translateY(20px); }
                    15% { opacity: 1; transform: translateY(0); }
                    85% { opacity: 1; transform: translateY(0); }
                    100% { opacity: 0; transform: translateY(-10px); }
                }
                .feedback-message {
                    animation: fadeInOut 2s ease-in-out forwards;
                }

                @keyframes floatUp {
                    0% {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                    50% {
                        transform: translateY(-30px) scale(1.2);
                    }
                    100% {
                        opacity: 0;
                        transform: translateY(-60px) scale(0.8);
                    }
                }
                .floating-number {
                    animation: floatUp 1.5s ease-out forwards;
                    pointer-events: none;
                    font-weight: bold;
                    text-shadow: 0 0 10px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 0, 0, 0.5);
                }
            `}</style>

            <div className="h-full bg-rpg-radial text-rpg-text p-4 flex flex-col overflow-y-auto">
                <div className="w-full max-w-3xl mx-auto flex flex-col flex-grow min-h-0">
                <div className="text-center mb-4 flex-shrink-0">
                    <h1 className="text-2xl font-bold text-rpg-primary">⚔️ {t('combat.battle')} ⚔️</h1>
                    {/* Wave Combat Indicator */}
                    {(combatSystem.totalWaves > 1 || enemies.length > 1) && (
                        <div className="inline-block bg-rpg-secondary border border-rpg-primary rounded-full px-3 py-1 text-sm text-rpg-primary font-semibold mb-2">
                            {combatSystem.totalWaves > 1 ? (
                                <>🌊 Wave {combatSystem.currentWave}/{combatSystem.totalWaves}</>
                            ) : (
                                <>⚔️ {t('combat.messages.enemiesRemaining', {alive: aliveEnemies.length, total: enemies.length})}</>
                            )}
                        </div>
                    )}
                    <p className="text-lg text-rpg-text opacity-80">{isPlayerTurn ? t('combat.playerTurn', {player: player?.nameKey ? t(player.nameKey) : 'Player'}) : t('combat.enemyTurn')}</p>
                </div>

                <div className="flex-grow overflow-y-auto pr-2 space-y-4">
                    <div className="bg-rpg-bg-darker bg-opacity-80 p-4 rounded-lg border border-rpg-primary backdrop-blur-sm">
                        <div className="flex gap-4 items-center">
                            <div className="flex-shrink-0 w-24 h-24 bg-rpg-bg-darkest rounded-lg flex items-center justify-center text-5xl border-2 border-uncommon">👤</div>
                            <div className="flex-grow min-w-0">
                                <div className="flex justify-between items-center mb-2">
                                    <h2 className="text-xl font-bold text-uncommon truncate">{player?.nameKey ? t(player.nameKey) : 'Player'} ({t('stats.level')} {GameState.current.level})</h2>
                                    <div className="flex gap-2 flex-shrink-0">
                                        {player?.defending && <div className="text-sm bg-rare bg-opacity-50 border border-rare rounded-full px-2 py-0.5">🛡️ Defending</div>}
                                        {player?.statusEffects?.map((effect, i) => <div key={i} className="text-sm bg-health-dark bg-opacity-50 border border-health-mid rounded-full px-2 py-0.5">{effect.icon} {effect.duration}</div>)}
                                    </div>
                                </div>
                                <div className="h-4 bg-health-empty rounded overflow-hidden mb-1"><div className="h-4 bg-health-full" style={{ width: `${getHpPercent(player)}%` }}></div></div>
                                <div className="text-sm text-right text-rpg-text opacity-80 mb-2">{t('stats.hpShort')}: {player?.stats.hp} / {player?.maxStats.hp}</div>
                                <div className={`h-4 rounded overflow-hidden mb-1 ${getResourceEmptyColor(player?.resource?.nameKey)}`}><div className={`h-4 ${getResourceColor(player?.resource?.nameKey)}`} style={{ width: `${getResourcePercent(player)}%` }}></div></div>
                                <div className="text-sm text-right text-rpg-text opacity-80">{player?.resource?.nameKey ? t(player.resource.nameKey) : 'Resource'}: {player?.resource.current} / {player?.resource.max}</div>
                                <div className="flex justify-end gap-4 mt-2 text-sm text-rpg-text opacity-70">
                                    <span>⚔️ {player?.stats.atk}</span> <span>🛡️ {player?.stats.def}</span> <span>⚡ {player?.stats.spd}</span> <span>💥 {player?.stats.crit}%</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="h-4 bg-rpg-bg-darkest rounded overflow-hidden mb-1"><div className="h-4 bg-mana-light" style={{ width: `${xpInfo.percentage}%` }}></div></div>
                            <div className="text-sm text-right text-mana-light">{t('stats.xpShort')}: {xpInfo.current} / {xpInfo.required}</div>
                        </div>

                        {/* Active Buffs Display */}
                        {GameState.current.battleBuffs && GameState.current.battleBuffs.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-rpg-secondary">
                                <h3 className="text-sm font-bold text-rpg-primary mb-2">✨ {t('combat.activeBuffs')}</h3>
                                <div className="flex flex-wrap gap-2">
                                    {GameState.current.battleBuffs.map((buff, index) => (
                                        <div
                                            key={index}
                                            className="bg-legendary bg-opacity-20 border border-legendary rounded-lg px-3 py-1.5 text-sm"
                                            title={typeof buff.description === 'object' ? buff.description[Localization.getCurrentLanguage()] : buff.description}
                                        >
                                            <span className="text-lg mr-1">{buff.icon}</span>
                                            <span className="font-bold text-legendary">
                                                {typeof buff.name === 'object' ? buff.name[Localization.getCurrentLanguage()] : buff.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {otherEnemies.map(enemy => (
                        <button key={enemy.originalIndex} onClick={() => setFocusedTargetId(enemy.originalIndex)} className="w-full bg-rpg-secondary bg-opacity-30 hover:bg-rpg-secondary hover:bg-opacity-50 rounded-lg p-2 border border-rpg-secondary text-left flex items-center text-sm transition-all">
                            <div className="w-8 h-8 rounded-full bg-rpg-bg-darkest flex items-center justify-center mr-3 text-lg">{enemy.isAlive ? '👹' : '💀'}</div>
                            <div className="flex-grow text-rpg-text font-semibold">{enemy.prefixKey ? `${t(enemy.prefixKey)} ` : ''}{enemy.nameKey ? t(enemy.nameKey) : enemy.id || 'Enemy'} {enemy.level ? `(${t('stats.level')} ${enemy.level})` : ''}</div>
                            <div className="w-1/3 h-3 bg-health-empty rounded-full overflow-hidden mr-2"><div className="h-3 bg-health-full" style={{ width: `${getHpPercent(enemy)}%` }}></div></div>
                            <div className="text-rpg-text opacity-70 text-right w-20">{enemy.stats.hp} / {enemy.maxStats.hp}</div>
                        </button>
                    ))}

                    {focusedEnemy && (
                        <div className={`relative bg-rpg-bg-darker bg-opacity-80 p-4 rounded-lg border-2 backdrop-blur-sm ${focusedEnemy.isAlive ? 'border-legendary' : 'border-rpg-secondary opacity-60'}`}>
                             {/* Floating Damage Numbers */}
                             {floatingNumbers
                                .filter(n => n.entityId === focusedEnemy.originalIndex)
                                .map(num => {
                                    const getNumberStyle = () => {
                                        switch (num.type) {
                                            case 'crit':
                                                return { color: '#ffff00', fontSize: '2.5rem' };
                                            case 'heal':
                                                return { color: '#44ff44', fontSize: '2rem' };
                                            case 'miss':
                                                return { color: '#999999', fontSize: '1.5rem' };
                                            default: // damage
                                                return { color: '#ff4444', fontSize: '2rem' };
                                        }
                                    };

                                    return (
                                        <div
                                            key={num.id}
                                            className="floating-number absolute top-4 left-1/2 transform -translate-x-1/2 z-50"
                                            style={getNumberStyle()}
                                        >
                                            {num.type === 'heal' ? '+' : num.type === 'miss' ? 'MISS' : '-'}{num.type !== 'miss' && num.value}
                                        </div>
                                    );
                                })}

                             <div className="flex gap-4 items-center">
                                <div className="flex-shrink-0 w-24 h-24 bg-rpg-bg-darkest rounded-lg flex items-center justify-center text-5xl border-2 border-health-dark">{focusedEnemy.isAlive ? '👹' : '💀'}</div>
                                <div className="flex-grow min-w-0">
                                    <div className="flex justify-between items-center mb-2">
                                        <h2 className="text-xl font-bold text-health-mid truncate">{focusedEnemy.prefixKey ? `${t(focusedEnemy.prefixKey)} ` : ''}{focusedEnemy.nameKey ? t(focusedEnemy.nameKey) : focusedEnemy.id || 'Enemy'} {focusedEnemy.level ? `(${t('stats.level')} ${focusedEnemy.level})` : ''}</h2>
                                        <div className="flex gap-2 flex-shrink-0">
                                            {focusedEnemy.statusEffects?.map((effect, i) => <div key={i} className="text-sm bg-epic bg-opacity-50 border border-epic rounded-full px-2 py-0.5">{effect.icon} {effect.duration}</div>)}
                                        </div>
                                    </div>
                                    <div className="h-4 bg-health-empty rounded overflow-hidden mb-1"><div className="h-4 bg-health-full" style={{ width: `${getHpPercent(focusedEnemy)}%` }}></div></div>
                                    <p className="text-sm text-right text-rpg-text opacity-80">{t('stats.hpShort')}: {focusedEnemy.stats.hp} / {focusedEnemy.maxStats.hp}</p>
                                    <div className="flex justify-end gap-4 mt-2 text-sm text-rpg-text opacity-70">
                                        <span>⚔️ {focusedEnemy.stats.atk}</span> <span>🛡️ {focusedEnemy.stats.def}</span> <span>⚡ {focusedEnemy.stats.spd}</span> <span>💥 {focusedEnemy.stats.crit}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-auto flex-shrink-0 pt-4">
                    {/* Main Combat Actions - Made smaller to fit potions */}
                    <div className="grid grid-cols-4 gap-1 mb-2">
                        <button onClick={handleAttack} disabled={!isPlayerTurn || !focusedEnemy?.isAlive} className={`px-2 py-2 text-sm rounded font-bold transition-colors text-rpg-text ${ isPlayerTurn && focusedEnemy?.isAlive ? 'bg-rpg-primary hover:bg-legendary' : 'bg-rpg-secondary bg-opacity-50 opacity-50 cursor-not-allowed'}`}>⚔️ {t('combat.attack')}</button>
                        {playerSkillData ? (
                            <button onClick={handleSkill} disabled={!isPlayerTurn || player.resource.current < playerSkillData.cost || !focusedEnemy?.isAlive} className={`px-2 py-2 text-sm rounded font-bold transition-colors text-rpg-text ${ isPlayerTurn && player.resource.current >= playerSkillData.cost && focusedEnemy?.isAlive ? 'bg-epic hover:bg-mythic' : 'bg-rpg-secondary bg-opacity-50 opacity-50 cursor-not-allowed'}`}>
                                <div className="flex flex-col items-center">
                                    <span>{playerSkillData.name ? (typeof playerSkillData.name === 'object' ? (playerSkillData.name[currentLanguage] || playerSkillData.name.en) : playerSkillData.name) : t('combat.skill')}</span>
                                    <span className="text-xs opacity-75">Cost: {playerSkillData.cost}</span>
                                </div>
                            </button>
                        ) : (
                            <button disabled className="px-2 py-2 text-sm rounded font-bold bg-rpg-secondary bg-opacity-50 text-rpg-text opacity-50 cursor-not-allowed">🔮 {t('combat.noSkill')}</button>
                        )}
                        <button onClick={() => combatSystem.playerDefend()} disabled={!isPlayerTurn} className={`px-2 py-2 text-sm rounded font-bold transition-colors text-rpg-text ${ isPlayerTurn ? 'bg-rpg-secondary hover:bg-rpg-primary' : 'bg-rpg-secondary bg-opacity-50 cursor-not-allowed'}`}>🛡️ {t('combat.defend')}</button>
                        <button onClick={() => combatSystem.playerFlee()} disabled={!isPlayerTurn} className={`px-2 py-2 text-sm rounded font-bold transition-colors text-rpg-text ${ isPlayerTurn ? 'bg-health-full hover:bg-health-mid' : 'bg-rpg-secondary bg-opacity-50 cursor-not-allowed'}`}>🏃 {t('combat.flee')}</button>
                    </div>
                    
                    {/* Potions Row */}
                    <div className="grid grid-cols-4 gap-1 mb-4">
                        <button
                            onClick={() => handleUsePotion('hp_potion')}
                            disabled={!isPlayerTurn || !GameState.current.potions?.hp_potion || GameState.current.potions.hp_potion <= 0}
                            className={`px-2 py-2 text-sm rounded font-bold transition-colors text-rpg-text ${
                                isPlayerTurn && GameState.current.potions?.hp_potion > 0 ? 'bg-health-full hover:bg-health-mid' : 'bg-rpg-secondary bg-opacity-50 opacity-50 cursor-not-allowed'
                            }`}>
                            ❤️‍🩹 HP ({GameState.current.potions?.hp_potion || 0})
                        </button>
                        <button
                            onClick={() => handleUsePotion('resource_potion')}
                            disabled={!isPlayerTurn || !GameState.current.potions?.resource_potion || GameState.current.potions.resource_potion <= 0}
                            className={`px-2 py-2 text-sm rounded font-bold transition-colors text-rpg-text ${
                                isPlayerTurn && GameState.current.potions?.resource_potion > 0 ? 'bg-mana-full hover:bg-mana-light' : 'bg-rpg-secondary bg-opacity-50 opacity-50 cursor-not-allowed'
                            }`}>
                            🧪 MP ({GameState.current.potions?.resource_potion || 0})
                        </button>
                        <button
                            onClick={() => handleUsePotion('greater_hp_potion')}
                            disabled={!isPlayerTurn || !GameState.current.potions?.greater_hp_potion || GameState.current.potions.greater_hp_potion <= 0}
                            className={`px-2 py-2 text-sm rounded font-bold transition-colors text-rpg-text ${
                                isPlayerTurn && GameState.current.potions?.greater_hp_potion > 0 ? 'bg-legendary hover:bg-mythic' : 'bg-rpg-secondary bg-opacity-50 opacity-50 cursor-not-allowed'
                            }`}>
                            💖 G.HP ({GameState.current.potions?.greater_hp_potion || 0})
                        </button>
                        <button
                            onClick={() => handleUsePotion('elixir_of_vitality')}
                            disabled={!isPlayerTurn || !GameState.current.potions?.elixir_of_vitality || GameState.current.potions.elixir_of_vitality <= 0}
                            className={`px-2 py-2 text-sm rounded font-bold transition-colors text-rpg-text ${
                                isPlayerTurn && GameState.current.potions?.elixir_of_vitality > 0 ? 'bg-epic hover:bg-legendary' : 'bg-rpg-secondary bg-opacity-50 opacity-50 cursor-not-allowed'
                            }`}>
                            🌟 Elixir ({GameState.current.potions?.elixir_of_vitality || 0})
                        </button>
                    </div>

                    {/* Combat Feedback Zone - Fading Messages (Replaces Scrolling Log) */}
                    <div className="relative h-16 flex items-center justify-center overflow-hidden">
                        {feedbackMessages.map((msg, index) => (
                            <div
                                key={msg.id}
                                className="feedback-message absolute text-center text-base font-bold px-4 py-2 bg-black bg-opacity-60 rounded-lg backdrop-blur-sm border border-rpg-primary"
                                style={{
                                    zIndex: feedbackMessages.length - index,
                                    color: '#f8e4c0'
                                }}
                            >
                                {msg.text}
                            </div>
                        ))}
                        {feedbackMessages.length === 0 && (
                            <div className="text-rpg-text opacity-30 italic text-sm">
                                {isPlayerTurn ? t('combat.chooseAction') : t('combat.enemyThinking')}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}