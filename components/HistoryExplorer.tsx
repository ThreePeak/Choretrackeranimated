import React, { useState } from 'react';
import { ChoreLog, Chore, Member } from '../types';
import { Calendar as CalendarIcon, Download, Filter } from 'lucide-react';
import { formatDate } from '../utils';

interface HistoryExplorerProps {
    logs: ChoreLog[];
    chores: Chore[];
    members: Member[];
}

export const HistoryExplorer: React.FC<HistoryExplorerProps> = ({
    logs,
    chores,
    members
}) => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [filterMember, setFilterMember] = useState<string>('all');
    const [filterCategory, setFilterCategory] = useState<string>('all');

    // Filter logs
    const filteredLogs = logs.filter(log => {
        const logDate = new Date(log.timestamp).toISOString().split('T')[0];
        const matchesDate = !selectedDate || logDate === selectedDate;
        const matchesMember = filterMember === 'all' || log.memberId === filterMember;

        if (!matchesDate || !matchesMember) return false;

        if (filterCategory !== 'all') {
            const chore = chores.find(c => c.id === log.choreId);
            return chore?.category === filterCategory;
        }

        return true;
    });

    // Export to CSV
    const exportToCSV = () => {
        const csvData = filteredLogs.map(log => {
            const member = members.find(m => m.id === log.memberId);
            const chore = chores.find(c => c.id === log.choreId);
            return {
                date: formatDate(log.timestamp),
                member: member?.name || 'Unknown',
                chore: chore?.name || 'Unknown',
                category: chore?.category || 'General',
                xp: chore?.xp || 0,
                manual: log.isManual ? 'Yes' : 'No'
            };
        });

        const headers = ['Date', 'Member', 'Chore', 'Category', 'XP', 'Manual Entry'];
        const csvContent = [
            headers.join(','),
            ...csvData.map(row => [
                row.date,
                row.member,
                `"${row.chore}"`,
                row.category,
                row.xp,
                row.manual
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chore-history-${selectedDate || 'all'}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const categories = Array.from(new Set(chores.map(c => c.category || 'General')));

    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center bg-gray-800/40 p-4 rounded-xl border border-gray-700">
                <div className="flex items-center gap-2">
                    <CalendarIcon size={16} className="text-gray-400" />
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="bg-gray-700 text-white px-3 py-1.5 rounded-lg border border-gray-600 text-sm"
                    />
                </div>

                <select
                    value={filterMember}
                    onChange={(e) => setFilterMember(e.target.value)}
                    className="bg-gray-700 text-white px-3 py-1.5 rounded-lg border border-gray-600 text-sm"
                >
                    <option value="all">All Members</option>
                    {members.map(m => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                </select>

                <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="bg-gray-700 text-white px-3 py-1.5 rounded-lg border border-gray-600 text-sm"
                >
                    <option value="all">All Categories</option>
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>

                <button
                    onClick={exportToCSV}
                    className="ml-auto px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 border border-green-500/30 text-sm flex items-center gap-2"
                >
                    <Download size={14} /> Export CSV
                </button>
            </div>

            {/* Results */}
            <div className="space-y-2">
                <div className="text-sm text-gray-400 mb-2">
                    Showing {filteredLogs.length} {filteredLogs.length === 1 ? 'entry' : 'entries'}
                </div>

                {filteredLogs.map(log => {
                    const member = members.find(m => m.id === log.memberId);
                    const chore = chores.find(c => c.id === log.choreId);

                    return (
                        <div
                            key={log.id}
                            className="flex items-center justify-between p-3 bg-gray-800/40 rounded-lg border border-gray-700 hover:bg-gray-800 transition-colors"
                        >
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    {member?.avatar && <span className="text-lg">{member.avatar}</span>}
                                    <span className="font-medium text-white">{member?.name}</span>
                                    <span className="text-gray-500">→</span>
                                    <span className="text-blue-400">{chore?.name}</span>
                                    {log.isManual && (
                                        <span className="text-[10px] px-1.5 py-0.5 bg-purple-500/20 text-purple-300 rounded">
                                            MANUAL
                                        </span>
                                    )}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    {chore?.category && <span className="mr-2">{chore.category}</span>}
                                    {formatDate(log.timestamp)}
                                </div>
                            </div>
                            <div className="text-sm font-medium text-yellow-400">
                                +{chore?.xp || 0} XP
                            </div>
                        </div>
                    );
                })}

                {filteredLogs.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        <Filter size={32} className="mx-auto mb-2 opacity-50" />
                        <div className="text-sm">No entries found for selected filters</div>
                    </div>
                )}
            </div>
        </div>
    );
};
