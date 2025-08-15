import React, { useState, useMemo } from 'react';
import { Habit } from '../../types';
import HabitIcon from '../icons/HabitIcon';
import PlusIcon from '../icons/PlusIcon';
import HabitFormModal from './HabitFormModal';
import HabitItem from './HabitItem';
import HabitCalendarView from './HabitCalendarView';

interface HabitTrackerProps {
  habits: Habit[];
  setHabits: (value: Habit[] | ((val: Habit[]) => Habit[])) => void;
  onDeleteHabit: (habit: Habit) => void;
}

const getTodayString = () => new Date().toISOString().split('T')[0];

const HabitTracker: React.FC<HabitTrackerProps> = ({ habits, setHabits, onDeleteHabit }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);

  const handleSaveHabit = (habitData: Habit) => {
    setHabits(prev => {
      const exists = prev.some(h => h.id === habitData.id);
      if (exists) {
        return prev.map(h => (h.id === habitData.id ? habitData : h));
      }
      return [habitData, ...prev];
    });
    setIsModalOpen(false);
    setEditingHabit(null);
  };

  const handleToggleCompletion = (habitId: string, date: string) => {
    setHabits(prev => prev.map(h => {
        if (h.id === habitId) {
            const newCompletions = { ...h.completions };
            if (newCompletions[date]) {
                delete newCompletions[date];
            } else {
                newCompletions[date] = true;
            }
            return { ...h, completions: newCompletions };
        }
        return h;
    }));
  };

  const openAddModal = () => {
    setEditingHabit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (habit: Habit) => {
    setEditingHabit(habit);
    setIsModalOpen(true);
  };

  const today = new Date();
  const todayDay = today.getDay(); // Sunday - 0, Monday - 1, etc.
  const todayString = getTodayString();

  const todaysHabits = useMemo(() => {
    return habits.filter(habit => {
        if (habit.frequency === 'daily') return true;
        return habit.frequency.days.includes(todayDay);
    }).sort((a, b) => (a.completions[todayString] ? 1 : -1) - (b.completions[todayString] ? 1 : -1) || a.createdAt - b.createdAt);
  }, [habits, todayDay, todayString]);

  if (selectedHabit) {
    return (
      <HabitCalendarView
        habit={selectedHabit}
        onBack={() => setSelectedHabit(null)}
        onToggleCompletion={handleToggleCompletion}
      />
    );
  }

  return (
    <>
      <div className="space-y-6">
        <header className="flex items-center gap-4 pb-3 border-b-2 border-indigo-500 dark:border-indigo-400">
          <HabitIcon className="w-10 h-10 text-indigo-500 dark:text-indigo-400" />
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white flex-grow">
            Habit Tracker
          </h2>
           <button onClick={openAddModal} className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition-colors">
            <PlusIcon className="w-5 h-5"/>
            <span className="hidden sm:inline">Add Habit</span>
          </button>
        </header>

        <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-xl">
            <h3 className="text-xl font-semibold mb-4">Today's Habits</h3>
             {todaysHabits.length > 0 ? (
              <ul className="space-y-3">
                {todaysHabits.map(habit => (
                  <HabitItem
                    key={habit.id}
                    habit={habit}
                    isCompleted={!!habit.completions[todayString]}
                    onToggle={() => handleToggleCompletion(habit.id, todayString)}
                    onEdit={() => openEditModal(habit)}
                    onDelete={() => onDeleteHabit(habit)}
                    onViewStats={() => setSelectedHabit(habit)}
                  />
                ))}
              </ul>
            ) : (
              <div className="text-center py-10">
                <p className="text-lg text-gray-500 dark:text-gray-400">No habits scheduled for today.</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">Add a new habit to get started!</p>
              </div>
            )}
        </div>
      </div>

      {isModalOpen && (
        <HabitFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveHabit}
          habit={editingHabit}
        />
      )}
    </>
  );
};

export default HabitTracker;
