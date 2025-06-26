
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const DeveloperTrigger: React.FC = () => {
  const navigate = useNavigate();
  const [isTriggered, setIsTriggered] = useState(false);

  useKeyboardShortcut({
    keys: ['.', '.', '.'],
    callback: () => {
      if (!isTriggered) {
        setIsTriggered(true);
        triggerDeveloperLogin();
      }
    }
  });

  const triggerDeveloperLogin = async () => {
    try {
      console.log('🎯 Developer trigger activated - logging in as dev@tsam.ai');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'dev@tsam.ai',
        password: 'DevTSAM2025'
      });

      if (error) {
        console.error('Developer login failed:', error);
        toast.error('Developer access failed');
        return;
      }

      console.log('✅ Developer login successful');
      toast.success('Developer access granted - Welcome to TSAM OS');
      
      // Navigate to developer dashboard
      setTimeout(() => {
        navigate('/developer/dashboard');
      }, 500);

    } catch (error) {
      console.error('Developer trigger error:', error);
      toast.error('Developer access error');
    } finally {
      // Reset trigger after 2 seconds
      setTimeout(() => setIsTriggered(false), 2000);
    }
  };

  return null; // This component doesn't render anything
};

export default DeveloperTrigger;
