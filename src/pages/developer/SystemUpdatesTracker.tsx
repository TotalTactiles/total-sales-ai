
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  GitCommit, 
  Upload, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  RefreshCw,
  Download,
  Code,
  Users,
  Calendar
} from 'lucide-react';
import LoadingManager from '@/components/layout/LoadingManager';
import { useAsyncOperation } from '@/hooks/useAsyncOperation';

interface SystemUpdate {
  id: string;
  version: string;
  title: string;
  description: string;
  type: 'major' | 'minor' | 'patch' | 'hotfix';
  status: 'deployed' | 'deploying' | 'failed' | 'scheduled';
  deployedAt: Date;
  deployedBy: string;
  features: string[];
  bugFixes: string[];
  breakingChanges: string[];
  rollbackAvailable: boolean;
}

const SystemUpdatesTracker: React.FC = () => {
  const { execute, isLoading } = useAsyncOperation();
  const [updates, setUpdates] = useState<SystemUpdate[]>([
    {
      id: '1',
      version: 'v2.1.4',
      title: 'Enhanced AI Response Generation',
      description: 'Improved AI response quality with GPT-4 integration and better context awareness',
      type: 'minor',
      status: 'deployed',
      deployedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      deployedBy: 'Alex Developer',
      features: [
        'GPT-4 integration for better responses',
        'Enhanced context awareness',
        'Improved conversation memory'
      ],
      bugFixes: [
        'Fixed conversation timeout issues',
        'Resolved memory leak in AI processing'
      ],
      breakingChanges: [],
      rollbackAvailable: true
    },
    {
      id: '2',
      version: 'v2.1.3',
      title: 'Voice AI Integration Hotfix',
      description: 'Critical hotfix for voice AI integration issues',
      type: 'hotfix',
      status: 'deployed',
      deployedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
      deployedBy: 'Sarah Engineer',
      features: [],
      bugFixes: [
        'Fixed ElevenLabs API connection issues',
        'Resolved voice synthesis errors',
        'Improved audio quality'
      ],
      breakingChanges: [],
      rollbackAvailable: true
    },
    {
      id: '3',
      version: 'v2.1.2',
      title: 'Dashboard Performance Improvements',
      description: 'Major performance improvements and UI enhancements',
      type: 'minor',
      status: 'deployed',
      deployedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
      deployedBy: 'Mike Frontend',
      features: [
        'Faster dashboard loading',
        'Improved responsive design',
        'New analytics widgets'
      ],
      bugFixes: [
        'Fixed layout issues on mobile',
        'Resolved chart rendering problems',
        'Fixed navigation glitches'
      ],
      breakingChanges: [
        'Changed API endpoint structure for analytics'
      ],
      rollbackAvailable: true
    },
    {
      id: '4',
      version: 'v2.2.0',
      title: 'Major AI Brain Upgrade',
      description: 'Complete overhaul of the AI processing engine',
      type: 'major',
      status: 'deploying',
      deployedAt: new Date(),
      deployedBy: 'TSAM Bot',
      features: [
        'New neural architecture',
        'Advanced learning algorithms',
        'Multi-modal AI support',
        'Enhanced security features'
      ],
      bugFixes: [],
      breakingChanges: [
        'API v1 endpoints deprecated',
        'New authentication required',
        'Database schema changes'
      ],
      rollbackAvailable: false
    },
    {
      id: '5',
      version: 'v2.1.1',
      title: 'Security Patch',
      description: 'Critical security updates and vulnerability fixes',
      type: 'patch',
      status: 'failed',
      deployedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      deployedBy: 'Security Team',
      features: [],
      bugFixes: [
        'Patched SQL injection vulnerability',
        'Fixed XSS security issues',
        'Updated dependency versions'
      ],
      breakingChanges: [],
      rollbackAvailable: true
    }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setUpdates(prev => prev.map(update => {
        if (update.status === 'deploying') {
          // Simulate deployment progress
          const random = Math.random();
          if (random > 0.7) {
            return { ...update, status: 'deployed', deployedAt: new Date() };
          }
        }
        return update;
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const refreshUpdates = async () => {
    await execute(async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Simulate a new update
      const newUpdate: SystemUpdate = {
        id: Date.now().toString(),
        version: 'v2.1.5',
        title: 'Performance Optimization',
        description: 'System-wide performance improvements',
        type: 'patch',
        status: 'deployed',
        deployedAt: new Date(),
        deployedBy: 'Auto Deploy',
        features: ['Improved caching', 'Database optimization'],
        bugFixes: ['Fixed memory leaks'],
        breakingChanges: [],
        rollbackAvailable: true
      };
      setUpdates(prev => [newUpdate, ...prev.slice(0, 9)]);
    }, 'sync');
  };

  const rollbackUpdate = async (updateId: string) => {
    await execute(async () => {
      await new Promise(resolve => setTimeout(resolve, 3000));
      setUpdates(prev => prev.map(update =>
        update.id === updateId
          ? { ...update, status: 'failed' as const }
          : update
      ));
    }, 'sync');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'deployed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'deploying': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'failed': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'scheduled': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'deployed': return <CheckCircle className="h-4 w-4" />;
      case 'deploying': return <Upload className="h-4 w-4 animate-spin" />;
      case 'failed': return <AlertTriangle className="h-4 w-4" />;
      case 'scheduled': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'major': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'minor': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'patch': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'hotfix': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const stats = {
    total: updates.length,
    deployed: updates.filter(u => u.status === 'deployed').length,
    failed: updates.filter(u => u.status === 'failed').length,
    deploying: updates.filter(u => u.status === 'deploying').length
  };

  if (isLoading) {
    return <LoadingManager type="sync" message="Loading system updates..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">System Updates Tracker</h1>
          <p className="text-gray-400 mt-2">Monitor deployments, releases, and system changes</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={refreshUpdates}
            disabled={isLoading}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Download className="h-4 w-4 mr-2" />
            Release Notes
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Updates</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <GitCommit className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Deployed</p>
                <p className="text-2xl font-bold text-green-400">{stats.deployed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Deploying</p>
                <p className="text-2xl font-bold text-blue-400">{stats.deploying}</p>
              </div>
              <Upload className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Failed</p>
                <p className="text-2xl font-bold text-red-400">{stats.failed}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Updates List */}
      <div className="space-y-4">
        {updates.map((update) => (
          <Card key={update.id} className="bg-gray-800 border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <GitCommit className="h-6 w-6 text-blue-400" />
                  <div>
                    <CardTitle className="text-white flex items-center gap-2">
                      {update.version} - {update.title}
                      <Badge className={getTypeColor(update.type)}>
                        {update.type.toUpperCase()}
                      </Badge>
                    </CardTitle>
                    <p className="text-gray-400 text-sm mt-1">{update.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(update.status)}>
                    {getStatusIcon(update.status)}
                    {update.status.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {update.deployedBy}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {update.deployedAt.toLocaleString()}
                </div>
              </div>

              {update.features.length > 0 && (
                <div>
                  <h4 className="text-green-400 font-semibold mb-2">✨ New Features</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    {update.features.map((feature, index) => (
                      <li key={index}>• {feature}</li>
                    ))}
                  </ul>
                </div>
              )}

              {update.bugFixes.length > 0 && (
                <div>
                  <h4 className="text-blue-400 font-semibold mb-2">🐛 Bug Fixes</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    {update.bugFixes.map((fix, index) => (
                      <li key={index}>• {fix}</li>
                    ))}
                  </ul>
                </div>
              )}

              {update.breakingChanges.length > 0 && (
                <div>
                  <h4 className="text-red-400 font-semibold mb-2">⚠️ Breaking Changes</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    {update.breakingChanges.map((change, index) => (
                      <li key={index}>• {change}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                <div className="flex items-center gap-2">
                  {update.rollbackAvailable && (
                    <Badge variant="outline" className="text-xs">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Rollback Available
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {update.status === 'deployed' && update.rollbackAvailable && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => rollbackUpdate(update.id)}
                      className="border-red-600 text-red-400 hover:bg-red-900/20"
                    >
                      Rollback
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    <Code className="h-3 w-3 mr-1" />
                    View Code
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SystemUpdatesTracker;
