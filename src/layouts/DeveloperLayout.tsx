
import React from 'react';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { Routes, Route, Navigate } from 'react-router-dom';
import ResponsiveNavigation from '@/components/Navigation/ResponsiveNavigation';
import DeveloperDashboard from '@/pages/developer/Dashboard';
import AdvancedFeatures from '@/pages/AdvancedFeatures';
import { Code, TestTube } from 'lucide-react';

const DeveloperLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900">
      <ResponsiveNavigation />

      <main className="pt-[60px]">
        <ErrorBoundary fallback={<div className="p-4 text-white">Something went wrong. Please refresh or contact support.</div>}>
          <Routes>
            <Route index element={<DeveloperDashboard />} />
            <Route path="dashboard" element={<DeveloperDashboard />} />
            <Route path="advanced" element={<AdvancedFeatures />} />
            <Route 
              path="api" 
              element={
                <div className="p-6">
                  <div className="bg-slate-800 rounded-lg shadow-sm p-8 text-center">
                    <Code className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-white mb-2">API Console</h2>
                    <p className="text-slate-400">Advanced API testing and management tools coming soon.</p>
                  </div>
                </div>
              }
            />
            <Route
              path="testing"
              element={
                <div className="p-6">
                  <div className="bg-slate-800 rounded-lg shadow-sm p-8 text-center">
                    <TestTube className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-white mb-2">Testing Suite</h2>
                    <p className="text-slate-400">Comprehensive testing tools and automation coming soon.</p>
                  </div>
                </div>
              }
            />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Routes>
        </ErrorBoundary>
      </main>
    </div>
  );
};

export default DeveloperLayout;
