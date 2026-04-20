import { useState } from 'react';
import { Plus, Trash2, Circle, CheckCircle2, Calendar } from 'lucide-react';
import { Task } from '../lib/types';
import { motion, AnimatePresence } from 'motion/react';

interface MonthlyGoalsProps {
  tasks: Task[];
  onAddTask: (title: string, priority: 'low' | 'medium' | 'high') => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export function MonthlyGoals({ tasks, onAddTask, onToggleTask, onDeleteTask }: MonthlyGoalsProps) {
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const monthlyGoals = tasks.filter(task => task.type === 'monthly');
  const currentMonth = new Date().toISOString().slice(0, 7);
  const thisMonthGoals = monthlyGoals.filter(task => task.createdAt.startsWith(currentMonth));
  const completedThisMonth = thisMonthGoals.filter(task => task.completed).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGoalTitle.trim()) {
      onAddTask(newGoalTitle.trim(), priority);
      setNewGoalTitle('');
      setPriority('medium');
    }
  };

  const priorityColors = {
    low: 'bg-green-100 text-green-800 border-green-300',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    high: 'bg-red-100 text-red-800 border-red-300',
  };

  const monthName = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6">
      {/* Stats card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-md p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{monthName}</h2>
            <p className="text-sm text-gray-600 mt-1">Monthly Goals Progress</p>
          </div>
          <div className="text-3xl">🎯</div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">
                {completedThisMonth} of {thisMonthGoals.length} goals completed
              </span>
              <span className="text-sm font-bold text-purple-600">
                {thisMonthGoals.length > 0 ? Math.round((completedThisMonth / thisMonthGoals.length) * 100) : 0}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${thisMonthGoals.length > 0 ? (completedThisMonth / thisMonthGoals.length) * 100 : 0}%` }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Add goal form */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-md p-6"
      >
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Add New Monthly Goal</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={newGoalTitle}
              onChange={(e) => setNewGoalTitle(e.target.value)}
              placeholder="What's your goal for this month?"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
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
               className="flex items-center justify-center gap-2 px-6 py-2 w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-md hover:shadow-lg"
             >
              <Plus size={18} />
              Add Goal
            </button>
          </div>
        </form>
      </motion.div>

      {/* Goals list */}
      <div className="space-y-3">
        <AnimatePresence>
          {thisMonthGoals.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-xl shadow-md p-12 text-center"
            >
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No monthly goals yet</h3>
              <p className="text-gray-600">Set your first goal for this month!</p>
            </motion.div>
          ) : (
             thisMonthGoals.map((goal, index) => (
               <motion.div
                 key={goal.id}
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: 20 }}
                 transition={{ delay: index * 0.05 }}
                 onClick={() => onToggleTask(goal.id)}
                 className={`bg-white rounded-xl shadow-md p-4 flex items-center gap-4 group cursor-pointer hover:shadow-lg transition-all ${
                   goal.completed ? 'opacity-60' : ''
                 }`}
               >
                 <div
                   className="flex-shrink-0"
                 >
                   {goal.completed ? (
                     <CheckCircle2 className="text-purple-500" size={24} />
                   ) : (
                     <Circle className="text-gray-400 hover:text-purple-500 transition-colors" size={24} />
                   )}
                 </div>
                  <div className="flex-1">
                    <p className={`font-medium ${goal.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      {goal.title}
                    </p>
                     {goal.completed && goal.completedAt && (
                        <div className="flex items-start gap-1 mt-1 text-xs text-gray-500">
                          <Calendar size={12} className="mt-0.5" />
                          <span className="hidden sm:inline">Completed on </span>{new Date(goal.completedAt).toLocaleDateString()}
                        </div>
                     )}
 
                    {!goal.completed && (
                       <div className="flex items-start gap-1 mt-1 text-xs text-gray-500">
                         <div className="w-2 h-2 rounded-full bg-blue-500 mt-1" />
                         {tasks.filter(t => t.type === 'daily' && t.goalId === goal.id && t.completed).length} of {tasks.filter(t => t.type === 'daily' && t.goalId === goal.id).length} daily tasks completed
                       </div>
                    )}
                  </div>
                 <span className={`px-3 py-1 rounded-full text-xs font-medium border ${priorityColors[goal.priority]}`}>
                   {goal.priority}
                 </span>
                 <button
                   onClick={(e) => {
                     e.stopPropagation();
                     onDeleteTask(goal.id);
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
