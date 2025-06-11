import { logger } from '@/utils/logger';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Code,
  Monitor,
  Brain,
  Activity,
  AlertTriangle,
  CheckSquare,
  TestTube,
  GitBranch,
  Settings,
  LogOut,
  User,
  Database,
  Zap,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import OSNavigation from './OSNavigation';

const navItems = [
  { href: '/developer/dashboard', label: 'Dashboard', icon: Monitor },
  { href: '/developer/ai-brain-logs', label: 'AI Brain Hub', icon: Brain },
  { href: '/developer/system-monitor', label: 'System Monitor', icon: Activity },
  { href: '/developer/api-logs', label: 'API Logs', icon: Code },
  { href: '/developer/error-logs', label: 'Error Logs', icon: AlertTriangle },
  { href: '/developer/crm-integrations', label: 'CRM Integration Dashboard', icon: Database },
  { href: '/developer/qa-checklist', label: 'QA Checklist', icon: CheckSquare },
  { href: '/developer/testing-sandbox', label: 'Testing Tools', icon: TestTube },
  { href: '/developer/version-control', label: 'Version Control', icon: GitBranch },
  { href: '/developer/settings', label: 'Settings', icon: Settings },
];

const DeveloperNavigation: React.FC = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [testMode, setTestMode] = useState('developer');

  const toggleTestMode = () => {
    const modes = ['developer', 'manager', 'sales_rep'];
    const currentIndex = modes.indexOf(testMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setTestMode(nextMode);
    logger.info(`Developer Testing: Simulating ${nextMode} experience`);
  };

  const handleLogout = () => {
    navigate('/logout');
  };

  const actions = (
    <>
      <Button
        onClick={toggleTestMode}
        variant="outline"
        size="sm"
        className="text-white border-slate-600 hover:bg-slate-700"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Test as {testMode === 'developer' ? 'Manager' : testMode === 'manager' ? 'Sales Rep' : 'Developer'}
      </Button>
      <div className="flex items-center space-x-2 text-white">
        <User className="h-4 w-4" />
        <span className="text-sm">{profile?.full_name || 'Developer'}</span>
      </div>
      <Button
        onClick={handleLogout}
        variant="ghost"
        size="sm"
        className="text-slate-300 hover:text-white"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </>
  );

  const badge = (
    <Badge className="ml-2 bg-cyan-500 text-white">
      <Zap className="h-3 w-3 mr-1" />
      TESTING MODE
    </Badge>
  );

  return (
    <OSNavigation
      items={navItems}
      role="Developer OS"
      icon={Code}
      roleBadge={badge}
      className="bg-slate-800 border-b border-slate-700 text-white"
      actions={actions}
    />
  );
};

export default DeveloperNavigation;
