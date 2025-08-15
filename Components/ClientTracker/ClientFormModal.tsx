import React, { useState, useEffect } from 'react';
import { Client } from '../../types';

interface ClientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (clientData: Omit<Client, 'id' | 'createdAt'>, isEditing: boolean) => void;
  client: Client | null;
}

const ClientFormModal: React.FC<ClientFormModalProps> = ({ isOpen, onClose, onSave, client }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  const isEditing = client !== null;

  useEffect(() => {
    if (isOpen) {
      if (isEditing) {
        setName(client.name);
        setEmail(client.email || '');
        setPhone(client.phone || '');
        setNotes(client.notes || '');
      } else {
        setName(''); setEmail(''); setPhone(''); setNotes('');
      }
    }
  }, [client, isEditing, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert('Client name is required.');
    onSave({ name, email, phone, notes }, isEditing);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-[100]" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-2xl font-bold">{isEditing ? 'Edit Client' : 'Add New Client'}</h2>
          
          <InputField label="Full Name" value={name} onChange={e => setName(e.target.value)} required />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} />
            <InputField label="Phone Number" type="tel" value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
          <div>
            <label className="label">Notes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={4} className="input-field mt-1" />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md">{isEditing ? 'Save Changes' : 'Add Client'}</button>
          </div>
        </form>
        <style>{`.label { display: block; font-size: 0.875rem; font-weight: 500; color: #374151; } .dark .label { color: #D1D5DB; } .input-field { background-color: white; border: 1px solid #D1D5DB; border-radius: 0.375rem; padding: 0.5rem 0.75rem; width: 100%;} .dark .input-field { background-color: #374151; border-color: #4B5563; color: #F9FAFB; }`}</style>
      </div>
    </div>
  );
};

const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
  <div>
    <label className="label">{label}</label>
    <input {...props} className="input-field mt-1" />
  </div>
);

export default ClientFormModal;
