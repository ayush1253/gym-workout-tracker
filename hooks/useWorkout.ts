'use client'

import { useState, useEffect } from 'react';
import { Workout, WorkoutExercise, Exercise, ProgressData } from '@/types';
import { storage } from '@/utils/storage';

export const useWorkout = () => {
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);

  useEffect(() => {
    const savedWorkout = storage.getCurrentWorkout();
    const savedWorkouts = storage.getWorkouts();
    
    setCurrentWorkout(savedWorkout);
    setWorkouts(savedWorkouts);
    setIsWorkoutActive(!!savedWorkout);
  }, []);

  const startWorkout = (name: string = 'New Workout') => {
    const workout: Workout = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      name,
      exercises: [],
      duration: 0,
      totalVolume: 0,
      completed: false
    };
    
    setCurrentWorkout(workout);
    setIsWorkoutActive(true);
    storage.saveCurrentWorkout(workout);
  };

  const addExerciseToWorkout = (exercise: Exercise) => {
    if (!currentWorkout) return;

    const workoutExercise: WorkoutExercise = {
      exerciseId: exercise.id,
      exercise,
      sets: [{ reps: 0, weight: 0, completed: false }]
    };

    const updatedWorkout = {
      ...currentWorkout,
      exercises: [...currentWorkout.exercises, workoutExercise]
    };

    setCurrentWorkout(updatedWorkout);
    storage.saveCurrentWorkout(updatedWorkout);
  };

  const updateSet = (exerciseIndex: number, setIndex: number, field: 'reps' | 'weight', value: number) => {
    if (!currentWorkout) return;

    const updatedWorkout = { ...currentWorkout };
    updatedWorkout.exercises[exerciseIndex].sets[setIndex][field] = value;

    setCurrentWorkout(updatedWorkout);
    storage.saveCurrentWorkout(updatedWorkout);
  };

  const completeSet = (exerciseIndex: number, setIndex: number) => {
    if (!currentWorkout) return;

    const updatedWorkout = { ...currentWorkout };
    updatedWorkout.exercises[exerciseIndex].sets[setIndex].completed = true;

    setCurrentWorkout(updatedWorkout);
    storage.saveCurrentWorkout(updatedWorkout);
  };

  const addSet = (exerciseIndex: number) => {
    if (!currentWorkout) return;

    const updatedWorkout = { ...currentWorkout };
    const lastSet = updatedWorkout.exercises[exerciseIndex].sets.slice(-1)[0];
    
    updatedWorkout.exercises[exerciseIndex].sets.push({
      reps: lastSet?.reps || 0,
      weight: lastSet?.weight || 0,
      completed: false
    });

    setCurrentWorkout(updatedWorkout);
    storage.saveCurrentWorkout(updatedWorkout);
  };

  const removeSet = (exerciseIndex: number, setIndex: number) => {
    if (!currentWorkout) return;

    const updatedWorkout = { ...currentWorkout };
    updatedWorkout.exercises[exerciseIndex].sets.splice(setIndex, 1);

    setCurrentWorkout(updatedWorkout);
    storage.saveCurrentWorkout(updatedWorkout);
  };

  const finishWorkout = () => {
    if (!currentWorkout) return;

    const totalVolume = currentWorkout.exercises.reduce((total, exercise) => {
      return total + exercise.sets.reduce((exerciseTotal, set) => {
        return exerciseTotal + (set.completed ? set.reps * set.weight : 0);
      }, 0);
    }, 0);

    const completedWorkout: Workout = {
      ...currentWorkout,
      completed: true,
      totalVolume,
      duration: Math.floor((Date.now() - new Date(currentWorkout.date).getTime()) / 1000)
    };

    // Save to workouts history
    storage.addWorkout(completedWorkout);
    
    // Save progress data
    currentWorkout.exercises.forEach(exercise => {
      exercise.sets.forEach(set => {
        if (set.completed) {
          const progressData: ProgressData = {
            date: completedWorkout.date,
            exerciseId: exercise.exerciseId,
            weight: set.weight,
            reps: set.reps,
            volume: set.weight * set.reps,
            oneRepMax: storage.calculateOneRepMax(set.weight, set.reps)
          };
          storage.addProgressData(progressData);
        }
      });
    });

    // Clear current workout
    setCurrentWorkout(null);
    setIsWorkoutActive(false);
    storage.saveCurrentWorkout(null);
    
    // Refresh workouts list
    setWorkouts(storage.getWorkouts());
  };

  const cancelWorkout = () => {
    setCurrentWorkout(null);
    setIsWorkoutActive(false);
    storage.saveCurrentWorkout(null);
  };

  return {
    currentWorkout,
    workouts,
    isWorkoutActive,
    startWorkout,
    addExerciseToWorkout,
    updateSet,
    completeSet,
    addSet,
    removeSet,
    finishWorkout,
    cancelWorkout
  };
};