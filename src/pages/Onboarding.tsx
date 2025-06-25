
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Onboarding: React.FC = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate('/auth');
      return;
    }

    // Redirect to role-specific onboarding
    if (profile?.role === 'manager') {
      navigate('/onboarding/manager');
    } else if (profile?.role === 'sales_rep' || !profile?.role) {
      navigate('/onboarding/sales-rep');
    } else {
      // For developers/admins, skip onboarding
      navigate('/os/dev/dashboard');
    }
  }, [user, profile, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return null;
};

export default Onboarding;
