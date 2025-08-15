import React, { useEffect, useMemo, useState } from 'react';
import { WaterData, WaterLog } from '../../types';
import WaterIcon from '../icons/WaterIcon';

interface WaterReminderProps {
  waterData: WaterData;
  setWaterData: (value: WaterData | ((val: WaterData) => WaterData)) => void;
}

const getTodayDateString = () => new Date().toISOString().split('T')[0];

const WaterReminder: React.FC<WaterReminderProps> = ({ waterData, setWaterData }) => {
  const [notificationPermission, setNotificationPermission] = useState(Notification.permission);
  
  // Reset logs if the date has changed
  useEffect(() => {
    const today = getTodayDateString();
    if (waterData.date !== today) {
      setWaterData(prev => ({ ...prev, logs: [], date: today }));
    }
  }, [waterData.date, setWaterData]);

  const totalIntake = useMemo(() => {
    return waterData.logs.reduce((sum, log) => sum + log.amount, 0);
  }, [waterData.logs]);
  
  const progressPercentage = useMemo(() => {
    if (waterData.dailyGoal === 0) return 0;
    return Math.min((totalIntake / waterData.dailyGoal) * 100, 100);
  }, [totalIntake, waterData.dailyGoal]);

  const addLog = (amount: number) => {
    const newLog: WaterLog = { amount, timestamp: Date.now() };
    setWaterData(prev => ({ ...prev, logs: [...prev.logs, newLog] }));
  };
  
  const handleGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newGoal = parseInt(e.target.value, 10);
    if (!isNaN(newGoal) && newGoal > 0) {
      setWaterData(prev => ({ ...prev, dailyGoal: newGoal }));
    }
  };

  const requestNotificationPermission = async () => {
    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
    if (permission === 'granted') {
      new Notification('Hydration Reminders Enabled!', {
        body: "We'll remind you to drink water.",
        icon: '/icons/icon-192x192.png',
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <header className="flex items-center gap-4 mb-6 pb-3 border-b-2 border-indigo-500 dark:border-indigo-400">
          <WaterIcon className="w-10 h-10 text-indigo-500 dark:text-indigo-400" />
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
            Water Reminder
          </h2>
      </header>
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-xl space-y-8 transition-all duration-300 ease-in-out hover:shadow-2xl hover:scale-[1.01]">
        
        {/* Progress Visualization */}
        <div className="relative w-48 h-72 mx-auto border-4 border-gray-300 dark:border-gray-500 rounded-t-3xl rounded-b-lg overflow-hidden bg-gray-50 dark:bg-slate-700">
          <div 
            className="absolute bottom-0 left-0 w-full bg-blue-400 transition-all duration-500 ease-out"
            style={{ height: `${progressPercentage}%` }}
          >
            <div className="absolute top-0 left-0 w-full h-4 bg-blue-300/50 opacity-50"></div>
          </div>
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-2 z-10">
            <span className="text-4xl font-bold text-gray-800 dark:text-white drop-shadow-lg">{totalIntake}</span>
            <span className="text-lg text-gray-600 dark:text-gray-300">/ {waterData.dailyGoal} ml</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-4">
          <button onClick={() => addLog(250)} className="py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition transform hover:scale-105">+250 ml</button>
          <button onClick={() => addLog(500)} className="py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition transform hover:scale-105">+500 ml</button>
          <button onClick={() => addLog(750)} className="py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition transform hover:scale-105">+750 ml</button>
        </div>
        
        {/* Settings */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700 space-y-4">
          <div>
            <label htmlFor="daily-goal" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Daily Goal (ml)
            </label>
            <input
              type="number"
              id="daily-goal"
              value={waterData.dailyGoal}
              onChange={handleGoalChange}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-gray-100"
              step="100"
              min="100"
            />
          </div>
          <div>
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notifications
            </label>
            {notificationPermission !== 'granted' ? (
                <button onClick={requestNotificationPermission} className="w-full py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition transform hover:scale-105">
                    Enable Reminders
                </button>
            ) : (
                <p className="text-center text-sm text-green-600 dark:text-green-400 p-2 bg-green-50 dark:bg-green-900/50 rounded-md">Notifications are enabled.</p>
            )}
            <p className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400">Your browser will ask for permission to show notifications.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaterReminder;