import React from 'react';
import { Heart, MessageCircle, Share2, Bookmark, Clock } from 'lucide-react';
import type { Post } from '../types';

const SAMPLE_POSTS: Post[] = [
  {
    id: '1',
    user: {
      id: '1',
      username: 'speedmaster',
      name: 'Alex Turner',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100&h=100'
    },
    images: [
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=2000'
    ],
    caption: 'Just finished the new setup on my GT3 RS. What do you think? 🏎️',
    likes: 1234,
    comments: 89,
    timestamp: '2h ago'
  },
  {
    id: '2',
    user: {
      id: '2',
      username: 'carmechanic',
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100'
    },
    images: [
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=2000'
    ],
    caption: 'Late night in the garage. Engine swap almost complete! 🔧',
    likes: 892,
    comments: 45,
    timestamp: '4h ago'
  }
];

export function Feed() {
  return (
    <div className="max-w-2xl mx-auto pt-8 pb-20 md:pb-8 px-4">
      {SAMPLE_POSTS.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
}

function Post({ post }: { post: Post }) {
  return (
    <article className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-sm mb-12 transform transition-all duration-300 hover:translate-y-[-4px] hover:shadow-[0_20px_40px_rgb(0,0,0,0.15)]">
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center">
          <div className="relative">
            <img
              src={post.user.avatar}
              alt={post.user.name}
              className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-md"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div className="ml-4">
            <h3 className="font-bold text-gray-900">{post.user.name}</h3>
            <div className="flex items-center text-sm text-gray-500">
              <Clock size={14} className="mr-1" />
              <span>{post.timestamp}</span>
            </div>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <Bookmark size={20} />
        </button>
      </div>

      <div className="relative">
        <img
          src={post.images[0]}
          alt=""
          className="w-full aspect-[16/10] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>
      </div>

      <div className="p-6">
        <p className="text-gray-800 mb-4">{post.caption}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <button className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors">
              <Heart size={20} />
              <span className="text-sm font-medium">{post.likes.toLocaleString()}</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors">
              <MessageCircle size={20} />
              <span className="text-sm font-medium">{post.comments}</span>
            </button>
            <button className="text-gray-600 hover:text-green-500 transition-colors">
              <Share2 size={20} />
            </button>
          </div>
          
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-6 h-6 rounded-full border-2 border-white overflow-hidden">
                <img
                  src={`https://images.unsplash.com/photo-${1500000000000 + i}?auto=format&fit=crop&q=80&w=32&h=32`}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center">
              <span className="text-xs text-gray-600">+5</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}