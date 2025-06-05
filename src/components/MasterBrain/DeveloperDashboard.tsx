import { logger } from '@/utils/logger';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  TrendingUp, 
  Users, 
  Zap, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  BarChart3, 
  Settings,
  Lightbulb,
  Database,
  Shield,
  Activity
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { aiLearningLayer } from '@/services/ai/aiLearningLayer';
import { useSystemHealth } from '@/hooks/useSystemHealth';

interface SystemImprovement {
  id: string;
  category: 'ux_ui' | 'feature_priority' | 'automation_flow' | 'system_performance';
  suggestion: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  implementationComplexity: 'simple' | 'moderate' | 'complex';
  estimatedValue: number;
  confidence: number;
  generatedBy: 'claude' | 'chatgpt' | 'hybrid';
  timestamp: Date;
}

const DeveloperDashboard: React.FC = () => {
  const { profile } = useAuth();
  const { metrics, isChecking, checkSystemHealth, overallHealth } = useSystemHealth();
  const [improvements, setImprovements] = useState<SystemImprovement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    loadSystemImprovements();
  }, [profile?.company_id]);

  const loadSystemImprovements = async () => {
    if (!profile?.company_id) return;
    
    try {
      setIsLoading(true);
      const companyImprovements = await aiLearningLayer.getCompanyImprovements(profile.company_id);
      setImprovements(companyImprovements);
    } catch (error) {
      logger.error('Failed to load system improvements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImplementImprovement = async (improvementId: string) => {
    try {
      await aiLearningLayer.markImprovementAsImplemented(improvementId);
      setImprovements(prev => prev.filter(imp => imp.id !== improvementId));
    } catch (error) {
      logger.error('Failed to mark improvement as implemented:', error);
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'complex': return 'text-red-600';
      case 'moderate': return 'text-yellow-600';
      case 'simple': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ux_ui': return <Users className="h-4 w-4" />;
      case 'feature_priority': return <Lightbulb className="h-4 w-4" />;
      case 'automation_flow': return <Zap className="h-4 w-4" />;
      case 'system_performance': return <Activity className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };

  const filteredImprovements = selectedCategory === 'all' 
    ? improvements 
    : improvements.filter(imp => imp.category === selectedCategory);

  const getHealthStatusColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-600';
      case 'degraded': return 'text-yellow-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (profile?.role !== 'admin' && profile?.role !== 'manager') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Access Restricted</h3>
          <p className="text-gray-500">This dashboard is only available to managers and administrators.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Master Brain Developer Dashboard</h1>
          <p className="text-gray-600">AI-powered system insights and improvement recommendations</p>
        </div>
        <Button onClick={checkSystemHealth} disabled={isChecking}>
          <Activity className="h-4 w-4 mr-2" />
          {isChecking ? 'Checking...' : 'Health Check'}
        </Button>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Health</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getHealthStatusColor(overallHealth)}`}>
              {overallHealth.charAt(0).toUpperCase() + overallHealth.slice(1)}
            </div>
            <p className="text-xs text-muted-foreground">System status</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Services</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getHealthStatusColor(metrics.aiSystemHealth)}`}>
              {metrics.aiSystemHealth}
            </div>
            <p className="text-xs text-muted-foreground">Claude + ChatGPT</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getHealthStatusColor(metrics.databaseHealth)}`}>
              {metrics.databaseHealth}
            </div>
            <p className="text-xs text-muted-foreground">Response: {metrics.responseTime.toFixed(0)}ms</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Voice System</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getHealthStatusColor(metrics.voiceSystemHealth)}`}>
              {metrics.voiceSystemHealth}
            </div>
            <p className="text-xs text-muted-foreground">ElevenLabs + RetellAI</p>
          </CardContent>
        </Card>
      </div>

      {/* AI Improvements Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-600" />
              AI-Generated System Improvements
            </CardTitle>
            <div className="flex gap-2">
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-1 border rounded-md text-sm"
              >
                <option value="all">All Categories</option>
                <option value="ux_ui">UX/UI</option>
                <option value="feature_priority">Features</option>
                <option value="automation_flow">Automation</option>
                <option value="system_performance">Performance</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredImprovements.length === 0 ? (
            <div className="text-center py-8">
              <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Improvements Found</h3>
              <p className="text-gray-500">The AI is analyzing your system and will generate improvements soon.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredImprovements.map((improvement) => (
                <div key={improvement.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(improvement.category)}
                      <span className="font-medium capitalize">
                        {improvement.category.replace('_', ' ')}
                      </span>
                      <Badge className={getImpactColor(improvement.impact)}>
                        {improvement.impact} impact
                      </Badge>
                      <span className={`text-sm ${getComplexityColor(improvement.implementationComplexity)}`}>
                        {improvement.implementationComplexity} to implement
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        Value: {improvement.estimatedValue}/100
                      </span>
                      <Badge variant="outline">
                        {improvement.generatedBy}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-gray-700">{improvement.suggestion}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Confidence:</span>
                        <Progress value={improvement.confidence * 100} className="w-20 h-2" />
                        <span className="text-sm text-gray-600">
                          {(improvement.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {improvement.timestamp.toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleImplementImprovement(improvement.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Mark Implemented
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DeveloperDashboard;
