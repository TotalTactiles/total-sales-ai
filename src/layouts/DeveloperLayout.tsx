
import React from 'react';
import ErrorBoundary from '@/components/common/ErrorBoundary';
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

const DeveloperLayout: React.FC = () => {
  const navigation = [
    { name: 'Agent Health', href: '/developer', icon: Activity },
    { name: 'Advanced Features', href: '/developer/advanced', icon: Settings },
    { name: 'API Console', href: '/developer/api', icon: Code },
    { name: 'Testing Suite', href: '/developer/testing', icon: TestTube },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white dark:bg-slate-800 shadow-sm border-r border-slate-200 dark:border-slate-700">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Developer Console</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Advanced AI management</p>
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
                      ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-r-2 border-blue-700 dark:border-blue-400'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700'
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
        <div className="flex-1 bg-slate-50 dark:bg-slate-900">
          <ErrorBoundary fallback={<div className="p-4">Something went wrong. Please refresh or contact support.</div>}>
            <Routes>
              <Route index element={<AgentHealthDashboard />} />
              <Route path="advanced" element={<AdvancedFeatures />} />
            <Route 
              path="api" 
              element={
                <div className="p-6">
                  <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-8 text-center">
                    <Code className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">API Console</h2>
                    <p className="text-slate-600 dark:text-slate-400">Advanced API testing and management tools coming soon.</p>
                  </div>
                </div>
              }
            />
            <Route
              path="testing"
              element={
                <div className="p-6">
                  <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-8 text-center">
                    <TestTube className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Testing Suite</h2>
                    <p className="text-slate-600 dark:text-slate-400">Comprehensive testing tools and automation coming soon.</p>
                  </div>
                </div>
              }
            />
            </Routes>
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};

export default DeveloperLayout;
