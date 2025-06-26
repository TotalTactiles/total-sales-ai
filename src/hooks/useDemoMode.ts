
import { useState, useEffect } from 'react';
import { isDemoMode, demoUsers, mockManagerLeads, mockSalesLeads, mockTSAMLogs, mockFeatureFlags } from '@/data/demo.mock.data';
import { useAuth } from '@/contexts/AuthContext';

export const useDemoMode = () => {
  const { user } = useAuth();
  const [isDemo, setIsDemo] = useState(false);
  const [demoUser, setDemoUser] = useState<any>(null);

  useEffect(() => {
    console.log('🎭 useDemoMode: Checking demo status', { 
      isDemoMode, 
      user: user?.id, 
      userEmail: user?.email 
    });

    if (isDemoMode && user) {
      const foundDemoUser = demoUsers.find(du => du.email === user.email || du.id === user.id);
      if (foundDemoUser) {
        setIsDemo(true);
        setDemoUser(foundDemoUser);
        console.log('🎭 Demo mode activated for:', foundDemoUser.name, foundDemoUser.role);
      } else {
        console.log('🎭 User not found in demo users list');
        setIsDemo(false);
        setDemoUser(null);
      }
    } else {
      setIsDemo(false);
      setDemoUser(null);
    }
  }, [user]);

  const getDemoData = (dataType: string) => {
    if (!isDemo) {
      console.log('🎭 getDemoData: Not in demo mode');
      return null;
    }

    console.log('🎭 Getting demo data for:', dataType, 'user role:', demoUser?.role);

    switch (dataType) {
      case 'leads':
        return demoUser?.role === 'manager' ? mockManagerLeads : mockSalesLeads;
      case 'tsam_logs':
        return mockTSAMLogs;
      case 'feature_flags':
        return mockFeatureFlags;
      default:
        console.log('🎭 Unknown data type requested:', dataType);
        return null;
    }
  };

  return {
    isDemo,
    demoUser,
    getDemoData,
    isDemoMode: isDemoMode
  };
};
