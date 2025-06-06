
import React from 'react';
import {
  BarChart3,
  Users,
  Brain,
  Phone,
  Settings,
  FileText,
  Grid,
  Bot,
  GraduationCap,
  Monitor,
  Activity,
  Code,
  AlertTriangle,
  Database,
  CheckSquare,
  TestTube,
  GitBranch,
  Shield
} from 'lucide-react';
import type { Role } from '@/contexts/auth/types';

export interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  badge?: string;
  description?: string;
}

export const createNavItems = (
  role: Role,
  getDashboardUrl: () => string
): NavItem[] => {
  switch (role) {
    case 'manager':
      return [
        {
          icon: <BarChart3 className="h-5 w-5" />,
          label: 'Dashboard',
          href: '/manager/dashboard'
        },
        {
          icon: <BarChart3 className="h-5 w-5" />,
          label: 'Analytics',
          href: '/manager/analytics'
        },
        {
          icon: <Users className="h-5 w-5" />,
          label: 'Lead Management',
          href: '/manager/lead-management'
        },
        {
          icon: <Database className="h-5 w-5" />,
          label: 'Company Brain',
          href: '/manager/company-brain'
        },
        {
          icon: <Brain className="h-5 w-5" />,
          label: 'AI Assistant',
          href: '/manager/ai'
        },
        {
          icon: <Database className="h-5 w-5" />,
          label: 'CRM Integrations',
          href: '/manager/crm-integrations'
        },
        {
          icon: <Users className="h-5 w-5" />,
          label: 'Team Management',
          href: '/manager/team-management'
        },
        {
          icon: <Shield className="h-5 w-5" />,
          label: 'Security',
          href: '/manager/security'
        },
        {
          icon: <FileText className="h-5 w-5" />,
          label: 'Reports',
          href: '/manager/reports'
        },
        {
          icon: <Settings className="h-5 w-5" />,
          label: 'Settings',
          href: '/manager/settings'
        }
      ];
    case 'developer':
      return [
        {
          icon: <Monitor className="h-5 w-5" />,
          label: 'Dashboard',
          href: '/developer/dashboard'
        },
        {
          icon: <Brain className="h-5 w-5" />,
          label: 'AI Brain Hub',
          href: '/developer/ai-brain-logs'
        },
        {
          icon: <Activity className="h-5 w-5" />,
          label: 'System Monitor',
          href: '/developer/system-monitor'
        },
        {
          icon: <Code className="h-5 w-5" />,
          label: 'API Logs',
          href: '/developer/api-logs'
        },
        {
          icon: <AlertTriangle className="h-5 w-5" />,
          label: 'Error Logs',
          href: '/developer/error-logs'
        },
        {
          icon: <Database className="h-5 w-5" />,
          label: 'CRM Integration Dashboard',
          href: '/developer/crm-integrations'
        },
        {
          icon: <CheckSquare className="h-5 w-5" />,
          label: 'QA Checklist',
          href: '/developer/qa-checklist'
        },
        {
          icon: <TestTube className="h-5 w-5" />,
          label: 'Testing Tools',
          href: '/developer/testing-sandbox'
        },
        {
          icon: <GitBranch className="h-5 w-5" />,
          label: 'Version Control',
          href: '/developer/version-control'
        },
        {
          icon: <Settings className="h-5 w-5" />,
          label: 'Settings',
          href: '/developer/settings'
        }
      ];
    case 'sales_rep':
    default:
      return [
        {
          icon: <Grid className="h-5 w-5" />,
          label: 'Dashboard',
          href: getDashboardUrl()
        },
        {
          icon: <Users className="h-5 w-5" />,
          label: 'Lead Management',
          href: '/sales/lead-management'
        },
        {
          icon: <Bot className="h-5 w-5" />,
          label: 'AI Agent',
          href: '/sales/ai'
        },
        {
          icon: <Phone className="h-5 w-5" />,
          label: 'Dialer',
          href: '/sales/dialer'
        },
        {
          icon: <BarChart3 className="h-5 w-5" />,
          label: 'Analytics',
          href: '/sales/analytics'
        },
        {
          icon: <GraduationCap className="h-5 w-5" />,
          label: 'Academy',
          href: '/sales/academy'
        },
        {
          icon: <Settings className="h-5 w-5" />,
          label: 'Settings',
          href: '/sales/settings'
        }
      ];
  }
};

