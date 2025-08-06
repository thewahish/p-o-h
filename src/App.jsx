// filename: src/App.jsx

import React, { useEffect, useState, useCallback } from "react";
import Logger from './core/logger.js';
import PersistentDebugger from "./components/persistent-debugger.jsx";

// === Import core game systems ===
import { Characters } from "./constants/characters";
import { RoomIcons, RoomTypes, generateDungeon, revealAdjacentRooms } from "./systems/dungeon";
import { GameState } from "./core/state.js";
import { CombatSystem } from "./systems/combat.js";
import { InventorySystem } from "./systems/inventory.js";
import { Localization, t } from "./core/localization.js";
import LanguageSelection from "./components/language-selection.jsx";
import { GameConfig } from "./constants/config.js";

// === Import UI screens ===
import BattleScreen from "./components/battle-screen.jsx";
import ShopScreen from "./components/shop-screen.jsx";
import OutcomeScreen from "./components/outcome-screen.jsx";
import SoulForge from "./components/soul-forge.jsx";
import RewardPopup from "./components/reward-popup.jsx";

Logger.log('App.jsx: Module loaded.', 'SYSTEM');

// --- TOP-LEVEL INITIALIZATIONS ---
// Remove old localization initialization
let appForceUpdate = () => Logger.log('forceUI called before App component mounted!', 'ERROR');

const combatSystem = new CombatSystem({ 
    forceUpdate: () => appForceUpdate(),
});
const inventorySystem = new InventorySystem({});
// --- END OF TOP-LEVEL INITIALIZATIONS ---

