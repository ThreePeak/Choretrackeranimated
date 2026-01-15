import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Trophy, 
  Activity, 
  CheckCircle, 
  Calendar, 
  Flame, 
  Clock, 
  ArrowLeft,
  Settings,
  PieChart,
  ChartColumn,
  Award,
  Download,
  Upload,
  Database,
  Trash,
  Copy,
  X,
  Github,
  Zap,
  Moon,
  Sun,
  Coffee,
  Crown,
  TrendingUp,
  Target,
  Eye,
  EyeOff,
  Clipboard,
  GitBranch,
  Lightbulb,
  Hourglass,
  DollarSign
} from 'lucide-react';
import { Member, Chore, ChoreLog, AppView, DistributionItem } from './types';
import { generateColor, formatDate, getRelativeTime, getDayName, getHour, estimateChoreDuration, getChoreCategory, formatDuration } from './utils';
import { DistributionBar, DonutChart, WeeklyActivityGraph, VerticalBarChart, StatCard, MiniContributionBar, DayOfWeekChart } from './components/Charts';
import { PROJECT_FILES } from './projectFiles';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('dashboard');
  const [activeChoreId, setActiveChoreId] = useState<string | null>(null);
  
  // App ID Management
  const [manualAppId, setManualAppId] = useState(""); 
  const appId = manualAppId.trim() !== "" ? manualAppId.trim() : "default-family-id";
  
  // Data State
  const [members, setMembers] = useState<Member[]>([]);
  const [chores, setChores] = useState<Chore[]>([]);
  const [logs, setLogs] = useState<ChoreLog[]>([]);
  
  // Inputs
  const [newMemberName, setNewMemberName] = useState('');
  const [newChoreName, setNewChoreName] = useState('');
  const [manualDate, setManualDate] = useState('');
  
  // Migration State
  const [importJson, setImportJson] = useState('');
  const [exportJson, setExportJson] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  // GitHub Integration State
  const [ghToken, setGhToken] = useState('');
  const [showGhToken, setShowGhToken] = useState(false);
  const [ghRepo, setGhRepo] = useState('family-chore-tracker');
  const [ghBranch, setGhBranch] = useState('ThreePeak-patch-1');
  const [isUploading, setIsUploading] = useState(false);

  // Persistence Simulation
  useEffect(() => {
    const saved = localStorage.getItem(`chore_data_${appId}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      setMembers(parsed.members || []);
      setChores(parsed.chores || []);
      setLogs(parsed.logs || []);
    } else {
      setMembers([]); setChores([]); setLogs([]);
    }
  }, [appId]);

  useEffect(() => {
    const data = { members, chores, logs };
    localStorage.setItem(`chore_data_${appId}`, JSON.stringify(data));
  }, [members, chores, logs, appId]);

  /* ACTIONS */
  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;
    const newMember: Member = {
      id: Math.random().toString(36).substr(2, 9),
      name: newMemberName.trim(),
      color: generateColor(newMemberName.trim()),
      joinedAt: new Date()
    };
    setMembers([...members, newMember]);
    setNewMemberName('');
  };

  const handleAddChore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChoreName.trim()) return;
    const newChore: Chore = {
      id: Math.random().toString(36).substr(2, 9),
      name: newChoreName.trim(),
      createdAt: new Date()
    };
    setChores([...chores, newChore]);
    setNewChoreName('');
  };

  const handleLogChore = (choreId: string, memberId: string, date: string | null = null) => {
    const timestamp = date ? new Date(date) : new Date();
    const newLog: ChoreLog = {
      id: Math.random().toString(36).substr(2, 9),
      choreId,
      memberId,
      timestamp,
      isManual: !!date
    };
    setLogs([newLog, ...logs]);
  };

  const handleDeleteItem = (collection: 'members' | 'chores' | 'logs', id: string) => {
    if (confirm('Are you sure you want to delete this?')) {
      if (collection === 'members') setMembers(members.filter(m => m.id !== id));
      if (collection === 'chores') setChores(chores.filter(c => c.id !== id));
      if (collection === 'logs') setLogs(logs.filter(l => l.id !== id));
    }
  };

  const handleExport = () => {
    const backup = { members, chores, logs };
    const jsonStr = JSON.stringify(backup, null, 2);
    setExportJson(jsonStr);
    navigator.clipboard.writeText(jsonStr).then(() => alert("Copied to clipboard!"));
  };

  const handleImport = () => {
    if (!importJson) return;
    setIsImporting(true);
    try {
      const data = JSON.parse(importJson);
      setMembers(data.members || []);
      setChores(data.chores || []);
      setLogs(data.logs || []);
      alert("Import successful!");
      setImportJson('');
    } catch (e) {
      alert("Failed to parse JSON.");
    }
    setIsImporting(false);
  };

  const handleGithubUpload = async () => {
    if (!ghToken || !ghRepo || !ghBranch) return alert("Please provide Token, Repo Name, and Branch.");
    setIsUploading(true);

    try {
        const headers = { 
            'Authorization': `token ${ghToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/vnd.github.v3+json'
        };

        // 1. Get User Info
        const userRes = await fetch('https://api.github.com/user', { headers });
        if (!userRes.ok) throw new Error("Invalid Token");
        const user = await userRes.json();

        // 2. Create Repo (ignore if exists)
        await fetch('https://api.github.com/user/repos', {
            method: 'POST',
            headers,
            body: JSON.stringify({ 
                name: ghRepo, 
                private: true, 
                description: "Family Chore Tracker Data & App" 
            })
        });

        // 3. Ensure Branch Exists
        const branchCheckRes = await fetch(`https://api.github.com/repos/${user.login}/${ghRepo}/git/ref/heads/${ghBranch}`, { headers });
        
        if (branchCheckRes.status === 404) {
            // Branch does not exist. Create it from default branch.
            const repoRes = await fetch(`https://api.github.com/repos/${user.login}/${ghRepo}`, { headers });
            if (!repoRes.ok) throw new Error("Could not access repository.");
            const repoData = await repoRes.json();
            const defaultBranch = repoData.default_branch || 'main';

            const refRes = await fetch(`https://api.github.com/repos/${user.login}/${ghRepo}/git/ref/heads/${defaultBranch}`, { headers });
            if (!refRes.ok) throw new Error(`Could not find default branch: ${defaultBranch}`);
            const refData = await refRes.json();
            const sha = refData.object.sha;

            const createBranchRes = await fetch(`https://api.github.com/repos/${user.login}/${ghRepo}/git/refs`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    ref: `refs/heads/${ghBranch}`,
                    sha: sha
                })
            });
            if (!createBranchRes.ok) throw new Error(`Failed to create branch: ${ghBranch}`);
        }

        // 4. Prepare Files
        // CRITICAL FIX: We dynamically generate the content of projectFiles.ts to include
        // the current PROJECT_FILES array. This ensures projectFiles.ts exists in the repo
        // so App.tsx can import it during the build process.
        const projectFilesContent = `export const PROJECT_FILES = ${JSON.stringify(PROJECT_FILES, null, 2)};`;

        const filesToUpload = [
            ...PROJECT_FILES,
            {
                path: 'projectFiles.ts',
                content: projectFilesContent
            },
            { 
                path: 'data_backup.json', 
                content: JSON.stringify({ members, chores, logs }, null, 2) 
            }
        ];

        // 5. Upload Files
        for (const file of filesToUpload) {
            const fileUrl = `https://api.github.com/repos/${user.login}/${ghRepo}/contents/${file.path}?ref=${ghBranch}`;
            const getRes = await fetch(fileUrl, { headers });
            let sha = undefined;
            if (getRes.ok) {
                const data = await getRes.json();
                sha = data.sha;
            }

            const contentEncoded = btoa(unescape(encodeURIComponent(file.content)));
            
            const putRes = await fetch(`https://api.github.com/repos/${user.login}/${ghRepo}/contents/${file.path}`, {
                method: 'PUT',
                headers,
                body: JSON.stringify({
                    message: `Update ${file.path} from App`,
                    content: contentEncoded,
                    sha,
                    branch: ghBranch
                })
            });
            
            if (!putRes.ok) console.error(`Failed to upload ${file.path}`);
        }

        alert(`Successfully uploaded to https://github.com/${user.login}/${ghRepo}/tree/${ghBranch}`);
    } catch (e: any) {
        alert("Upload Failed: " + e.message);
        console.error(e);
    } finally {
        setIsUploading(false);
    }
  };

  /* STATS LOGIC */
  const getChoreStats = (choreId: string) => {
    const choreLogs = logs.filter(l => l.choreId === choreId);
    const total = choreLogs.length;
    const distribution: DistributionItem[] = members.map(m => {
      const count = choreLogs.filter(l => l.memberId === m.id).length;
      return { label: m.name, value: count, color: m.color, id: m.id };
    }).sort((a, b) => b.value - a.value);

    let streak = { count: 0, memberId: null as string | null };
    if (choreLogs.length > 0) {
      const currentHolder = choreLogs[0].memberId;
      let count = 0;
      for (let log of choreLogs) {
        if (log.memberId === currentHolder) count++; else break;
      }
      streak = { count, memberId: currentHolder };
    }

    return { total, distribution, streak };
  };

  const calculateFunStats = () => {
    if (logs.length === 0 || members.length === 0) return null;

    const countsByMember: Record<string, number> = {};
    const countsByHour: Record<number, number> = {};
    const countsByDay: Record<string, number> = {};
    const distinctChoresByMember: Record<string, Set<string>> = {};
    const totalMinutesByMember: Record<string, number> = {};
    let totalMinutesHouse = 0;

    members.forEach(m => {
        countsByMember[m.id] = 0;
        totalMinutesByMember[m.id] = 0;
        distinctChoresByMember[m.id] = new Set();
    });

    logs.forEach(log => {
        const chore = chores.find(c => c.id === log.choreId);
        const estDuration = chore ? estimateChoreDuration(chore.name) : 10;
        
        countsByMember[log.memberId] = (countsByMember[log.memberId] || 0) + 1;
        totalMinutesByMember[log.memberId] = (totalMinutesByMember[log.memberId] || 0) + estDuration;
        totalMinutesHouse += estDuration;

        if (log.choreId) distinctChoresByMember[log.memberId]?.add(log.choreId);
        
        const d = log.timestamp.toDate ? log.timestamp.toDate() : new Date(log.timestamp);
        const hour = d.getHours();
        
        const dayName = getDayName(d);
        countsByDay[dayName] = (countsByDay[dayName] || 0) + 1;
        
        countsByHour[hour] = (countsByHour[hour] || 0) + 1;
    });

    const sortedMembers = Object.entries(countsByMember).sort((a,b) => b[1] - a[1]);
    const leader = members.find(m => m.id === sortedMembers[0]?.[0]);

    const nightLogs = logs.filter(l => getHour(l.timestamp) >= 21);
    const nightCounts: Record<string, number> = {};
    nightLogs.forEach(l => nightCounts[l.memberId] = (nightCounts[l.memberId] || 0) + 1);
    const nightOwlEntry = Object.entries(nightCounts).sort((a,b) => b[1] - a[1])[0];
    const nightOwl = members.find(m => m.id === nightOwlEntry?.[0]);

    const morningLogs = logs.filter(l => getHour(l.timestamp) <= 8);
    const morningCounts: Record<string, number> = {};
    morningLogs.forEach(l => morningCounts[l.memberId] = (morningCounts[l.memberId] || 0) + 1);
    const earlyBirdEntry = Object.entries(morningCounts).sort((a,b) => b[1] - a[1])[0];
    const earlyBird = members.find(m => m.id === earlyBirdEntry?.[0]);

    const weekendLogs = logs.filter(l => {
        const d = l.timestamp.toDate ? l.timestamp.toDate() : new Date(l.timestamp);
        return d.getDay() === 0 || d.getDay() === 6;
    });
    const weekendCounts: Record<string, number> = {};
    weekendLogs.forEach(l => weekendCounts[l.memberId] = (weekendCounts[l.memberId] || 0) + 1);
    const warriorEntry = Object.entries(weekendCounts).sort((a,b) => b[1] - a[1])[0];
    const weekendWarrior = members.find(m => m.id === warriorEntry?.[0]);

    const varietySorted = Object.entries(distinctChoresByMember).sort((a,b) => b[1].size - a[1].size);
    const varietyWinner = members.find(m => m.id === varietySorted[0]?.[0]);
    
    const busiestDayEntry = Object.entries(countsByDay).sort((a,b) => b[1] - a[1])[0];
    const totalChores = logs.length;

    let specialist = null;
    let maxSpecialization = 0;
    members.forEach(m => {
        const myLogs = logs.filter(l => l.memberId === m.id);
        if (myLogs.length > 5) {
            const myChoreCounts: Record<string, number> = {};
            myLogs.forEach(l => myChoreCounts[l.choreId] = (myChoreCounts[l.choreId] || 0) + 1);
            const maxSingleChore = Math.max(...Object.values(myChoreCounts));
            const ratio = maxSingleChore / myLogs.length;
            if (ratio > maxSpecialization) {
                maxSpecialization = ratio;
                specialist = m;
            }
        }
    });

    const sortedTime = Object.entries(totalMinutesByMember).sort((a,b) => b[1] - a[1]);
    const timeLord = members.find(m => m.id === sortedTime[0]?.[0]);
    const timeLordMinutes = sortedTime[0]?.[1] || 0;

    const didYouKnows: string[] = [];
    
    const caloriesBurned = Math.round(totalMinutesHouse * 4.5);
    didYouKnows.push(`Did you know? The family has burned approximately ${caloriesBurned} calories doing chores. That's about ${Math.round(caloriesBurned/285)} slices of pizza!`);

    const wageValue = (totalMinutesHouse / 60) * 15;
    didYouKnows.push(`Did you know? If you hired a professional at $15/hr, this work would have cost $${wageValue.toFixed(2)}.`);

    const moviesWatched = (totalMinutesHouse / 120).toFixed(1);
    didYouKnows.push(`Did you know? You could have watched ${moviesWatched} full-length movies in the time spent cleaning.`);

    if (members.length >= 2) {
        const top = members.find(m => m.id === sortedMembers[0][0]);
        const second = members.find(m => m.id === sortedMembers[1][0]);
        if(top && second) {
            const pct = Math.round(((countsByMember[top.id] - countsByMember[second.id]) / countsByMember[second.id]) * 100);
            if (pct > 0) didYouKnows.push(`Did you know? ${top.name} is currently ${pct}% more productive than ${second.name}.`);
        }
    }

    chores.forEach(c => {
        const cLogs = logs.filter(l => l.choreId === c.id);
        if (cLogs.length > 5) {
            const cCounts: Record<string, number> = {};
            cLogs.forEach(l => cCounts[l.memberId] = (cCounts[l.memberId]||0)+1);
            const ownerId = Object.keys(cCounts).reduce((a, b) => cCounts[a] > cCounts[b] ? a : b);
            const owner = members.find(m => m.id === ownerId);
            const pct = Math.round((cCounts[ownerId] / cLogs.length) * 100);
            if (pct > 60 && owner) {
                didYouKnows.push(`Did you know? ${owner.name} basically owns the "${c.name}" task, doing ${pct}% of the work.`);
            }
        }
    });

    if (timeLord) {
        didYouKnows.push(`Did you know? ${timeLord.name} has spent roughly ${(timeLordMinutes/60).toFixed(1)} hours working. Give them a break!`);
    }

    const weeksActive = Math.max(1, (new Date().getTime() - new Date(logs[logs.length-1]?.timestamp || new Date()).getTime()) / (1000 * 3600 * 24 * 7));
    const avgPerWeek = Math.round(logs.length / weeksActive);
    didYouKnows.push(`Did you know? The household averages ${avgPerWeek} tasks per week.`);

    const busyHour = Object.entries(countsByHour).sort((a,b) => b[1] - a[1])[0];
    if(busyHour) {
        const hourInt = parseInt(busyHour[0]);
        const ampm = hourInt >= 12 ? 'PM' : 'AM';
        const displayHour = hourInt % 12 || 12;
        didYouKnows.push(`Did you know? The most productive time of day is around ${displayHour} ${ampm}.`);
    }

    const shuffledFacts = didYouKnows.sort(() => 0.5 - Math.random()).slice(0, 10);

    return {
        leader,
        nightOwl,
        earlyBird,
        weekendWarrior,
        varietyWinner,
        busiestDay: busiestDayEntry ? busiestDayEntry[0] : 'None',
        totalChores,
        specialist,
        specialistRatio: Math.round(maxSpecialization * 100),
        sortedMembers,
        timeLord,
        totalMinutesHouse,
        shuffledFacts,
        sortedTime
    };
  };

  /* RENDER HELPERS */
  const renderDashboard = () => {
    const totalLogs = logs.length;
    const overallDistribution: DistributionItem[] = members.map(m => {
        const count = logs.filter(l => l.memberId === m.id).length;
        return { label: m.name, value: count, color: m.color, id: m.id };
    }).sort((a, b) => b.value - a.value);

    const sevenDaysAgo = new Date(); 
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentLogs = logs.filter(l => new Date(l.timestamp) >= sevenDaysAgo);
    
    const mvpCounts: Record<string, number> = {};
    recentLogs.forEach(l => { mvpCounts[l.memberId] = (mvpCounts[l.memberId] || 0) + 1; });
    
    let weeklyMvp: Member | undefined; 
    let maxCount = -1;
    Object.keys(mvpCounts).forEach(mId => {
        if (mvpCounts[mId] > maxCount) { 
          maxCount = mvpCounts[mId]; 
          weeklyMvp = members.find(m => m.id === mId); 
        }
    });

    return (
      <div className="space-y-6">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Family Tracker</h1>
            <p className="text-gray-400 text-xs font-medium">Household Performance</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setView('stats')} className="p-2.5 bg-gray-800 rounded-full hover:bg-gray-700 text-purple-400 transition-colors shadow-lg shadow-purple-900/20 group"> 
                <Trophy size={20} className="group-hover:scale-110 transition-transform" /> 
            </button>
            <button onClick={() => setView('settings')} className="p-2.5 bg-gray-800 rounded-full hover:bg-gray-700 text-gray-400 transition-colors"> <Settings size={20} /> </button>
          </div>
        </header>

        {/* Database Control */}
        <div className="bg-black/40 border border-gray-800 p-4 rounded-xl mb-6 flex flex-col gap-3">
           <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-widest font-black">
              <Database size={12} className="text-blue-500" /> Environment Configuration
           </div>
           <div className="flex gap-2">
              <input 
                  type="text" 
                  value={manualAppId}
                  onChange={(e) => setManualAppId(e.target.value)}
                  className="flex-1 bg-gray-900 border border-gray-700 text-white text-xs px-3 py-2 rounded-lg font-mono focus:border-blue-500 outline-none transition-all"
                  placeholder={`Active ID: ${appId}`}
              />
           </div>
        </div>

        {members.length === 0 && (
          <div className="bg-blue-900/20 border border-blue-800/50 p-8 rounded-2xl mb-6 text-center animate-pulse">
            <h3 className="text-blue-300 font-bold text-lg flex items-center justify-center gap-2 mb-2">
              <Users size={20} /> Welcome Home
            </h3>
            <p className="text-blue-200/60 text-sm mb-5">
              Ready to organize your family? Start by adding your first family member in settings.
            </p>
            <button onClick={() => setView('settings')} className="px-8 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-bold text-white transition-all shadow-lg shadow-blue-900/20">
              Get Started
            </button>
          </div>
        )}

        {members.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              <div className="bg-gray-800/40 border border-gray-800 rounded-2xl p-5 flex flex-col items-center justify-between min-h-[190px]">
                  <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest w-full text-center mb-3">Overall Distribution</h3>
                  <DonutChart data={overallDistribution} total={totalLogs} />
              </div>
              <div className="bg-gray-800/40 border border-gray-800 rounded-2xl p-5 md:col-span-2 flex flex-col min-h-[190px]">
                   <div className="flex justify-between items-start">
                      <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Activity Log</h3>
                      {weeklyMvp && (
                           <div className="flex items-center gap-2 bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">
                               <Award size={14} className="text-yellow-500" />
                               <span className="text-[10px] font-bold text-yellow-500 uppercase">Weekly MVP: {weeklyMvp.name}</span>
                           </div>
                      )}
                   </div>
                   <div className="flex-1 flex items-end">
                       <WeeklyActivityGraph logs={logs} />
                   </div>
              </div>
          </div>
        )}

        {/* Chores Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {chores.map(chore => {
            const stats = getChoreStats(chore.id);
            const lastLog = logs.find(l => l.choreId === chore.id);
            const lastMember = lastLog ? members.find(m => m.id === lastLog.memberId) : null;
            return (
              <div 
                key={chore.id}
                onClick={() => { setActiveChoreId(chore.id); setView('chore_detail'); }}
                className="bg-gray-800/30 hover:bg-gray-800/60 border border-gray-800 rounded-2xl p-6 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] group"
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">{chore.name}</h3>
                  {stats.streak.count >= 3 && (
                     <div className="bg-orange-500/10 text-orange-500 px-2 py-1 rounded-lg text-[10px] font-black flex items-center gap-1 border border-orange-500/20">
                       <Flame size={12} /> {stats.streak.count}X STREAK
                     </div>
                  )}
                </div>
                <div className="mt-5">
                  <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase mb-2">
                    <span>Workload</span> <span>{stats.total} Completions</span>
                  </div>
                  <DistributionBar data={stats.distribution} total={stats.total} />
                </div>
                <div className="mt-5 flex items-center gap-2 text-xs text-gray-500">
                  <Clock size={14} className="text-gray-600" />
                  {lastLog ? ( 
                    <span> Done by <span className="text-white font-semibold">{lastMember?.name || 'Unknown'}</span> {getRelativeTime(lastLog.timestamp)} </span> 
                  ) : ( 
                    <span className="italic">Never completed</span> 
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Global Summary Stats at the bottom as requested */}
        {logs.length > 5 && (
            <div className="mt-12 pt-8 border-t border-gray-800">
                <h3 className="text-gray-500 font-bold text-sm mb-6 flex items-center gap-2"><ChartColumn size={18}/> Household Pulse</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <VerticalBarChart data={overallDistribution} title="All-Time Leaderboard" />
                    <div className="grid grid-cols-2 gap-4">
                        <StatCard icon={<CheckCircle size={16} />} title="Total Chores" value={logs.length} subtext="Lifetime completions" colorClass="text-blue-400" />
                        <StatCard icon={<Users size={16} />} title="Family Size" value={members.length} subtext="Active members" colorClass="text-purple-400" />
                        <StatCard icon={<Award size={16} />} title="Avg Daily" value={Math.round(logs.length / Math.max(1, (new Date().getTime() - new Date(logs[logs.length-1]?.timestamp || new Date()).getTime()) / (1000 * 3600 * 24)))} subtext="Tasks per day" colorClass="text-emerald-400" />
                        <StatCard icon={<Target size={16} />} title="Active Chores" value={chores.length} subtext="In rotation" colorClass="text-orange-400" />
                    </div>
                </div>
            </div>
        )}
      </div>
    );
  };

  const renderChoreDetail = () => {
    const chore = chores.find(c => c.id === activeChoreId);
    if (!chore) return null;
    const stats = getChoreStats(chore.id);
    const choreLogs = logs.filter(l => l.choreId === chore.id);
    
    // Day of week breakdown for this chore
    const dayCounts: Record<string, number> = {};
    choreLogs.forEach(l => {
        const d = getDayName(l.timestamp);
        dayCounts[d] = (dayCounts[d] || 0) + 1;
    });
    const busiestDay = Object.entries(dayCounts).sort((a,b) => b[1] - a[1])[0];

    // Estimated time per person
    const estTime = estimateChoreDuration(chore.name);
    const timeSpent: Record<string, number> = {};
    choreLogs.forEach(l => {
        timeSpent[l.memberId] = (timeSpent[l.memberId] || 0) + estTime;
    });

    return (
      <div className="space-y-6">
        <header className="flex items-center gap-4 mb-2">
          <button onClick={() => setView('dashboard')} className="p-2.5 hover:bg-gray-800 rounded-full text-gray-400 transition-all"> <ArrowLeft size={24} /> </button>
          <h1 className="text-2xl font-bold text-white">{chore.name}</h1>
        </header>

        <section className="bg-gray-800/40 border border-gray-800 rounded-3xl p-6">
          <h2 className="text-[10px] font-black tracking-widest text-gray-500 mb-6 uppercase">Quick Log Completion</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {members.map(member => {
                const memberLogCount = choreLogs.filter(l => l.memberId === member.id).length;
                return (
                  <button
                    key={member.id}
                    onClick={() => handleLogChore(chore.id, member.id)}
                    className="group relative overflow-hidden bg-gray-900 hover:bg-blue-600 border border-gray-800 hover:border-blue-500 rounded-2xl p-5 transition-all duration-300 flex flex-col items-center gap-3"
                  >
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black text-white shadow-xl transition-transform group-hover:scale-110" style={{ backgroundColor: member.color }}> 
                      {member.name.charAt(0)} 
                    </div>
                    <div className="w-full text-center">
                        <span className="font-bold text-gray-300 group-hover:text-white transition-colors">{member.name}</span>
                        {/* Sparkline for specific chore contribution */}
                        <div className="mt-1 opacity-60 group-hover:opacity-100">
                            <MiniContributionBar value={memberLogCount} total={stats.total} color={member.color} />
                        </div>
                    </div>
                  </button>
                );
            })}
          </div>
          <div className="mt-8 pt-6 border-t border-gray-800">
            <details className="text-sm text-gray-500 group">
              <summary className="cursor-pointer hover:text-white flex items-center gap-2 transition-colors"> <Calendar size={14} /> Log historical task </summary>
              <div className="mt-4 flex flex-col sm:flex-row gap-3 p-4 bg-gray-900 rounded-2xl border border-gray-800">
                <input type="datetime-local" className="flex-1 bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500" onChange={(e) => setManualDate(e.target.value)} />
                <select className="flex-1 bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500" onChange={(e) => { if(e.target.value) { handleLogChore(chore.id, e.target.value, manualDate); setManualDate(''); } }} defaultValue="" >
                  <option value="" disabled>Select Member</option>
                  {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
            </details>
          </div>
        </section>

        {/* VISUALS SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <section className="bg-gray-800/40 border border-gray-800 p-6 rounded-2xl flex flex-col h-full">
                 <h3 className="text-gray-500 text-[10px] font-black uppercase mb-6 flex items-center gap-2"> <PieChart size={14} className="text-purple-500" /> Member Share </h3>
                 <div className="flex-1 flex flex-col justify-center">
                    <DistributionBar data={stats.distribution} total={stats.total} />
                    <div className="mt-6 space-y-3">
                        {stats.distribution.map(d => (
                            <div key={d.id} className="flex items-center justify-between text-xs text-gray-400">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{backgroundColor: d.color}}></div>
                                    <span className="font-medium text-gray-300">{d.label}</span>
                                </div>
                                <span className="font-mono">{Math.round((d.value/stats.total)*100 || 0)}% ({d.value})</span>
                            </div>
                        ))}
                    </div>
                 </div>
             </section>

             <section className="bg-gray-800/40 border border-gray-800 p-6 rounded-2xl flex flex-col h-full">
                 <h3 className="text-gray-500 text-[10px] font-black uppercase mb-6 flex items-center gap-2"> <Activity size={14} className="text-blue-500" /> 7-Day Trend </h3>
                 <div className="flex-1 flex items-end min-h-[150px]">
                    <WeeklyActivityGraph logs={choreLogs} />
                 </div>
                 <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-800/50">
                     <div>
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block">Most Active Day</span>
                        <span className="text-xs font-bold text-white">{busiestDay ? busiestDay[0] : 'N/A'}</span>
                     </div>
                     <div className="text-right">
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block">Est. Time Spent</span>
                        <span className="text-xs font-bold text-blue-400">{(stats.total * estTime / 60).toFixed(1)} Hours</span>
                     </div>
                 </div>
             </section>
        </div>

        {/* FULL HISTORY SECTION */}
        <section className="mt-8">
            <div className="flex items-center justify-between mb-5">
                <h3 className="text-white font-bold flex items-center gap-2"> <Clock size={20} className="text-gray-400"/> Full History </h3>
                <span className="text-xs font-bold text-gray-500 bg-gray-900 px-3 py-1 rounded-full border border-gray-800">{choreLogs.length} Records</span>
            </div>
            
            <div className="bg-gray-900/40 rounded-3xl overflow-hidden border border-gray-800">
                <div className="overflow-y-auto max-h-[600px] scrollbar-hide">
                    {choreLogs.length === 0 ? (
                    <div className="p-10 text-center text-gray-600 italic">No activity yet.</div>
                    ) : (
                    choreLogs.map((log, idx) => {
                        const member = members.find(m => m.id === log.memberId);
                        return (
                            <div key={log.id} className={`p-4 flex items-center justify-between hover:bg-gray-800/20 transition-colors ${idx !== choreLogs.length - 1 ? 'border-b border-gray-800' : ''}`}>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black text-white shadow-lg" style={{ backgroundColor: member?.color || '#333' }}> {member?.name.charAt(0)} </div>
                                    <div>
                                        <div className="text-sm font-bold text-white">{member?.name || 'Unknown User'}</div>
                                        <div className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-2"> 
                                            {formatDate(log.timestamp)} 
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {log.isManual && <span className="hidden sm:inline-block text-[8px] font-black bg-gray-800 text-gray-400 px-2 py-1 rounded uppercase tracking-wider border border-gray-700">Manual</span>}
                                    <button onClick={() => handleDeleteItem('logs', log.id)} className="text-gray-600 hover:text-red-500 p-2 transition-colors rounded-lg hover:bg-gray-800"> <Trash size={16} /> </button>
                                </div>
                            </div>
                        );
                    })
                    )}
                </div>
            </div>
        </section>
      </div>
    );
  };

  const renderStats = () => {
    const funStats = calculateFunStats();
    if (!funStats) return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8">
            <Trophy size={48} className="text-gray-700 mb-4" />
            <h2 className="text-xl font-bold text-white">Not Enough Data</h2>
            <p className="text-gray-500 text-sm mt-2">Log some chores to unlock the hall of fame!</p>
            <button onClick={() => setView('dashboard')} className="mt-6 px-6 py-2 bg-blue-600 rounded-lg text-white font-bold">Back Home</button>
        </div>
    );

    const leaderboardData = funStats.sortedMembers.map(([id, count]) => {
        const m = members.find(mem => mem.id === id);
        return { label: m?.name || 'Unknown', value: count, color: m?.color || '#333', id };
    });

    // Time Leaderboard
    const timeData = funStats.sortedTime.map(([id, mins]) => {
        const m = members.find(mem => mem.id === id);
        return { label: m?.name || 'Unknown', value: Math.round(mins/60*10)/10, color: m?.color || '#333', id };
    });

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="flex items-center gap-4 mb-8">
                <button onClick={() => setView('dashboard')} className="p-2.5 hover:bg-gray-800 rounded-full text-gray-400 transition-all"> <ArrowLeft size={24} /> </button>
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2"><Trophy className="text-yellow-500" /> Hall of Fame</h1>
                    <p className="text-gray-500 text-xs font-medium">Fun facts and competitive stats</p>
                </div>
            </header>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 <StatCard 
                    icon={<Crown size={20} />} 
                    title="The Leader" 
                    value={funStats.leader?.name || '-'} 
                    subtext="Most chores done" 
                    colorClass="text-yellow-400 bg-yellow-400/10" 
                 />
                 <StatCard 
                    icon={<Hourglass size={20} />} 
                    title="The Time Lord" 
                    value={funStats.timeLord?.name || '-'} 
                    subtext="Most time spent" 
                    colorClass="text-pink-400 bg-pink-400/10" 
                 />
                 <StatCard 
                    icon={<Moon size={20} />} 
                    title="Night Owl" 
                    value={funStats.nightOwl?.name || '-'} 
                    subtext="Most active after 9PM" 
                    colorClass="text-purple-400 bg-purple-400/10" 
                 />
                 <StatCard 
                    icon={<Sun size={20} />} 
                    title="Early Bird" 
                    value={funStats.earlyBird?.name || '-'} 
                    subtext="Most active before 8AM" 
                    colorClass="text-orange-400 bg-orange-400/10" 
                 />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <VerticalBarChart data={leaderboardData} title="Task Count Leaderboard" />
                <VerticalBarChart data={timeData} title="Hours Worked Leaderboard" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <div className="p-5 bg-gray-900/40 border border-gray-800 rounded-2xl">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-2"><ChartColumn size={14}/> Daily Volume (Last 7 Days)</h3>
                        <DayOfWeekChart logs={logs} />
                    </div>
                    <DayOfWeekChart logs={logs} />
                </div>
                <div className="grid grid-cols-1 gap-4">
                    <StatCard 
                        icon={<Zap size={20} />} 
                        title="Busiest Day" 
                        value={funStats.busiestDay} 
                        subtext="Peak activity" 
                        colorClass="text-red-400" 
                        className="h-full justify-center"
                    />
                    <StatCard 
                        icon={<Coffee size={20} />} 
                        title="Weekend Warrior" 
                        value={funStats.weekendWarrior?.name || '-'} 
                        subtext="Most active Sat/Sun" 
                        colorClass="text-blue-400 bg-blue-400/10" 
                        className="h-full justify-center"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 <StatCard 
                    icon={<CheckCircle size={20} />} 
                    title="Total Completed" 
                    value={funStats.totalChores} 
                    subtext="Household Total" 
                    colorClass="text-emerald-400" 
                 />
                 <StatCard 
                    icon={<Clock size={20} />} 
                    title="Hours Logged" 
                    value={Math.round(funStats.totalMinutesHouse / 60)} 
                    subtext="Estimated Total" 
                    colorClass="text-teal-400" 
                 />
                <StatCard 
                    icon={<Target size={20} />} 
                    title="The Specialist" 
                    value={funStats.specialist?.name || '-'} 
                    subtext={`${funStats.specialistRatio}% on one chore`} 
                    colorClass="text-indigo-400" 
                />
                <StatCard 
                    icon={<TrendingUp size={20} />} 
                    title="Variety Award" 
                    value={funStats.varietyWinner?.name || '-'} 
                    subtext="Most diverse tasks" 
                    colorClass="text-cyan-400" 
                />
            </div>
            
            <section className="pt-6 border-t border-gray-800">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Lightbulb className="text-yellow-300" size={20}/> Did You Know?</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {funStats.shuffledFacts.map((fact, i) => (
                        <div key={i} className="bg-gray-800/40 p-4 rounded-xl border border-gray-800 text-xs text-gray-400 flex gap-3 items-start hover:bg-gray-800/60 transition-colors">
                            <div className="mt-0.5 min-w-[16px]"><Lightbulb size={14} className="text-yellow-500/50" /></div>
                            <p>{fact}</p>
                        </div>
                    ))}
                </div>
            </section>

            <div className="p-6 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-2xl border border-blue-500/20 text-center">
                <h3 className="text-blue-300 font-bold mb-2">Keep it up!</h3>
                <p className="text-sm text-gray-400 max-w-md mx-auto">Tracking these stats helps balance the load and makes chores a little less boring. The current leader is <span className="text-white font-bold">{funStats.leader?.name}</span>!</p>
            </div>
        </div>
    );
  };

  const renderSettings = () => (
    <div className="space-y-8 max-w-xl mx-auto">
      <header className="flex items-center gap-4 mb-8">
          <button onClick={() => setView('dashboard')} className="p-2.5 hover:bg-gray-800 rounded-full text-gray-400"> <ArrowLeft size={24} /> </button>
          <h1 className="text-2xl font-bold text-white tracking-tight">Management</h1>
      </header>

      {/* Members Section */}
      <section className="bg-gray-800/40 border border-gray-800 rounded-3xl p-6">
        <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2"> <Users size={20} className="text-blue-500" /> Family Roster </h2>
        <form onSubmit={handleAddMember} className="flex gap-3 mb-6">
          <input type="text" placeholder="Member Name" className="flex-1 bg-gray-900 border border-gray-800 text-white rounded-2xl px-5 py-3 focus:border-blue-500 outline-none transition-all placeholder:text-gray-700" value={newMemberName} onChange={(e) => setNewMemberName(e.target.value)} />
          <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-blue-900/20"> Add </button>
        </form>
        <div className="space-y-2">
            {members.map(member => (
            <div key={member.id} className="flex justify-between items-center bg-gray-900/40 p-4 rounded-2xl border border-gray-800 group hover:border-blue-500/30 transition-all">
                <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-xl shadow-lg" style={{ backgroundColor: member.color }}></div>
                <span className="text-gray-200 font-bold">{member.name}</span>
                </div>
                <button onClick={() => handleDeleteItem('members', member.id)} className="text-gray-700 hover:text-red-500 transition-colors p-2"> <Trash size={18} /> </button>
            </div>
            ))}
        </div>
      </section>

      {/* Chores Section */}
      <section className="bg-gray-800/40 border border-gray-800 rounded-3xl p-6">
        <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2"> <CheckCircle size={20} className="text-emerald-500" /> Task Library </h2>
        <form onSubmit={handleAddChore} className="flex gap-3 mb-6">
          <input type="text" placeholder="Task Name (e.g. Vacuum)" className="flex-1 bg-gray-900 border border-gray-800 text-white rounded-2xl px-5 py-3 focus:border-emerald-500 outline-none transition-all placeholder:text-gray-700" value={newChoreName} onChange={(e) => setNewChoreName(e.target.value)} />
          <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-emerald-900/20"> Add </button>
        </form>
        <div className="space-y-2">
            {chores.map(chore => (
            <div key={chore.id} className="flex justify-between items-center bg-gray-900/40 p-4 rounded-2xl border border-gray-800 group hover:border-emerald-500/30 transition-all">
                <span className="text-gray-200 font-bold">{chore.name}</span>
                <button onClick={() => handleDeleteItem('chores', chore.id)} className="text-gray-700 hover:text-red-500 transition-colors p-2"> <Trash size={18} /> </button>
            </div>
            ))}
        </div>
      </section>

      {/* GitHub Integration */}
      <section className="bg-gray-800/40 border border-gray-800 rounded-3xl p-6">
         <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2"> <Github size={20} className="text-white" /> GitHub Integration </h2>
         
         <div className="bg-gray-900/60 p-6 rounded-2xl border border-gray-800 space-y-4">
             <div className="flex flex-col gap-1">
                 <label className="text-[10px] uppercase font-bold text-gray-500">Personal Access Token (Repo Scope)</label>
                 <div className="relative">
                    <input 
                        type={showGhToken ? "text" : "password"}
                        placeholder="ghp_xxxxxxxxxxxx" 
                        className="w-full bg-black/40 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:border-white outline-none font-mono pr-20"
                        value={ghToken}
                        onChange={(e) => setGhToken(e.target.value)}
                        autoComplete="off"
                        spellCheck="false"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                        <button 
                            onClick={async () => {
                                try {
                                    const text = await navigator.clipboard.readText();
                                    setGhToken(text);
                                } catch (err) {
                                    alert("Clipboard access denied. Please type manually.");
                                }
                            }}
                            className="p-1.5 hover:bg-gray-700 rounded-lg text-gray-400 transition-colors"
                            title="Paste"
                        >
                            <Clipboard size={14} />
                        </button>
                        <button 
                            onClick={() => setShowGhToken(!showGhToken)}
                            className="p-1.5 hover:bg-gray-700 rounded-lg text-gray-400 transition-colors"
                        >
                            {showGhToken ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                    </div>
                 </div>
                 <p className="text-[10px] text-gray-600">This token is used once to create the repo and upload files. It is not saved.</p>
             </div>
             
             <div className="flex flex-col gap-1">
                 <label className="text-[10px] uppercase font-bold text-gray-500">Repository Name</label>
                 <input 
                    type="text" 
                    placeholder="my-chore-tracker" 
                    className="bg-black/40 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:border-white outline-none font-mono"
                    value={ghRepo}
                    onChange={(e) => setGhRepo(e.target.value)}
                 />
             </div>

             <div className="flex flex-col gap-1">
                 <label className="text-[10px] uppercase font-bold text-gray-500">Target Branch</label>
                 <div className="relative">
                    <input 
                        type="text" 
                        placeholder="main" 
                        className="w-full bg-black/40 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:border-white outline-none font-mono pl-10"
                        value={ghBranch}
                        onChange={(e) => setGhBranch(e.target.value)}
                    />
                    <GitBranch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                 </div>
                 <p className="text-[10px] text-gray-600">If the branch doesn't exist, it will be created from the default branch.</p>
             </div>

             <button 
                onClick={handleGithubUpload}
                disabled={isUploading}
                className="w-full bg-white hover:bg-gray-200 text-black py-3 rounded-xl text-sm font-bold transition-all mt-2 flex items-center justify-center gap-2 disabled:opacity-50"
             >
                 {isUploading ? <Activity className="animate-spin" size={16}/> : <Github size={16}/>}
                 {isUploading ? 'Uploading Project...' : 'Create Repo & Upload Project'}
             </button>
         </div>
      </section>

      {/* Migration / Recovery Section */}
      <section className="bg-gray-800/40 border border-gray-800 rounded-3xl p-6">
         <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2"> <Database size={20} className="text-purple-500" /> Cloud Tools </h2>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Export */}
             <div className="bg-gray-900/60 p-5 rounded-2xl border border-gray-800">
                 <h3 className="text-white font-bold mb-2 flex items-center gap-2"><Download size={16} className="text-blue-500"/> Local Export</h3>
                 <p className="text-[10px] text-gray-500 font-bold uppercase mb-4 leading-relaxed tracking-wide">Generate a secure JSON backup of your family data.</p>
                 <button onClick={handleExport} className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl text-sm font-bold transition-all mb-3">
                     <Copy size={14}/> Generate & Copy
                 </button>
                 {exportJson && (
                    <div className="relative">
                        <textarea 
                            readOnly 
                            className="w-full bg-black/40 border border-gray-800 rounded-xl text-[10px] text-gray-500 p-3 h-24 font-mono focus:outline-none scrollbar-hide"
                            value={exportJson}
                        />
                        <button onClick={() => setExportJson('')} className="absolute top-2 right-2 text-gray-600 hover:text-white">
                            <X size={14} />
                        </button>
                    </div>
                 )}
             </div>

             {/* Import */}
             <div className="bg-gray-900/60 p-5 rounded-2xl border border-gray-800">
                 <h3 className="text-white font-bold mb-2 flex items-center gap-2"><Upload size={16} className="text-purple-500"/> Restore Hub</h3>
                 <p className="text-[10px] text-gray-500 font-bold uppercase mb-4 leading-relaxed tracking-wide">Import existing family structures via valid JSON.</p>
                 <textarea 
                    className="w-full bg-black/40 border border-gray-800 rounded-xl text-[10px] text-gray-300 p-3 h-24 mb-3 font-mono outline-none focus:border-purple-500"
                    placeholder='Paste backup string...'
                    value={importJson}
                    onChange={(e) => setImportJson(e.target.value)}
                 />
                 <button 
                    onClick={handleImport} 
                    disabled={isImporting || !importJson}
                    className="w-full bg-purple-600 hover:bg-purple-500 disabled:bg-gray-800 disabled:text-gray-600 text-white py-3 rounded-xl text-sm font-bold transition-all"
                 >
                     {isImporting ? 'Processing...' : 'Restore Assets'}
                 </button>
             </div>
         </div>
      </section>
      
      <div className="text-center pt-8 border-t border-gray-800 text-gray-600 text-[10px] font-black uppercase tracking-widest">
          Instance ID: {appId}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#09090b] text-gray-200 p-4 pb-24 md:p-8">
      <div className="max-w-2xl mx-auto">
        {view === 'dashboard' && renderDashboard()}
        {view === 'chore_detail' && renderChoreDetail()}
        {view === 'settings' && renderSettings()}
        {view === 'stats' && renderStats()}
      </div>

      {/* Persistent Bottom Nav for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-900/80 backdrop-blur-xl border-t border-gray-800 px-6 py-4 flex justify-around items-center md:hidden z-50">
          <button onClick={() => setView('dashboard')} className={`flex flex-col items-center gap-1 ${view === 'dashboard' ? 'text-blue-500' : 'text-gray-500'}`}>
              <Activity size={20} />
              <span className="text-[8px] font-black uppercase tracking-widest">Home</span>
          </button>
          <button onClick={() => setView('stats')} className={`flex flex-col items-center gap-1 ${view === 'stats' ? 'text-purple-500' : 'text-gray-500'}`}>
              <Trophy size={20} />
              <span className="text-[8px] font-black uppercase tracking-widest">Stats</span>
          </button>
          <button onClick={() => setView('settings')} className={`flex flex-col items-center gap-1 ${view === 'settings' ? 'text-gray-200' : 'text-gray-500'}`}>
              <Settings size={20} />
              <span className="text-[8px] font-black uppercase tracking-widest">Admin</span>
          </button>
      </nav>
    </div>
  );
};

export default App;