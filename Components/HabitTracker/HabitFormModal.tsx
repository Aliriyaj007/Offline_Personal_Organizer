import React, { useState, useEffect } from 'react';
import { Habit, HabitFrequency } from '../../types';

interface HabitFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (habit: Habit) => void;
  habit: Habit | null;
}

const ICONS = ['🎯', '💧', '🏃', '📖', '🧘', '🎨', '💻', '🧹', '💰', '💪', '🚭', '🥗'];
const COLORS = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef', '#ec4899'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const HabitFormModal: React.FC<HabitFormModalProps> = ({ isOpen, onClose, onSave, habit }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState(ICONS[0]);
  const [color, setColor] = useState(COLORS[0]);
  const [frequencyType, setFrequencyType] = useState<'daily' | 'specific'>('daily');
  const [selectedDays, setSelectedDays] = useState<number[]>([]);

  const isEditing = habit !== null;

  useEffect(() => {
    if (isOpen) {
      if (isEditing) {
        setName(habit.name);
        setDescription(habit.description);
        setIcon(habit.icon);
        setColor(habit.color);
        if (habit.frequency === 'daily') {
          setFrequencyType('daily');
          setSelectedDays([]);
        } else {
          setFrequencyType('specific');
          setSelectedDays(habit.frequency.days);
        }
      } else {
        setName('');
        setDescription('');
        setIcon(ICONS[0]);
        setColor(COLORS[0]);
        setFrequencyType('daily');
        setSelectedDays([]);
      }
    }
  }, [habit, isEditing, isOpen]);

  const handleDayToggle = (dayIndex: number) => {
    setSelectedDays(prev => 
      prev.includes(dayIndex) ? prev.filter(d => d !== dayIndex) : [...prev, dayIndex]
    );
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert('Habit name is required.');
    
    let frequency: HabitFrequency;
    if (frequencyType === 'daily') {
      frequency = 'daily';
    } else {
      if (selectedDays.length === 0) return alert('Please select at least one day.');
      frequency = { days: selectedDays.sort((a,b)=> a-b) };
    }

    const habitData: Habit = {
      id: isEditing ? habit.id : Date.now().toString(),
      name,
      description,
      icon,
      color,
      frequency,
      completions: isEditing ? habit.completions : {},
      createdAt: isEditing ? habit.createdAt : Date.now(),
    };
    onSave(habitData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-[100]" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{isEditing ? 'Edit Habit' : 'Add New Habit'}</h2>
          
          <div>
            <label className="label">Habit Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required className="input-field w-full mt-1" />
          </div>
          
          <div className="flex items-center gap-4">
            <div>
                <label className="label">Icon</label>
                <select value={icon} onChange={e => setIcon(e.target.value)} className="input-field mt-1 text-2xl" style={{backgroundColor: color, color: 'white'}}>
                    {ICONS.map(i => <option key={i} value={i} className="text-lg">{i}</option>)}
                </select>
            </div>
             <div>
                <label className="label">Color</label>
                <div className="flex flex-wrap gap-2 mt-2">
                    {COLORS.map(c => (
                        <button type="button" key={c} onClick={() => setColor(c)} style={{backgroundColor: c}} className={`w-7 h-7 rounded-full transition-transform transform hover:scale-110 ${color === c ? 'ring-2 ring-offset-2 ring-indigo-500' : ''}`} />
                    ))}
                </div>
            </div>
          </div>

          <div>
            <label className="label">Frequency</label>
            <div className="flex gap-4 mt-1">
              <button type="button" onClick={() => setFrequencyType('daily')} className={`freq-button ${frequencyType === 'daily' ? 'active' : ''}`}>Daily</button>
              <button type="button" onClick={() => setFrequencyType('specific')} className={`freq-button ${frequencyType === 'specific' ? 'active' : ''}`}>Specific Days</button>
            </div>
            {frequencyType === 'specific' && (
              <div className="flex justify-around gap-1 mt-3 bg-gray-100 dark:bg-slate-700 p-2 rounded-lg">
                {DAYS.map((day, i) => (
                  <button type="button" key={day} onClick={() => handleDayToggle(i)}
                    className={`day-button ${selectedDays.includes(i) ? 'active' : ''}`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-4">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Save</button>
          </div>
        </form>
         <style>{`
            .label { display: block; font-size: 0.875rem; font-weight: 500; color: #374151; }
            .dark .label { color: #D1D5DB; }
            .input-field { background-color: white; border: 1px solid #D1D5DB; border-radius: 0.375rem; padding: 0.5rem 0.75rem; }
            .dark .input-field { background-color: #374151; border-color: #4B5563; color: #F9FAFB; }
            .freq-button { flex-grow: 1; padding: 0.5rem; border: 1px solid #D1D5DB; border-radius: 0.375rem; }
            .dark .freq-button { border-color: #4B5563; }
            .freq-button.active { background-color: #4f46e5; color: white; border-color: #4f46e5; }
            .day-button { flex-grow: 1; padding: 0.5rem; border-radius: 0.25rem; font-weight: 500; transition: background-color 0.2s; }
            .dark .day-button { color: #D1D5DB; }
            .day-button.active { background-color: #4f46e5; color: white; }
          `}</style>
      </div>
    </div>
  );
};

export default HabitFormModal;