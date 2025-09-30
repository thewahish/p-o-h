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
        totalSouls: 0, // Global souls (deprecated - keeping for migration)
        soulUpgrades: {}, // Global upgrades (deprecated - keeping for migration)
        characterSouls: {}, // { warrior: { slot1: 50, slot2: 30, slot3: 0 }, sorceress: {...}, rogue: {...} }
        characterUpgrades: {} // { warrior: { slot1: { vitality: true, strength: false }, ... }, ... }
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
        // Keep the selected character and return to save slots instead of character selection
        const selectedCharacter = this.current.selectedCharacter;
        this.current = {
            ...this.current, // Keep settings
            gameStarted: false, 
            currentScreen: selectedCharacter ? 'save-slots' : 'main-menu', // Return to save slots if character was selected
            player: null,
            // Keep selectedCharacter so we return to their save slots
            currentFloor: 1, gold: 0, experience: 0,
            level: 1, inventory: [], equipped: {}, battleInProgress: false,
            enemies: [], turnOrder: [], currentTurnIndex: 0, enemiesDefeated: 0,
        };
        Logger.log(`Game state has been reset. Returning to ${this.current.currentScreen}`, 'STATE');
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
            gold: 25,  // Increased starting gold for better early game balance
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
        if (level <= 1) return 0; // Level 1 requires 0 XP (starting level)
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
        
        // Also add to character-specific soul count
        const characterId = this.current.selectedCharacter;
        const currentSlot = this.getCurrentSaveSlot();
        if (characterId && currentSlot) {
            this.addCharacterSouls(characterId, currentSlot, souls);
        }
        
        this.current.currentRunSouls = 0;
        this.saveSoulData();
        Logger.log(`Collected ${souls} Hero Souls. Total: ${this.current.totalSouls}`, 'SYSTEM');
    },

    // Character-specific soul management
    getCharacterSouls(characterId, slotNumber) {
        if (!this.current.characterSouls[characterId]) {
            this.current.characterSouls[characterId] = {};
        }
        const slotKey = `slot${slotNumber}`;
        return this.current.characterSouls[characterId][slotKey] || 0;
    },

    addCharacterSouls(characterId, slotNumber, souls) {
        if (!this.current.characterSouls[characterId]) {
            this.current.characterSouls[characterId] = {};
        }
        const slotKey = `slot${slotNumber}`;
        this.current.characterSouls[characterId][slotKey] = (this.current.characterSouls[characterId][slotKey] || 0) + souls;
        this.saveSoulData();
    },

    spendCharacterSouls(characterId, slotNumber, amount) {
        const currentSouls = this.getCharacterSouls(characterId, slotNumber);
        if (currentSouls >= amount) {
            const slotKey = `slot${slotNumber}`;
            this.current.characterSouls[characterId][slotKey] = currentSouls - amount;
            this.saveSoulData();
            return true;
        }
        return false;
    },

    getCurrentSaveSlot() {
        // This would need to be tracked when loading/saving
        // For now, return a default slot
        return this.current.currentSaveSlot || 1;
    },

    getCharacterLevel(characterId, slotNumber) {
        const saveKey = `pathOfHeroes_save_${characterId}_slot${slotNumber}`;
        const savedData = localStorage.getItem(saveKey);
        if (savedData) {
            const saveData = JSON.parse(savedData);
            return saveData.level || 1;
        }
        return 1; // Default level
    },

    getCharacterUpgrades(characterId, slotNumber) {
        if (!this.current.characterUpgrades[characterId]) {
            this.current.characterUpgrades[characterId] = {};
        }
        const slotKey = `slot${slotNumber}`;
        return this.current.characterUpgrades[characterId][slotKey] || {};
    },

    purchaseCharacterUpgrade(characterId, slotNumber, upgradeId) {
        const characterLevel = this.getCharacterLevel(characterId, slotNumber);
        const upgrades = this.getSoulUpgrades(characterId, characterLevel);
        const upgrade = upgrades[upgradeId];
        const purchased = this.getCharacterUpgrades(characterId, slotNumber);
        
        if (!upgrade || purchased[upgradeId]) return false;
        
        if (this.spendCharacterSouls(characterId, slotNumber, upgrade.cost)) {
            if (!this.current.characterUpgrades[characterId]) {
                this.current.characterUpgrades[characterId] = {};
            }
            const slotKey = `slot${slotNumber}`;
            if (!this.current.characterUpgrades[characterId][slotKey]) {
                this.current.characterUpgrades[characterId][slotKey] = {};
            }
            this.current.characterUpgrades[characterId][slotKey][upgradeId] = true;
            this.saveSoulData();
            Logger.log(`Purchased upgrade: ${upgradeId} for ${characterId} slot ${slotNumber}`, 'SYSTEM');
            return true;
        }
        return false;
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

    getSoulUpgrades(characterId, characterLevel = 1) {
        // Expanded base upgrades with dynamic pricing
        const baseUpgrades = {
            // Tier 1 - Foundation (Levels 1-3)
            vitality: { nameKey: 'upgrades.vitality.name', descriptionKey: 'upgrades.vitality.description', baseCost: 10, tier: 1, type: 'stat', maxLevel: 5 },
            fortune: { nameKey: 'upgrades.fortune.name', descriptionKey: 'upgrades.fortune.description', baseCost: 12, tier: 1, type: 'economic', maxLevel: 3 },
            wisdom: { nameKey: 'upgrades.wisdom.name', descriptionKey: 'upgrades.wisdom.description', baseCost: 15, tier: 1, type: 'progression', maxLevel: 3 },
            strength: { nameKey: 'upgrades.strength.name', descriptionKey: 'upgrades.strength.description', baseCost: 18, tier: 1, type: 'stat', maxLevel: 5 },
            resilience: { nameKey: 'upgrades.resilience.name', descriptionKey: 'upgrades.resilience.description', baseCost: 16, tier: 1, type: 'stat', maxLevel: 4 },
            
            // Tier 2 - Specialization (Levels 4-8)
            swiftness: { nameKey: 'upgrades.swiftness.name', descriptionKey: 'upgrades.swiftness.description', baseCost: 25, tier: 2, type: 'stat', maxLevel: 3 },
            merchantsFavor: { nameKey: 'upgrades.merchantsFavor.name', descriptionKey: 'upgrades.merchantsFavor.description', baseCost: 30, tier: 2, type: 'economic', maxLevel: 3 },
            battleMastery: { nameKey: 'upgrades.battleMastery.name', descriptionKey: 'upgrades.battleMastery.description', baseCost: 35, tier: 2, type: 'combat', maxLevel: 4 },
            treasureHunter: { nameKey: 'upgrades.treasureHunter.name', descriptionKey: 'upgrades.treasureHunter.description', baseCost: 40, tier: 2, type: 'economic', maxLevel: 3 },
            mysticism: { nameKey: 'upgrades.mysticism.name', descriptionKey: 'upgrades.mysticism.description', baseCost: 45, tier: 2, type: 'magic', maxLevel: 3 },
            regeneration: { nameKey: 'upgrades.regeneration.name', descriptionKey: 'upgrades.regeneration.description', baseCost: 38, tier: 2, type: 'survival', maxLevel: 4 },
            
            // Tier 3 - Mastery (Levels 9-15)
            floorMaster: { nameKey: 'upgrades.floorMaster.name', descriptionKey: 'upgrades.floorMaster.description', baseCost: 60, tier: 3, type: 'progression', maxLevel: 1 },
            soulReaper: { nameKey: 'upgrades.soulReaper.name', descriptionKey: 'upgrades.soulReaper.description', baseCost: 80, tier: 3, type: 'meta', maxLevel: 3 },
            criticalStrike: { nameKey: 'upgrades.criticalStrike.name', descriptionKey: 'upgrades.criticalStrike.description', baseCost: 70, tier: 3, type: 'combat', maxLevel: 4 },
            resourceMastery: { nameKey: 'upgrades.resourceMastery.name', descriptionKey: 'upgrades.resourceMastery.description', baseCost: 75, tier: 3, type: 'resource', maxLevel: 3 },
            goldRush: { nameKey: 'upgrades.goldRush.name', descriptionKey: 'upgrades.goldRush.description', baseCost: 65, tier: 3, type: 'economic', maxLevel: 2 },
            titanicHealth: { nameKey: 'upgrades.titanicHealth.name', descriptionKey: 'upgrades.titanicHealth.description', baseCost: 85, tier: 3, type: 'stat', maxLevel: 2 },
            
            // Tier 4 - Legendary (Levels 16+)
            legendaryLuck: { nameKey: 'upgrades.legendaryLuck.name', descriptionKey: 'upgrades.legendaryLuck.description', baseCost: 120, tier: 4, type: 'rare', maxLevel: 2 },
            transcendence: { nameKey: 'upgrades.transcendence.name', descriptionKey: 'upgrades.transcendence.description', baseCost: 200, tier: 4, type: 'ultimate', maxLevel: 1 },
            soulSiphon: { nameKey: 'upgrades.soulSiphon.name', descriptionKey: 'upgrades.soulSiphon.description', baseCost: 150, tier: 4, type: 'meta', maxLevel: 2 },
            divineBlessing: { nameKey: 'upgrades.divineBlessing.name', descriptionKey: 'upgrades.divineBlessing.description', baseCost: 180, tier: 4, type: 'ultimate', maxLevel: 1 },
            
            // Tier 5 - Mythical (Levels 25+) - Rare random appearances
            omnipotence: { nameKey: 'upgrades.omnipotence.name', descriptionKey: 'upgrades.omnipotence.description', baseCost: 500, tier: 5, type: 'godlike', maxLevel: 1, rarity: 'mythical' },
            immortality: { nameKey: 'upgrades.immortality.name', descriptionKey: 'upgrades.immortality.description', baseCost: 400, tier: 5, type: 'godlike', maxLevel: 1, rarity: 'mythical' },
            timeManipulation: { nameKey: 'upgrades.timeManipulation.name', descriptionKey: 'upgrades.timeManipulation.description', baseCost: 600, tier: 5, type: 'godlike', maxLevel: 1, rarity: 'mythical' }
        };
        
        // Character-specific upgrades
        const characterSpecific = {
            warrior: {
                shieldMastery: { nameKey: 'upgrades.shieldMastery.name', descriptionKey: 'upgrades.shieldMastery.description', cost: 45, tier: 2, type: 'class' },
                armorExpert: { nameKey: 'upgrades.armorExpert.name', descriptionKey: 'upgrades.armorExpert.description', cost: 80, tier: 3, type: 'class' },
                guardianSpirit: { nameKey: 'upgrades.guardianSpirit.name', descriptionKey: 'upgrades.guardianSpirit.description', cost: 130, tier: 4, type: 'class' }
            },
            sorceress: {
                manaFlow: { nameKey: 'upgrades.manaFlow.name', descriptionKey: 'upgrades.manaFlow.description', cost: 45, tier: 2, type: 'class' },
                elementalMastery: { nameKey: 'upgrades.elementalMastery.name', descriptionKey: 'upgrades.elementalMastery.description', cost: 80, tier: 3, type: 'class' },
                arcaneTranscendence: { nameKey: 'upgrades.arcaneTranscendence.name', descriptionKey: 'upgrades.arcaneTranscendence.description', cost: 130, tier: 4, type: 'class' }
            },
            rogue: {
                poisonMastery: { nameKey: 'upgrades.poisonMastery.name', descriptionKey: 'upgrades.poisonMastery.description', cost: 45, tier: 2, type: 'class' },
                shadowStep: { nameKey: 'upgrades.shadowStep.name', descriptionKey: 'upgrades.shadowStep.description', cost: 80, tier: 3, type: 'class' },
                deathFromShadows: { nameKey: 'upgrades.deathFromShadows.name', descriptionKey: 'upgrades.deathFromShadows.description', cost: 130, tier: 4, type: 'class' }
            }
        };
        
        // Filter upgrades based on character level and availability
        const availableUpgrades = { ...baseUpgrades };
        
        // Add character-specific upgrades
        if (characterSpecific[characterId]) {
            Object.assign(availableUpgrades, characterSpecific[characterId]);
        }
        
        // Filter by tier based on character level
        const maxTier = Math.min(4, Math.ceil(characterLevel / 3));
        const filteredUpgrades = {};
        
        Object.keys(availableUpgrades).forEach(key => {
            const upgrade = availableUpgrades[key];
            if (upgrade.tier <= maxTier) {
                filteredUpgrades[key] = upgrade;
            }
        });
        
        return filteredUpgrades;
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
                soulUpgrades: this.current.soulUpgrades,
                characterSouls: this.current.characterSouls,
                characterUpgrades: this.current.characterUpgrades
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
                this.current.characterSouls = data.characterSouls || {};
                this.current.characterUpgrades = data.characterUpgrades || {};
                Logger.log(`Loaded soul data: ${this.current.totalSouls} souls`, 'SYSTEM');
            }
        } catch (error) {
            Logger.log(`Failed to load soul data: ${error}`, 'ERROR');
        }
    },

    // Floor Progression System
    nextFloor() {
        // Award floor completion rewards
        const floorReward = this.calculateFloorReward();
        this.addGold(floorReward.gold);
        this.awardSouls(floorReward.souls, `Completing floor ${this.current.currentFloor}`);
        
        // Advance to next floor
        this.current.currentFloor += 1;
        
        // Heal player partially (25% of max HP)
        if (this.current.player) {
            const healAmount = Math.floor(this.current.player.maxStats.hp * 0.25);
            this.current.player.stats.hp = Math.min(
                this.current.player.maxStats.hp, 
                this.current.player.stats.hp + healAmount
            );
        }
        
        Logger.log(`Advanced to floor ${this.current.currentFloor}. Rewards: ${floorReward.gold} gold, ${floorReward.souls} souls`, 'SYSTEM');
        this._notify();
        return floorReward;
    },

    calculateFloorReward() {
        const baseGold = 5 + (this.current.currentFloor * 2); // Much lower: 7 gold for floor 1, 9 for floor 2, etc.
        const baseSouls = 5 + Math.floor(this.current.currentFloor / 2); // Option 3: 5-10 souls per floor (Floor 1=5, Floor 2=6, Floor 10=10)

        return {
            gold: baseGold,
            souls: baseSouls,
            reason: `Floor ${this.current.currentFloor} completion bonus`
        };
    },

    checkBossDefeat() {
        // Check if boss room is completed
        const dungeon = this.current.dungeon;
        if (!dungeon) return false;
        
        for (let y = 0; y < dungeon.length; y++) {
            for (let x = 0; x < dungeon[y].length; x++) {
                const room = dungeon[y][x];
                if (room.type === 'boss' && room.completed) {
                    return true;
                }
            }
        }
        return false;
    },

    resetForNewFloor() {
        // Keep player, level, gold, inventory, but reset dungeon state
        this.current.dungeon = null;
        this.current.playerPos = null;
        this.current.battleInProgress = false;
        this.current.enemies = [];
        this.current.turnOrder = [];
        this.current.currentTurnIndex = 0;
        this.current.currentScreen = 'exploration';
        
        Logger.log(`Reset game state for floor ${this.current.currentFloor}`, 'SYSTEM');
        this._notify();
    },

    // Character-specific save system
    saveGame(characterId, slotNumber) {
        try {
            const saveKey = `pathOfHeroes_save_${characterId}_slot${slotNumber}`;
            const saveData = {
                characterId: characterId,
                currentFloor: this.current.currentFloor,
                gold: this.current.gold,
                experience: this.current.experience,
                level: this.current.level,
                inventory: this.current.inventory,
                equipped: this.current.equipped,
                player: this.current.player,
                currentRunSouls: this.current.currentRunSouls,
                timestamp: Date.now(),
                gameVersion: "1.0.0",
                currentSaveSlot: slotNumber
            };
            
            localStorage.setItem(saveKey, JSON.stringify(saveData));
            Logger.log(`Game saved for ${characterId} in slot ${slotNumber}`, 'SYSTEM');
            return true;
        } catch (error) {
            Logger.log(`Failed to save game: ${error}`, 'ERROR');
            return false;
        }
    },

    loadGame(characterId, slotNumber) {
        try {
            const saveKey = `pathOfHeroes_save_${characterId}_slot${slotNumber}`;
            const savedData = localStorage.getItem(saveKey);
            
            if (!savedData) {
                Logger.log(`No save found for ${characterId} slot ${slotNumber}`, 'SYSTEM');
                return false;
            }
            
            const saveData = JSON.parse(savedData);
            
            // Restore game state
            this.current.gameStarted = true;
            this.current.selectedCharacter = saveData.characterId;
            this.current.currentFloor = saveData.currentFloor;
            this.current.gold = saveData.gold;
            this.current.experience = saveData.experience;
            this.current.level = saveData.level;
            this.current.inventory = saveData.inventory || [];
            this.current.equipped = saveData.equipped || {};
            this.current.player = saveData.player;
            this.current.currentRunSouls = saveData.currentRunSouls || 0;
            this.current.currentSaveSlot = saveData.currentSaveSlot || slotNumber;
            this.current.currentScreen = 'exploration';
            
            Logger.log(`Game loaded for ${characterId} from slot ${slotNumber}`, 'SYSTEM');
            this._notify();
            return true;
        } catch (error) {
            Logger.log(`Failed to load game: ${error}`, 'ERROR');
            return false;
        }
    },

    getSaveSlotInfo(characterId, slotNumber) {
        try {
            const saveKey = `pathOfHeroes_save_${characterId}_slot${slotNumber}`;
            const savedData = localStorage.getItem(saveKey);
            
            if (!savedData) return null;
            
            const saveData = JSON.parse(savedData);
            return {
                exists: true,
                level: saveData.level,
                floor: saveData.currentFloor,
                gold: saveData.gold,
                timestamp: saveData.timestamp,
                characterId: saveData.characterId
            };
        } catch (error) {
            Logger.log(`Failed to get save slot info: ${error}`, 'ERROR');
            return null;
        }
    },

    deleteSave(characterId, slotNumber) {
        try {
            const saveKey = `pathOfHeroes_save_${characterId}_slot${slotNumber}`;
            localStorage.removeItem(saveKey);
            Logger.log(`Deleted save for ${characterId} slot ${slotNumber}`, 'SYSTEM');
            return true;
        } catch (error) {
            Logger.log(`Failed to delete save: ${error}`, 'ERROR');
            return false;
        }
    }
};

Logger.log('state.js: Module loaded.', 'SYSTEM');