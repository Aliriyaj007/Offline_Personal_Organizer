import React, { useMemo } from 'react';
import { Client, Appointment } from '../../types';
import BackIcon from '../icons/BackIcon';
import PencilIcon from '../icons/PencilIcon';
import TrashIcon from '../icons/TrashIcon';
import PlusIcon from '../icons/PlusIcon';
import AppointmentItem from './AppointmentItem';

interface ClientDetailProps {
  client: Client;
  appointments: Appointment[];
  onBack: () => void;
  onEditClient: (client: Client) => void;
  onDeleteClient: (client: Client) => void;
  onAddAppointment: (clientId: string) => void;
  onEditAppointment: (appointment: Appointment) => void;
  onDeleteAppointment: (appointment: Appointment) => void;
}

const ClientDetail: React.FC<ClientDetailProps> = (props) => {
    const { client, appointments, onBack, onEditClient, onDeleteClient, onAddAppointment, onEditAppointment, onDeleteAppointment } = props;

    const { upcoming, past } = useMemo(() => {
        const today = new Date();
        today.setHours(0,0,0,0);
        
        const sorted = [...appointments].sort((a,b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());

        const upcoming = sorted.filter(a => new Date(a.date) >= today);
        const past = sorted.filter(a => new Date(a.date) < today).reverse();

        return { upcoming, past };

    }, [appointments]);

  return (
    <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-xl">
      <header className="flex items-start justify-between gap-4 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-4">
          <button onClick={onBack} className="p-2 mt-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 flex-shrink-0">
            <BackIcon className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{client.name}</h2>
            <div className="mt-1 text-md text-gray-500 dark:text-gray-400 space-y-1">
              {client.email && <p>{client.email}</p>}
              {client.phone && <p>{client.phone}</p>}
            </div>
          </div>
        </div>
        <div className="flex-shrink-0 flex items-center gap-2">
            <button onClick={() => onEditClient(client)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700" title="Edit Client">
                <PencilIcon className="w-5 h-5"/>
            </button>
            <button onClick={() => onDeleteClient(client)} className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50" title="Delete Client">
                <TrashIcon className="w-5 h-5 text-red-500"/>
            </button>
        </div>
      </header>
      
      {client.notes && (
          <div className="mb-6 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
              <h3 className="font-semibold mb-1">Notes</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{client.notes}</p>
          </div>
      )}

      <div className="space-y-6">
        <section>
             <div className="flex justify-between items-center mb-3">
                 <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Appointments</h3>
                 <button onClick={() => onAddAppointment(client.id)} className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm shadow hover:bg-indigo-700">
                    <PlusIcon className="w-4 h-4"/> New Appointment
                 </button>
             </div>
             
             {upcoming.length > 0 && <AppointmentSection title="Upcoming" appointments={upcoming} clients={[client]} onEdit={onEditAppointment} onDelete={onDeleteAppointment} />}
             {past.length > 0 && <AppointmentSection title="Past" appointments={past} clients={[client]} onEdit={onEditAppointment} onDelete={onDeleteAppointment} />}
             {appointments.length === 0 && <p className="text-center py-8 text-gray-500 dark:text-gray-400">No appointments scheduled for this client.</p>}
        </section>
      </div>
    </div>
  );
};

const AppointmentSection: React.FC<{
    title: string;
    appointments: Appointment[];
    clients: Client[];
    onEdit: (appointment: Appointment) => void;
    onDelete: (appointment: Appointment) => void;
}> = ({ title, appointments, clients, onEdit, onDelete }) => (
    <div className="mt-4">
        <h4 className="font-bold text-gray-500 dark:text-gray-400 mb-2">{title}</h4>
        <div className="space-y-3">
            {appointments.map(appt => (
                <AppointmentItem key={appt.id} appointment={appt} clients={clients} onEdit={() => onEdit(appt)} onDelete={() => onDelete(appt)} />
            ))}
        </div>
    </div>
);

export default ClientDetail;
