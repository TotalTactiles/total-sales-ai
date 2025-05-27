
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, User, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const RoleToggle: React.FC = () => {
  const { user, profile } = useAuth();
  const isDev = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost';

  if (!isDev || !user || !profile) {
    return null;
  }

  const toggleRole = async () => {
    const newRole = profile.role === 'manager' ? 'sales_rep' : 'manager';
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', user.id);

      if (error) throw error;

      toast.success(`Switched to ${newRole.replace('_', ' ')} role`);
      
      // Redirect to appropriate dashboard
      const redirectPath = newRole === 'manager' ? '/manager-dashboard' : '/sales-rep-dashboard';
      window.location.href = redirectPath;
      
    } catch (error) {
      console.error('Error toggling role:', error);
      toast.error('Failed to switch role');
    }
  };

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-3">
      <div className="flex items-center gap-3">
        <Badge variant="outline" className="text-xs">
          DEV MODE
        </Badge>
        
        <div className="flex items-center gap-2">
          {profile.role === 'manager' ? (
            <Crown className="h-4 w-4 text-blue-600" />
          ) : (
            <User className="h-4 w-4 text-green-600" />
          )}
          <span className="text-sm font-medium">
            {profile.role === 'manager' ? 'Manager' : 'Sales Rep'}
          </span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={toggleRole}
          className="flex items-center gap-1 text-xs"
        >
          <Settings className="h-3 w-3" />
          Switch Role
        </Button>
      </div>
    </div>
  );
};

export default RoleToggle;
