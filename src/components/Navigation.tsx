import React from 'react';
import { Home, Compass, Calendar, Bell, User, LogOut } from 'lucide-react';
import { logout } from '../lib/firebase';
import type { User as FirebaseUser } from 'firebase/auth';

type Page = 'feed' | 'explore' | 'events' | 'profile' | 'userProfile' | 'notifications';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

function NavItem({ icon, label, active = false, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center p-4 w-full hover:bg-gray-50 transition-colors ${
        active ? 'text-blue-600' : 'text-gray-700'
      } md:px-6`}
    >
      {icon}
      <span className="hidden md:block ml-4 font-medium">{label}</span>
    </button>
  );
}

interface NavigationProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
  onAuthAction: () => void;
  user: FirebaseUser | null;
}

export function Navigation({ currentPage, onPageChange, onAuthAction, user }: NavigationProps) {
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-t border-gray-200 pb-safe md:pb-0 md:left-0 md:top-0 md:bottom-0 md:w-64 md:border-r md:border-t-0 md:bg-white">
      <div className="flex justify-around items-center h-16 md:h-screen md:flex-col md:justify-start md:py-8">
        <div className="hidden md:block px-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900">RevCulture</h1>
        </div>
        
        <NavItem
          icon={<Home size={24} />}
          label="Home"
          active={currentPage === 'feed'}
          onClick={() => onPageChange('feed')}
        />
        <NavItem
          icon={<Compass size={24} />}
          label="Explore"
          active={currentPage === 'explore'}
          onClick={() => onPageChange('explore')}
        />
        <NavItem
          icon={<Calendar size={24} />}
          label="Events"
          active={currentPage === 'events'}
          onClick={() => onPageChange('events')}
        />
        <NavItem
          icon={<Bell size={24} />}
          label="Notifications"
          active={currentPage === 'notifications'}
          onClick={() => user ? onPageChange('notifications') : onAuthAction()}
        />
        {user ? (
          <>
            <NavItem
              icon={<User size={24} />}
              label="Profile"
              active={currentPage === 'userProfile'}
              onClick={() => onPageChange('userProfile')}
            />
            <NavItem
              icon={<LogOut size={24} />}
              label="Logout"
              onClick={handleLogout}
            />
          </>
        ) : (
          <NavItem
            icon={<User size={24} />}
            label="Sign In"
            onClick={onAuthAction}
          />
        )}
      </div>
    </nav>
  );
}