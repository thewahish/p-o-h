// filename: src/components/persistent-debugger.jsx

import React, { useState, useEffect } from 'react';
import Logger from '../core/logger';

const sourceColors = {
    'SYSTEM': 'text-gray-400', 'STATE': 'text-purple-400', 'UI': 'text-cyan-400',
    'INPUT': 'text-blue-400', 'COMBAT': 'text-red-400', 'LOGGER': 'text-yellow-400',
    'ERROR': 'text-red-500 font-bold',
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
                className="fixed top-4 right-4 bg-gray-800 hover:bg-gray-700 text-white w-8 h-8 rounded-full shadow-lg z-[9999] flex items-center justify-center text-lg"
                title="Show Debugger"
            >
                🐛
            </button>
        );
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 h-1/3 bg-gray-900/80 backdrop-blur-sm border-t-2 border-amber-500 z-[9999] flex flex-col text-sm font-mono">
            <div className="flex justify-between items-center bg-gray-800 p-2 border-b border-gray-700">
                <h3 className="font-bold text-amber-500">Persistent Debugger</h3>
                <button onClick={() => setIsVisible(false)} className="bg-red-600 hover:bg-red-500 text-white px-2 py-1 rounded">
                    Hide
                </button>
            </div>
            <ul className="flex-grow overflow-y-auto p-2">
                {logs.map(log => (
                    <li key={log.id} className="border-b border-gray-800 py-1">
                        <span className="text-gray-500">{log.timestamp}</span>
                        <span className={`ml-2 font-semibold ${sourceColors[log.source] || 'text-white'}`}>
                            [{log.source}]
                        </span>
                        <span className="ml-2 text-gray-200">{log.message}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}