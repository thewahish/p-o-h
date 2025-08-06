// filename: src/constants/localization.js

/**
 * @fileoverview Handles dynamic English/Arabic text switching for the game.
 * This class manages the current language, provides translations, and updates
 * UI elements with the correct localized text.
 */

/**
 * Localization class for managing game text in multiple languages.
 * @class
 */
export class Localization {
    /**
     * @private
     * @type {string}
     * The currently active language ('en' for English, 'ar' for Arabic).
     */
    #currentLanguage;

    /**
     * @private
     * @type {Object.<string, Object.<string, string>>}
     * A dictionary containing all localized strings.
     */
    #translations = {
        'en': {
            // Global UI
            loadingText: "Loading Path of Heroes...",
            floorLabel: "Floor:",
            goldLabel: "Gold:",
            inventoryButton: "Inventory",
            debuggerTitle: "Debugger",
            gameStateTitle: "Game State",
            consoleLogTitle: "Console Log",
            copyLogsButton: "Copy All Logs",

            // Intro Screen
            gameTitle: "Path of Heroes",
            playButton: "Play Game",
            optionsButton: "Options",
            creditsButton: "Credits",

            // Character Select Screen
            charSelectTitle: "Choose Your Hero",
            rosterTitle: "Choose Your Champion",
            warriorTab: "Warrior",
            sorceressTab: "Sorceress",
            rogueTab: "Rogue",
            charDescription: "Description:",
            charRole: "Role:",
            charSpecialization: "Specialization:",
            statsLabel: "Base Stats (Level 1):",
            hpStat: "HP:",
            resourceStat: "Resource:",
            atkStat: "ATK:",
            defStat: "DEF:",
            spdStat: "SPD:",
            critStat: "CRIT:",
            startGameButton: "Start Your Journey",
            detailsButton: "Details",

            // Battle Screen
            attackButton: "Attack",
            skillButton: "Skill",
            potionButton: "Potions",
            defendButton: "Defend",
            fleeButton: "Flee",
// --- START MODIFICATION ---
            insufficientResource: "Not enough {resourceName}!",
            skill_shield_bash_name: "Shield Bash",
            skill_fireball_name: "Fireball",
            skill_venom_strike_name: "Venom Strike",
            combat_use_skill: "{character} uses {skill}!",
            combat_poison_damage: "{target} takes {damage} damage from poison.",
            combat_weaken_applied: "{target}'s attack has been weakened!",
            combat_status_resisted: "{target} resisted the effect!",
            combat_status_wore_off: "{character}'s {effect} wore off.",
// --- END MODIFICATION ---
            // Character Resource Names
            vigorResource: "Vigor",
            manaResource: "Mana",
            energyResource: "Energy",

            // Character Descriptions
            warriorDesc: "A formidable warrior, Taha leads with unyielding defense and immense vitality. He excels in direct combat, soaking up damage while delivering powerful strikes.",
            sorceressDesc: "Mais commands elemental forces, unleashing devastating area-of-effect spells and freezing foes in their tracks. Though fragile, her magic can turn the tide of any battle.",
            rogueDesc: "Swift and deadly, Ibrahim strikes from the shadows with unparalleled speed and precision. His critical hits can dispatch even the toughest enemies before they know what hit them.",

            // Character specific traits
            highDefenseTrait: "High Defense",
            areaStrikesTrait: "Area Strikes",
            resoluteTrait: "Resolute",
            elementalMagicTrait: "Elemental Magic",
            ancientKnowledgeTrait: "Ancient Knowledge",
            spellMasteryTrait: "Spell Mastery",
            berserkerRageTrait: "Berserker Rage",
            rawStrengthTrait: "Raw Strength",
            intimidatingTrait: "Intimidating",

            // Hero Souls System
            soulForgeTitle: "Soul Forge",
            heroSoulsLabel: "Hero Souls",
            permanentUpgradesDesc: "Permanent upgrades for all heroes",
            soulsEarnedLabel: "Hero Souls Earned:",
            soulsKeptMessage: "Souls are kept for permanent upgrades!",
            closeForgButton: "Close Forge",
            earnSoulsDesc: "Earn Hero Souls by defeating enemies and completing floors",
            purchaseButton: "Purchase",
            ownedLabel: "OWNED",
            purchasedLabel: "PURCHASED",
            needSoulsLabel: "Need {cost} Souls",
            purchaseSoulsLabel: "Purchase ({cost} Souls)",
            
            // Soul Forge Upgrades
            vitalityUpgrade: "Vitality",
            vitalityDesc: "+20% Maximum Health for all heroes",
            fortuneUpgrade: "Fortune", 
            fortuneDesc: "+50% Starting Gold for all runs",
            wisdomUpgrade: "Wisdom",
            wisdomDesc: "+25% Experience gain for all heroes",

            // Debug messages
            debugInitialized: "Debugger initialized.",
            debugToggleOn: "Debugger panel opened.",
            debugToggleOff: "Debugger panel closed.",
            debugLogsCopied: "All logs copied to clipboard!",
            errorLoadingScreen: "Error loading screen: ",
            screenLoaded: "Screen loaded: ",
            gameInitialized: "Game initialized.",
            languageChangedTo: "Language changed to: ",
            errorCopyingLogs: "Failed to copy logs: ",
            errorInitializingSystem: "Error initializing system: ",
            systemInitialized: "System initialized: ",
        },
        'ar': {
            // Global UI
            loadingText: "جاري تحميل طريق الأبطال...",
            floorLabel: "الطابق:",
            goldLabel: "الذهب:",
            inventoryButton: "المخزون",
            debuggerTitle: "المصحح",
            gameStateTitle: "حالة اللعبة",
            consoleLogTitle: "سجل وحدة التحكم",
            copyLogsButton: "نسخ جميع السجلات",

            // Intro Screen
            gameTitle: "طريق الأبطال",
            playButton: "ابدأ اللعبة",
            optionsButton: "الخيارات",
            creditsButton: "الاعتمادات",

            // Character Select Screen
            charSelectTitle: "اختر بطلك",
            rosterTitle: "اختر بطلك",
            warriorTab: "محارب",
            sorceressTab: "ساحرة",
            rogueTab: "لص",
            charDescription: "الوصف:",
            charRole: "الدور:",
            charSpecialization: "التخصص:",
            statsLabel: "الإحصائيات الأساسية (المستوى 1):",
            hpStat: "نقاط الحياة:",
            resourceStat: "المورد:",
            atkStat: "الهجوم:",
            defStat: "الدفاع:",
            spdStat: "السرعة:",
            critStat: "الضرر الحرج:",
            startGameButton: "ابدأ رحلتك",
            detailsButton: "التفاصيل",

            // Battle Screen
            attackButton: "هجوم",
            skillButton: "مهارة",
            potionButton: "جرعات",
            defendButton: "دفاع",
            fleeButton: "هروب",
// --- START MODIFICATION ---
            insufficientResource: "لا يوجد {resourceName} كافٍ!",
            skill_shield_bash_name: "ضربة الدرع",
            skill_fireball_name: "كرة نارية",
            skill_venom_strike_name: "ضربة سامة",
            combat_use_skill: "{character} يستخدم {skill}!",
            combat_poison_damage: "{target} يتلقى {damage} ضرر من السم.",
            combat_weaken_applied: "تم إضعاف هجوم {target}!",
            combat_status_resisted: "{target} قاوم التأثير!",
            combat_status_wore_off: "تأثير {effect} على {character} قد زال.",
// --- END MODIFICATION ---
            // Character Resource Names
            vigorResource: "نشاط",
            manaResource: "مانا",
            energyResource: "طاقة",

            // Character Descriptions
            warriorDesc: "محارب هائل، يقود طه بدفاع لا يتزعزع وحيوية هائلة. إنه يتفوق في القتال المباشر، ويمتص الضرر بينما يوجه ضربات قوية.",
            sorceressDesc: "ميس تتحكم بالقوى العنصرية، تطلق تعويذات منطقة واسعة مدمرة وتجمد الأعداء في مساراتهم. على الرغم من ضعفها، يمكن لسحرها تغيير مجرى أي معركة.",
            rogueDesc: "سريع وقاتل، يضرب إبراهيم من الظلال بسرعة ودقة لا مثيل لهما. يمكن لضرباته الحاسمة القضاء على أصعب الأعداء قبل أن يدركوا ما أصابهم.",

            // Character specific traits
            highDefenseTrait: "دفاع عالٍ",
            areaStrikesTrait: "ضربات منطقة",
            resoluteTrait: "عزيمة",
            elementalMagicTrait: "سحر عنصري",
            ancientKnowledgeTrait: "معرفة قديمة",
            spellMasteryTrait: "إتقان التعويذات",
            berserkerRageTrait: "غضب البرسيركر",
            rawStrengthTrait: "قوة خام",
            intimidatingTrait: "مهيب",

            // Hero Souls System
            soulForgeTitle: "مصنع الأرواح",
            heroSoulsLabel: "أرواح الأبطال",
            permanentUpgradesDesc: "ترقيات دائمة لجميع الأبطال",
            soulsEarnedLabel: "أرواح الأبطال المكتسبة:",
            soulsKeptMessage: "الأرواح محفوظة للترقيات الدائمة!",
            closeForgButton: "إغلاق المصنع",
            earnSoulsDesc: "اكسب أرواح الأبطال بهزيمة الأعداء وإكمال الطوابق",
            purchaseButton: "شراء",
            ownedLabel: "مملوك",
            purchasedLabel: "تم الشراء",
            needSoulsLabel: "تحتاج {cost} أرواح",
            purchaseSoulsLabel: "شراء ({cost} أرواح)",
            
            // Soul Forge Upgrades
            vitalityUpgrade: "الحيوية",
            vitalityDesc: "+20% نقاط الحياة القصوى لجميع الأبطال",
            fortuneUpgrade: "الحظ", 
            fortuneDesc: "+50% الذهب الابتدائي لجميع المحاولات",
            wisdomUpgrade: "الحكمة",
            wisdomDesc: "+25% كسب الخبرة لجميع الأبطال",

            // Debug messages
            debugInitialized: "تم تهيئة المصحح.",
            debugToggleOn: "لوحة المصحح مفتوحة.",
            debugToggleOff: "لوحة المصحح مغلقة.",
            debugLogsCopied: "تم نسخ جميع السجلات إلى الحافظة!",
            errorLoadingScreen: "خطأ في تحميل الشاشة: ",
            screenLoaded: "تم تحميل الشاشة: ",
            gameInitialized: "تم تهيئة اللعبة.",
            languageChangedTo: "تم تغيير اللغة إلى: ",
            errorCopyingLogs: "فشل نسخ السجلات: ",
            errorInitializingSystem: "خطأ في تهيئة النظام: ",
            systemInitialized: "تم تهيئة النظام: ",
        }
    };
    // ... rest of the class is unchanged
    constructor(defaultLanguage) {
        this.#currentLanguage = defaultLanguage;
        console.log(`Localization system initialized with default language: ${this.#currentLanguage}`);
    }
    get(key) {
        return this.#translations[this.#currentLanguage][key] || key;
    }
    setLanguage(language) {
        if (this.#translations[language]) {
            this.#currentLanguage = language;
            document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
            this.updateLocalizedElements();
            console.log(this.get('languageChangedTo') + language);
        } else {
            console.warn(`Language '${language}' not supported.`);
        }
    }
    getCurrentLanguage() {
        return this.#currentLanguage;
    }
    updateLocalizedElements() {
        document.querySelectorAll('[data-localize]').forEach(element => {
            const key = element.getAttribute('data-localize');
            element.textContent = this.get(key);
        });
        const langToggleButton = document.getElementById('language-toggle');
        if (langToggleButton) {
            langToggleButton.textContent = '';
        }
    }
}