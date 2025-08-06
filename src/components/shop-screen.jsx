// filename: src/components/shop-screen.jsx

import React, { useState } from 'react';
import { GameState } from '../core/state';
import Logger from '../core/logger';
import { t } from '../core/localization';

const rarityColors = {
    common: 'text-gray-300',
    uncommon: 'text-green-400',
    rare: 'text-blue-400',
    epic: 'text-purple-500',
    mythic: 'text-orange-400',
    legendary: 'text-yellow-400',
};

export default function ShopScreen({ inventorySystem, onLeave }) {
    const [items, setItems] = useState(() => 
        inventorySystem.generateItemsForShop(3, GameState.current.currentFloor)
    );
    const [purchased, setPurchased] = useState(false);

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
            // Show temporary message instead of alert
            const button = document.querySelector(`[data-item-id="${item.id}"]`);
            if (button) {
                const originalText = button.innerHTML;
                button.innerHTML = t('shop.notEnoughGold');
                button.style.backgroundColor = '#dc2626';
                setTimeout(() => {
                    button.innerHTML = originalText;
                    button.style.backgroundColor = '';
                }, 2000);
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900/90 flex items-center justify-center z-[100] p-4">
            <div className="bg-gray-800 border-2 border-amber-500 rounded-lg p-6 max-w-sm w-full text-center shadow-2xl">
                <h1 className="text-4xl font-bold mb-6 text-amber-400">🏪 {t('shop.title')}</h1>
                <div className="mb-4 bg-gray-700 rounded-lg p-3 border border-amber-400">
                    <div className="text-xl font-bold text-yellow-400">💰 {GameState.current.gold} {t('stats.gold')}</div>
                </div>
                <p className="text-gray-400 mb-6">{t('shop.onePurchaseOnly')}</p>

                <div className="space-y-4 mb-8">
                    {items.map(item => (
                        <div key={item.id} className="bg-gray-900 p-4 rounded-lg text-left">
                            <h2 className={`font-bold text-lg ${rarityColors[item.rarity]}`}>
                                {item.prefixKey ? `${t(item.prefixKey)} ` : ''}{t(item.nameKey || 'items.sword')}
                            </h2>
                            <p className="text-sm text-gray-500 capitalize">{t(`rarities.${item.rarity}`)} {item.slot}</p>
                            <div className="flex justify-between items-center mt-2">
                                <div className="text-gray-300">
                                    {Object.entries(item.stats).map(([stat, value]) => (
                                        <span key={stat} className="mr-4">{stat.toUpperCase()}: +{value}</span>
                                    ))}
                                </div>
                                <button
                                    onClick={() => handlePurchase(item)}
                                    disabled={purchased || GameState.current.gold < item.price}
                                    className="bg-green-600 hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded"
                                    data-item-id={item.id}
                                >
                                    {item.price} G
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {purchased ? (
                     <p className="text-green-400">{t('shop.thankYou')}</p>
                ) : (
                    <button
                        onClick={onLeave}
                        className="w-full bg-red-700 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg"
                    >
                        {t('shop.leave')}
                    </button>
                )}
            </div>
        </div>
    );
}