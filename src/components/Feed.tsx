import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, Clock, Loader } from 'lucide-react';
import type { Post } from '../types';
import { useInView } from 'react-intersection-observer';

const POSTS_PER_PAGE = 10;

export function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView && hasMore && !loading) {
      setPage(prev => prev + 1);
    }
  }, [inView, hasMore, loading]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        // Simulate API call with timeout
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In production, this would be a real API call
        const newPosts = SAMPLE_POSTS;
        
        setPosts(prev => [...prev, ...newPosts]);
        setHasMore(newPosts.length === POSTS_PER_PAGE);
      } catch (err) {
        setError('Failed to load posts. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => {
              setError(null);
              setPage(1);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pt-8 pb-20 md:pb-8 px-4">
      {/* Create Post Button */}
      <button className="w-full mb-8 p-4 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.15)] transition-all duration-300 text-left">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gray-200"></div>
          <span className="text-gray-500">Share your automotive journey...</span>
        </div>
      </button>

      {/* Posts */}
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <Loader className="w-6 h-6 animate-spin text-blue-500" />
        </div>
      )}

      {/* Infinite Scroll Trigger */}
      <div ref={ref} className="h-10" />
    </div>
  );
}

function Post({ post }: { post: Post }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const handleLike = () => {
    // Optimistic update
    setLiked(prev => !prev);
    // In production, this would be an API call
  };

  const handleSave = () => {
    // Optimistic update
    setSaved(prev => !prev);
    // In production, this would be an API call
  };

  return (
    <article className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-sm mb-12 transform transition-all duration-300 hover:translate-y-[-4px] hover:shadow-[0_20px_40px_rgb(0,0,0,0.15)]">
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center">
          <div className="relative">
            <img
              src={post.user.avatar}
              alt={post.user.name}
              className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-md"
              loading="lazy"
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
        <button 
          onClick={handleSave}
          className={`transition-colors ${
            saved ? 'text-blue-500' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <Bookmark size={20} className={saved ? 'fill-current' : ''} />
        </button>
      </div>

      <div className="relative">
        <img
          src={post.images[0]}
          alt=""
          className="w-full aspect-[16/10] object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>
      </div>

      <div className="p-6">
        <p className="text-gray-800 mb-4">{post.caption}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <button 
              onClick={handleLike}
              className={`flex items-center space-x-2 transition-colors ${
                liked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
              }`}
            >
              <Heart size={20} className={liked ? 'fill-current' : ''} />
              <span className="text-sm font-medium">
                {liked ? post.likes + 1 : post.likes}
              </span>
            </button>
            <button 
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors"
            >
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
                  loading="lazy"
                />
              </div>
            ))}
            <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center">
              <span className="text-xs text-gray-600">+5</span>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <input
                type="text"
                placeholder="Add a comment..."
                className="flex-grow px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                Post
              </button>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}