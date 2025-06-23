import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeProvider';
import Logo from '@/components/Logo';
import AuthLoginForm from './components/AuthLoginForm';
import AuthSignupForm from './components/AuthSignupForm';
import AuthLoadingScreen from './components/AuthLoadingScreen';
const AuthPage = () => {
  const {
    user,
    profile,
    loading
  } = useAuth();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Show loading screen while auth state is being determined
  if (loading || isTransitioning) {
    return <AuthLoadingScreen />;
  }

  // Redirect if authenticated
  if (user && profile) {
    const getRedirectPath = () => {
      switch (profile.role) {
        case 'developer':
        case 'admin':
          return '/developer/dashboard';
        case 'manager':
          return '/manager/dashboard';
        case 'sales_rep':
        default:
          return '/sales/dashboard';
      }
    };
    const redirectPath = getRedirectPath();
    const from = location.state?.from?.pathname || redirectPath;
    return <Navigate to={from} replace />;
  }
  return <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <Card className="max-w-md w-full mx-4 p-8 shadow-xl border-0 rounded-2xl bg-white/80 backdrop-blur-sm">
        <div className="text-center mb-8">
          <Logo />
          <h2 className="text-2xl font-bold mt-6 text-gray-900 font-sans">Welcome to TSAM</h2>
          <p className="text-gray-600 mt-2 text-sm">Your AI-powered sales acceleration platform</p>
        </div>
      
        <div className="space-y-6">
          {isLogin ? <AuthLoginForm setIsTransitioning={setIsTransitioning} /> : <AuthSignupForm setIsLogin={setIsLogin} />}
          
          <div className="flex items-center justify-center">
            <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-blue-600 hover:text-blue-800 bg-transparent border-none cursor-pointer font-medium">
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
            </button>
          </div>

          {isLogin}
        </div>
      </Card>
    </div>;
};
export default AuthPage;