import { UserStats } from '../lib/types';
import { motion } from 'motion/react';
import { Trophy, Target, Flame, CheckCircle, Award } from 'lucide-react';

interface ProfileProps {
  stats: UserStats;
}

export function Profile({ stats }: ProfileProps) {
  const pointsToNextLevel = ((stats.level) * 100) - stats.points;
  const unlockedAchievements = stats.achievements.filter(a => a.unlocked);
  const lockedAchievements = stats.achievements.filter(a => !a.unlocked);

  const statCards = [
    {
      label: 'Total Tasks',
      value: stats.totalTasksCompleted,
      icon: CheckCircle,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100',
    },
    {
      label: 'Daily Tasks',
      value: stats.dailyTasksCompleted,
      icon: Target,
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-50 to-green-100',
    },
    {
      label: 'Monthly Goals',
      value: stats.monthlyGoalsCompleted,
      icon: Trophy,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100',
    },
    {
      label: 'Current Streak',
      value: `${stats.streak} days`,
      icon: Flame,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'from-orange-50 to-orange-100',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Level card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-md p-8"
      >
        <div className="text-center">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="inline-block text-7xl mb-4"
          >
            🏅
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Level {stats.level}</h2>
          <p className="text-gray-600 mb-6">{stats.points} total points</p>
          <div className="max-w-md mx-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Progress to Level {stats.level + 1}</span>
              <span className="text-sm font-semibold text-blue-600">{pointsToNextLevel} pts needed</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${((stats.points % 100) / 100) * 100}%` }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className={`bg-gradient-to-br ${stat.bgColor} rounded-xl shadow-md p-6`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`bg-gradient-to-br ${stat.color} p-3 rounded-xl`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Achievements */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-md p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <Award className="text-yellow-500" size={28} />
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Achievements</h3>
            <p className="text-sm text-gray-600">
              {unlockedAchievements.length} of {stats.achievements.length} unlocked
            </p>
          </div>
        </div>

        {/* Unlocked achievements */}
        {unlockedAchievements.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Unlocked</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {unlockedAchievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-300 rounded-lg p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h5 className="font-semibold text-gray-900">{achievement.title}</h5>
                      <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                      {achievement.unlockedAt && (
                        <p className="text-xs text-gray-500 mt-2">
                          Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Locked achievements */}
        {lockedAchievements.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Locked</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {lockedAchievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 opacity-60"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-3xl grayscale">{achievement.icon}</div>
                    <div className="flex-1">
                      <h5 className="font-semibold text-gray-700">{achievement.title}</h5>
                      <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
