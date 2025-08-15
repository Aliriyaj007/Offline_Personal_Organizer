import React, { useMemo } from 'react';
import { Appointment, Client } from '../../types';
import PlusIcon from '../icons/PlusIcon';
import AppointmentItem from './AppointmentItem';

interface AppointmentListProps {
  appointments: Appointment[];
  clients: Client[];
  onAddAppointment: () => void;
  onEditAppointment: (appointment: Appointment) => void;
  onDeleteAppointment: (appointment: Appointment) => void;
}

const AppointmentList: React.FC<AppointmentListProps> = ({ appointments, clients, onAddAppointment, onEditAppointment, onDeleteAppointment }) => {
    
    const groupedAppointments = useMemo(() => {
        const today = new Date();
        today.setHours(0,0,0,0);

        const sorted = [...appointments].sort((a,b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());

        const upcoming: Record<string, Appointment[]> = {};

        sorted.forEach(appt => {
            const apptDate = new Date(appt.date);
            apptDate.setHours(23,59,59,999);
            if (apptDate >= today) {
                if (!upcoming[appt.date]) {
                    upcoming[appt.date] = [];
                }
                upcoming[appt.date].push(appt);
            }
        });
        return upcoming;

    }, [appointments]);

    const formatDateGroup = (dateString: string) => {
        const today = new Date(); today.setHours(0,0,0,0);
        const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
        const eventDate = new Date(dateString + 'T00:00:00');

        if (eventDate.getTime() === today.getTime()) return 'Today';
        if (eventDate.getTime() === tomorrow.getTime()) return 'Tomorrow';
        return eventDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <button onClick={onAddAppointment} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700">
                    <PlusIcon className="w-5 h-5"/> New Appointment
                </button>
            </div>
            
            <div className="space-y-6">
                {Object.keys(groupedAppointments).length > 0 ? (
                    Object.entries(groupedAppointments).map(([date, dateAppointments]) => (
                        <div key={date}>
                            <h4 className="font-bold text-indigo-600 dark:text-indigo-400 mb-2">{formatDateGroup(date)}</h4>
                            <div className="space-y-3">
                                {dateAppointments.map(appt => (
                                    <AppointmentItem 
                                        key={appt.id} 
                                        appointment={appt} 
                                        clients={clients} 
                                        onEdit={() => onEditAppointment(appt)} 
                                        onDelete={() => onDeleteAppointment(appt)}
                                    />
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        <p>No upcoming appointments.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AppointmentList;
