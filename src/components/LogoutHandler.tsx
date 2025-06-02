
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const LogoutHandler = () => {
  const { signOut } = useAuth();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        console.log('LogoutHandler: Starting logout process');
        
        // Clear all local storage first
        localStorage.clear();
        sessionStorage.clear();
        
        // Sign out from auth
        await signOut();
        
        // Force redirect to auth page
        window.location.href = '/auth';
        
      } catch (error) {
        console.error('LogoutHandler error:', error);
        // Force redirect even on error
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/auth';
      }
    };

    handleLogout();
  }, [signOut]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Logging out...</p>
      </div>
    </div>
  );
};

export default LogoutHandler;
