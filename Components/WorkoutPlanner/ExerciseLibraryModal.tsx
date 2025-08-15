
import React, { useState, useEffect } from 'react';
import { Exercise } from '../../types';
import PencilIcon from '../icons/PencilIcon';
import TrashIcon from '../icons/TrashIcon';
import PlusIcon from '../icons/PlusIcon';

interface ExerciseLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  exercises: Exercise[];
  setExercises: (value: Exercise[] | ((val: Exercise[]) => Exercise[])) => void;
  onDeleteExercise: (exercise: Exercise) => void;
}

const ExerciseLibraryModal: React.FC<ExerciseLibraryModalProps> = ({ isOpen, onClose, exercises, setExercises, onDeleteExercise }) => {
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [formState, setFormState] = useState({ name: '', type: 'Strength' as 'Strength' | 'Cardio', muscleGroup: '' });
  
  const isEditing = editingExercise !== null;

  useEffect(() => {
    if (editingExercise) {
        setFormState({
            name: editingExercise.name,
            type: editingExercise.type,
            muscleGroup: editingExercise.muscleGroup || ''
        });
    } else {
        setFormState({ name: '', type: 'Strength', muscleGroup: '' });
    }
  }, [editingExercise]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFormState(prev => ({...prev, [e.target.name]: e.target.value}));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name.trim()) return alert('Exercise name is required.');

    const exerciseData = { ...formState, muscleGroup: formState.type === 'Strength' ? formState.muscleGroup : undefined };

    if (isEditing) {
        const updatedExercise = { ...editingExercise, ...exerciseData };
        setExercises(prev => prev.map(ex => ex.id === updatedExercise.id ? updatedExercise : ex).sort((a,b) => a.name.localeCompare(b.name)));
    } else {
        const newExercise: Exercise = { id: Date.now().toString(), ...exerciseData };
        setExercises(prev => [...prev, newExercise].sort((a,b) => a.name.localeCompare(b.name)));
    }
    setEditingExercise(null);
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-[100]" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-4 flex-shrink-0">Exercise Library</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow min-h-0">
            <div className="flex flex-col">
                <h3 className="text-lg font-semibold mb-2">My Exercises</h3>
                <div className="flex-grow overflow-y-auto border dark:border-slate-700 rounded-lg p-2 space-y-2">
                    {exercises.map(ex => (
                        <div key={ex.id} className="group flex justify-between items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700">
                           <div>
                             <p className="font-medium truncate">{ex.name}</p>
                             <p className="text-xs text-gray-500">{ex.type} {ex.muscleGroup && `• ${ex.muscleGroup}`}</p>
                           </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100">
                                <button onClick={() => setEditingExercise(ex)}><PencilIcon className="w-4 h-4"/></button>
                                <button onClick={() => onDeleteExercise(ex)}><TrashIcon className="w-4 h-4 text-red-500"/></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-lg font-semibold">{isEditing ? `Editing: ${editingExercise.name}` : "Add New Exercise"}</h3>
                <InputField name="name" label="Exercise Name" value={formState.name} onChange={handleInputChange} required />
                <div>
                    <label className="label">Type</label>
                    <select name="type" value={formState.type} onChange={handleInputChange} className="input-field w-full mt-1">
                        <option value="Strength">Strength</option>
                        <option value="Cardio">Cardio</option>
                    </select>
                </div>
                {formState.type === 'Strength' && (
                    <InputField name="muscleGroup" label="Muscle Group (Optional)" value={formState.muscleGroup} onChange={handleInputChange} placeholder="e.g., Chest, Back, Legs"/>
                )}
                <div className="flex justify-end gap-3 pt-2">
                    {isEditing && <button type="button" onClick={() => setEditingExercise(null)} className="px-4 py-2 border rounded-md">Cancel Edit</button>}
                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md flex items-center gap-2">
                        <PlusIcon className="w-5 h-5"/> {isEditing ? 'Save Changes' : 'Add Exercise'}
                    </button>
                </div>
            </form>
        </div>
         <style>{`.label { display: block; font-size: 0.875rem; font-weight: 500; color: #374151; } .dark .label { color: #D1D5DB; } .input-field { background-color: white; border: 1px solid #D1D5DB; border-radius: 0.375rem; padding: 0.5rem 0.75rem; width: 100%;} .dark .input-field { background-color: #374151; border-color: #4B5563; color: #F9FAFB; }`}</style>
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

export default ExerciseLibraryModal;
