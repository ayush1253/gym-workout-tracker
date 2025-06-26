'use client'

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Target, TrendingUp } from 'lucide-react';
import { Workout } from '@/types';
import { storage } from '@/utils/storage';

export const WorkoutHistoryScreen: React.FC = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  useEffect(() => {
    setWorkouts(storage.getWorkouts().reverse()); // Most recent first
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    
    if (hours > 0) {
      return `${hours}h ${remainingMins}m`;
    }
    return `${remainingMins}m`;
  };

  const getWorkoutStats = () => {
    const total = workouts.length;
    const thisWeek = workouts.filter(w => {
      const workoutDate = new Date(w.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return workoutDate > weekAgo;
    }).length;
    
    const totalVolume = workouts.reduce((sum, w) => sum + w.totalVolume, 0);
    const avgDuration = workouts.length > 0 ? 
      workouts.reduce((sum, w) => sum + w.duration, 0) / workouts.length : 0;

    return { total, thisWeek, totalVolume, avgDuration };
  };

  const stats = getWorkoutStats();

  return (
    <div className="flex-1 bg-gray-950 text-white p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Workout History</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <Target className="text-blue-400" size={20} />
              <span className="text-gray-400 text-sm">Total Workouts</span>
            </div>
            <p className="text-2xl font-bold text-blue-400">{stats.total}</p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="text-green-400" size={20} />
              <span className="text-gray-400 text-sm">This Week</span>
            </div>
            <p className="text-2xl font-bold text-green-400">{stats.thisWeek}</p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <Target className="text-purple-400" size={20} />
              <span className="text-gray-400 text-sm">Total Volume</span>
            </div>
            <p className="text-2xl font-bold text-purple-400">{stats.totalVolume.toLocaleString()} kg</p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="text-orange-400" size={20} />
              <span className="text-gray-400 text-sm">Avg Duration</span>
            </div>
            <p className="text-2xl font-bold text-orange-400">{formatTime(stats.avgDuration)}</p>
          </div>
        </div>
      </div>

      {/* Workout List */}
      <div className="space-y-4">
        {workouts.map(workout => (
          <div key={workout.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-lg">{workout.name}</h3>
                <p className="text-gray-400 text-sm">{formatDate(workout.date)}</p>
              </div>
              <div className="text-right">
                <p className="text-blue-400 font-semibold">{workout.totalVolume} kg</p>
                <p className="text-gray-400 text-sm">{formatTime(workout.duration)}</p>
              </div>
            </div>
            
            {/* Exercise Summary */}
            <div className="space-y-2">
              {workout.exercises.map((exercise, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">{exercise.exercise.name}</span>
                  <span className="text-gray-400">
                    {exercise.sets.filter(s => s.completed).length} sets
                  </span>
                </div>
              ))}
            </div>
            
            {workout.exercises.length === 0 && (
              <p className="text-gray-500 text-sm italic">No exercises recorded</p>
            )}
          </div>
        ))}
      </div>

      {workouts.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="mx-auto text-gray-600 mb-4" size={48} />
          <p className="text-gray-400 mb-2">No workouts recorded yet</p>
          <p className="text-gray-500 text-sm">Start your first workout to see it here</p>
        </div>
      )}
    </div>
  );
};