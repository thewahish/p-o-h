// filename: src/utils/save-exporter.js

import * as XLSX from 'xlsx';
import { AnalyticsSystem } from '../systems/analytics.js';

/**
 * Save Exporter - Export character save data to Excel spreadsheet
 * Uses the SheetJS/xlsx library for Excel generation
 */
export const SaveExporter = {
  /**
   * Export a character save to Excel format
   * @param {string} characterId - Character ID (omar, salma, shadi)
   * @param {number} slotNumber - Save slot number (1-3)
   */
  exportSaveToExcel(characterId, slotNumber) {
    const saveKey = `pathOfHeroes_save_${characterId}_${slotNumber}`;
    const saveData = localStorage.getItem(saveKey);

    if (!saveData) {
      alert('No save data found for this slot!');
      return;
    }

    try {
      const data = JSON.parse(saveData);

      // Create workbook
      const workbook = XLSX.utils.book_new();

      // Sheet 1: Character Summary
      const summaryData = [
        ['Path of Heroes - Character Export'],
        [''],
        ['Character', this.getCharacterName(data.characterId)],
        ['Save Slot', slotNumber],
        ['Exported', new Date().toLocaleString()],
        [''],
        ['=== PROGRESS ==='],
        ['Level', data.level || 1],
        ['Current Floor', data.currentFloor || 1],
        ['Experience', data.experience || 0],
        ['Gold', data.gold || 0],
        [''],
        ['=== STATS ==='],
        ['HP', `${data.player?.stats?.hp || 0} / ${data.player?.stats?.maxHp || 0}`],
        ['Attack', data.player?.stats?.attack || 0],
        ['Defense', data.player?.stats?.defense || 0],
        ['Speed', data.player?.stats?.speed || 0],
        [''],
        ['=== RESOURCES ==='],
        [this.getResourceName(data.characterId), `${data.player?.resource || 0} / ${data.player?.maxResource || 0}`],
        [''],
        ['=== HERO SOULS ==='],
        ['Current Run Souls', data.currentRunSouls || 0],
        ['Total Souls (All Time)', data.characterSouls?.[characterId] || 0],
      ];

      const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);

      // Style the summary sheet
      summarySheet['!cols'] = [
        { wch: 25 },  // Column A width
        { wch: 15 }   // Column B width
      ];

      XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

      // Sheet 2: Combat Stats
      const combatData = [
        ['Combat Statistics'],
        [''],
        ['Metric', 'Value'],
        ['Total Battles', data.stats?.totalBattles || 0],
        ['Battles Won', data.stats?.battlesWon || 0],
        ['Battles Lost', data.stats?.battlesLost || 0],
        ['Win Rate', data.stats?.totalBattles > 0
          ? `${((data.stats.battlesWon / data.stats.totalBattles) * 100).toFixed(1)}%`
          : '0%'],
        [''],
        ['Total Damage Dealt', data.stats?.totalDamageDealt || 0],
        ['Total Damage Taken', data.stats?.totalDamageTaken || 0],
        ['Avg Damage/Battle', data.stats?.totalBattles > 0
          ? Math.round((data.stats.totalDamageDealt || 0) / data.stats.totalBattles)
          : 0],
        [''],
        ['Floors Completed', data.stats?.floorsCompleted || 0],
        ['Highest Floor', data.stats?.highestFloor || data.currentFloor || 1],
        ['Total Deaths', data.stats?.totalDeaths || 0],
      ];

      const combatSheet = XLSX.utils.aoa_to_sheet(combatData);
      combatSheet['!cols'] = [{ wch: 25 }, { wch: 15 }];
      XLSX.utils.book_append_sheet(workbook, combatSheet, 'Combat Stats');

      // Sheet 3: Inventory (if exists)
      if (data.inventory && data.inventory.length > 0) {
        const inventoryData = [
          ['Inventory'],
          [''],
          ['Item', 'Quantity', 'Type']
        ];

        data.inventory.forEach(item => {
          inventoryData.push([
            item.name || 'Unknown',
            item.quantity || 1,
            item.type || 'Item'
          ]);
        });

        const inventorySheet = XLSX.utils.aoa_to_sheet(inventoryData);
        inventorySheet['!cols'] = [{ wch: 30 }, { wch: 10 }, { wch: 15 }];
        XLSX.utils.book_append_sheet(workbook, inventorySheet, 'Inventory');
      }

      // Sheet 4: Upgrades (if exists)
      if (data.characterUpgrades && data.characterUpgrades[characterId]) {
        const upgradeData = [
          ['Hero Soul Upgrades'],
          [''],
          ['Upgrade', 'Unlocked']
        ];

        const upgrades = data.characterUpgrades[characterId]?.[`slot${slotNumber}`] || {};
        Object.entries(upgrades).forEach(([key, value]) => {
          upgradeData.push([
            this.formatUpgradeName(key),
            value ? 'Yes' : 'No'
          ]);
        });

        const upgradeSheet = XLSX.utils.aoa_to_sheet(upgradeData);
        upgradeSheet['!cols'] = [{ wch: 30 }, { wch: 10 }];
        XLSX.utils.book_append_sheet(workbook, upgradeSheet, 'Upgrades');
      }

      // Sheet 5: Analytics (global stats)
      const analyticsStats = AnalyticsSystem.stats.characterStats[characterId.toLowerCase()];
      if (analyticsStats) {
        const analyticsData = [
          ['Global Analytics - All Runs'],
          [''],
          ['Metric', 'Value'],
          ['Total Battles (All Saves)', analyticsStats.battles || 0],
          ['Total Wins', analyticsStats.wins || 0],
          ['Total Losses', analyticsStats.losses || 0],
          ['Win Rate', analyticsStats.battles > 0
            ? `${((analyticsStats.wins / analyticsStats.battles) * 100).toFixed(1)}%`
            : '0%'],
          [''],
          ['Highest Floor Ever', analyticsStats.maxFloor || 0],
          ['Total Damage (All Runs)', analyticsStats.damageDealt || 0],
          ['Total Gold Earned', analyticsStats.goldEarned || 0],
          ['Playtime (minutes)', Math.round((analyticsStats.playtime || 0) / 60)],
        ];

        const analyticsSheet = XLSX.utils.aoa_to_sheet(analyticsData);
        analyticsSheet['!cols'] = [{ wch: 30 }, { wch: 15 }];
        XLSX.utils.book_append_sheet(workbook, analyticsSheet, 'Global Analytics');
      }

      // Generate filename
      const timestamp = new Date().toISOString().split('T')[0];
      const charName = this.getCharacterName(characterId);
      const filename = `POH_${charName}_Slot${slotNumber}_${timestamp}.xlsx`;

      // Write and download
      XLSX.writeFile(workbook, filename);

      console.log('Excel file exported:', filename);
      return true;

    } catch (error) {
      console.error('Failed to export save:', error);
      alert('Failed to export save file. Check console for details.');
      return false;
    }
  },

  /**
   * Export all analytics data to Excel
   */
  exportAnalyticsToExcel() {
    try {
      const stats = AnalyticsSystem.stats;
      const workbook = XLSX.utils.book_new();

      // Sheet 1: Overview
      const overviewData = [
        ['Path of Heroes - Analytics Export'],
        [''],
        ['Exported', new Date().toLocaleString()],
        [''],
        ['=== OVERALL STATISTICS ==='],
        ['Total Battles', stats.totalBattles],
        ['Battles Won', stats.battlesWon],
        ['Battles Lost', stats.battlesLost],
        ['Win Rate', stats.totalBattles > 0
          ? `${((stats.battlesWon / stats.totalBattles) * 100).toFixed(1)}%`
          : '0%'],
        [''],
        ['Highest Floor', stats.highestFloor],
        ['Floors Completed', stats.floorsCompleted],
        ['Total Deaths', stats.totalDeaths],
        [''],
        ['Total Gold Earned', stats.goldEarned],
        ['Total Gold Spent', stats.goldSpent],
        ['Net Gold', stats.goldEarned - stats.goldSpent],
        [''],
        ['Total Damage Dealt', stats.totalDamageDealt],
        ['Total Damage Taken', stats.totalDamageTaken],
        ['Playtime (hours)', (stats.playtime / 3600).toFixed(1)],
      ];

      const overviewSheet = XLSX.utils.aoa_to_sheet(overviewData);
      overviewSheet['!cols'] = [{ wch: 25 }, { wch: 15 }];
      XLSX.utils.book_append_sheet(workbook, overviewSheet, 'Overview');

      // Sheet 2: Character Comparison
      const charData = [
        ['Character Statistics'],
        [''],
        ['Character', 'Battles', 'Wins', 'Losses', 'Win Rate', 'Max Floor', 'Damage Dealt', 'Gold Earned']
      ];

      ['omar', 'salma', 'shadi'].forEach(charId => {
        const charStats = stats.characterStats[charId];
        charData.push([
          this.getCharacterName(charId),
          charStats.battles,
          charStats.wins,
          charStats.losses,
          charStats.battles > 0 ? `${((charStats.wins / charStats.battles) * 100).toFixed(1)}%` : '0%',
          charStats.maxFloor,
          charStats.damageDealt,
          charStats.goldEarned
        ]);
      });

      const charSheet = XLSX.utils.aoa_to_sheet(charData);
      charSheet['!cols'] = [
        { wch: 12 }, { wch: 10 }, { wch: 10 }, { wch: 10 },
        { wch: 12 }, { wch: 12 }, { wch: 15 }, { wch: 15 }
      ];
      XLSX.utils.book_append_sheet(workbook, charSheet, 'Characters');

      // Sheet 3: Battle History
      if (stats.battleHistory && stats.battleHistory.length > 0) {
        const historyData = [
          ['Battle History (Last 50)'],
          [''],
          ['Date', 'Character', 'Floor', 'Result', 'Gold', 'Damage Dealt']
        ];

        stats.battleHistory.slice(0, 50).forEach(battle => {
          historyData.push([
            new Date(battle.timestamp).toLocaleString(),
            this.getCharacterName(battle.character),
            battle.floor,
            battle.victory ? 'Victory' : 'Defeat',
            battle.goldGained,
            battle.damageDealt
          ]);
        });

        const historySheet = XLSX.utils.aoa_to_sheet(historyData);
        historySheet['!cols'] = [
          { wch: 20 }, { wch: 12 }, { wch: 8 },
          { wch: 10 }, { wch: 10 }, { wch: 15 }
        ];
        XLSX.utils.book_append_sheet(workbook, historySheet, 'Battle History');
      }

      // Generate filename
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `POH_Analytics_${timestamp}.xlsx`;

      // Write and download
      XLSX.writeFile(workbook, filename);

      console.log('Analytics exported:', filename);
      return true;

    } catch (error) {
      console.error('Failed to export analytics:', error);
      alert('Failed to export analytics. Check console for details.');
      return false;
    }
  },

  /**
   * Helper: Get character display name
   */
  getCharacterName(characterId) {
    const names = {
      omar: 'Omar (Warrior)',
      salma: 'Salma (Sorceress)',
      shadi: 'Shadi (Rogue)'
    };
    return names[characterId?.toLowerCase()] || characterId;
  },

  /**
   * Helper: Get resource name for character
   */
  getResourceName(characterId) {
    const resources = {
      omar: 'Vigor',
      salma: 'Mana',
      shadi: 'Energy'
    };
    return resources[characterId?.toLowerCase()] || 'Resource';
  },

  /**
   * Helper: Format upgrade name for display
   */
  formatUpgradeName(key) {
    return key
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }
};
