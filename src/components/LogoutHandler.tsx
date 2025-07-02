
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const LogoutHandler = () => {
  const { signOut } = useAuth();

  useEffect(() => {
    const performLogout = async () => {
      try {
        console.log('🔐 LogoutHandler: Performing logout');
        await signOut();
        
        // Force immediate redirect to auth page
        window.location.replace('/auth');
      } catch (error) {
        console.error('🔐 LogoutHandler: Logout error:', error);
        // Force redirect even if logout fails
        window.location.replace('/auth');
      }
    };

    performLogout();
  }, [signOut]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-500 border-t-transparent mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg font-medium">Logging out...</p>
        <p className="text-gray-400 text-sm mt-2">Redirecting to login</p>
      </div>
    </div>
  );
};

export default LogoutHandler;
