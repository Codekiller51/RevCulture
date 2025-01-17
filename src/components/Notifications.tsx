import React from 'react';
import { Heart, MessageCircle, Calendar, Users, Trophy, Clock, Car } from 'lucide-react';
import type { User } from '../types';

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'event' | 'mention';
  user: User;
  content: string;
  timestamp: string;
  read: boolean;
  link: string;
}

const SAMPLE_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'like',
    user: {
      id: '2',
      username: 'carmechanic',
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100'
    },
    content: 'liked your post about your new GT3 RS',
    timestamp: '2m ago',
    read: false,
    link: '#'
  },
  {
    id: '2',
    type: 'comment',
    user: {
      id: '3',
      username: 'speedmaster',
      name: 'Mike Johnson',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100&h=100'
    },
    content: 'commented on your track day photo: "Amazing shot! Which track is this?"',
    timestamp: '15m ago',
    read: false,
    link: '#'
  },
  {
    id: '3',
    type: 'event',
    user: {
      id: '4',
      username: 'carculture',
      name: 'Car Culture LA',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100'
    },
    content: 'invited you to "SoCal Car Meet 2024"',
    timestamp: '1h ago',
    read: true,
    link: '#'
  },
  {
    id: '4',
    type: 'follow',
    user: {
      id: '5',
      username: 'racinglife',
      name: 'Tom Wilson',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100'
    },
    content: 'started following you',
    timestamp: '2h ago',
    read: true,
    link: '#'
  },
  {
    id: '5',
    type: 'mention',
    user: {
      id: '6',
      username: 'driftking',
      name: 'Alex Turner',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100'
    },
    content: 'mentioned you in a comment: "You should definitely check out @alexsmith\'s build!"',
    timestamp: '3h ago',
    read: true,
    link: '#'
  }
];

const NotificationIcon = ({ type }: { type: Notification['type'] }) => {
  switch (type) {
    case 'like':
      return <Heart size={20} className="text-red-500" />;
    case 'comment':
      return <MessageCircle size={20} className="text-blue-500" />;
    case 'follow':
      return <Users size={20} className="text-green-500" />;
    case 'event':
      return <Calendar size={20} className="text-purple-500" />;
    case 'mention':
      return <Trophy size={20} className="text-yellow-500" />;
    default:
      return null;
  }
};

export function Notifications() {
  return (
    <div className="md:ml-64 min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600 mt-1">Stay updated with your car community</p>
          </div>
          <button className="text-blue-500 hover:text-blue-600 transition-colors font-medium">
            Mark all as read
          </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {SAMPLE_NOTIFICATIONS.map((notification) => (
            <div
              key={notification.id}
              className={`group relative bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgb(0,0,0,0.15)] ${
                !notification.read ? 'border-l-4 border-blue-500' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="relative">
                  <img
                    src={notification.user.avatar}
                    alt={notification.user.name}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div className="absolute -right-1 -bottom-1 p-1 bg-white rounded-lg">
                    <NotificationIcon type={notification.type} />
                  </div>
                </div>
                <div className="flex-grow">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-gray-900">
                        <span className="font-semibold">{notification.user.name}</span>{' '}
                        {notification.content}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                        <Clock size={14} />
                        <span>{notification.timestamp}</span>
                      </div>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}