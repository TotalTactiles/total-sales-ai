
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LogoutHandler = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        console.log('LogoutHandler: Starting logout process');
        await signOut();
        
        // Small delay to ensure state is cleared
        setTimeout(() => {
          console.log('LogoutHandler: Redirecting to auth');
          navigate('/auth', { replace: true });
        }, 100);
        
      } catch (error) {
        console.error('LogoutHandler error:', error);
        // Force redirect even on error
        navigate('/auth', { replace: true });
      }
    };

    handleLogout();
  }, [signOut, navigate]);

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
