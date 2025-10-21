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
        <div className="min-h-screen max-h-screen bg-rpg-radial text-rpg-text flex items-center justify-center p-2 overflow-y-auto">
            <div className="max-w-2xl w-full flex flex-col py-4 justify-between flex-1">
                <div className="text-center mb-3 flex-shrink-0">
                    <h1 className="text-2xl font-bold text-rpg-primary mb-1">✨ {t('buffs.chooseYourBlessing')} ✨</h1>
                    <p className="text-sm text-rpg-text opacity-80">{t('buffs.selectOneBuffForBattle')}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 flex-shrink-0">
                    {buffChoices.map((buff) => (
                        <button
                            key={buff.key}
                            onClick={() => handleSelectBuff(buff.key)}
                            className={`p-3 rounded-lg border-2 transition-all duration-200 text-left h-fit ${
                                selectedBuff === buff.key
                                    ? 'bg-rpg-primary border-legendary shadow-lg scale-105'
                                    : 'bg-rpg-bg-darker border-rpg-secondary hover:border-rpg-primary hover:scale-102'
                            }`}
                        >
                            <div className="text-4xl mb-2 text-center">{buff.icon}</div>
                            <h3 className="text-base font-bold text-rpg-primary mb-1 text-center">
                                {typeof buff.name === 'object' ? buff.name[Localization.getCurrentLanguage()] : buff.name}
                            </h3>
                            <p className="text-xs text-rpg-text opacity-90 text-center">
                                {typeof buff.description === 'object' ? buff.description[Localization.getCurrentLanguage()] : buff.description}
                            </p>
                            {selectedBuff === buff.key && (
                                <div className="mt-2 text-center text-uncommon font-bold text-sm">✓ {t('buffs.selected')}</div>
                            )}
                        </button>
                    ))}
                </div>

                <div className="flex gap-3 justify-center mb-2 flex-shrink-0">
                    <button
                        onClick={handleSkip}
                        className="px-4 py-2 bg-rpg-secondary hover:bg-rpg-primary text-rpg-text font-bold rounded-lg transition-colors text-sm"
                    >
                        {t('buffs.skip')}
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={!selectedBuff}
                        className={`px-6 py-2 font-bold rounded-lg transition-all text-sm ${
                            selectedBuff
                                ? 'bg-uncommon hover:bg-rare text-white'
                                : 'bg-rpg-secondary opacity-50 cursor-not-allowed text-rpg-text'
                        }`}
                    >
                        {t('buffs.confirm')}
                    </button>
                </div>

                <div className="text-center text-xs text-rpg-text opacity-60 flex-shrink-0">
                    {t('buffs.buffsStackAcrossBattles')}
                </div>
            </div>
        </div>
    );
}
