

import React, { useState, useMemo } from 'react';
import { FoodLog, FoodItem } from '../../types';
import CalorieTrackerIcon from '../icons/CalorieTrackerIcon';
import PlusIcon from '../icons/PlusIcon';
import DatabaseIcon from '../icons/DatabaseIcon';
import DailySummary from './DailySummary';
import AddFoodLogModal from './AddFoodLogModal';
import FoodDatabaseModal from './FoodDatabaseModal';
import FoodLogItem from './FoodLogItem';

interface FoodTrackerProps {
  foodLogs: FoodLog[];
  setFoodLogs: (value: FoodLog[] | ((val: FoodLog[]) => FoodLog[])) => void;
  foodItems: FoodItem[];
  setFoodItems: (value: FoodItem[] | ((val: FoodItem[]) => FoodItem[])) => void;
  onDeleteFoodLog: (log: FoodLog) => void;
  onDeleteFoodItem: (item: FoodItem) => void;
}

const getTodayDateString = () => new Date().toISOString().split('T')[0];

const FoodTracker: React.FC<FoodTrackerProps> = ({ foodLogs, setFoodLogs, foodItems, setFoodItems, onDeleteFoodLog, onDeleteFoodItem }) => {
    const [selectedDate, setSelectedDate] = useState(getTodayDateString());
    const [isAddLogModalOpen, setIsAddLogModalOpen] = useState(false);
    const [isDbModalOpen, setIsDbModalOpen] = useState(false);
    const [editingLog, setEditingLog] = useState<FoodLog | null>(null);

    const changeDate = (days: number) => {
        const currentDate = new Date(selectedDate + 'T00:00:00');
        currentDate.setDate(currentDate.getDate() + days);
        setSelectedDate(currentDate.toISOString().split('T')[0]);
    };

    const dailyLogs = useMemo(() => {
        return foodLogs.filter(log => log.date === selectedDate);
    }, [foodLogs, selectedDate]);

    const dailySummary = useMemo(() => {
        const summary = { calories: 0, protein: 0, carbs: 0, fat: 0 };
        dailyLogs.forEach(log => {
            const item = foodItems.find(fi => fi.id === log.foodItemId);
            if (item) {
                summary.calories += item.calories * log.servings;
                summary.protein += item.protein * log.servings;
                summary.carbs += item.carbs * log.servings;
                summary.fat += item.fat * log.servings;
            }
        });
        return summary;
    }, [dailyLogs, foodItems]);

    const handleOpenAddModal = () => {
        setEditingLog(null);
        setIsAddLogModalOpen(true);
    };

    const handleOpenEditModal = (log: FoodLog) => {
        setEditingLog(log);
        setIsAddLogModalOpen(true);
    };

    const handleSaveLog = (logData: Omit<FoodLog, 'id'>, isEditing: boolean) => {
        if (isEditing && editingLog) {
            setFoodLogs(prev => prev.map(l => l.id === editingLog.id ? { ...l, ...logData } : l));
        } else {
            const newLog: FoodLog = { id: Date.now().toString(), ...logData };
            setFoodLogs(prev => [...prev, newLog]);
        }
        setIsAddLogModalOpen(false);
        setEditingLog(null);
    };

  return (
    <>
    <div className="space-y-6">
      <header className="flex items-center gap-4 pb-3 border-b-2 border-indigo-500 dark:border-indigo-400">
        <CalorieTrackerIcon className="w-10 h-10 text-indigo-500 dark:text-indigo-400" />
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white flex-grow">
          Food & Calorie Tracker
        </h2>
        <div className="flex-shrink-0 flex items-center gap-2">
            <button onClick={() => setIsDbModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition-colors">
                <DatabaseIcon className="w-5 h-5" />
                <span className="hidden sm:inline">Food Library</span>
            </button>
            <button onClick={handleOpenAddModal} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition-colors">
                <PlusIcon className="w-5 h-5"/>
                <span className="hidden sm:inline">Log Food</span>
            </button>
        </div>
      </header>
      
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
            <button onClick={() => changeDate(-1)} className="px-3 py-1 rounded-md bg-gray-200 dark:bg-slate-700">&lt; Prev Day</button>
            <h3 className="text-lg font-semibold text-center">
                {new Date(selectedDate + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
            </h3>
            <button onClick={() => changeDate(1)} className="px-3 py-1 rounded-md bg-gray-200 dark:bg-slate-700">Next Day &gt;</button>
        </div>

        <DailySummary summary={dailySummary} />

        <div className="mt-6">
            <h4 className="text-xl font-semibold mb-3">Today's Log</h4>
            <div className="space-y-2">
                {dailyLogs.length > 0 ? (
                    dailyLogs.map(log => (
                        <FoodLogItem 
                            key={log.id}
                            log={log}
                            foodItem={foodItems.find(fi => fi.id === log.foodItemId)}
                            onEdit={handleOpenEditModal}
                            onDelete={onDeleteFoodLog}
                        />
                    ))
                ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <p>No food logged for this day.</p>
                        <button onClick={handleOpenAddModal} className="mt-2 text-indigo-600 dark:text-indigo-400 font-semibold">
                            Log your first item
                        </button>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>

    {isAddLogModalOpen && (
        <AddFoodLogModal
            isOpen={isAddLogModalOpen}
            onClose={() => { setIsAddLogModalOpen(false); setEditingLog(null); }}
            onSave={handleSaveLog}
            foodItems={foodItems}
            date={selectedDate}
            editingLog={editingLog}
        />
    )}

    {isDbModalOpen && (
        <FoodDatabaseModal
            isOpen={isDbModalOpen}
            onClose={() => setIsDbModalOpen(false)}
            foodItems={foodItems}
            setFoodItems={setFoodItems}
            onDeleteFoodItem={onDeleteFoodItem}
        />
    )}
    </>
  );
};

export default FoodTracker;
