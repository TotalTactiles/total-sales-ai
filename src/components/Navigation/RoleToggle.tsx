
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const RoleToggle = () => {
  const navigate = useNavigate();
  const { profile, isDemoMode } = useAuth();

  const currentRole = profile?.role || 'sales_rep';
  
  const toggleRole = () => {
    if (currentRole === 'sales_rep' || currentRole === 'manager') {
      const newRole = currentRole === 'sales_rep' ? 'manager' : 'sales_rep';
      
      // Update demo mode with new role
      localStorage.setItem('demoMode', 'true');
      localStorage.setItem('demoRole', newRole);
      
      // Navigate to appropriate dashboard
      if (newRole === 'manager') {
        navigate('/manager/dashboard');
      } else {
        navigate('/sales/dashboard');
      }
      
      // Reload to reinitialize with new role
      window.location.reload();
    }
  };

  // Only show in development or demo mode
  const isDev = process.env.NODE_ENV === 'development';
  if (!isDev && !isDemoMode()) return null;

  return (
    <div className="flex items-center space-x-2">
      <Badge variant="outline" className="text-xs">
        {currentRole === 'manager' ? 'Manager' : 'Sales Rep'}
      </Badge>
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleRole}
        className="text-xs"
      >
        Switch to {currentRole === 'sales_rep' ? 'Manager' : 'Sales Rep'}
      </Button>
    </div>
  );
};

export default RoleToggle;
