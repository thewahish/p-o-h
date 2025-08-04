import React, { useState, useEffect, useCallback } from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Swords, Coins, MapPin } from 'lucide-react';

// Game Constants
const GRID_SIZE = 7;

const ROOM_TYPES = {
  EMPTY: 'empty',
  BATTLE: 'battle',
  ELITE: 'elite',
  SHOP: 'shop',
  CAMPFIRE: 'campfire',
  SHRINE: 'shrine',
  TREASURE: 'treasure',
  BOSS: 'boss'
};

const ROOM_ICONS = {
  [ROOM_TYPES.EMPTY]: '·',
  [ROOM_TYPES.BATTLE]: '⚔️',
  [ROOM_TYPES.ELITE]: '💀',
  [ROOM_TYPES.SHOP]: '🏪',
  [ROOM_TYPES.CAMPFIRE]: '🔥',
  [ROOM_TYPES.SHRINE]: '⛩️',
  [ROOM_TYPES.TREASURE]: '💎',
  [ROOM_TYPES.BOSS]: '👹'
};

const CHARACTERS = {
  WARRIOR: { id: 'warrior', name: 'Taha', icon: '🦸', baseStats: { hp: 120 } },
  SORCERESS: { id: 'sorceress', name: 'Mais', icon: '🧙‍♀️', baseStats: { hp: 80 } },
  ROGUE: { id: 'rogue', name: 'Ibrahim', icon: '🥷', baseStats: { hp: 100 } }
};

export default function PathOfHeroes() {
  const [gameState, setGameState] = useState('menu');
  const [currentFloor, setCurrentFloor] = useState(1);
  const [playerPos, setPlayerPos] = useState({ x: 3, y: 6 });
  const [dungeon, setDungeon] = useState([]);
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    if (gameState === 'exploration') generateDungeon();
  }, [gameState, currentFloor]);

  const generateDungeon = () => {
    const newDungeon = Array(GRID_SIZE).fill(null).map(() =>
      Array(GRID_SIZE).fill(null).map(() => ({ type: ROOM_TYPES.EMPTY, revealed: false, visited: false }))
    );
    newDungeon[6][3] = { type: ROOM_TYPES.EMPTY, revealed: true, visited: true };
    newDungeon[0][3] = { type: ROOM_TYPES.BOSS, revealed: false, visited: false };

    const path = generatePath({ x: 3, y: 6 }, { x: 3, y: 0 });
    path.forEach(pos => {
      if (pos.y !== 6 && pos.y !== 0) {
        const roomType = Math.random() < 0.6 ? ROOM_TYPES.BATTLE : ROOM_TYPES.ELITE;
        newDungeon[pos.y][pos.x].type = roomType;
      }
    });

    revealAdjacentRooms(newDungeon, 3, 6);
    setDungeon(newDungeon);
  };

  const generatePath = (start, end) => {
    const path = [];
    let current = { ...start };
    while (current.y > end.y) {
      if (Math.random() < 0.3 && current.x > 1) current.x--;
      else if (Math.random() < 0.3 && current.x < GRID_SIZE - 2) current.x++;
      current.y--;
      path.push({ ...current });
    }
    while (current.x !== end.x) {
      current.x += current.x < end.x ? 1 : -1;
      path.push({ ...current });
    }
    return path;
  };

  const revealAdjacentRooms = (grid, x, y) => {
    [{ x: x - 1, y }, { x: x + 1, y }, { x, y: y - 1 }, { x, y: y + 1 }].forEach(pos => {
      if (pos.x >= 0 && pos.x < GRID_SIZE && pos.y >= 0 && pos.y < GRID_SIZE) {
        grid[pos.y][pos.x].revealed = true;
      }
    });
  };

  const movePlayer = useCallback((dx, dy) => {
    if (gameState !== 'exploration') return;
    const newX = playerPos.x + dx;
    const newY = playerPos.y + dy;
    if (newX >= 0 && newX < GRID_SIZE && newY >= 0 && newY < GRID_SIZE) {
      const targetRoom = dungeon[newY][newX];
      if (targetRoom.revealed && targetRoom.type !== ROOM_TYPES.EMPTY) {
        setPlayerPos({ x: newX, y: newY });
        if (!targetRoom.visited) {
          targetRoom.visited = true;
          handleRoomEnter(targetRoom.type);
          const newDungeon = [...dungeon];
          revealAdjacentRooms(newDungeon, newX, newY);
          setDungeon(newDungeon);
        }
      }
    }
  }, [gameState, playerPos, dungeon]);

  const handleRoomEnter = (type) => {
    setGameState(type);
  };

  // --- MENU SCREEN ---
  if (gameState === 'menu') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black p-4">
        <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-lg border border-amber-500 p-8">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 text-amber-400">
            Path of Heroes
          </h1>
          <div className="space-y-4">
            {Object.values(CHARACTERS).map(char => (
              <button
                key={char.id}
                onClick={() => {
                  setPlayer({ ...char, currentHp: char.baseStats.hp });
                  setGameState('exploration');
                }}
                className="w-full flex items-center justify-center gap-3 p-5 rounded-lg border-2 border-gray-600 bg-gray-700 hover:bg-gray-600 hover:border-amber-400 transition-all text-lg font-semibold text-white"
              >
                <span className="text-3xl">{char.icon}</span>
                <span>{char.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- EXPLORATION ---
  if (gameState === 'exploration') {
    return (
      <div className="p-4">
        <div className="mb-4 flex justify-between text-white">
          <span>Floor {currentFloor}</span>
          <span className="flex items-center"><Coins className="w-4 h-4 mr-1" />0</span>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {dungeon.map((row, y) => row.map((room, x) => (
            <div key={`${x},${y}`} className={`aspect-square flex items-center justify-center text-xl rounded ${playerPos.x === x && playerPos.y === y ? 'bg-amber-600' : room.visited ? 'bg-gray-700' : room.revealed ? 'bg-gray-600' : 'bg-gray-900'}`}>
              {playerPos.x === x && playerPos.y === y ? player.icon : room.revealed ? ROOM_ICONS[room.type] : ''}
            </div>
          )))}
        </div>
        <div className="flex justify-center mt-4 space-x-2 text-white">
          <button onClick={() => movePlayer(0, -1)}><ChevronUp /></button>
          <button onClick={() => movePlayer(-1, 0)}><ChevronLeft /></button>
          <button onClick={() => movePlayer(1, 0)}><ChevronRight /></button>
          <button onClick={() => movePlayer(0, 1)}><ChevronDown /></button>
        </div>
      </div>
    );
  }

  // --- PLACEHOLDER SCENES ---
  if (Object.values(ROOM_TYPES).includes(gameState)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
        <h2 className="text-3xl font-bold mb-4">{gameState.toUpperCase()}</h2>
        <button
          onClick={() => setGameState('exploration')}
          className="px-6 py-3 bg-amber-500 hover:bg-amber-400 rounded-lg font-semibold"
        >
          Back to Map
        </button>
      </div>
    );
  }

  return null;
}
