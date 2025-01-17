import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Settings, Edit3, Grid, List, Share2, Users, Trophy, Car, Camera, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { User, Car as CarType, Post } from '../types';

interface Profile {
  username: string;
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
}

const SAMPLE_POSTS: Post[] = [
  {
    id: '1',
    user: {
      id: '1',
      username: 'alexsmith',
      name: 'Alex Smith',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200'
    },
    images: ['https://images.unsplash.com/photo-1626668893632-6f3a4466d22f?auto=format&fit=crop&q=80&w=800'],
    caption: 'Perfect day for some canyon carving! 🏁',
    likes: 423,
    comments: 32,
    timestamp: '2h ago'
  },
  {
    id: '2',
    user: {
      id: '1',
      username: 'alexsmith',
      name: 'Alex Smith',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200'
    },
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

export function UserProfile() {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<Profile>({
    username: '',
    full_name: '',
    avatar_url: null,
    bio: '',
    location: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      if (!user?.id) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select()
        .eq('id', user.id)
        .single();

      if (error) throw error;
      if (data) {
        setProfile(data);
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      setError(error.message);
    }
  };

  const handleProfileUpdate = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          bio: profile.bio,
          location: profile.location,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;
      setIsEditing(false);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="md:ml-64 min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="relative bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
        {/* Cover Photo */}
        <div className="relative h-48 sm:h-64 md:h-80">
          <img
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=2000"
            alt="Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
          <button className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-xl hover:bg-white transition-colors">
            <Camera size={20} />
          </button>
        </div>

        {/* Profile Info Container */}
        <div className="relative px-4 pb-6 -mt-16 sm:-mt-20">
          <div className="max-w-7xl mx-auto">
            {/* Avatar and Basic Info */}
            <div className="flex flex-col items-center sm:items-start sm:flex-row sm:gap-6">
              {/* Avatar */}
              <div className="relative mb-4 sm:mb-0">
                <div className="relative inline-block">
                  <img
                    src={profile.avatar_url || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200"}
                    alt={profile.full_name}
                    className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl object-cover border-4 border-white shadow-lg"
                  />
                  <button className="absolute bottom-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-xl hover:bg-white transition-colors">
                    <Camera size={16} />
                  </button>
                </div>
              </div>

              {/* Name and Actions */}
              <div className="flex flex-col items-center sm:items-start flex-grow">
                {isEditing ? (
                  <div className="space-y-4 w-full max-w-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profile.full_name || ''}
                        onChange={(e) => setProfile(prev => ({ ...prev, full_name: e.target.value }))}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bio
                      </label>
                      <textarea
                        value={profile.bio || ''}
                        onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={profile.location || ''}
                        onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={handleProfileUpdate}
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
                      >
                        <Save size={20} />
                        Save Changes
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="text-center sm:text-left mb-4">
                      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{profile.full_name || 'Add your name'}</h1>
                      <p className="text-gray-600">@{profile.username}</p>
                    </div>
                    <div className="flex gap-3 mb-6">
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                      >
                        <Edit3 size={20} />
                        Edit Profile
                      </button>
                      <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                        <Settings size={20} className="text-gray-600" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Bio and Location */}
            {!isEditing && (
              <div className="mt-6 text-center sm:text-left">
                <p className="text-gray-600 whitespace-pre-line mb-4">{profile.bio || 'Add a bio to tell your story'}</p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin size={16} />
                    <span>{profile.location || 'Add your location'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    <span>Joined {new Date(user?.created_at || '').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>
            )}

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
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Posts */}
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Your Posts</h2>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
                <div key={post.id} className="flex flex-col sm:flex-row gap-4">
                  <div className="w-full sm:w-48 aspect-video sm:aspect-square rounded-xl overflow-hidden">
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