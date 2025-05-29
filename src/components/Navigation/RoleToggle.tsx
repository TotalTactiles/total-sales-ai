
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const RoleToggle = () => {
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();

  const currentRole = profile?.role || 'sales_rep';
  
  // Only show in Developer OS for testing purposes
  const isDev = process.env.NODE_ENV === 'development';
  const isOnDeveloperRoute = window.location.pathname.startsWith('/developer');
  
  if (!isDev && !isOnDeveloperRoute) return null;

  const handleRoleSwitch = async () => {
    // For proper role switching, user must log out and log back in
    // This ensures clean state and proper routing
    await signOut();
    navigate('/auth');
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
