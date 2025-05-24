
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Eye, Lightbulb } from 'lucide-react';

interface DemoModeIndicatorProps {
  workspace: string;
  className?: string;
}

const DemoModeIndicator: React.FC<DemoModeIndicatorProps> = ({ workspace, className = '' }) => {
  return (
    <div className={`bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 mb-6 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-blue-600" />
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Demo Mode
          </Badge>
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-blue-900 mb-1">
            Exploring the {workspace} Workspace
          </h3>
          <p className="text-sm text-blue-700">
            This is mock data showing how your {workspace.toLowerCase()} workflow would look with real leads and activities.
          </p>
        </div>
        <div className="flex items-center gap-2 text-blue-600">
          <Lightbulb className="h-4 w-4" />
          <span className="text-xs font-medium">Interactive Demo</span>
        </div>
      </div>
    </div>
  );
};

export default DemoModeIndicator;
