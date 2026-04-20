import { useState } from 'react';
import { Plus, Trash2, Circle, CheckCircle2, Calendar } from 'lucide-react';
import { Task } from '../lib/types';
import { motion, AnimatePresence } from 'motion/react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface DailyTasksProps {
  tasks: Task[];
  onAddTask: (title: string, priority: 'low' | 'medium' | 'high', goalId?: string) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export function DailyTasks({ tasks, onAddTask, onToggleTask, onDeleteTask }: DailyTasksProps) {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [selectedGoalId, setSelectedGoalId] = useState<string>('');

  const dailyTasks = tasks.filter(task => task.type === 'daily');
  const monthlyGoals = tasks.filter(task => task.type === 'monthly');
  const today = new Date().toISOString().split('T')[0];
  const todayTasks = dailyTasks.filter(task => task.createdAt.startsWith(today));
  const completedToday = todayTasks.filter(task => task.completed).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      const goalId = (selectedGoalId === 'none' || selectedGoalId === '') ? undefined : selectedGoalId;
      onAddTask(newTaskTitle.trim(), priority, goalId);
      setNewTaskTitle('');
      setPriority('medium');
      setSelectedGoalId('');
    }
  };

  const priorityColors = {
    low: 'bg-green-100 text-green-800 border-green-300',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    high: 'bg-red-100 text-red-800 border-red-300',
  };

  return (
    <div className="space-y-6">
      {/* Stats card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-md p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Today's Progress</h2>
          <div className="text-3xl">📅</div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">
                {completedToday} of {todayTasks.length} tasks completed
              </span>
              <span className="text-sm font-bold text-blue-600">
                {todayTasks.length > 0 ? Math.round((completedToday / todayTasks.length) * 100) : 0}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${todayTasks.length > 0 ? (completedToday / todayTasks.length) * 100 : 0}%` }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Add task form */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-md p-6"
      >
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Add New Task</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="What do you want to accomplish today?"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <Select
              value={selectedGoalId}
              onValueChange={(value) => setSelectedGoalId(value)}
            >
              <SelectTrigger className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <SelectValue placeholder="No linked monthly goal (Optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No linked monthly goal (Optional)</SelectItem>
                {monthlyGoals.map(goal => (
                  <SelectItem key={goal.id} value={goal.id}>
                    {goal.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
           <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex gap-2 flex-1">
              {(['low', 'medium', 'high'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                   className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all ${
                    priority === p
                      ? priorityColors[p]
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
             <button
               type="submit"
               className="flex items-center justify-center gap-2 px-6 py-2 w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
             >
              <Plus size={18} />
              Add Task
            </button>
          </div>
        </form>
      </motion.div>

      {/* Task list */}
      <div className="space-y-3">
        <AnimatePresence>
          {todayTasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-xl shadow-md p-12 text-center"
            >
              <div className="text-6xl mb-4">✨</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No tasks yet</h3>
              <p className="text-gray-600">Add your first task to get started!</p>
            </motion.div>
          ) : (
            todayTasks.map((task, index) => (
               <motion.div
                 key={task.id}
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: 20 }}
                 transition={{ delay: index * 0.05 }}
                 onClick={() => onToggleTask(task.id)}
                 className={`bg-white rounded-xl shadow-md p-4 flex items-center gap-4 group cursor-pointer hover:shadow-lg transition-all ${
                   task.completed ? 'opacity-60' : ''
                 }`}
               >
                 <div
                   className="flex-shrink-0"
                 >
                   {task.completed ? (
                     <CheckCircle2 className="text-green-500" size={24} />
                   ) : (
                     <Circle className="text-gray-400 hover:text-blue-500 transition-colors" size={24} />
                   )}
                 </div>
                 <div className="flex-1">
                    <p className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      {task.title}
                    </p>
                    {task.completed && task.completedAt && (
                       <div className="flex items-start gap-1 mt-1 text-xs text-gray-500">
                         <Calendar size={12} className="mt-0.5" />
                         <span className="hidden sm:inline">Completed on </span>{new Date(task.completedAt).toLocaleDateString()}
                       </div>
                    )}
                 </div>
                 <span className={`px-3 py-1 rounded-full text-xs font-medium border ${priorityColors[task.priority]}`}>
                   {task.priority}
                 </span>
                 <button
                   onClick={(e) => {
                     e.stopPropagation();
                     onDeleteTask(task.id);
                   }}
                   className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                 >
                   <Trash2 size={18} />
                 </button>
               </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
