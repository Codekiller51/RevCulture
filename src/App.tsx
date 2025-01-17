import React, { useState } from 'react';
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

function AppContent() {
  const [currentPage, setCurrentPage] = useState<'feed' | 'explore' | 'events' | 'profile' | 'userProfile' | 'notifications'>('feed');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user } = useAuth();

  const handleAuthAction = () => {
    if (!user) {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        onPageChange={setCurrentPage} 
        currentPage={currentPage}
        onAuthAction={handleAuthAction}
        user={user}
      />
      <main>
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