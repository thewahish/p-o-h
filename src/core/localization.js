// filename: src/core/localization.js

/**
 * @fileoverview Centralized localization system that loads translations from external JSON files.
 * This allows easy editing of translations without touching code.
 */

import Logger from './logger.js';

/**
 * Global localization manager with external JSON file support
 * @class
 */
class LocalizationManager {
    constructor() {
        this.currentLanguage = 'en';
        this.translations = { en: {}, ar: {} };
        this.isLoaded = false;
        this.subscribers = new Set();
        
        // Load language preference from localStorage
        const saved = localStorage.getItem('pathOfHeroes_language');
        if (saved && (saved === 'en' || saved === 'ar')) {
            this.currentLanguage = saved;
        }
    }

    /**
     * Load translation files from external JSON
     */
    async loadTranslations() {
        try {
            Logger.log('Loading translation files...', 'SYSTEM');
            
            // Use import.meta.env.BASE_URL to handle Vite base path
            const basePath = import.meta.env.BASE_URL;
            const [enResponse, arResponse] = await Promise.all([
                fetch(`${basePath}locales/en.json`),
                fetch(`${basePath}locales/ar.json`)
            ]);

            if (!enResponse.ok || !arResponse.ok) {
                throw new Error('Failed to load translation files');
            }

            this.translations.en = await enResponse.json();
            this.translations.ar = await arResponse.json();
            
            this.isLoaded = true;
            Logger.log(`Translations loaded successfully. Current language: ${this.currentLanguage}`, 'SYSTEM');
            
            // Apply language settings
            this.setLanguage(this.currentLanguage);
            
            // Notify all subscribers
            this.notifySubscribers();
            
        } catch (error) {
            Logger.log(`Failed to load translations: ${error.message}`, 'ERROR');
            // Fallback to hardcoded minimal translations
            this.loadFallbackTranslations();
        }
    }

    /**
     * Fallback translations in case external files fail to load
     */
    loadFallbackTranslations() {
        this.translations = {
            en: {
                game: { title: "Path of Heroes" },
                language: { select: "Select Language", english: "English", arabic: "العربية" },
                menu: { loading: "Loading..." }
            },
            ar: {
                game: { title: "طريق الأبطال" },
                language: { select: "اختر اللغة", english: "English", arabic: "العربية" },
                menu: { loading: "جاري التحميل..." }
            }
        };
        this.isLoaded = true;
        Logger.log('Loaded fallback translations', 'SYSTEM');
    }

    /**
     * Subscribe to language changes
     */
    subscribe(callback) {
        this.subscribers.add(callback);
        return () => this.subscribers.delete(callback);
    }

    /**
     * Notify all subscribers of language change
     */
    notifySubscribers() {
        this.subscribers.forEach(callback => {
            try {
                callback(this.currentLanguage);
            } catch (error) {
                Logger.log(`Error in localization subscriber: ${error}`, 'ERROR');
            }
        });
    }

    /**
     * Get translation by key path (e.g., "game.title", "characters.warrior.name")
     */
    get(keyPath, params = {}) {
        if (!this.isLoaded) {
            return keyPath; // Return key as fallback if not loaded yet
        }

        const keys = keyPath.split('.');
        let value = this.translations[this.currentLanguage];
        
        // Navigate through nested keys
        for (const key of keys) {
            if (value && typeof value === 'object' && key in value) {
                value = value[key];
            } else {
                // Fallback to English if Arabic translation missing
                if (this.currentLanguage === 'ar') {
                    let fallback = this.translations.en;
                    for (const fallbackKey of keys) {
                        if (fallback && typeof fallback === 'object' && fallbackKey in fallback) {
                            fallback = fallback[fallbackKey];
                        } else {
                            fallback = keyPath;
                            break;
                        }
                    }
                    value = fallback;
                } else {
                    value = keyPath; // Return key as fallback
                }
                break;
            }
        }

        // Handle string interpolation
        if (typeof value === 'string' && Object.keys(params).length > 0) {
            return this.interpolate(value, params);
        }

        return value;
    }

    /**
     * Replace {param} placeholders in strings
     */
    interpolate(str, params) {
        return str.replace(/\{(\w+)\}/g, (match, key) => {
            return params[key] !== undefined ? params[key] : match;
        });
    }

    /**
     * Set current language and apply RTL/LTR
     */
    setLanguage(language) {
        if (!['en', 'ar'].includes(language)) {
            Logger.log(`Unsupported language: ${language}`, 'ERROR');
            return;
        }

        this.currentLanguage = language;
        
        // Apply RTL/LTR to document
        document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
        document.documentElement.setAttribute('lang', language);
        
        // Save preference
        localStorage.setItem('pathOfHeroes_language', language);
        
        Logger.log(`Language changed to: ${language}`, 'SYSTEM');
        
        // Notify subscribers
        this.notifySubscribers();
    }

    /**
     * Get current language
     */
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    /**
     * Check if translations are loaded
     */
    isReady() {
        return this.isLoaded;
    }
}

// Create and export singleton instance
export const Localization = new LocalizationManager();

// Export convenience function for components
export const t = (keyPath, params) => {
    return Localization.get(keyPath, params);
};

// Export hook for React components (import React separately in components that use this)
export const useLocalization = () => {
    // This will be used in components that import React
    return {
        t: (keyPath, params) => Localization.get(keyPath, params),
        language: Localization.getCurrentLanguage(),
        setLanguage: (lang) => Localization.setLanguage(lang),
        isReady: () => Localization.isReady()
    };
};