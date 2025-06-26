
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Code,
  Brain,
  Zap,
  Settings
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import DeveloperNavigation from '@/components/Navigation/DeveloperNavigation';

const DeveloperDashboard = () => {
  const { profile } = useAuth();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <DeveloperNavigation />
      
      <div className="ml-64 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Developer Dashboard</h1>
            <p className="text-gray-400">Welcome back, {profile?.full_name || 'Developer'}</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-green-900 text-green-400 border-green-400">
              <Brain className="h-3 w-3 mr-1 animate-pulse" />
              JARVIS Active
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">System Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-2xl font-bold text-white">98%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Active Errors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <span className="text-2xl font-bold text-white">3</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">AI Fixes Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-500" />
                <span className="text-2xl font-bold text-white">7</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Deployments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Code className="h-5 w-5 text-purple-500" />
                <span className="text-2xl font-bold text-white">12</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center py-8">
          <h2 className="text-xl font-semibold text-green-400">✅ Developer Dashboard Active</h2>
          <p className="text-gray-400 mt-2">TSAM JARVIS OS loaded successfully - All systems monitored</p>
          <div className="mt-4 text-xs text-gray-500">
            Activated via triple-dot trigger (...)
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperDashboard;
