import React, { useState, useEffect } from 'react';
import { GroceryItem } from '../../types';
import { DEFAULT_GROCERY_CATEGORIES } from '../../constants';

interface GroceryFormProps {
  onSaveItem: (itemData: Omit<GroceryItem, 'id' | 'createdAt'>) => void;
  editingItem: GroceryItem | null;
  onCancelEdit: () => void;
}

const GroceryForm: React.FC<GroceryFormProps> = ({ onSaveItem, editingItem, onCancelEdit }) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState(DEFAULT_GROCERY_CATEGORIES[0]);
  const [price, setPrice] = useState('');
  const [store, setStore] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  
  const isEditing = editingItem !== null;

  useEffect(() => {
    if (isEditing) {
      setName(editingItem.name);
      setQuantity(editingItem.quantity);
      setCategory(editingItem.category || DEFAULT_GROCERY_CATEGORIES[0]);
      setPrice(editingItem.price?.toString() || '');
      setStore(editingItem.store || '');
      setIsUrgent(editingItem.isUrgent || false);
    } else {
      // Reset form when not editing
      setName('');
      setQuantity('');
      setCategory(DEFAULT_GROCERY_CATEGORIES[0]);
      setPrice('');
      setStore('');
      setIsUrgent(false);
    }
  }, [editingItem, isEditing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Item name cannot be empty.');
      return;
    }
    onSaveItem({
      name,
      quantity,
      category,
      price: price ? parseFloat(price) : undefined,
      store,
      isUrgent,
      purchased: isEditing ? editingItem.purchased : false
    });
    // Reset form after submission only if not editing
    if (!isEditing) {
      setName('');
      setQuantity('');
      setPrice('');
      setStore('');
      setIsUrgent(false);
      // Keep category for next item
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{isEditing ? 'Edit Item' : 'Add New Item'}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div className="md:col-span-2">
          <label htmlFor="itemName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Item Name</label>
          <input type="text" id="itemName" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Organic Milk" required
            className="mt-1 w-full input-field" />
        </div>
        
        {/* Quantity & Category */}
        <div>
          <label htmlFor="itemQuantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Quantity</label>
          <input type="text" id="itemQuantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="e.g., 1 Gallon"
            className="mt-1 w-full input-field" />
        </div>
        <div>
          <label htmlFor="itemCategory" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
          <input list="categories" id="itemCategory" value={category} onChange={e => setCategory(e.target.value)}
            className="mt-1 w-full input-field" />
          <datalist id="categories">
            {DEFAULT_GROCERY_CATEGORIES.map(cat => <option key={cat} value={cat} />)}
          </datalist>
        </div>

        {/* Price & Store */}
        <div>
          <label htmlFor="itemPrice" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price (optional)</label>
          <input type="number" id="itemPrice" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" min="0" step="0.01"
            className="mt-1 w-full input-field" />
        </div>
        <div>
          <label htmlFor="itemStore" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Store (optional)</label>
          <input type="text" id="itemStore" value={store} onChange={(e) => setStore(e.target.value)} placeholder="e.g., Target"
            className="mt-1 w-full input-field" />
        </div>
      </div>
      
      {/* Urgent Checkbox */}
      <div className="flex items-center gap-x-2">
        <input type="checkbox" id="isUrgent" checked={isUrgent} onChange={e => setIsUrgent(e.target.checked)} 
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
        <label htmlFor="isUrgent" className="text-sm font-medium text-gray-700 dark:text-gray-300">Mark as urgent</label>
      </div>
      
      {/* Buttons */}
      <div className="flex justify-end gap-x-3">
        {isEditing && (
          <button type="button" onClick={onCancelEdit}
            className="px-4 py-2 border border-gray-300 dark:border-gray-500 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">
            Cancel
          </button>
        )}
        <button type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          {isEditing ? 'Save Changes' : 'Add Item'}
        </button>
      </div>
       <style>{`
        .input-field {
          background-color: white;
          border: 1px solid #D1D5DB; /* gray-300 */
          border-radius: 0.375rem; /* rounded-md */
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem; /* sm:text-sm */
          color: #111827; /* gray-900 */
          box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); /* shadow-sm */
        }
        .dark .input-field {
          background-color: #374151; /* gray-700 */
          border-color: #4B5563; /* gray-600 */
          color: #F9FAFB; /* gray-100 */
        }
        .input-field:focus {
          outline: none;
          --tw-ring-color: #6366F1; /* indigo-500 */
          box-shadow: 0 0 0 2px var(--tw-ring-color);
          border-color: #6366F1;
        }
      `}</style>
    </form>
  );
};

export default GroceryForm;