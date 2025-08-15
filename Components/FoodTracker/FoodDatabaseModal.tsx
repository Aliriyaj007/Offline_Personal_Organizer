
import React, { useState, useEffect } from 'react';
import { FoodItem } from '../../types';
import PencilIcon from '../icons/PencilIcon';
import TrashIcon from '../icons/TrashIcon';
import PlusIcon from '../icons/PlusIcon';

interface FoodDatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  foodItems: FoodItem[];
  setFoodItems: (value: FoodItem[] | ((val: FoodItem[]) => FoodItem[])) => void;
  onDeleteFoodItem: (foodItem: FoodItem) => void;
}

const FoodDatabaseModal: React.FC<FoodDatabaseModalProps> = ({ isOpen, onClose, foodItems, setFoodItems, onDeleteFoodItem }) => {
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);
  const [formState, setFormState] = useState({
      name: '', calories: '', protein: '', carbs: '', fat: '', servingSize: ''
  });
  
  const isEditing = editingItem !== null;

  useEffect(() => {
    if (editingItem) {
        setFormState({
            name: editingItem.name,
            calories: editingItem.calories.toString(),
            protein: editingItem.protein.toString(),
            carbs: editingItem.carbs.toString(),
            fat: editingItem.fat.toString(),
            servingSize: editingItem.servingSize,
        });
    } else {
        setFormState({ name: '', calories: '', protein: '', carbs: '', fat: '', servingSize: '' });
    }
  }, [editingItem]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormState(prev => ({ ...prev, [name]: value }));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name.trim() || !formState.servingSize.trim()) return alert('Name and Serving Size are required.');
    
    const newItemData = {
        name: formState.name,
        calories: parseFloat(formState.calories) || 0,
        protein: parseFloat(formState.protein) || 0,
        carbs: parseFloat(formState.carbs) || 0,
        fat: parseFloat(formState.fat) || 0,
        servingSize: formState.servingSize,
    };

    if (isEditing) {
        const updatedItem = { ...editingItem, ...newItemData };
        setFoodItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item).sort((a,b) => a.name.localeCompare(b.name)));
    } else {
        const newItem: FoodItem = { id: Date.now().toString(), ...newItemData };
        setFoodItems(prev => [...prev, newItem].sort((a,b) => a.name.localeCompare(b.name)));
    }
    setEditingItem(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-[100]" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-4 flex-shrink-0">Food Library</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow min-h-0">
            <div className="flex flex-col">
                <h3 className="text-lg font-semibold mb-2">My Food Items</h3>
                <div className="flex-grow overflow-y-auto border dark:border-slate-700 rounded-lg p-2 space-y-2">
                    {foodItems.map(item => (
                        <div key={item.id} className="group flex justify-between items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700">
                           <div>
                             <span className="font-medium truncate">{item.name}</span>
                             <p className="text-xs text-gray-500">{item.calories} kcal / {item.servingSize}</p>
                           </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100">
                                <button onClick={() => setEditingItem(item)}><PencilIcon className="w-4 h-4 text-indigo-500"/></button>
                                <button onClick={() => onDeleteFoodItem(item)}><TrashIcon className="w-4 h-4 text-red-500"/></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 flex flex-col">
                <h3 className="text-lg font-semibold">{isEditing ? `Editing: ${editingItem.name}` : "Add New Food"}</h3>
                <InputField name="name" label="Food Name" value={formState.name} onChange={handleInputChange} required />
                <InputField name="servingSize" label="Serving Size" value={formState.servingSize} onChange={handleInputChange} required placeholder="e.g., 100g, 1 cup"/>
                <div className="grid grid-cols-2 gap-3">
                    <InputField name="calories" label="Calories (kcal)" type="number" value={formState.calories} onChange={handleInputChange} />
                    <InputField name="protein" label="Protein (g)" type="number" value={formState.protein} onChange={handleInputChange} />
                    <InputField name="carbs" label="Carbs (g)" type="number" value={formState.carbs} onChange={handleInputChange} />
                    <InputField name="fat" label="Fat (g)" type="number" value={formState.fat} onChange={handleInputChange} />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                    {isEditing && <button type="button" onClick={() => setEditingItem(null)} className="px-4 py-2 border rounded-md">Cancel Edit</button>}
                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md flex items-center gap-2">
                        <PlusIcon className="w-5 h-5"/> {isEditing ? 'Save Changes' : 'Add to Library'}
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
    <input {...props} step="0.1" className="input-field mt-1" />
  </div>
);

export default FoodDatabaseModal;
