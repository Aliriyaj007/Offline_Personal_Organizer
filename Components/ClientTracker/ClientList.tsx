import React, { useState, useMemo } from 'react';
import { Client } from '../../types';
import PlusIcon from '../icons/PlusIcon';
import SearchIcon from '../icons/SearchIcon';

interface ClientListProps {
  clients: Client[];
  onSelectClient: (id: string) => void;
  onAddClient: () => void;
}

const ClientList: React.FC<ClientListProps> = ({ clients, onSelectClient, onAddClient }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredClients = useMemo(() => {
    if (!searchQuery) return clients;
    const lowerCaseQuery = searchQuery.toLowerCase();
    return clients.filter(c =>
      c.name.toLowerCase().includes(lowerCaseQuery) ||
      c.email?.toLowerCase().includes(lowerCaseQuery) ||
      c.phone?.includes(lowerCaseQuery)
    );
  }, [clients, searchQuery]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search clients..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md dark:bg-slate-700 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <button onClick={onAddClient} className="flex-shrink-0 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition-colors">
          <PlusIcon className="w-5 h-5" />
          <span>Add New Client</span>
        </button>
      </div>

      <div className="space-y-3">
        {filteredClients.length > 0 ? (
          filteredClients.map(client => (
            <button key={client.id} onClick={() => onSelectClient(client.id)} className="w-full text-left p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
              <h3 className="font-bold text-gray-800 dark:text-white">{client.name}</h3>
              <div className="flex flex-wrap gap-x-4 text-sm text-gray-500 dark:text-gray-400">
                {client.email && <span>{client.email}</span>}
                {client.phone && <span>{client.phone}</span>}
              </div>
            </button>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery ? 'No clients match your search.' : 'No clients found. Add your first client!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientList;
