import { Outlet, Link, useLocation } from 'react-router';
import { CheckSquare, Target, Trophy } from 'lucide-react';
import { UserStats } from '../lib/types';
import { motion } from 'motion/react';

interface LayoutProps {
  stats: UserStats;
}

export function Layout({ stats }: LayoutProps) {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Daily Tasks', icon: CheckSquare },
    { path: '/monthly', label: 'Monthly Goals', icon: Target },
    { path: '/profile', label: 'Profile', icon: Trophy },
  ];

  const activeItem = navItems.find(item => item.path === location.pathname) || navItems[0];


  const pointsToNextLevel = ((stats.level) * 100) - stats.points;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-start justify-between gap-4 sm:items-center">
            <div className="flex items-center gap-2">
              <img src="/logo.svg" alt="Logo" className="w-8 h-8" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                GoalQuest
              </h1>
            </div>
<div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
                <div className="flex items-center justify-center sm:justify-start gap-2 bg-gradient-to-r from-yellow-100 to-yellow-50 px-3 py-1.5 rounded-full">
                  <span className="text-base sm:text-lg">⚡</span>
                  <span className="text-sm sm:text-base font-semibold text-yellow-800">{stats.points} pts</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-2 bg-gradient-to-r from-blue-100 to-blue-50 px-3 py-1.5 rounded-full">
                  <span className="text-base sm:text-lg">🏅</span>
                  <span className="text-sm sm:text-base font-semibold text-blue-800">Level {stats.level}</span>
                </div>
                {stats.streak > 0 && (
                  <div className="flex items-center justify-center sm:justify-start gap-2 bg-gradient-to-r from-orange-100 to-orange-50 px-3 py-1.5 rounded-full">
                    <span className="text-base sm:text-lg">🔥</span>
                    <span className="text-sm sm:text-base font-semibold text-orange-800">{stats.streak} days</span>
                  </div>
                )}
              </div>
          </div>
          {/* Progress bar */}
          <div className="mt-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-600">Level {stats.level}</span>
              <span className="text-xs text-gray-600">{pointsToNextLevel} pts to next level</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${((stats.points % 100) / 100) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                    isActive
                      ? 'border-blue-600 text-blue-600 font-medium'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                    <Icon size={18} />
                    <span className="hidden sm:block">
                      {item.label}
                    </span>
                 </Link>
               );
             })}
           </div>
         </div>
       </nav>

       {/* Main content */}
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="sm:hidden mb-6">
            <motion.div 
              key={activeItem.path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <h2 className="text-xl font-bold text-gray-900">{activeItem.label}</h2>
            </motion.div>
          </div>
          <Outlet />
        </main>

    </div>
  );
}
