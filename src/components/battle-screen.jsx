// filename: src/components/BattleScreen.jsx

import React, { useEffect, useState } from "react";
import { GameState } from "../core/state";
import { GameConfig } from "../constants/config";

export default function BattleScreen({ player, enemies, combatSystem, combatLog, onBattleEnd }) {
  const [localLogs, setLocalLogs] = useState(combatLog || []);

  useEffect(() => {
    setLocalLogs(combatLog || []);
  }, [combatLog]);

  const getHpPercent = (entity) => {
    if (!entity || !entity.stats) return 0;
    const maxHp = entity.maxStats?.hp || entity.stats.maxHp || entity.stats.hp || 1;
    return Math.max(0, Math.min(100, (entity.stats.hp / maxHp) * 100));
  };
    
  const getResourcePercent = (p) => {
    if (!p || !p.resource) return 0;
    return Math.max(0, Math.min(100, (p.resource.current / p.resource.max) * 100));
  };
    
  const getResourceColor = (resourceName) => {
      switch(resourceName) {
          case 'Vigor': return 'bg-purple-500';
          case 'Mana': return 'bg-blue-500';
          case 'Energy': return 'bg-yellow-500';
          default: return 'bg-gray-500';
      }
  };

  const getXpInfo = (p) => {
    if (!p || p.level >= GameConfig.XP_CURVE.maxLevel) {
        return { percentage: 100, current: 'MAX', required: 'LEVEL' };
    }
    const currentLevelXpStart = GameState.getRequiredExperience(p.level - 1);
    const nextLevelXp = GameState.getRequiredExperience(p.level);
    
    const totalXpForLevel = nextLevelXp - currentLevelXpStart;
    const xpIntoLevel = p.experience - currentLevelXpStart;

    const percentage = totalXpForLevel === 0 ? 0 : Math.max(0, Math.min(100, (xpIntoLevel / totalXpForLevel) * 100));

    return { percentage, current: xpIntoLevel, required: totalXpForLevel };
  };

  const isPlayerTurn = combatSystem.isPlayerTurn();
  const playerSkillData = player ? GameConfig.ABILITIES[player.abilities[0]] : null;
  const xpInfo = getXpInfo(player); // Get XP info once

  const getCurrentTurnInfo = () => {
    if (!GameState.current.battleInProgress) return "Battle Over";
    const unit = combatSystem.getCurrentTurnUnit?.();
    if (isPlayerTurn) {
      return `${player?.name}'s Turn`;
    } else if (unit) {
      return `${unit.name}'s Turn`;
    }
    return "Processing...";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4 flex flex-col">
      <div className="max-w-3xl mx-auto w-full">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-amber-400">⚔️ Battle ⚔️</h1>
          <p className="text-lg text-gray-300">{getCurrentTurnInfo()}</p>
        </div>

        {/* Player Box with Portrait, Stats, and XP Bar */}
        <div className="bg-gray-800 p-4 rounded-lg border border-amber-600 mb-4">
          <div className="flex gap-4 items-center">
            {/* Portrait Placeholder */}
            <div className="flex-shrink-0 w-24 h-24 bg-gray-900 rounded-lg flex items-center justify-center text-5xl border-2 border-green-500">
              👤
            </div>

            {/* Info Section */}
            <div className="flex-grow">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold text-green-400">{player?.name} (Lvl {player?.level})</h2>
                <div className="flex gap-2">
                    {player?.defending && (
                        <div className="text-sm bg-blue-500/50 border border-blue-400 rounded-full px-2 py-0.5">🛡️ Defending</div>
                    )}
                    {player?.statusEffects?.map((effect, i) => (
                        <div key={i} className="text-sm bg-red-500/50 border border-red-400 rounded-full px-2 py-0.5">
                            {effect.icon} {effect.duration}
                        </div>
                    ))}
                </div>
              </div>
              {/* HP Bar */}
              <div className="h-4 bg-gray-700 rounded overflow-hidden mb-1">
                <div className="h-4 bg-green-500 transition-all duration-300" style={{ width: `${getHpPercent(player)}%` }}></div>
              </div>
              <div className="text-sm text-right text-gray-300 mb-2">HP: {player?.stats.hp} / {player?.maxStats.hp}</div>
              {/* Resource Bar */}
              <div className="h-4 bg-gray-700 rounded overflow-hidden mb-1">
                <div className={`h-4 ${getResourceColor(player?.resource.name)} transition-all duration-300`} style={{ width: `${getResourcePercent(player)}%` }}></div>
              </div>
              <div className="text-sm text-right text-gray-300">{player?.resource.name}: {player?.resource.current} / {player?.resource.max}</div>
              {/* Stats Display */}
              <div className="flex justify-end gap-4 mt-2 text-sm text-gray-400">
                <span>⚔️ {player?.stats.atk}</span>
                <span>🛡️ {player?.stats.def}</span>
                <span>⚡ {player?.stats.spd}</span>
                <span>💥 {player?.stats.crit}%</span>
              </div>
            </div>
          </div>
          
          {/* XP Bar */}
          <div className="mt-3">
            <div className="h-4 bg-gray-700 rounded overflow-hidden mb-1">
                <div className="h-4 bg-cyan-400 transition-all duration-300" style={{ width: `${xpInfo.percentage}%` }}></div>
            </div>
            <div className="text-sm text-right text-cyan-200">
                XP: {xpInfo.current} / {xpInfo.required}
            </div>
          </div>
        </div>

        {/* Enemy Boxes with Portraits and Stats */}
        <div className="grid grid-cols-1 gap-4 mb-4">
          {enemies.map((enemy, idx) => (
            <div key={idx} className={`bg-gray-800 p-4 rounded-lg border ${enemy.isAlive ? 'border-red-600' : 'border-gray-600 opacity-50'} transition-opacity`}>
              <div className="flex gap-4 items-center">
                {/* Portrait Placeholder */}
                <div className="flex-shrink-0 w-24 h-24 bg-gray-900 rounded-lg flex items-center justify-center text-5xl border-2 border-red-700">
                  {enemy.isAlive ? '👹' : '💀'}
                </div>

                {/* Info Section */}
                <div className="flex-grow">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl font-bold text-red-400">{enemy.name}</h2>
                    <div className="flex gap-2">
                        {enemy.statusEffects?.map((effect, i) => (
                            <div key={i} className="text-sm bg-purple-500/50 border border-purple-400 rounded-full px-2 py-0.5">
                                {effect.icon} {effect.duration}
                            </div>
                        ))}
                    </div>
                  </div>
                  {/* HP Bar */}
                  <div className="h-4 bg-gray-700 rounded overflow-hidden mb-1">
                    <div className="h-4 bg-red-500 transition-all duration-300" style={{ width: `${getHpPercent(enemy)}%` }}></div>
                  </div>
                  <p className="text-sm text-right text-gray-300">HP: {enemy.stats.hp} / {enemy.maxStats.hp}</p>
                  {/* Stats Display */}
                  <div className="flex justify-end gap-4 mt-2 text-sm text-gray-400">
                    <span>⚔️ {enemy.stats.atk}</span>
                    <span>🛡️ {enemy.stats.def}</span>
                    <span>⚡ {enemy.stats.spd}</span>
                    <span>💥 {enemy.stats.crit}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-auto">
        {/* Action Buttons */}
        {playerSkillData && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4 justify-center">
              <button onClick={() => combatSystem.playerAttack(0)} disabled={!isPlayerTurn} className={`px-4 py-3 rounded font-bold transition-colors ${ isPlayerTurn ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-gray-600 text-gray-400 cursor-not-allowed'}`}>
                ⚔️ Attack
              </button>
              <button onClick={() => combatSystem.playerSkill(0)} disabled={!isPlayerTurn || player.resource.current < playerSkillData.cost} className={`px-4 py-3 rounded font-bold transition-colors ${ isPlayerTurn && player.resource.current >= playerSkillData.cost ? 'bg-purple-600 hover:bg-purple-500 text-white' : 'bg-gray-600 text-gray-400 cursor-not-allowed'}`}>
                🔮 {playerSkillData.name.en} ({playerSkillData.cost})
              </button>
              <button onClick={() => combatSystem.playerDefend()} disabled={!isPlayerTurn} className={`px-4 py-3 rounded font-bold transition-colors ${ isPlayerTurn ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-gray-600 text-gray-400 cursor-not-allowed'}`}>
                🛡️ Defend
              </button>
              <button onClick={() => combatSystem.playerFlee()} disabled={!isPlayerTurn} className={`px-4 py-3 rounded font-bold transition-colors ${ isPlayerTurn ? 'bg-yellow-600 hover:bg-yellow-500 text-white' : 'bg-gray-600 text-gray-400 cursor-not-allowed'}`}>
                🏃 Flee
              </button>
            </div>
        )}

            {/* Combat Log */}
            <div className="bg-gray-900 p-3 rounded border border-gray-700 h-40 overflow-y-auto text-sm">
              <h3 className="text-amber-400 font-bold mb-2">Combat Log:</h3>
              {localLogs.length === 0 ? (<div className="text-gray-500 italic">Awaiting action...</div>) : (
                [...localLogs].reverse().map((log, i) => (
                  <div key={i} className="mb-1 text-yellow-300">{log}</div>
                ))
              )}
            </div>
      </div>
    </div>
  );
}