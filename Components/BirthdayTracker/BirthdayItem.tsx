import React from 'react';
import { Birthday } from '../../types';
import PencilIcon from '../icons/PencilIcon';
import TrashIcon from '../icons/TrashIcon';
import CakeIcon from '../icons/CakeIcon';

interface BirthdayItemProps {
  birthday: Birthday;
  onEdit: () => void;
  onDelete: () => void;
}

const getZodiacSign = (date: Date): string => {
  const day = date.getUTCDate();
  const month = date.getUTCMonth() + 1;
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return "Pisces";
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn";
  return "";
};

const BirthdayItem: React.FC<BirthdayItemProps> = ({ birthday, onEdit, onDelete }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const birthDate = new Date(birthday.date);
  birthDate.setUTCHours(12, 0, 0, 0); // Use UTC and midday to avoid timezone shifts

  // Age calculation
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  const nextAge = age + 1;

  // Next birthday calculation
  let nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  if (nextBirthday < today) {
    nextBirthday.setFullYear(today.getFullYear() + 1);
  }

  // Countdown
  const daysUntil = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  const isToday = daysUntil === 0;
  const zodiac = getZodiacSign(birthDate);
  const formattedBirthDate = birthDate.toLocaleDateString(undefined, { timeZone: 'UTC', month: 'long', day: 'numeric' });

  return (
    <div className={`group flex items-center p-4 rounded-lg transition-all ${isToday ? 'bg-yellow-100 dark:bg-yellow-900/50 ring-2 ring-yellow-400' : 'bg-gray-50 dark:bg-slate-700/50'}`}>
      <div className="flex-grow">
        <div className="flex items-center gap-3">
            {isToday && <CakeIcon className="w-6 h-6 text-yellow-500" />}
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">{birthday.name}</h3>
        </div>
        
        {isToday ? (
            <p className="text-yellow-600 dark:text-yellow-300 font-semibold">Happy Birthday! Turning {nextAge} today!</p>
        ) : (
            <p className="text-sm text-gray-600 dark:text-gray-300">
                Turns {nextAge} on {formattedBirthDate}
            </p>
        )}

        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mt-2">
            <span>{zodiac}</span>
            { daysUntil > 0 && <span className="font-semibold">{daysUntil} day{daysUntil !== 1 ? 's' : ''} left</span> }
        </div>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={onEdit} title="Edit" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-600"><PencilIcon className="w-5 h-5"/></button>
        <button onClick={onDelete} title="Delete" className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50"><TrashIcon className="w-5 h-5 text-red-500"/></button>
      </div>
    </div>
  );
};

export default BirthdayItem;