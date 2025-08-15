import React, { useState, useMemo } from 'react';
import { Birthday } from '../../types';
import BirthdayIcon from '../icons/BirthdayIcon';
import PlusIcon from '../icons/PlusIcon';
import BirthdayFormModal from './BirthdayFormModal';
import BirthdayItem from './BirthdayItem';

interface BirthdayTrackerProps {
  birthdays: Birthday[];
  setBirthdays: (value: Birthday[] | ((val: Birthday[]) => Birthday[])) => void;
  onDeleteBirthday: (birthday: Birthday) => void;
}

const BirthdayTracker: React.FC<BirthdayTrackerProps> = ({ birthdays, setBirthdays, onDeleteBirthday }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBirthday, setEditingBirthday] = useState<Birthday | null>(null);

  const handleSaveBirthday = (birthdayData: Omit<Birthday, 'id' | 'createdAt'>, isEditing: boolean) => {
    if (isEditing && editingBirthday) {
      const updatedBirthday = { ...editingBirthday, ...birthdayData };
      setBirthdays(prev => prev.map(b => b.id === updatedBirthday.id ? updatedBirthday : b));
    } else {
      const newBirthday: Birthday = {
        id: Date.now().toString(),
        createdAt: Date.now(),
        ...birthdayData
      };
      setBirthdays(prev => [newBirthday, ...prev]);
    }
    setIsModalOpen(false);
    setEditingBirthday(null);
  };

  const openAddModal = () => {
    setEditingBirthday(null);
    setIsModalOpen(true);
  };

  const openEditModal = (birthday: Birthday) => {
    setEditingBirthday(birthday);
    setIsModalOpen(true);
  };

  const { upcoming, byMonth } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thirtyDaysFromNow = new Date(today);
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    const birthdaysWithNextDate = birthdays.map(b => {
        const birthDate = new Date(b.date + 'T00:00:00');
        let nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
        if (nextBirthday < today) {
            nextBirthday.setFullYear(today.getFullYear() + 1);
        }
        return { ...b, nextBirthdayDate: nextBirthday };
    });

    const upcoming = birthdaysWithNextDate
        .filter(b => b.nextBirthdayDate >= today && b.nextBirthdayDate <= thirtyDaysFromNow)
        .sort((a, b) => a.nextBirthdayDate.getTime() - b.nextBirthdayDate.getTime());

    const rest = birthdaysWithNextDate
        .filter(b => !(b.nextBirthdayDate >= today && b.nextBirthdayDate <= thirtyDaysFromNow));
    
    const byMonth = rest.reduce((acc, b) => {
      const month = new Date(b.date + 'T00:00:00').getMonth();
      if (!acc[month]) {
        acc[month] = [];
      }
      acc[month].push(b);
      return acc;
    }, {} as Record<number, Birthday[]>);

    // Sort birthdays within each month by day
    for (const month in byMonth) {
      byMonth[month].sort((a, b) => new Date(a.date).getUTCDate() - new Date(b.date).getUTCDate());
    }

    return { upcoming, byMonth };
  }, [birthdays]);
  
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <>
      <div className="space-y-6">
        <header className="flex items-center gap-4 pb-3 border-b-2 border-indigo-500 dark:border-indigo-400">
          <BirthdayIcon className="w-10 h-10 text-indigo-500 dark:text-indigo-400" />
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white flex-grow">
            Birthday Tracker
          </h2>
          <button onClick={openAddModal} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700">
            <PlusIcon className="w-5 h-5"/>
            <span className="hidden sm:inline">Add Birthday</span>
          </button>
        </header>

        <div className="space-y-8">
          {/* Upcoming Birthdays */}
          {upcoming.length > 0 && (
            <section>
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-3">Upcoming (Next 30 days)</h3>
              <div className="space-y-3">
                {upcoming.map(b => (
                  <BirthdayItem key={b.id} birthday={b} onEdit={() => openEditModal(b)} onDelete={() => onDeleteBirthday(b)} />
                ))}
              </div>
            </section>
          )}

          {/* All other birthdays by month */}
          {Object.keys(byMonth).length > 0 && (
             <section>
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-3">All Birthdays</h3>
                {monthNames.map((monthName, index) => (
                    byMonth[index] && byMonth[index].length > 0 && (
                        <div key={monthName} className="mb-6">
                            <h4 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-2">{monthName}</h4>
                            <div className="space-y-3">
                                {byMonth[index].map(b => (
                                    <BirthdayItem key={b.id} birthday={b} onEdit={() => openEditModal(b)} onDelete={() => onDeleteBirthday(b)} />
                                ))}
                            </div>
                        </div>
                    )
                ))}
             </section>
          )}

           {birthdays.length === 0 && (
             <div className="text-center py-16">
                <p className="text-lg text-gray-500 dark:text-gray-400">No birthdays saved yet.</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">Click 'Add Birthday' to start tracking!</p>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <BirthdayFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveBirthday}
          birthday={editingBirthday}
        />
      )}
    </>
  );
};

export default BirthdayTracker;