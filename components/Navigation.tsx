'use client'

import React from 'react';
import { Dumbbell, Calendar, BarChart3, Play } from 'lucide-react';
import { Screen } from '@/types';

interface NavigationProps {
  currentScreen: Screen;
  onScreenChange: (screen: Screen) => void;
  isWorkoutActive: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentScreen,
  onScreenChange,
  isWorkoutActive
}) => {
  const navItems = [
    { id: 'exercises' as Screen, icon: Dumbbell, label: 'Exercises' },
    { id: 'workout' as Screen, icon: Play, label: 'Workout' },
    { id: 'history' as Screen, icon: Calendar, label: 'History' },
    { id: 'analytics' as Screen, icon: BarChart3, label: 'Analytics' }
  ];

  return (
    <nav className="bg-gray-900 border-t border-gray-800">
      <div className="flex justify-around items-center py-2">
        {navItems.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onScreenChange(id)}
            className={`flex flex-col items-center p-3 rounded-lg transition-colors relative ${
              currentScreen === id 
                ? 'text-blue-400 bg-gray-800' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <Icon size={24} />
            <span className="text-xs mt-1">{label}</span>
            {id === 'workout' && isWorkoutActive && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};