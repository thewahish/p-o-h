// filename: src/App.jsx

import React, { useEffect, useState, useCallback } from "react";
import Logger from './core/logger.js';
import PersistentDebugger from "./components/persistent-debugger.jsx";

// === Import core game systems ===
import { Characters } from "./constants/characters";
import { RoomIcons, RoomTypes, generateDungeon, revealAdjacentRooms, spawnStairs } from "./systems/dungeon";
import { GameState } from "./core/state.js";
import { CombatSystem } from "./systems/combat.js";
import { InventorySystem } from "./systems/inventory.js";
import { Localization, t } from "./core/localization.js";
import LanguageSelection from "./components/language-selection.jsx";
import { GameConfig } from "./constants/config.js";
import autoSaveService, { SaveTriggers } from "./services/autosave.js";

// === Import UI screens ===
import BattleScreen from "./components/battle-screen.jsx";
import ShopScreen from "./components/shop-screen.jsx";
import OutcomeScreen from "./components/outcome-screen.jsx";
import SoulForge from "./components/soul-forge.jsx";
import RewardPopup from "./components/reward-popup.jsx";
import SaveSlotScreen from "./components/save-slot-screen.jsx";
import EventInterimScreen from "./components/event-interim-screen.jsx";
import BuffSelectionScreen from "./components/buff-selection-screen.jsx";
import { InventoryScreen } from "./components/inventory-screen.jsx";

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
    const [showLanguageSelection, setShowLanguageSelection] = useState(false);
    const [localizationReady, setLocalizationReady] = useState(false);
    const [currentLanguage, setCurrentLanguage] = useState('en');
    const [rewardPopup, setRewardPopup] = useState(null);
    const [selectedCharacter, setSelectedCharacter] = useState(null);
    const [showSaveSlots, setShowSaveSlots] = useState(false);
    const [interimScreen, setInterimScreen] = useState(null); // { type: 'intro'|'outro', eventType, eventData, onContinue }
    const [showSaveIndicator, setShowSaveIndicator] = useState(false);
    const [showBuffSelection, setShowBuffSelection] = useState(false);
    const [pendingBattle, setPendingBattle] = useState(null);
    const [showInventory, setShowInventory] = useState(false);
    
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

    // Subscribe to auto-save events for UI feedback
    useEffect(() => {
        const unsubSaveComplete = autoSaveService.subscribe('saveComplete', () => {
            setShowSaveIndicator(true);
            setTimeout(() => setShowSaveIndicator(false), 2000);
        });

        const unsubSaveError = autoSaveService.subscribe('saveError', (error) => {
            Logger.log(`Auto-save failed: ${error.message}`, 'ERROR');
        });

        return () => {
            unsubSaveComplete();
            unsubSaveError();
        };
    }, []);

    const getRoomIcon = (room) => {
        if (room.completed) return getCompletedRoomIcon(room);
        if (!room.visited && room.type !== RoomTypes.WALL && room.type !== RoomTypes.EMPTY) {
            return ""; // Plain/empty for unvisited path rooms
        }
        return RoomIcons[room.type];
    };

    const getCompletedRoomIcon = (room) => {
        switch (room.type) {
            case RoomTypes.BATTLE: case RoomTypes.ELITE: case RoomTypes.BOSS: return "✅";
            case RoomTypes.TREASURE: return "📦";
            case RoomTypes.SHOP: return "🏪";
            case RoomTypes.SHRINE: return "✨";
            case RoomTypes.STAIRS: return "🔄"; // Keep stairs icon even when completed
            default: return "";
        }
    };

    const getRoomBackgroundColor = (room, isPlayerHere) => {
        if (isPlayerHere) return "bg-rpg-primary animate-pulse";
        if (!room.revealed) return "bg-rpg-bg-darker";
        if (room.type === RoomTypes.WALL) return "bg-rpg-secondary text-rpg-text opacity-60"; // Distinctive wall background
        if (room.completed) {
            switch (room.type) {
                case RoomTypes.BATTLE: case RoomTypes.ELITE: case RoomTypes.BOSS: return "bg-uncommon bg-opacity-30 text-uncommon";
                case RoomTypes.TREASURE: return "bg-legendary bg-opacity-30 text-legendary";
                case RoomTypes.SHRINE: return "bg-epic bg-opacity-30 text-epic";
                case RoomTypes.STAIRS: return "bg-rare bg-opacity-30 text-rare";
                default: return "bg-rpg-bg-darker";
            }
        }
        // Special highlighting for stairs (even when not completed)
        if (room.type === RoomTypes.STAIRS) return "bg-rare bg-opacity-50 hover:bg-rare hover:bg-opacity-70 animate-pulse";
        return "bg-rpg-bg-darker hover:bg-rpg-secondary hover:bg-opacity-50";
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
            // DEBUG HOTKEYS - Only enabled in development mode
            if (GameConfig.DEBUG_MODE && ['0', '1', '2', '3', '4', '5'].includes(e.key)) {
                e.preventDefault();
                Logger.log(`Developer hotkey pressed: ${e.key}`, 'INPUT');
                switch (e.key) {
                    case '0':
                        const newGodModeState = !GameState.current.godMode;
                        GameState.update('godMode', newGodModeState);
                        Logger.log(`God Mode Toggled: ${newGodModeState ? 'ON' : 'OFF'}`, 'SYSTEM');
                        break;
                    case '1':
                        // Heal HP only
                        if (GameState.current.player) {
                            GameState.current.player.stats.hp = GameState.current.player.maxStats.hp;
                            Logger.log('HP fully restored', 'SYSTEM');
                            forceUI();
                        }
                        break;
                    case '2':
                        // Restore resource only
                        if (GameState.current.player) {
                            GameState.current.player.resource.current = GameState.current.player.resource.max;
                            Logger.log('Resource fully restored', 'SYSTEM');
                            forceUI();
                        }
                        break;
                    case '3':
                        // Add gold
                        GameState.addGold(100);
                        Logger.log('Added 100 gold', 'SYSTEM');
                        break;
                    case '4':
                        // Level up
                        if (GameState.current.player) {
                            GameState.levelUp();
                            Logger.log('Leveled up', 'SYSTEM');
                        }
                        break;
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

        // Show intro screen before processing the event
        if (room.encounter && !room.completed) {
            // Battle encounter
            const eventType = room.type === RoomTypes.BOSS ? 'boss' :
                             room.type === RoomTypes.ELITE ? 'elite' : 'battle';
            setInterimScreen({
                type: 'intro',
                eventType: eventType,
                eventData: room.encounter,
                onContinue: () => {
                    setInterimScreen(null);
                    startBattle(room.encounter, eventType); // Pass event type to determine buff eligibility
                }
            });
            return;
        }

        // Non-battle room events
        const showEventIntro = (eventType, eventData = null) => {
            setInterimScreen({
                type: 'intro',
                eventType: eventType,
                eventData: eventData,
                onContinue: () => {
                    setInterimScreen(null);
                    processRoomEvent(room, eventType);
                }
            });
        };

        switch (room.type) {
            case RoomTypes.SHOP:
                if (!room.completed) {
                    showEventIntro('shop');
                }
                break;
            case RoomTypes.TREASURE:
                if (!room.completed) {
                    // Go directly to reward without intro screen
                    processRoomEvent(room, 'treasure');
                }
                break;
            case RoomTypes.SHRINE:
                if (!room.completed) {
                    // Go directly to blessing without intro screen
                    processRoomEvent(room, 'shrine');
                }
                break;
            case RoomTypes.STAIRS:
                if (!room.completed) {
                    showEventIntro('stairs');
                }
                break;
            default:
                // Direct processing for other room types
                processRoomEvent(room, room.type);
        }
    };

    const processRoomEvent = (room, eventType) => {
        switch (eventType) {
            case 'shop':
                GameState.update('currentScreen', 'shop');
                room.completed = true;
                break;
            case 'treasure':
                // Scale treasure rewards based on current floor
                const baseGold = 3 + Math.floor(Math.random() * 7);
                const floorMultiplier = 1 + (GameState.current.currentFloor - 1) * 0.2;
                const goldFound = Math.floor(baseGold * floorMultiplier);
                GameState.addGold(goldFound);
                setRewardPopup({
                    type: 'gold',
                    icon: '💎',
                    title: t('events.treasure'),
                    message: t('rewards.treasureChestFound', {amount: goldFound})
                });
                room.completed = true;
                // No outro screen - popup closes and returns to game directly
                break;
            case 'shrine':
                if (GameState.current.player) {
                    // Scale blessing bonuses based on current floor
                    const floorBonus = Math.floor((GameState.current.currentFloor - 1) * 0.5);
                    const blessings = [
                        { nameKey: "blessings.strength", effect: "atk", bonus: 3 + floorBonus }, 
                        { nameKey: "blessings.fortitude", effect: "def", bonus: 2 + floorBonus }, 
                        { nameKey: "blessings.swiftness", effect: "spd", bonus: 2 + floorBonus }, 
                        { nameKey: "blessings.fortune", effect: "crit", bonus: 5 + floorBonus * 2 }
                    ];
                    const blessing = blessings[Math.floor(Math.random() * blessings.length)];
                    GameState.current.player.stats[blessing.effect] += blessing.bonus;
                    GameState.current.player.maxStats[blessing.effect] += blessing.bonus;
                    setRewardPopup({
                        type: 'blessing',
                        icon: '⛩️',
                        title: t('events.shrine'),
                        message: t('rewards.shrineBlessing', {
                            blessing: t(blessing.nameKey),
                            stat: t(`stats.${blessing.effect}`),
                            bonus: blessing.bonus
                        })
                    });
                    room.completed = true;
                    // No outro screen - popup closes and returns to game directly
                }
                break;
            case 'stairs':
                // Award floor completion rewards
                const floorReward = GameState.nextFloor();
                setRewardPopup({
                    type: 'floor_complete',
                    message: t('rewards.floorComplete', {
                        floor: GameState.current.currentFloor - 1,
                        gold: floorReward.gold,
                        souls: floorReward.souls
                    })
                });

                // AUTO-SAVE: Floor completion
                autoSaveService.performAutoSave(SaveTriggers.FLOOR_COMPLETE);

                // Reset for new floor and generate new dungeon
                setTimeout(() => {
                    GameState.resetForNewFloor();
                    generateDungeon();
                }, 2000);

                room.completed = true;
                break;
        }
        forceUI();
    };

    const showEventOutro = (eventType) => {
        setInterimScreen({
            type: 'outro',
            eventType: eventType,
            onContinue: () => {
                setInterimScreen(null);
                if (eventType === 'shop') {
                    GameState.update('currentScreen', 'exploration');
                }
            }
        });
    };

    const startBattle = (enemies, encounterType = 'battle') => {
        // Only show buff selection for boss and elite encounters
        const shouldShowBuffs = encounterType === 'boss' || encounterType === 'elite';

        if (shouldShowBuffs) {
            setPendingBattle(enemies);
            setShowBuffSelection(true);
        } else {
            // Skip buff selection for regular battles
            const liveEnemies = enemies.map(e => ({ ...e }));
            setCombatLog([]);
            GameState.current.onBattleEnd = endBattle;
            GameState.update('currentScreen', 'battle');
            combatSystem.startBattle(liveEnemies, { onLog: (msg) => setCombatLog((prev) => [...prev, msg]) });
        }
    };

    const handleBuffSelected = (buffKey) => {
        setShowBuffSelection(false);

        if (pendingBattle) {
            const liveEnemies = pendingBattle.map(e => ({ ...e }));
            setCombatLog([]);
            GameState.current.onBattleEnd = endBattle;
            GameState.update('currentScreen', 'battle');
            combatSystem.startBattle(liveEnemies, { onLog: (msg) => setCombatLog((prev) => [...prev, msg]) });
            setPendingBattle(null);
        }
    };

    const endBattle = (victory, rewards) => {
        Logger.log(`Battle ended. Victory: ${victory}`, 'SYSTEM');
        if (victory) {
            const { x, y } = GameState.current.playerPos;
            const currentRoom = GameState.current.dungeon[y][x];
            currentRoom.completed = true;
            
            const totalGold = rewards.reduce((sum, r) => sum + (r.gold || 0), 0);
            const totalXp = rewards.reduce((sum, r) => sum + (r.xp || 0), 0);
            GameState.addGold(totalGold);
            GameState.addExperience(totalXp);
            
            // Check if this was a boss fight and spawn stairs
            if (currentRoom.type === RoomTypes.BOSS) {
                spawnStairs();
                Logger.log('Boss defeated! Stairs to next floor have appeared!', 'SYSTEM');

                // AUTO-SAVE: Boss defeat
                autoSaveService.performAutoSave(SaveTriggers.BOSS_DEFEAT);
            }

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
            // Show battle outro screen before returning to exploration
            const { x, y } = GameState.current.playerPos;
            const currentRoom = GameState.current.dungeon[y][x];
            const eventType = currentRoom.type === RoomTypes.BOSS ? 'boss' : 
                             currentRoom.type === RoomTypes.ELITE ? 'elite' : 'battle';
            
            setInterimScreen({
                type: 'outro',
                eventType: eventType,
                onContinue: () => {
                    setInterimScreen(null);
                    GameState.update('currentScreen', 'exploration');
                }
            });
        } else {
            // Collect souls before reset
            GameState.collectRunSouls();

            // AUTO-SAVE: Player death (save soul progress before reset)
            autoSaveService.performAutoSave(SaveTriggers.PLAYER_DEATH);

            GameState.reset();
        }
    };

    Logger.log(`Rendering screen: ${gameState.currentScreen}`, 'UI');

    // Show loading screen if localization not ready
    if (!localizationReady) {
        return (
            <div className="min-h-screen bg-rpg-radial text-rpg-text flex items-center justify-center">
                <div className="text-center">
                    <div className="text-2xl mb-4">🌍</div>
                    <div className="text-lg text-rpg-text opacity-80">Loading...</div>
                </div>
            </div>
        );
    }

    // Show language selection if needed
    if (showLanguageSelection) {
        return <LanguageSelection onLanguageSelected={() => setShowLanguageSelection(false)} />;
    }

    // === SCREEN RENDERING LOGIC ===
    if (showBuffSelection) {
        return <><BuffSelectionScreen onBuffSelected={handleBuffSelected} /><PersistentDebugger /></>;
    }
    if (interimScreen) {
        return <><EventInterimScreen {...interimScreen} /><PersistentDebugger /></>;
    }
    if (gameState.currentScreen === 'outcome') {
        return <><OutcomeScreen victory={gameState.player && gameState.player.stats && gameState.player.stats.hp > 0} results={battleResults} onContinue={handleOutcomeContinue} /><PersistentDebugger /></>;
    }
    if (gameState.currentScreen === "battle") {
        return <><BattleScreen player={gameState.player} enemies={gameState.enemies} combatSystem={combatSystem} combatLog={combatLog} /><PersistentDebugger /></>;
    }
    if (gameState.currentScreen === "shop") {
        return <><ShopScreen inventorySystem={inventorySystem} onLeave={() => showEventOutro('shop')} /><PersistentDebugger /></>;
    }
    // Handle save-slots screen state (when returning from death)
    if (gameState.currentScreen === 'save-slots') {
        return (
            <>
                <SaveSlotScreen 
                    characterId={gameState.selectedCharacter} 
                    onBack={() => {
                        GameState.update('selectedCharacter', null);
                        GameState.update('currentScreen', 'main-menu');
                    }}
                    onGameStart={() => {
                        // Game start is handled by SaveSlotScreen, just ensure proper screen transition
                        forceUI();
                    }}
                />
                <PersistentDebugger />
            </>
        );
    }
    
    // Show save slot screen if character is selected but not in save slots view
    if (selectedCharacter && showSaveSlots) {
        return (
            <>
                <SaveSlotScreen 
                    characterId={selectedCharacter} 
                    onBack={() => {
                        setSelectedCharacter(null);
                        setShowSaveSlots(false);
                    }}
                    onGameStart={() => {
                        setSelectedCharacter(null);
                        setShowSaveSlots(false);
                        // Force UI update to ensure exploration screen shows
                        forceUI();
                    }}
                />
                <PersistentDebugger />
            </>
        );
    }
    
    if (!gameState.gameStarted || gameState.currentScreen === 'main-menu') {
        return (
            <>
                <MainMenu 
                    onCharacterSelect={(characterId) => {
                        setSelectedCharacter(characterId);
                        setShowSaveSlots(true);
                    }}
                    currentLanguage={currentLanguage}
                />
                <PersistentDebugger />
            </>
        );
    }

    const dungeon = gameState.dungeon || [];
    const playerPos = gameState.playerPos;
    const player = gameState.player;
    
    // Fix XP calculation - get XP needed for current level vs next level
    const currentLevelXP = GameState.getRequiredExperience(gameState.level);
    const nextLevelXP = GameState.getRequiredExperience(gameState.level + 1);
    const xpRequiredForLevel = nextLevelXP - currentLevelXP;
    const xpProgressInLevel = Math.max(0, gameState.experience - currentLevelXP);
    const xpPercent = xpRequiredForLevel > 0 ? (xpProgressInLevel / xpRequiredForLevel) * 100 : 0;
    
    // Get souls for current character and slot
    const characterId = gameState.selectedCharacter;
    const currentSlot = GameState.getCurrentSaveSlot();
    const currentSouls = characterId ? GameState.getCharacterSouls(characterId, currentSlot) : 0;

    // Don't render exploration if dungeon or playerPos not ready
    if (dungeon.length === 0 || !playerPos) {
        return (
            <div className="min-h-screen bg-rpg-radial text-rpg-text flex items-center justify-center">
                <div className="text-center">
                    <div className="text-2xl mb-4">🏗️</div>
                    <div className="text-lg text-rpg-text opacity-80">{t('menu.loading')}</div>
                </div>
                <PersistentDebugger />
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl h-full bg-rpg-radial text-rpg-text p-1 flex flex-col overflow-hidden">
            {/* Auto-save indicator */}
            {showSaveIndicator && (
                <div className="fixed top-4 right-4 z-50 bg-uncommon text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
                    <span>💾</span>
                    <span className="font-bold">{t('system.gameSaved')}</span>
                </div>
            )}

            {/* Compact Top Stats Panel */}
            <div className="bg-rpg-bg-darker bg-opacity-80 rounded-lg px-2 py-1.5 mb-1 border border-rpg-primary shrink-0 backdrop-blur-sm">
                {/* First Row - Core Stats */}
                <div className="grid grid-cols-4 gap-2 text-center text-xs mb-1.5">
                    <div>
                        <div className="text-rpg-text opacity-70 text-xs leading-none">{t('stats.floor')}</div>
                        <div className="text-rpg-primary font-bold text-sm leading-none">{gameState.currentFloor}</div>
                    </div>
                    <div>
                        <div className="text-rpg-text opacity-70 text-xs leading-none">{t('stats.level')}</div>
                        <div className="text-mana-light font-bold text-sm leading-none">{gameState.level}</div>
                    </div>
                    <div>
                        <div className="text-rpg-text opacity-70 text-xs leading-none">{t('stats.gold')}</div>
                        <div className="text-legendary font-bold text-sm leading-none">{gameState.gold}</div>
                    </div>
                    <div>
                        <div className="text-rpg-text opacity-70 text-xs leading-none">{t('stats.souls')}</div>
                        <div className="text-epic font-bold text-sm leading-none">{currentSouls + gameState.currentRunSouls}</div>
                    </div>
                </div>
                
                {/* Second Row - XP Progress and Player Stats */}
                <div className="flex items-center gap-2">
                    {/* XP Bar */}
                    <div className="flex-1">
                        <div className="flex justify-between text-xs text-rpg-text opacity-70 leading-none mb-0.5">
                            <span>XP: {gameState.experience}/{nextLevelXP}</span>
                            <span>{Math.floor(xpPercent)}%</span>
                        </div>
                        <div className="h-1.5 bg-rpg-bg-darkest bg-opacity-80 rounded-full overflow-hidden">
                            <div className="h-1.5 bg-mana-light transition-all duration-300" style={{width: `${Math.min(100, Math.max(0, xpPercent))}%`}}></div>
                        </div>
                    </div>
                    
                    {/* Player HP */}
                    {player && (
                        <div className="text-xs text-center">
                            <div className="text-rpg-text opacity-70 text-xs leading-none">HP</div>
                            <div className="text-health-mid font-bold text-sm leading-none">
                                {player.stats.hp}/{player.maxStats.hp}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Inventory Button */}
            <div className="shrink-0 mb-1">
                <button
                    onClick={() => setShowInventory(true)}
                    className="w-full px-4 py-2 bg-gradient-to-r from-rpg-secondary to-rpg-primary text-black font-bold rounded-lg hover:from-rpg-primary hover:to-rpg-secondary transition-all flex items-center justify-center gap-2 border border-rpg-primary"
                >
                    <span className="text-xl">🎒</span>
                    <span>Inventory</span>
                </button>
            </div>

                {/* Dungeon Grid - Takes remaining space */}
                <div className="bg-rpg-bg-darker bg-opacity-60 rounded-lg p-1.5 border border-rpg-secondary flex-1 flex flex-col min-h-0 backdrop-blur-sm">
                    <div className="grid grid-cols-5 gap-1 w-full max-w-md mx-auto" style={{ aspectRatio: '5/9', maxHeight: '100%' }}>
                        {dungeon.map((row, y) =>
                            row.map((room, x) => {
                                const isPlayerHere = playerPos && playerPos.x === x && playerPos.y === y;
                                return (
                                    <div
                                        key={`${x},${y}`}
                                        className={`aspect-square flex items-center justify-center text-xl rounded transition-colors ${ room.revealed && room.type !== RoomTypes.WALL ? 'cursor-pointer' : 'cursor-default' } ${getRoomBackgroundColor(room, isPlayerHere)}`}
                                        onClick={() => { if ( room.revealed && room.type !== RoomTypes.WALL && playerPos && Math.abs(x - playerPos.x) + Math.abs(y - playerPos.y) === 1 ) { movePlayer(x - playerPos.x, y - playerPos.y); } }}
                                    >
                                        {isPlayerHere ? "🧍" : room.revealed ? getRoomIcon(room) : ""}
                                    </div>
                                );
                            })
                        )}
                    </div>

                    <div className="text-center text-xs text-rpg-text opacity-60 mt-1 px-1 leading-tight">
                        {t('exploration.controls')}
                    </div>
                </div>

                <PersistentDebugger />
                {rewardPopup && <RewardPopup reward={rewardPopup} onClose={() => setRewardPopup(null)} />}
                {showInventory && <InventoryScreen onClose={() => setShowInventory(false)} />}
        </div>
    );
}

function MainMenu({ onCharacterSelect, currentLanguage }) {
    return (
        <div className="h-full flex flex-col items-center justify-center bg-rpg-radial text-rpg-text px-4">
            <h1 className="text-5xl font-extrabold text-rpg-primary mb-3 drop-shadow-lg">{t('game.title')}</h1>
            <p className="text-lg text-rpg-text opacity-80 mb-6">{t('game.subtitle')}</p>
            
            {/* Language Toggle Button */}
            <div className="mb-4">
                <button 
                    onClick={() => {
                        const newLang = currentLanguage === 'en' ? 'ar' : 'en';
                        Localization.setLanguage(newLang);
                    }}
                    className="px-4 py-2 bg-rpg-secondary hover:bg-rpg-primary text-sm rounded-lg border border-rpg-primary transition-all duration-200"
                >
                    🌍 {currentLanguage === 'en' ? 'العربية' : 'English'}
                </button>
            </div>
            
            
            <div className="flex flex-wrap justify-center gap-4 max-w-lg">
                {Object.values(Characters).map((char) => (
                    <button key={char.id} onClick={() => onCharacterSelect(char.id)} className="px-6 py-4 bg-rpg-bg-darker bg-opacity-80 hover:bg-rpg-secondary text-lg rounded-lg border border-rpg-primary shadow-md transition-all duration-200 backdrop-blur-sm">
                        {t(char.nameKey)}{" "}
                        <span className="text-sm text-rpg-text opacity-70">({t(char.roleKey)})</span>
                    </button>
                ))}
            </div>
        </div>
    );
}