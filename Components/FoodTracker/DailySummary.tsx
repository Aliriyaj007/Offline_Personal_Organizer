
import React from 'react';

interface DailySummaryProps {
  summary: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

// Example daily goals, can be made configurable later
const GOALS = {
    calories: 2000,
    protein: 120, // grams
    carbs: 250, // grams
    fat: 65, // grams
};

const DailySummary: React.FC<DailySummaryProps> = ({ summary }) => {
    return (
        <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-center">Daily Totals</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                <SummaryCard label="Calories" value={summary.calories.toFixed(0)} unit="kcal" />
                <SummaryCard label="Protein" value={summary.protein.toFixed(1)} unit="g" />
                <SummaryCard label="Carbs" value={summary.carbs.toFixed(1)} unit="g" />
                <SummaryCard label="Fat" value={summary.fat.toFixed(1)} unit="g" />
            </div>
             <div className="mt-4 space-y-3">
                <MacroBar label="Protein" value={summary.protein} goal={GOALS.protein} color="bg-sky-500" />
                <MacroBar label="Carbs" value={summary.carbs} goal={GOALS.carbs} color="bg-amber-500" />
                <MacroBar label="Fat" value={summary.fat} goal={GOALS.fat} color="bg-pink-500" />
            </div>
        </div>
    );
};

const SummaryCard: React.FC<{ label: string; value: string; unit: string }> = ({ label, value, unit }) => (
    <div className="p-3 bg-white dark:bg-slate-800 rounded-lg shadow">
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-xl font-bold text-gray-800 dark:text-white">{value}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500">{unit}</p>
    </div>
);

const MacroBar: React.FC<{ label: string, value: number, goal: number, color: string }> = ({ label, value, goal, color }) => {
    const percentage = goal > 0 ? Math.min((value / goal) * 100, 100) : 0;
    return (
        <div>
            <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700 dark:text-gray-300">{label}</span>
                <span className="text-gray-500 dark:text-gray-400">{value.toFixed(1)}g / {goal}g</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-2.5">
                <div className={`${color} h-2.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    );
}


export default DailySummary;
