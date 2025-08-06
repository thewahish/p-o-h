// filename: src/core/state.js

import { Characters } from '../constants/characters';
import { GameConfig } from '../constants/config';
import Logger from './logger.js';

export const GameState = {
    current: {
        gameStarted: false,
        currentScreen: 'main-menu',
        player: null,
        selectedCharacter: null,
        currentFloor: 1,
        gold: 0,
        level: 1,
        inventory: [],
        equipped: {},
        battleInProgress: false,
        enemies: [],
        turnOrder: [],
        currentTurnIndex: 0,
        enemiesDefeated: 0,
        dungeon: null,
        playerPos: null,
        onBattleEnd: null,
        godMode: false,
        
        // Hero Souls system
        currentRunSouls: 0,
        totalSouls: 0,
        soulUpgrades: {} // { vitality: true, fortune: false, etc. }
    },
    
    subscribers: [],
    
    subscribe(callback) {
        this.subscribers.push(callback);
        return () => {
            this.subscribers = this.subscribers.filter(sub => sub !== callback);
        };
    },
    
    _notify() {
        this.subscribers.forEach(callback => {
            try {
                callback({ ...this.current });
            } catch (error) {
                Logger.log(`Error in GameState subscriber: ${error}`, 'ERROR');
            }
        });
    },

    update(key, value) {
        this.current[key] = value;
        this._notify();
    },

    reset() {
        this.current = {
            ...this.current, // Keep settings
            gameStarted: false, currentScreen: 'main-menu', player: null,
            selectedCharacter: null, currentFloor: 1, gold: 0, experience: 0,
            level: 1, inventory: [], equipped: {}, battleInProgress: false,
            enemies: [], turnOrder: [], currentTurnIndex: 0, enemiesDefeated: 0,
        };
        Logger.log('Game state has been reset.', 'STATE');
        this._notify();
    },

    newGame(characterId, difficulty = 'normal') {
        this.current = {
            ...this.current,
            gameStarted: true,
            currentScreen: 'exploration',
            difficulty: difficulty,
            selectedCharacter: characterId,
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
        };
        
        const characterData = Characters[characterId.toUpperCase()];
        if (!characterData) throw new Error(`Invalid character: ${characterId}`);
        
        this.current.player = this.createPlayerFromCharacter(characterData);
        Logger.log(`New game started with character: ${characterId}`, 'STATE');
        this._notify();
        return true;
    },

    createPlayerFromCharacter(characterData) {
        return {
            id: characterData.id, 
            nameKey: characterData.nameKey,
            class: characterData.id,
            roleKey: characterData.roleKey,
            sprite: '...', 
            stats: { ...characterData.baseStats },
            maxStats: { ...characterData.baseStats },
            resource: { 
                nameKey: characterData.resourceKey, 
                current: characterData.baseStats.resource, 
                max: characterData.baseStats.resource 
            },
            abilities: [...characterData.abilities], 
            statusEffects: []
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
                    if (baseStats.hasOwnProperty(stat)) { baseStats[stat] += item.stats[stat]; }
                });
            }
        });
        
        // Apply permanent soul upgrades
        const bonuses = this.applyPermanentUpgrades();
        baseStats.hp = Math.floor(baseStats.hp * bonuses.hpMultiplier);
        
        this.current.player.stats = baseStats;
        this.current.player.maxStats = { ...baseStats };
    },

    addExperience(amount) {
        if (!this.current.player) return;
        
        // Apply wisdom bonus
        const bonuses = this.applyPermanentUpgrades();
        amount = Math.floor(amount * bonuses.xpMultiplier);
        
        this.current.experience += amount;
        const currentLevel = this.current.level;
        const requiredXp = this.getRequiredExperience(currentLevel + 1);
        
        if (this.current.experience >= requiredXp) {
            this.levelUp();
        }
        this._notify();
    },

    levelUp() {
        if (!this.current.player) return;
        this.current.level++;
        this.updatePlayerStats();
        this.healPlayerToFull();
        Logger.log(`Player leveled up to ${this.current.level}!`, 'SYSTEM');
        this._notify();
    },

    getRequiredExperience(level) {
        return GameConfig.XP_CURVE.baseXP + (level - 2) * GameConfig.XP_CURVE.increment;
    },

    healPlayerToFull() {
        if (this.current.player) {
            this.current.player.stats.hp = this.current.player.maxStats.hp;
            this.current.player.resource.current = this.current.player.resource.max;
            Logger.log('Player healed to full HP and resource.', 'SYSTEM');
            this._notify();
        }
    },

    spendResource(amount) {
        if (this.current.player && this.current.player.resource.current >= amount) {
            this.current.player.resource.current -= amount;
            this._notify();
            return true;
        }
        return false;
    },

    addGold(amount) {
        // Apply fortune bonus
        const bonuses = this.applyPermanentUpgrades();
        if (amount === GameConfig.INVENTORY.startingGold) {
            amount = Math.floor(amount * bonuses.startingGoldMultiplier);
        }
        
        this.current.gold += amount;
        this._notify();
    },

    spendGold(amount) {
        if (this.current.gold >= amount) {
            this.current.gold -= amount;
            this._notify();
            return true;
        }
        return false;
    },

    applyDeathPenalty() {
        const goldLost = Math.floor(this.current.gold * 0.9);
        const goldKept = this.current.gold - goldLost;
        this.current.gold = goldKept;
        
        Logger.log(`Death penalty applied: Lost ${goldLost} gold, kept ${goldKept}`, 'SYSTEM');
        this._notify();
        return { goldLost, goldKept };
    },

    // Hero Souls System
    awardSouls(amount, reason) {
        this.current.currentRunSouls += amount;
        Logger.log(`Earned ${amount} Hero Souls: ${reason}`, 'SYSTEM');
        this._notify();
    },

    collectRunSouls() {
        const souls = this.current.currentRunSouls;
        this.current.totalSouls += souls;
        this.current.currentRunSouls = 0;
        this.saveSoulData();
        Logger.log(`Collected ${souls} Hero Souls. Total: ${this.current.totalSouls}`, 'SYSTEM');
    },

    spendSouls(amount) {
        if (this.current.totalSouls >= amount) {
            this.current.totalSouls -= amount;
            this.saveSoulData();
            this._notify();
            return true;
        }
        return false;
    },

    purchaseUpgrade(upgradeId) {
        const upgrades = this.getSoulUpgrades();
        const upgrade = upgrades[upgradeId];
        if (!upgrade || this.current.soulUpgrades[upgradeId]) return false;
        
        if (this.spendSouls(upgrade.cost)) {
            this.current.soulUpgrades[upgradeId] = true;
            this.saveSoulData();
            Logger.log(`Purchased upgrade: ${upgradeId}`, 'SYSTEM');
            return true;
        }
        return false;
    },

    getSoulUpgrades() {
        return {
            vitality: { cost: 20 },
            fortune: { cost: 15 },
            wisdom: { cost: 25 }
        };
    },

    applyPermanentUpgrades() {
        const upgrades = this.current.soulUpgrades;
        let bonuses = { hpMultiplier: 1, startingGoldMultiplier: 1, xpMultiplier: 1 };
        
        if (upgrades.vitality) bonuses.hpMultiplier = 1.2;
        if (upgrades.fortune) bonuses.startingGoldMultiplier = 1.5;
        if (upgrades.wisdom) bonuses.xpMultiplier = 1.25;
        
        return bonuses;
    },

    saveSoulData() {
        try {
            const soulData = {
                totalSouls: this.current.totalSouls,
                soulUpgrades: this.current.soulUpgrades
            };
            localStorage.setItem('pathOfHeroes_souls', JSON.stringify(soulData));
        } catch (error) {
            Logger.log(`Failed to save soul data: ${error}`, 'ERROR');
        }
    },

    loadSoulData() {
        try {
            const saved = localStorage.getItem('pathOfHeroes_souls');
            if (saved) {
                const data = JSON.parse(saved);
                this.current.totalSouls = data.totalSouls || 0;
                this.current.soulUpgrades = data.soulUpgrades || {};
                Logger.log(`Loaded soul data: ${this.current.totalSouls} souls`, 'SYSTEM');
            }
        } catch (error) {
            Logger.log(`Failed to load soul data: ${error}`, 'ERROR');
        }
    }
};

Logger.log('state.js: Module loaded.', 'SYSTEM');