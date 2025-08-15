import React, { useState, useMemo } from 'react';
import { GroceryItem } from '../../types';
import GroceryForm from './GroceryForm';
import GroceryItemComponent from './GroceryItem';
import GroceryIcon from '../icons/GroceryIcon';
import GroceryDashboard from './GroceryDashboard';
import ListDetailsIcon from '../icons/ListDetailsIcon';
import AnalyticsIcon from '../icons/AnalyticsIcon';

interface GroceryListProps {
  items: GroceryItem[];
  setItems: (value: GroceryItem[] | ((val: GroceryItem[]) => GroceryItem[])) => void;
  onDeleteItem: (item: GroceryItem) => void;
}

type ViewMode = 'list' | 'dashboard';

const GroceryList: React.FC<GroceryListProps> = ({ items, setItems, onDeleteItem }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [editingItem, setEditingItem] = useState<GroceryItem | null>(null);

  const handleSaveItem = (itemData: Omit<GroceryItem, 'id' | 'createdAt'>) => {
    if (editingItem) {
      setItems(prev =>
        prev.map(item =>
          item.id === editingItem.id ? { ...item, ...itemData } : item
        )
      );
    } else {
      const newItem: GroceryItem = {
        id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
        createdAt: Date.now(),
        ...itemData,
      };
      setItems(prev => [newItem, ...prev]);
    }
    setEditingItem(null); // Close form/modal after saving
  };

  const toggleItem = (id: string) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, purchased: !item.purchased } : item
      )
    );
  };

  const clearPurchased = () => {
    if(window.confirm('Are you sure you want to clear all purchased items? This action cannot be undone.')) {
        setItems(prev => prev.filter(item => !item.purchased));
    }
  };

  const sortedItems = useMemo(() => 
    [...items].sort((a, b) => Number(a.purchased) - Number(b.purchased) || Number(b.isUrgent) - Number(a.isUrgent) || b.createdAt - a.createdAt),
  [items]);
  
  const groupedItems = useMemo(() => {
    return sortedItems.reduce((acc, item) => {
        const category = item.category || 'Other';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(item);
        return acc;
    }, {} as Record<string, GroceryItem[]>);
  }, [sortedItems]);

  return (
    <div className="max-w-4xl mx-auto">
      <header className="flex items-center gap-4 mb-4 pb-3 border-b-2 border-indigo-500 dark:border-indigo-400">
        <GroceryIcon className="w-10 h-10 text-indigo-500 dark:text-indigo-400" />
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
          Grocery & Shopping List
        </h2>
      </header>

      <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-xl transition-all duration-300 ease-in-out hover:shadow-2xl">
        <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
           <nav className="flex space-x-2" aria-label="Tabs">
            <TabButton icon={ListDetailsIcon} label="List" isActive={viewMode === 'list'} onClick={() => setViewMode('list')} />
            <TabButton icon={AnalyticsIcon} label="Dashboard" isActive={viewMode === 'dashboard'} onClick={() => setViewMode('dashboard')} />
          </nav>
        </div>

        {viewMode === 'list' && (
          <div className="space-y-6">
            <GroceryForm 
                onSaveItem={handleSaveItem} 
                editingItem={editingItem}
                onCancelEdit={() => setEditingItem(null)}
            />
            {Object.keys(groupedItems).length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">Your shopping list is empty. Add some items!</p>
            ) : (
              <div className="space-y-4">
                {Object.entries(groupedItems).map(([category, itemsInCategory]) => (
                  <div key={category}>
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2 px-1">{category}</h3>
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                      {itemsInCategory.map(item => (
                        <GroceryItemComponent
                          key={item.id}
                          item={item}
                          onToggle={toggleItem}
                          onDelete={onDeleteItem}
                          onEdit={() => setEditingItem(item)}
                        />
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
            {items.some(item => item.purchased) && (
              <button
                onClick={clearPurchased}
                className="w-full mt-4 px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-100 dark:hover:bg-red-700/30 hover:border-red-600 dark:hover:border-red-400 hover:text-red-600 dark:hover:text-red-400 transition-all duration-150 ease-in-out text-sm font-medium"
              >
                Clear Purchased Items
              </button>
            )}
            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Total items: {items.length} | To buy: {items.filter(i => !i.purchased).length}
            </div>
          </div>
        )}
        
        {viewMode === 'dashboard' && <GroceryDashboard items={items} />}

      </div>
    </div>
  );
};

const TabButton: React.FC<{icon: React.FC<{className?: string}>, label: string, isActive: boolean, onClick: () => void}> = ({icon: Icon, label, isActive, onClick}) => (
     <button
        onClick={onClick}
        className={`flex items-center gap-2 whitespace-nowrap py-2 px-4 text-sm font-medium rounded-t-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 ${
          isActive
            ? 'bg-indigo-100 text-indigo-700 dark:bg-slate-700 dark:text-indigo-300'
            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-slate-700/50 dark:hover:text-gray-200'
        }`}
      >
        <Icon className="w-5 h-5"/>
        {label}
      </button>
)

export default GroceryList;