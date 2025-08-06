// filename: src/components/outcome-screen.jsx

import React from 'react';
import { GameState } from '../core/state';
import Logger from '../core/logger';
import { t } from '../core/localization.js';

export default function OutcomeScreen({ victory, results, onContinue }) {
    Logger.log(`Rendering OutcomeScreen. Victory: ${victory}`, 'UI');
    
    // Using global localization system
    const soulsEarned = GameState.current.currentRunSouls;
    const title = victory ? t('combat.victory') : t('combat.defeat');
    const titleColor = victory ? "text-green-400" : "text-red-400";

    return (
        <div className="fixed inset-0 bg-gray-900/90 flex items-center justify-center z-[100] p-4">
            <div className="bg-gray-800 border-2 border-amber-500 rounded-lg p-8 max-w-sm w-full text-center shadow-2xl">
                <h1 className={`text-4xl font-bold mb-6 ${titleColor}`}>{title}</h1>

                {victory && (
                    <div className="space-y-3 text-lg mb-8">
                        <p>{t('combat.victorious')}</p>
                        <p>{t('combat.goldAcquired')} <span className="text-yellow-400 font-bold">+{results.gold}</span></p>
                        <p>{t('combat.experienceGained')} <span className="text-cyan-400 font-bold">+{results.xp}</span></p>
                        <p>{t('souls.earned')} <span className="text-purple-400 font-bold">👻 {soulsEarned}</span></p>
                    </div>
                )}

                {!victory && (
                    <div className="space-y-3 text-lg mb-8">
                        <p>{t('combat.journeyEnds')}</p>
                        <p>{t('combat.goldLost')} <span className="text-red-500 font-bold">-{results.goldLost} ({results.goldKept} {t('combat.remaining')})</span></p>
                        <p>{t('souls.earned')} <span className="text-purple-400 font-bold">👻 {soulsEarned}</span></p>
                        <p className="text-sm text-purple-300">{t('souls.kept')}</p>
                    </div>
                )}

                <button
                    onClick={onContinue}
                    className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 px-4 rounded-lg text-xl transition-transform transform hover:scale-105"
                >
                    {victory ? t('combat.continue') : t('combat.returnToMenu')}
                </button>
            </div>
        </div>
    );
}