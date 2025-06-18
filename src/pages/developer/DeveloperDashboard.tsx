
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import DeveloperNavigation from '@/components/Navigation/DeveloperNavigation';
import ProductionReadinessMonitor from '@/components/SystemHealth/ProductionReadinessMonitor';
import UserAccountManager from '@/components/Developer/UserAccountManager';
import ErrorBoundary from '@/components/auth/ErrorBoundary';

const DeveloperDashboard = () => {
  const { user, profile } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <DeveloperNavigation />
      
      <main className="pt-[60px]">
        <div className="flex-1 px-4 md:px-6 py-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="border-b pb-6">
              <h1 className="text-3xl font-bold text-foreground">Developer Dashboard</h1>
              <p className="text-muted-foreground mt-2">
                System monitoring, user management, and production readiness tools
              </p>
              {profile && (
                <div className="mt-4 text-sm text-muted-foreground">
                  Logged in as: <span className="font-medium">{profile.full_name}</span> ({profile.role})
                </div>
              )}
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* System Health */}
              <ErrorBoundary>
                <ProductionReadinessMonitor />
              </ErrorBoundary>
              
              {/* User Management */}
              <ErrorBoundary>
                <UserAccountManager />
              </ErrorBoundary>
            </div>

            {/* System Information */}
            <ErrorBoundary>
              <Card>
                <CardHeader>
                  <CardTitle>System Information</CardTitle>
                  <CardDescription>Current system status and configuration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Environment</p>
                      <p className="text-muted-foreground">
                        {process.env.NODE_ENV || 'development'}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Current Route</p>
                      <p className="text-muted-foreground">
                        {window.location.pathname}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">User ID</p>
                      <p className="text-muted-foreground font-mono text-xs">
                        {user?.id || 'Not authenticated'}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Timestamp</p>
                      <p className="text-muted-foreground">
                        {new Date().toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ErrorBoundary>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DeveloperDashboard;
