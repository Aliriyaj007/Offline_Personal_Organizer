import React, { useState, useMemo } from 'react';
import { Client, Appointment } from '../../types';
import ClientIcon from '../icons/ClientIcon';
import ClientList from './ClientList';
import ClientDetail from './ClientDetail';
import AppointmentList from './AppointmentList';
import UserGroupIcon from '../icons/UserGroupIcon';
import ClipboardListIcon from '../icons/ClipboardListIcon';
import ClientFormModal from './ClientFormModal';
import AppointmentFormModal from './AppointmentFormModal';

interface ClientTrackerProps {
  clients: Client[];
  setClients: (value: Client[] | ((val: Client[]) => Client[])) => void;
  appointments: Appointment[];
  setAppointments: (value: Appointment[] | ((val: Appointment[]) => Appointment[])) => void;
  onDeleteClient: (client: Client) => void;
  onDeleteAppointment: (appointment: Appointment) => void;
}

const ClientTracker: React.FC<ClientTrackerProps> = (props) => {
  const { clients, setClients, appointments, setAppointments, onDeleteClient, onDeleteAppointment } = props;
  
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'clients' | 'appointments'>('clients');
  
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [preselectedClient, setPreselectedClient] = useState<string | null>(null);
  
  const sortedClients = useMemo(() => [...clients].sort((a,b) => a.name.localeCompare(b.name)), [clients]);

  const selectedClient = useMemo(() => clients.find(c => c.id === selectedClientId), [clients, selectedClientId]);

  const handleSaveClient = (clientData: Omit<Client, 'id' | 'createdAt'>, isEditing: boolean) => {
    if (isEditing && editingClient) {
      const updatedClient = { ...editingClient, ...clientData };
      setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
    } else {
      const newClient: Client = { id: Date.now().toString(), createdAt: Date.now(), ...clientData };
      setClients(prev => [...prev, newClient]);
    }
    setIsClientModalOpen(false);
    setEditingClient(null);
  };
  
  const handleSaveAppointment = (apptData: Omit<Appointment, 'id' | 'createdAt'>, isEditing: boolean) => {
      if(isEditing && editingAppointment) {
          const updatedAppt = {...editingAppointment, ...apptData};
          setAppointments(prev => prev.map(a => a.id === updatedAppt.id ? updatedAppt : a));
      } else {
          const newAppt: Appointment = {id: Date.now().toString(), createdAt: Date.now(), ...apptData};
          setAppointments(prev => [...prev, newAppt]);
      }
      setIsAppointmentModalOpen(false);
      setEditingAppointment(null);
      setPreselectedClient(null);
  };

  const handleDeleteClientAndAppointments = (client: Client) => {
    if(window.confirm(`Are you sure you want to delete ${client.name}? This will also delete all their appointments.`)) {
        const clientAppointments = appointments.filter(a => a.clientId === client.id);
        clientAppointments.forEach(onDeleteAppointment);
        onDeleteClient(client);
        setSelectedClientId(null);
    }
  }

  const TabButton: React.FC<{icon: React.FC<{className?: string}>, label: string, isActive: boolean, onClick: () => void}> = ({icon: Icon, label, isActive, onClick}) => (
     <button onClick={onClick} className={`flex items-center gap-2 whitespace-nowrap py-2 px-4 text-sm font-medium rounded-t-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${ isActive ? 'bg-indigo-100 text-indigo-700 dark:bg-slate-700 dark:text-indigo-300' : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-700/50' }`}>
        <Icon className="w-5 h-5"/> {label}
      </button>
  );

  if (selectedClient) {
    return <ClientDetail 
                client={selectedClient} 
                appointments={appointments.filter(a => a.clientId === selectedClient.id)}
                onBack={() => setSelectedClientId(null)}
                onEditClient={client => { setEditingClient(client); setIsClientModalOpen(true); }}
                onDeleteClient={handleDeleteClientAndAppointments}
                onAddAppointment={clientId => { setPreselectedClient(clientId); setIsAppointmentModalOpen(true); }}
                onEditAppointment={appt => { setEditingAppointment(appt); setIsAppointmentModalOpen(true); }}
                onDeleteAppointment={onDeleteAppointment}
            />
  }

  return (
    <>
      <div className="space-y-6">
        <header className="flex items-center gap-4 pb-3 border-b-2 border-indigo-500 dark:border-indigo-400">
          <ClientIcon className="w-10 h-10 text-indigo-500 dark:text-indigo-400" />
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white flex-grow">
            Client & Appointments
          </h2>
        </header>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg">
           <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
                <nav className="flex space-x-2" aria-label="Tabs">
                    <TabButton icon={UserGroupIcon} label="Clients" isActive={activeTab === 'clients'} onClick={() => setActiveTab('clients')} />
                    <TabButton icon={ClipboardListIcon} label="Appointments" isActive={activeTab === 'appointments'} onClick={() => setActiveTab('appointments')} />
                </nav>
            </div>
            {activeTab === 'clients' && (
                <ClientList clients={sortedClients} onSelectClient={id => setSelectedClientId(id)} onAddClient={() => {setEditingClient(null); setIsClientModalOpen(true);}} />
            )}
            {activeTab === 'appointments' && (
                <AppointmentList 
                    appointments={appointments} 
                    clients={clients} 
                    onAddAppointment={() => {setPreselectedClient(null); setIsAppointmentModalOpen(true);}}
                    onEditAppointment={appt => { setEditingAppointment(appt); setIsAppointmentModalOpen(true); }}
                    onDeleteAppointment={onDeleteAppointment}
                />
            )}
        </div>
      </div>
      {isClientModalOpen && (
          <ClientFormModal isOpen={isClientModalOpen} onClose={() => setIsClientModalOpen(false)} onSave={handleSaveClient} client={editingClient} />
      )}
      {isAppointmentModalOpen && (
          <AppointmentFormModal 
            isOpen={isAppointmentModalOpen}
            onClose={() => {setIsAppointmentModalOpen(false); setPreselectedClient(null);}}
            onSave={handleSaveAppointment}
            appointment={editingAppointment}
            clients={clients}
            preselectedClientId={preselectedClient}
          />
      )}
    </>
  );
};

export default ClientTracker;
