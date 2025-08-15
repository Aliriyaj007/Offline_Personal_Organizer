import React from 'react';
import { GroceryItem } from '../../types';
import FlameIcon from '../icons/FlameIcon';
import TrashIcon from '../icons/TrashIcon';

interface GroceryItemProps {
  item: GroceryItem;
  onToggle: (id: string) => void;
  onDelete: (item: GroceryItem) => void;
  onEdit: (item: GroceryItem) => void;
}

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

const EditIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>
);


const GroceryItemComponent: React.FC<GroceryItemProps> = ({ item, onToggle, onDelete, onEdit }) => {
  const formatPrice = (price?: number) => {
    if (price === undefined) return null;
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(price);
  };
  
  return (
    <li className={`py-3 flex items-center justify-between group hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded transition-colors duration-150 ${item.isUrgent && !item.purchased ? 'bg-red-50 dark:bg-red-900/60' : ''}`}>
      <div className="flex items-center flex-grow min-w-0 px-2">
         <button
          onClick={() => onToggle(item.id)}
          className={`w-6 h-6 rounded-md border-2 flex items-center justify-center mr-3 flex-shrink-0
            ${item.purchased 
                ? 'bg-green-500 border-green-500 dark:bg-green-600 dark:border-green-600 hover:bg-green-600 dark:hover:bg-green-700' 
                : 'border-gray-300 dark:border-gray-500 hover:border-green-400 dark:hover:border-green-500'}
            transition-all duration-150 ease-in-out`}
          aria-label={item.purchased ? "Mark as not purchased" : "Mark as purchased"}
        >
          {item.purchased && <CheckIcon className="w-4 h-4 text-white" />}
        </button>
        <div className="flex-grow min-w-0">
            <div className="flex items-center gap-2">
                 {item.isUrgent && !item.purchased && <FlameIcon className="w-4 h-4 text-red-500 flex-shrink-0" />}
                <span
                className={`block text-md font-medium text-gray-800 dark:text-gray-100 truncate ${item.purchased ? 'line-through text-gray-500 dark:text-gray-400 opacity-70' : ''}`}
                >
                {item.name}
                </span>
            </div>
            <div className={`flex items-center gap-x-3 text-xs text-gray-500 dark:text-gray-400 mt-1 ${item.purchased ? 'line-through opacity-70' : ''}`}>
                {item.quantity && <span>Qty: {item.quantity}</span>}
                {item.store && <span>@ {item.store}</span>}
            </div>
        </div>
      </div>
      <div className="flex items-center flex-shrink-0 ml-4">
        {item.price !== undefined && (
            <span className={`text-sm font-medium mr-4 ${item.purchased ? 'line-through text-gray-500 dark:text-gray-400 opacity-70' : 'text-gray-700 dark:text-gray-300'}`}>
                {formatPrice(item.price)}
            </span>
        )}
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100">
            <button
                onClick={() => onEdit(item)}
                className="p-1 text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
                aria-label="Edit grocery item"
            >
                <EditIcon className="w-5 h-5"/>
            </button>
            <button
                onClick={() => onDelete(item)}
                className="p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                aria-label="Delete grocery item"
            >
                <TrashIcon className="w-5 h-5"/>
            </button>
        </div>
      </div>
    </li>
  );
};

export default GroceryItemComponent;