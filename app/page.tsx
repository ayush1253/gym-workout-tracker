'use client'

import { useState } from 'react'
import { Screen } from '@/types'
import { useWorkout } from '@/hooks/useWorkout'
import { Navigation } from '@/components/Navigation'
import { ExerciseSelectionScreen } from '@/components/ExerciseSelectionScreen'
import { ActiveWorkoutScreen } from '@/components/ActiveWorkoutScreen'
import { WorkoutHistoryScreen } from '@/components/WorkoutHistoryScreen'
import { AnalyticsScreen } from '@/components/AnalyticsScreen'

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('exercises')
  const {
    currentWorkout,
    isWorkoutActive,
    startWorkout,
    addExerciseToWorkout,
    updateSet,
    completeSet,
    addSet,
    removeSet,
    finishWorkout,
    cancelWorkout
  } = useWorkout()

  const handleScreenChange = (screen: Screen) => {
    setCurrentScreen(screen)
  }

  const handleStartWorkout = () => {
    startWorkout()
    setCurrentScreen('workout')
  }

  const handleFinishWorkout = () => {
    finishWorkout()
    setCurrentScreen('history')
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'exercises':
        return (
          <ExerciseSelectionScreen
            onExerciseSelect={addExerciseToWorkout}
            onStartWorkout={handleStartWorkout}
            isWorkoutActive={isWorkoutActive}
          />
        )
      case 'workout':
        return (
          <ActiveWorkoutScreen
            workout={currentWorkout}
            onUpdateSet={updateSet}
            onCompleteSet={completeSet}
            onAddSet={addSet}
            onRemoveSet={removeSet}
            onFinishWorkout={handleFinishWorkout}
            onCancelWorkout={cancelWorkout}
          />
        )
      case 'history':
        return <WorkoutHistoryScreen />
      case 'analytics':
        return <AnalyticsScreen />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {renderScreen()}
      <Navigation
        currentScreen={currentScreen}
        onScreenChange={handleScreenChange}
        isWorkoutActive={isWorkoutActive}
      />
    </div>
  )
}