// filename: src/systems/dungeon.js
import { GameConfig } from '../constants/config';
import { GameState } from '../core/state';

export const RoomTypes = {
  EMPTY: 'empty',
  BATTLE: 'battle',
  ELITE: 'elite',
  SHOP: 'shop',
  CAMPFIRE: 'campfire',
  SHRINE: 'shrine',
  TREASURE: 'treasure',
  BOSS: 'boss'
};

export const RoomIcons = {
  [RoomTypes.EMPTY]: '·',
  [RoomTypes.BATTLE]: '⚔️',
  [RoomTypes.ELITE]: '💀',
  [RoomTypes.SHOP]: '🏪',
  [RoomTypes.CAMPFIRE]: '🔥',
  [RoomTypes.SHRINE]: '⛩️',
  [RoomTypes.TREASURE]: '💎',
  [RoomTypes.BOSS]: '👹'
};

const GRID_SIZE = 7;

/**
 * Generate a dungeon floor grid.
 */
export function generateDungeon() {
  const dungeon = Array(GRID_SIZE).fill(null).map(() =>
    Array(GRID_SIZE).fill(null).map(() => ({
      type: RoomTypes.EMPTY,
      revealed: false,
      visited: false,
      completed: false // Add a completion flag for events
    }))
  );

  const start = { x: 3, y: 6 };
  const boss = { x: 3, y: 0 };

  dungeon[start.y][start.x] = { type: RoomTypes.EMPTY, revealed: true, visited: true, completed: true };
  dungeon[boss.y][boss.x] = { type: RoomTypes.BOSS, revealed: false, visited: false, completed: false };

  const path = generatePath(start, boss);
  path.forEach(pos => {
    if (pos.y !== start.y && pos.y !== boss.y) {
      dungeon[pos.y][pos.x].type = Math.random() < 0.6
        ? RoomTypes.BATTLE
        : Math.random() < 0.3
          ? RoomTypes.ELITE
          : getRandomSpecialRoom();
    }
    // Optional side rooms
    const adjacents = [
      { x: pos.x - 1, y: pos.y },
      { x: pos.x + 1, y: pos.y },
      { x: pos.x, y: pos.y - 1 },
      { x: pos.x, y: pos.y + 1 }
    ];
    adjacents.forEach(adj => {
      if (adj.x >= 0 && adj.x < GRID_SIZE && adj.y >= 0 && adj.y < GRID_SIZE
        && Math.random() < 0.3
        && dungeon[adj.y][adj.x].type === RoomTypes.EMPTY) {
        dungeon[adj.y][adj.x].type = Math.random() < 0.7
          ? RoomTypes.BATTLE
          : getRandomSpecialRoom();
      }
    });
  });

  revealAdjacentRooms(dungeon, start.x, start.y);
  GameState.current.dungeon = dungeon;
  GameState.current.playerPos = { ...start };

  return dungeon;
}

function generatePath(start, end) {
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
}

function getRandomSpecialRoom() {
  const special = [RoomTypes.SHOP, RoomTypes.CAMPFIRE, RoomTypes.SHRINE, RoomTypes.TREASURE];
  return special[Math.floor(Math.random() * special.length)];
}

export function revealAdjacentRooms(grid, x, y) {
  const positions = [
    { x: x - 1, y },
    { x: x + 1, y },
    { x, y: y - 1 },
    { x, y: y + 1 }
  ];
  positions.forEach(pos => {
    if (pos.x >= 0 && pos.x < GRID_SIZE && pos.y >= 0 && pos.y < GRID_SIZE) {
      grid[pos.y][pos.x].revealed = true;
    }
  });
}