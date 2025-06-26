'use client'

import React, { useState, useEffect } from 'react';
import { Plus, Minus, Check, X, Timer, Trash2 } from 'lucide-react';
import { Workout } from '@/types';

interface ActiveWorkoutScreenProps {
  workout: Workout | null;
  onUpdateSet: (exerciseIndex: number, setIndex: number, field: 'reps' | 'weight', value: number) => void;
  onCompleteSet: (exerciseIndex: number, setIndex: number) => void;
  onAddSet: (exerciseIndex: number) => void;
  onRemoveSet: (exerciseIndex: number, setIndex: number) => void;
  onFinishWorkout: () => void;
  onCancelWorkout: () => void;
}

export const ActiveWorkoutScreen: React.FC<ActiveWorkoutScreenProps> = ({
  workout,
  onUpdateSet,
  onCompleteSet,
  onAddSet,
  onRemoveSet,
  onFinishWorkout,
  onCancelWorkout
}) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [restTimer, setRestTimer] = useState<number | null>(null);
  const [restTimeLeft, setRestTimeLeft] = useState(0);

  useEffect(() => {
    if (!workout) return;

    const interval = setInterval(() => {
      const start = new Date(workout.date).getTime();
      const now = Date.now();
      setElapsedTime(Math.floor((now - start) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [workout]);

  useEffect(() => {
    if (restTimer === null) return;

    const interval = setInterval(() => {
      setRestTimeLeft(prev => {
        if (prev <= 1) {
          setRestTimer(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [restTimer]);

  const startRestTimer = (seconds: number = 90) => {
    setRestTimer(seconds);
    setRestTimeLeft(seconds);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateTotalVolume = () => {
    if (!workout) return 0;
    return workout.exercises.reduce((total, exercise) => {
      return total + exercise.sets.reduce((exerciseTotal, set) => {
        return exerciseTotal + (set.completed ? set.reps * set.weight : 0);
      }, 0);
    }, 0);
  };

  if (!workout) {
    return (
      <div className="flex-1 bg-gray-950 text-white p-4 flex items-center justify-center">
        <div className="text-center">
          <Timer className="mx-auto text-gray-600 mb-4" size={48} />
          <p className="text-gray-400">No active workout</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-950 text-white p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">{workout.name}</h1>
            <p className="text-gray-400">Duration: {formatTime(elapsedTime)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Total Volume</p>
            <p className="text-xl font-bold text-blue-400">{calculateTotalVolume()} kg</p>
          </div>
        </div>

        {/* Rest Timer */}
        {restTimer !== null && (
          <div className="bg-orange-900 border border-orange-700 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-orange-200">Rest Timer</span>
              <div className="flex items-center gap-2">
                <span className="text-orange-100 font-mono text-lg">
                  {formatTime(restTimeLeft)}
                </span>
                <button
                  onClick={() => setRestTimer(null)}
                  className="text-orange-300 hover:text-orange-100"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onFinishWorkout}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors"
          >
            Finish Workout
          </button>
          <button
            onClick={onCancelWorkout}
            className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Exercises */}
      <div className="space-y-6">
        {workout.exercises.map((workoutExercise, exerciseIndex) => (
          <div key={exerciseIndex} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h3 className="text-lg font-semibold mb-4">{workoutExercise.exercise.name}</h3>
            
            {/* Sets */}
            <div className="space-y-3">
              {workoutExercise.sets.map((set, setIndex) => (
                <div key={setIndex} className="flex items-center gap-3 p-3 bg-gray-900 rounded-lg">
                  <span className="text-gray-400 text-sm w-8">#{setIndex + 1}</span>
                  
                  {/* Weight Input */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onUpdateSet(exerciseIndex, setIndex, 'weight', Math.max(0, set.weight - 2.5))}
                      className="text-gray-400 hover:text-white p-1"
                    >
                      <Minus size={16} />
                    </button>
                    <div className="text-center min-w-[60px]">
                      <input
                        type="number"
                        value={set.weight}
                        onChange={(e) => onUpdateSet(exerciseIndex, setIndex, 'weight', parseFloat(e.target.value) || 0)}
                        className="bg-transparent text-center text-white text-sm w-full border-none outline-none"
                      />
                      <span className="text-xs text-gray-500">kg</span>
                    </div>
                    <button
                      onClick={() => onUpdateSet(exerciseIndex, setIndex, 'weight', set.weight + 2.5)}
                      className="text-gray-400 hover:text-white p-1"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <span className="text-gray-500">×</span>

                  {/* Reps Input */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onUpdateSet(exerciseIndex, setIndex, 'reps', Math.max(0, set.reps - 1))}
                      className="text-gray-400 hover:text-white p-1"
                    >
                      <Minus size={16} />
                    </button>
                    <div className="text-center min-w-[40px]">
                      <input
                        type="number"
                        value={set.reps}
                        onChange={(e) => onUpdateSet(exerciseIndex, setIndex, 'reps', parseInt(e.target.value) || 0)}
                        className="bg-transparent text-center text-white text-sm w-full border-none outline-none"
                      />
                      <span className="text-xs text-gray-500">reps</span>
                    </div>
                    <button
                      onClick={() => onUpdateSet(exerciseIndex, setIndex, 'reps', set.reps + 1)}
                      className="text-gray-400 hover:text-white p-1"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 ml-auto">
                    {set.completed ? (
                      <div className="flex items-center gap-2">
                        <Check className="text-green-400" size={20} />
                        <button
                          onClick={() => startRestTimer()}
                          className="text-blue-400 hover:text-blue-300 p-1"
                        >
                          <Timer size={16} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          onCompleteSet(exerciseIndex, setIndex);
                          startRestTimer();
                        }}
                        className="text-gray-400 hover:text-green-400 p-1 transition-colors"
                      >
                        <Check size={20} />
                      </button>
                    )}
                    
                    {workoutExercise.sets.length > 1 && (
                      <button
                        onClick={() => onRemoveSet(exerciseIndex, setIndex)}
                        className="text-gray-400 hover:text-red-400 p-1 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Add Set Button */}
            <button
              onClick={() => onAddSet(exerciseIndex)}
              className="w-full mt-3 bg-gray-700 hover:bg-gray-600 text-gray-300 py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              Add Set
            </button>
          </div>
        ))}
      </div>

      {workout.exercises.length === 0 && (
        <div className="text-center py-12">
          <Timer className="mx-auto text-gray-600 mb-4" size={48} />
          <p className="text-gray-400 mb-2">No exercises added yet</p>
          <p className="text-gray-500 text-sm">Go to exercises tab to add some</p>
        </div>
      )}
    </div>
  );
};