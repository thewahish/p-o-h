// filename: src/components/save-slot-screen.jsx

import React, { useState, useEffect } from 'react';
import { GameState } from '../core/state.js';
import { generateDungeon } from '../systems/dungeon.js';
import { t } from '../core/localization.js';
import Logger from '../core/logger.js';
import SoulForge from './soul-forge.jsx';
import characterService from '../services/character-service.js';
import rewardService from '../services/reward-service.js';
import { SaveExporter } from '../utils/save-exporter.js';

export default function SaveSlotScreen({ characterId, onBack, onGameStart }) {
    const [saveSlots, setSaveSlots] = useState([]);
    const [showConfirmDialog, setShowConfirmDialog] = useState(null);
    const [showSoulForge, setShowSoulForge] = useState(null); // null or { characterId, slotNumber }
    const [expandedSlot, setExpandedSlot] = useState(1); // Which slot is currently expanded

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
            // Initialize character-specific services
            characterService.initialize(characterId);
            rewardService.initialize(characterId);
            Logger.log(`Initialized services for ${characterId}`, 'SYSTEM');

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

        // Initialize character-specific services
        characterService.initialize(characterId);
        rewardService.initialize(characterId);
        Logger.log(`Initialized services for ${characterId}`, 'SYSTEM');

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
            <div className="fixed inset-0 bg-rpg-bg-darkest/90 flex items-center justify-center z-[200] p-4">
                <div className="bg-rpg-bg-darker border-2 border-rpg-primary rounded-lg p-6 max-w-md w-full text-center backdrop-blur-sm">
                    <h2 className="text-2xl font-bold text-rpg-primary mb-4">{t('saveSlots.confirm')}</h2>
                    <p className="text-rpg-text opacity-80 mb-6">{showConfirmDialog.message}</p>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setShowConfirmDialog(null)}
                            className="flex-1 bg-rpg-secondary hover:bg-rpg-primary text-rpg-text font-bold py-2 px-4 rounded-lg"
                        >
                            {t('saveSlots.cancel')}
                        </button>
                        <button
                            onClick={confirmAction}
                            className="flex-1 bg-health-full hover:bg-health-mid text-rpg-text font-bold py-2 px-4 rounded-lg"
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
        <div className="h-[90vh] bg-rpg-radial text-rpg-text p-2 flex flex-col">
            <div className="max-w-md mx-auto w-full flex-1 flex flex-col min-h-0">
                <div className="text-center mb-2 flex-shrink-0">
                    <div className="flex justify-between items-center mb-2">
                        <button
                            onClick={onBack}
                            className="text-rpg-primary hover:text-rpg-secondary text-sm"
                        >
                            ← {t('saveSlots.back')}
                        </button>
                        <button
                            onClick={onBack}
                            className="text-rpg-text opacity-70 hover:text-rpg-primary text-xs bg-rpg-secondary hover:bg-rpg-primary px-2 py-0.5 rounded"
                        >
                            {t('saveSlots.switchCharacter')}
                        </button>
                    </div>
                    <h1 className="text-2xl font-bold text-rpg-primary mb-1">
                        {t(`characters.${characterId}.name`)}
                    </h1>
                    <p className="text-rpg-text opacity-70 text-xs">{t('saveSlots.selectSlot')}</p>
                </div>

                <div className="flex flex-col gap-2 flex-1 min-h-0">
                    {saveSlots.map((slot) => {
                        const isExpanded = expandedSlot === slot.slotNumber;

                        return (
                            <div
                                key={slot.slotNumber}
                                className={`flex-1 bg-rpg-bg-darker bg-opacity-80 border-2 rounded-lg backdrop-blur-sm transition-all flex flex-col ${
                                    isExpanded ? 'border-rpg-primary p-4' : 'border-rpg-secondary p-3 cursor-pointer hover:border-rpg-primary justify-center'
                                }`}
                                onClick={() => !isExpanded && setExpandedSlot(slot.slotNumber)}
                            >
                                {isExpanded ? (
                                    // EXPANDED VIEW - Full details
                                    <>
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="text-xl font-bold text-rpg-primary">
                                                {t('saveSlots.slot')} {slot.slotNumber}
                                            </h3>
                                            {slot.exists && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteSave(slot.slotNumber);
                                                    }}
                                                    className="text-health-mid hover:text-health-full text-sm"
                                                >
                                                    🗑️ {t('saveSlots.delete')}
                                                </button>
                                            )}
                                        </div>

                                        {slot.exists ? (
                                            <div className="mb-4">
                                                <p className="text-rpg-text opacity-80 text-base mb-1">
                                                    {t('saveSlots.level')}: {slot.level} | {t('saveSlots.floor')}: {slot.floor}
                                                </p>
                                                <p className="text-rpg-text opacity-80 text-base mb-1">
                                                    {t('saveSlots.gold')}: {slot.gold}
                                                </p>
                                                <p className="text-epic text-base mb-1">
                                                    👻 {GameState.getCharacterSouls(characterId, slot.slotNumber)} {t('souls.heroSouls')}
                                                </p>
                                                <p className="text-rpg-text opacity-50 text-sm">
                                                    {formatDate(slot.timestamp)}
                                                </p>
                                            </div>
                                        ) : (
                                            <p className="text-rpg-text opacity-50 mb-4 text-base">{t('saveSlots.empty')}</p>
                                        )}

                                        <div className="flex gap-2 flex-wrap">
                                            {slot.exists && (
                                                <>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleLoadGame(slot.slotNumber);
                                                        }}
                                                        className="flex-1 bg-uncommon hover:bg-rare text-rpg-text font-bold py-2 px-4 rounded-lg text-sm"
                                                    >
                                                        {t('saveSlots.load')}
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            SaveExporter.exportSaveToExcel(characterId, slot.slotNumber);
                                                        }}
                                                        className="bg-green-600 hover:bg-green-700 text-rpg-text font-bold py-2 px-3 rounded-lg flex items-center gap-1 text-sm"
                                                        title="Export save to Excel"
                                                    >
                                                        📊
                                                    </button>
                                                </>
                                            )}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleNewGame(slot.slotNumber);
                                                }}
                                                className="flex-1 bg-rpg-primary hover:bg-rpg-secondary text-rpg-text font-bold py-2 px-4 rounded-lg text-sm"
                                            >
                                                {t('saveSlots.newGame')}
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setShowSoulForge({ characterId, slotNumber: slot.slotNumber });
                                                }}
                                                className="bg-rpg-secondary hover:bg-rpg-primary text-rpg-text font-bold py-2 px-4 rounded-lg flex items-center gap-1 text-sm"
                                            >
                                                ⚡ {t('souls.forge')}
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    // COLLAPSED VIEW - Summary centered
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-bold text-rpg-primary">
                                            {t('saveSlots.slot')} {slot.slotNumber}
                                        </h3>
                                        {slot.exists ? (
                                            <p className="text-rpg-text opacity-80 text-sm">
                                                Lv.{slot.level} | Floor {slot.floor}
                                            </p>
                                        ) : (
                                            <p className="text-rpg-text opacity-50 text-sm italic">{t('saveSlots.empty')}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
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