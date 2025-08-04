import React, { useState, useEffect, useCallback } from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Swords, Heart, Shield, Zap, Coins, Flame, ShoppingBag, Sparkles, MapPin } from 'lucide-react';

// =======================
// GAME CONSTANTS
// =======================
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
  WARRIOR: {
    id: 'warrior',
    name: 'Taha',
    icon: '🦸',
    resource: 'Vigor',
    resourceColor: '#f1c40f',
    baseStats: { hp: 120, resource: 60, atk: 14, def: 10, spd: 5, pow: 5 }
  },
  SORCERESS: {
    id: 'sorceress', 
    name: 'Mais',
    icon: '🧙‍♀️',
    resource: 'Mana',
    resourceColor: '#3498db',
    baseStats: { hp: 80, resource: 100, atk: 8, def: 6, spd: 7, pow: 18 }
  },
  ROGUE: {
    id: 'rogue',
    name: 'Ibrahim',
    icon: '🥷',
    resource: 'Energy', 
    resourceColor: '#9b59b6',
    baseStats: { hp: 100, resource: 80, atk: 12, def: 8, spd: 10, pow: 8 }
  }
};

const ENEMIES = {
  GOBLIN: { name: 'Goblin', icon: '👺', stats: { hp: 60, atk: 18, def: 6, spd: 8, pow: 5 } },
  SKELETON: { name: 'Skeleton', icon: '💀', stats: { hp: 50, atk: 15, def: 8, spd: 6, pow: 8 } },
  ORC: { name: 'Orc', icon: '👹', stats: { hp: 90, atk: 22, def: 10, spd: 4, pow: 6 } },
  WRAITH: { name: 'Wraith', icon: '👻', stats: { hp: 70, atk: 12, def: 4, spd: 9, pow: 15 } }
};

const BOSSES = {
  ORC_WARLORD: { name: 'Orc Warlord', icon: '👹', stats: { hp: 250, atk: 30, def: 15, spd: 6, pow: 10 } }
};

