
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

interface TSAMLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const TSAMLayout: React.FC<TSAMLayoutProps> = ({ children, title = "TSAM Developer OS" }) => {
  const { profile } = useAuth();

  // Redirect non-developers
  if (profile?.role !== 'developer') {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">{title}</h1>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-600 text-sm font-medium">TSAM AI Brain Active</span>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default TSAMLayout;
