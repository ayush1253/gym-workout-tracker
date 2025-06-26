import { Workout, ProgressData, UserPreferences } from '@/types';

const STORAGE_KEYS = {
  WORKOUTS: 'fitness-tracker-workouts',
  PROGRESS: 'fitness-tracker-progress',
  PREFERENCES: 'fitness-tracker-preferences',
  CURRENT_WORKOUT: 'fitness-tracker-current-workout'
};

export const storage = {
  getWorkouts: (): Workout[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.WORKOUTS);
    return data ? JSON.parse(data) : [];
  },

  saveWorkouts: (workouts: Workout[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(workouts));
  },

  addWorkout: (workout: Workout): void => {
    const workouts = storage.getWorkouts();
    workouts.push(workout);
    storage.saveWorkouts(workouts);
  },

  getProgress: (): ProgressData[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    return data ? JSON.parse(data) : [];
  },

  saveProgress: (progress: ProgressData[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
  },

  addProgressData: (data: ProgressData): void => {
    const progress = storage.getProgress();
    progress.push(data);
    storage.saveProgress(progress);
  },

  getPreferences: (): UserPreferences => {
    if (typeof window === 'undefined') return {
      weightUnit: 'kg',
      defaultRestTime: 90,
      theme: 'dark'
    };
    const data = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    return data ? JSON.parse(data) : {
      weightUnit: 'kg',
      defaultRestTime: 90,
      theme: 'dark'
    };
  },

  savePreferences: (preferences: UserPreferences): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));
  },

  getCurrentWorkout: (): Workout | null => {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_WORKOUT);
    return data ? JSON.parse(data) : null;
  },

  saveCurrentWorkout: (workout: Workout | null): void => {
    if (typeof window === 'undefined') return;
    if (workout) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_WORKOUT, JSON.stringify(workout));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_WORKOUT);
    }
  },

  calculateOneRepMax: (weight: number, reps: number): number => {
    // Using Brzycki formula: 1RM = weight × (36 / (37 - reps))
    if (reps === 1) return weight;
    return Math.round(weight * (36 / (37 - reps)));
  }
};