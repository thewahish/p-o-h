// filename: src/core/state.js

import { GameConfig } from '../constants/config.js';
import { Characters } from '../constants/characters.js';
import Logger from './logger.js';

Logger.log('state.js: Module loaded.', 'SYSTEM');

export const GameState = {
    _subscribers: new Set(),

    subscribe(callback) {
        this._subscribers.add(callback);
        callback({ ...this.current }); // Immediately notify
        return () => this._subscribers.delete(callback);
    },

    _notify() {
        const freshState = { ...this.current };
        for (const callback of this._subscribers) {
            callback(freshState);
        }
    },

    current: {
        gameStarted: false,
        currentScreen: 'main-menu',
        difficulty: 'normal',
        player: null,
        selectedCharacter: null,
        currentFloor: 1,
        gold: GameConfig.INVENTORY.startingGold,
        experience: 0,
        level: 1,
        inventory: [],
        equipped: {},
        battleInProgress: false,
        enemies: [],
        turnOrder: [],
        currentTurnIndex: 0,
        enemiesDefeated: 0,
        settings: { autoSave: true }
    },

    reset() {
        this.current = { gameStarted: false, currentScreen: 'main-menu', difficulty: 'normal', player: null, selectedCharacter: null, currentFloor: 1, gold: GameConfig.INVENTORY.startingGold, experience: 0, level: 1, inventory: [], equipped: {}, battleInProgress: false, enemies: [], turnOrder: [], currentTurnIndex: 0, enemiesDefeated: 0, settings: { autoSave: true } };
        Logger.log('Game state has been reset.', 'STATE');
        this._notify();
    },

    newGame(characterId, difficulty = 'normal') {
        this.reset();
        this.current.gameStarted = true;
        this.current.selectedCharacter = characterId;
        this.current.difficulty = difficulty;
        const characterData = Characters[characterId.toUpperCase()];
        if (!characterData) throw new Error(`Invalid character: ${characterId}`);
        this.current.player = this.createPlayerFromCharacter(characterData);
        Logger.log(`New game started with character: ${characterId}`, 'STATE');
        this._notify();
        return true;
    },

    createPlayerFromCharacter(characterData) {
        return {
            id: characterData.id, name: characterData.name, class: characterData.id,
            title: characterData.role, sprite: '...', stats: { ...characterData.baseStats },
            maxStats: { ...characterData.baseStats },
            resource: { name: characterData.resource, current: characterData.baseStats.resource, max: characterData.baseStats.resource },
            abilities: [...characterData.abilities], level: 1, experience: 0, statusEffects: []
        };
    },

    updatePlayerStats() {
        if (!this.current.player) return;
        const characterData = Characters[this.current.selectedCharacter.toUpperCase()];
        const baseStats = { ...characterData.baseStats };
        const growth = characterData.growthRates;
        const levelBonus = this.current.level - 1;
        
        baseStats.hp = Math.floor(baseStats.hp + (growth.hp * levelBonus));
        baseStats.maxHp = baseStats.hp;
        baseStats.atk = Math.floor(baseStats.atk + (growth.atk * levelBonus));
        baseStats.def = Math.floor(baseStats.def + (growth.def * levelBonus));
        baseStats.spd = Math.floor(baseStats.spd + (growth.spd * levelBonus));
        baseStats.crit = parseFloat((baseStats.crit + (growth.crit * levelBonus)).toFixed(2));
        
        Object.values(this.current.equipped).forEach(item => {
            if (item && item.stats) {
                Object.keys(item.stats).forEach(stat => {
                    if (baseStats.hasOwnProperty(stat)) {
                        baseStats[stat] += item.stats[stat];
                    }
                });
            }
        });
        
        const oldMaxHp = this.current.player.maxStats.hp;
        const currentHpPercent = this.current.player.stats.hp / oldMaxHp;
        this.current.player.stats = { ...baseStats };
        this.current.player.maxStats = { ...baseStats };
        this.current.player.stats.hp = Math.round(baseStats.maxHp * currentHpPercent);
        this._notify();
    },

    addExperience(amount) {
        if (!this.current.player) return false;
        this.current.experience += amount;
        this.current.player.experience += amount;
        const requiredXP = this.getRequiredExperience(this.current.level);
        if (this.current.experience >= requiredXP && this.current.level < (GameConfig.XP_CURVE?.maxLevel || 60)) {
            this.levelUp();
        }
        this._notify();
        return true;
    },

    getRequiredExperience(level) {
        const config = GameConfig.XP_CURVE || { baseXP: 100, increment: 50 };
        if (level === 0) return 0;
        return config.baseXP + (level - 1) * config.increment;
    },

    levelUp() {
        this.current.level++;
        this.current.player.level++;
        this.updatePlayerStats();
        this.current.player.stats.hp = this.current.player.maxStats.hp;
        this.current.player.resource.current = this.current.player.resource.max;
        const character = Characters[this.current.selectedCharacter.toUpperCase()];
        const growth = character.growthRates;
        
        // --- FIX: Replaced problematic alert() with our new Logger ---
        const levelUpMessage = `🎉 LEVEL UP! You are now Level ${this.current.level}!`;
        Logger.log(levelUpMessage, 'SYSTEM');
        Logger.log(`- Health:+${growth.hp}, Attack:+${growth.atk}, Defense:+${growth.def}`, 'STATE');
        Logger.log(`- Speed:+${growth.spd}, Critical:+${growth.crit}%`, 'STATE');
        Logger.log('Health and resources have been fully restored.', 'SYSTEM');
        
        this._notify();
    },

    addGold(amount) {
        this.current.gold += amount;
        this._notify();
        return this.current.gold;
    },

    spendGold(amount) {
        if (this.current.gold >= amount) {
            this.current.gold -= amount;
            this._notify();
            return true;
        }
        return false;
    },

    spendResource(amount) {
        if (!this.current.player) return false;
        if (this.current.player.resource.current >= amount) {
            this.current.player.resource.current -= amount;
            this._notify();
            return true;
        }
        return false;
    },

    update(key, value) {
        this.current[key] = value;
        this._notify();
    },

    startBattle(enemies) {
        this.current.battleInProgress = true;
        this.current.enemies = enemies;
        this.current.turnOrder = [];
        this.current.currentTurnIndex = 0;
        this._notify();
    },

    endBattle() {
        this.current.battleInProgress = false;
        this.current.enemies = [];
        this.current.turnOrder = [];
        this.current.currentTurnIndex = 0;
        this._notify();
    }
};