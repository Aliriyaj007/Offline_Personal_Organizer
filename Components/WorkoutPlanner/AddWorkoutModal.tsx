
import React, { useState, useEffect, useMemo } from 'react';
import { Workout, Exercise } from '../../types';
import SearchIcon from '../icons/SearchIcon';
import TrashIcon from '../icons/TrashIcon';

interface AddWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (workoutData: Omit<Workout, 'id'>, isEditing: boolean) => void;
  onDelete: () => void;
  exercises: Exercise[];
  workoutSlot: {
    date: string;
    workout: Workout | null;
  };
}

const AddWorkoutModal: React.FC<AddWorkoutModalProps> = ({ isOpen, onClose, onSave, onDelete, exercises, workoutSlot }) => {
  const [exerciseId, setExerciseId] = useState('');
  const [sets, setSets] = useState('3');
  const [reps, setReps] = useState('10');
  const [weight, setWeight] = useState('');
  const [duration, setDuration] = useState('30');
  const [completed, setCompleted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isEditing = workoutSlot.workout !== null;
  const selectedExercise = useMemo(() => exercises.find(e => e.id === exerciseId), [exerciseId, exercises]);

  useEffect(() => {
    if (isOpen) {
      if (isEditing && workoutSlot.workout) {
        const w = workoutSlot.workout;
        setExerciseId(w.exerciseId);
        setSets(w.sets.toString());
        setReps(w.reps.toString());
        setWeight(w.weight?.toString() || '');
        setDuration(w.duration?.toString() || '');
        setCompleted(w.completed);
      } else {
        setExerciseId(''); setSets('3'); setReps('10'); setWeight('');
        setDuration('30'); setCompleted(false); setSearchQuery('');
      }
    }
  }, [workoutSlot, isEditing, isOpen]);
  
  const filteredExercises = useMemo(() => {
      if (!searchQuery) return exercises;
      const lower = searchQuery.toLowerCase();
      return exercises.filter(e => e.name.toLowerCase().includes(lower) || e.muscleGroup?.toLowerCase().includes(lower));
  }, [searchQuery, exercises]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exerciseId) return alert('Please select an exercise.');

    const workoutData: Omit<Workout, 'id'> = {
      date: workoutSlot.date,
      exerciseId,
      sets: parseInt(sets) || 0,
      reps: parseInt(reps) || 0,
      weight: weight ? parseFloat(weight) : undefined,
      duration: duration ? parseInt(duration) : undefined,
      completed,
    };
    onSave(workoutData, isEditing);
  };

  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-[100]" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="flex-grow flex flex-col">
          <h2 className="text-2xl font-bold mb-4">{isEditing ? 'Edit Workout' : 'Add Workout'}</h2>
          
          <div className="mb-4">
            <div className="relative"><SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/><input type="text" placeholder="Search exercises..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-md dark:bg-slate-700"/></div>
          </div>
          <div className="flex-grow overflow-y-auto border rounded-md p-2 space-y-1 mb-4">
              {filteredExercises.map(ex => <button type="button" key={ex.id} onClick={() => setExerciseId(ex.id)} className={`w-full text-left p-2 rounded ${exerciseId === ex.id ? 'bg-indigo-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-slate-700'}`}>{ex.name}</button>)}
          </div>
          
          {selectedExercise?.type === 'Strength' && (
            <div className="grid grid-cols-3 gap-4">
              <InputField label="Sets" type="number" value={sets} onChange={e => setSets(e.target.value)} />
              <InputField label="Reps" type="number" value={reps} onChange={e => setReps(e.target.value)} />
              <InputField label="Weight (kg)" type="number" value={weight} onChange={e => setWeight(e.target.value)} step="0.5" />
            </div>
          )}
          {selectedExercise?.type === 'Cardio' && (
            <InputField label="Duration (min)" type="number" value={duration} onChange={e => setDuration(e.target.value)} />
          )}

          <div className="flex items-center gap-2 mt-4">
              <input id="completed" type="checkbox" checked={completed} onChange={e => setCompleted(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-indigo-600"/>
              <label htmlFor="completed" className="label">Mark as completed</label>
          </div>
          
          <div className="flex justify-between items-center mt-6">
            <div>{isEditing && <button type="button" onClick={onDelete} className="p-2 text-red-500 rounded-full hover:bg-red-100"><TrashIcon/></button>}</div>
            <div className="flex gap-4">
              <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md" disabled={!exerciseId}>Save</button>
            </div>
          </div>
        </form>
        <style>{`.label { font-size: 0.875rem; font-weight: 500; color: #374151; } .dark .label { color: #D1D5DB; } .input-field { background-color: white; border: 1px solid #D1D5DB; border-radius: 0.375rem; padding: 0.5rem 0.75rem; width: 100%;} .dark .input-field { background-color: #374151; border-color: #4B5563; color: #F9FAFB; }`}</style>
      </div>
    </div>
  );
};

const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
  <div>
    <label className="label">{label}</label>
    <input {...props} className="input-field mt-1" />
  </div>
);

export default AddWorkoutModal;
