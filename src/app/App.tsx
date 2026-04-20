import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import { Layout } from './components/Layout';
import { DailyTasks } from './components/DailyTasks';
import { MonthlyGoals } from './components/MonthlyGoals';
import { Profile } from './components/Profile';
import { loadData, saveData, updateStats } from './lib/storage';
import { Task } from './lib/types';
import { Toaster, toast } from 'sonner';
import confetti from 'canvas-confetti';

function App() {
  const [data, setData] = useState(() => loadData());

  // Set favicon and page title
  useEffect(() => {
    // Update page title
    document.title = 'Monthly Quest';
    
    // Create custom sword-in-checkbox favicon
    const favicon = document.querySelector('link[rel="icon"]') || document.createElement('link');
    favicon.setAttribute('rel', 'icon');
    favicon.setAttribute('href', '/src/app/assets/logo.svg');
    
    if (!document.querySelector('link[rel="icon"]')) {
      document.head.appendChild(favicon);
    }
  }, []);

  useEffect(() => {
    const updatedStats = updateStats(data.tasks, data.stats);
    if (JSON.stringify(updatedStats) !== JSON.stringify(data.stats)) {
      const newData = { ...data, stats: updatedStats };
      setData(newData);
      saveData(newData);
    }
  }, []);

  const handleAddTask = (title: string, priority: 'low' | 'medium' | 'high', type: 'daily' | 'monthly', goalId?: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      completed: false,
      createdAt: new Date().toISOString(),
      priority,
      type,
      goalId,
    };

    const newData = {
      ...data,
      tasks: [...data.tasks, newTask],
    };
    setData(newData);
    saveData(newData);
    toast.success(`${type === 'daily' ? 'Task' : 'Goal'} added!`);
  };

  const handleToggleTask = (id: string) => {
    const task = data.tasks.find(t => t.id === id);
    if (!task) return;

    const wasCompleted = task.completed;
    const isNowCompleted = !wasCompleted;
    const completionDate = isNowCompleted ? new Date().toISOString() : undefined;

    const updatedTasks = data.tasks.map(t => {
      if (t.id === id) {
        return { 
          ...t, 
          completed: isNowCompleted,
          completedAt: completionDate
        };
      }
      
      if (task.type === 'monthly' && t.type === 'daily' && t.goalId === id) {
        return {
          ...t,
          completed: isNowCompleted,
          completedAt: completionDate
        };
      }
      
      return t;
    });

    const updatedStats = updateStats(updatedTasks, data.stats);
    const newData = { tasks: updatedTasks, stats: updatedStats };
    
    setData(newData);
    saveData(newData);

    if (!wasCompleted) {
      const points = task.type === 'daily' ? 10 : 50;
      toast.success(`+${points} points! 🎉`);
      
      // Celebration effects
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      // Check for new achievements
      const oldAchievements = data.stats.achievements.filter(a => a.unlocked).length;
      const newAchievements = updatedStats.achievements.filter(a => a.unlocked).length;
      
      if (newAchievements > oldAchievements) {
        const newlyUnlocked = updatedStats.achievements.find(
          a => a.unlocked && !data.stats.achievements.find(old => old.id === a.id && old.unlocked)
        );
        if (newlyUnlocked) {
          setTimeout(() => {
            toast.success(`Achievement Unlocked: ${newlyUnlocked.title}! ${newlyUnlocked.icon}`, {
              duration: 5000,
            });
            confetti({
              particleCount: 150,
              spread: 100,
              origin: { y: 0.5 },
            });
          }, 500);
        }
      }

      // Check for level up
      if (updatedStats.level > data.stats.level) {
        setTimeout(() => {
          toast.success(`Level Up! You're now level ${updatedStats.level}! 🏅`, {
            duration: 5000,
          });
          confetti({
            particleCount: 200,
            spread: 120,
            origin: { y: 0.4 },
          });
        }, 1000);
      }
    } else {
      toast.info('Task uncompleted');
    }
  };

  const handleDeleteTask = (id: string) => {
    const updatedTasks = data.tasks.filter(t => t.id !== id);
    const updatedStats = updateStats(updatedTasks, data.stats);
    const newData = { tasks: updatedTasks, stats: updatedStats };
    
    setData(newData);
    saveData(newData);
    toast.info('Task deleted');
  };

  return (
    <BrowserRouter>
      <Toaster position="top-center" richColors />
      <Routes>
        <Route path="/" element={<Layout stats={data.stats} />}>
          <Route
            index
            element={
               <DailyTasks
                 tasks={data.tasks}
                 onAddTask={(title, priority, goalId) => handleAddTask(title, priority, 'daily', goalId)}
                 onToggleTask={handleToggleTask}
                 onDeleteTask={handleDeleteTask}
               />
            }
          />
          <Route
            path="monthly"
            element={
              <MonthlyGoals
                tasks={data.tasks}
                onAddTask={(title, priority) => handleAddTask(title, priority, 'monthly')}
                onToggleTask={handleToggleTask}
                onDeleteTask={handleDeleteTask}
              />
            }
          />
          <Route
            path="profile"
            element={<Profile stats={data.stats} />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
