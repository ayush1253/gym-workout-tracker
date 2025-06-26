import { Exercise } from '@/types';

export const exercises: Exercise[] = [
  // Chest
  {
    id: 'bench-press',
    name: 'Bench Press',
    category: 'Chest',
    muscleGroup: 'chest',
    equipment: 'Barbell',
    description: 'Classic chest exercise using a barbell'
  },
  {
    id: 'incline-bench-press',
    name: 'Incline Bench Press',
    category: 'Chest',
    muscleGroup: 'chest',
    equipment: 'Barbell',
    description: 'Upper chest focused bench press'
  },
  {
    id: 'dumbbell-flyes',
    name: 'Dumbbell Flyes',
    category: 'Chest',
    muscleGroup: 'chest',
    equipment: 'Dumbbells',
    description: 'Chest isolation exercise with dumbbells'
  },
  {
    id: 'push-ups',
    name: 'Push-ups',
    category: 'Chest',
    muscleGroup: 'chest',
    equipment: 'Bodyweight',
    description: 'Bodyweight chest exercise'
  },

  // Legs
  {
    id: 'squat',
    name: 'Squat',
    category: 'Legs',
    muscleGroup: 'legs',
    equipment: 'Barbell',
    description: 'Compound leg exercise targeting quads, glutes, and hamstrings'
  },
  {
    id: 'deadlift',
    name: 'Deadlift',
    category: 'Legs',
    muscleGroup: 'legs',
    equipment: 'Barbell',
    description: 'Full body compound movement'
  },
  {
    id: 'leg-press',
    name: 'Leg Press',
    category: 'Legs',
    muscleGroup: 'legs',
    equipment: 'Machine',
    description: 'Machine-based leg exercise'
  },
  {
    id: 'lunges',
    name: 'Lunges',
    category: 'Legs',
    muscleGroup: 'legs',
    equipment: 'Dumbbells',
    description: 'Unilateral leg exercise'
  },

  // Back
  {
    id: 'pull-ups',
    name: 'Pull-ups',
    category: 'Back',
    muscleGroup: 'back',
    equipment: 'Bodyweight',
    description: 'Upper body pulling exercise'
  },
  {
    id: 'barbell-rows',
    name: 'Barbell Rows',
    category: 'Back',
    muscleGroup: 'back',
    equipment: 'Barbell',
    description: 'Compound back exercise'
  },
  {
    id: 'lat-pulldowns',
    name: 'Lat Pulldowns',
    category: 'Back',
    muscleGroup: 'back',
    equipment: 'Machine',
    description: 'Latissimus dorsi focused exercise'
  },

  // Shoulders
  {
    id: 'overhead-press',
    name: 'Overhead Press',
    category: 'Shoulders',
    muscleGroup: 'shoulders',
    equipment: 'Barbell',
    description: 'Compound shoulder exercise'
  },
  {
    id: 'lateral-raises',
    name: 'Lateral Raises',
    category: 'Shoulders',
    muscleGroup: 'shoulders',
    equipment: 'Dumbbells',
    description: 'Shoulder isolation exercise'
  },

  // Arms
  {
    id: 'bicep-curls',
    name: 'Bicep Curls',
    category: 'Arms',
    muscleGroup: 'arms',
    equipment: 'Dumbbells',
    description: 'Bicep isolation exercise'
  },
  {
    id: 'tricep-dips',
    name: 'Tricep Dips',
    category: 'Arms',
    muscleGroup: 'arms',
    equipment: 'Bodyweight',
    description: 'Tricep bodyweight exercise'
  }
];

export const categories = [...new Set(exercises.map(e => e.category))];

export const muscleGroupColors = {
  chest: 'from-red-500 to-pink-500',
  legs: 'from-purple-500 to-indigo-500',
  back: 'from-blue-500 to-cyan-500',
  shoulders: 'from-yellow-500 to-orange-500',
  arms: 'from-green-500 to-teal-500'
};