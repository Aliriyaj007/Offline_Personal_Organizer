
import React, { useState, useEffect } from 'react';
import { Recipe } from '../../types';
import PencilIcon from '../icons/PencilIcon';
import TrashIcon from '../icons/TrashIcon';
import PlusIcon from '../icons/PlusIcon';

interface RecipeBoxModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipes: Recipe[];
  setRecipes: (value: Recipe[] | ((val: Recipe[]) => Recipe[])) => void;
  onDeleteRecipe: (recipe: Recipe) => void;
}

const RecipeBoxModal: React.FC<RecipeBoxModalProps> = ({ isOpen, onClose, recipes, setRecipes, onDeleteRecipe }) => {
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  
  const isEditing = editingRecipe !== null;

  useEffect(() => {
    if (editingRecipe) {
        setName(editingRecipe.name);
        setIngredients(editingRecipe.ingredients);
        setInstructions(editingRecipe.instructions);
    } else {
        setName('');
        setIngredients('');
        setInstructions('');
    }
  }, [editingRecipe]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert('Recipe name is required.');

    const recipeData = { name, ingredients, instructions };
    if (isEditing) {
        const updatedRecipe = { ...editingRecipe, ...recipeData };
        setRecipes(prev => prev.map(r => r.id === updatedRecipe.id ? updatedRecipe : r));
    } else {
        const newRecipe: Recipe = { id: Date.now().toString(), ...recipeData };
        setRecipes(prev => [newRecipe, ...prev].sort((a,b) => a.name.localeCompare(b.name)));
    }
    setEditingRecipe(null); // Reset form after submit
  };
  
  const handleEditClick = (recipe: Recipe) => {
      setEditingRecipe(recipe);
      // Optional: scroll form into view on small screens
      document.getElementById('recipe-form')?.scrollIntoView({ behavior: 'smooth' });
  }

  const handleCancelEdit = () => {
      setEditingRecipe(null);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-[100]" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-4 flex-shrink-0">Recipe Box</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow min-h-0">
            {/* Recipe List */}
            <div className="flex flex-col">
                <h3 className="text-lg font-semibold mb-2">My Recipes</h3>
                <div className="flex-grow overflow-y-auto border dark:border-slate-700 rounded-lg p-2 space-y-2">
                    {recipes.length > 0 ? recipes.map(recipe => (
                        <div key={recipe.id} className="group flex justify-between items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700">
                            <span className="font-medium truncate">{recipe.name}</span>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100">
                                <button onClick={() => handleEditClick(recipe)} className="p-1"><PencilIcon className="w-4 h-4 text-indigo-500"/></button>
                                <button onClick={() => onDeleteRecipe(recipe)} className="p-1"><TrashIcon className="w-4 h-4 text-red-500"/></button>
                            </div>
                        </div>
                    )) : <p className="text-sm text-gray-500 text-center p-4">No recipes yet.</p>}
                </div>
            </div>

            {/* Form */}
            <form id="recipe-form" onSubmit={handleSubmit} className="space-y-4 flex flex-col">
                <h3 className="text-lg font-semibold">{isEditing ? `Editing: ${editingRecipe.name}` : "Add New Recipe"}</h3>
                <InputField label="Recipe Name" value={name} onChange={e => setName(e.target.value)} required />
                <div className="flex-grow flex flex-col">
                  <label className="label">Ingredients</label>
                  <textarea value={ingredients} onChange={e => setIngredients(e.target.value)} rows={5} className="input-field mt-1 flex-grow" placeholder="e.g., 1 cup flour, 2 eggs..."/>
                </div>
                <div className="flex-grow flex flex-col">
                  <label className="label">Instructions</label>
                  <textarea value={instructions} onChange={e => setInstructions(e.target.value)} rows={5} className="input-field mt-1 flex-grow" placeholder="e.g., Mix dry ingredients, add wet..."/>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                    {isEditing && <button type="button" onClick={handleCancelEdit} className="px-4 py-2 border rounded-md">Cancel Edit</button>}
                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md flex items-center gap-2">
                        <PlusIcon className="w-5 h-5"/> {isEditing ? 'Save Changes' : 'Add Recipe'}
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

export default RecipeBoxModal;
