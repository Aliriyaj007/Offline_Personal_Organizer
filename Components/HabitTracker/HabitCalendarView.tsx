import React from 'react';
import { Habit } from '../../types';
import BackIcon from '../icons/BackIcon';

interface HabitCalendarViewProps {
  habit: Habit;
  onBack: () => void;
  onToggleCompletion: (habitId: string, date: string) => void;
}

const HabitCalendarView: React.FC<HabitCalendarViewProps> = ({ habit, onBack, onToggleCompletion }) => {
  const today = new Date();
  const year = today.getFullYear();
  const months = Array.from({ length: 12 }, (_, i) => new Date(year, i, 1));

  const calculateStreak = () => {
    let currentStreak = 0;
    const sortedDates = Object.keys(habit.completions).sort().reverse();
    if (sortedDates.length === 0) return { current: 0, best: 0 };
    
    let currentDate = new Date();
    
    // Check for today's completion
    if (habit.completions[currentDate.toISOString().split('T')[0]]) {
        currentStreak = 1;
        currentDate.setDate(currentDate.getDate() - 1);
    } else if (!habit.completions[new Date(Date.now() - 86400000).toISOString().split('T')[0]]) {
        // if not completed today or yesterday, streak is 0
        currentStreak = 0;
    }

    // Check streak from yesterday backwards
    while(true) {
        if (habit.completions[currentDate.toISOString().split('T')[0]]) {
            currentStreak++;
        } else {
            break;
        }
        currentDate.setDate(currentDate.getDate() - 1);
    }

    // This is a simplified "best streak" calculation
    const bestStreak = sortedDates.reduce((max, _, i, arr) => {
        let count = 1;
        for (let j = i; j < arr.length - 1; j++) {
            const d1 = new Date(arr[j]);
            const d2 = new Date(arr[j+1]);
            if ((d1.getTime() - d2.getTime()) / 86400000 === 1) {
                count++;
            } else {
                break;
            }
        }
        return Math.max(max, count);
    }, 0);
    
    return { current: currentStreak, best: bestStreak };
  };

  const { current: currentStreak, best: bestStreak } = calculateStreak();

  return (
    <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-xl">
      <header className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700">
          <BackIcon className="w-6 h-6" />
        </button>
        <span className="text-3xl" style={{color: habit.color}}>{habit.icon}</span>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{habit.name}</h2>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-center">
          <div className="p-3 bg-gray-100 dark:bg-slate-700 rounded-lg">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Streak</p>
              <p className="text-2xl font-bold" style={{color: habit.color}}>{currentStreak} days</p>
          </div>
          <div className="p-3 bg-gray-100 dark:bg-slate-700 rounded-lg">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Best Streak</p>
              <p className="text-2xl font-bold text-gray-600 dark:text-gray-200">{bestStreak} days</p>
          </div>
          <div className="p-3 bg-gray-100 dark:bg-slate-700 rounded-lg">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Completions</p>
              <p className="text-2xl font-bold text-gray-600 dark:text-gray-200">{Object.keys(habit.completions).length}</p>
          </div>
      </div>

      <div className="space-y-4">
        {months.map(month => (
          <div key={month.getMonth()}>
            <h3 className="font-semibold text-lg mb-2">{month.toLocaleString('default', { month: 'long' })}</h3>
            <div className="grid grid-cols-7 gap-1.5">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d} className="text-center text-xs font-bold text-gray-400">{d}</div>)}
              {Array.from({ length: month.getDay() }).map((_, i) => <div key={`empty-${i}`} />)}
              {Array.from({ length: new Date(year, month.getMonth() + 1, 0).getDate() }).map((_, day) => {
                const date = new Date(year, month.getMonth(), day + 1);
                const dateString = date.toISOString().split('T')[0];
                const isCompleted = habit.completions[dateString];
                const isFuture = date > today;
                return (
                  <button
                    key={dateString}
                    onClick={() => !isFuture && onToggleCompletion(habit.id, dateString)}
                    disabled={isFuture}
                    className={`w-full aspect-square rounded transition-colors text-sm ${
                      isFuture ? 'bg-gray-100 dark:bg-slate-700/50 cursor-not-allowed' :
                      isCompleted ? '' : 'bg-gray-200 dark:bg-slate-700 hover:bg-gray-300'
                    }`}
                    style={{backgroundColor: isCompleted ? habit.color : undefined}}
                  >
                    {day + 1}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HabitCalendarView;