// =======================
// MAIN GAME COMPONENT
// =======================
export default function PathOfHeroes() {
  const [gameState, setGameState] = useState('menu');
  const [currentFloor, setCurrentFloor] = useState(1);
  const [playerPos, setPlayerPos] = useState({ x: 3, y: 6 });
  const [dungeon, setDungeon] = useState([]);
  const [player, setPlayer] = useState(null);
  const [battleState, setBattleState] = useState(null);
  const [gold, setGold] = useState(50);
  const [pendingEvent, setPendingEvent] = useState(null); // Event after movement

  // =======================
  // GENERATE DUNGEON
  // =======================
  const generateDungeon = () => {
    console.log("[DEBUG] Generating new dungeon for floor", currentFloor);
    const newDungeon = Array(GRID_SIZE).fill(null).map(() =>
      Array(GRID_SIZE).fill(null).map(() => ({
        type: ROOM_TYPES.EMPTY,
        revealed: false,
        visited: false
      }))
    );

    newDungeon[6][3].type = ROOM_TYPES.EMPTY;
    newDungeon[6][3].revealed = true;
    newDungeon[6][3].visited = true;

    newDungeon[0][3].type = ROOM_TYPES.BOSS;

    const path = generatePath({ x: 3, y: 6 }, { x: 3, y: 0 });

    path.forEach(pos => {
      if (pos.y !== 6 && pos.y !== 0) {
        const roomType = Math.random() < 0.6 ? ROOM_TYPES.BATTLE :
                        Math.random() < 0.3 ? ROOM_TYPES.ELITE :
                        getRandomSpecialRoom();
        newDungeon[pos.y][pos.x].type = roomType;
      }
      const adjacents = [
        { x: pos.x - 1, y: pos.y },
        { x: pos.x + 1, y: pos.y },
        { x: pos.x, y: pos.y - 1 },
        { x: pos.x, y: pos.y + 1 }
      ];
      adjacents.forEach(adj => {
        if (adj.x >= 0 && adj.x < GRID_SIZE && adj.y >= 0 && adj.y < GRID_SIZE &&
            Math.random() < 0.3 && newDungeon[adj.y][adj.x].type === ROOM_TYPES.EMPTY) {
          newDungeon[adj.y][adj.x].type = Math.random() < 0.7 ? ROOM_TYPES.BATTLE : getRandomSpecialRoom();
        }
      });
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

  const getRandomSpecialRoom = () => {
    const special = [ROOM_TYPES.SHOP, ROOM_TYPES.CAMPFIRE, ROOM_TYPES.SHRINE, ROOM_TYPES.TREASURE];
    return special[Math.floor(Math.random() * special.length)];
  };

  const revealAdjacentRooms = (grid, x, y) => {
    const positions = [
      { x: x - 1, y }, { x: x + 1, y },
      { x, y: y - 1 }, { x, y: y + 1 }
    ];
    positions.forEach(pos => {
      if (pos.x >= 0 && pos.x < GRID_SIZE && pos.y >= 0 && pos.y < GRID_SIZE) {
        grid[pos.y][pos.x].revealed = true;
      }
    });
  };

  // =======================
  // MOVEMENT HANDLER
  // =======================
  const movePlayer = useCallback((dx, dy) => {
    if (gameState !== 'exploration') return;

    const newX = playerPos.x + dx;
    const newY = playerPos.y + dy;

    if (newX >= 0 && newX < GRID_SIZE && newY >= 0 && newY < GRID_SIZE) {
      const targetRoom = dungeon[newY][newX];
      console.log("[DEBUG] Move Attempt", { from: playerPos, to: { x: newX, y: newY }, roomType: targetRoom.type, revealed: targetRoom.revealed, visited: targetRoom.visited });

      if (targetRoom.revealed) {
        setPlayerPos({ x: newX, y: newY });
        if (!targetRoom.visited) {
          targetRoom.visited = true;
          revealAdjacentRooms(dungeon, newX, newY);
          setDungeon([...dungeon]);
          setPendingEvent({ type: targetRoom.type, x: newX, y: newY });
        }
      }
    }
  }, [gameState, playerPos, dungeon]);

  // =======================
  // EVENT HANDLER (AFTER MOVE)
  // =======================
  useEffect(() => {
    if (pendingEvent) {
      const { type, x, y } = pendingEvent;
      console.log("[DEBUG] Entering room", { type, x, y });

      if (type !== ROOM_TYPES.EMPTY) {
        dungeon[y][x].type = ROOM_TYPES.EMPTY;
        console.log("[DEBUG] Clearing tile", { x, y, previous: type });
        setDungeon([...dungeon]);
      }

      switch (type) {
        case ROOM_TYPES.BATTLE: startBattle(false); break;
        case ROOM_TYPES.ELITE: startBattle(true); break;
        case ROOM_TYPES.BOSS: startBossBattle(); break;
        case ROOM_TYPES.SHOP: setGameState('shop'); break;
        case ROOM_TYPES.CAMPFIRE: setGameState('campfire'); break;
        case ROOM_TYPES.SHRINE: setGameState('shrine'); break;
        case ROOM_TYPES.TREASURE: handleTreasure(); break;
        default: break;
      }

      setPendingEvent(null);
    }
  }, [pendingEvent]);

  // =======================
  // EVENT FUNCTIONS
  // =======================
  const startBattle = (isElite) => {
    const enemyPool = Object.entries(ENEMIES);
    const [_, enemyData] = enemyPool[Math.floor(Math.random() * enemyPool.length)];
    const enemy = {
      ...enemyData,
      currentHp: enemyData.stats.hp * (isElite ? 1.5 : 1),
      maxHp: enemyData.stats.hp * (isElite ? 1.5 : 1),
      isElite
    };
    setBattleState({ enemy, turn: 'player', log: [`A${isElite ? 'n elite' : ''} ${enemy.name} appears!`] });
    setGameState('battle');
  };

  const startBossBattle = () => {
    const boss = {
      ...BOSSES.ORC_WARLORD,
      currentHp: BOSSES.ORC_WARLORD.stats.hp,
      maxHp: BOSSES.ORC_WARLORD.stats.hp,
      isBoss: true
    };
    setBattleState({ enemy: boss, turn: 'player', log: [`The ${boss.name} blocks your path!`] });
    setGameState('battle');
  };

  const handleTreasure = () => {
    const goldFound = Math.floor(Math.random() * 100) + 50;
    setGold(prev => prev + goldFound);
    console.log(`[DEBUG] Treasure collected: ${goldFound} gold`);
  };

  // =======================
  // KEYBOARD CONTROLS
  // =======================
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameState !== 'exploration') return;
      console.log("[DEBUG] KeyPress detected", { key: e.key });
      switch (e.key) {
        case 'ArrowUp': case 'w': movePlayer(0, -1); break;
        case 'ArrowDown': case 's': movePlayer(0, 1); break;
        case 'ArrowLeft': case 'a': movePlayer(-1, 0); break;
        case 'ArrowRight': case 'd': movePlayer(1, 0); break;
        default: break;
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, movePlayer]);

  // =======================
  // MAIN RENDER
  // =======================
  if (gameState === 'menu') {
    return <MainMenu onStart={(character) => {
      console.log("[DEBUG] Character selected", { char: character });
      setPlayer({
        ...character,
        currentHp: character.baseStats.hp,
        currentResource: character.baseStats.resource,
        level: 1,
        xp: 0
      });
      setGameState('exploration');
      generateDungeon();
    }} />;
  }

  if (gameState === 'battle' && battleState) {
    return <BattleScreen player={player} battleState={battleState} onBattleEnd={(victory) => {
      if (victory) {
        const xpGain = battleState.enemy.isElite ? 100 : 50;
        const goldGain = battleState.enemy.isElite ? 75 : 30;
        setGold(prev => prev + goldGain);
        if (battleState.enemy.isBoss) {
          alert(`Floor ${currentFloor} Complete!`);
          setCurrentFloor(prev => prev + 1);
          setPlayerPos({ x: 3, y: 6 });
          generateDungeon();
        }
      } else {
        alert('You have been defeated!');
        setGameState('menu');
      }
      setBattleState(null);
      setGameState('exploration');
    }} />;
  }

  if (gameState === 'campfire') {
    return <CampfireScreen player={player} onContinue={() => setGameState('exploration')}
      onHeal={() => setPlayer(prev => ({ ...prev, currentHp: Math.min(prev.baseStats.hp, prev.currentHp + 50) }))}
      onUpgrade={() => setPlayer(prev => ({ ...prev, baseStats: { ...prev.baseStats, atk: prev.baseStats.atk + 2 } }))} />;
  }

  if (gameState === 'shop') {
    return <ShopScreen gold={gold} onPurchase={(cost) => setGold(prev => prev - cost)}
      onContinue={() => setGameState('exploration')} />;
  }

  if (gameState === 'shrine') {
    return <ShrineScreen onBlessingChosen={(blessing) => {
      alert(`You received the blessing: ${blessing}`);
      setGameState('exploration');
    }} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="bg-gray-800 rounded-lg p-4 mb-4 border border-amber-600">
          <div className="flex justify-between items-center">
            <div className="text-amber-400">
              <Swords className="inline w-5 h-5 mr-1" />
              Floor {currentFloor}
            </div>
            <div className="text-yellow-400">
              <Coins className="inline w-5 h-5 mr-1" /> {gold}
            </div>
          </div>
          <div className="mt-2 text-sm">
            {player.name} • HP: {player.currentHp}/{player.baseStats.hp}
          </div>
        </div>

        {/* Dungeon Grid */}
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="grid grid-cols-7 gap-1 mb-4">
            {dungeon.map((row, y) => (
              row.map((room, x) => (
                <div key={`${x},${y}`}
                  className={`aspect-square flex items-center justify-center text-2xl rounded
                    ${playerPos.x === x && playerPos.y === y ? 'bg-amber-600 animate-pulse' :
                      room.visited ? 'bg-gray-700' :
                      room.revealed ? 'bg-gray-600' : 'bg-gray-900'}
                    ${room.revealed && !room.visited && room.type !== ROOM_TYPES.EMPTY ? 'cursor-pointer hover:bg-gray-500' : ''}`}
                  onClick={() => {
                    if (room.revealed && !room.visited && room.type !== ROOM_TYPES.EMPTY) {
                      const dx = x - playerPos.x;
                      const dy = y - playerPos.y;
                      if (Math.abs(dx) + Math.abs(dy) === 1) {
                        movePlayer(dx, dy);
                      }
                    }
                  }}>
                  {playerPos.x === x && playerPos.y === y ? player.icon :
                   room.revealed ? ROOM_ICONS[room.type] : ''}
                </div>
              ))
            ))}
          </div>

          {/* Controls */}
          <div className="flex justify-center">
            <div className="grid grid-cols-3 gap-2">
              <div></div>
              <button onClick={() => movePlayer(0, -1)} className="bg-gray-700 p-2 rounded hover:bg-gray-600">
                <ChevronUp className="w-6 h-6" />
              </button>
              <div></div>
              <button onClick={() => movePlayer(-1, 0)} className="bg-gray-700 p-2 rounded hover:bg-gray-600">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div className="bg-amber-600 p-2 rounded">
                <MapPin className="w-6 h-6" />
              </div>
              <button onClick={() => movePlayer(1, 0)} className="bg-gray-700 p-2 rounded hover:bg-gray-600">
                <ChevronRight className="w-6 h-6" />
              </button>
              <div></div>
              <button onClick={() => movePlayer(0, 1)} className="bg-gray-700 p-2 rounded hover:bg-gray-600">
                <ChevronDown className="w-6 h-6" />
              </button>
              <div></div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-4 text-center text-gray-400 text-sm">
          Use arrow keys or WASD to move • Click adjacent rooms to enter
        </div>
      </div>
    </div>
  );
}
// =======================
// SUB-SCREENS
// =======================
function MainMenu({ onStart }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-amber-400 mb-8">Path of Heroes</h1>
      <p className="text-gray-400 mb-8">Choose your hero</p>
      <div className="grid grid-cols-1 gap-4">
        {Object.values(CHARACTERS).map(char => (
          <button key={char.id} onClick={() => onStart(char)}
            className="bg-gray-800 hover:bg-gray-700 p-4 rounded-lg border border-gray-600 text-left">
            <div className="text-2xl">{char.icon} {char.name}</div>
            <div className="text-sm text-gray-400 mt-1">
              {char.resource}: <span style={{ color: char.resourceColor }}>{char.baseStats.resource}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function BattleScreen({ player, battleState, onBattleEnd }) {
  const { enemy, log } = battleState;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4 flex flex-col items-center">
      <h2 className="text-xl mb-4">Battle!</h2>
      <div className="flex space-x-8 mb-4">
        <div className="text-center">
          <div className="text-4xl">{player.icon}</div>
          <div>{player.name}</div>
          <div>HP: {player.currentHp}/{player.baseStats.hp}</div>
        </div>
        <div className="text-center">
          <div className="text-4xl">{enemy.icon}</div>
          <div>{enemy.name}</div>
          <div>HP: {enemy.currentHp}/{enemy.maxHp}</div>
        </div>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg w-full max-w-md text-sm mb-4">
        {log.map((line, i) => <div key={i}>{line}</div>)}
      </div>
      <div className="flex space-x-4">
        <button onClick={() => onBattleEnd(true)} className="bg-green-600 px-4 py-2 rounded">Win</button>
        <button onClick={() => onBattleEnd(false)} className="bg-red-600 px-4 py-2 rounded">Lose</button>
      </div>
    </div>
  );
}

function CampfireScreen({ player, onContinue, onHeal, onUpgrade }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4 flex flex-col items-center">
      <h2 className="text-xl mb-4">Campfire</h2>
      <p className="mb-4">Rest or upgrade your abilities</p>
      <div className="space-x-4 mb-4">
        <button onClick={onHeal} className="bg-green-600 px-4 py-2 rounded">Heal</button>
        <button onClick={onUpgrade} className="bg-blue-600 px-4 py-2 rounded">Upgrade Attack</button>
      </div>
      <button onClick={onContinue} className="bg-gray-700 px-4 py-2 rounded">Continue</button>
    </div>
  );
}

function ShopScreen({ gold, onPurchase, onContinue }) {
  const items = [
    { name: 'Potion', cost: 20 },
    { name: 'Sword', cost: 50 },
    { name: 'Shield', cost: 40 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4 flex flex-col items-center">
      <h2 className="text-xl mb-4">Shop</h2>
      <div className="mb-4">Gold: {gold}</div>
      {items.map((item, i) => (
        <button key={i} onClick={() => onPurchase(item.cost)}
          disabled={gold < item.cost}
          className={`block w-full text-left p-2 rounded mb-2 ${gold >= item.cost ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-600 cursor-not-allowed'}`}>
          {item.name} - {item.cost}g
        </button>
      ))}
      <button onClick={onContinue} className="bg-gray-700 px-4 py-2 rounded">Leave</button>
    </div>
  );
}

function ShrineScreen({ onBlessingChosen }) {
  const blessings = [
    'Strength +5',
    'Speed +2',
    'Power +3'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4 flex flex-col items-center">
      <h2 className="text-xl mb-4">Shrine</h2>
      <p className="mb-4">Choose your blessing</p>
      {blessings.map((blessing, i) => (
        <button key={i} onClick={() => onBlessingChosen(blessing)}
          className="block w-full text-left p-2 rounded mb-2 bg-gray-800 hover:bg-gray-700">
          {blessing}
        </button>
      ))}
    </div>
  );
}
