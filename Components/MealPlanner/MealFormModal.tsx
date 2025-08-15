
import React, { useState, useEffect } from 'react';
import { Meal, Recipe, MealType } from '../../types';
import TrashIcon from '../icons/TrashIcon';

interface MealFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (mealData: Omit<Meal, 'id'>) => void;
  onDelete: () => void;
  recipes: Recipe[];
  mealSlot: {
    date: string;
    type: MealType;
    meal: Meal | null;
  };
}

const MealFormModal: React.FC<MealFormModalProps> = ({ isOpen, onClose, onSave, onDelete, recipes, mealSlot }) => {
  const [recipeId, setRecipeId] = useState<string>('');
  const [customText, setCustomText] = useState('');

  const isEditing = mealSlot.meal !== null;
  
  useEffect(() => {
    if (isOpen) {
        setRecipeId(mealSlot.meal?.recipeId || '');
        setCustomText(mealSlot.meal?.customText || '');
    }
  }, [mealSlot, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipeId && !customText.trim()) {
        alert("Please select a recipe or enter a custom meal.");
        return;
    }
    
    onSave({
        date: mealSlot.date,
        type: mealSlot.type,
        recipeId: recipeId || undefined,
        customText: recipeId ? '' : customText, // Clear custom text if recipe is selected
    });
  };

  if (!isOpen) return null;
  
  const formattedDate = new Date(mealSlot.date + 'T00:00:00').toLocaleDateString(undefined, {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-[100]" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{isEditing ? 'Edit Meal' : 'Add Meal'}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{mealSlot.type} for {formattedDate}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Choose a Recipe (Optional)</label>
            <select
              value={recipeId}
              onChange={e => setRecipeId(e.target.value)}
              className="mt-1 block w-full input-field"
            >
              <option value="">-- Select from Recipe Box --</option>
              {recipes.map(recipe => (
                <option key={recipe.id} value={recipe.id}>{recipe.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <hr className="flex-grow border-gray-300 dark:border-gray-600"/>
            <span className="text-xs text-gray-500">OR</span>
            <hr className="flex-grow border-gray-300 dark:border-gray-600"/>
          </div>

          <div>
            <label htmlFor="customText" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Enter a Custom Meal</label>
            <input
              type="text"
              id="customText"
              value={customText}
              onChange={e => setCustomText(e.target.value)}
              className="mt-1 block w-full input-field"
              placeholder="e.g., Cereal with berries"
              disabled={!!recipeId}
            />
             {recipeId && <p className="text-xs mt-1 text-yellow-600 dark:text-yellow-400">Clear recipe selection to enable this field.</p>}
          </div>

          <div className="flex justify-between items-center pt-4">
             <div>
                {isEditing && (
                    <button type="button" onClick={onDelete} className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50">
                        <TrashIcon className="w-5 h-5"/>
                    </button>
                )}
             </div>
             <div className="flex gap-4">
                <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md">{isEditing ? 'Save Changes' : 'Add Meal'}</button>
            </div>
          </div>
        </form>
         <style>{`.input-field { background-color: white; border: 1px solid #D1D5DB; border-radius: 0.375rem; padding: 0.5rem 0.75rem; width: 100%;} .dark .input-field { background-color: #374151; border-color: #4B5563; color: #F9FAFB; }`}</style>
      </div>
    </div>
  );
};

export default MealFormModal;
