
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Brain,
  Search,
  Plus,
  FileText,
  Upload,
  Settings,
  Target,
  Workflow,
  Database,
  Mail,
  Calendar,
  MessageSquare,
  Link,
  CheckCircle,
  AlertCircle,
  Clock,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import KnowledgeTab from './KnowledgeTab';
import AutomationTab from './AutomationTab';
import BusinessGoalsTab from './BusinessGoalsTab';
import CRMIntegrationTab from './CRMIntegrationTab';

const CompanyBrainManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('knowledge');

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Brain className="h-8 w-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">Company Brain</h1>
        </div>
        <p className="text-gray-600">
          Centralized intelligence hub for your organization's knowledge and automation
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="knowledge">Knowledge</TabsTrigger>
          <TabsTrigger value="crm">CRM Integration</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
          <TabsTrigger value="goals">Business Goals</TabsTrigger>
        </TabsList>

        <TabsContent value="knowledge">
          <KnowledgeTab />
        </TabsContent>

        <TabsContent value="crm">
          <CRMIntegrationTab />
        </TabsContent>

        <TabsContent value="automation">
          <AutomationTab />
        </TabsContent>

        <TabsContent value="goals">
          <BusinessGoalsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompanyBrainManager;
