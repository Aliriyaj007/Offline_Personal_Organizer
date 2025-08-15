import React, { useState, useEffect } from 'react';
import { Appointment, Client, AppointmentStatus } from '../../types';
import { APPOINTMENT_STATUSES } from '../../constants';

interface AppointmentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (apptData: Omit<Appointment, 'id' | 'createdAt'>, isEditing: boolean) => void;
  appointment: Appointment | null;
  clients: Client[];
  preselectedClientId?: string | null;
}

const AppointmentFormModal: React.FC<AppointmentFormModalProps> = (props) => {
  const { isOpen, onClose, onSave, appointment, clients, preselectedClientId } = props;
  
  const [clientId, setClientId] = useState('');
  const [service, setService] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [status, setStatus] = useState<AppointmentStatus>('Scheduled');
  const [notes, setNotes] = useState('');

  const isEditing = appointment !== null;

  useEffect(() => {
    if (isOpen) {
      if (isEditing) {
        setClientId(appointment.clientId);
        setService(appointment.service);
        setDate(appointment.date);
        setTime(appointment.time);
        setStatus(appointment.status);
        setNotes(appointment.notes || '');
      } else {
        setClientId(preselectedClientId || (clients[0]?.id || ''));
        setService('');
        setDate(new Date().toISOString().split('T')[0]);
        setTime('');
        setStatus('Scheduled');
        setNotes('');
      }
    }
  }, [appointment, isEditing, isOpen, preselectedClientId, clients]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId || !service.trim() || !date || !time) {
      return alert('Client, Service, Date, and Time are required.');
    }
    onSave({ clientId, service, date, time, status, notes }, isEditing);
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-[100]" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-2xl font-bold">{isEditing ? 'Edit Appointment' : 'New Appointment'}</h2>
          
          <div>
            <label className="label">Client</label>
            <select value={clientId} onChange={e => setClientId(e.target.value)} required className="input-field mt-1" disabled={!!preselectedClientId}>
                <option value="" disabled>Select a client</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <InputField label="Service / Reason" value={service} onChange={e => setService(e.target.value)} required />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Date" type="date" value={date} onChange={e => setDate(e.target.value)} required />
            <InputField label="Time" type="time" value={time} onChange={e => setTime(e.target.value)} required />
          </div>
          <div>
            <label className="label">Status</label>
            <select value={status} onChange={e => setStatus(e.target.value as AppointmentStatus)} className="input-field mt-1">
                {APPOINTMENT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Notes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="input-field mt-1" />
          </div>
          
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md">{isEditing ? 'Save Changes' : 'Schedule'}</button>
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

export default AppointmentFormModal;
