
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useDemoMode } from '@/hooks/useDemoMode';
import SalesRepNavigation from '@/components/Navigation/SalesRepNavigation';

interface UnifiedLayoutProps {
  children: React.ReactNode;
}

const UnifiedLayout: React.FC<UnifiedLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { profile } = useAuth();
  const { isDemoMode } = useDemoMode();

  // Show sales navigation for sales reps
  const showSalesNav = () => {
    if (profile?.role === 'sales_rep') return true;
    if (location.pathname.startsWith('/sales')) return true;
    return false;
  };

  const shouldShowSalesNav = showSalesNav();

  return (
    <div className="min-h-screen bg-background">
      {/* Sales Rep Navigation */}
      {shouldShowSalesNav && <SalesRepNavigation />}
      
      {/* Main Content Area */}
      <main className={`${shouldShowSalesNav ? 'pt-16' : ''}`}>
        {children}
      </main>
    </div>
  );
};

export default UnifiedLayout;
