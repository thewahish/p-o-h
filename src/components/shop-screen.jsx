// filename: src/components/shop-screen.jsx

import React, { useState } from 'react';
import { GameState } from '../core/state';
import Logger from '../core/logger';
import { t } from '../core/localization';
import rewardService from '../services/reward-service.js';

const rarityColors = {
    common: 'text-common',
    uncommon: 'text-uncommon',
    rare: 'text-rare',
    epic: 'text-epic',
    mythic: 'text-mythic',
    legendary: 'text-legendary',
};

export default function ShopScreen({ inventorySystem, onLeave }) {
    const [items, setItems] = useState(() => {
        // Use RewardService if character is set, fallback to InventorySystem
        if (GameState.current.selectedCharacter && rewardService.currentCharacterId) {
            return rewardService.generateItemsForShop(3, GameState.current.currentFloor);
        }
        return inventorySystem.generateItemsForShop(3, GameState.current.currentFloor);
    });
    const [purchased, setPurchased] = useState(false);
    const [errorMessages, setErrorMessages] = useState({});

    const handlePurchase = (item) => {
        if (purchased) return;

        if (GameState.current.gold >= item.price) {
            GameState.spendGold(item.price);
            GameState.current.inventory.push(item); // Simplified add item
            const itemName = (item.prefixKey ? `${t(item.prefixKey)} ` : '') + t(item.nameKey || 'items.sword');
            Logger.log(`Purchased ${itemName} for ${item.price} gold.`, 'PLAYER');
            setPurchased(true);
            
            // Auto-leave after a short delay
            setTimeout(() => {
                onLeave();
            }, 1000);

        } else {
            const itemName = (item.prefixKey ? `${t(item.prefixKey)} ` : '') + t(item.nameKey || 'items.sword');
            Logger.log(`Not enough gold to purchase ${itemName}.`, 'PLAYER');

            // Show temporary error message using React state (XSS-safe)
            setErrorMessages(prev => ({ ...prev, [item.id]: t('shop.notEnoughGold') }));
            setTimeout(() => {
                setErrorMessages(prev => {
                    const updated = { ...prev };
                    delete updated[item.id];
                    return updated;
                });
            }, 2000);
        }
    };

    return (
        <div className="fixed inset-0 bg-rpg-bg-darkest/90 flex items-center justify-center z-[100] p-4">
            <div className="bg-rpg-bg-darker border-2 border-rpg-primary rounded-lg p-6 max-w-sm w-full text-center shadow-2xl backdrop-blur-sm">
                <h1 className="text-4xl font-bold mb-6 text-rpg-primary">🏪 {t('shop.title')}</h1>
                <div className="mb-4 bg-rpg-secondary rounded-lg p-3 border border-rpg-primary">
                    <div className="text-xl font-bold text-legendary">💰 {GameState.current.gold} {t('stats.gold')}</div>
                </div>
                <p className="text-rpg-text opacity-70 mb-6">{t('shop.onePurchaseOnly')}</p>

                <div className="space-y-4 mb-8">
                    {items.map(item => (
                        <div key={item.id} className="bg-rpg-bg-darkest bg-opacity-80 p-4 rounded-lg text-left backdrop-blur-sm">
                            <h2 className={`font-bold text-lg ${rarityColors[item.rarity]}`}>
                                {item.prefixKey ? `${t(item.prefixKey)} ` : ''}{t(item.nameKey || 'items.sword')}
                            </h2>
                            <p className="text-sm text-rpg-text opacity-60 capitalize">{t(`rarities.${item.rarity}`)} {item.slot}</p>
                            <div className="flex justify-between items-center mt-2">
                                <div className="text-rpg-text opacity-80">
                                    {Object.entries(item.stats).map(([stat, value]) => (
                                        <span key={stat} className="mr-4">{stat.toUpperCase()}: +{value}</span>
                                    ))}
                                </div>
                                <button
                                    onClick={() => handlePurchase(item)}
                                    disabled={purchased || GameState.current.gold < item.price}
                                    className={`font-bold py-2 px-4 rounded transition-colors ${
                                        errorMessages[item.id]
                                            ? 'bg-health-full text-white'
                                            : 'bg-uncommon hover:bg-rare disabled:bg-rpg-secondary disabled:bg-opacity-50 disabled:cursor-not-allowed text-rpg-text'
                                    }`}
                                    data-item-id={item.id}
                                >
                                    {errorMessages[item.id] || `${item.price} G`}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {purchased ? (
                     <p className="text-uncommon">{t('shop.thankYou')}</p>
                ) : (
                    <button
                        onClick={onLeave}
                        className="w-full bg-health-full hover:bg-health-mid text-rpg-text font-bold py-2 px-4 rounded-lg"
                    >
                        {t('shop.leave')}
                    </button>
                )}
            </div>
        </div>
    );
}