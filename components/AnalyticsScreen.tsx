'use client'

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, ResponsiveContainer } from 'recharts';
import { TrendingUp, Target, Award } from 'lucide-react';
import { ProgressData } from '@/types';
import { storage } from '@/utils/storage';
import { exercises } from '@/data/exercises';

export const AnalyticsScreen: React.FC = () => {
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [selectedExercise, setSelectedExercise] = useState('');

  useEffect(() => {
    setProgressData(storage.getProgress());
  }, []);

  const getVolumeOverTime = () => {
    const volumeByDate = progressData.reduce((acc, data) => {
      const date = new Date(data.date).toLocaleDateString();
      acc[date] = (acc[date] || 0) + data.volume;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(volumeByDate)
      .map(([date, volume]) => ({ date, volume }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-10); // Last 10 workouts
  };

  const getExerciseProgress = (exerciseId: string) => {
    return progressData
      .filter(data => data.exerciseId === exerciseId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(data => ({
        date: new Date(data.date).toLocaleDateString(),
        weight: data.weight,
        oneRepMax: data.oneRepMax,
        volume: data.volume
      }));
  };

  const getTopExercises = () => {
    const exerciseVolumes = progressData.reduce((acc, data) => {
      acc[data.exerciseId] = (acc[data.exerciseId] || 0) + data.volume;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(exerciseVolumes)
      .map(([exerciseId, volume]) => ({
        exerciseId,
        name: exercises.find(e => e.id === exerciseId)?.name || exerciseId,
        volume
      }))
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 5);
  };

  const getPersonalRecords = () => {
    const records = progressData.reduce((acc, data) => {
      const current = acc[data.exerciseId];
      if (!current || data.oneRepMax > current.oneRepMax) {
        acc[data.exerciseId] = data;
      }
      return acc;
    }, {} as Record<string, ProgressData>);

    return Object.values(records)
      .map(record => ({
        ...record,
        exerciseName: exercises.find(e => e.id === record.exerciseId)?.name || record.exerciseId
      }))
      .sort((a, b) => b.oneRepMax - a.oneRepMax)
      .slice(0, 5);
  };

  const volumeData = getVolumeOverTime();
  const topExercises = getTopExercises();
  const personalRecords = getPersonalRecords();
  const exerciseProgressData = selectedExercise ? getExerciseProgress(selectedExercise) : [];

  const availableExercises = [...new Set(progressData.map(d => d.exerciseId))]
    .map(id => ({
      id,
      name: exercises.find(e => e.id === id)?.name || id
    }));

  return (
    <div className="flex-1 bg-gray-950 text-white p-4 overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Analytics</h1>
      </div>

      {progressData.length === 0 ? (
        <div className="text-center py-12">
          <TrendingUp className="mx-auto text-gray-600 mb-4" size={48} />
          <p className="text-gray-400 mb-2">No workout data yet</p>
          <p className="text-gray-500 text-sm">Complete some workouts to see your progress</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Volume Over Time */}
          {volumeData.length > 0 && (
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="text-blue-400" size={20} />
                Volume Over Time
              </h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={volumeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
                    <YAxis stroke="#9CA3AF" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="volume" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Exercise Progress */}
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Target className="text-green-400" size={20} />
              Exercise Progress
            </h2>
            
            <select
              value={selectedExercise}
              onChange={(e) => setSelectedExercise(e.target.value)}
              className="w-full bg-gray-700 text-white p-2 rounded-lg border border-gray-600 mb-4"
            >
              <option value="">Select an exercise</option>
              {availableExercises.map(exercise => (
                <option key={exercise.id} value={exercise.id}>
                  {exercise.name}
                </option>
              ))}
            </select>

            {exerciseProgressData.length > 0 && (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={exerciseProgressData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
                    <YAxis stroke="#9CA3AF" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="oneRepMax" 
                      stroke="#10B981" 
                      strokeWidth={2}
                      dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Top Exercises by Volume */}
          {topExercises.length > 0 && (
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="text-purple-400" size={20} />
                Top Exercises by Volume
              </h2>
              <div className="space-y-3">
                {topExercises.map((exercise, index) => (
                  <div key={exercise.exerciseId} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400 text-sm w-6">#{index + 1}</span>
                      <span className="text-white">{exercise.name}</span>
                    </div>
                    <span className="text-purple-400 font-semibold">
                      {exercise.volume.toLocaleString()} kg
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Personal Records */}
          {personalRecords.length > 0 && (
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Award className="text-yellow-400" size={20} />
                Personal Records (1RM)
              </h2>
              <div className="space-y-3">
                {personalRecords.map((record, index) => (
                  <div key={record.exerciseId} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400 text-sm w-6">#{index + 1}</span>
                      <span className="text-white">{record.exerciseName}</span>
                    </div>
                    <span className="text-yellow-400 font-semibold">
                      {record.oneRepMax} kg
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};