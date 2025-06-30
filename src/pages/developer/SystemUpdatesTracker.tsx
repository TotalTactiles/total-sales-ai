
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  Clock, 
  GitBranch, 
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  Activity,
  Code,
  Database
} from 'lucide-react';

const SystemUpdatesTracker: React.FC = () => {
  const [updates, setUpdates] = useState([
    {
      id: '1',
      type: 'feature_release',
      description: 'TSAM Brain Dashboard v2.1',
      version: '2.1.0',
      status: 'deployed',
      deployedAt: new Date('2024-01-15T10:30:00'),
      deployedBy: 'dev@tsam.ai',
      changes: {
        added: ['AI model status monitoring', 'Real-time learning insights'],
        modified: ['Enhanced system health checks'],
        removed: []
      }
    },
    {
      id: '2',
      type: 'hotfix',
      description: 'Critical API error fix',
      version: '2.0.3',
      status: 'deployed',
      deployedAt: new Date('2024-01-14T16:45:00'),
      deployedBy: 'dev@tsam.ai',
      changes: {
        added: [],
        modified: ['Fixed CRM integration timeout'],
        removed: ['Deprecated legacy endpoints']
      }
    },
    {
      id: '3',
      type: 'database_migration',
      description: 'Feature flags table restructure',
      version: '2.0.2',
      status: 'deployed',
      deployedAt: new Date('2024-01-13T09:15:00'),
      deployedBy: 'dev@tsam.ai',
      changes: {
        added: ['New feature flag permissions'],
        modified: ['Updated flag targeting logic'],
        removed: []
      }
    }
  ]);

  const [pendingUpdates, setPendingUpdates] = useState([
    {
      id: 'pending-1',
      type: 'feature_release',
      description: 'Enhanced AI Integration Mapper',
      version: '2.2.0',
      status: 'pending',
      scheduledFor: new Date('2024-01-16T14:00:00'),
      changes: {
        added: ['Real-time model switching', 'Advanced performance metrics'],
        modified: ['Improved error handling'],
        removed: []
      }
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'deployed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'feature_release': return <Code className="h-4 w-4" />;
      case 'hotfix': return <AlertTriangle className="h-4 w-4" />;
      case 'database_migration': return <Database className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Updates Tracker</h1>
          <p className="text-gray-600">Monitor deployments, rollbacks, and system changes</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Log
          </Button>
          <Button>
            <Upload className="h-4 w-4 mr-2" />
            Deploy Update
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Updates</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{updates.length}</div>
            <p className="text-xs text-green-600">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Successful Deploys</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{updates.filter(u => u.status === 'deployed').length}</div>
            <p className="text-xs text-green-600">100% success rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Updates</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingUpdates.length}</div>
            <p className="text-xs text-yellow-600">Scheduled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Version</CardTitle>
            <GitBranch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">v2.1.0</div>
            <p className="text-xs text-blue-600">Latest stable</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="deployed" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="deployed">Deployed</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="rollback">Rollback</TabsTrigger>
        </TabsList>

        <TabsContent value="deployed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Deployment History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {updates.map((update) => (
                  <div key={update.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {getTypeIcon(update.type)}
                        <div>
                          <h4 className="font-medium">{update.description}</h4>
                          <p className="text-sm text-gray-600">Version {update.version}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(update.status)}>
                          {update.status}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {update.deployedAt.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      {update.changes.added.length > 0 && (
                        <div>
                          <h5 className="font-medium text-green-700 mb-1">Added</h5>
                          <ul className="text-green-600 space-y-1">
                            {update.changes.added.map((item, idx) => (
                              <li key={idx}>• {item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {update.changes.modified.length > 0 && (
                        <div>
                          <h5 className="font-medium text-blue-700 mb-1">Modified</h5>
                          <ul className="text-blue-600 space-y-1">
                            {update.changes.modified.map((item, idx) => (
                              <li key={idx}>• {item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {update.changes.removed.length > 0 && (
                        <div>
                          <h5 className="font-medium text-red-700 mb-1">Removed</h5>
                          <ul className="text-red-600 space-y-1">
                            {update.changes.removed.map((item, idx) => (
                              <li key={idx}>• {item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-xs text-gray-500">
                        Deployed by: {update.deployedBy}
                      </span>
                      <Button variant="outline" size="sm">
                        View Diff
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingUpdates.map((update) => (
                  <div key={update.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {getTypeIcon(update.type)}
                        <div>
                          <h4 className="font-medium">{update.description}</h4>
                          <p className="text-sm text-gray-600">Version {update.version}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(update.status)}>
                          {update.status}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          Scheduled: {update.scheduledFor.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      {update.changes.added.length > 0 && (
                        <div>
                          <h5 className="font-medium text-green-700 mb-1">Will Add</h5>
                          <ul className="text-green-600 space-y-1">
                            {update.changes.added.map((item, idx) => (
                              <li key={idx}>• {item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {update.changes.modified.length > 0 && (
                        <div>
                          <h5 className="font-medium text-blue-700 mb-1">Will Modify</h5>
                          <ul className="text-blue-600 space-y-1">
                            {update.changes.modified.map((item, idx) => (
                              <li key={idx}>• {item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-xs text-gray-500">
                        Impact: Low risk deployment
                      </span>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Reschedule
                        </Button>
                        <Button size="sm">
                          Deploy Now
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rollback" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rollback Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="font-medium text-yellow-900">Rollback Available</span>
                  </div>
                  <p className="text-sm text-yellow-700 mb-3">
                    Current version v2.1.0 can be rolled back to v2.0.3 if issues are detected.
                  </p>
                  <Button variant="outline" className="text-yellow-700 border-yellow-300">
                    Initiate Rollback to v2.0.3
                  </Button>
                </div>
                
                <div className="text-center py-8 text-muted-foreground">
                  No rollbacks have been performed in the last 30 days.
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemUpdatesTracker;
