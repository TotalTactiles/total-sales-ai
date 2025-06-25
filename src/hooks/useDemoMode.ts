
import { useState, useEffect } from 'react';
import { isDemoMode, demoUsers, mockManagerLeads, mockSalesLeads, mockTSAMLogs } from '@/data/demo.mock.data';
import { useAuth } from '@/contexts/AuthContext';

export const useDemoMode = () => {
  const { user } = useAuth();
  const [isDemo, setIsDemo] = useState(false);
  const [demoUser, setDemoUser] = useState<any>(null);

  useEffect(() => {
    if (isDemoMode && user) {
      const foundDemoUser = demoUsers.find(du => du.id === user.id);
      if (foundDemoUser) {
        setIsDemo(true);
        setDemoUser(foundDemoUser);
        console.log('🎭 Demo mode activated for:', foundDemoUser.name, foundDemoUser.role);
      }
    }
  }, [user]);

  const getDemoData = (dataType: string) => {
    if (!isDemo) return null;

    switch (dataType) {
      case 'leads':
        return demoUser?.role === 'manager' ? mockManagerLeads : mockSalesLeads;
      case 'tsam_logs':
        return mockTSAMLogs;
      default:
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
