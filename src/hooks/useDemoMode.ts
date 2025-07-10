
import { useState, useEffect } from 'react';
import { isDemoMode, demoUsers, mockManagerLeads, mockSalesLeads, mockTSAMLogs, mockFeatureFlags } from '@/data/demo.mock.data';
import { useAuth } from '@/contexts/AuthContext';

export const useDemoMode = () => {
  const { user, profile } = useAuth();
  const [isDemo, setIsDemo] = useState(false);
  const [demoUser, setDemoUser] = useState<any>(null);

  useEffect(() => {
    console.log('🎭 useDemoMode: Checking demo status', { 
      isDemoMode, 
      user: user?.id, 
      userEmail: user?.email,
      profileRole: profile?.role
    });

    if (isDemoMode && user) {
      // First check if user email matches a demo user
      const foundDemoUser = demoUsers.find(du => du.email === user.email);
      if (foundDemoUser) {
        setIsDemo(true);
        setDemoUser(foundDemoUser);
        console.log('🎭 Demo mode activated for:', foundDemoUser.name, foundDemoUser.role);
        return;
      }
    }

    // For managers, always provide enhanced data (even if not demo mode)
    if (user && profile?.role === 'manager') {
      const managerUser = {
        id: user.id,
        email: user.email,
        name: profile.full_name || 'Manager',
        role: 'manager'
      };
      
      setIsDemo(true); // Treat as demo for enhanced features
      setDemoUser(managerUser);
      console.log('👨‍💼 Manager OS mode activated for:', managerUser.name);
      return;
    }

    // For sales reps, always provide enhanced data (even if not demo mode)
    if (user && profile?.role === 'sales_rep') {
      const salesRepUser = {
        id: user.id,
        email: user.email,
        name: profile.full_name || 'Sales Rep',
        role: 'sales_rep'
      };
      
      setIsDemo(true); // Treat as demo for enhanced features
      setDemoUser(salesRepUser);
      console.log('🎯 Sales Rep OS mode activated for:', salesRepUser.name);
      return;
    }

    // If not demo mode and not manager/sales rep, clear demo state
    setIsDemo(false);
    setDemoUser(null);
  }, [user, profile]);

  const getDemoData = (dataType: string) => {
    if (!isDemo) {
      console.log('🎭 getDemoData: Not in demo mode');
      return null;
    }

    console.log('🎭 Getting demo data for:', dataType, 'user role:', demoUser?.role);

    switch (dataType) {
      case 'leads':
        return (demoUser?.role === 'manager') ? mockManagerLeads : mockSalesLeads;
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
    isDemoMode: isDemo
  };
};
