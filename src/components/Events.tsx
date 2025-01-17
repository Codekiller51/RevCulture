import React, { useState } from 'react';
import { Calendar, MapPin, Users, Filter, ChevronDown, Clock, Trophy, Car } from 'lucide-react';
import type { Event } from '../types';

const SAMPLE_EVENTS: Event[] = [
  {
    id: '1',
    title: 'SoCal Car Meet 2024',
    description: 'Join us for the biggest car meet in Southern California! All makes and models welcome.',
    type: 'meet',
    date: '2024-03-25T18:00:00Z',
    location: 'Los Angeles, CA',
    organizer: {
      id: '1',
      username: 'carculture',
      name: 'Car Culture LA',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100'
    },
    attendees: [],
    cover: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=2000'
  },
  {
    id: '2',
    title: 'Track Day: Laguna Seca',
    description: 'Professional track day event at the legendary Laguna Seca raceway.',
    type: 'race',
    date: '2024-04-15T09:00:00Z',
    location: 'Monterey, CA',
    organizer: {
      id: '2',
      username: 'trackdays',
      name: 'Track Day Pro',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100'
    },
    attendees: [],
    cover: 'https://images.unsplash.com/photo-1584727638096-042c45049ebe?auto=format&fit=crop&q=80&w=2000'
  },
  {
    id: '3',
    title: 'Sunset Cruise',
    description: 'Evening cruise along the Pacific Coast Highway. All classic cars welcome.',
    type: 'cruise',
    date: '2024-03-30T17:30:00Z',
    location: 'Malibu, CA',
    organizer: {
      id: '3',
      username: 'classiccarclub',
      name: 'Classic Car Club',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100'
    },
    attendees: [],
    cover: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=2000'
  },
  {
    id: '4',
    title: 'Supercar Show',
    description: 'Exclusive supercar showcase featuring the latest and greatest exotic vehicles.',
    type: 'show',
    date: '2024-04-20T11:00:00Z',
    location: 'Beverly Hills, CA',
    organizer: {
      id: '4',
      username: 'luxurycars',
      name: 'Luxury Car Events',
      avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&q=80&w=100&h=100'
    },
    attendees: [],
    cover: 'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?auto=format&fit=crop&q=80&w=2000'
  }
];

const EVENT_TYPES = [
  { id: 'all', label: 'All Events' },
  { id: 'meet', label: 'Car Meets', icon: Users },
  { id: 'race', label: 'Track Days', icon: Trophy },
  { id: 'cruise', label: 'Cruises', icon: Car },
  { id: 'show', label: 'Car Shows', icon: Calendar }
];

export function Events() {
  const [selectedType, setSelectedType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredEvents = SAMPLE_EVENTS.filter(
    event => selectedType === 'all' || event.type === selectedType
  );

  return (
    <div className="md:ml-64 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Upcoming Events</h1>
            <p className="text-gray-600">Discover and join the best automotive events near you</p>
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="mt-4 sm:mt-0 flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <Filter size={18} />
            <span>Filters</span>
            <ChevronDown size={18} className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {EVENT_TYPES.map(type => {
                const Icon = type.icon || Users;
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
                      selectedType === type.id
                        ? 'border-blue-500 bg-blue-50 text-blue-600'
                        : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'
                    }`}
                  >
                    {type.icon && <Icon size={18} />}
                    <span className="font-medium">{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
            <div key={event.id} className="group bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.15)]">
              <div className="relative aspect-[16/9] overflow-hidden">
                <img
                  src={event.cover}
                  alt={event.title}
                  className="w-full h-full object-cover transform transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-900 flex items-center gap-1">
                  <Users size={14} />
                  <span>124 attending</span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={event.organizer.avatar}
                    alt={event.organizer.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{event.organizer.name}</h3>
                    <p className="text-xs text-gray-500">Organizer</p>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h2>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>

                <div className="flex flex-col gap-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>{new Date(event.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>{new Date(event.date).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit'
                    })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    <span>{event.location}</span>
                  </div>
                </div>

                <button className="w-full mt-6 bg-blue-500 text-white py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors">
                  Register Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}