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
import { Localization } from "./constants/localization";

// === Import UI screens ===
import BattleScreen from "./components/battle-screen.jsx";
import ShopScreen from "./components/shop-screen.jsx";

Logger.log('App.jsx: Module loaded.', 'SYSTEM');

// Initialize core systems
const loc = new Localization("en");
let appForceUpdate = () => Logger.log('forceUI called before App component mounted!', 'ERROR');

const combatSystem = new CombatSystem({ 
    getSystem: (name) => getSystemMock(name),
    forceUpdate: () => appForceUpdate(),
});
const inventorySystem = new InventorySystem({ getSystem: (name) => getSystemMock(name) });

function getSystemMock(name) {
  switch (name) {
    case "gameState": return GameState;
    case "combatSystem": return combatSystem;
    case "inventorySystem": return inventorySystem;
    case "localization": return loc;
    default: return null;
  }
}

export default function App() {
  Logger.log('App component rendering started.', 'UI');
  const [gameState, setGameState] = useState(GameState.current);
  const [combatLog, setCombatLog] = useState([]);
  
  const forceUI = useCallback(() => {
    setGameState({ ...GameState.current });
  }, []);

  useEffect(() => {
    appForceUpdate = forceUI;
  }, [forceUI]);
  
  useEffect(() => {
    Logger.log('App component mounted. Subscribing to GameState.', 'UI');
    const unsubscribe = GameState.subscribe(newState => {
      setGameState(newState);
    });
    return () => {
        Logger.log('App component unmounting. Unsubscribing from GameState.', 'UI');
        unsubscribe();
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
      if (targetRoom.revealed) {
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
      if (GameState.current.currentScreen !== "exploration") return;
      let dx = 0, dy = 0;
      switch (e.key.toLowerCase()) {
        case 'arrowup': case 'w': dy = -1; break;
        case 'arrowdown': case 's': dy = 1; break;
        case 'arrowleft': case 'a': dx = -1; break;
        case 'arrowright': case 'd': dx = 1; break;
        default: return;
      }
      e.preventDefault();
      Logger.log(`Key press detected: ${e.key}`, 'INPUT');
      movePlayer(dx, dy);
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => { window.removeEventListener('keydown', handleKeyPress); };
  }, [movePlayer]);

  const startGame = (characterId) => {
    Logger.log(`Starting new game with ${characterId}`, 'SYSTEM');
    GameState.newGame(characterId);
    generateDungeon();
    GameState.update('currentScreen', 'exploration');
  };

  const handleRoomEvent = (room) => {
    Logger.log(`Handling event for room type: ${room.type}`, 'SYSTEM');
    switch (room.type) {
      case RoomTypes.BATTLE:
        startBattle([{ name: "Goblin", stats: { hp: 30, atk: 8, def: 4, spd: 5, crit: 5 }, maxStats: { hp: 30 } }]);
        break;
      case RoomTypes.ELITE:
        startBattle([{ name: "Orc Elite", stats: { hp: 50, atk: 12, def: 6, spd: 6, crit: 10 }, maxStats: { hp: 50 } }]);
        break;
      case RoomTypes.BOSS:
        startBattle([{ name: "Orc Warlord", stats: { hp: 120, atk: 18, def: 10, spd: 6, crit: 15 }, maxStats: { hp: 120 } }]);
        break;
      case RoomTypes.SHOP:
        room.completed = true;
        GameState.update('currentScreen', 'shop');
        break;
      case RoomTypes.TREASURE:
        const goldFound = 20 + Math.floor(Math.random() * 30);
        GameState.addGold(goldFound);
        alert(`You found ${goldFound} gold!`);
        room.completed = true;
        break;
      case RoomTypes.SHRINE:
        const blessings = [{ name: "Blessing of Strength", effect: "atk", bonus: 3 }, { name: "Blessing of Fortitude", effect: "def", bonus: 2 }, { name: "Blessing of Swiftness", effect: "spd", bonus: 2 }, { name: "Blessing of Fortune", effect: "crit", bonus: 5 }];
        const blessing = blessings[Math.floor(Math.random() * blessings.length)];
        GameState.current.player.stats[blessing.effect] += blessing.bonus;
        GameState.current.player.maxStats[blessing.effect] += blessing.bonus;
        alert(`✨ You receive the ${blessing.name}! +${blessing.bonus} ${blessing.effect.toUpperCase()}`);
        room.completed = true;
        break;
    }
    forceUI();
  };

  const startBattle = (enemies) => {
    setCombatLog([]);
    GameState.current.onBattleEnd = endBattle;
    combatSystem.startBattle(enemies, { onLog: (msg) => setCombatLog((prev) => [...prev, msg]) });
    GameState.update('currentScreen', 'battle');
  };

  const endBattle = (victory) => {
    Logger.log(`Battle ended. Victory: ${victory}`, 'SYSTEM');
    if (victory) {
        const { x, y } = GameState.current.playerPos;
        const dungeon = GameState.current.dungeon;
        if (dungeon && dungeon[y] && dungeon[y][x]) {
            dungeon[y][x].completed = true;
        }
    }
    GameState.update('currentScreen', 'exploration');
  };

  Logger.log(`Rendering screen: ${gameState.currentScreen}`, 'UI');

  // === SCREEN RENDERING LOGIC ===
  if (gameState.currentScreen === "battle") {
    return (
      <>
        <BattleScreen player={gameState.player} enemies={gameState.enemies} combatSystem={combatSystem} combatLog={combatLog} onBattleEnd={endBattle} />
        <PersistentDebugger />
      </>
    );
  }

  if (gameState.currentScreen === "shop") {
    return (
      <>
        <ShopScreen inventorySystem={inventorySystem} onLeave={() => GameState.update('currentScreen', 'exploration')} />
        <PersistentDebugger />
      </>
    );
  }

  if (!gameState.gameStarted) {
    return (
      <>
        <MainMenu onStart={startGame} />
        <PersistentDebugger />
      </>
    );
  }

  const dungeon = gameState.dungeon || [];
  const playerPos = gameState.playerPos;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4">
      <div className="max-w-md mx-auto">
        <div className="bg-gray-800 rounded-lg p-4 mb-4 border border-amber-600 flex justify-between">
          <div>{loc.get("floorLabel")} {gameState.currentFloor}</div>
          <div>{loc.get("goldLabel")} {gameState.gold}</div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="grid grid-cols-7 gap-1 mb-4">
            {dungeon.map((row, y) =>
              row.map((room, x) => {
                const isPlayerHere = playerPos && playerPos.x === x && playerPos.y === y;
                return (
                <div
                  key={`${x},${y}`}
                  className={`aspect-square flex items-center justify-center text-2xl rounded transition-colors ${ room.revealed ? 'cursor-pointer' : 'cursor-default' } ${getRoomBackgroundColor(room, isPlayerHere)}`}
                  onClick={() => { if ( room.revealed && Math.abs(x - playerPos.x) + Math.abs(y - playerPos.y) === 1 ) { movePlayer(x - playerPos.x, y - playerPos.y); } }}
                >
                  {isPlayerHere ? "🧍" : room.revealed ? getRoomIcon(room) : ""}
                </div>
                );
              })
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 max-w-32 mx-auto">
            <div></div>
            <button onClick={() => movePlayer(0, -1)} className="bg-gray-700 hover:bg-gray-600 p-2 rounded text-xl transition-colors">⬆</button>
            <div></div>
            <button onClick={() => movePlayer(-1, 0)} className="bg-gray-700 hover:bg-gray-600 p-2 rounded text-xl transition-colors">⬅</button>
            <div></div>
            <button onClick={() => movePlayer(1, 0)} className="bg-gray-700 hover:bg-gray-600 p-2 rounded text-xl transition-colors">➡</button>
            <div></div>
            <button onClick={() => movePlayer(0, 1)} className="bg-gray-700 hover:bg-gray-600 p-2 rounded text-xl transition-colors">⬇</button>
            <div></div>
          </div>

          <div className="text-center mt-4 text-sm text-gray-400">Use arrow keys or WASD to move</div>
        </div>
      </div>
      <PersistentDebugger />
    </div>
  );
}

function MainMenu({ onStart }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black text-white px-4">
      <h1 className="text-5xl font-extrabold text-amber-400 mb-3 drop-shadow-lg">Path of Heroes</h1>
      <p className="text-lg text-gray-300 mb-10">Choose Your Hero</p>
      <div className="flex flex-wrap justify-center gap-4 max-w-lg">
        {Object.values(Characters).map((char) => (
          <button key={char.id} onClick={() => onStart(char.id)} className="px-6 py-4 bg-gray-800 hover:bg-gray-700 text-lg rounded-lg border border-amber-600 shadow-md transition-all duration-200">
            {char.name}{" "}
            <span className="text-sm text-gray-400">({char.role})</span>
          </button>
        ))}
      </div>
    </div>
  );
}