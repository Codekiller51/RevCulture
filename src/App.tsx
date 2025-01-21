import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Feed } from './components/Feed';
import { Explore } from './components/Explore';
import { Events } from './components/Events';
import { Profile } from './components/Profile';
import { UserProfile } from './components/UserProfile';
import { Notifications } from './components/Notifications';
import { AuthProvider } from './contexts/AuthContext';
import { AuthModal } from './components/auth/AuthModal';
import { useAuth } from './contexts/AuthContext';
import { AlertTriangle } from 'lucide-react';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<'feed' | 'explore' | 'events' | 'profile' | 'userProfile' | 'notifications'>('feed');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, error, loading, clearError } = useAuth();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(clearError, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleAuthAction = () => {
    if (!user) {
      setIsAuthModalOpen(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {error && (
        <div className="fixed top-4 right-4 z-50 max-w-md bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-800">Authentication Error</h3>
              <p className="text-sm text-red-600">{error.message}</p>
            </div>
          </div>
        </div>
      )}

      <Navigation 
        onPageChange={setCurrentPage} 
        currentPage={currentPage}
        onAuthAction={handleAuthAction}
        user={user}
      />
      
      <main className="pt-16 md:pt-0">
        {currentPage === 'feed' && <Feed />}
        {currentPage === 'explore' && <Explore />}
        {currentPage === 'events' && <Events />}
        {currentPage === 'profile' && <Profile />}
        {currentPage === 'userProfile' && <UserProfile />}
        {currentPage === 'notifications' && <Notifications />}
      </main>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;