// filename: src/components/save-slot-screen.jsx

import React, { useState, useEffect } from 'react';
import { GameState } from '../core/state.js';
import { generateDungeon } from '../systems/dungeon.js';
import { t } from '../core/localization.js';
import Logger from '../core/logger.js';
import SoulForge from './soul-forge.jsx';

export default function SaveSlotScreen({ characterId, onBack, onGameStart }) {
    const [saveSlots, setSaveSlots] = useState([]);
    const [showConfirmDialog, setShowConfirmDialog] = useState(null);
    const [showSoulForge, setShowSoulForge] = useState(null); // null or { characterId, slotNumber }

    useEffect(() => {
        // Load save slot information
        const slots = [];
        for (let i = 1; i <= 3; i++) {
            const slotInfo = GameState.getSaveSlotInfo(characterId, i);
            slots.push({
                slotNumber: i,
                ...slotInfo
            });
        }
        setSaveSlots(slots);
    }, [characterId]);

    const handleNewGame = (slotNumber) => {
        const existingSave = saveSlots.find(slot => slot.slotNumber === slotNumber);
        if (existingSave && existingSave.exists) {
            setShowConfirmDialog({
                type: 'overwrite',
                slotNumber: slotNumber,
                message: t('saveSlots.confirmOverwrite', { slot: slotNumber })
            });
        } else {
            startNewGame(slotNumber);
        }
    };

    const handleLoadGame = (slotNumber) => {
        const success = GameState.loadGame(characterId, slotNumber);
        if (success) {
            // Generate dungeon for current floor
            generateDungeon();
            Logger.log(`Loaded ${characterId} from slot ${slotNumber}`, 'SYSTEM');
            // Notify parent to transition to exploration
            if (onGameStart) {
                onGameStart();
            }
        } else {
            Logger.log(`Failed to load save slot ${slotNumber}`, 'ERROR');
        }
    };

    const startNewGame = (slotNumber) => {
        Logger.log(`Starting new game for ${characterId} in slot ${slotNumber}`, 'SYSTEM');
        GameState.newGame(characterId);
        // Save immediately
        GameState.saveGame(characterId, slotNumber);
        // Generate dungeon
        setTimeout(() => {
            generateDungeon();
            // Notify parent to transition to exploration
            if (onGameStart) {
                onGameStart();
            }
        }, 10);
        setShowConfirmDialog(null);
    };

    const handleDeleteSave = (slotNumber) => {
        setShowConfirmDialog({
            type: 'delete',
            slotNumber: slotNumber,
            message: t('saveSlots.confirmDelete', { slot: slotNumber })
        });
    };

    const confirmAction = () => {
        if (showConfirmDialog.type === 'overwrite') {
            startNewGame(showConfirmDialog.slotNumber);
        } else if (showConfirmDialog.type === 'delete') {
            GameState.deleteSave(characterId, showConfirmDialog.slotNumber);
            // Refresh save slots
            const slots = [];
            for (let i = 1; i <= 3; i++) {
                const slotInfo = GameState.getSaveSlotInfo(characterId, i);
                slots.push({
                    slotNumber: i,
                    ...slotInfo
                });
            }
            setSaveSlots(slots);
        }
        setShowConfirmDialog(null);
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return '';
        return new Date(timestamp).toLocaleString();
    };

    if (showConfirmDialog) {
        return (
            <div className="fixed inset-0 bg-gray-900/90 flex items-center justify-center z-[200] p-4">
                <div className="bg-gray-800 border-2 border-amber-500 rounded-lg p-6 max-w-md w-full text-center">
                    <h2 className="text-2xl font-bold text-amber-400 mb-4">{t('saveSlots.confirm')}</h2>
                    <p className="text-gray-300 mb-6">{showConfirmDialog.message}</p>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setShowConfirmDialog(null)}
                            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg"
                        >
                            {t('saveSlots.cancel')}
                        </button>
                        <button
                            onClick={confirmAction}
                            className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-lg"
                        >
                            {t('saveSlots.confirm')}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4">
            <div className="max-w-md mx-auto">
                <div className="text-center mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <button
                            onClick={onBack}
                            className="text-amber-400 hover:text-amber-300 text-lg"
                        >
                            ← {t('saveSlots.back')}
                        </button>
                        <button
                            onClick={onBack}
                            className="text-gray-400 hover:text-gray-300 text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded"
                        >
                            {t('saveSlots.switchCharacter')}
                        </button>
                    </div>
                    <h1 className="text-4xl font-bold text-amber-400 mb-2">
                        {t(`characters.${characterId}.name`)}
                    </h1>
                    <p className="text-gray-400">{t('saveSlots.selectSlot')}</p>
                </div>

                <div className="space-y-4">
                    {saveSlots.map((slot) => (
                        <div key={slot.slotNumber} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="text-xl font-bold text-amber-300">
                                    {t('saveSlots.slot')} {slot.slotNumber}
                                </h3>
                                {slot.exists && (
                                    <button
                                        onClick={() => handleDeleteSave(slot.slotNumber)}
                                        className="text-red-400 hover:text-red-300 text-sm"
                                    >
                                        🗑️ {t('saveSlots.delete')}
                                    </button>
                                )}
                            </div>

                            {slot.exists ? (
                                <div className="mb-4">
                                    <p className="text-gray-300">
                                        {t('saveSlots.level')}: {slot.level} | {t('saveSlots.floor')}: {slot.floor}
                                    </p>
                                    <p className="text-gray-300">
                                        {t('saveSlots.gold')}: {slot.gold}
                                    </p>
                                    <p className="text-purple-300">
                                        👻 {GameState.getCharacterSouls(characterId, slot.slotNumber)} {t('souls.heroSouls')}
                                    </p>
                                    <p className="text-gray-500 text-sm">
                                        {formatDate(slot.timestamp)}
                                    </p>
                                </div>
                            ) : (
                                <p className="text-gray-500 mb-4">{t('saveSlots.empty')}</p>
                            )}

                            <div className="flex gap-2">
                                {slot.exists && (
                                    <button
                                        onClick={() => handleLoadGame(slot.slotNumber)}
                                        className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg"
                                    >
                                        {t('saveSlots.load')}
                                    </button>
                                )}
                                <button
                                    onClick={() => handleNewGame(slot.slotNumber)}
                                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg"
                                >
                                    {t('saveSlots.newGame')}
                                </button>
                                <button
                                    onClick={() => setShowSoulForge({ characterId, slotNumber: slot.slotNumber })}
                                    className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-1"
                                >
                                    ⚡ {t('souls.forge')}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        
        {/* Character-specific Soul Forge */}
        {showSoulForge && (
            <SoulForge 
                characterId={showSoulForge.characterId}
                slotNumber={showSoulForge.slotNumber}
                onClose={() => setShowSoulForge(null)}
            />
        )}
    </>
    );
}