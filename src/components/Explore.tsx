import React, { useState } from 'react';
import { Search, Filter, MapPin, Flame, Trophy, Wrench } from 'lucide-react';
import type { Post, Event } from '../types';

const CATEGORIES = [
  { id: 'trending', label: 'Trending', icon: <Flame size={18} /> },
  { id: 'events', label: 'Events', icon: <Trophy size={18} /> },
  { id: 'builds', label: 'Builds', icon: <Wrench size={18} /> },
  { id: 'nearby', label: 'Nearby', icon: <MapPin size={18} /> },
];

const SAMPLE_EXPLORE_ITEMS = [
  {
    id: '1',
    type: 'build',
    image: 'https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9?auto=format&fit=crop&q=80&w=800',
    title: 'Custom BMW M4',
    subtitle: '📍 Los Angeles, CA',
    stats: '2.1k likes',
  },
  {
    id: '2',
    type: 'event',
    image: 'https://images.unsplash.com/photo-1547245324-d777c6f05e80?auto=format&fit=crop&q=80&w=800',
    title: 'Weekend Car Meet',
    subtitle: '📅 This Saturday',
    stats: '156 attending',
  },
  {
    id: '3',
    type: 'build',
    image: 'https://images.unsplash.com/photo-1626668893632-6f3a4466d22f?auto=format&fit=crop&q=80&w=800',
    title: 'Restored Classic Mustang',
    subtitle: '📍 Miami, FL',
    stats: '3.4k likes',
  },
  {
    id: '4',
    type: 'build',
    image: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&q=80&w=800',
    title: 'Slammed Civic Build',
    subtitle: '📍 Tokyo, Japan',
    stats: '1.8k likes',
  },
  {
    id: '5',
    type: 'event',
    image: 'https://images.unsplash.com/photo-1536332016596-dc50468cbf41?auto=format&fit=crop&q=80&w=800',
    title: 'Track Day',
    subtitle: '📅 Next Weekend',
    stats: '89 attending',
  },
  {
    id: '6',
    type: 'build',
    image: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&q=80&w=800',
    title: 'Porsche 911 GT3',
    subtitle: '📍 Berlin, Germany',
    stats: '4.2k likes',
  },
];

export function Explore() {
  const [activeCategory, setActiveCategory] = useState('trending');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="md:ml-64 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search cars, builds, events..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white shadow-sm border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors">
            <Filter size={20} />
            <span>Filters</span>
          </button>
        </div>

        {/* Categories */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => setActiveCategory(id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
                activeCategory === id
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {icon}
              <span className="font-medium whitespace-nowrap">{label}</span>
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SAMPLE_EXPLORE_ITEMS.map((item) => (
            <div
              key={item.id}
              className="group relative bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.15)]"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transform transition-transform group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-6 group-hover:translate-y-0 transition-transform">
                <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                <p className="text-sm text-gray-200 mb-2">{item.subtitle}</p>
                <p className="text-sm font-medium">{item.stats}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}