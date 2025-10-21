// filename: src/components/outcome-screen.jsx

import React from 'react';
import { GameState } from '../core/state';
import Logger from '../core/logger';
import { t } from '../core/localization.js';
import { ContentGenerator } from '../systems/content-generator.js';

export default function OutcomeScreen({ victory, results, battleContext, onContinue }) {
    // Move logging to useEffect to avoid setState during render
    React.useEffect(() => {
        Logger.log(`Rendering OutcomeScreen. Victory: ${victory}`, 'UI');
    }, [victory]);

    // Using global localization system
    const soulsEarned = GameState.current.currentRunSouls;
    const title = victory ? t('combat.victory') : t('combat.defeat');
    const titleColor = victory ? "text-uncommon" : "text-health-full";

    // Generate dynamic flavor text based on battle context
    const flavorText = React.useMemo(() => {
        if (!battleContext) return null;

        if (victory) {
            return ContentGenerator.getVictoryText(battleContext.duration, battleContext.isBoss);
        } else {
            return ContentGenerator.getDefeatText();
        }
    }, [victory, battleContext]);

    return (
        <div className="fixed inset-0 bg-rpg-bg-darkest/90 flex items-center justify-center z-[100] p-2">
            <div className="bg-rpg-bg-darker border-2 border-rpg-primary rounded-lg p-4 max-w-sm w-full max-h-[95vh] flex flex-col justify-between text-center shadow-2xl backdrop-blur-sm overflow-y-auto">
                <h1 className={`text-2xl font-bold mb-3 flex-shrink-0 ${titleColor}`}>{title}</h1>

                {/* Dynamic flavor text */}
                {flavorText && (
                    <div className="mb-3 animate-fade-in flex-shrink-0">
                        <div className={`bg-gradient-to-r ${victory ? 'from-transparent via-uncommon/20 to-transparent border-uncommon' : 'from-transparent via-health-full/20 to-transparent border-health-full'} p-3 rounded-lg border-l-4 border-r-4`}>
                            <p className={`text-sm italic ${victory ? 'text-uncommon' : 'text-health-full'}`}>
                                {flavorText}
                            </p>
                        </div>
                    </div>
                )}

                {victory && (
                    <div className="space-y-2 text-base mb-4 flex-shrink-0">
                        <p>{t('combat.victorious')}</p>
                        <p className="text-rpg-text">{t('combat.goldAcquired')} <span className="text-legendary font-bold">+{results.gold}</span></p>
                        <p className="text-rpg-text">{t('combat.experienceGained')} <span className="text-mana-light font-bold">+{results.xp}</span></p>
                        <p className="text-rpg-text">{t('souls.earned')} <span className="text-epic font-bold">👻 {soulsEarned}</span></p>
                    </div>
                )}

                {!victory && (
                    <div className="space-y-2 text-base mb-4 flex-shrink-0">
                        <p className="text-rpg-text">{t('combat.journeyEnds')}</p>
                        <p className="text-rpg-text">{t('combat.goldLost')} <span className="text-health-full font-bold">-{results.goldLost} ({results.goldKept} {t('combat.remaining')})</span></p>
                        <p className="text-rpg-text">{t('souls.earned')} <span className="text-epic font-bold">👻 {soulsEarned}</span></p>
                        <p className="text-sm text-epic opacity-80">{t('souls.kept')}</p>
                    </div>
                )}

                <button
                    onClick={onContinue}
                    className="w-full bg-rpg-primary hover:bg-rpg-secondary text-rpg-text font-bold py-2 px-4 rounded-lg text-base transition-transform transform hover:scale-105 flex-shrink-0"
                >
                    {victory ? t('combat.continue') : t('combat.returnToMenu')}
                </button>
            </div>
        </div>
    );
}