// filename: src/components/soul-forge.jsx

import React from 'react';
import { GameState } from '../core/state';
import Logger from '../core/logger';
import { t } from '../core/localization.js';

export default function SoulForge({ onClose }) {
    const totalSouls = GameState.current.totalSouls;
    const upgrades = GameState.getSoulUpgrades();
    const purchased = GameState.current.soulUpgrades;
    // Using global localization system

    const handlePurchase = (upgradeId) => {
        if (GameState.purchaseUpgrade(upgradeId)) {
            Logger.log(`Successfully purchased ${upgrades[upgradeId].name}`, 'UI');
        } else {
            Logger.log(`Cannot purchase ${upgrades[upgradeId].name} - insufficient souls or already owned`, 'UI');
        }
    };

    const getUpgradeStatus = (upgradeId) => {
        if (purchased[upgradeId]) return 'owned';
        if (totalSouls >= upgrades[upgradeId].cost) return 'available';
        return 'locked';
    };

    const getUpgradeButtonClass = (status) => {
        switch (status) {
            case 'owned': return 'bg-green-600 text-green-100 cursor-default';
            case 'available': return 'bg-amber-600 hover:bg-amber-500 text-white cursor-pointer';
            case 'locked': return 'bg-gray-600 text-gray-400 cursor-not-allowed';
            default: return '';
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900/90 flex items-center justify-center z-[100] p-4">
            <div className="bg-gray-800 border-2 border-purple-500 rounded-lg p-6 max-w-lg w-full shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-purple-400">⚡ {t('souls.forge')}</h1>
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-white text-2xl font-bold"
                    >
                        ×
                    </button>
                </div>

                <div className="mb-6 text-center">
                    <div className="text-2xl font-bold text-purple-300">
                        👻 {totalSouls} {t('souls.heroSouls')}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                        {t('souls.permanentUpgrades')}
                    </div>
                </div>

                <div className="space-y-4">
                    {Object.entries(upgrades).map(([upgradeId, upgrade]) => {
                        const status = getUpgradeStatus(upgradeId);
                        const isOwned = status === 'owned';
                        const canAfford = status === 'available';
                        
                        return (
                            <div key={upgradeId} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-bold text-white">{t(`upgrades.${upgradeId}.name`)}</h3>
                                    <div className="text-purple-300 font-bold">
                                        {isOwned ? `✓ ${t('souls.owned')}` : `${upgrade.cost} 👻`}
                                    </div>
                                </div>
                                <p className="text-gray-300 text-sm mb-3">{t(`upgrades.${upgradeId}.description`)}</p>
                                <button
                                    onClick={() => canAfford && handlePurchase(upgradeId)}
                                    disabled={!canAfford}
                                    className={`w-full py-2 px-4 rounded font-bold transition-colors ${getUpgradeButtonClass(status)}`}
                                >
                                    {isOwned ? t('souls.purchased') : canAfford ? t('souls.purchaseCost', {cost: upgrade.cost}) : t('souls.needSouls', {cost: upgrade.cost})}
                                </button>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-6 text-center">
                    <button
                        onClick={onClose}
                        className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                    >
                        {t('souls.closeForge')}
                    </button>
                </div>

                <div className="mt-4 text-xs text-gray-500 text-center">
                    {t('souls.earnDescription')}
                </div>
            </div>
        </div>
    );
}