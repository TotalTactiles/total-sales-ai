
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Terminal, 
  Activity, 
  Bug, 
  Brain,
  Database,
  Code,
  Settings,
  BarChart3,
  Zap,
  GitBranch
} from 'lucide-react';

const DeveloperNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/developer/dashboard', label: 'Dashboard', icon: Terminal },
    { path: '/developer/system-monitor', label: 'System Monitor', icon: Activity },
    { path: '/developer/error-logs', label: 'Error Logs', icon: Bug },
    { path: '/developer/agent-health', label: 'Agent Health', icon: Brain },
    { path: '/developer/brain-monitor', label: 'AI Brain Monitor', icon: Database },
    { path: '/developer/api-logs', label: 'API Logs', icon: Code },
    { path: '/developer/tsam-brain', label: 'TSAM Brain', icon: Zap },
    { path: '/developer/feature-flags', label: 'Feature Flags', icon: Settings },
    { path: '/developer/system-updates', label: 'System Updates', icon: GitBranch },
    { path: '/developer/ai-integration', label: 'AI Integration', icon: BarChart3 },
  ];

  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-gray-800/95 backdrop-blur-sm border-r border-gray-700 shadow-lg z-50">
      <div className="p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-green-400">Developer OS</h2>
          <p className="text-sm text-gray-400">v2.1</p>
        </div>
        
        <div className="space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Button
                key={item.path}
                variant={isActive ? 'default' : 'ghost'}
                className={`w-full justify-start gap-3 ${
                  isActive ? 'bg-green-600 hover:bg-green-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
                onClick={() => navigate(item.path)}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default DeveloperNavigation;
