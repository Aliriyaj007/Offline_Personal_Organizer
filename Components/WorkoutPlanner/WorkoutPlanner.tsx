

import React, { useState, useMemo } from 'react';
import { Workout, Exercise } from '../../types';
import WorkoutIcon from '../icons/WorkoutIcon';
import PlusIcon from '../icons/PlusIcon';
import DatabaseIcon from '../icons/DatabaseIcon';
import ExerciseLibraryModal from './ExerciseLibraryModal';
import AddWorkoutModal from './AddWorkoutModal';
import WorkoutItem from './WorkoutItem';

interface WorkoutPlannerProps {
  workouts: Workout[];
  setWorkouts: (value: Workout[] | ((val: Workout[]) => Workout[])) => void;
  exercises: Exercise[];
  setExercises: (value: Exercise[] | ((val: Exercise[]) => Exercise[])) => void;
  onDeleteWorkout: (workout: Workout) => void;
  onDeleteExercise: (exercise: Exercise) => void;
}

const getWeekStartDate = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
};

const WorkoutPlanner: React.FC<WorkoutPlannerProps> = (props) => {
    const { workouts, setWorkouts, exercises, setExercises, onDeleteWorkout, onDeleteExercise } = props;
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isLibraryOpen, setIsLibraryOpen] = useState(false);
    const [isWorkoutFormOpen, setIsWorkoutFormOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<{ date: string; workout: Workout | null } | null>(null);
    
    const weekStartDate = getWeekStartDate(currentDate);
    const weekDays = Array.from({ length: 7 }).map((_, i) => {
        const date = new Date(weekStartDate);
        date.setDate(date.getDate() + i);
        return date;
    });

    const workoutsByDate = useMemo(() => {
        return workouts.reduce((acc, workout) => {
            (acc[workout.date] = acc[workout.date] || []).push(workout);
            return acc;
        }, {} as Record<string, Workout[]>);
    }, [workouts]);

    const handleDateChange = (days: number) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setDate(newDate.getDate() + days);
            return newDate;
        });
    };

    const handleOpenAddForm = (date: string) => {
        setSelectedSlot({ date, workout: null });
        setIsWorkoutFormOpen(true);
    };

    const handleOpenEditForm = (workout: Workout) => {
        setSelectedSlot({ date: workout.date, workout });
        setIsWorkoutFormOpen(true);
    };

    const handleSaveWorkout = (workoutData: Omit<Workout, 'id'>, isEditing: boolean) => {
        if (isEditing && selectedSlot?.workout) {
            const updatedWorkout = { ...selectedSlot.workout, ...workoutData };
            setWorkouts(prev => prev.map(w => w.id === updatedWorkout.id ? updatedWorkout : w));
        } else {
            const newWorkout: Workout = { id: Date.now().toString(), ...workoutData };
            setWorkouts(prev => [...prev, newWorkout]);
        }
        setIsWorkoutFormOpen(false);
        setSelectedSlot(null);
    };

    const handleToggleComplete = (workout: Workout) => {
        setWorkouts(prev => prev.map(w => w.id === workout.id ? {...w, completed: !w.completed} : w));
    }

  return (
    <>
      <div className="space-y-6">
        <header className="flex items-center gap-4 pb-3 border-b-2 border-indigo-500 dark:border-indigo-400">
          <WorkoutIcon className="w-10 h-10 text-indigo-500 dark:text-indigo-400" />
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white flex-grow">
            Workout Planner
          </h2>
          <button onClick={() => setIsLibraryOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700">
            <DatabaseIcon className="w-5 h-5"/> <span className="hidden sm:inline">Exercise Library</span>
          </button>
        </header>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <button onClick={() => handleDateChange(-7)} className="px-3 py-1 rounded-md bg-gray-200 dark:bg-slate-700">&lt; Prev Week</button>
                <h3 className="text-lg font-semibold">{weekStartDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
                <button onClick={() => handleDateChange(7)} className="px-3 py-1 rounded-md bg-gray-200 dark:bg-slate-700">Next Week &gt;</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
                {weekDays.map(day => {
                    const dateString = day.toISOString().split('T')[0];
                    const dailyWorkouts = workoutsByDate[dateString] || [];
                    const isToday = dateString === new Date().toISOString().split('T')[0];
                    
                    return (
                        <div key={dateString} className={`p-3 rounded-lg flex flex-col ${isToday ? 'bg-indigo-50 dark:bg-indigo-900/40 border-2 border-indigo-300' : 'bg-gray-50 dark:bg-slate-700/50'}`}>
                            <div className="flex justify-between items-center mb-2">
                                <p className={`font-bold text-sm ${isToday ? 'text-indigo-700 dark:text-indigo-200' : ''}`}>
                                    {day.toLocaleDateString(undefined, { weekday: 'short' })} {day.getDate()}
                                </p>
                                <button onClick={() => handleOpenAddForm(dateString)} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-slate-600"><PlusIcon className="w-4 h-4"/></button>
                            </div>
                            <div className="space-y-2 flex-grow min-h-[100px]">
                                {dailyWorkouts.map(workout => (
                                    <WorkoutItem
                                        key={workout.id}
                                        workout={workout}
                                        exercise={exercises.find(e => e.id === workout.exerciseId)}
                                        onEdit={() => handleOpenEditForm(workout)}
                                        onToggleComplete={() => handleToggleComplete(workout)}
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
      </div>

      {isLibraryOpen && (
          <ExerciseLibraryModal
            isOpen={isLibraryOpen}
            onClose={() => setIsLibraryOpen(false)}
            exercises={exercises}
            setExercises={setExercises}
            onDeleteExercise={onDeleteExercise}
          />
      )}

      {isWorkoutFormOpen && selectedSlot && (
          <AddWorkoutModal
            isOpen={isWorkoutFormOpen}
            onClose={() => setIsWorkoutFormOpen(false)}
            onSave={handleSaveWorkout}
            onDelete={() => { selectedSlot.workout && onDeleteWorkout(selectedSlot.workout); setIsWorkoutFormOpen(false); }}
            exercises={exercises}
            workoutSlot={selectedSlot}
          />
      )}
    </>
  );
};

export default WorkoutPlanner;
