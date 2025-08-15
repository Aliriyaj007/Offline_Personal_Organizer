import React, { useState, useMemo } from 'react';
import { Homework, HomeworkStatus, HomeworkPriority } from '../../types';
import HomeworkIcon from '../icons/HomeworkIcon';
import PlusIcon from '../icons/PlusIcon';
import HomeworkFormModal from './HomeworkFormModal';
import HomeworkItem from './HomeworkItem';

interface HomeworkTrackerProps {
  homeworks: Homework[];
  setHomeworks: (value: Homework[] | ((val: Homework[]) => Homework[])) => void;
  onDeleteHomework: (homework: Homework) => void;
}

type GroupingOption = 'dueDate' | 'subject';

const HomeworkTracker: React.FC<HomeworkTrackerProps> = ({ homeworks, setHomeworks, onDeleteHomework }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHomework, setEditingHomework] = useState<Homework | null>(null);
  const [grouping, setGrouping] = useState<GroupingOption>('dueDate');

  const handleSave = (homeworkData: Homework) => {
    setHomeworks(prev => {
      const exists = prev.some(h => h.id === homeworkData.id);
      return exists
        ? prev.map(h => (h.id === homeworkData.id ? homeworkData : h))
        : [homeworkData, ...prev];
    });
    setIsModalOpen(false);
    setEditingHomework(null);
  };
  
  const handleStatusChange = (id: string, status: HomeworkStatus) => {
      setHomeworks(prev => prev.map(h => h.id === id ? {...h, status} : h));
  }

  const openAddModal = () => {
    setEditingHomework(null);
    setIsModalOpen(true);
  };

  const openEditModal = (homework: Homework) => {
    setEditingHomework(homework);
    setIsModalOpen(true);
  };
  
  const sortedHomeworks = useMemo(() => {
    const priorityOrder: Record<HomeworkPriority, number> = { high: 0, medium: 1, low: 2 };
    return [...homeworks].sort((a, b) => {
        if (a.status === HomeworkStatus.Completed && b.status !== HomeworkStatus.Completed) return 1;
        if (a.status !== HomeworkStatus.Completed && b.status === HomeworkStatus.Completed) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime() || priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }, [homeworks]);
  
  const groupedHomeworks = useMemo(() => {
    if (grouping === 'subject') {
      return sortedHomeworks.reduce((acc, hw) => {
        const key = hw.subject || 'No Subject';
        if (!acc[key]) acc[key] = [];
        acc[key].push(hw);
        return acc;
      }, {} as Record<string, Homework[]>);
    }
    // Group by due date
    const today = new Date(); today.setHours(0,0,0,0);
    const endOfWeek = new Date(today); endOfWeek.setDate(today.getDate() + 7);
    return sortedHomeworks.reduce((acc, hw) => {
        const dueDate = new Date(hw.dueDate);
        let key = 'Later';
        if (dueDate < today) key = 'Overdue';
        else if (dueDate.getTime() === today.getTime()) key = 'Today';
        else if (dueDate < endOfWeek) key = 'This Week';
        if (!acc[key]) acc[key] = [];
        acc[key].push(hw);
        return acc;
    }, {} as Record<string, Homework[]>);
  }, [sortedHomeworks, grouping]);

  const groupOrder: string[] = grouping === 'dueDate' ? ['Overdue', 'Today', 'This Week', 'Later'] : Object.keys(groupedHomeworks).sort();

  return (
    <>
      <div className="space-y-6">
        <header className="flex items-center gap-4 pb-3 border-b-2 border-indigo-500 dark:border-indigo-400">
          <HomeworkIcon className="w-10 h-10 text-indigo-500 dark:text-indigo-400" />
          <h2 className="text-3xl font-bold flex-grow">Homework Tracker</h2>
          <button onClick={openAddModal} className="btn-primary">
            <PlusIcon className="w-5 h-5"/> <span className="hidden sm:inline">Add Assignment</span>
          </button>
        </header>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg">
            <div className="flex justify-end mb-4">
                <select value={grouping} onChange={e => setGrouping(e.target.value as GroupingOption)} className="input-field">
                    <option value="dueDate">Group by Due Date</option>
                    <option value="subject">Group by Subject</option>
                </select>
            </div>

            <div className="space-y-6">
                {homeworks.length > 0 ? groupOrder.map(group => groupedHomeworks[group] && (
                    <div key={group}>
                        <h3 className="font-semibold text-lg text-gray-700 dark:text-gray-200 mb-2">{group}</h3>
                        <ul className="space-y-3">
                            {groupedHomeworks[group].map(hw => 
                                <HomeworkItem key={hw.id} homework={hw} onEdit={() => openEditModal(hw)} onDelete={() => onDeleteHomework(hw)} onStatusChange={handleStatusChange} />
                            )}
                        </ul>
                    </div>
                )) : (
                    <div className="text-center py-10">
                        <p className="text-lg text-gray-500">No assignments yet. Add one to get started!</p>
                    </div>
                )}
            </div>
        </div>
      </div>
      {isModalOpen && <HomeworkFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} homework={editingHomework} />}
       <style>{`
        .btn-primary { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background-color: #4f46e5; color: white; border-radius: 0.5rem; transition: background-color 0.2s; }
        .btn-primary:hover { background-color: #4338ca; }
        .input-field { background-color: white; border: 1px solid #D1D5DB; border-radius: 0.375rem; padding: 0.5rem 0.75rem; }
        .dark .input-field { background-color: #374151; border-color: #4B5563; color: #F9FAFB; }
      `}</style>
    </>
  );
};

export default HomeworkTracker;
