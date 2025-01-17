import React, { useState } from 'react';
import { MapPin, Calendar, Settings, Edit3, Grid, List, Share2, Users, Trophy, Car } from 'lucide-react';
import type { User, Car as CarType, Post } from '../types';

const SAMPLE_USER: User = {
  id: '1',
  username: 'alexsmith',
  name: 'Alex Smith',
  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
  bio: 'Car enthusiast | Track day addict | Automotive photographer\nBased in Los Angeles, CA',
  cars: [
    {
      id: '1',
      make: 'Porsche',
      model: '911 GT3',
      year: 2022,
      photos: ['https://images.unsplash.com/photo-1614200187524-dc4b892acf16?auto=format&fit=crop&q=80&w=800'],
      description: 'Track-focused beast with a naturally aspirated flat-six.'
    },
    {
      id: '2',
      make: 'BMW',
      model: 'M4 Competition',
      year: 2023,
      photos: ['https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9?auto=format&fit=crop&q=80&w=800'],
      description: 'Daily driver with serious performance credentials.'
    }
  ]
};

const SAMPLE_POSTS: Post[] = [
  {
    id: '1',
    user: SAMPLE_USER,
    images: ['https://images.unsplash.com/photo-1626668893632-6f3a4466d22f?auto=format&fit=crop&q=80&w=800'],
    caption: 'Perfect day for some canyon carving! 🏁',
    likes: 423,
    comments: 32,
    timestamp: '2h ago'
  },
  {
    id: '2',
    user: SAMPLE_USER,
    images: ['https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&q=80&w=800'],
    caption: 'New wheels installed! What do you think? 🔧',
    likes: 567,
    comments: 45,
    timestamp: '1d ago'
  }
];

const STATS = [
  { label: 'Posts', value: '128', icon: Grid },
  { label: 'Followers', value: '3.2k', icon: Users },
  { label: 'Events', value: '24', icon: Trophy },
  { label: 'Cars', value: '2', icon: Car }
];

export function Profile() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <div className="md:ml-64 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Cover Photo */}
        <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-8">
          <img
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=2000"
            alt="Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <button className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-xl hover:bg-white transition-colors">
            <Edit3 size={20} />
          </button>
        </div>

        {/* Profile Info */}
        <div className="relative bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <img
                src={SAMPLE_USER.avatar}
                alt={SAMPLE_USER.name}
                className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
            </div>

            {/* Info */}
            <div className="flex-grow">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{SAMPLE_USER.name}</h1>
                  <p className="text-gray-500">@{SAMPLE_USER.username}</p>
                </div>
                <div className="flex gap-3">
                  <button className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors">
                    Follow
                  </button>
                  <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                    <Share2 size={20} />
                  </button>
                  <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                    <Settings size={20} />
                  </button>
                </div>
              </div>

              <p className="text-gray-600 whitespace-pre-line mb-4">{SAMPLE_USER.bio}</p>

              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin size={16} />
                  <span>Los Angeles, CA</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  <span>Joined March 2023</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
            {STATS.map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex flex-col items-center p-4 bg-gray-50 rounded-xl">
                <Icon size={20} className="text-gray-600 mb-2" />
                <span className="text-2xl font-bold text-gray-900">{value}</span>
                <span className="text-sm text-gray-600">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Cars */}
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Garage</h2>
            <button className="text-blue-500 hover:text-blue-600 transition-colors font-medium">
              View All
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SAMPLE_USER.cars?.map((car) => (
              <div key={car.id} className="group relative aspect-[16/9] rounded-xl overflow-hidden">
                <img
                  src={car.photos[0]}
                  alt={`${car.year} ${car.make} ${car.model}`}
                  className="w-full h-full object-cover transform transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-lg font-bold text-white">
                    {car.year} {car.make} {car.model}
                  </h3>
                  <p className="text-sm text-gray-200">{car.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Posts */}
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Posts</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <List size={20} />
              </button>
            </div>
          </div>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {SAMPLE_POSTS.map((post) => (
                <div key={post.id} className="group relative aspect-square rounded-xl overflow-hidden">
                  <img
                    src={post.images[0]}
                    alt=""
                    className="w-full h-full object-cover transform transition-transform group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <p className="text-sm line-clamp-2">{post.caption}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span>{post.likes} likes</span>
                        <span>{post.comments} comments</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {SAMPLE_POSTS.map((post) => (
                <div key={post.id} className="flex gap-6">
                  <div className="w-48 h-48 rounded-xl overflow-hidden">
                    <img
                      src={post.images[0]}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <p className="text-gray-600 mb-2">{post.caption}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{post.likes} likes</span>
                      <span>{post.comments} comments</span>
                      <span>{post.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}