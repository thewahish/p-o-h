// filename: src/systems/analytics.js

import Logger from '../core/logger.js';

/**
 * Analytics System - Tracks player statistics and performance metrics
 * Provides data for the analytics dashboard
 */
export const AnalyticsSystem = {
  // Default stats structure
  defaultStats: {
    totalBattles: 0,
    battlesWon: 0,
    battlesLost: 0,
    totalDamageDealt: 0,
    totalDamageTaken: 0,
    floorsCompleted: 0,
    goldEarned: 0,
    goldSpent: 0,
    playtime: 0,
    highestFloor: 0,
    totalDeaths: 0,

    // Character-specific stats
    characterStats: {
      omar: {
        battles: 0,
        wins: 0,
        losses: 0,
        maxFloor: 0,
        damageDealt: 0,
        damageTaken: 0,
        goldEarned: 0,
        playtime: 0
      },
      salma: {
        battles: 0,
        wins: 0,
        losses: 0,
        maxFloor: 0,
        damageDealt: 0,
        damageTaken: 0,
        goldEarned: 0,
        playtime: 0
      },
      shadi: {
        battles: 0,
        wins: 0,
        losses: 0,
        maxFloor: 0,
        damageDealt: 0,
        damageTaken: 0,
        goldEarned: 0,
        playtime: 0
      }
    },

    // Battle history (last 50 battles)
    battleHistory: [],

    // Floor progression tracking
    floorProgression: []
  },

  /**
   * Initialize analytics system - load from localStorage
   */
  initialize() {
    const saved = localStorage.getItem('poh_analytics');
    if (saved) {
      try {
        this.stats = JSON.parse(saved);
        // Ensure new properties exist (for updates)
        this.stats = { ...this.defaultStats, ...this.stats };
        Logger.log('Analytics loaded from localStorage', 'SYSTEM');
      } catch (error) {
        Logger.log('Failed to load analytics, using defaults', 'ERROR');
        this.stats = { ...this.defaultStats };
      }
    } else {
      this.stats = { ...this.defaultStats };
    }
  },

  /**
   * Save analytics to localStorage
   */
  save() {
    try {
      localStorage.setItem('poh_analytics', JSON.stringify(this.stats));
      Logger.log('Analytics saved', 'SYSTEM');
    } catch (error) {
      Logger.log('Failed to save analytics: ' + error, 'ERROR');
    }
  },

  /**
   * Track a completed battle
   * @param {Object} result - Battle result data
   */
  trackBattle(result) {
    const {
      victory,
      characterId,
      floor,
      goldGained = 0,
      goldLost = 0,
      damageDealt = 0,
      damageTaken = 0,
      duration = 0
    } = result;

    // Update global stats
    this.stats.totalBattles++;
    if (victory) {
      this.stats.battlesWon++;
      this.stats.goldEarned += goldGained;
    } else {
      this.stats.battlesLost++;
      this.stats.totalDeaths++;
    }

    this.stats.totalDamageDealt += damageDealt;
    this.stats.totalDamageTaken += damageTaken;

    // Update character-specific stats
    const charKey = characterId.toLowerCase();
    if (this.stats.characterStats[charKey]) {
      const charStats = this.stats.characterStats[charKey];
      charStats.battles++;
      if (victory) {
        charStats.wins++;
        charStats.goldEarned += goldGained;
      } else {
        charStats.losses++;
      }
      charStats.damageDealt += damageDealt;
      charStats.damageTaken += damageTaken;

      // Update max floor
      if (floor > charStats.maxFloor) {
        charStats.maxFloor = floor;
      }
    }

    // Add to battle history (keep last 50)
    this.stats.battleHistory.unshift({
      timestamp: Date.now(),
      character: characterId,
      floor,
      victory,
      goldGained,
      damageDealt,
      damageTaken,
      duration
    });

    if (this.stats.battleHistory.length > 50) {
      this.stats.battleHistory = this.stats.battleHistory.slice(0, 50);
    }

    // Update highest floor
    if (floor > this.stats.highestFloor) {
      this.stats.highestFloor = floor;
    }

    this.save();
    Logger.log(`Battle tracked: ${victory ? 'Victory' : 'Defeat'} on Floor ${floor}`, 'SYSTEM');
  },

  /**
   * Track floor completion
   * @param {number} floor - Floor number completed
   * @param {string} characterId - Character who completed it
   */
  trackFloorComplete(floor, characterId) {
    this.stats.floorsCompleted++;

    this.stats.floorProgression.push({
      timestamp: Date.now(),
      floor,
      character: characterId
    });

    // Keep last 100 floor completions
    if (this.stats.floorProgression.length > 100) {
      this.stats.floorProgression = this.stats.floorProgression.slice(0, 100);
    }

    this.save();
  },

  /**
   * Track gold spent in shop
   * @param {number} amount - Amount of gold spent
   */
  trackGoldSpent(amount) {
    this.stats.goldSpent += amount;
    this.save();
  },

  /**
   * Track playtime
   * @param {number} seconds - Seconds played this session
   * @param {string} characterId - Current character
   */
  trackPlaytime(seconds, characterId) {
    this.stats.playtime += seconds;

    const charKey = characterId?.toLowerCase();
    if (charKey && this.stats.characterStats[charKey]) {
      this.stats.characterStats[charKey].playtime += seconds;
    }

    this.save();
  },

  /**
   * Get overall win rate percentage
   * @returns {number} Win rate as percentage
   */
  getWinRate() {
    if (this.stats.totalBattles === 0) return 0;
    return ((this.stats.battlesWon / this.stats.totalBattles) * 100).toFixed(1);
  },

  /**
   * Get character-specific win rate
   * @param {string} characterId - Character ID
   * @returns {number} Win rate as percentage
   */
  getCharacterWinRate(characterId) {
    const charKey = characterId.toLowerCase();
    const charStats = this.stats.characterStats[charKey];

    if (!charStats || charStats.battles === 0) return 0;
    return ((charStats.wins / charStats.battles) * 100).toFixed(1);
  },

  /**
   * Get data formatted for charts
   * @returns {Object} Chart-ready data
   */
  getChartData() {
    return {
      // Win/Loss pie chart data
      winLoss: [
        { name: 'Wins', value: this.stats.battlesWon, fill: '#27ae60' },
        { name: 'Losses', value: this.stats.battlesLost, fill: '#e74c3c' }
      ],

      // Character comparison bar chart data
      characterComparison: Object.entries(this.stats.characterStats).map(([charId, stats]) => ({
        character: charId.charAt(0).toUpperCase() + charId.slice(1),
        battles: stats.battles,
        wins: stats.wins,
        maxFloor: stats.maxFloor,
        winRate: stats.battles > 0 ? ((stats.wins / stats.battles) * 100) : 0,
        damageDealt: stats.damageDealt,
        goldEarned: stats.goldEarned
      })),

      // Recent battle history line chart data
      recentBattles: this.stats.battleHistory.slice(0, 20).reverse().map((battle, index) => ({
        battle: index + 1,
        floor: battle.floor,
        damage: battle.damageDealt,
        gold: battle.goldGained,
        victory: battle.victory ? 1 : 0
      })),

      // Floor progression data
      floorProgression: this.stats.floorProgression.slice(0, 30).reverse().map((prog, index) => ({
        run: index + 1,
        floor: prog.floor,
        character: prog.character
      }))
    };
  },

  /**
   * Get summary statistics
   * @returns {Object} Summary stats
   */
  getSummary() {
    return {
      totalBattles: this.stats.totalBattles,
      winRate: this.getWinRate(),
      highestFloor: this.stats.highestFloor,
      totalGoldEarned: this.stats.goldEarned,
      totalGoldSpent: this.stats.goldSpent,
      netGold: this.stats.goldEarned - this.stats.goldSpent,
      totalDamageDealt: this.stats.totalDamageDealt,
      totalDamageTaken: this.stats.totalDamageTaken,
      avgDamagePerBattle: this.stats.totalBattles > 0
        ? Math.round(this.stats.totalDamageDealt / this.stats.totalBattles)
        : 0,
      playtimeMinutes: Math.round(this.stats.playtime / 60),
      totalDeaths: this.stats.totalDeaths,
      floorsCompleted: this.stats.floorsCompleted
    };
  },

  /**
   * Reset all analytics (use with caution!)
   */
  reset() {
    this.stats = { ...this.defaultStats };
    this.save();
    Logger.log('Analytics reset', 'SYSTEM');
  }
};

// Initialize on load
AnalyticsSystem.initialize();
