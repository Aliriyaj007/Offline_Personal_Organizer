import React, { useState, useEffect } from 'react';
import { Measurement, MeasurementUnit } from '../../types';
import PlusIcon from '../icons/PlusIcon';
import TrashIcon from '../icons/TrashIcon';

interface MeasurementFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (measurementData: Omit<Measurement, 'id'>) => void;
  measurement: Measurement | null;
}

type CustomField = { key: string; value: string; unit: MeasurementUnit };

const MeasurementFormModal: React.FC<MeasurementFormModalProps> = ({ isOpen, onClose, onSave, measurement }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [weight, setWeight] = useState({ value: '', unit: 'kg' as MeasurementUnit });
  const [height, setHeight] = useState({ value: '', unit: 'cm' as MeasurementUnit });
  const [bodyFat, setBodyFat] = useState('');
  const [customFields, setCustomFields] = useState<CustomField[]>([]);

  const isEditing = measurement !== null;

  useEffect(() => {
    if (isOpen) {
      if (isEditing) {
        setDate(measurement.date);
        setWeight({ value: measurement.weight?.value.toString() || '', unit: measurement.weight?.unit || 'kg' });
        setHeight({ value: measurement.height?.value.toString() || '', unit: measurement.height?.unit || 'cm' });
        setBodyFat(measurement.bodyFat?.toString() || '');
        setCustomFields(Object.entries(measurement.custom).map(([key, { value, unit }]) => ({ key, value: value.toString(), unit })));
      } else {
        setDate(new Date().toISOString().split('T')[0]);
        setWeight({ value: '', unit: 'kg' });
        setHeight({ value: '', unit: 'cm' });
        setBodyFat('');
        setCustomFields([]);
      }
    }
  }, [measurement, isEditing, isOpen]);
  
  const handleCustomFieldChange = (index: number, field: keyof CustomField, value: string) => {
    const newFields = [...customFields];
    newFields[index] = { ...newFields[index], [field]: value };
    setCustomFields(newFields);
  };

  const addCustomField = () => {
    setCustomFields([...customFields, { key: '', value: '', unit: 'cm' }]);
  };

  const removeCustomField = (index: number) => {
    setCustomFields(customFields.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const customData: Measurement['custom'] = customFields.reduce((acc, field) => {
        if(field.key.trim() && field.value.trim()){
            acc[field.key.trim()] = { value: parseFloat(field.value), unit: field.unit };
        }
        return acc;
    }, {} as Measurement['custom']);

    onSave({
        date,
        weight: weight.value ? { value: parseFloat(weight.value), unit: weight.unit } : undefined,
        height: height.value ? { value: parseFloat(height.value), unit: height.unit } : undefined,
        bodyFat: bodyFat ? parseFloat(bodyFat) : undefined,
        custom: customData
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-[100]" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="flex-grow flex flex-col">
          <h2 className="text-2xl font-bold mb-6 flex-shrink-0">{isEditing ? 'Edit Measurement' : 'Add Measurement'}</h2>
          
          <div className="flex-grow overflow-y-auto space-y-4 pr-2 -mr-2">
            <InputField label="Date" type="date" value={date} onChange={e => setDate(e.target.value)} required />
            <div className="grid grid-cols-2 gap-4">
                <UnitInputField label="Weight" value={weight.value} unit={weight.unit} 
                    onValueChange={v => setWeight(p => ({...p, value: v}))} 
                    onUnitChange={u => setWeight(p => ({...p, unit: u as MeasurementUnit}))} 
                    units={['kg', 'lbs']} />
                <UnitInputField label="Height" value={height.value} unit={height.unit}
                    onValueChange={v => setHeight(p => ({...p, value: v}))}
                    onUnitChange={u => setHeight(p => ({...p, unit: u as MeasurementUnit}))}
                    units={['cm', 'in']} />
            </div>
            <InputField label="Body Fat (%)" type="number" step="0.1" value={bodyFat} onChange={e => setBodyFat(e.target.value)} />

            <div className="pt-2">
                <h3 className="text-lg font-semibold">Custom Fields</h3>
                <div className="space-y-2 mt-2">
                    {customFields.map((field, index) => (
                        <div key={index} className="flex items-end gap-2">
                            <InputField label="Name" placeholder="e.g., Waist" value={field.key} onChange={e => handleCustomFieldChange(index, 'key', e.target.value)} className="flex-grow" />
                            <UnitInputField label="Value" value={field.value} unit={field.unit}
                                onValueChange={v => handleCustomFieldChange(index, 'value', v)}
                                onUnitChange={u => handleCustomFieldChange(index, 'unit', u)}
                                units={['cm', 'in']} className="flex-grow" />
                            <button type="button" onClick={() => removeCustomField(index)} className="p-2 text-red-500 rounded-md hover:bg-red-100 dark:hover:bg-red-900/50"><TrashIcon className="w-5 h-5"/></button>
                        </div>
                    ))}
                </div>
                <button type="button" onClick={addCustomField} className="mt-3 flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400">
                    <PlusIcon className="w-4 h-4"/> Add Custom Field
                </button>
            </div>
          </div>
          
          <div className="flex-shrink-0 mt-6 flex justify-end gap-4">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md">Save Entry</button>
          </div>
        </form>
        <style>{`.label { display: block; font-size: 0.875rem; font-weight: 500; color: #374151; } .dark .label { color: #D1D5DB; } .input-field { background-color: white; border: 1px solid #D1D5DB; border-radius: 0.375rem; padding: 0.5rem 0.75rem; width: 100%;} .dark .input-field { background-color: #374151; border-color: #4B5563; color: #F9FAFB; }`}</style>
      </div>
    </div>
  );
};

const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, className, ...props }) => (
  <div className={className}>
    <label className="label">{label}</label>
    <input {...props} className="input-field mt-1" />
  </div>
);

const UnitInputField: React.FC<{ label: string, value: string, unit: string, onValueChange: (v: string) => void, onUnitChange: (u: string) => void, units: string[], className?: string }> = 
({ label, value, unit, onValueChange, onUnitChange, units, className }) => (
    <div className={className}>
        <label className="label">{label}</label>
        <div className="flex mt-1">
            <input type="number" step="0.1" value={value} onChange={e => onValueChange(e.target.value)} className="input-field rounded-r-none w-full" />
            <select value={unit} onChange={e => onUnitChange(e.target.value)} className="input-field rounded-l-none border-l-0">
                {units.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
        </div>
    </div>
);


export default MeasurementFormModal;