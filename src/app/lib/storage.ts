import { AppData, UserStats, Task, Achievement } from './types';

const STORAGE_KEY = 'todo_app_data';

const defaultAchievements: Achievement[] = [
  { id: 'first_task', title: 'First Steps', description: 'Complete your first task', icon: '🎯', unlocked: false },
  { id: 'streak_3', title: 'On Fire', description: 'Maintain a 3-day streak', icon: '🔥', unlocked: false },
  { id: 'streak_7', title: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '⚡', unlocked: false },
  { id: 'streak_30', title: 'Monthly Master', description: 'Maintain a 30-day streak', icon: '👑', unlocked: false },
  { id: 'level_5', title: 'Rising Star', description: 'Reach level 5', icon: '⭐', unlocked: false },
  { id: 'level_10', title: 'Expert', description: 'Reach level 10', icon: '💎', unlocked: false },
  { id: 'tasks_10', title: 'Getting Started', description: 'Complete 10 tasks', icon: '✅', unlocked: false },
  { id: 'tasks_50', title: 'Productive', description: 'Complete 50 tasks', icon: '🚀', unlocked: false },
  { id: 'tasks_100', title: 'Unstoppable', description: 'Complete 100 tasks', icon: '🏆', unlocked: false },
  { id: 'monthly_goal', title: 'Goal Crusher', description: 'Complete your first monthly goal', icon: '🎖️', unlocked: false },
];

const defaultStats: UserStats = {
  points: 0,
  level: 1,
  streak: 0,
  lastActiveDate: '',
  totalTasksCompleted: 0,
  dailyTasksCompleted: 0,
  monthlyGoalsCompleted: 0,
  achievements: defaultAchievements,
};

export function loadData(): AppData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      // Ensure achievements exist
      if (!data.stats.achievements) {
        data.stats.achievements = defaultAchievements;
      }
      return data;
    }
  } catch (error) {
    console.error('Error loading data:', error);
  }
  return {
    tasks: [],
    stats: defaultStats,
  };
}

export function saveData(data: AppData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data:', error);
  }
}

export function updateStats(tasks: Task[], currentStats: UserStats): UserStats {
  const today = new Date().toISOString().split('T')[0];
  
  const completions = new Set(
    tasks
      .filter(t => t.completed && t.completedAt)
      .map(t => t.completedAt!.split('T')[0])
  );

  let streak = 0;
  const checkDate = new Date();
  
  if (!completions.has(today)) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (completions.has(checkDate.toISOString().split('T')[0])) {
    streak++;
    checkDate.setDate(checkDate.getDate() - 1);
  }

  const completedTasks = tasks.filter(task => task.completed);
  const totalTasksCompleted = completedTasks.length;
  const dailyTasksCompleted = completedTasks.filter(t => t.type === 'daily').length;
  const monthlyGoalsCompleted = completedTasks.filter(t => t.type === 'monthly').length;

  const points = dailyTasksCompleted * 10 + monthlyGoalsCompleted * 50;
  const level = Math.floor(points / 100) + 1;

  const achievements = [...currentStats.achievements];
  
  function unlockAchievement(id: string) {
    const achievement = achievements.find(a => a.id === id);
    if (achievement && !achievement.unlocked) {
      achievement.unlocked = true;
      achievement.unlockedAt = new Date().toISOString();
      return true;
    }
    return false;
  }

  if (totalTasksCompleted >= 1) unlockAchievement('first_task');
  if (totalTasksCompleted >= 10) unlockAchievement('tasks_10');
  if (totalTasksCompleted >= 50) unlockAchievement('tasks_50');
  if (totalTasksCompleted >= 100) unlockAchievement('tasks_100');
  if (monthlyGoalsCompleted >= 1) unlockAchievement('monthly_goal');
  if (streak >= 3) unlockAchievement('streak_3');
  if (streak >= 7) unlockAchievement('streak_7');
  if (streak >= 30) unlockAchievement('streak_30');
  if (level >= 5) unlockAchievement('level_5');
  if (level >= 10) unlockAchievement('level_10');

  return {
    points,
    level,
    streak,
    lastActiveDate: completions.size > 0 
      ? Array.from(completions).sort().reverse()[0] 
      : currentStats.lastActiveDate,
    totalTasksCompleted,
    dailyTasksCompleted,
    monthlyGoalsCompleted,
    achievements,
  };
}
