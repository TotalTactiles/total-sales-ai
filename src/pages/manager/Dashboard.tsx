
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Target, 
  Brain,
  BarChart3,
  Calendar,
  AlertTriangle,
  Building2,
  Database,
  BarChart,
  UserPlus
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Import the new components
import CompanyDashboard from '@/components/Manager/CompanyDashboard';
import IntegrationsTab from '@/components/Manager/IntegrationsTab';
import KnowledgeTab from '@/components/Manager/KnowledgeTab';
import MarketingAnalytics from '@/components/Manager/MarketingAnalytics';
import LeadAssignment from '@/components/Manager/LeadAssignment';

const ManagerDashboard = () => {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('company-dashboard');

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manager Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {profile?.full_name || 'Manager'}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Brain className="h-3 w-3 mr-1" />
            AI Assistant Active
          </Badge>
        </div>
      </div>

      {/* Main Tabbed Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger value="company-dashboard" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Company Dashboard
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="knowledge" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Knowledge
          </TabsTrigger>
          <TabsTrigger value="marketing" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            Marketing Analytics
          </TabsTrigger>
          <TabsTrigger value="lead-assignment" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Lead Assignment
          </TabsTrigger>
        </TabsList>

        <TabsContent value="company-dashboard" className="space-y-6">
          <CompanyDashboard />
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <IntegrationsTab />
        </TabsContent>

        <TabsContent value="knowledge" className="space-y-6">
          <KnowledgeTab />
        </TabsContent>

        <TabsContent value="marketing" className="space-y-6">
          <MarketingAnalytics />
        </TabsContent>

        <TabsContent value="lead-assignment" className="space-y-6">
          <LeadAssignment />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManagerDashboard;
