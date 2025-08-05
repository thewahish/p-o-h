// filename: src/core/logger.js

const Logger = {
    logs: [],
    _subscribers: new Set(),
    
    // The React component will use this to listen for new logs
    subscribe(callback) {
        this._subscribers.add(callback);
        // Immediately give the new subscriber all current logs
        callback([...this.logs]); 
        return () => this._subscribers.delete(callback);
    },
    
    // Internal function to notify the UI of a new log
    _notify() {
        const freshLogs = [...this.logs];
        for (const callback of this._subscribers) {
            callback(freshLogs);
        }
    },

    /**
     * The main logging function. Can be called from anywhere in the app.
     * @param {string} message - The message to log.
     * @param {string} [source='SYSTEM'] - The source of the log (e.g., 'UI', 'STATE', 'COMBAT').
     */
    log(message, source = 'SYSTEM') {
        const timestamp = new Date().toLocaleTimeString();
        const newLog = {
            id: Date.now() + Math.random(), // Unique key for React
            timestamp,
            source,
            message,
        };

        this.logs.push(newLog);
        console.log(`[${source}] ${message}`); // Also log to the browser console
        
        // Notify the React component that there's a new log to display
        this._notify();
    },

    /**
     * A special function to capture and log uncaught errors.
     */
    initGlobalErrorHandling() {
        this.log('Initializing global error handlers.', 'LOGGER');
        window.onerror = (message, source, lineno, colno, error) => {
            this.log(`[UNCAUGHT ERROR] ${message} at ${source}:${lineno}:${colno}`, 'ERROR');
            return true;
        };
        window.onunhandledrejection = (event) => {
            this.log(`[UNHANDLED PROMISE] ${event.reason}`, 'ERROR');
        };
    }
};

export default Logger;