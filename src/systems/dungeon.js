// filename: src/systems/dungeon.js

import { GameConfig } from '../constants/config';
import { GameState } from '../core/state';
import { EnemyDatabase, getFloorEnemies, getFloorBoss } from '../constants/enemies';
import Logger from '../core/logger';

export const RoomTypes = { 
    EMPTY: 'empty', 
    WALL: 'wall',
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
    [RoomTypes.WALL]: '⬛', 
    [RoomTypes.BATTLE]: '⚔️', 
    [RoomTypes.ELITE]: '💀', 
    [RoomTypes.SHOP]: '🏪', 
    [RoomTypes.CAMPFIRE]: '🔥', 
    [RoomTypes.SHRINE]: '⛩️', 
    [RoomTypes.TREASURE]: '💎', 
    [RoomTypes.BOSS]: '👹' 
};

const GRID_WIDTH = 5;  // Fewer columns for much larger squares
const GRID_HEIGHT = 9;  // Optimal height for large, visible squares

function getScaledEnemy(enemyId, floor) {
    const baseEnemy = EnemyDatabase[enemyId];
    if (!baseEnemy) {
        Logger.log(`Enemy ID not found: ${enemyId}`, 'ERROR');
        return null;
    }

    const scaledEnemy = JSON.parse(JSON.stringify(baseEnemy));
    const scalingFactor = 1 + (floor - 1) * 0.20; // 20% stat increase per floor

    scaledEnemy.baseStats.hp = Math.floor(scaledEnemy.baseStats.hp * scalingFactor);
    scaledEnemy.baseStats.atk = Math.floor(scaledEnemy.baseStats.atk * scalingFactor);
    scaledEnemy.baseStats.def = Math.floor(scaledEnemy.baseStats.def * scalingFactor);
    
    // Create stats from baseStats for combat system
    scaledEnemy.stats = { ...scaledEnemy.baseStats };
    scaledEnemy.maxStats = { ...scaledEnemy.baseStats };
    return scaledEnemy;
}

// Maze generation utilities
function isValidPosition(x, y) {
    return x >= 0 && x < GRID_WIDTH && y >= 0 && y < GRID_HEIGHT;
}

function getNeighbors(x, y) {
    return [
        { x: x - 2, y }, // Left
        { x: x + 2, y }, // Right  
        { x, y: y - 2 }, // Up
        { x, y: y + 2 }  // Down
    ].filter(pos => isValidPosition(pos.x, pos.y));
}

function generateMaze() {
    // Initialize grid - all walls
    const maze = Array(GRID_HEIGHT).fill(null).map(() =>
        Array(GRID_WIDTH).fill(null).map(() => ({ type: RoomTypes.WALL, isPath: false }))
    );

    // Start maze generation from center-ish position (must be odd coordinates)
    const startX = Math.floor(GRID_WIDTH / 2);
    const startY = GRID_HEIGHT - 2; // Near bottom
    maze[startY][startX] = { type: RoomTypes.EMPTY, isPath: true };

    const stack = [{ x: startX, y: startY }];
    const visited = new Set();
    visited.add(`${startX},${startY}`);

    // Recursive backtracking maze generation
    while (stack.length > 0) {
        const current = stack[stack.length - 1];
        const neighbors = getNeighbors(current.x, current.y)
            .filter(pos => !visited.has(`${pos.x},${pos.y}`));

        if (neighbors.length > 0) {
            // Choose random unvisited neighbor
            const next = neighbors[Math.floor(Math.random() * neighbors.length)];
            
            // Carve path to neighbor
            const wallX = (current.x + next.x) / 2;
            const wallY = (current.y + next.y) / 2;
            
            maze[next.y][next.x] = { type: RoomTypes.EMPTY, isPath: true };
            maze[wallY][wallX] = { type: RoomTypes.EMPTY, isPath: true };
            
            visited.add(`${next.x},${next.y}`);
            stack.push(next);
        } else {
            stack.pop();
        }
    }

    return { maze, startX, startY };
}

