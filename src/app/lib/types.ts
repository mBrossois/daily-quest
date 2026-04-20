export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
  priority: 'low' | 'medium' | 'high';
  type: 'daily' | 'monthly';
  goalId?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface UserStats {
  points: number;
  level: number;
  streak: number;
  lastActiveDate: string;
  totalTasksCompleted: number;
  dailyTasksCompleted: number;
  monthlyGoalsCompleted: number;
  achievements: Achievement[];
}

export interface AppData {
  tasks: Task[];
  stats: UserStats;
}
