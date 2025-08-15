import React, { useState, useMemo } from 'react';
import { Event } from '../../types';
import EventIcon from '../icons/EventIcon';
import PlusIcon from '../icons/PlusIcon';
import EventFormModal from './EventFormModal';
import EventItem from './EventItem';

interface EventTrackerProps {
  events: Event[];
  setEvents: (value: Event[] | ((val: Event[]) => Event[])) => void;
  onDeleteEvent: (event: Event) => void;
}

const EventTracker: React.FC<EventTrackerProps> = ({ events, setEvents, onDeleteEvent }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);

    const handleSaveEvent = (eventData: Omit<Event, 'id' | 'createdAt'>, isEditing: boolean) => {
        if (isEditing && editingEvent) {
            const updatedEvent = { ...editingEvent, ...eventData };
            setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
        } else {
            const newEvent: Event = {
                id: Date.now().toString(),
                createdAt: Date.now(),
                ...eventData
            };
            setEvents(prev => [...prev, newEvent]);
        }
        setIsModalOpen(false);
        setEditingEvent(null);
    };
    
    const openAddModal = () => {
        setEditingEvent(null);
        setIsModalOpen(true);
    };

    const openEditModal = (event: Event) => {
        setEditingEvent(event);
        setIsModalOpen(true);
    };

    const { upcomingEvents, pastEvents } = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const sorted = [...events].sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.time || '00:00'}`).getTime();
            const dateB = new Date(`${b.date}T${b.time || '00:00'}`).getTime();
            return dateA - dateB;
        });

        const upcoming: Record<string, Event[]> = {};
        const past: Record<string, Event[]> = {};

        sorted.forEach(event => {
            const eventDate = new Date(event.date);
            eventDate.setHours(23, 59, 59, 999); // Compare with end of day
            const group = eventDate >= today ? upcoming : past;
            if (!group[event.date]) {
                group[event.date] = [];
            }
            group[event.date].push(event);
        });

        // For past events, we want the most recent first, so reverse the keys
        const pastKeys = Object.keys(past).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
        const sortedPast: Record<string, Event[]> = {};
        pastKeys.forEach(key => sortedPast[key] = past[key]);

        return { upcomingEvents: upcoming, pastEvents: sortedPast };
    }, [events]);
    
    const formatDateGroup = (dateString: string) => {
        const today = new Date(); today.setHours(0,0,0,0);
        const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
        const eventDate = new Date(dateString + 'T00:00:00');

        if (eventDate.getTime() === today.getTime()) return 'Today';
        if (eventDate.getTime() === tomorrow.getTime()) return 'Tomorrow';
        return eventDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    };

  return (
    <>
      <div className="space-y-6">
        <header className="flex items-center gap-4 pb-3 border-b-2 border-indigo-500 dark:border-indigo-400">
          <EventIcon className="w-10 h-10 text-indigo-500 dark:text-indigo-400" />
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white flex-grow">
            Event Tracker
          </h2>
          <button onClick={openAddModal} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700">
            <PlusIcon className="w-5 h-5"/>
            <span className="hidden sm:inline">Add Event</span>
          </button>
        </header>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg space-y-8">
            {/* Upcoming Events */}
            <section>
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Upcoming</h3>
                {Object.keys(upcomingEvents).length > 0 ? (
                    Object.entries(upcomingEvents).map(([date, dateEvents]) => (
                        <div key={date} className="mb-6">
                            <h4 className="font-bold text-indigo-600 dark:text-indigo-400 mb-2">{formatDateGroup(date)}</h4>
                            <div className="space-y-3">
                                {dateEvents.map(event => <EventItem key={event.id} event={event} onEdit={() => openEditModal(event)} onDelete={() => onDeleteEvent(event)} />)}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 dark:text-gray-400">No upcoming events. Plan something new!</p>
                )}
            </section>
            
            {/* Past Events */}
             {Object.keys(pastEvents).length > 0 && (
                <section>
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Past</h3>
                    {Object.entries(pastEvents).map(([date, dateEvents]) => (
                        <div key={date} className="mb-6 opacity-70">
                            <h4 className="font-bold text-gray-500 dark:text-gray-400 mb-2">{formatDateGroup(date)}</h4>
                            <div className="space-y-3">
                                {dateEvents.map(event => <EventItem key={event.id} event={event} onEdit={() => openEditModal(event)} onDelete={() => onDeleteEvent(event)} />)}
                            </div>
                        </div>
                    ))}
                </section>
            )}
        </div>
      </div>

      {isModalOpen && (
          <EventFormModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveEvent}
            event={editingEvent}
            existingCategories={[...new Set(events.map(e => e.category))]}
          />
      )}
    </>
  );
};

export default EventTracker;
