// Helper functions for achievements and analytics views

const checkAchievements = (memberId: string, currentLogs: ChoreLog[]) => {
    const memberLogs = currentLogs.filter(l => l.memberId === memberId);
    const memberXP = memberLogs.reduce((sum, log) => {
        const chore = chores.find(c => c.id === log.choreId);
        return sum + (chore?.xp || 0);
    }, 0);

    ACHIEVEMENTS.forEach(achievement => {
        const alreadyUnlocked = memberAchievements.some(
            ma => ma.memberId === memberId && ma.achievementId === achievement.id
        );

        if (!alreadyUnlocked) {
            const progress = calculateAchievementProgress(
                achievement,
                memberLogs.map(l => ({ ...l, chore: chores.find(c => c.id === l.choreId) })),
                memberXP,
                members,
                currentLogs
            );

            if (progress >= 100) {
                const newAchievement: MemberAchievement = {
                    memberId,
                    achievementId: achievement.id,
                    unlockedAt: new Date(),
                    progress: 100
                };

                setMemberAchievements([...memberAchievements, newAchievement]);
                setUnlockedAchievement(achievement);
            }
        }
    });
};

const handleInstallPWA = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
        console.log('PWA installed');
    }
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
};

const renderAchievements = () => {
    const getMemberAchievementData = (memberId: string) => {
        const memberLogs = logs.filter(l => l.memberId === memberId);
        const memberXP = memberLogs.reduce((sum, log) => {
            const chore = chores.find(c => c.id === log.choreId);
            return sum + (chore?.xp || 0);
        }, 0);

        return ACHIEVEMENTS.map(achievement => {
            const memberAchiev = memberAchievements.find(
                ma => ma.memberId === memberId && ma.achievementId === achievement.id
            );
            const progress = calculateAchievementProgress(
                achievement,
                memberLogs.map(l => ({ ...l, chore: chores.find(c => c.id === log.choreId) })),
                memberXP,
                members,
                logs
            );

            return {
                achievement,
                memberAchievement: memberAchiev,
                progress
            };
        });
    };

    const currentMemberId = selectedAchievementMemberId || (members.length > 0 ? members[0].id : null);
    const achievementData = currentMemberId ? getMemberAchievementData(currentMemberId) : [];
    const unlockedCount = achievementData.filter(a => a.memberAchievement).length;

    const groupedByTier = {
        legendary: achievementData.filter(a => a.achievement.tier === 'legendary'),
        platinum: achievementData.filter(a => a.achievement.tier === 'platinum'),
        gold: achievementData.filter(a => a.achievement.tier === 'gold'),
        silver: achievementData.filter(a => a.achievement.tier === 'silver'),
        bronze: achievementData.filter(a => a.achievement.tier === 'bronze')
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => setView('dashboard')}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-colors border border-gray-700"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back</span>
                    </button>

                    <div className="flex items-center gap-3">
                        <Medal className="w-8 h-8 text-yellow-400" />
                        <h1 className="text-4xl font-black">Achievements</h1>
                    </div>

                    <div className="w-32" />
                </div>

                <div className="bg-gray-900/60 border border-gray-700 rounded-xl p-6 mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-gray-400 text-sm uppercase tracking-wide mb-1">Progress</div>
                            <div className="text-4xl font-black">
                                {unlockedCount}/{ACHIEVEMENTS.length}
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-gray-400 text-sm">Completion Rate</div>
                            <div className="text-2xl font-bold text-purple-400">
                                {((unlockedCount / ACHIEVEMENTS.length) * 100).toFixed(1)}%
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 h-3 bg-gray-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
                            style={{ width: `${(unlockedCount / ACHIEVEMENTS.length) * 100}%` }}
                        />
                    </div>
                </div>

                {members.length > 1 && (
                    <div className="flex gap-2 mb-6">
                        {members.map(member => (
                            <button
                                key={member.id}
                                onClick={() => setSelectedAchievementMemberId(member.id)}
                                className="px-4 py-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 transition-colors"
                                style={{ borderColor: currentMemberId === member.id ? member.color : undefined }}
                            >
                                {member.name}
                            </button>
                        ))}
                    </div>
                )}

                {Object.entries(groupedByTier).map(([tier, achievements]) => {
                    if (achievements.length === 0) return null;

                    return (
                        <div key={tier} className="mb-8">
                            <h2 className="text-2xl font-bold mb-4 capitalize flex items-center gap-2">
                                <Trophy className="w-6 h-6" />
                                {tier} Achievements
                                <span className="text-sm text-gray-400 font-normal">
                                    ({achievements.filter(a => a.memberAchievement).length}/{achievements.length})
                                </span>
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {achievements.map(({ achievement, memberAchievement, progress }) => (
                                    <AchievementCard
                                        key={achievement.id}
                                        achievement={achievement}
                                        memberAchievement={memberAchievement}
                                        progress={progress}
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {unlockedAchievement && (
                <AchievementUnlockModal
                    achievement={unlockedAchievement}
                    onClose={() => setUnlockedAchievement(null)}
                />
            )}
        </div>
    );
};

const renderAnalytics = () => {
    const analytics = calculateAnalytics(logs, chores, members, analyticsPeriod);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => setView('dashboard')}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-colors border border-gray-700"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back</span>
                    </button>

                    <div className="flex items-center gap-3">
                        <BarChart3 className="w-8 h-8 text-blue-400" />
                        <h1 className="text-4xl font-black">Analytics</h1>
                    </div>

                    <div className="w-32" />
                </div>

                <div className="flex gap-2 mb-6">
                    {(['week', 'month', 'year', 'all'] as const).map(period => (
                        <button
                            key={period}
                            onClick={() => setAnalyticsPeriod(period)}
                            className={`
                px-4 py-2 rounded-lg font-semibold capitalize transition-all
                ${analyticsPeriod === period
                                    ? 'bg-purple-500 text-white'
                                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
                                }
              `}
                        >
                            {period}
                        </button>
                    ))}
                </div>

                <AnalyticsCharts metrics={analytics} />
            </div>
        </div>
    );
};
