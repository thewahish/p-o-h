import React, { useState } from "react";

export default function DebugPanel({ title = "Game State", data = {} }) {
  const [isOpen, setIsOpen] = useState(false);

  const copyLogs = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    alert("Logs copied to clipboard!");
  };

  return (
    <>
      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 left-4 bg-amber-600 hover:bg-amber-500 text-black font-bold py-2 px-4 rounded-lg shadow-lg z-50"
        >
          Show Debugger
        </button>
      )}

      {/* Panel */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 w-96 max-h-[500px] flex flex-col bg-gray-900 border border-amber-500 rounded-lg shadow-lg text-white">
          <div className="flex items-center justify-between bg-amber-600 text-black px-3 py-2 rounded-t-lg">
            <span className="font-bold">{title}</span>
            <div className="flex space-x-2">
              <button
                onClick={copyLogs}
                className="bg-yellow-400 hover:bg-yellow-300 text-black px-2 py-1 rounded text-xs font-semibold"
              >
                Copy Logs
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="bg-red-500 hover:bg-red-400 text-white px-2 py-1 rounded text-xs font-bold"
              >
                ×
              </button>
            </div>
          </div>

          <pre className="p-2 text-xs font-mono bg-gray-800 overflow-y-auto max-h-[150px] border-b border-gray-700">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </>
  );
}
