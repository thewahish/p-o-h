// filename: src/components/outcome-screen.jsx

import React from 'react';
import { GameState } from '../core/state';
import Logger from '../core/logger';
import { t } from '../core/localization.js';
import { ContentGenerator } from '../systems/content-generator.js';
import {
    Modal,
    ModalContent,
    ScreenTitle,
    BodyText,
    SmallText,
    PrimaryButton
} from '../design-system/components';

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
        <Modal>
            <ModalContent className="flex flex-col justify-between text-center space-y-4">
                {/* Title */}
                <ScreenTitle className={titleColor}>
                    {title}
                </ScreenTitle>

                {/* Dynamic flavor text */}
                {flavorText && (
                    <div className="animate-fade-in">
                        <div className={`bg-gradient-to-r ${victory ? 'from-transparent via-uncommon/20 to-transparent border-uncommon' : 'from-transparent via-health-full/20 to-transparent border-health-full'} p-3 rounded-lg border-l-4 border-r-4`}>
                            <SmallText className={`italic ${victory ? 'text-uncommon' : 'text-health-full'}`}>
                                {flavorText}
                            </SmallText>
                        </div>
                    </div>
                )}

                {/* Victory Results */}
                {victory && (
                    <div className="space-y-2">
                        <BodyText large>{t('combat.victorious')}</BodyText>
                        <BodyText>{t('combat.goldAcquired')} <span className="text-legendary font-bold">+{results.gold}</span></BodyText>
                        <BodyText>{t('combat.experienceGained')} <span className="text-mana-light font-bold">+{results.xp}</span></BodyText>
                        <BodyText>{t('souls.earned')} <span className="text-epic font-bold">👻 {soulsEarned}</span></BodyText>
                    </div>
                )}

                {/* Defeat Results */}
                {!victory && (
                    <div className="space-y-2">
                        <BodyText>{t('combat.journeyEnds')}</BodyText>
                        <BodyText>{t('combat.goldLost')} <span className="text-health-full font-bold">-{results.goldLost} ({results.goldKept} {t('combat.remaining')})</span></BodyText>
                        <BodyText>{t('souls.earned')} <span className="text-epic font-bold">👻 {soulsEarned}</span></BodyText>
                        <SmallText className="text-epic">{t('souls.kept')}</SmallText>
                    </div>
                )}

                {/* Continue Button */}
                <PrimaryButton onClick={onContinue} className="w-full">
                    {victory ? t('combat.continue') : t('combat.returnToMenu')}
                </PrimaryButton>
            </ModalContent>
        </Modal>
    );
}