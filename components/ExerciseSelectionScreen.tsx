'use client'

import React, { useState } from 'react';
import { Search, Plus, Filter } from 'lucide-react';
import { Exercise } from '@/types';
import { exercises, categories, muscleGroupColors } from '@/data/exercises';

interface ExerciseSelectionScreenProps {
  onExerciseSelect: (exercise: Exercise) => void;
  onStartWorkout: () => void;
  isWorkoutActive: boolean;
}

export const ExerciseSelectionScreen: React.FC<ExerciseSelectionScreenProps> = ({
  onExerciseSelect,
  onStartWorkout,
  isWorkoutActive
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || exercise.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleExerciseSelect = (exercise: Exercise) => {
    if (!isWorkoutActive) {
      onStartWorkout();
    }
    onExerciseSelect(exercise);
  };

  return (
    <div className="flex-1 bg-gray-950 text-white p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Exercise Library</h1>
        
        {!isWorkoutActive && (
          <button
            onClick={onStartWorkout}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold mb-4 flex items-center justify-center gap-2 hover:from-blue-600 hover:to-purple-700 transition-all"
          >
            <Plus size={20} />
            Start New Workout
          </button>
        )}

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search exercises..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-800 text-white pl-10 pr-4 py-3 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              !selectedCategory 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                selectedCategory === category 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Exercise List */}
      <div className="space-y-3">
        {filteredExercises.map(exercise => (
          <div
            key={exercise.id}
            onClick={() => handleExerciseSelect(exercise)}
            className="bg-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-700 transition-colors border border-gray-700 hover:border-gray-600"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${
                    muscleGroupColors[exercise.muscleGroup as keyof typeof muscleGroupColors] || 'from-gray-500 to-gray-600'
                  }`} />
                  <h3 className="font-semibold text-lg">{exercise.name}</h3>
                </div>
                <p className="text-gray-400 text-sm mb-1">{exercise.description}</p>
                <div className="flex gap-4 text-xs text-gray-500">
                  <span>• {exercise.category}</span>
                  <span>• {exercise.equipment}</span>
                </div>
              </div>
              <Plus className="text-gray-400 hover:text-white transition-colors" size={20} />
            </div>
          </div>
        ))}
      </div>

      {filteredExercises.length === 0 && (
        <div className="text-center py-12">
          <Filter className="mx-auto text-gray-600 mb-4" size={48} />
          <p className="text-gray-400">No exercises found matching your criteria</p>
        </div>
      )}
    </div>
  );
};