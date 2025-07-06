
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { logger } from '@/utils/logger';

interface LogoutButtonProps {
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'sm' | 'default' | 'lg';
  showIcon?: boolean;
  className?: string;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ 
  variant = 'ghost', 
  size = 'default',
  showIcon = true,
  className = ''
}) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    
    try {
      logger.info('🔐 Starting logout process');
      
      // Sign out from Supabase
      await signOut();
      
      // Clear any local storage or session data
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.clear();
      
      // Force navigate to auth page
      navigate('/auth', { replace: true });
      
      // Force page reload to clear any cached state
      window.location.href = '/auth';
      
      logger.info('✅ Logout completed successfully');
    } catch (error) {
      logger.error('❌ Logout error:', error);
      
      // Even if logout fails, still redirect to auth
      window.location.href = '/auth';
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={`${className} ${isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isLoggingOut ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
          Logging out...
        </>
      ) : (
        <>
          {showIcon && <LogOut className="w-4 h-4 mr-2" />}
          Logout
        </>
      )}
    </Button>
  );
};

export default LogoutButton;
