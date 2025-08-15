
import React from 'react';
import { FoodLog, FoodItem } from '../../types';
import PencilIcon from '../icons/PencilIcon';
import TrashIcon from '../icons/TrashIcon';

interface FoodLogItemProps {
  log: FoodLog;
  foodItem: FoodItem | undefined;
  onEdit: (log: FoodLog) => void;
  onDelete: (log: FoodLog) => void;
}

const FoodLogItem: React.FC<FoodLogItemProps> = ({ log, foodItem, onEdit, onDelete }) => {
  if (!foodItem) {
    return (
      <div className="flex items-center p-3 bg-red-100 dark:bg-red-900/50 rounded-lg justify-between">
        <p className="text-red-700 dark:text-red-300 text-sm">Error: Food item not found.</p>
        <button onClick={() => onDelete(log)}><TrashIcon className="w-5 h-5 text-red-500"/></button>
      </div>
    );
  }

  const totalCalories = (foodItem.calories * log.servings).toFixed(0);
  const totalProtein = (foodItem.protein * log.servings).toFixed(1);
  const totalCarbs = (foodItem.carbs * log.servings).toFixed(1);
  const totalFat = (foodItem.fat * log.servings).toFixed(1);
  
  return (
    <div className="group flex items-center p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
        <div className="flex-grow">
            <p className="font-semibold text-gray-800 dark:text-white">{foodItem.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{log.servings} x {foodItem.servingSize}</p>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-sm text-center w-1/2">
            <div className="flex-1"><span className="font-bold">{totalCalories}</span><span className="text-xs"> kcal</span></div>
            <div className="flex-1">{totalProtein}g P</div>
            <div className="flex-1">{totalCarbs}g C</div>
            <div className="flex-1">{totalFat}g F</div>
        </div>
        <div className="flex items-center gap-2 pl-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => onEdit(log)} title="Edit Servings" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-600"><PencilIcon className="w-4 h-4"/></button>
            <button onClick={() => onDelete(log)} title="Delete Log" className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50"><TrashIcon className="w-4 h-4 text-red-500"/></button>
        </div>
    </div>
  );
};

export default FoodLogItem;
