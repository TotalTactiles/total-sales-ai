
import React from 'react';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { Routes, Route, NavLink } from 'react-router-dom';
import ResponsiveNavigation from '@/components/Navigation/ResponsiveNavigation';
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
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <ResponsiveNavigation />

      <main className="pt-[60px]">
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
      </main>
    </div>
  );
};

export default DeveloperLayout;