export default function App() {
    Logger.log('App component rendering started.', 'UI');
    const [gameState, setGameState] = useState(GameState.current);
    const [combatLog, setCombatLog] = useState([]);
    const [battleResults, setBattleResults] = useState(null);
    const [showSoulForge, setShowSoulForge] = useState(false);
    const [showLanguageSelection, setShowLanguageSelection] = useState(false);
    const [localizationReady, setLocalizationReady] = useState(false);
    const [currentLanguage, setCurrentLanguage] = useState('en');
    const [rewardPopup, setRewardPopup] = useState(null);
    
    const forceUI = useCallback(() => {
        setGameState({ ...GameState.current });
    }, []);

    useEffect(() => {
        appForceUpdate = forceUI;
    }, [forceUI]);
    
    useEffect(() => {
        Logger.log('App component mounted. Initializing localization and GameState.', 'UI');
        
        // Initialize localization
        const initializeApp = async () => {
            await Localization.loadTranslations();
            setLocalizationReady(true);
            setCurrentLanguage(Localization.getCurrentLanguage());
            
            // Subscribe to language changes for app-wide re-rendering
            const unsubscribe = Localization.subscribe((newLang) => {
                setCurrentLanguage(newLang);
                Logger.log(`App language changed to: ${newLang}`, 'UI');
            });
            
            // Check if language selection needed
            const savedLanguage = localStorage.getItem('pathOfHeroes_language');
            if (!savedLanguage) {
                setShowLanguageSelection(true);
            }
            
            return unsubscribe;
        };
        
        let localizationUnsubscribe;
        initializeApp().then(unsubscribe => {
            localizationUnsubscribe = unsubscribe;
        });
        
        // Load persistent soul data
        GameState.loadSoulData();
        const gameStateUnsubscribe = GameState.subscribe(setGameState);
        
        return () => {
            Logger.log('App component unmounting. Unsubscribing from GameState and Localization.', 'UI');
            gameStateUnsubscribe();
            if (localizationUnsubscribe) {
                localizationUnsubscribe();
            }
        };
    }, []);

    const getRoomIcon = (room) => {
        if (room.completed) return getCompletedRoomIcon(room);
        return RoomIcons[room.type];
    };

    const getCompletedRoomIcon = (room) => {
        switch (room.type) {
            case RoomTypes.BATTLE: case RoomTypes.ELITE: case RoomTypes.BOSS: return "✅";
            case RoomTypes.TREASURE: return "📦";
            case RoomTypes.SHOP: return "🏪";
            case RoomTypes.SHRINE: return "✨";
            default: return "·";
        }
    };

    const getRoomBackgroundColor = (room, isPlayerHere) => {
        if (isPlayerHere) return "bg-amber-600 animate-pulse";
        if (!room.revealed) return "bg-gray-900";
        if (room.type === RoomTypes.WALL) return "bg-gray-800 text-gray-600"; // Walls are darker and non-interactive
        if (room.completed) {
            switch (room.type) {
                case RoomTypes.BATTLE: case RoomTypes.ELITE: case RoomTypes.BOSS: return "bg-green-900 text-green-400";
                case RoomTypes.TREASURE: return "bg-yellow-900 text-yellow-400";
                case RoomTypes.SHRINE: return "bg-purple-900 text-purple-400";
                default: return "bg-gray-700";
            }
        }
        return "bg-gray-600 hover:bg-gray-500";
    };

    const movePlayer = useCallback((dx, dy) => {
        if (GameState.current.currentScreen !== "exploration") return;
        const pos = GameState.current.playerPos;
        const newX = pos.x + dx;
        const newY = pos.y + dy;
        const dungeon = GameState.current.dungeon;
        if (!dungeon) return;
        if (newX >= 0 && newX < dungeon[0].length && newY >= 0 && newY < dungeon.length) {
            const targetRoom = dungeon[newY][newX];
            // Check if room is revealed AND not a wall before allowing movement
            if (targetRoom.revealed && targetRoom.type !== RoomTypes.WALL) {
                GameState.current.playerPos = { x: newX, y: newY };
                if (!targetRoom.visited) {
                    targetRoom.visited = true;
                    revealAdjacentRooms(dungeon, newX, newY);
                    if (!targetRoom.completed) {
                        handleRoomEvent(targetRoom);
                    }
                }
                forceUI();
            }
        }
    }, [forceUI]);

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (['0', '1', '2', '3', '5'].includes(e.key)) {
                e.preventDefault();
                Logger.log(`Developer hotkey pressed: ${e.key}`, 'INPUT');
                switch (e.key) {
                    case '0':
                        const newGodModeState = !GameState.current.godMode;
                        GameState.update('godMode', newGodModeState);
                        Logger.log(`God Mode Toggled: ${newGodModeState ? 'ON' : 'OFF'}`, 'SYSTEM');
                        break;
                    case '1': GameState.healPlayerToFull(); break;
                    case '2': GameState.addGold(100); break;
                    case '3': if(GameState.current.player) GameState.levelUp(); break;
                    case '5':
                        if (GameState.current.battleInProgress) {
                            combatSystem.instantWin();
                        } else {
                            Logger.log('Cannot instantly win; not in battle.', 'SYSTEM');
                        }
                        break;
                }
                return;
            }
            if (GameState.current.currentScreen !== "exploration") return;
            let dx = 0, dy = 0;
            const isRTL = Localization.getCurrentLanguage() === 'ar';
            switch (e.key.toLowerCase()) {
                case 'arrowup': case 'w': dy = -1; break;
                case 'arrowdown': case 's': dy = 1; break;
                case 'arrowleft': case 'a': dx = isRTL ? 1 : -1; break;
                case 'arrowright': case 'd': dx = isRTL ? -1 : 1; break;
                default: return;
            }
            e.preventDefault();
            Logger.log(`Key press detected: ${e.key}`, 'INPUT');
            movePlayer(dx, dy);
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [movePlayer]);

    const startGame = (characterId) => {
        Logger.log(`Starting new game with ${characterId}`, 'SYSTEM');
        GameState.newGame(characterId);
        // Small delay to ensure state updates propagate
        setTimeout(() => {
            generateDungeon();
        }, 10);
    };

    const handleRoomEvent = (room) => {
        Logger.log(`Handling event for room type: ${room.type}`, 'SYSTEM');
        if (room.encounter && !room.completed) {
            startBattle(room.encounter);
            return;
        }
        switch (room.type) {
            case RoomTypes.SHOP:
                if (!room.completed) {
                    GameState.update('currentScreen', 'shop');
                    room.completed = true;
                }
                break;
            case RoomTypes.TREASURE:
                if (!room.completed) {
                    const goldFound = 20 + Math.floor(Math.random() * 30);
                    GameState.addGold(goldFound);
                    setRewardPopup({
                        type: 'gold',
                        message: t('rewards.goldFoundAmount', {amount: goldFound})
                    });
                    room.completed = true;
                }
                break;
            case RoomTypes.SHRINE:
                if (!room.completed && GameState.current.player) {
                    const blessings = [
                        { nameKey: "blessings.strength", effect: "atk", bonus: 3 }, 
                        { nameKey: "blessings.fortitude", effect: "def", bonus: 2 }, 
                        { nameKey: "blessings.swiftness", effect: "spd", bonus: 2 }, 
                        { nameKey: "blessings.fortune", effect: "crit", bonus: 5 }
                    ];
                    const blessing = blessings[Math.floor(Math.random() * blessings.length)];
                    GameState.current.player.stats[blessing.effect] += blessing.bonus;
                    GameState.current.player.maxStats[blessing.effect] += blessing.bonus;
                    setRewardPopup({
                        type: 'blessing',
                        message: t('rewards.blessingDetails', {
                            blessing: t(blessing.nameKey), 
                            bonus: blessing.bonus, 
                            stat: t(`stats.${blessing.effect}`)
                        })
                    });
                    room.completed = true;
                }
                break;
        }
        forceUI();
    };

    const startBattle = (enemies) => {
        const liveEnemies = enemies.map(e => ({ ...e }));
        setCombatLog([]);
        GameState.current.onBattleEnd = endBattle;
        GameState.update('currentScreen', 'battle');
        combatSystem.startBattle(liveEnemies, { onLog: (msg) => setCombatLog((prev) => [...prev, msg]) });
    };

    const endBattle = (victory, rewards) => {
        Logger.log(`Battle ended. Victory: ${victory}`, 'SYSTEM');
        if (victory) {
            const { x, y } = GameState.current.playerPos;
            GameState.current.dungeon[y][x].completed = true;
            const totalGold = rewards.reduce((sum, r) => sum + (r.gold || 0), 0);
            const totalXp = rewards.reduce((sum, r) => sum + (r.xp || 0), 0);
            GameState.addGold(totalGold);
            GameState.addExperience(totalXp);
            setBattleResults({ gold: totalGold, xp: totalXp });
        } else {
            const penalty = GameState.applyDeathPenalty();
            setBattleResults(penalty);
        }
        GameState.update('currentScreen', 'outcome');
    };

    const handleOutcomeContinue = () => {
        setBattleResults(null);
        if (GameState.current.player && GameState.current.player.stats && GameState.current.player.stats.hp > 0) {
            GameState.update('currentScreen', 'exploration');
        } else {
            // Collect souls before reset
            GameState.collectRunSouls();
            GameState.reset();
        }
    };

    Logger.log(`Rendering screen: ${gameState.currentScreen}`, 'UI');

    // Show loading screen if localization not ready
    if (!localizationReady) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="text-2xl mb-4">🌍</div>
                    <div className="text-lg text-gray-300">Loading...</div>
                </div>
            </div>
        );
    }

    // Show language selection if needed
    if (showLanguageSelection) {
        return <LanguageSelection onLanguageSelected={() => setShowLanguageSelection(false)} />;
    }

    // === SCREEN RENDERING LOGIC ===
    if (gameState.currentScreen === 'outcome') {
        return <><OutcomeScreen victory={gameState.player && gameState.player.stats && gameState.player.stats.hp > 0} results={battleResults} onContinue={handleOutcomeContinue} /><PersistentDebugger /></>;
    }
    if (gameState.currentScreen === "battle") {
        return <><BattleScreen player={gameState.player} enemies={gameState.enemies} combatSystem={combatSystem} combatLog={combatLog} /><PersistentDebugger /></>;
    }
    if (gameState.currentScreen === "shop") {
        return <><ShopScreen inventorySystem={inventorySystem} onLeave={() => GameState.update('currentScreen', 'exploration')} /><PersistentDebugger /></>;
    }
    if (!gameState.gameStarted || gameState.currentScreen === 'main-menu') {
        return (
            <>
                <MainMenu 
                    onStart={startGame} 
                    onSoulForge={() => setShowSoulForge(true)}
                    totalSouls={gameState.totalSouls}
                    currentLanguage={currentLanguage}
                />
                {showSoulForge && <SoulForge onClose={() => setShowSoulForge(false)} />}
                <PersistentDebugger />
            </>
        );
    }

    const dungeon = gameState.dungeon || [];
    const playerPos = gameState.playerPos;
    const player = gameState.player;
    const xpRequiredForLevel = player ? GameState.getRequiredExperience(gameState.level) - GameState.getRequiredExperience(gameState.level - 1) : 1;
    const xpProgressInLevel = player ? gameState.experience - GameState.getRequiredExperience(gameState.level - 1) : 0;
    const xpPercent = xpRequiredForLevel > 0 ? (xpProgressInLevel / xpRequiredForLevel) * 100 : 0;

    // Don't render exploration if dungeon or playerPos not ready
    if (dungeon.length === 0 || !playerPos) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="text-2xl mb-4">🏗️</div>
                    <div className="text-lg text-gray-300">{t('menu.loading')}</div>
                </div>
                <PersistentDebugger />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-1">
            <div className="w-full h-screen flex flex-col">
                <div className="bg-gray-800 rounded-lg p-2 mb-2 border border-amber-600 grid grid-cols-3 divide-x divide-gray-700 text-center items-center">
                    <div><span className="text-gray-400">{t('stats.floor')}:</span> {gameState.currentFloor}</div>
                    <div className="px-2">
                        <div className="text-xs text-cyan-200">{t('stats.level')}: {gameState.level}</div>
                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden mt-1">
                            <div className="h-2 bg-cyan-400" style={{width: `${xpPercent}%`}}></div>
                        </div>
                    </div>
                    <div><span className="text-gray-400">{t('stats.gold')}:</span> {gameState.gold}</div>
                </div>
                
                <div className="bg-gray-800 rounded-lg p-2 border border-gray-700 flex-1 flex flex-col">
                    <div className="grid grid-cols-5 gap-2 flex-1 w-full mx-auto">
                        {dungeon.map((row, y) =>
                            row.map((room, x) => {
                                const isPlayerHere = playerPos && playerPos.x === x && playerPos.y === y;
                                return (
                                    <div
                                        key={`${x},${y}`}
                                        className={`aspect-square flex items-center justify-center text-3xl rounded-lg transition-colors ${ room.revealed && room.type !== RoomTypes.WALL ? 'cursor-pointer' : 'cursor-default' } ${getRoomBackgroundColor(room, isPlayerHere)}`}
                                        onClick={() => { if ( room.revealed && room.type !== RoomTypes.WALL && playerPos && Math.abs(x - playerPos.x) + Math.abs(y - playerPos.y) === 1 ) { movePlayer(x - playerPos.x, y - playerPos.y); } }}
                                    >
                                        {isPlayerHere ? "🧍" : room.revealed ? getRoomIcon(room) : ""}
                                    </div>
                                );
                            })
                        )}
                    </div>

                    <div className="text-center text-xs text-gray-400 mt-2 px-1">
                        {t('exploration.controls')}
                    </div>
                </div>
            </div>
            <PersistentDebugger />
            {rewardPopup && <RewardPopup reward={rewardPopup} onClose={() => setRewardPopup(null)} />}
        </div>
    );
}

