import React from 'react';
import { DistributionItem, ChoreLog } from '../types';
import { getTimestamp } from '../utils';
import { motion } from 'framer-motion';

interface DistributionBarProps {
  data: DistributionItem[];
  total: number;
}

export const DistributionBar: React.FC<DistributionBarProps> = ({ data, total }) => {
  if (total === 0) return <div className="text-gray-400 text-sm italic">No data yet</div>;
  return (
    <div className="w-full h-3 flex rounded-full overflow-hidden my-2 bg-gray-700">
      {data.map((item, idx) => {
        const width = (item.value / total) * 100;
        if (width === 0) return null;
        return (
          <motion.div 
            key={item.id || idx} 
            initial={{ width: 0 }}
            animate={{ width: `${width}%` }}
            transition={{ duration: 1, type: "spring", bounce: 0.2 }}
            style={{ backgroundColor: item.color }}
            className="h-full"
            title={`${item.label}: ${Math.round(width)}%`}
          />
        );
      })}
    </div>
  );
};

interface MiniContributionBarProps {
    value: number;
    total: number;
    color: string;
}

export const MiniContributionBar: React.FC<MiniContributionBarProps> = ({ value, total, color }) => {
    const percentage = total > 0 ? (value / total) * 100 : 0;
    return (
        <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden mt-1">
            <motion.div 
                className="h-full rounded-full"
                style={{ backgroundColor: color }}
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.8, type: "spring" }}
            />
        </div>
    );
};

interface DonutChartProps {
  data: DistributionItem[];
  total: number;
  size?: number;
}

