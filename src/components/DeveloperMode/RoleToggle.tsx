
import { logger } from '@/utils/logger';
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Crown, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const RoleToggle: React.FC = () => {
  const { user, profile } = useAuth();
  const isDev = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost';

  // Only show in development mode
  if (!isDev) {
    return null;
  }

  const toggleRole = async () => {
    if (!user || !profile) {
      toast.error('User not authenticated');
      return;
    }

    const newRole = profile.role === 'manager' ? 'sales_rep' : 'manager';
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', user.id);
        
      if (error) throw error;
      
      toast.success(`Switched to ${newRole.replace('_', ' ')} role`);
      
      // Redirect to appropriate dashboard
      const redirectPath = newRole === 'manager' ? '/manager/dashboard' : '/sales/dashboard';
      
      // Small delay to ensure toast is visible
      setTimeout(() => {
        window.location.href = redirectPath;
      }, 1000);
      
    } catch (error) {
      logger.error('Error toggling role:', error);
      toast.error('Failed to switch role');
    }
  };

  const disabled = !user || !profile;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleRole}
      disabled={disabled}
      className="fixed bottom-4 right-4 z-50 bg-white border shadow-lg hover:bg-gray-50"
      title={`Switch to ${profile?.role === 'manager' ? 'Sales Rep' : 'Manager'} role`}
    >
      {profile?.role === 'manager' ? (
        <User className="h-4 w-4" />
      ) : (
        <Crown className="h-4 w-4" />
      )}
    </Button>
  );
};

export default RoleToggle;
