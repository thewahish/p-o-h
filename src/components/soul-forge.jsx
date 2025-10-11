// filename: src/components/soul-forge.jsx

import React, { useState, useEffect } from 'react';
import { GameState } from '../core/state';
import Logger from '../core/logger';
import { t } from '../core/localization.js';

export default function SoulForge({ characterId, slotNumber, onClose }) {
    // Use state to trigger re-renders when purchases happen
    const [refreshKey, setRefreshKey] = useState(0);
    
    // Recalculate these values on every render/refresh
    const totalSouls = GameState.getCharacterSouls(characterId, slotNumber);
    const characterLevel = GameState.getCharacterLevel(characterId, slotNumber);
    const upgrades = GameState.getSoulUpgrades(characterId, characterLevel);
    const purchased = GameState.getCharacterUpgrades(characterId, slotNumber);

    const handlePurchase = (upgradeId) => {
        const currentSouls = GameState.getCharacterSouls(characterId, slotNumber);
        const upgradeCost = upgrades[upgradeId].cost;
        const isAlreadyOwned = purchased[upgradeId];
        
        Logger.log(`Purchase attempt: ${upgradeId}, Souls: ${currentSouls}, Cost: ${upgradeCost}, Owned: ${isAlreadyOwned}`, 'UI');
        
        if (GameState.purchaseCharacterUpgrade(characterId, slotNumber, upgradeId)) {
            Logger.log(`Successfully purchased ${upgrades[upgradeId].nameKey} for ${characterId} slot ${slotNumber}`, 'UI');
            // Force re-render to update UI
            setRefreshKey(prev => prev + 1);
        } else {
            Logger.log(`Cannot purchase ${upgrades[upgradeId].nameKey} - insufficient souls or already owned`, 'UI');
        }
    };

    const getUpgradeStatus = (upgradeId) => {
        if (purchased[upgradeId]) return 'owned';
        if (totalSouls >= upgrades[upgradeId].cost) return 'available';
        return 'locked';
    };

    const getUpgradeButtonClass = (status) => {
        switch (status) {
            case 'owned': return 'bg-uncommon text-rpg-text cursor-default';
            case 'available': return 'bg-rpg-primary hover:bg-rpg-secondary text-rpg-text cursor-pointer';
            case 'locked': return 'bg-rpg-secondary bg-opacity-50 text-rpg-text opacity-50 cursor-not-allowed';
            default: return '';
        }
    };

    return (
        <div className="fixed inset-0 bg-rpg-bg-darkest/90 flex items-center justify-center z-[100] p-4">
            <div className="bg-rpg-bg-darker border-2 border-epic rounded-lg p-4 max-w-md w-full max-h-[80vh] overflow-y-auto shadow-2xl backdrop-blur-sm">
                <div className="flex justify-between items-start mb-4">
                    <h1 className="text-2xl font-bold text-epic">⚡ {t('souls.forge')}</h1>
                    <div className="text-center">
                        <p className="text-sm text-epic">{t(`characters.${characterId}.name`)}</p>
                        <p className="text-xs text-epic opacity-80">{t('saveSlots.slot')} {slotNumber}</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="text-rpg-text opacity-70 hover:text-rpg-primary text-2xl font-bold"
                    >
                        ×
                    </button>
                </div>

                <div className="mb-4 text-center">
                    <div className="text-xl font-bold text-epic">
                        👻 {totalSouls} {t('souls.heroSouls')}
                    </div>
                    <div className="text-xs text-rpg-text opacity-70 mt-1">
                        {t('souls.permanentUpgrades')}
                    </div>
                </div>

                <div className="space-y-3">
                    {Object.entries(upgrades).map(([upgradeId, upgrade]) => {
                        const status = getUpgradeStatus(upgradeId);
                        const isOwned = status === 'owned';
                        const canAfford = status === 'available';
                        
                        return (
                            <div key={upgradeId} className="bg-rpg-bg-darker bg-opacity-60 rounded-lg p-3 border border-rpg-secondary backdrop-blur-sm">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="text-sm font-bold text-rpg-text">{t(`upgrades.${upgradeId}.name`)}</h3>
                                    <div className="text-epic font-bold text-sm">
                                        {isOwned ? `✓` : `${upgrade.cost} 👻`}
                                    </div>
                                </div>
                                <p className="text-rpg-text opacity-80 text-xs mb-2">{t(`upgrades.${upgradeId}.description`)}</p>
                                <button
                                    onClick={() => canAfford && handlePurchase(upgradeId)}
                                    disabled={!canAfford}
                                    className={`w-full py-1 px-3 rounded font-bold text-sm transition-colors ${getUpgradeButtonClass(status)}`}
                                >
                                    {isOwned ? t('souls.owned') : canAfford ? t('souls.purchase') : t('souls.needSouls', {cost: upgrade.cost})}
                                </button>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-4 text-center">
                    <button
                        onClick={onClose}
                        className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm"
                    >
                        {t('saveSlots.back')}
                    </button>
                </div>

                <div className="mt-3 text-xs text-gray-500 text-center">
                    {t('souls.earnDescription')}
                </div>
            </div>
        </div>
    );
}