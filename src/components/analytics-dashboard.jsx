// filename: src/components/analytics-dashboard.jsx

import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, PieChart, Pie, LineChart, Line,
  XAxis, YAxis, Tooltip, Legend, Cell, ResponsiveContainer
} from 'recharts';
import { AnalyticsSystem } from '../systems/analytics.js';
import { GameState } from '../core/state.js';
import { t } from '../core/localization.js';
import { SaveExporter } from '../utils/save-exporter.js';

export default function AnalyticsDashboard() {
  const [chartData, setChartData] = useState(AnalyticsSystem.getChartData());
  const [summary, setSummary] = useState(AnalyticsSystem.getSummary());
  const [activeTab, setActiveTab] = useState('overview');

  // Refresh data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setChartData(AnalyticsSystem.getChartData());
      setSummary(AnalyticsSystem.getSummary());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleBack = () => {
    GameState.update('currentScreen', 'main-menu');
  };

  // Color palette matching game theme
  const COLORS = {
    primary: '#d4a656',
    secondary: '#5c4423',
    success: '#27ae60',
    danger: '#e74c3c',
    info: '#3498db',
    warning: '#f39c12'
  };

  const CHARACTER_COLORS = {
    Omar: '#e74c3c',
    Salma: '#3498db',
    Shadi: '#27ae60'
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1a0f0a] border border-[#d4a656] p-3 rounded-lg shadow-lg">
          <p className="text-[#f8e4c0] font-semibold mb-1">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-radial from-[#1a0f0a] via-[#0d0604] to-black text-[#f8e4c0] p-4 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-[#d4a656] flex items-center gap-2">
          📊 Player Analytics
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => SaveExporter.exportAnalyticsToExcel()}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-[#f8e4c0] rounded-lg border border-[#d4a656]/30 transition-all"
            title="Export all analytics to Excel"
          >
            📊 Export
          </button>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-[#5c4423] hover:bg-[#7d5f36] text-[#f8e4c0] rounded-lg border border-[#d4a656]/30 transition-all"
          >
            ← Back
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {['overview', 'characters', 'history'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === tab
                ? 'bg-[#d4a656] text-[#1a0f0a]'
                : 'bg-[#5c4423]/50 text-[#f8e4c0] hover:bg-[#5c4423]'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              icon="⚔️"
              label="Total Battles"
              value={summary.totalBattles}
              color={COLORS.primary}
            />
            <StatCard
              icon="🏆"
              label="Win Rate"
              value={`${summary.winRate}%`}
              color={COLORS.success}
            />
            <StatCard
              icon="🏔️"
              label="Highest Floor"
              value={summary.highestFloor}
              color={COLORS.info}
            />
            <StatCard
              icon="💰"
              label="Gold Earned"
              value={summary.totalGoldEarned.toLocaleString()}
              color={COLORS.warning}
            />
            <StatCard
              icon="💥"
              label="Total Damage"
              value={summary.totalDamageDealt.toLocaleString()}
              color={COLORS.danger}
            />
            <StatCard
              icon="🛡️"
              label="Damage Taken"
              value={summary.totalDamageTaken.toLocaleString()}
              color={COLORS.info}
            />
            <StatCard
              icon="⏱️"
              label="Playtime"
              value={`${summary.playtimeMinutes}m`}
              color={COLORS.secondary}
            />
            <StatCard
              icon="💀"
              label="Deaths"
              value={summary.totalDeaths}
              color={COLORS.danger}
            />
          </div>

          {/* Win/Loss Pie Chart */}
          {summary.totalBattles > 0 && (
            <div className="bg-[#5c4423]/30 p-6 rounded-lg border border-[#d4a656]/30">
              <h2 className="text-xl font-bold text-[#d4a656] mb-4">Combat Results</h2>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={chartData.winLoss}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {chartData.winLoss.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
              <div className="text-center mt-4">
                <div className="text-sm opacity-70">Average Damage per Battle</div>
                <div className="text-2xl font-bold text-[#d4a656]">
                  {summary.avgDamagePerBattle}
                </div>
              </div>
            </div>
          )}

          {/* Recent Performance */}
          {chartData.recentBattles.length > 0 && (
            <div className="bg-[#5c4423]/30 p-6 rounded-lg border border-[#d4a656]/30">
              <h2 className="text-xl font-bold text-[#d4a656] mb-4">Recent Battle Performance</h2>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData.recentBattles}>
                  <XAxis dataKey="battle" stroke="#f8e4c0" />
                  <YAxis stroke="#f8e4c0" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="damage"
                    stroke={COLORS.danger}
                    strokeWidth={2}
                    name="Damage Dealt"
                  />
                  <Line
                    type="monotone"
                    dataKey="gold"
                    stroke={COLORS.warning}
                    strokeWidth={2}
                    name="Gold Earned"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* Characters Tab */}
      {activeTab === 'characters' && (
        <div className="space-y-6">
          {/* Character Stats Comparison */}
          <div className="bg-[#5c4423]/30 p-6 rounded-lg border border-[#d4a656]/30">
            <h2 className="text-xl font-bold text-[#d4a656] mb-4">Character Comparison</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.characterComparison}>
                <XAxis dataKey="character" stroke="#f8e4c0" />
                <YAxis stroke="#f8e4c0" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="battles" fill={COLORS.primary} name="Total Battles" />
                <Bar dataKey="wins" fill={COLORS.success} name="Wins" />
                <Bar dataKey="maxFloor" fill={COLORS.info} name="Max Floor" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Individual Character Stats */}
          <div className="grid gap-4">
            {chartData.characterComparison.map((char, index) => (
              <div
                key={char.character}
                className="bg-[#5c4423]/30 p-4 rounded-lg border-l-4"
                style={{ borderColor: Object.values(CHARACTER_COLORS)[index] }}
              >
                <h3 className="text-xl font-bold mb-3" style={{ color: Object.values(CHARACTER_COLORS)[index] }}>
                  {char.character}
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="opacity-70">Battles</div>
                    <div className="text-lg font-bold">{char.battles}</div>
                  </div>
                  <div>
                    <div className="opacity-70">Win Rate</div>
                    <div className="text-lg font-bold">{char.winRate.toFixed(1)}%</div>
                  </div>
                  <div>
                    <div className="opacity-70">Max Floor</div>
                    <div className="text-lg font-bold">{char.maxFloor}</div>
                  </div>
                  <div>
                    <div className="opacity-70">Total Damage</div>
                    <div className="text-lg font-bold">{char.damageDealt.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="opacity-70">Gold Earned</div>
                    <div className="text-lg font-bold">{char.goldEarned.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="opacity-70">Avg Damage/Battle</div>
                    <div className="text-lg font-bold">
                      {char.battles > 0 ? Math.round(char.damageDealt / char.battles) : 0}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          {/* Floor Progression Chart */}
          {chartData.floorProgression.length > 0 && (
            <div className="bg-[#5c4423]/30 p-6 rounded-lg border border-[#d4a656]/30">
              <h2 className="text-xl font-bold text-[#d4a656] mb-4">Floor Progression History</h2>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData.floorProgression}>
                  <XAxis dataKey="run" stroke="#f8e4c0" />
                  <YAxis stroke="#f8e4c0" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="floor"
                    stroke={COLORS.primary}
                    strokeWidth={2}
                    name="Floor Reached"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Recent Battles List */}
          <div className="bg-[#5c4423]/30 p-6 rounded-lg border border-[#d4a656]/30">
            <h2 className="text-xl font-bold text-[#d4a656] mb-4">Recent Battles</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {AnalyticsSystem.stats.battleHistory.slice(0, 20).map((battle, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border-l-4 ${
                    battle.victory ? 'bg-green-900/20 border-green-500' : 'bg-red-900/20 border-red-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold">{battle.character}</span>
                      <span className="mx-2">•</span>
                      <span>Floor {battle.floor}</span>
                      <span className="mx-2">•</span>
                      <span className={battle.victory ? 'text-green-400' : 'text-red-400'}>
                        {battle.victory ? '🏆 Victory' : '💀 Defeat'}
                      </span>
                    </div>
                    <div className="text-right text-sm opacity-70">
                      <div>💥 {battle.damageDealt} dmg</div>
                      <div>💰 {battle.goldGained} gold</div>
                    </div>
                  </div>
                </div>
              ))}
              {AnalyticsSystem.stats.battleHistory.length === 0 && (
                <div className="text-center py-8 opacity-50">
                  No battles recorded yet. Start playing to see your history!
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {summary.totalBattles === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-2xl font-bold text-[#d4a656] mb-2">No Data Yet</h2>
          <p className="text-[#f8e4c0]/70">
            Start playing to see your statistics and progress!
          </p>
        </div>
      )}
    </div>
  );
}

// Stat Card Component
function StatCard({ icon, label, value, color }) {
  return (
    <div
      className="bg-[#5c4423]/30 p-4 rounded-lg border border-[#d4a656]/30 hover:border-[#d4a656] transition-all"
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-2xl">{icon}</span>
        <div className="text-sm opacity-70">{label}</div>
      </div>
      <div className="text-2xl font-bold" style={{ color }}>
        {value}
      </div>
    </div>
  );
}
