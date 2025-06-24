
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeProvider';
import Logo from '@/components/Logo';
import AuthLoginForm from './components/AuthLoginForm';
import AuthSignupForm from './components/AuthSignupForm';
import AuthLoadingScreen from './components/AuthLoadingScreen';
import { clearUserCache } from '@/utils/userCacheManager';
import { logger } from '@/utils/logger';
import { toast } from 'sonner';
import { RefreshCw } from 'lucide-react';

const AuthPage = () => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isClearingCache, setIsClearingCache] = useState(false);

  // Add logging to debug auth state
  useEffect(() => {
    logger.info('AuthPage render state:', { 
      hasUser: !!user, 
      hasProfile: !!profile, 
      loading, 
      isTransitioning,
      profileRole: profile?.role 
    }, 'auth');
  }, [user, profile, loading, isTransitioning]);

  // Show loading screen while auth state is being determined
  if (loading || isTransitioning) {
    return <AuthLoadingScreen />;
  }

  // Redirect if authenticated and profile exists
  if (user && profile) {
    const getRedirectPath = () => {
      switch (profile.role) {
        case 'developer':
        case 'admin':
          return '/os/dev';
        case 'manager':
          return '/os/manager';
        case 'sales_rep':
        default:
          return '/os/rep';
      }
    };
    
    const redirectPath = getRedirectPath();
    const from = location.state?.from?.pathname || redirectPath;
    
    logger.info('Redirecting authenticated user:', { 
      role: profile.role, 
      redirectPath, 
      from 
    }, 'auth');
    
    return <Navigate to={from} replace />;
  }

  const handleClearCache = async () => {
    setIsClearingCache(true);
    try {
      toast.info('Clearing user cache and session...', {
        description: 'This will sign you out and clear all stored data'
      });
      
      await clearUserCache();
    } catch (error) {
      console.error('Failed to clear user cache:', error);
      toast.error('Failed to clear cache', {
        description: 'Please try refreshing the page manually'
      });
      setIsClearingCache(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="absolute top-4 right-4 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearCache}
          disabled={isClearingCache}
        >
          {isClearingCache ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          <span className="ml-2">Clear Cache</span>
        </Button>
        <ThemeToggle />
      </div>
      
      <Card className="max-w-md w-full mx-4 p-8 shadow-xl border-0 rounded-2xl bg-white/80 backdrop-blur-sm">
        <div className="text-center mb-8">
          <Logo />
          <h2 className="text-2xl font-bold mt-6 text-gray-900 font-sans">Welcome to TSAM</h2>
          <p className="text-gray-600 mt-2 text-sm">Your AI-powered sales acceleration platform</p>
        </div>
      
        <div className="space-y-6">
          {isLogin ? (
            <AuthLoginForm setIsTransitioning={setIsTransitioning} />
          ) : (
            <AuthSignupForm setIsLogin={setIsLogin} />
          )}
          
          <div className="flex items-center justify-center">
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="text-sm text-blue-600 hover:text-blue-800 bg-transparent border-none cursor-pointer font-medium"
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
            </button>
          </div>
        </div>
      </Card>
      
      <div className="mt-4 text-center text-sm text-gray-500">
        <p>Having trouble? Click "Clear Cache" to reset your session and start fresh.</p>
      </div>
    </div>
  );
};

export default AuthPage;
