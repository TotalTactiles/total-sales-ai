
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  RefreshCw, 
  AlertCircle, 
  TrendingUp, 
  Database,
  Activity,
  CheckCircle,
  Clock
} from 'lucide-react';

interface SummaryHeaderProps {
  totalSources: number;
  totalFiles: number;
  lastSyncTime: Date | null;
  activeConnections: number;
  errorCount: number;
  onRefresh: () => void;
}

export const SummaryHeader: React.FC<SummaryHeaderProps> = ({
  totalSources,
  totalFiles,
  lastSyncTime,
  activeConnections,
  errorCount,
  onRefresh
}) => {
  return (
    <Card className="bg-gradient-to-r from-white via-blue-50/30 to-slate-50/50 backdrop-blur-sm shadow-lg rounded-2xl border border-slate-200/50 overflow-hidden mb-8">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Data Overview</h2>
            <p className="text-slate-600">Real-time status of all connected data sources</p>
          </div>
          
          <div className="flex items-center gap-3">
            {errorCount > 0 && (
              <Badge className="bg-red-100 text-red-700 border-red-200 gap-1">
                <AlertCircle className="h-3 w-3" />
                {errorCount} {errorCount === 1 ? 'Issue' : 'Issues'}
              </Badge>
            )}
            
            <Badge className="bg-green-100 text-green-700 border-green-200 gap-1">
              <Activity className="h-3 w-3" />
              AI Learning Active
            </Badge>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRefresh}
              className="gap-2 border-slate-300 hover:bg-slate-50"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh All
            </Button>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white/80 backdrop-blur-sm p-5 rounded-xl border border-slate-200/50 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Database className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-sm font-semibold text-slate-700">Data Sources</div>
            </div>
            <div className="text-2xl font-bold text-slate-900 mb-1">{totalSources}</div>
            <div className="text-xs text-slate-500">Connected integrations</div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-5 rounded-xl border border-slate-200/50 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-sm font-semibold text-slate-700">Total Files</div>
            </div>
            <div className="text-2xl font-bold text-slate-900 mb-1">{totalFiles.toLocaleString()}</div>
            <div className="text-xs text-slate-500">Ingested documents</div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-5 rounded-xl border border-slate-200/50 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-purple-600" />
              </div>
              <div className="text-sm font-semibold text-slate-700">Active Status</div>
            </div>
            <div className="text-2xl font-bold text-slate-900 mb-1">{activeConnections}</div>
            <div className="text-xs text-slate-500">Live connections</div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-5 rounded-xl border border-slate-200/50 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div className="text-sm font-semibold text-slate-700">Last Sync</div>
            </div>
            <div className="text-lg font-bold text-slate-900 mb-1">
              {lastSyncTime ? (
                <span className="text-sm">{lastSyncTime.toLocaleTimeString()}</span>
              ) : (
                'Never'
              )}
            </div>
            <div className="text-xs text-slate-500">
              {lastSyncTime ? lastSyncTime.toLocaleDateString() : 'Connect data sources'}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
