
import { useEffect } from 'react';
import { isDemoMode } from '@/data/demo.mock.data';
import { ensureDemoUsersExist } from '@/utils/demoSetup';

const DemoUserSetup: React.FC = () => {
  useEffect(() => {
    if (isDemoMode) {
      console.log('🎭 Setting up demo users on app start...');
      ensureDemoUsersExist().catch(error => {
        console.error('❌ Failed to setup demo users:', error);
      });
    }
  }, []);

  return null; // This component doesn't render anything
};

export default DemoUserSetup;
