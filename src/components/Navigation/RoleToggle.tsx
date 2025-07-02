
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthProvider';

const RoleToggle = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();

  const currentRole = profile?.role || 'sales_rep';
  
  // Only show in Developer OS for testing purposes
  const isDev = process.env.NODE_ENV === 'development';
  const isOnDeveloperRoute = window.location.pathname.startsWith('/developer');
  
  if (!isDev && !isOnDeveloperRoute) return null;

  const handleRoleSwitch = () => {
    // Redirect to logout page to switch roles cleanly
    navigate('/logout');
  };

  return (
    <div className="flex items-center space-x-2">
      <Badge variant="outline" className="text-xs">
        {currentRole === 'manager' ? 'Manager' : currentRole === 'developer' ? 'Developer' : 'Sales Rep'}
      </Badge>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleRoleSwitch}
        className="text-xs"
      >
        Switch Role (Logout)
      </Button>
    </div>
  );
};

export default RoleToggle;
