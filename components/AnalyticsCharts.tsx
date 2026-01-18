import React from 'react';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { AnalyticsMetrics } from '../types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface AnalyticsChartsProps {
    metrics: AnalyticsMetrics;
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ metrics }) => {
    // Colors for charts
    const COLORS = ['#a855f7', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

    // Trend indicator
    const TrendIndicator: React.FC<{ value: number }> = ({ value }) => {
        if (value > 5) {
            return (
                <div className="flex items-center gap-1 text-green-400">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-bold">+{value.toFixed(1)}%</span>
                </div>
            );
        } else if (value < -5) {
            return (
                <div className="flex items-center gap-1 text-red-400">
                    <TrendingDown className="w-4 h-4" />
                    <span className="text-sm font-bold">{value.toFixed(1)}%</span>
                </div>
            );
        } else {
            return (
                <div className="flex items-center gap-1 text-gray-400">
                    <Minus className="w-4 h-4" />
                    <span className="text-sm font-bold">~{value.toFixed(1)}%</span>
                </div>
            );
        }
    };

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gray-900/60 border border-gray-700 rounded-xl p-4">
                    <div className="text-sm text-gray-400 mb-1">Total Tasks</div>
                    <div className="flex items-end justify-between">
                        <div className="text-3xl font-black text-white">{metrics.metrics.totalTasks}</div>
                        <TrendIndicator value={metrics.trends.tasksChange} />
                    </div>
                </div>

                <div className="bg-gray-900/60 border border-gray-700 rounded-xl p-4">
                    <div className="text-sm text-gray-400 mb-1">Total XP</div>
                    <div className="flex items-end justify-between">
                        <div className="text-3xl font-black text-purple-400">{metrics.metrics.totalXP.toLocaleString()}</div>
                        <TrendIndicator value={metrics.trends.xpChange} />
                    </div>
                </div>

                <div className="bg-gray-900/60 border border-gray-700 rounded-xl p-4">
                    <div className="text-sm text-gray-400 mb-1">Total Hours</div>
                    <div className="text-3xl font-black text-blue-400">{metrics.metrics.totalHours}</div>
                </div>

                <div className="bg-gray-900/60 border border-gray-700 rounded-xl p-4">
                    <div className="text-sm text-gray-400 mb-1">Avg/Day</div>
                    <div className="text-3xl font-black text-green-400">{metrics.metrics.avgTasksPerDay}</div>
                </div>
            </div>

            {/* Completion Trend - Line Chart */}
            <div className="bg-gray-900/60 border border-gray-700 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Completion Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={metrics.metrics.completionTrend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="date" stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
                        <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1f2937',
                                border: '1px solid #374151',
                                borderRadius: '8px',
                                color: '#fff'
                            }}
                        />
                        <Legend wrapperStyle={{ color: '#9ca3af' }} />
                        <Line
                            type="monotone"
                            dataKey="count"
                            stroke="#a855f7"
                            strokeWidth={3}
                            name="Tasks"
                            dot={{ fill: '#a855f7', r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="xp"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            name="XP"
                            dot={{ fill: '#3b82f6', r: 3 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Category Breakdown & Member Efficiency */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Category Breakdown - Pie Chart */}
                <div className="bg-gray-900/60 border border-gray-700 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Category Breakdown</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={metrics.metrics.categoryBreakdown}
                                dataKey="count"
                                nameKey="category"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                label={(entry) => `${entry.category}: ${entry.count}`}
                                labelLine={false}
                            >
                                {metrics.metrics.categoryBreakdown.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1f2937',
                                    border: '1px solid #374151',
                                    borderRadius: '8px'
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Member Efficiency - Bar Chart */}
                <div className="bg-gray-900/60 border border-gray-700 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Member Task Count</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={metrics.metrics.memberEfficiency}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="name" stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
                            <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1f2937',
                                    border: '1px solid #374151',
                                    borderRadius: '8px'
                                }}
                            />
                            <Bar dataKey="taskCount" fill="#a855f7" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Peak Hours & Busy Days */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Peak Hours - Bar Chart */}
                <div className="bg-gray-900/60 border border-gray-700 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Peak Hours</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={metrics.metrics.peakHours.slice(0, 8)}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis
                                dataKey="hour"
                                stroke="#9ca3af"
                                tick={{ fill: '#9ca3af' }}
                                tickFormatter={(value) => `${value}:00`}
                            />
                            <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1f2937',
                                    border: '1px solid #374151',
                                    borderRadius: '8px'
                                }}
                                labelFormatter={(value) => `${value}:00`}
                            />
                            <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Busy Days - Bar Chart */}
                <div className="bg-gray-900/60 border border-gray-700 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Busiest Days</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={metrics.metrics.busyDays}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis
                                dataKey="day"
                                stroke="#9ca3af"
                                tick={{ fill: '#9ca3af' }}
                                angle={-45}
                                textAnchor="end"
                                height={80}
                            />
                            <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1f2937',
                                    border: '1px solid #374151',
                                    borderRadius: '8px'
                                }}
                            />
                            <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Category Details Table */}
            <div className="bg-gray-900/60 border border-gray-700 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Category Details</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-700">
                                <th className="py-3 px-4 text-gray-400 font-semibold">Category</th>
                                <th className="py-3 px-4 text-gray-400 font-semibold text-right">Tasks</th>
                                <th className="py-3 px-4 text-gray-400 font-semibold text-right">XP</th>
                                <th className="py-3 px-4 text-gray-400 font-semibold text-right">Hours</th>
                            </tr>
                        </thead>
                        <tbody>
                            {metrics.metrics.categoryBreakdown.map((cat, idx) => (
                                <tr key={cat.category} className="border-b border-gray-800 hover:bg-gray-800/50">
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                                            />
                                            <span className="text-white font-medium">{cat.category}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-right text-white font-bold">{cat.count}</td>
                                    <td className="py-3 px-4 text-right text-purple-400 font-bold">{cat.xp}</td>
                                    <td className="py-3 px-4 text-right text-blue-400 font-bold">
                                        {cat.hours.toFixed(1)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
