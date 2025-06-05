import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Crown, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { getDashboardUrl } from '@/components/Navigation/navigationUtils';
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
      const redirectPath = getDashboardUrl({ role: newRole });
      window.location.href = redirectPath;
    } catch (error) {
      console.error('Error toggling role:', error);
      toast.error('Failed to switch role');
    }
  };
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleRole}
      className="fixed bottom-4 right-4 z-50"
      title={`Switch to ${profile.role === 'manager' ? 'Sales Rep' : 'Manager'}`}
    >
      {profile.role === 'manager' ? (
        <User className="h-4 w-4" />
      ) : (
        <Crown className="h-4 w-4" />
      )}
    </Button>
  );
};
export default RoleToggle;
