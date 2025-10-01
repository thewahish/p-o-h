// filename: src/services/autosave.js

/**
 * @fileoverview Automatic save system with configurable save triggers
 * Handles automatic saving on key game events without blocking the main thread
 */

import { GameState } from '../core/state.js';
import { GameConfig } from '../constants/config.js';
import Logger from '../core/logger.js';

/**
 * Auto-save configuration
 */
const AUTO_SAVE_CONFIG = {
    DEBOUNCE_MS: 30000,         // 30 seconds between saves (debounce)
    MIN_INTERVAL_MS: 5000,      // Minimum 5 seconds between any saves
    STORAGE_KEY: 'pathOfHeroes_autosave_metadata'
};

/**
 * Save trigger types
 */
export const SaveTriggers = {
    FLOOR_COMPLETE: 'floor_complete',
    BOSS_DEFEAT: 'boss_defeat',
    PLAYER_DEATH: 'player_death',
    MANUAL: 'manual',
    LEVEL_UP: 'level_up'
};

/**
 * Automatic save service with interval-based persistence
 */
export class AutoSaveService {
    constructor() {
        this.lastSaveTimestamp = null;
        this.pendingSave = false;
        this.saveTimer = null;
        this.observers = {
            saveStart: [],
            saveComplete: [],
            saveError: []
        };
    }

    /**
     * Check if auto-save should trigger based on conditions
     * @param {string} trigger - Save trigger type
     * @param {number} currentFloor - Current floor number
     * @returns {boolean} Whether save should proceed
     */
    shouldAutoSave(trigger, currentFloor) {
        // Always allow death and manual saves (critical)
        if (trigger === SaveTriggers.PLAYER_DEATH || trigger === SaveTriggers.MANUAL) {
            return true;
        }

        // Check if we have valid save data
        if (!GameState.current.selectedCharacter) {
            Logger.log('Cannot auto-save: No character selected', 'ERROR');
            return false;
        }

        // Debounce non-critical saves
        const now = Date.now();
        if (this.lastSaveTimestamp) {
            const timeSinceLastSave = now - this.lastSaveTimestamp;

            // Enforce minimum interval for all saves
            if (timeSinceLastSave < AUTO_SAVE_CONFIG.MIN_INTERVAL_MS) {
                if (GameConfig.DEBUG_MODE) {
                    Logger.log(`Auto-save debounced: ${timeSinceLastSave}ms since last save`, 'SYSTEM');
                }
                return false;
            }

            // Apply longer debounce for regular saves
            if (trigger !== SaveTriggers.BOSS_DEFEAT &&
                timeSinceLastSave < AUTO_SAVE_CONFIG.DEBOUNCE_MS) {
                if (GameConfig.DEBUG_MODE) {
                    Logger.log(`Auto-save debounced: ${timeSinceLastSave}ms since last save`, 'SYSTEM');
                }
                return false;
            }
        }

        return true;
    }

    /**
     * Perform auto-save operation
     * @param {string} trigger - What triggered the save
     * @returns {Promise<boolean>} Success status
     */
    async performAutoSave(trigger) {
        const characterId = GameState.current.selectedCharacter;
        const slotNumber = GameState.getCurrentSaveSlot();

        if (!characterId || !slotNumber) {
            Logger.log('Cannot auto-save: Missing character or slot info', 'ERROR');
            this._notifyError(new Error('Missing character or slot'));
            return false;
        }

        // Check if should save
        if (!this.shouldAutoSave(trigger, GameState.current.currentFloor)) {
            return false;
        }

        // Prevent concurrent saves
        if (this.pendingSave) {
            if (GameConfig.DEBUG_MODE) {
                Logger.log('Auto-save already in progress', 'SYSTEM');
            }
            return false;
        }

        this.pendingSave = true;
        this._notifySaveStart();

        // Use requestIdleCallback for non-blocking saves (or fallback to setTimeout)
        return new Promise((resolve) => {
            const executeSave = () => {
                try {
                    const success = GameState.saveGame(characterId, slotNumber);

                    if (success) {
                        this.lastSaveTimestamp = Date.now();
                        this._saveMetadata(trigger, GameState.current.currentFloor);
                        this._notifySaveComplete();
                        Logger.log(`Auto-save completed: ${trigger} (Floor ${GameState.current.currentFloor})`, 'SYSTEM');
                        resolve(true);
                    } else {
                        this._notifyError(new Error('Save failed'));
                        Logger.log(`Auto-save failed: ${trigger}`, 'ERROR');
                        resolve(false);
                    }
                } catch (error) {
                    this._notifyError(error);
                    Logger.log(`Auto-save error: ${error.message}`, 'ERROR');
                    resolve(false);
                } finally {
                    this.pendingSave = false;
                }
            };

            // Use requestIdleCallback if available (non-blocking)
            if ('requestIdleCallback' in window) {
                requestIdleCallback(executeSave, { timeout: 2000 });
            } else {
                // Fallback to setTimeout (still non-blocking)
                setTimeout(executeSave, 0);
            }
        });
    }

