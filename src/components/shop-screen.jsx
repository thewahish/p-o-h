// filename: src/components/shop-screen.jsx

import React, { useState } from 'react';
import { GameState } from '../core/state';
import Logger from '../core/logger';
import { t } from '../core/localization';
import rewardService from '../services/reward-service.js';
import {
    Modal,
    ModalContent,
    ScreenTitle,
    BodyText,
    SmallText,
    PrimaryButton,
    SecondaryButton,
    Card,
    CardTitle
} from '../design-system/components';

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
        <Modal>
            <ModalContent className="flex flex-col justify-between text-center space-y-3">
                <ScreenTitle>🏪 {t('shop.title')}</ScreenTitle>

                <div className="bg-rpg-secondary rounded-lg p-2 border border-rpg-primary">
                    <BodyText large className="text-legendary">💰 {GameState.current.gold} {t('stats.gold')}</BodyText>
                </div>

                <SmallText>{t('shop.onePurchaseOnly')}</SmallText>

                <div className="space-y-2 flex-shrink-0">
                    {items.map(item => (
                        <Card key={item.id} className="text-left">
                            <CardTitle className={rarityColors[item.rarity]}>
                                {item.prefixKey ? `${t(item.prefixKey)} ` : ''}{t(item.nameKey || 'items.sword')}
                            </CardTitle>
                            <SmallText className="capitalize">{t(`rarities.${item.rarity}`)} {item.slot}</SmallText>
                            <div className="flex justify-between items-center mt-2">
                                <div className="text-rpg-text opacity-80 text-xs">
                                    {Object.entries(item.stats).map(([stat, value]) => (
                                        <span key={stat} className="mr-2">{stat.toUpperCase()}: +{value}</span>
                                    ))}
                                </div>
                                <button
                                    onClick={() => handlePurchase(item)}
                                    disabled={purchased || GameState.current.gold < item.price}
                                    className={`font-bold py-1 px-3 rounded transition-colors text-xs ${
                                        errorMessages[item.id]
                                            ? 'bg-health-full text-white'
                                            : 'bg-uncommon hover:bg-rare disabled:bg-rpg-secondary disabled:bg-opacity-50 disabled:cursor-not-allowed text-rpg-text'
                                    }`}
                                    data-item-id={item.id}
                                >
                                    {errorMessages[item.id] || `${item.price} G`}
                                </button>
                            </div>
                        </Card>
                    ))}
                </div>

                {purchased ? (
                     <BodyText className="text-uncommon">{t('shop.thankYou')}</BodyText>
                ) : (
                    <PrimaryButton onClick={onLeave} className="w-full bg-health-full hover:bg-health-mid">
                        {t('shop.leave')}
                    </PrimaryButton>
                )}
            </ModalContent>
        </Modal>
    );
}