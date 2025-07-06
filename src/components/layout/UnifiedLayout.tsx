
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LogoutButton from '@/components/auth/LogoutButton';

interface UnifiedLayoutProps {
  children: React.ReactNode;
}

const UnifiedLayout: React.FC<UnifiedLayoutProps> = ({ children }) => {
  const { profile } = useAuth();

  const getThemeClasses = () => {
    switch (profile?.role) {
      case 'developer':
      case 'admin':
        return 'bg-gray-900 text-white';
      case 'manager':
        return 'bg-blue-50 text-blue-900';
      case 'sales_rep':
      default:
        return 'bg-green-50 text-green-900';
    }
  };

  const getRoleDisplay = () => {
    switch (profile?.role) {
      case 'developer':
        return 'Developer OS';
      case 'admin':
        return 'Admin OS';
      case 'manager':
        return 'Manager OS';
      case 'sales_rep':
        return 'Sales OS';
      default:
        return 'TSAM OS';
    }
  };

  return (
    <div className={`min-h-screen ${getThemeClasses()}`}>
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-gray-900">{getRoleDisplay()}</h1>
            <div className="text-sm text-gray-500">
              Welcome, {profile?.full_name || 'User'}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Role: <span className="font-medium capitalize">{profile?.role?.replace('_', ' ')}</span>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default UnifiedLayout;
