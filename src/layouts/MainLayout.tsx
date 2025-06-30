
import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import OSLayout from '@/components/layouts/OSLayout';

// Manager Pages
import ManagerDashboard from '@/pages/manager/ManagerDashboard';

// Sales Rep Pages  
import SalesRepDashboard from '@/pages/sales/SalesRepDashboard';
import LeadManagement from '@/pages/LeadManagement';
import LeadWorkspace from '@/pages/LeadWorkspace';

// Developer Pages
import DeveloperDashboard from '@/pages/developer/DeveloperDashboard';

const MainLayout: React.FC = () => {
  const { profile, user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Fast redirect based on role
  useEffect(() => {
    if (!loading && user && profile) {
      // Only redirect if we're on the base dashboard route
      if (location.pathname === '/dashboard' || location.pathname === '/dashboard/') {
        const roleRoutes = {
          'manager': '/dashboard/manager',
          'sales_rep': '/dashboard/sales',
          'developer': '/dashboard/developer'
        };
        
        const targetRoute = roleRoutes[profile.role as keyof typeof roleRoutes];
        if (targetRoute) {
          navigate(targetRoute, { replace: true });
        }
      }
    }
  }, [profile, user, loading, location.pathname, navigate]);

  // Show loading while determining auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#7B61FF] border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading your workspace...</p>
          <p className="text-gray-400 text-sm mt-2">Setting up {profile?.role?.replace('_', ' ') || 'your'} OS</p>
        </div>
      </div>
    );
  }

  // If no user or profile, redirect to auth
  if (!user || !profile) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <OSLayout>
      <Routes>
        {/* Root redirect based on role */}
        <Route 
          index 
          element={
            <Navigate 
              to={
                profile.role === 'manager' ? '/dashboard/manager' :
                profile.role === 'sales_rep' ? '/dashboard/sales' :
                profile.role === 'developer' ? '/dashboard/developer' :
                '/dashboard/sales'
              } 
              replace 
            />
          } 
        />
        
        {/* Manager Routes */}
        <Route path="/manager" element={<ManagerDashboard />} />
        <Route path="/manager/dashboard" element={<ManagerDashboard />} />
        <Route path="/manager/leads" element={<LeadManagement />} />
        <Route path="/manager/team" element={<ManagerDashboard />} />
        <Route path="/manager/insights" element={<ManagerDashboard />} />
        <Route path="/manager/profile" element={<ManagerDashboard />} />
        
        {/* Sales Rep Routes */}
        <Route path="/sales" element={<SalesRepDashboard />} />
        <Route path="/sales/dashboard" element={<SalesRepDashboard />} />
        <Route path="/sales/leads" element={<LeadManagement />} />
        <Route path="/sales/leads/:leadId" element={<LeadWorkspace />} />
        <Route path="/sales/my-leads" element={<LeadManagement />} />
        <Route path="/sales/activity" element={<SalesRepDashboard />} />
        <Route path="/sales/ai-insights" element={<SalesRepDashboard />} />
        <Route path="/sales/profile" element={<SalesRepDashboard />} />
        
        {/* Developer Routes */}
        <Route path="/developer" element={<DeveloperDashboard />} />
        <Route path="/developer/dashboard" element={<DeveloperDashboard />} />
        <Route path="/developer/logs" element={<DeveloperDashboard />} />
        <Route path="/developer/features" element={<DeveloperDashboard />} />
        <Route path="/developer/tickets" element={<DeveloperDashboard />} />
        <Route path="/developer/profile" element={<DeveloperDashboard />} />
        <Route path="/developer/performance" element={<DeveloperDashboard />} />
        <Route path="/developer/jarvis" element={<DeveloperDashboard />} />
        <Route path="/developer/updates" element={<DeveloperDashboard />} />
        
        {/* Fallback */}
        <Route 
          path="*" 
          element={
            <Navigate 
              to={
                profile.role === 'manager' ? '/dashboard/manager' :
                profile.role === 'sales_rep' ? '/dashboard/sales' :
                profile.role === 'developer' ? '/dashboard/developer' :
                '/dashboard/sales'
              } 
              replace 
            />
          } 
        />
      </Routes>
    </OSLayout>
  );
};

export default MainLayout;
