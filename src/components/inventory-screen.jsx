// filename: src/components/inventory-screen.jsx

import React, { useState, useEffect } from 'react';
import { GameState } from '../core/state.js';
import { GameConfig } from '../constants/config.js';
import { t } from '../core/localization.js';

export function InventoryScreen({ onClose }) {
    const [player, setPlayer] = useState(GameState.current.player);
    const [inventory, setInventory] = useState(GameState.current.inventory || []);
    const [equipped, setEquipped] = useState(GameState.current.equipped || {});
    const [potions, setPotions] = useState(GameState.current.potions || {});
    const [selectedItem, setSelectedItem] = useState(null);
    const [activeTab, setActiveTab] = useState('equipment'); // equipment, consumables, stats

    useEffect(() => {
        const unsubscribe = GameState.subscribe(() => {
            setPlayer(GameState.current.player);
            setInventory(GameState.current.inventory || []);
            setEquipped(GameState.current.equipped || {});
            setPotions(GameState.current.potions || {});
        });
        return () => unsubscribe();
    }, []);

    const handleEquip = (item) => {
        if (!item || !item.slot) return;

        // Unequip current item in that slot if any
        const currentEquipped = equipped[item.slot];
        if (currentEquipped) {
            GameState.current.inventory.push(currentEquipped);
        }

        // Equip new item
        GameState.current.equipped[item.slot] = item;
        GameState.current.inventory = GameState.current.inventory.filter(i => i.id !== item.id);

        // Recalculate player stats
        GameState.recalculatePlayerStats();
        GameState._notify();
    };

    const handleUnequip = (slot) => {
        const item = equipped[slot];
        if (!item) return;

        // Move to inventory
        GameState.current.inventory.push(item);
        delete GameState.current.equipped[slot];

        // Recalculate player stats
        GameState.recalculatePlayerStats();
        GameState._notify();
    };

    const getRarityColor = (rarity) => {
        return GameConfig.RARITIES[rarity]?.color || '#95a5a6';
    };

    const renderEquipmentSlot = (slotName) => {
        const slotConfig = GameConfig.EQUIPMENT_SLOTS[slotName];
        if (!slotConfig) return null;

        const equippedItem = equipped[slotName];
        const slotLabel = typeof slotConfig.name === 'string' ? slotConfig.name : slotConfig.name[GameState.current.language] || slotConfig.name.en;

        return (
            <div key={slotName} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">{slotConfig.icon}</span>
                        <span className="text-rpg-text font-semibold">{slotLabel}</span>
                    </div>
                    {equippedItem && (
                        <button
                            onClick={() => handleUnequip(slotName)}
                            className="text-xs px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
                        >
                            Unequip
                        </button>
                    )}
                </div>
                {equippedItem ? (
                    <div
                        className="bg-black bg-opacity-40 rounded p-3 cursor-pointer hover:bg-opacity-60 transition-all"
                        onClick={() => setSelectedItem(equippedItem)}
                    >
                        <div className="flex items-center gap-2 mb-1">
                            {equippedItem.prefixKey && (
                                <span className="text-xs text-blue-400">{t(equippedItem.prefixKey)}</span>
                            )}
                            <span className="font-semibold" style={{ color: getRarityColor(equippedItem.rarity) }}>
                                {t(equippedItem.nameKey)}
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs">
                            {Object.entries(equippedItem.stats).map(([stat, value]) => (
                                <span key={stat} className="text-green-400">
                                    +{value} {stat.toUpperCase()}
                                </span>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="bg-black bg-opacity-20 rounded p-3 text-center text-gray-500 italic">
                        Empty
                    </div>
                )}
            </div>
        );
    };

    const renderInventoryItem = (item) => {
        return (
            <div
                key={item.id}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-3 border border-gray-700 cursor-pointer hover:border-rpg-primary transition-all"
                onClick={() => setSelectedItem(item)}
            >
                <div className="flex items-center gap-2 mb-1">
                    {item.prefixKey && (
                        <span className="text-xs text-blue-400">{t(item.prefixKey)}</span>
                    )}
                    <span className="font-semibold text-sm" style={{ color: getRarityColor(item.rarity) }}>
                        {t(item.nameKey)}
                    </span>
                </div>
                <div className="flex flex-wrap gap-2 text-xs mb-2">
                    {Object.entries(item.stats).map(([stat, value]) => (
                        <span key={stat} className="text-green-400">
                            +{value} {stat.toUpperCase()}
                        </span>
                    ))}
                </div>
                {item.slot && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEquip(item);
                        }}
                        className="text-xs px-3 py-1 bg-rpg-primary hover:bg-rpg-secondary text-black rounded w-full font-semibold"
                    >
                        Equip
                    </button>
                )}
            </div>
        );
    };

    const renderConsumables = () => {
        return (
            <div className="space-y-3">
                <h3 className="text-xl font-bold text-rpg-primary mb-4">Potions & Consumables</h3>
                <div className="grid grid-cols-2 gap-3">
                    {Object.entries(potions).map(([potionType, quantity]) => {
                        const potionConfig = GameConfig.ITEM_TYPES[potionType];
                        if (!potionConfig) return null;

                        const potionName = typeof potionConfig.name === 'string' ? potionConfig.name : potionConfig.name[GameState.current.language] || potionConfig.name.en;
                        const potionDesc = typeof potionConfig.description === 'string' ? potionConfig.description : potionConfig.description[GameState.current.language] || potionConfig.description.en;

                        return (
                            <div key={potionType} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-4 border border-gray-700">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-3xl">{potionConfig.icon}</span>
                                    <div className="flex-1">
                                        <div className="font-semibold text-rpg-text">{potionName}</div>
                                        <div className="text-sm text-rpg-primary">x{quantity}</div>
                                    </div>
                                </div>
                                <div className="text-xs text-gray-400">{potionDesc}</div>
                            </div>
                        );
                    })}
                </div>
                {Object.keys(potions).length === 0 && (
                    <div className="text-center text-gray-500 italic py-8">
                        No consumables in inventory
                    </div>
                )}
            </div>
        );
    };

    const renderStats = () => {
        const stats = player.stats;
        const resource = player.resource;

        return (
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-rpg-primary mb-4">Character Stats</h3>

                {/* Character Info */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-4 border border-gray-700">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="text-5xl">{player.icon}</div>
                        <div>
                            <div className="text-2xl font-bold text-rpg-primary">{t(player.nameKey)}</div>
                            <div className="text-rpg-text">Level {GameState.current.level}</div>
                        </div>
                    </div>
                </div>

                {/* Primary Stats */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-4 border border-gray-700">
                    <h4 className="text-lg font-semibold text-rpg-text mb-3">Combat Stats</h4>
                    <div className="grid grid-cols-2 gap-3">
                        <StatDisplay label="HP" value={stats.hp} icon="❤️" />
                        <StatDisplay label={t(resource.nameKey)} value={`${resource.current}/${resource.max}`} icon={resource.icon} />
                        <StatDisplay label="ATK" value={stats.atk} icon="⚔️" />
                        <StatDisplay label="DEF" value={stats.def} icon="🛡️" />
                        <StatDisplay label="SPD" value={stats.spd} icon="⚡" />
                        <StatDisplay label="CRIT" value={`${(stats.crit * 100).toFixed(0)}%`} icon="💥" />
                    </div>
                </div>

                {/* Resources */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-4 border border-gray-700">
                    <h4 className="text-lg font-semibold text-rpg-text mb-3">Resources</h4>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-rpg-text">💰 Gold</span>
                            <span className="text-rpg-primary font-bold">{GameState.current.gold}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-rpg-text">✨ Hero Souls</span>
                            <span className="text-rpg-primary font-bold">{GameState.current.souls}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-rpg-text">📊 Experience</span>
                            <span className="text-rpg-primary font-bold">{GameState.current.experience}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4">
            <div className="w-full max-w-4xl max-h-[90vh] bg-gradient-to-br from-rpg-bg via-gray-900 to-black rounded-lg shadow-2xl border-2 border-rpg-primary overflow-hidden flex flex-col">

                {/* Header */}
                <div className="bg-gradient-to-r from-rpg-secondary to-rpg-primary p-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-black">🎒 Inventory</h2>
                    <button
                        onClick={onClose}
                        className="text-2xl font-bold text-black hover:text-red-600 transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* Tab Navigation */}
                <div className="flex bg-gray-900 border-b border-gray-700">
                    <button
                        onClick={() => setActiveTab('equipment')}
                        className={`flex-1 py-3 font-semibold transition-colors ${
                            activeTab === 'equipment'
                                ? 'bg-rpg-primary text-black'
                                : 'text-rpg-text hover:bg-gray-800'
                        }`}
                    >
                        ⚔️ Equipment
                    </button>
                    <button
                        onClick={() => setActiveTab('consumables')}
                        className={`flex-1 py-3 font-semibold transition-colors ${
                            activeTab === 'consumables'
                                ? 'bg-rpg-primary text-black'
                                : 'text-rpg-text hover:bg-gray-800'
                        }`}
                    >
                        🧪 Consumables
                    </button>
                    <button
                        onClick={() => setActiveTab('stats')}
                        className={`flex-1 py-3 font-semibold transition-colors ${
                            activeTab === 'stats'
                                ? 'bg-rpg-primary text-black'
                                : 'text-rpg-text hover:bg-gray-800'
                        }`}
                    >
                        📊 Stats
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-6">
                    {activeTab === 'equipment' && (
                        <div className="space-y-6">
                            {/* Equipped Items */}
                            <div>
                                <h3 className="text-xl font-bold text-rpg-primary mb-4">Equipped</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {Object.keys(GameConfig.EQUIPMENT_SLOTS).map(slot => renderEquipmentSlot(slot))}
                                </div>
                            </div>

                            {/* Inventory Items */}
                            <div>
                                <h3 className="text-xl font-bold text-rpg-primary mb-4">
                                    Inventory ({inventory.length}/{GameConfig.INVENTORY.maxSlots})
                                </h3>
                                {inventory.length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {inventory.map(item => renderInventoryItem(item))}
                                    </div>
                                ) : (
                                    <div className="text-center text-gray-500 italic py-8">
                                        No items in inventory. Visit shops to purchase equipment!
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'consumables' && renderConsumables()}
                    {activeTab === 'stats' && renderStats()}
                </div>

                {/* Footer */}
                <div className="bg-gray-900 border-t border-gray-700 p-4 flex justify-between items-center">
                    <div className="text-rpg-text text-sm">
                        Floor {GameState.current.currentFloor} • {t(player.nameKey)} • Lv.{GameState.current.level}
                    </div>
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-rpg-primary hover:bg-rpg-secondary text-black font-bold rounded transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>

            {/* Item Detail Modal (if item selected) */}
            {selectedItem && (
                <div
                    className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
                    onClick={() => setSelectedItem(null)}
                >
                    <div
                        className="bg-gray-900 rounded-lg p-6 max-w-md border-2 border-rpg-primary"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-xl font-bold mb-2" style={{ color: getRarityColor(selectedItem.rarity) }}>
                            {selectedItem.prefixKey && `${t(selectedItem.prefixKey)} `}
                            {t(selectedItem.nameKey)}
                        </h3>
                        <div className="space-y-2 mb-4">
                            <div className="text-sm text-gray-400">
                                Rarity: <span style={{ color: getRarityColor(selectedItem.rarity) }}>
                                    {t(`rarities.${selectedItem.rarity}`)}
                                </span>
                            </div>
                            <div className="text-sm text-gray-400">
                                Slot: {selectedItem.slot || 'None'}
                            </div>
                            <div className="space-y-1 mt-3">
                                {Object.entries(selectedItem.stats).map(([stat, value]) => (
                                    <div key={stat} className="text-green-400">
                                        +{value} {stat.toUpperCase()}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button
                            onClick={() => setSelectedItem(null)}
                            className="w-full px-4 py-2 bg-rpg-primary hover:bg-rpg-secondary text-black font-bold rounded"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// Helper component for stat display
function StatDisplay({ label, value, icon }) {
    return (
        <div className="bg-black bg-opacity-40 rounded p-2">
            <div className="flex items-center gap-2">
                <span className="text-xl">{icon}</span>
                <div className="flex-1">
                    <div className="text-xs text-gray-400">{label}</div>
                    <div className="text-lg font-bold text-rpg-primary">{value}</div>
                </div>
            </div>
        </div>
    );
}
