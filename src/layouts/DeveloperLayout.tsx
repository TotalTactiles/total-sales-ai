import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { 
  Settings, 
  Brain, 
  Activity, 
  Database,
  Code,
  TestTube,
  Workflow,
  Key
} from 'lucide-react';
import AgentHealthDashboard from '@/components/Developer/AgentHealthDashboard';
import AdvancedFeatures from '@/pages/AdvancedFeatures';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const DeveloperLayout: React.FC = () => {
  const navigation = [
    { name: 'Agent Health', href: '/developer', icon: Activity },
    { name: 'Advanced Features', href: '/developer/advanced', icon: Settings },
    { name: 'API Console', href: '/developer/api', icon: Code },
    { name: 'Testing Suite', href: '/developer/testing', icon: TestTube },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm">
          <div className="p-6">
            <h1 className="text-xl font-bold text-gray-900">Developer Console</h1>
            <p className="text-sm text-gray-600 mt-1">Advanced AI management</p>
          </div>
          
          <nav className="mt-6">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                end={item.href === '/developer'}
                className={({ isActive }) =>
                  `flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`
                }
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1">
          <Routes>
            <Route index element={<AgentHealthDashboard />} />
            <Route path="advanced" element={<AdvancedFeatures />} />
            <Route path="api" element={<div className="p-6"><h2>API Console - Coming Soon</h2></div>} />
            <Route path="testing" element={<div className="p-6"><h2>Testing Suite - Coming Soon</h2></div>} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default DeveloperLayout;
