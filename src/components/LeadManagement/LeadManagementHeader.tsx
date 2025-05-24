
import React from 'react';
import DemoModeIndicator from '@/components/Demo/DemoModeIndicator';

interface LeadManagementHeaderProps {
  showDemoIndicator: boolean;
  isInDemoMode: boolean;
  hasRealData: boolean;
  showDemo: boolean;
}

const LeadManagementHeader: React.FC<LeadManagementHeaderProps> = ({
  showDemoIndicator,
  isInDemoMode,
  hasRealData,
  showDemo
}) => {
  return (
    <>
      {/* Demo Mode Indicator */}
      {showDemoIndicator && <DemoModeIndicator workspace="Lead Management" />}
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-salesBlue">Lead Management</h1>
          {(isInDemoMode || (!hasRealData && showDemo)) && (
            <p className="text-sm text-slate-600 mt-1">
              Exploring with demo data - see how your leads would appear in the system
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default LeadManagementHeader;
