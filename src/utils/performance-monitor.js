// filename: src/utils/performance-monitor.js

import Logger from '../core/logger.js';

/**
 * Performance Monitor - Track FPS, memory, and battle performance
 * Lightweight monitoring system for game optimization
 */
export const PerformanceMonitor = {
  metrics: {
    fps: 0,
    avgFps: 0,
    memoryUsage: 0,
    battleDurations: [],
    avgBattleDuration: 0,
    slowBattles: 0,
    totalFrames: 0,
    startTime: Date.now()
  },

  battleStartTime: null,
  fpsFrameCount: 0,
  fpsLastTime: performance.now(),
  fpsValues: [],
  isMonitoring: false,
  rafId: null,

  /**
   * Initialize performance monitoring
   */
  initialize() {
    if (this.isMonitoring) return;

    this.metrics.startTime = Date.now();
    this.isMonitoring = true;

    // Start FPS monitoring
    this.measureFPS();

    // Monitor memory if available
    if (performance.memory) {
      setInterval(() => {
        this.updateMemoryUsage();
      }, 5000); // Update every 5 seconds
    }

    Logger.log('Performance monitoring initialized', 'SYSTEM');
  },

  /**
   * Measure FPS using requestAnimationFrame
   */
  measureFPS() {
    const measure = (currentTime) => {
      this.fpsFrameCount++;
      this.metrics.totalFrames++;

      const deltaTime = currentTime - this.fpsLastTime;

      // Calculate FPS every second
      if (deltaTime >= 1000) {
        this.metrics.fps = Math.round((this.fpsFrameCount * 1000) / deltaTime);

        // Track for average
        this.fpsValues.push(this.metrics.fps);
        if (this.fpsValues.length > 60) { // Keep last 60 seconds
          this.fpsValues.shift();
        }

        // Calculate average FPS
        this.metrics.avgFps = Math.round(
          this.fpsValues.reduce((a, b) => a + b, 0) / this.fpsValues.length
        );

        // Warn if FPS is low
        if (this.metrics.fps < 30) {
          Logger.log(`Low FPS detected: ${this.metrics.fps}`, 'SYSTEM');
        }

        this.fpsFrameCount = 0;
        this.fpsLastTime = currentTime;
      }

      if (this.isMonitoring) {
        this.rafId = requestAnimationFrame(measure);
      }
    };

    this.rafId = requestAnimationFrame(measure);
  },

  /**
   * Update memory usage metrics
   */
  updateMemoryUsage() {
    if (!performance.memory) return;

    const memoryMB = performance.memory.usedJSHeapSize / (1024 * 1024);
    this.metrics.memoryUsage = Math.round(memoryMB);

    // Warn if memory is high (> 100MB)
    if (memoryMB > 100) {
      Logger.log(`High memory usage: ${this.metrics.memoryUsage}MB`, 'SYSTEM');
    }
  },

  /**
   * Start tracking a battle
   */
  startBattleTimer() {
    this.battleStartTime = performance.now();
    Logger.log('Battle timer started', 'SYSTEM');
  },

  /**
   * End battle tracking and record duration
   */
  endBattleTimer() {
    if (!this.battleStartTime) return;

    const duration = performance.now() - this.battleStartTime;
    const durationSeconds = Math.round(duration / 1000);

    this.metrics.battleDurations.push(durationSeconds);

    // Keep last 100 battles
    if (this.metrics.battleDurations.length > 100) {
      this.metrics.battleDurations.shift();
    }

    // Calculate average
    const sum = this.metrics.battleDurations.reduce((a, b) => a + b, 0);
    this.metrics.avgBattleDuration = Math.round(sum / this.metrics.battleDurations.length);

    // Track slow battles (> 60 seconds)
    if (durationSeconds > 60) {
      this.metrics.slowBattles++;
      Logger.log(`Long battle detected: ${durationSeconds}s`, 'SYSTEM');
    }

    Logger.log(`Battle duration: ${durationSeconds}s`, 'SYSTEM');
    this.battleStartTime = null;

    return durationSeconds;
  },

  /**
   * Get current performance report
   */
  getReport() {
    const uptime = Math.round((Date.now() - this.metrics.startTime) / 1000);
    const uptimeMinutes = Math.floor(uptime / 60);
    const uptimeSeconds = uptime % 60;

    return {
      fps: this.metrics.fps,
      avgFps: this.metrics.avgFps,
      memoryMB: this.metrics.memoryUsage,
      avgBattleDuration: this.metrics.avgBattleDuration,
      totalBattles: this.metrics.battleDurations.length,
      slowBattles: this.metrics.slowBattles,
      totalFrames: this.metrics.totalFrames,
      uptime: `${uptimeMinutes}m ${uptimeSeconds}s`,
      uptimeSeconds: uptime
    };
  },

  /**
   * Get detailed metrics
   */
  getDetailedMetrics() {
    return {
      ...this.metrics,
      report: this.getReport()
    };
  },

  /**
   * Check if performance is good
   */
  isPerformanceGood() {
    return {
      fps: this.metrics.fps >= 30,
      memory: this.metrics.memoryUsage < 100,
      battles: this.metrics.avgBattleDuration < 45,
      overall: this.metrics.fps >= 30 && this.metrics.memoryUsage < 100
    };
  },

  /**
   * Get performance grade (A-F)
   */
  getPerformanceGrade() {
    const fps = this.metrics.fps;
    const avgFps = this.metrics.avgFps;

    if (avgFps >= 55) return 'A';
    if (avgFps >= 45) return 'B';
    if (avgFps >= 35) return 'C';
    if (avgFps >= 25) return 'D';
    return 'F';
  },

  /**
   * Log performance summary to console
   */
  logSummary() {
    const report = this.getReport();
    console.log('=== PERFORMANCE SUMMARY ===');
    console.log(`FPS: ${report.fps} (Avg: ${report.avgFps})`);
    console.log(`Memory: ${report.memoryMB}MB`);
    console.log(`Battles: ${report.totalBattles} (Avg: ${report.avgBattleDuration}s)`);
    console.log(`Slow Battles: ${report.slowBattles}`);
    console.log(`Uptime: ${report.uptime}`);
    console.log(`Grade: ${this.getPerformanceGrade()}`);
    console.log('========================');
  },

  /**
   * Reset all metrics
   */
  reset() {
    this.metrics = {
      fps: 0,
      avgFps: 0,
      memoryUsage: 0,
      battleDurations: [],
      avgBattleDuration: 0,
      slowBattles: 0,
      totalFrames: 0,
      startTime: Date.now()
    };
    this.fpsValues = [];
    Logger.log('Performance metrics reset', 'SYSTEM');
  },

  /**
   * Stop monitoring
   */
  stop() {
    this.isMonitoring = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    Logger.log('Performance monitoring stopped', 'SYSTEM');
  }
};

// Auto-initialize on load
if (typeof window !== 'undefined') {
  PerformanceMonitor.initialize();
}
