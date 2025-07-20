
import React from 'react';

interface UnifiedLayoutProps {
  children: React.ReactNode;
}

const UnifiedLayout: React.FC<UnifiedLayoutProps> = ({ children }) => {
  return (
    <div className="flex w-full min-h-screen bg-gray-900">
      {children}
    </div>
  );
};

export default UnifiedLayout;
