// filename: src/components/buff-selection-screen.jsx

import React, { useState, useEffect } from 'react';
import { BuffSystem } from '../systems/buffs';
import { t, Localization } from '../core/localization';
import Logger from '../core/logger';
import {
    ScreenContainer,
    ScreenContent,
    ScreenTitle,
    BodyText,
    SmallText,
    PrimaryButton,
    SecondaryButton,
    Card,
    CardTitle,
    LargeIcon,
    ThreeColumnGrid
} from '../design-system/components';

/**
 * Hades-style buff selection screen shown before battles
 */
export default function BuffSelectionScreen({ onBuffSelected }) {
    const [buffChoices, setBuffChoices] = useState([]);
    const [selectedBuff, setSelectedBuff] = useState(null);

    useEffect(() => {
        // Generate 3 random buff choices
        const choices = BuffSystem.generateBuffChoices(3);
        setBuffChoices(choices);
        Logger.log(`Generated buff choices: ${choices.map(b => b.key).join(', ')}`, 'SYSTEM');
    }, []);

    const handleSelectBuff = (buffKey) => {
        setSelectedBuff(buffKey);
    };

    const handleConfirm = () => {
        if (selectedBuff) {
            BuffSystem.applyBuff(selectedBuff);
            Logger.log(`Buff selected and applied: ${selectedBuff}`, 'SYSTEM');
            onBuffSelected(selectedBuff);
        }
    };

    const handleSkip = () => {
        Logger.log('Buff selection skipped', 'SYSTEM');
        onBuffSelected(null);
    };

    return (
        <ScreenContainer>
            <ScreenContent className="justify-between py-4">
                <div className="text-center">
                    <ScreenTitle>✨ {t('buffs.chooseYourBlessing')} ✨</ScreenTitle>
                    <BodyText className="opacity-80 mt-2">{t('buffs.selectOneBuffForBattle')}</BodyText>
                </div>

                <ThreeColumnGrid className="my-4">
                    {buffChoices.map((buff) => (
                        <button
                            key={buff.key}
                            onClick={() => handleSelectBuff(buff.key)}
                            className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                                selectedBuff === buff.key
                                    ? 'bg-rpg-primary border-legendary shadow-lg scale-105'
                                    : 'bg-rpg-bg-darker border-rpg-secondary hover:border-rpg-primary hover:scale-102'
                            }`}
                        >
                            <LargeIcon className="text-center mb-2">{buff.icon}</LargeIcon>
                            <CardTitle className="text-rpg-primary text-center mb-1">
                                {typeof buff.name === 'object' ? buff.name[Localization.getCurrentLanguage()] : buff.name}
                            </CardTitle>
                            <SmallText className="opacity-90 text-center">
                                {typeof buff.description === 'object' ? buff.description[Localization.getCurrentLanguage()] : buff.description}
                            </SmallText>
                            {selectedBuff === buff.key && (
                                <BodyText className="mt-2 text-center text-uncommon font-bold">✓ {t('buffs.selected')}</BodyText>
                            )}
                        </button>
                    ))}
                </ThreeColumnGrid>

                <div className="flex gap-3 justify-center">
                    <SecondaryButton onClick={handleSkip}>
                        {t('buffs.skip')}
                    </SecondaryButton>
                    <PrimaryButton
                        onClick={handleConfirm}
                        disabled={!selectedBuff}
                        className={!selectedBuff ? 'opacity-50 cursor-not-allowed' : ''}
                    >
                        {t('buffs.confirm')}
                    </PrimaryButton>
                </div>

                <SmallText className="text-center opacity-60 mt-3">
                    {t('buffs.buffsStackAcrossBattles')}
                </SmallText>
            </ScreenContent>
        </ScreenContainer>
    );
}
