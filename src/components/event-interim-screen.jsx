// filename: src/components/event-interim-screen.jsx

import React, { useEffect } from 'react';
import { t } from '../core/localization.js';
import {
    ScreenContainer,
    ScreenTitle,
    BodyText,
    SmallText,
    PrimaryButton,
    LargeIcon
} from '../design-system/components';

export default function EventInterimScreen({ 
    type, // 'intro' or 'outro'
    eventType, // 'battle', 'shop', 'shrine', 'treasure', 'boss'
    eventData, // enemy names, shop items, etc.
    message, // custom message override
    autoAdvance = true, // auto advance after delay
    delay = 2000, // delay before auto advance
    onContinue 
}) {
    useEffect(() => {
        if (autoAdvance && onContinue) {
            const timer = setTimeout(() => {
                onContinue();
            }, delay);
            return () => clearTimeout(timer);
        }
    }, [autoAdvance, delay, onContinue]);

    const getEventIcon = () => {
        switch (eventType) {
            case 'battle': return '⚔️';
            case 'boss': return '👹';
            case 'shop': return '🏪';
            case 'shrine': return '⛩️';
            case 'treasure': return '💎';
            case 'elite': return '💀';
            default: return '❓';
        }
    };

    const getEventMessage = () => {
        if (message) return message;

        if (type === 'intro') {
            switch (eventType) {
                case 'battle':
                    const enemyNames = eventData?.map(enemy => t(`enemies.${enemy.id}`) || enemy.nameKey).join(', ') || t('events.unknownEnemies');
                    return t('events.battleIntro', { enemies: enemyNames });
                case 'boss':
                    const bossName = eventData?.[0]?.nameKey || t('enemies.boss');
                    return t('events.bossIntro', { boss: bossName });
                case 'shop':
                    return t('events.shopIntro');
                case 'shrine':
                    return t('events.shrineIntro');
                case 'treasure':
                    return t('events.treasureIntro');
                case 'elite':
                    const eliteName = eventData?.[0]?.nameKey || t('enemies.elite');
                    return t('events.eliteIntro', { elite: eliteName });
                default:
                    return t('events.encounterIntro', { event: t(`rooms.${eventType}`) });
            }
        } else { // outro
            switch (eventType) {
                case 'battle':
                case 'boss':
                case 'elite':
                    return t('events.battleOutro');
                case 'shop':
                    return t('events.shopOutro');
                case 'shrine':
                    return t('events.shrineOutro');
                case 'treasure':
                    return t('events.treasureOutro');
                default:
                    return t('events.encounterOutro');
            }
        }
    };

    const getBackgroundClass = () => {
        switch (eventType) {
            case 'battle':
            case 'elite':
                return 'bg-gradient-to-b from-red-900 to-gray-900';
            case 'boss':
                return 'bg-gradient-to-b from-purple-900 to-black';
            case 'shop':
                return 'bg-gradient-to-b from-blue-900 to-gray-900';
            case 'shrine':
                return 'bg-gradient-to-b from-yellow-900 to-gray-900';
            case 'treasure':
                return 'bg-gradient-to-b from-amber-900 to-gray-900';
            default:
                return 'bg-gradient-to-b from-gray-900 to-black';
        }
    };

    return (
        <ScreenContainer className={`${getBackgroundClass()} justify-center items-center`}>
            <div className="text-center max-w-md mx-auto space-y-4">
                {/* Event Icon */}
                <LargeIcon className="animate-pulse">
                    {getEventIcon()}
                </LargeIcon>

                {/* Event Message */}
                <ScreenTitle className="text-white">
                    {getEventMessage()}
                </ScreenTitle>

                {/* Visual Indicator */}
                <BodyText className="text-gray-300">
                    {type === 'intro' ? t('events.preparing') : t('events.returning')}
                </BodyText>

                {/* Manual Continue Button (optional) */}
                {!autoAdvance && onContinue && (
                    <PrimaryButton onClick={onContinue} className="bg-amber-600 hover:bg-amber-500">
                        {t('events.continue')}
                    </PrimaryButton>
                )}

                {/* Auto-advance indicator */}
                {autoAdvance && (
                    <SmallText className="text-gray-400">
                        {t('events.autoAdvancing')}...
                    </SmallText>
                )}
            </div>
        </ScreenContainer>
    );
}