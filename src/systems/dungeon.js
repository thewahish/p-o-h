// filename: src/systems/dungeon.js

import { GameConfig } from '../constants/config';
import { GameState } from '../core/state';
import { EnemyDatabase, getFloorEnemies, getFloorBoss } from '../constants/enemies';
import { Characters } from '../constants/characters';
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
    BOSS: 'boss',
    STAIRS: 'stairs'
};

export const RoomIcons = { 
    [RoomTypes.EMPTY]: '', // Plain empty for paths
    [RoomTypes.WALL]: '🧱', // Distinctive wall icon (can be changed to other blocking icons)
    [RoomTypes.BATTLE]: '⚔️', 
    [RoomTypes.ELITE]: '💀', 
    [RoomTypes.SHOP]: '🏪', 
    [RoomTypes.CAMPFIRE]: '🔥', 
    [RoomTypes.SHRINE]: '⛩️', 
    [RoomTypes.TREASURE]: '💎', 
    [RoomTypes.BOSS]: '👹',
    [RoomTypes.STAIRS]: '🔄'
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
    
    // Level-based scaling like modern RPGs (WoW style)
    const playerLevel = GameState.current.level || 1;
    
    // Determine enemy level based on floor and player level
    let enemyLevel;
    if (floor <= 2) {
        enemyLevel = Math.max(1, playerLevel - 1); // Slightly easier early game
    } else if (floor <= 4) {
        enemyLevel = playerLevel; // Same level as player
    } else if (floor <= 7) {
        enemyLevel = Math.max(1, playerLevel + Math.floor(Math.random() * 2)); // Player level or +1
    } else {
        enemyLevel = Math.max(1, playerLevel + Math.floor(Math.random() * 3) - 1); // Player level -1 to +1
    }
    
    // For bosses, always make them at least player level + 1
    if (scaledEnemy.isBoss) {
        enemyLevel = Math.max(playerLevel + 1, enemyLevel);
    }
    
    // Store enemy level for display and combat
    scaledEnemy.level = enemyLevel;
    
    // Level-based stat scaling (balanced like WoW)
    const levelDifference = enemyLevel - 1;
    const levelMultiplier = 1 + levelDifference * 0.12; // 12% increase per level above 1
    
    // Scale base stats with level
    scaledEnemy.baseStats.hp = Math.ceil(scaledEnemy.baseStats.hp * levelMultiplier);
    scaledEnemy.baseStats.atk = Math.ceil(scaledEnemy.baseStats.atk * levelMultiplier);
    scaledEnemy.baseStats.def = Math.ceil(scaledEnemy.baseStats.def * levelMultiplier);
    scaledEnemy.baseStats.spd = Math.ceil(scaledEnemy.baseStats.spd * (1 + levelDifference * 0.08)); // Slower speed scaling
    
    // Crit scales with level but caps at reasonable amount
    if (scaledEnemy.baseStats.crit) {
        scaledEnemy.baseStats.crit = Math.min(30, scaledEnemy.baseStats.crit + levelDifference * 1.5);
    }
    
    // Balance adjustments for better combat feel (like modern RPGs)
    if (!scaledEnemy.isBoss) {
        // Regular enemies: very slight damage reduction only (removed HP reduction)
        scaledEnemy.baseStats.atk = Math.ceil(scaledEnemy.baseStats.atk * 0.95);
    }
    
    // Create stats from baseStats for combat system
    scaledEnemy.stats = { ...scaledEnemy.baseStats };
    scaledEnemy.maxStats = { ...scaledEnemy.baseStats };
    
    // Scale rewards based on enemy level
    const rewardMultiplier = 1 + (enemyLevel - 1) * 0.08;
    scaledEnemy.goldReward.min = Math.ceil(scaledEnemy.goldReward.min * rewardMultiplier);
    scaledEnemy.goldReward.max = Math.ceil(scaledEnemy.goldReward.max * rewardMultiplier);
    scaledEnemy.xpReward = Math.ceil(scaledEnemy.xpReward * rewardMultiplier);
    
    // Store level for display (translation happens at render time)
    // Don't set displayName here - let the UI handle translation
    
    Logger.log(`Generated Lv.${enemyLevel} ${scaledEnemy.nameKey} (Player Lv.${playerLevel}, Floor ${floor})`, 'SYSTEM');
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
            revealed: true, // Reveal all rooms from start for strategic planning
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
    GameState.current.dungeon = dungeon;
    GameState.current.playerPos = { ...start };
    GameState._notify();
    Logger.log(`Generated visible dungeon for floor ${floor} with ${pathRooms.length + 1} rooms. Path fully revealed for strategic planning.`, 'SYSTEM');
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
                
                // Increased chance for multiple enemies on higher floors
                const multiEnemyChance = Math.min(0.6, 0.3 + (floor - 1) * 0.1); // 30% base, +10% per floor, max 60%
                if (Math.random() < multiEnemyChance) {
                    const secondEnemy = availableEnemies[Math.floor(Math.random() * availableEnemies.length)];
                    room.encounter.push(getScaledEnemy(secondEnemy, floor));
                    
                    // Chance for triple encounters on very high floors
                    if (floor >= 5 && Math.random() < 0.2) {
                        const thirdEnemy = availableEnemies[Math.floor(Math.random() * availableEnemies.length)];
                        room.encounter.push(getScaledEnemy(thirdEnemy, floor));
                    }
                }
            } else if (room.type === RoomTypes.ELITE) {
                const eliteEnemy = availableEnemies[Math.floor(Math.random() * availableEnemies.length)];
                const scaledElite = getScaledEnemy(eliteEnemy, floor);
                
                // Elite enemies get enhanced scaling based on floor
                const eliteBonus = 1.5 + (floor - 1) * 0.1; // Base 50% + 10% per floor
                scaledElite.baseStats.hp = Math.floor(scaledElite.baseStats.hp * eliteBonus);
                scaledElite.baseStats.atk = Math.floor(scaledElite.baseStats.atk * eliteBonus);
                scaledElite.baseStats.def = Math.floor(scaledElite.baseStats.def * eliteBonus);
                scaledElite.stats = { ...scaledElite.baseStats };
                scaledElite.maxStats = { ...scaledElite.baseStats };
                
                // Add Elite prefix properly for localization
                scaledElite.prefixKey = 'prefixes.elite';
                
                room.encounter = [scaledElite];
                
                // High floor elite encounters may have minions
                if (floor >= 3 && Math.random() < 0.4) {
                    const minion = availableEnemies[Math.floor(Math.random() * availableEnemies.length)];
                    room.encounter.push(getScaledEnemy(minion, floor));
                }
            } else if (room.type === RoomTypes.BOSS && bossEnemy) {
                const scaledBoss = getScaledEnemy(bossEnemy, floor);
                
                // Character-specific boss scaling
                const characterId = GameState.current.selectedCharacter?.toUpperCase() || 'WARRIOR';
                const character = Characters[characterId];
                const characterModifier = character?.bossScalingModifier || 1.0;
                
                // Bosses get extra scaling and unique naming
                let bossBonus = 1.8 + (floor - 1) * 0.15; // Base 80% + 15% per floor
                bossBonus *= characterModifier; // Apply character-specific scaling
                
                scaledBoss.baseStats.hp = Math.floor(scaledBoss.baseStats.hp * bossBonus);
                scaledBoss.baseStats.atk = Math.floor(scaledBoss.baseStats.atk * bossBonus);
                scaledBoss.baseStats.def = Math.floor(scaledBoss.baseStats.def * bossBonus);
                scaledBoss.stats = { ...scaledBoss.baseStats };
                scaledBoss.maxStats = { ...scaledBoss.baseStats };
                
                if (floor > 1) {
                    const progressionPath = character?.progressionPath || 'standard';
                    scaledBoss.nameKey = `${scaledBoss.nameKey} - Floor ${floor} ${progressionPath} Nemesis`;
                }
                
                room.encounter = [scaledBoss];
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

export function spawnStairs() {
    const dungeon = GameState.current.dungeon;
    if (!dungeon) return;
    
    // Find the boss room position
    let bossRoom = null;
    for (let y = 0; y < GRID_HEIGHT; y++) {
        for (let x = 0; x < GRID_WIDTH; x++) {
            if (dungeon[y][x].type === RoomTypes.BOSS) {
                bossRoom = { x, y };
                break;
            }
        }
        if (bossRoom) break;
    }
    
    if (!bossRoom) return;
    
    // Transform the boss room into stairs after boss defeat
    dungeon[bossRoom.y][bossRoom.x].type = RoomTypes.STAIRS;
    dungeon[bossRoom.y][bossRoom.x].encounter = null;
    dungeon[bossRoom.y][bossRoom.x].completed = true;
    
    GameState._notify();
    Logger.log('Stairs to next floor have appeared!', 'SYSTEM');
}