import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ChoreLog, Member, Chore, TrendData, ProductivityHeatmap } from '../types';
import { fadeIn } from '../utils/animations';
import { calculateTrendData, calculateProductivityHeatmap, forecastWorkload } from '../utils/advancedAnalytics';

interface AdvancedAnalyticsDashboardProps {
    logs: ChoreLog[];
    members: Member[];
    chores: Chore[];
}

export const AdvancedAnalyticsDashboard: React.FC<AdvancedAnalyticsDashboardProps> = ({
    logs,
    members,
    chores,
}) => {
    const trendData = useMemo(() => calculateTrendData(logs, members, chores, 30), [logs, members, chores]);
    const heatmapData = useMemo(() => calculateProductivityHeatmap(logs, chores), [logs, chores]);
    const forecast = useMemo(() => forecastWorkload(trendData, 7), [trendData]);

    const totalXP = logs.reduce((sum, log) => {
        const chore = chores.find(c => c.id === log.choreId);
        return sum + (chore?.xp || 0);
    }, 0);

    const avgDaily = trendData.length > 0
        ? trendData.reduce((sum, d) => sum + d.totalChores, 0) / trendData.length
        : 0;

    return (
        <motion.div
            className="advanced-analytics space-y-6"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
        >
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl p-6 border border-blue-500/30">
                    <h3 className="text-sm text-gray-400 uppercase font-bold mb-2">Total XP Earned</h3>
                    <p className="text-4xl font-black text-white">{totalXP.toLocaleString()}</p>
                </div>
                <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-6 border border-green-500/30">
                    <h3 className="text-sm text-gray-400 uppercase font-bold mb-2">Total Chores</h3>
                    <p className="text-4xl font-black text-white">{logs.length}</p>
                </div>
                <div className="bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-xl p-6 border border-orange-500/30">
                    <h3 className="text-sm text-gray-400 uppercase font-bold mb-2">Daily Average</h3>
                    <p className="text-4xl font-black text-white">{avgDaily.toFixed(1)}</p>
                </div>
            </div>

            {/* 30-Day Trend */}
            <div className="bg-gray-800/40 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-bold text-white mb-4">30-Day Activity Trend</h3>
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis
                            dataKey="date"
                            stroke="#9CA3AF"
                            tick={{ fontSize: 12 }}
                            tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        />
                        <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                            labelStyle={{ color: '#F3F4F6' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="totalChores"
                            stroke="#3B82F6"
                            strokeWidth={3}
                            dot={{ fill: '#3B82F6', r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="totalXP"
                            stroke="#8B5CF6"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Productivity Heatmap */}
            <div className="bg-gray-800/40 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-bold text-white mb-4">Productivity Heatmap</h3>
                <div className="overflow-x-auto">
                    <div className="grid grid-cols-24 gap-1 min-w-max">
                        {Array.from({ length: 7 }, (_, day) => (
                            <React.Fragment key={day}>
                                {Array.from({ length: 24 }, (_, hour) => {
                                    const cell = heatmapData.find(h => h.dayOfWeek === day && h.hour === hour);
                                    const intensity = cell ? Math.min(cell.completionCount / 5, 1) : 0;

                                    return (
                                        <div
                                            key={`${day}-${hour}`}
                                            className="w-4 h-4 rounded-sm"
                                            style={{
                                                backgroundColor: intensity > 0
                                                    ? `rgba(59, 130, 246, ${intensity})`
                                                    : '#1F2937',
                                            }}
                                            title={`${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day]} ${hour}:00 - ${cell?.completionCount || 0} chores`}
                                        />
                                    );
                                })}
                            </React.Fragment>
                        ))}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                        <span>12am</span>
                        <span>6am</span>
                        <span>12pm</span>
                        <span>6pm</span>
                        <span>11pm</span>
                    </div>
                </div>
            </div>

            {/* 7-Day Forecast */}
            <div className="bg-gray-800/40 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-bold text-white mb-4">7-Day Workload Forecast</h3>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={forecast.map((value, i) => ({ day: `Day ${i + 1}`, chores: value }))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="day" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                        <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                        />
                        <Bar dataKey="chores" radius={[8, 8, 0, 0]}>
                            {forecast.map((_, index) => (
                                <Cell key={`cell-${index}`} fill="#10B981" />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
                <p className="text-xs text-gray-500 mt-2 text-center">
                    Predicted based on 30-day trend analysis
                </p>
            </div>
        </motion.div>
    );
};
