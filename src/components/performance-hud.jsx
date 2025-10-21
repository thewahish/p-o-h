// filename: src/components/performance-hud.jsx

import React, { useState, useEffect } from 'react';
import { PerformanceMonitor } from '../utils/performance-monitor.js';

/**
 * Performance HUD - Shows FPS and performance metrics in corner
 * Toggle with P key or click to hide/show
 */
export default function PerformanceHUD() {
  const [visible, setVisible] = useState(false);
  const [metrics, setMetrics] = useState(PerformanceMonitor.getReport());
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    // Update metrics every second
    const interval = setInterval(() => {
      setMetrics(PerformanceMonitor.getReport());
    }, 1000);

    // Toggle with 'P' key
    const handleKeyPress = (e) => {
      if (e.key === 'p' || e.key === 'P') {
        setVisible(prev => !prev);
      }
    };

    window.addEventListener('keypress', handleKeyPress);

    return () => {
      clearInterval(interval);
      window.removeEventListener('keypress', handleKeyPress);
    };
  }, []);

  if (!visible) {
    return (
      <button
        onClick={() => setVisible(true)}
        className="fixed bottom-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-xs hover:bg-black/70 transition-all z-50"
        title="Show Performance HUD (Press P)"
      >
        📊 FPS
      </button>
    );
  }

  const grade = PerformanceMonitor.getPerformanceGrade();
  const gradeColors = {
    A: 'text-green-400',
    B: 'text-blue-400',
    C: 'text-yellow-400',
    D: 'text-orange-400',
    F: 'text-red-400'
  };

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-3 rounded-lg text-xs font-mono z-50 border border-white/20 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">📊</span>
          <span className="font-bold">Performance</span>
          <span className={`font-bold ${gradeColors[grade]}`}>[{grade}]</span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setExpanded(!expanded)}
            className="hover:text-blue-400 transition-colors"
            title="Toggle details"
          >
            {expanded ? '▼' : '▶'}
          </button>
          <button
            onClick={() => setVisible(false)}
            className="hover:text-red-400 transition-colors ml-1"
            title="Hide (Press P)"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Compact View */}
      <div className="space-y-1">
        <div className="flex justify-between gap-4">
          <span>FPS:</span>
          <span className={metrics.fps >= 30 ? 'text-green-400' : 'text-red-400'}>
            {metrics.fps}
          </span>
        </div>

        {expanded && (
          <>
            <div className="flex justify-between gap-4">
              <span>Avg FPS:</span>
              <span className={metrics.avgFps >= 30 ? 'text-green-400' : 'text-yellow-400'}>
                {metrics.avgFps}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span>Memory:</span>
              <span className={metrics.memoryMB < 100 ? 'text-green-400' : 'text-yellow-400'}>
                {metrics.memoryMB}MB
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span>Battles:</span>
              <span className="text-blue-400">{metrics.totalBattles}</span>
            </div>

            {metrics.totalBattles > 0 && (
              <>
                <div className="flex justify-between gap-4">
                  <span>Avg Battle:</span>
                  <span className={metrics.avgBattleDuration < 45 ? 'text-green-400' : 'text-yellow-400'}>
                    {metrics.avgBattleDuration}s
                  </span>
                </div>

                {metrics.slowBattles > 0 && (
                  <div className="flex justify-between gap-4">
                    <span>Slow Battles:</span>
                    <span className="text-orange-400">{metrics.slowBattles}</span>
                  </div>
                )}
              </>
            )}

            <div className="flex justify-between gap-4">
              <span>Uptime:</span>
              <span className="text-gray-400">{metrics.uptime}</span>
            </div>

            <div className="flex justify-between gap-4">
              <span>Frames:</span>
              <span className="text-gray-400">{metrics.totalFrames.toLocaleString()}</span>
            </div>
          </>
        )}
      </div>

      {/* Quick tips */}
      {expanded && (
        <div className="mt-2 pt-2 border-t border-white/20 text-[10px] opacity-70">
          <div>Press <span className="text-blue-400">P</span> to toggle</div>
          <div>FPS &lt; 30 = Performance issue</div>
          <div>Memory &gt; 100MB = High usage</div>
        </div>
      )}
    </div>
  );
}
