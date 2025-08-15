import React, { useState, useMemo, useEffect } from 'react';
import { Measurement } from '../../types';
import MeasurementIcon from '../icons/MeasurementIcon';
import PlusIcon from '../icons/PlusIcon';
import MeasurementFormModal from './MeasurementFormModal';
import MeasurementLogItem from './MeasurementLogItem';
import ProgressChart from './ProgressChart';

interface MeasurementTrackerProps {
  measurements: Measurement[];
  setMeasurements: (value: Measurement[] | ((val: Measurement[]) => Measurement[])) => void;
  onDeleteMeasurement: (measurement: Measurement) => void;
}

const MeasurementTracker: React.FC<MeasurementTrackerProps> = ({ measurements, setMeasurements, onDeleteMeasurement }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMeasurement, setEditingMeasurement] = useState<Measurement | null>(null);

  const sortedMeasurements = useMemo(() => 
    [...measurements].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
  [measurements]);

  const availableMetrics = useMemo(() => {
    const metrics = new Set<string>();
    measurements.forEach(m => {
      if (m.weight) metrics.add('Weight');
      if (m.height) metrics.add('Height');
      if (m.bodyFat) metrics.add('Body Fat');
      Object.keys(m.custom).forEach(key => metrics.add(key));
    });
    return Array.from(metrics).sort();
  }, [measurements]);

  const [selectedMetric, setSelectedMetric] = useState<string>('Weight');

  useEffect(() => {
    if (availableMetrics.length > 0 && !availableMetrics.includes(selectedMetric)) {
      setSelectedMetric(availableMetrics[0]);
    } else if (availableMetrics.length > 0 && !selectedMetric) {
      setSelectedMetric(availableMetrics[0]);
    }
  }, [availableMetrics, selectedMetric]);

  const handleSave = (measurementData: Omit<Measurement, 'id'>) => {
    if (editingMeasurement) {
      const updatedMeasurement = { ...editingMeasurement, ...measurementData };
      setMeasurements(prev => prev.map(m => m.id === updatedMeasurement.id ? updatedMeasurement : m));
    } else {
      const newMeasurement: Measurement = { id: Date.now().toString(), ...measurementData };
      setMeasurements(prev => [newMeasurement, ...prev]);
    }
    setIsModalOpen(false);
    setEditingMeasurement(null);
  };

  const openAddModal = () => {
    setEditingMeasurement(null);
    setIsModalOpen(true);
  };

  const openEditModal = (measurement: Measurement) => {
    setEditingMeasurement(measurement);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="space-y-6">
        <header className="flex items-center gap-4 pb-3 border-b-2 border-indigo-500 dark:border-indigo-400">
          <MeasurementIcon className="w-10 h-10 text-indigo-500 dark:text-indigo-400" />
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white flex-grow">
            Body Measurements
          </h2>
          <button onClick={openAddModal} className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition-colors">
            <PlusIcon className="w-5 h-5"/>
            <span className="hidden sm:inline">Add Entry</span>
          </button>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Main content: chart and history */}
            <div className="lg:col-span-3 space-y-6">
                 <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Progress Chart</h3>
                        <select value={selectedMetric} onChange={e => setSelectedMetric(e.target.value)}
                            className="text-sm rounded-md border-gray-300 shadow-sm dark:bg-slate-700 dark:border-gray-600">
                            {availableMetrics.map(m => <option key={m} value={m}>{m}</option>)}
                            {availableMetrics.length === 0 && <option>No Data</option>}
                        </select>
                    </div>
                    <ProgressChart measurements={sortedMeasurements} selectedMetric={selectedMetric} />
                </div>
            </div>

            {/* History List */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold mb-3">Measurement History</h3>
                <div className="max-h-[60vh] overflow-y-auto pr-2 -mr-2 space-y-3">
                    {sortedMeasurements.length > 0 ? (
                        sortedMeasurements.map(m => (
                            <MeasurementLogItem key={m.id} measurement={m} onEdit={() => openEditModal(m)} onDelete={() => onDeleteMeasurement(m)} />
                        ))
                    ) : (
                        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                           <p>No entries yet.</p>
                           <p className="text-sm">Click "Add Entry" to log your first measurement.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
      
      {isModalOpen && (
          <MeasurementFormModal 
            isOpen={isModalOpen}
            onClose={() => { setIsModalOpen(false); setEditingMeasurement(null); }}
            onSave={handleSave}
            measurement={editingMeasurement}
          />
      )}
    </>
  );
};

export default MeasurementTracker;