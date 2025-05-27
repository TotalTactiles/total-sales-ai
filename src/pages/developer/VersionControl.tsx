
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GitBranch, Clock, Tag, FileText, Download, RefreshCw } from 'lucide-react';

interface BuildInfo {
  version: string;
  buildNumber: string;
  branch: string;
  commit: string;
  buildTime: string;
  deployTime: string;
  environment: string;
}

interface ChangelogEntry {
  version: string;
  date: string;
  changes: string[];
  type: 'major' | 'minor' | 'patch';
}

const VersionControl: React.FC = () => {
  const [buildInfo, setBuildInfo] = useState<BuildInfo | null>(null);
  const [changelog, setChangelog] = useState<ChangelogEntry[]>([]);

  useEffect(() => {
    loadBuildInfo();
    loadChangelog();
  }, []);

  const loadBuildInfo = () => {
    // Mock build info - in real app this would come from environment variables or API
    const info: BuildInfo = {
      version: '2.1.3',
      buildNumber: '1247',
      branch: 'main',
      commit: 'a7f2c1b',
      buildTime: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
      deployTime: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
      environment: 'production'
    };
    setBuildInfo(info);
  };

  const loadChangelog = () => {
    const entries: ChangelogEntry[] = [
      {
        version: '2.1.3',
        date: '2025-05-27',
        type: 'patch',
        changes: [
          'Fixed database recursion issue in profiles policy',
          'Improved AI response fallback handling',
          'Enhanced error logging for debugging',
          'Updated Developer OS navigation structure'
        ]
      },
      {
        version: '2.1.2',
        date: '2025-05-26',
        type: 'minor',
        changes: [
          'Added Developer OS with comprehensive monitoring',
          'Implemented role-based access control',
          'Enhanced AI brain logging system',
          'Added sandbox testing environment',
          'Improved voice AI integration'
        ]
      },
      {
        version: '2.1.1',
        date: '2025-05-25',
        type: 'patch',
        changes: [
          'Fixed authentication routing issues',
          'Improved mobile responsiveness',
          'Enhanced API error handling',
          'Updated UI components styling'
        ]
      },
      {
        version: '2.1.0',
        date: '2025-05-24',
        type: 'major',
        changes: [
          'Complete OS redesign with role-specific interfaces',
          'Integrated Master AI Brain with Claude + ChatGPT',
          'Added comprehensive automation system',
          'Implemented voice-activated AI assistant',
          'Enhanced security and encryption',
          'Added real-time system monitoring'
        ]
      }
    ];
    setChangelog(entries);
  };

  const getVersionTypeColor = (type: string) => {
    switch (type) {
      case 'major': return 'bg-red-100 text-red-800';
      case 'minor': return 'bg-blue-100 text-blue-800';
      case 'patch': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const exportBuildInfo = () => {
    if (!buildInfo) return;
    
    const data = {
      buildInfo,
      changelog,
      exportTime: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `build-info-${buildInfo.version}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6 bg-slate-900 min-h-screen text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Version Control</h1>
          <p className="text-slate-400">Version info, last deploy time, change logs, and notes</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadBuildInfo}
            className="border-slate-600 text-white"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportBuildInfo}
            className="border-slate-600 text-white"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {buildInfo && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="text-sm text-slate-400">Version</p>
                  <p className="text-xl font-bold text-white">{buildInfo.version}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <GitBranch className="h-5 w-5 text-green-400" />
                <div>
                  <p className="text-sm text-slate-400">Build</p>
                  <p className="text-xl font-bold text-white">#{buildInfo.buildNumber}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-400" />
                <div>
                  <p className="text-sm text-slate-400">Last Deploy</p>
                  <p className="text-sm font-medium text-white">
                    {new Date(buildInfo.deployTime).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-yellow-400" />
                <div>
                  <p className="text-sm text-slate-400">Environment</p>
                  <Badge className={
                    buildInfo.environment === 'production' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-yellow-600 text-white'
                  }>
                    {buildInfo.environment}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="current" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800">
          <TabsTrigger value="current" className="data-[state=active]:bg-blue-600">Current Build</TabsTrigger>
          <TabsTrigger value="changelog" className="data-[state=active]:bg-green-600">Changelog</TabsTrigger>
          <TabsTrigger value="notes" className="data-[state=active]:bg-purple-600">Release Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="mt-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Current Build Information</CardTitle>
            </CardHeader>
            <CardContent>
              {buildInfo && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-white mb-2">Build Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Version:</span>
                          <span className="text-white font-mono">{buildInfo.version}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Build Number:</span>
                          <span className="text-white font-mono">#{buildInfo.buildNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Branch:</span>
                          <span className="text-white font-mono">{buildInfo.branch}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Commit:</span>
                          <span className="text-white font-mono">{buildInfo.commit}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-white mb-2">Deployment Timeline</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Built:</span>
                          <span className="text-white">{new Date(buildInfo.buildTime).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Deployed:</span>
                          <span className="text-white">{new Date(buildInfo.deployTime).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Environment:</span>
                          <Badge className="bg-green-600 text-white">{buildInfo.environment}</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="changelog" className="mt-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Version History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {changelog.map((entry, index) => (
                  <div key={entry.version} className="border-l-2 border-slate-600 pl-4">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-bold text-white">v{entry.version}</h4>
                      <Badge className={getVersionTypeColor(entry.type)}>
                        {entry.type}
                      </Badge>
                      <span className="text-sm text-slate-400">{entry.date}</span>
                    </div>
                    <ul className="space-y-1">
                      {entry.changes.map((change, changeIndex) => (
                        <li key={changeIndex} className="text-sm text-slate-300">
                          • {change}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="mt-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Release Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-slate-700 rounded-lg">
                  <h4 className="font-medium text-white mb-2">🎉 Version 2.1.3 Release Notes</h4>
                  <div className="space-y-2 text-sm text-slate-300">
                    <p><strong>🔧 Bug Fixes:</strong></p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Resolved database policy recursion causing authentication issues</li>
                      <li>Fixed AI fallback mechanisms for improved reliability</li>
                      <li>Enhanced error logging for better developer experience</li>
                    </ul>
                    
                    <p className="mt-3"><strong>✨ Improvements:</strong></p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Streamlined Developer OS navigation for better UX</li>
                      <li>Improved system monitoring capabilities</li>
                      <li>Enhanced role-based access control</li>
                    </ul>
                    
                    <p className="mt-3"><strong>🔮 Coming Next:</strong></p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Advanced automation workflow builder</li>
                      <li>Enhanced AI learning capabilities</li>
                      <li>Mobile app companion</li>
                    </ul>
                  </div>
                </div>
                
                <div className="p-4 bg-blue-900/20 border border-blue-600/30 rounded-lg">
                  <h4 className="font-medium text-blue-400 mb-2">📋 Known Issues</h4>
                  <ul className="text-sm text-slate-300 space-y-1">
                    <li>• Voice recognition requires microphone permission for full functionality</li>
                    <li>• Some automation flows may experience delays during high load</li>
                    <li>• OAuth integrations may require re-authentication after updates</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-green-900/20 border border-green-600/30 rounded-lg">
                  <h4 className="font-medium text-green-400 mb-2">🚀 Performance Improvements</h4>
                  <ul className="text-sm text-slate-300 space-y-1">
                    <li>• 40% faster API response times</li>
                    <li>• Reduced bundle size by 15%</li>
                    <li>• Improved AI inference speed</li>
                    <li>• Enhanced database query optimization</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VersionControl;