    /**
     * Get time since last save
     * @returns {number|null} Milliseconds since last save, or null if never saved
     */
    getTimeSinceLastSave() {
        if (!this.lastSaveTimestamp) return null;
        return Date.now() - this.lastSaveTimestamp;
    }

    /**
     * Get last save metadata
     * @returns {Object|null} Metadata object or null
     */
    getLastSaveMetadata() {
        try {
            const saved = localStorage.getItem(AUTO_SAVE_CONFIG.STORAGE_KEY);
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (error) {
            Logger.log(`Failed to load auto-save metadata: ${error.message}`, 'ERROR');
        }
        return null;
    }

    /**
     * Subscribe to save events
     * @param {string} event - Event type ('saveStart', 'saveComplete', 'saveError')
     * @param {Function} callback - Callback function
     * @returns {Function} Unsubscribe function
     */
    subscribe(event, callback) {
        if (this.observers[event]) {
            this.observers[event].push(callback);
        } else {
            Logger.log(`Unknown auto-save event: ${event}`, 'ERROR');
            return () => {};
        }

        // Return unsubscribe function
        return () => {
            this.observers[event] = this.observers[event].filter(cb => cb !== callback);
        };
    }

    /**
     * Clear save timer
     */
    clearTimer() {
        if (this.saveTimer) {
            clearTimeout(this.saveTimer);
            this.saveTimer = null;
        }
    }

    /**
     * Reset service state
     */
    reset() {
        this.clearTimer();
        this.pendingSave = false;
        this.lastSaveTimestamp = null;
    }

    /**
     * Notify save start
     * @private
     */
    _notifySaveStart() {
        this.observers.saveStart.forEach(cb => {
            try {
                cb();
            } catch (error) {
                Logger.log(`Error in saveStart callback: ${error.message}`, 'ERROR');
            }
        });
    }

    /**
     * Notify save complete
     * @private
     */
    _notifySaveComplete() {
        this.observers.saveComplete.forEach(cb => {
            try {
                cb();
            } catch (error) {
                Logger.log(`Error in saveComplete callback: ${error.message}`, 'ERROR');
            }
        });
    }

    /**
     * Notify save error
     * @param {Error} error - Error object
     * @private
     */
    _notifyError(error) {
        this.observers.saveError.forEach(cb => {
            try {
                cb(error);
            } catch (err) {
                Logger.log(`Error in saveError callback: ${err.message}`, 'ERROR');
            }
        });
    }

    /**
     * Save auto-save metadata
     * @param {string} trigger - Save trigger type
     * @param {number} floor - Current floor
     * @private
     */
    _saveMetadata(trigger, floor) {
        try {
            const metadata = {
                lastSaveTimestamp: this.lastSaveTimestamp,
                trigger: trigger,
                floor: floor,
                character: GameState.current.selectedCharacter,
                version: GameConfig.GAME_VERSION
            };

            localStorage.setItem(
                AUTO_SAVE_CONFIG.STORAGE_KEY,
                JSON.stringify(metadata)
            );
        } catch (error) {
            Logger.log(`Failed to save auto-save metadata: ${error.message}`, 'ERROR');
        }
    }

    /**
     * Load auto-save metadata
     * @private
     */
    _loadMetadata() {
        try {
            const saved = localStorage.getItem(AUTO_SAVE_CONFIG.STORAGE_KEY);
            if (saved) {
                const metadata = JSON.parse(saved);
                this.lastSaveTimestamp = metadata.lastSaveTimestamp || null;

                if (GameConfig.DEBUG_MODE) {
                    Logger.log(`Auto-save metadata loaded: Last save was ${metadata.trigger} on floor ${metadata.floor}`, 'SYSTEM');
                }
            }
        } catch (error) {
            Logger.log(`Failed to load auto-save metadata: ${error.message}`, 'ERROR');
        }
    }
}

// Create singleton instance
const autoSaveService = new AutoSaveService();

// Load metadata on initialization
autoSaveService._loadMetadata();

// Export singleton
export default autoSaveService;

Logger.log('autosave.js: Module loaded.', 'SYSTEM');
