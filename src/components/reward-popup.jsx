// filename: src/components/reward-popup.jsx

import React from 'react';
import { t } from '../core/localization';

export default function RewardPopup({ reward, onClose }) {
    if (!reward) return null;

    const getRewardIcon = (type) => {
        switch (type) {
            case 'gold': return '💰';
            case 'blessing': return '✨';
            case 'item': return '🎁';
            default: return '⭐';
        }
    };

    const getRewardTitle = (type) => {
        switch (type) {
            case 'gold': return t('rewards.goldFound');
            case 'blessing': return t('rewards.blessingReceived');
            case 'item': return t('rewards.itemFound');
            default: return t('rewards.reward');
        }
    };

    return (
        <div className="fixed inset-0 bg-rpg-bg-darkest/60 flex items-center justify-center z-[200] p-4">
            <div className="bg-rpg-bg-darker border-2 border-rpg-primary rounded-lg p-6 max-w-sm w-full text-center shadow-2xl animate-pulse backdrop-blur-sm">
                <div className="text-6xl mb-4">{getRewardIcon(reward.type)}</div>
                <h2 className="text-2xl font-bold text-rpg-primary mb-4">{getRewardTitle(reward.type)}</h2>
                <div className="text-lg text-rpg-text mb-6">
                    {reward.message}
                </div>
                <button
                    onClick={onClose}
                    className="w-full bg-rpg-primary hover:bg-rpg-secondary text-rpg-text font-bold py-3 px-4 rounded-lg text-xl transition-transform transform hover:scale-105"
                >
                    {t('rewards.continue')}
                </button>
            </div>
        </div>
    );
}