
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Trash2, RotateCcw, X } from 'lucide-react';

interface LeadManagementActionsProps {
  isInDemoMode: boolean;
  hasRealData: boolean;
  showDemo: boolean;
  onResetMockData: () => void;
  onClearMockData: () => void;
  onImportDialogOpen: () => void;
  onExitDemo: () => void;
}

const LeadManagementActions: React.FC<LeadManagementActionsProps> = ({
  isInDemoMode,
  hasRealData,
  showDemo,
  onResetMockData,
  onClearMockData,
  onImportDialogOpen,
  onExitDemo
}) => {
  return (
    <div className="flex gap-2">
      {/* Show exit demo button when in interactive demo mode (not global demo mode) */}
      {!isInDemoMode && showDemo && (
        <Button 
          variant="outline"
          onClick={onExitDemo}
          className="flex items-center gap-2 text-red-600 hover:text-red-700"
        >
          <X className="h-4 w-4" />
          Exit Demo
        </Button>
      )}
      
      {/* Show demo controls when using mock data */}
      {(isInDemoMode || showDemo) && (
        <>
          <Button 
            variant="outline"
            onClick={onResetMockData}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset Demo Data
          </Button>
          <Button 
            variant="outline"
            onClick={onClearMockData}
            className="flex items-center gap-2 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
            Clear All Demo Data
          </Button>
        </>
      )}
      
      <Button 
        variant="outline"
        onClick={onImportDialogOpen}
        className="flex items-center gap-2"
      >
        <Upload className="h-4 w-4" />
        Import Leads
      </Button>
      <Button className="bg-salesGreen hover:bg-salesGreen-dark">
        + Add New Lead
      </Button>
    </div>
  );
};

export default LeadManagementActions;
