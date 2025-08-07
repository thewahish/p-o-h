// filename: src/components/persistent-debugger.jsx

import React, { useState, useEffect } from 'react';
import Logger from '../core/logger';

const sourceColors = {
    'SYSTEM': 'text-common', 'STATE': 'text-epic', 'UI': 'text-mana-light',
    'INPUT': 'text-rare', 'COMBAT': 'text-health-mid', 'LOGGER': 'text-legendary',
    'ERROR': 'text-health-full font-bold',
};

export default function PersistentDebugger() {
    const [logs, setLogs] = useState([]);
    // --- FIX: Default state is now false (hidden) ---
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const unsubscribe = Logger.subscribe(newLogs => {
            setLogs(newLogs);
        });
        return unsubscribe;
    }, []);

    if (!isVisible) {
        return (
            <button
                onClick={() => setIsVisible(true)}
                className="fixed top-4 right-4 bg-rpg-bg-darker hover:bg-rpg-secondary text-rpg-text w-8 h-8 rounded-full shadow-lg z-[9999] flex items-center justify-center text-lg"
                title="Show Debugger"
            >
                🐛
            </button>
        );
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 h-1/3 bg-rpg-bg-darkest/80 backdrop-blur-sm border-t-2 border-rpg-primary z-[9999] flex flex-col text-sm font-mono">
            <div className="flex justify-between items-center bg-rpg-bg-darker p-2 border-b border-rpg-secondary">
                <h3 className="font-bold text-rpg-primary">Persistent Debugger</h3>
                <button onClick={() => setIsVisible(false)} className="bg-health-full hover:bg-health-mid text-rpg-text px-2 py-1 rounded">
                    Hide
                </button>
            </div>
            <ul className="flex-grow overflow-y-auto p-2">
                {logs.map(log => (
                    <li key={log.id} className="border-b border-rpg-secondary py-1">
                        <span className="text-rpg-text opacity-60">{log.timestamp}</span>
                        <span className={`ml-2 font-semibold ${sourceColors[log.source] || 'text-rpg-text'}`}>
                            [{log.source}]
                        </span>
                        <span className="ml-2 text-rpg-text opacity-90">{log.message}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}