export const DonutChart: React.FC<DonutChartProps> = ({ data, total, size = 140 }) => {
  if (total === 0) return (
    <div style={{ width: size, height: size }} className="rounded-full border-4 border-gray-700 flex items-center justify-center text-xs text-gray-500">
        No Data
    </div>
  );
  
  let gradientString = "";
  let currentDeg = 0;
  data.forEach((item, idx) => {
    const deg = (item.value / total) * 360;
    gradientString += `${item.color} ${currentDeg}deg ${currentDeg + deg}deg${idx === data.length - 1 ? '' : ', '}`;
    currentDeg += deg;
  });

  return (
    <motion.div 
        initial={{ opacity: 0, scale: 0.8, rotate: -90 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="relative flex items-center justify-center group" 
        style={{ width: size, height: size }}
    >
       <div 
         className="absolute inset-0 rounded-full"
         style={{ background: `conic-gradient(${gradientString})` }}
       ></div>
       <div className="absolute inset-2 bg-gray-900 rounded-full flex flex-col items-center justify-center z-10 border border-gray-800 shadow-inner">
            <motion.span 
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold text-white group-hover:scale-110 transition-transform"
            >
                {total}
            </motion.span>
            <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">Tasks</span>
       </div>
    </motion.div>
  );
};

interface WeeklyActivityGraphProps {
  logs: ChoreLog[];
}

export const WeeklyActivityGraph: React.FC<WeeklyActivityGraphProps> = ({ logs }) => {
    const days = [];
    const normalizeDate = (d: Date) => {
        return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    };

    // Last 7 days including today
    for(let i=6; i>=0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        days.push({ 
            timestamp: normalizeDate(d),
            label: new Intl.DateTimeFormat('en-US', { weekday: 'narrow' }).format(d),
            count: 0 
        });
    }
    
    logs.forEach(log => {
        const logDate = new Date(getTimestamp(log.timestamp));
        const normalizedLogTime = normalizeDate(logDate);
        
        const bucket = days.find(d => d.timestamp === normalizedLogTime);
        if (bucket) bucket.count++;
    });

    const maxVal = Math.max(...days.map(d => d.count), 1);

    return (
        <div className="flex justify-between items-stretch h-32 gap-2 w-full pt-4">
            {days.map((day, i) => {
                const heightPct = maxVal > 0 ? (day.count / maxVal) * 100 : 0;
                // Min height 10% or 2px if there's any data to show it exists
                const finalHeight = day.count > 0 ? Math.max(heightPct, 10) : 2;
                const isToday = i === 6;
                
                return (
                    <div key={i} className="flex flex-col items-center gap-2 flex-1 justify-end group cursor-default">
                         <div className="w-full relative flex-1 flex items-end justify-center">
                             <motion.div 
                                initial={{ height: 0 }}
                                animate={{ height: `${finalHeight}%` }}
                                transition={{ duration: 0.8, type: "spring", delay: i * 0.05 }}
                                className={`w-full max-w-[20px] rounded-t-sm ${day.count > 0 ? 'bg-blue-500 group-hover:bg-blue-400 group-hover:shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-gray-800'}`}
                             />
                         </div>
                         <span className={`text-[10px] font-bold ${isToday ? 'text-blue-400' : 'text-gray-500'}`}>{day.label}</span>
                    </div>
                )
            })}
        </div>
    )
}

interface DayOfWeekChartProps {
    logs: ChoreLog[];
}

export const DayOfWeekChart: React.FC<DayOfWeekChartProps> = ({ logs }) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const counts = new Array(7).fill(0);

    logs.forEach(log => {
        const d = new Date(getTimestamp(log.timestamp));
        counts[d.getDay()]++;
    });

    const maxVal = Math.max(...counts, 1);

    return (
        <div className="w-full p-4 bg-gray-900/40 border border-gray-800 rounded-2xl hover:border-gray-700 transition-colors">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">Daily Rhythm</h3>
            <div className="flex justify-between items-stretch h-32 gap-1 sm:gap-2">
                {days.map((day, i) => (
                    <div key={day} className="flex flex-col items-center gap-2 flex-1 justify-end">
                        <div className="w-full relative flex-1 flex items-end justify-center group">
                            <motion.div 
                                initial={{ height: 0 }}
                                animate={{ height: `${Math.max((counts[i] / maxVal) * 100, 5)}%` }}
                                transition={{ type: "spring", damping: 12, delay: i * 0.05 }}
                                className="w-full max-w-[30px] bg-purple-500/20 group-hover:bg-purple-500 rounded-t-md"
                            />
                            {counts[i] > 0 && (
                                <span className="absolute -top-5 text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">{counts[i]}</span>
                            )}
                        </div>
                        <span className="text-[8px] sm:text-[10px] font-bold text-gray-500 uppercase">{day.substring(0, 3)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

interface VerticalBarChartProps {
    data: DistributionItem[];
    title?: string;
}

export const VerticalBarChart: React.FC<VerticalBarChartProps> = ({ data, title }) => {
    const maxVal = Math.max(...data.map(d => d.value), 1);
    
    return (
        <div className="w-full p-4 bg-gray-900/40 border border-gray-800 rounded-2xl">
            {title && <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">{title}</h3>}
            <div className="space-y-3">
                {data.map((item, index) => (
                    <motion.div 
                        key={item.id} 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-3 group"
                    >
                         <div className="w-20 text-xs font-bold text-gray-400 truncate text-right group-hover:text-white transition-colors">{item.label}</div>
                         <div className="flex-1 h-4 bg-gray-800 rounded-full overflow-hidden relative">
                             <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${(item.value / maxVal) * 100}%` }}
                                transition={{ type: "spring", duration: 1 }}
                                style={{ backgroundColor: item.color }} 
                                className="h-full rounded-full absolute top-0 left-0 group-hover:brightness-110"
                             />
                         </div>
                         <div className="w-12 text-xs font-mono font-bold text-white text-right">{item.value}</div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export const DailyBreakdownChart: React.FC<{ logs: ChoreLog[] }> = ({ logs }) => {
    // Last 7 days breakdown
    const daysMap = new Map<string, number>();
    for(let i=6; i>=0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        daysMap.set(d.toDateString(), 0);
    }

    logs.forEach(l => {
        const d = new Date(getTimestamp(l.timestamp));
        const k = d.toDateString();
        if (daysMap.has(k)) {
            daysMap.set(k, (daysMap.get(k) || 0) + 1);
        }
    });

    const maxVal = Math.max(...Array.from(daysMap.values()), 1);

    return (
        <div className="h-32 flex justify-between gap-1 mt-4 px-2 items-stretch">
            {Array.from(daysMap.entries()).map(([dateStr, count], idx) => {
                const date = new Date(dateStr);
                const dayLabel = new Intl.DateTimeFormat('en-US', { weekday: 'narrow' }).format(date);
                const hPct = (count / maxVal) * 100;
                
                return (
                    <div key={dateStr} className="flex-1 flex flex-col items-center gap-2 group justify-end">
                        <div className="w-full bg-gray-800/50 rounded-t-lg relative flex-1 flex items-end overflow-hidden hover:bg-gray-800 transition-colors">
                            <motion.div 
                                initial={{ height: 0 }}
                                animate={{ height: `${Math.max(hPct, 0)}%` }}
                                transition={{ duration: 0.8, type: "spring", delay: idx * 0.05 }}
                                className={`w-full ${count > 0 ? 'bg-gradient-to-t from-emerald-600 to-emerald-400 group-hover:from-emerald-500 group-hover:to-emerald-300' : 'bg-transparent'}`}
                            />
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                {count}
                            </div>
                        </div>
                        <span className="text-[10px] text-gray-500 uppercase font-bold">{dayLabel}</span>
                    </div>
                );
            })}
        </div>
    );
};

interface StatCardProps {
    icon: React.ReactNode;
    title: string;
    value: string | number;
    subtext: string;
    colorClass?: string;
    className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ icon, title, value, subtext, colorClass = "text-white", className = "" }) => (
    <motion.div 
        whileHover={{ scale: 1.05, borderColor: 'rgba(255,255,255,0.2)' }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gray-800/40 border border-gray-800 p-4 rounded-2xl flex flex-col items-center text-center gap-2 transition-colors ${className}`}
    >
        <div className={`p-3 rounded-full bg-gray-900 ${colorClass} mb-1 shadow-lg`}>
            {icon}
        </div>
        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500">{title}</h4>
        <div className={`text-xl font-bold ${colorClass}`}>{value}</div>
        <p className="text-[10px] text-gray-400 leading-tight">{subtext}</p>
    </motion.div>
);