export interface Exercise {
  id: string;
  name: string;
  category: string;
  muscleGroup: string;
  equipment: string;
  description: string;
}

export interface WorkoutSet {
  reps: number;
  weight: number;
  completed: boolean;
  restTime?: number;
}

export interface WorkoutExercise {
  exerciseId: string;
  exercise: Exercise;
  sets: WorkoutSet[];
  notes?: string;
}

export interface Workout {
  id: string;
  date: string;
  name: string;
  exercises: WorkoutExercise[];
  duration: number;
  totalVolume: number;
  completed: boolean;
}

export interface ProgressData {
  date: string;
  exerciseId: string;
  weight: number;
  reps: number;
  volume: number;
  oneRepMax: number;
}

export type Screen = 'exercises' | 'workout' | 'history' | 'analytics';

export type WeightUnit = 'kg' | 'lbs';

export interface UserPreferences {
  weightUnit: WeightUnit;
  defaultRestTime: number;
  theme: 'dark' | 'light';
}