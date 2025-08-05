// src/components/ShopScreen.jsx
import React, { useState } from 'react';
import { GameConfig } from '../constants/config';
import { GameState } from '../core/state';

export default function ShopScreen({ inventorySystem, onLeave }) {
  const [items] = useState(() => {
    // Generate 3 random items for the shop
    return Array.from({ length: 3 }, () =>
      inventorySystem.generateItem(
        getRandomItemType(),
        GameState.current.currentFloor
      )
    );
  });

  const [gold, setGold] = useState(GameState.current.gold);

  const handlePurchase = (item) => {
    if (gold < item.sellPrice) {
      alert("Not enough gold!");
      return;
    }
    
    if (!GameState.addItemToInventory(item)) {
      alert("Inventory is full!");
      return;
    }
    
    GameState.spendGold(item.sellPrice);
    
    // Show purchase confirmation and immediately exit
    alert(`Purchased ${item.name}!\n\nThe shopkeeper smiles: "Thank you for your business! I'm closing up now."`);
    
    // Immediately leave the shop
    onLeave();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4 flex flex-col items-center">
      <h2 className="text-3xl font-bold text-amber-400 mb-4">🏪 Traveling Merchant</h2>
      
      <div className="mb-6 text-yellow-400 font-bold text-xl">
        💰 Gold: {gold}
      </div>

      <div className="text-center text-gray-300 mb-6 max-w-md bg-gray-800 p-4 rounded-lg border border-amber-600">
        <p className="italic">"Welcome, brave adventurer! I have rare wares from distant lands."</p>
        <p className="text-amber-300 mt-2 font-bold">⚠️ Choose carefully - I only sell ONE item per customer! ⚠️</p>
      </div>
      
      <div className="space-y-4 w-full max-w-md">
        {items.map((item, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-lg border bg-gray-800 hover:bg-gray-700 transition-all duration-200 transform hover:scale-105`}
            style={{ borderColor: GameConfig.RARITIES[item.rarity].color }}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="font-bold text-lg mb-1" style={{ color: GameConfig.RARITIES[item.rarity].color }}>
                  {item.icon} {item.name}
                </div>
                <div className="text-sm text-gray-400 mb-2">{item.description}</div>
                <div className="text-xs text-green-300">
                  {Object.entries(item.stats)
                    .map(([stat, val]) => `${stat.toUpperCase()}: ${val > 0 ? '+' : ''}${val}`)
                    .join(' • ')}
                </div>
              </div>
              
              <div className="flex flex-col items-end ml-4">
                <div className="font-bold text-yellow-400 text-xl mb-2">{item.sellPrice}💰</div>
                <button
                  onClick={() => handlePurchase(item)}
                  className={`px-4 py-2 rounded-lg font-bold transition-all duration-200 ${
                    gold >= item.sellPrice
                      ? 'bg-green-600 hover:bg-green-500 text-white hover:shadow-lg transform hover:scale-105'
                      : 'bg-gray-600 cursor-not-allowed text-gray-400'
                  }`}
                  disabled={gold < item.sellPrice}
                >
                  {gold >= item.sellPrice ? '🛒 Buy Now' : '❌ Too Expensive'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onLeave}
        className="mt-8 bg-red-700 hover:bg-red-600 px-6 py-3 rounded-lg font-bold transition-colors"
      >
        🚪 Leave Without Buying
      </button>
      
      <div className="mt-4 text-xs text-gray-500 text-center">
        💡 Tip: Items scale with floor level. Higher floors = better loot!
      </div>
    </div>
  );
}

function getRandomItemType() {
  const types = Object.keys(GameConfig.ITEM_TYPES);
  return types[Math.floor(Math.random() * types.length)];
}