function MainMenu({ onStart, onSoulForge, totalSouls, currentLanguage }) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black text-white px-4">
            <h1 className="text-5xl font-extrabold text-amber-400 mb-3 drop-shadow-lg">{t('game.title')}</h1>
            <p className="text-lg text-gray-300 mb-6">{t('game.subtitle')}</p>
            
            {/* Language Toggle Button */}
            <div className="mb-4">
                <button 
                    onClick={() => {
                        const newLang = currentLanguage === 'en' ? 'ar' : 'en';
                        Localization.setLanguage(newLang);
                    }}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-sm rounded-lg border border-gray-500 transition-all duration-200"
                >
                    🌍 {currentLanguage === 'en' ? 'العربية' : 'English'}
                </button>
            </div>
            
            {/* Soul Forge Button */}
            <div className="mb-6">
                <button 
                    onClick={onSoulForge}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-lg rounded-lg border border-purple-400 shadow-md transition-all duration-200 flex items-center gap-2"
                >
                    ⚡ {t('menu.soulForge')} <span className="text-sm">({totalSouls} 👻)</span>
                </button>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 max-w-lg">
                {Object.values(Characters).map((char) => (
                    <button key={char.id} onClick={() => onStart(char.id)} className="px-6 py-4 bg-gray-800 hover:bg-gray-700 text-lg rounded-lg border border-amber-600 shadow-md transition-all duration-200">
                        {t(char.nameKey)}{" "}
                        <span className="text-sm text-gray-400">({t(char.roleKey)})</span>
                    </button>
                ))}
            </div>
        </div>
    );
}