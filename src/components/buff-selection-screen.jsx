// filename: src/components/buff-selection-screen.jsx

import React, { useState, useEffect } from 'react';
import { BuffSystem } from '../systems/buffs';
import { t, Localization } from '../core/localization';
import Logger from '../core/logger';

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
        <div className="h-full bg-rpg-radial text-rpg-text flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-rpg-primary mb-2">✨ {t('buffs.chooseYourBlessing')} ✨</h1>
                    <p className="text-lg text-rpg-text opacity-80">{t('buffs.selectOneBuffForBattle')}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {buffChoices.map((buff) => (
                        <button
                            key={buff.key}
                            onClick={() => handleSelectBuff(buff.key)}
                            className={`p-6 rounded-lg border-2 transition-all duration-200 text-left ${
                                selectedBuff === buff.key
                                    ? 'bg-rpg-primary border-legendary shadow-lg scale-105'
                                    : 'bg-rpg-bg-darker border-rpg-secondary hover:border-rpg-primary hover:scale-102'
                            }`}
                        >
                            <div className="text-5xl mb-3 text-center">{buff.icon}</div>
                            <h3 className="text-xl font-bold text-rpg-primary mb-2 text-center">
                                {typeof buff.name === 'object' ? buff.name[Localization.getCurrentLanguage()] : buff.name}
                            </h3>
                            <p className="text-sm text-rpg-text opacity-90 text-center">
                                {typeof buff.description === 'object' ? buff.description[Localization.getCurrentLanguage()] : buff.description}
                            </p>
                            {selectedBuff === buff.key && (
                                <div className="mt-3 text-center text-uncommon font-bold">✓ {t('buffs.selected')}</div>
                            )}
                        </button>
                    ))}
                </div>

                <div className="flex gap-4 justify-center">
                    <button
                        onClick={handleSkip}
                        className="px-6 py-3 bg-rpg-secondary hover:bg-rpg-primary text-rpg-text font-bold rounded-lg transition-colors"
                    >
                        {t('buffs.skip')}
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={!selectedBuff}
                        className={`px-8 py-3 font-bold rounded-lg transition-all ${
                            selectedBuff
                                ? 'bg-uncommon hover:bg-rare text-white'
                                : 'bg-rpg-secondary opacity-50 cursor-not-allowed text-rpg-text'
                        }`}
                    >
                        {t('buffs.confirm')}
                    </button>
                </div>

                <div className="mt-6 text-center text-sm text-rpg-text opacity-60">
                    {t('buffs.buffsStackAcrossBattles')}
                </div>
            </div>
        </div>
    );
}
