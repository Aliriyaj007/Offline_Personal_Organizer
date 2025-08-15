
import React from 'react';
import { Workout, Exercise } from '../../types';

interface WorkoutItemProps {
  workout: Workout;
  exercise: Exercise | undefined;
  onEdit: () => void;
  onToggleComplete: () => void;
}

const WorkoutItem: React.FC<WorkoutItemProps> = ({ workout, exercise, onEdit, onToggleComplete }) => {
  if (!exercise) return null;

  const stats = exercise.type === 'Strength'
    ? `${workout.sets}x${workout.reps} ${workout.weight ? `@ ${workout.weight}kg` : ''}`
    : `${workout.duration} min`;

  return (
    <div onClick={onEdit} className={`p-2 rounded-md flex items-start gap-2 cursor-pointer transition-colors ${workout.completed ? 'bg-green-100 dark:bg-green-900/50 hover:bg-green-200' : 'bg-gray-100 dark:bg-slate-800 hover:bg-gray-200'}`}>
      <input 
        type="checkbox"
        checked={workout.completed}
        onChange={(e) => { e.stopPropagation(); onToggleComplete(); }}
        className="mt-1 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300"
      />
      <div className="flex-grow">
        <p className={`text-sm font-semibold ${workout.completed ? 'line-through text-gray-500' : ''}`}>{exercise.name}</p>
        <p className={`text-xs ${workout.completed ? 'text-gray-500' : 'text-gray-600 dark:text-gray-400'}`}>{stats}</p>
      </div>
    </div>
  );
};

export default WorkoutItem;
