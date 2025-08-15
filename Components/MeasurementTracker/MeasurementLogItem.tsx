import React from 'react';
import { Measurement } from '../../types';
import PencilIcon from '../icons/PencilIcon';
import TrashIcon from '../icons/TrashIcon';

interface MeasurementLogItemProps {
  measurement: Measurement;
  onEdit: () => void;
  onDelete: () => void;
}

const MeasurementLogItem: React.FC<MeasurementLogItemProps> = ({ measurement, onEdit, onDelete }) => {
    const formattedDate = new Date(measurement.date + 'T00:00:00').toLocaleDateString(undefined, {
        year: 'numeric', month: 'long', day: 'numeric'
    });
    
    const metrics: {label: string, value: string}[] = [];
    if (measurement.weight) metrics.push({ label: 'Weight', value: `${measurement.weight.value} ${measurement.weight.unit}` });
    if (measurement.height) metrics.push({ label: 'Height', value: `${measurement.height.value} ${measurement.height.unit}` });
    if (measurement.bodyFat) metrics.push({ label: 'Body Fat', value: `${measurement.bodyFat}%` });
    
    Object.entries(measurement.custom).forEach(([key, { value, unit }]) => {
        metrics.push({ label: key, value: `${value} ${unit}` });
    });

  return (
    <div className="group bg-gray-50 dark:bg-slate-700/50 p-3 rounded-lg">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-bold text-md text-gray-800 dark:text-white">{formattedDate}</p>
          <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            {metrics.map(m => (
                <div key={m.label}>
                    <span className="text-gray-500 dark:text-gray-400">{m.label}: </span>
                    <span className="font-medium text-gray-700 dark:text-gray-200">{m.value}</span>
                </div>
            ))}
          </div>
        </div>
        <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onEdit} title="Edit" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-600"><PencilIcon className="w-4 h-4"/></button>
          <button onClick={onDelete} title="Delete" className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50"><TrashIcon className="w-4 h-4 text-red-500"/></button>
        </div>
      </div>
    </div>
  );
};

export default MeasurementLogItem;