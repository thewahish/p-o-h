// filename: src/components/battle-screen.jsx

import React, { useState, useEffect } from 'react';
import { GameState } from '../core/state';
import { GameConfig } from '../constants/config';
import Logger from '../core/logger';
import { t, Localization } from '../core/localization';

export default function BattleScreen({ player, enemies: initialEnemies, combatSystem, combatLog }) {
    const [localLogs, setLocalLogs] = useState(combatLog || []);
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
    }, [combatLog]);

    const handleAttack = () => {
        if (focusedTargetId !== null) combatSystem.playerAttack(focusedTargetId);
    };

    const handleSkill = () => {
        if (focusedTargetId !== null) combatSystem.playerSkill(focusedTargetId);
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
            case 'Vigor': case 'قوة': return 'bg-purple-500';
            case 'Mana': case 'مانا': return 'bg-blue-500';
            case 'Energy': case 'طاقة': return 'bg-yellow-500';
            default: return 'bg-gray-500';
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
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4 flex flex-col">
            <div className="w-full max-w-3xl mx-auto flex flex-col flex-grow min-h-0">
                <div className="text-center mb-4 flex-shrink-0">
                    <h1 className="text-2xl font-bold text-amber-400">⚔️ {t('combat.battle')} ⚔️</h1>
                    {/* Wave Combat Indicator */}
                    {(combatSystem.totalWaves > 1 || enemies.length > 1) && (
                        <div className="inline-block bg-gray-700 border border-amber-500 rounded-full px-3 py-1 text-sm text-amber-300 font-semibold mb-2">
                            {combatSystem.totalWaves > 1 ? (
                                <>🌊 Wave {combatSystem.currentWave}/{combatSystem.totalWaves}</>
                            ) : (
                                <>⚔️ {t('combat.messages.enemiesRemaining', {alive: aliveEnemies.length, total: enemies.length})}</>
                            )}
                        </div>
                    )}
                    <p className="text-lg text-gray-300">{isPlayerTurn ? t('combat.playerTurn', {player: player?.nameKey ? t(player.nameKey) : 'Player'}) : t('combat.enemyTurn')}</p>
                </div>

                <div className="flex-grow overflow-y-auto pr-2 space-y-4">
                    <div className="bg-gray-800 p-4 rounded-lg border border-amber-600">
                        <div className="flex gap-4 items-center">
                            <div className="flex-shrink-0 w-24 h-24 bg-gray-900 rounded-lg flex items-center justify-center text-5xl border-2 border-green-500">👤</div>
                            <div className="flex-grow min-w-0">
                                <div className="flex justify-between items-center mb-2">
                                    <h2 className="text-xl font-bold text-green-400 truncate">{player?.nameKey ? t(player.nameKey) : 'Player'} ({t('stats.level')} {GameState.current.level})</h2>
                                    <div className="flex gap-2 flex-shrink-0">
                                        {player?.defending && <div className="text-sm bg-blue-500/50 border border-blue-400 rounded-full px-2 py-0.5">🛡️ Defending</div>}
                                        {player?.statusEffects?.map((effect, i) => <div key={i} className="text-sm bg-red-500/50 border border-red-400 rounded-full px-2 py-0.5">{effect.icon} {effect.duration}</div>)}
                                    </div>
                                </div>
                                <div className="h-4 bg-gray-700 rounded overflow-hidden mb-1"><div className="h-4 bg-green-500" style={{ width: `${getHpPercent(player)}%` }}></div></div>
                                <div className="text-sm text-right text-gray-300 mb-2">{t('stats.hpShort')}: {player?.stats.hp} / {player?.maxStats.hp}</div>
                                <div className="h-4 bg-gray-700 rounded overflow-hidden mb-1"><div className={`h-4 ${getResourceColor(player?.resource?.nameKey)}`} style={{ width: `${getResourcePercent(player)}%` }}></div></div>
                                <div className="text-sm text-right text-gray-300">{player?.resource?.nameKey ? t(player.resource.nameKey) : 'Resource'}: {player?.resource.current} / {player?.resource.max}</div>
                                <div className="flex justify-end gap-4 mt-2 text-sm text-gray-400">
                                    <span>⚔️ {player?.stats.atk}</span> <span>🛡️ {player?.stats.def}</span> <span>⚡ {player?.stats.spd}</span> <span>💥 {player?.stats.crit}%</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="h-4 bg-gray-700 rounded overflow-hidden mb-1"><div className="h-4 bg-cyan-400" style={{ width: `${xpInfo.percentage}%` }}></div></div>
                            <div className="text-sm text-right text-cyan-200">{t('stats.xpShort')}: {xpInfo.current} / {xpInfo.required}</div>
                        </div>
                    </div>

                    {otherEnemies.map(enemy => (
                        <button key={enemy.originalIndex} onClick={() => setFocusedTargetId(enemy.originalIndex)} className="w-full bg-gray-700/50 hover:bg-gray-700/80 rounded-lg p-2 border border-gray-500 text-left flex items-center text-sm transition-all">
                            <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center mr-3 text-lg">{enemy.isAlive ? '👹' : '💀'}</div>
                            <div className="flex-grow text-white font-semibold">{enemy.level ? `Lv.${enemy.level} ${enemy.nameKey ? t(enemy.nameKey) : 'Enemy'}` : (enemy.nameKey ? t(enemy.nameKey) : 'Enemy')}</div>
                            <div className="w-1/3 h-3 bg-gray-900 rounded-full overflow-hidden mr-2"><div className="h-3 bg-red-500" style={{ width: `${getHpPercent(enemy)}%` }}></div></div>
                            <div className="text-gray-400 text-right w-20">{enemy.stats.hp} / {enemy.maxStats.hp}</div>
                        </button>
                    ))}

                    {focusedEnemy && (
                        <div className={`bg-gray-800 p-4 rounded-lg border-2 ${focusedEnemy.isAlive ? 'border-yellow-400' : 'border-gray-600 opacity-60'}`}>
                             <div className="flex gap-4 items-center">
                                <div className="flex-shrink-0 w-24 h-24 bg-gray-900 rounded-lg flex items-center justify-center text-5xl border-2 border-red-700">{focusedEnemy.isAlive ? '👹' : '💀'}</div>
                                <div className="flex-grow min-w-0">
                                    <div className="flex justify-between items-center mb-2">
                                        <h2 className="text-xl font-bold text-red-400 truncate">{focusedEnemy.level ? `Lv.${focusedEnemy.level} ${focusedEnemy.nameKey ? t(focusedEnemy.nameKey) : 'Enemy'}` : (focusedEnemy.nameKey ? t(focusedEnemy.nameKey) : 'Enemy')}</h2>
                                        <div className="flex gap-2 flex-shrink-0">
                                            {focusedEnemy.statusEffects?.map((effect, i) => <div key={i} className="text-sm bg-purple-500/50 border border-purple-400 rounded-full px-2 py-0.5">{effect.icon} {effect.duration}</div>)}
                                        </div>
                                    </div>
                                    <div className="h-4 bg-gray-700 rounded overflow-hidden mb-1"><div className="h-4 bg-red-500" style={{ width: `${getHpPercent(focusedEnemy)}%` }}></div></div>
                                    <p className="text-sm text-right text-gray-300">{t('stats.hpShort')}: {focusedEnemy.stats.hp} / {focusedEnemy.maxStats.hp}</p>
                                    <div className="flex justify-end gap-4 mt-2 text-sm text-gray-400">
                                        <span>⚔️ {focusedEnemy.stats.atk}</span> <span>🛡️ {focusedEnemy.stats.def}</span> <span>⚡ {focusedEnemy.stats.spd}</span> <span>💥 {focusedEnemy.stats.crit}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-auto flex-shrink-0 pt-4">
                    <div className="grid grid-cols-2 gap-2 mb-4">
                        <button onClick={handleAttack} disabled={!isPlayerTurn || !focusedEnemy?.isAlive} className={`px-4 py-3 rounded font-bold transition-colors ${ isPlayerTurn && focusedEnemy?.isAlive ? 'bg-amber-600 hover:bg-amber-500' : 'bg-gray-600 text-gray-400 cursor-not-allowed'}`}>⚔️ {t('combat.attack')}</button>
                        {playerSkillData ? (
                            <button onClick={handleSkill} disabled={!isPlayerTurn || player.resource.current < playerSkillData.cost || !focusedEnemy?.isAlive} className={`px-4 py-3 rounded font-bold transition-colors ${ isPlayerTurn && player.resource.current >= playerSkillData.cost && focusedEnemy?.isAlive ? 'bg-purple-600 hover:bg-purple-500' : 'bg-gray-600 text-gray-400 cursor-not-allowed'}`}>🔮 {playerSkillData.name ? (typeof playerSkillData.name === 'object' ? (playerSkillData.name[currentLanguage] || playerSkillData.name.en) : playerSkillData.name) : t('combat.skill')} ({playerSkillData.cost})</button>
                        ) : (
                            <button disabled className="px-4 py-3 rounded font-bold bg-gray-600 text-gray-400 cursor-not-allowed">🔮 {t('combat.noSkill')}</button>
                        )}
                        <button onClick={() => combatSystem.playerDefend()} disabled={!isPlayerTurn} className={`px-4 py-3 rounded font-bold transition-colors ${ isPlayerTurn ? 'bg-blue-600 hover:bg-blue-500' : 'bg-gray-600 cursor-not-allowed'}`}>🛡️ {t('combat.defend')}</button>
                        <button onClick={() => combatSystem.playerFlee()} disabled={!isPlayerTurn} className={`px-4 py-3 rounded font-bold transition-colors ${ isPlayerTurn ? 'bg-yellow-600 hover:bg-yellow-500' : 'bg-gray-600 cursor-not-allowed'}`}>🏃 {t('combat.flee')}</button>
                    </div>
                    <div className="bg-gray-900 p-3 rounded border border-gray-700 h-24 overflow-y-auto text-sm">
                        <h3 className="text-amber-400 font-bold mb-2">{t('combat.log')}:</h3>
                        {localLogs.length === 0 ? (<div className="text-gray-500 italic">Awaiting action...</div>) : ([...localLogs].reverse().map((log, i) => (<div key={i} className="mb-1">{log}</div>)))}
                    </div>
                </div>
            </div>
        </div>
    );
}