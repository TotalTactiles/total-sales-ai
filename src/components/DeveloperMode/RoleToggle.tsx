import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Crown, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
const RoleToggle: React.FC = () => {
  const {
    user,
    profile
  } = useAuth();
  const isDev = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost';
  if (!isDev || !user || !profile) {
    return null;
  }
  const toggleRole = async () => {
    const newRole = profile.role === 'manager' ? 'sales_rep' : 'manager';
    try {
      const {
        error
      } = await supabase.from('profiles').update({
        role: newRole
      }).eq('id', user.id);
      if (error) throw error;
      toast.success(`Switched to ${newRole.replace('_', ' ')} role`);

      // Redirect to appropriate dashboard
      const redirectPath =
        newRole === 'manager' ? '/manager/dashboard' : '/sales/dashboard';
      window.location.href = redirectPath;
    } catch (error) {
      console.error('Error toggling role:', error);
      toast.error('Failed to switch role');
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleRole}
      className="fixed bottom-4 right-4 z-50"
    >
      {profile.role === 'manager' ? (
        <>
          <User className="mr-2 h-4 w-4" />
          Switch to Sales Rep
        </>
      ) : (
        <>
          <Crown className="mr-2 h-4 w-4" />
          Switch to Manager
        </>
      )}
    </Button>
  );
};
export default RoleToggle;