export function generateDungeon() {
    const { maze, startX, startY } = generateMaze();
    
    // Convert maze to dungeon with proper room structure
    const dungeon = Array(GRID_HEIGHT).fill(null).map((_, y) =>
        Array(GRID_WIDTH).fill(null).map((_, x) => ({
            type: maze[y][x].type,
            revealed: false,
            visited: false,
            completed: false,
            encounter: null,
            isPath: maze[y][x].isPath || false
        }))
    );

    // Set starting position
    const start = { x: startX, y: startY };
    dungeon[start.y][start.x].revealed = true;
    dungeon[start.y][start.x].visited = true;
    dungeon[start.y][start.x].completed = true;

    // Find all path rooms for special room placement
    const pathRooms = [];
    for (let y = 0; y < GRID_HEIGHT; y++) {
        for (let x = 0; x < GRID_WIDTH; x++) {
            if (dungeon[y][x].isPath && !(x === start.x && y === start.y)) {
                pathRooms.push({ x, y });
            }
        }
    }

    // Shuffle path rooms for random placement
    for (let i = pathRooms.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pathRooms[i], pathRooms[j]] = [pathRooms[j], pathRooms[i]];
    }

    // Place special rooms strategically
    let roomIndex = 0;
    const floor = GameState.current.currentFloor;

    // Boss room - furthest from start
    let maxDistance = 0;
    let bossPos = null;
    pathRooms.forEach(room => {
        const distance = Math.abs(room.x - start.x) + Math.abs(room.y - start.y);
        if (distance > maxDistance) {
            maxDistance = distance;
            bossPos = room;
        }
    });
    if (bossPos) {
        dungeon[bossPos.y][bossPos.x].type = RoomTypes.BOSS;
        pathRooms.splice(pathRooms.findIndex(r => r.x === bossPos.x && r.y === bossPos.y), 1);
    }

    // Distribute other special rooms
    const specialRooms = [
        { type: RoomTypes.SHOP, count: 1 },
        { type: RoomTypes.SHRINE, count: 2 },
        { type: RoomTypes.TREASURE, count: 3 },
        { type: RoomTypes.ELITE, count: 2 }
    ];

    specialRooms.forEach(({ type, count }) => {
        for (let i = 0; i < count && roomIndex < pathRooms.length; i++) {
            dungeon[pathRooms[roomIndex].y][pathRooms[roomIndex].x].type = type;
            roomIndex++;
        }
    });

    // Fill remaining path rooms with battles
    for (let i = roomIndex; i < pathRooms.length; i++) {
        dungeon[pathRooms[i].y][pathRooms[i].x].type = RoomTypes.BATTLE;
    }

    // Populate encounters
    populateEncounters(dungeon, floor);

    // Initialize game state
    revealAdjacentRooms(dungeon, start.x, start.y);
    GameState.current.dungeon = dungeon;
    GameState.current.playerPos = { ...start };
    GameState._notify();
    Logger.log(`Generated maze-like dungeon for floor ${floor} with ${pathRooms.length + 1} rooms.`, 'SYSTEM');
    return dungeon;
}

function populateEncounters(dungeon, floor) {
    const availableEnemies = getFloorEnemies(floor);
    const bossEnemy = getFloorBoss(floor);

    for (let y = 0; y < GRID_HEIGHT; y++) {
        for (let x = 0; x < GRID_WIDTH; x++) {
            const room = dungeon[y][x];
            
            if (room.type === RoomTypes.BATTLE) {
                const randomEnemy = availableEnemies[Math.floor(Math.random() * availableEnemies.length)];
                room.encounter = [getScaledEnemy(randomEnemy, floor)];
                // 30% chance for double enemy encounter
                if (Math.random() < 0.3) {
                    const secondEnemy = availableEnemies[Math.floor(Math.random() * availableEnemies.length)];
                    room.encounter.push(getScaledEnemy(secondEnemy, floor));
                }
            } else if (room.type === RoomTypes.ELITE) {
                const eliteEnemy = availableEnemies[Math.floor(Math.random() * availableEnemies.length)];
                const scaledElite = getScaledEnemy(eliteEnemy, floor);
                // Elite enemies get 50% stat boost
                scaledElite.baseStats.hp = Math.floor(scaledElite.baseStats.hp * 1.5);
                scaledElite.baseStats.atk = Math.floor(scaledElite.baseStats.atk * 1.5);
                scaledElite.stats = { ...scaledElite.baseStats };
                scaledElite.maxStats = { ...scaledElite.baseStats };
                room.encounter = [scaledElite];
            } else if (room.type === RoomTypes.BOSS && bossEnemy) {
                room.encounter = [getScaledEnemy(bossEnemy, floor)];
            }
        }
    }
}

export function revealAdjacentRooms(grid, x, y) {
    const positions = [{ x: x - 1, y }, { x: x + 1, y }, { x, y: y - 1 }, { x, y: y + 1 }];
    positions.forEach(pos => {
        if (pos.x >= 0 && pos.x < GRID_WIDTH && pos.y >= 0 && pos.y < GRID_HEIGHT) {
            grid[pos.y][pos.x].revealed = true;
        }
    });
}