// filename: src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import Logger from './core/logger.js';

// Initialize the global logger and error handler BEFORE React starts.
Logger.initGlobalErrorHandling();
Logger.log('main.jsx: Script start.', 'SYSTEM');

try {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
  Logger.log('main.jsx: React app mount initiated.', 'SYSTEM');
} catch (error) {
  Logger.log(`[FATAL] React failed to render: ${error.message}`, 'ERROR');
  console.error("Fatal error during React rendering:", error);
}