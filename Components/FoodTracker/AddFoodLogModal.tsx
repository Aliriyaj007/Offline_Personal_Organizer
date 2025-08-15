
import React, { useState, useEffect, useMemo } from 'react';
import { FoodLog, FoodItem } from '../../types';
import SearchIcon from '../icons/SearchIcon';

interface AddFoodLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (logData: Omit<FoodLog, 'id'>, isEditing: boolean) => void;
  foodItems: FoodItem[];
  date: string;
  editingLog: FoodLog | null;
}

const AddFoodLogModal: React.FC<AddFoodLogModalProps> = ({ isOpen, onClose, onSave, foodItems, date, editingLog }) => {
  const [selectedFoodId, setSelectedFoodId] = useState<string>('');
  const [servings, setServings] = useState('1');
  const [searchQuery, setSearchQuery] = useState('');

  const isEditing = editingLog !== null;

  useEffect(() => {
    if (isOpen) {
        if (isEditing) {
            setSelectedFoodId(editingLog.foodItemId);
            setServings(editingLog.servings.toString());
        } else {
            setSelectedFoodId('');
            setServings('1');
            setSearchQuery('');
        }
    }
  }, [editingLog, isEditing, isOpen]);
  
  const filteredFoodItems = useMemo(() => {
      if (!searchQuery) return foodItems;
      const lowerCaseQuery = searchQuery.toLowerCase();
      return foodItems.filter(item => item.name.toLowerCase().includes(lowerCaseQuery));
  }, [searchQuery, foodItems]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numServings = parseFloat(servings);
    if (!selectedFoodId || isNaN(numServings) || numServings <= 0) {
      alert("Please select a food and enter a valid number of servings.");
      return;
    }
    
    onSave({
        date,
        foodItemId: selectedFoodId,
        servings: numServings,
    }, isEditing);
  };

  if (!isOpen) return null;

  const selectedFood = foodItems.find(fi => fi.id === selectedFoodId);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-[100]" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="flex-grow flex flex-col">
          <h2 className="text-2xl font-bold mb-4">{isEditing ? 'Edit Food Log' : 'Log Food'}</h2>
          
          <div className="mb-4">
             <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><SearchIcon className="h-5 w-5 text-gray-400" /></div>
                <input type="text" placeholder="Search your food library..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-md dark:bg-slate-700 dark:border-gray-600"/>
            </div>
          </div>
          
          <div className="flex-grow overflow-y-auto border rounded-md p-2 space-y-1 mb-4">
              {filteredFoodItems.map(item => (
                <button type="button" key={item.id} onClick={() => setSelectedFoodId(item.id)}
                    className={`w-full text-left p-2 rounded ${selectedFoodId === item.id ? 'bg-indigo-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-slate-700'}`} >
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-xs opacity-80">{item.calories} kcal per {item.servingSize}</p>
                </button>
              ))}
          </div>
          
          {selectedFood && (
             <div className="flex-shrink-0 flex items-end gap-4">
                 <div>
                    <label htmlFor="servings" className="label">Servings</label>
                    <input id="servings" type="number" value={servings} onChange={e => setServings(e.target.value)}
                        className="input-field mt-1 w-24" step="0.1" min="0.1"
                    />
                 </div>
                 <div className="text-sm text-gray-500 dark:text-gray-400">
                     <p>x {selectedFood.servingSize}</p>
                 </div>
             </div>
          )}

          <div className="flex-shrink-0 mt-6 flex justify-end gap-4">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md" disabled={!selectedFoodId}>Save to Log</button>
          </div>
        </form>
         <style>{`.label { font-size: 0.875rem; font-weight: 500; color: #374151; } .dark .label { color: #D1D5DB; } .input-field { background-color: white; border: 1px solid #D1D5DB; border-radius: 0.375rem; padding: 0.5rem 0.75rem; } .dark .input-field { background-color: #374151; border-color: #4B5563; color: #F9FAFB; }`}</style>
      </div>
    </div>
  );
};

export default AddFoodLogModal;
