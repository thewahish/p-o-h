// filename: src/components/language-selection.jsx

import React, { useState, useEffect } from 'react';
import { Localization } from '../core/localization.js';
import Logger from '../core/logger.js';

export default function LanguageSelection({ onLanguageSelected }) {
    const [selectedLanguage, setSelectedLanguage] = useState('en');
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Wait for translations to load
        const checkLoaded = () => {
            if (Localization.isReady()) {
                setIsLoaded(true);
                setSelectedLanguage(Localization.getCurrentLanguage());
            } else {
                setTimeout(checkLoaded, 100);
            }
        };
        checkLoaded();
    }, []);

    const handleLanguageSelect = (language) => {
        setSelectedLanguage(language);
        Logger.log(`Language selected: ${language}`, 'UI');
    };

    const handleConfirm = () => {
        Localization.setLanguage(selectedLanguage);
        Logger.log(`Language confirmed and applied: ${selectedLanguage}`, 'SYSTEM');
        onLanguageSelected(selectedLanguage);
    };

    if (!isLoaded) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="text-2xl mb-4">🌍</div>
                    <div className="text-lg text-gray-300">Loading...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center px-4">
            <div className="bg-gray-800 border-2 border-amber-500 rounded-lg p-8 max-w-md w-full text-center shadow-2xl">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-amber-400 mb-4">🌍</h1>
                    <h2 className="text-2xl font-bold mb-2">
                        {Localization.get('language.select')}
                    </h2>
                    <div className="text-lg text-gray-300">
                        Select Language / اختر اللغة
                    </div>
                </div>

                <div className="space-y-4 mb-8">
                    {/* English Option */}
                    <button
                        onClick={() => handleLanguageSelect('en')}
                        className={`w-full p-4 rounded-lg text-xl font-bold transition-all duration-200 flex items-center justify-center gap-3 ${
                            selectedLanguage === 'en'
                                ? 'bg-amber-600 border-2 border-amber-400 text-white shadow-lg scale-105'
                                : 'bg-gray-700 border-2 border-gray-600 text-gray-300 hover:bg-gray-600'
                        }`}
                    >
                        <span className="text-2xl">🇺🇸</span>
                        <span>English</span>
                        {selectedLanguage === 'en' && <span className="text-green-400">✓</span>}
                    </button>

                    {/* Arabic Option */}
                    <button
                        onClick={() => handleLanguageSelect('ar')}
                        className={`w-full p-4 rounded-lg text-xl font-bold transition-all duration-200 flex items-center justify-center gap-3 ${
                            selectedLanguage === 'ar'
                                ? 'bg-amber-600 border-2 border-amber-400 text-white shadow-lg scale-105'
                                : 'bg-gray-700 border-2 border-gray-600 text-gray-300 hover:bg-gray-600'
                        }`}
                        dir="rtl"
                    >
                        <span className="text-2xl">🇸🇦</span>
                        <span>العربية</span>
                        {selectedLanguage === 'ar' && <span className="text-green-400">✓</span>}
                    </button>
                </div>

                <button
                    onClick={handleConfirm}
                    className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-6 rounded-lg text-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                    {Localization.get('language.confirm')} / متابعة
                </button>

                <div className="mt-6 text-sm text-gray-400">
                    You can change this later in settings
                    <br />
                    يمكنك تغيير هذا لاحقاً في الإعدادات
                </div>
            </div>
        </div>
    );
}