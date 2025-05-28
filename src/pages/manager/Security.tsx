
import React, { useState } from 'react';
import { Shield, Lock, Eye, AlertTriangle, Users, Key, FileText, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { useLeads } from '@/hooks/useLeads';
import { useMockData } from '@/hooks/useMockData';
import DemoModeIndicator from '@/components/Demo/DemoModeIndicator';
import WorkspaceShowcase from '@/components/Demo/WorkspaceShowcase';
import { toast } from 'sonner';

const ManagerSecurity = () => {
  const { leads } = useLeads();
  const { leads: mockLeads } = useMockData();
  const { isDemoMode } = useAuth();
  const [showDemo, setShowDemo] = useState(false);

  const hasRealData = leads && leads.length > 0;
  const shouldShowMockData = isDemoMode() || showDemo || !hasRealData;

  const handleStartDemo = () => {
    setShowDemo(true);
    toast.success('Demo mode activated! Explore comprehensive security management and compliance tools.');
  };

  // Mock security data
  const mockSecurityData = {
    securityOverview: {
      securityScore: 92,
      activeThreats: 0,
      complianceStatus: 'Compliant',
      lastAudit: '2024-01-15',
      dataEncryption: 'AES-256',
      accessControls: 'Multi-factor enabled'
    },
    userSessions: [
      {
        user: 'Sarah Johnson',
        lastLogin: '2024-01-21T14:30:00Z',
        ipAddress: '192.168.1.45',
        location: 'New York, NY',
        device: 'Chrome on Windows',
        status: 'Active',
        duration: '4h 23m'
      },
      {
        user: 'Michael Chen',
        lastLogin: '2024-01-21T13:15:00Z',
        ipAddress: '192.168.1.67',
        location: 'San Francisco, CA',
        device: 'Safari on MacOS',
        status: 'Active',
        duration: '2h 45m'
      },
      {
        user: 'Jennifer Park',
        lastLogin: '2024-01-21T09:20:00Z',
        ipAddress: '192.168.1.89',
        location: 'Austin, TX',
        device: 'Chrome on Windows',
        status: 'Offline',
        duration: '6h 12m'
      }
    ],
    auditLog: [
      {
        timestamp: '2024-01-21T14:30:00Z',
        user: 'Sarah Johnson',
        action: 'Lead Data Export',
        resource: 'TechCorp Lead Database',
        result: 'Success',
        riskLevel: 'Medium'
      },
      {
        timestamp: '2024-01-21T13:45:00Z',
        user: 'Michael Chen',
        action: 'Password Change',
        resource: 'User Account',
        result: 'Success',
        riskLevel: 'Low'
      },
      {
        timestamp: '2024-01-21T12:20:00Z',
        user: 'Admin System',
        action: 'Backup Creation',
        resource: 'All Databases',
        result: 'Success',
        riskLevel: 'Low'
      },
      {
        timestamp: '2024-01-21T11:15:00Z',
        user: 'Jennifer Park',
        action: 'Failed Login Attempt',
        resource: 'Authentication System',
        result: 'Failed',
        riskLevel: 'High'
      }
    ],
    permissions: [
      {
        role: 'Sales Rep',
        users: 6,
        permissions: ['View Leads', 'Edit Own Leads', 'Create Activities', 'View Reports'],
        dataAccess: 'Own leads only'
      },
      {
        role: 'Sales Manager',
        users: 2,
        permissions: ['View All Leads', 'Edit All Leads', 'Manage Team', 'Admin Reports'],
        dataAccess: 'Team data'
      },
      {
        role: 'Admin',
        users: 1,
        permissions: ['Full System Access', 'User Management', 'Security Settings'],
        dataAccess: 'All data'
      }
    ],
    complianceSettings: [
      {
        regulation: 'GDPR',
        status: 'Compliant',
        lastCheck: '2024-01-15',
        requirements: ['Data encryption', 'Right to erasure', 'Consent management'],
        actions: 0
      },
      {
        regulation: 'CCPA',
        status: 'Compliant',
        lastCheck: '2024-01-15',
        requirements: ['Data transparency', 'Opt-out rights', 'Data minimization'],
        actions: 0
      },
      {
        regulation: 'HIPAA',
        status: 'Compliant',
        lastCheck: '2024-01-10',
        requirements: ['Healthcare data protection', 'Access controls', 'Audit trails'],
        actions: 0
      }
    ],
    securitySettings: [
      {
        setting: 'Multi-Factor Authentication',
        enabled: true,
        description: 'Require 2FA for all user accounts'
      },
      {
        setting: 'Session Timeout',
        enabled: true,
        description: 'Auto-logout after 30 minutes of inactivity'
      },
      {
        setting: 'IP Whitelist',
        enabled: false,
        description: 'Restrict access to approved IP addresses'
      },
      {
        setting: 'Data Encryption',
        enabled: true,
        description: 'AES-256 encryption for all stored data'
      },
      {
        setting: 'Audit Logging',
        enabled: true,
        description: 'Log all user actions and system events'
      },
      {
        setting: 'Password Policy',
        enabled: true,
        description: 'Enforce strong password requirements'
      }
    ]
  };

  const handleToggleSetting = (setting: string) => {
    toast.success(`${setting} setting updated`);
  };

  const handleRevokeAccess = (userId: string) => {
    toast.success('User access revoked');
  };

  const handleExportAuditLog = () => {
    toast.success('Audit log exported successfully');
  };

  // Show workspace showcase if no data and demo not started
  if (!shouldShowMockData && !showDemo) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="max-w-4xl mx-auto py-12">
          <WorkspaceShowcase 
            workspace="Security & Compliance Center" 
            onStartDemo={handleStartDemo}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Demo Mode Indicator */}
      {shouldShowMockData && (
        <DemoModeIndicator workspace="Security & Compliance Management System" />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Security & Compliance</h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive security monitoring and compliance management
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="px-3 py-1">
            <Shield className="h-3 w-3 mr-1" />
            Security Score: {mockSecurityData.securityOverview.securityScore}%
          </Badge>
          <Badge variant="outline" className="px-3 py-1 text-green-600">
            <Lock className="h-3 w-3 mr-1" />
            {mockSecurityData.securityOverview.complianceStatus}
          </Badge>
        </div>
      </div>

      {/* Security Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {mockSecurityData.securityOverview.securityScore}%
            </div>
            <p className="text-xs text-muted-foreground">
              Excellent security posture
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Threats</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {mockSecurityData.securityOverview.activeThreats}
            </div>
            <p className="text-xs text-muted-foreground">
              No threats detected
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Status</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {mockSecurityData.securityOverview.complianceStatus}
            </div>
            <p className="text-xs text-muted-foreground">
              All regulations met
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Audit</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Date(mockSecurityData.securityOverview.lastAudit).toLocaleDateString()}
            </div>
            <p className="text-xs text-muted-foreground">
              6 days ago
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Security Overview</TabsTrigger>
          <TabsTrigger value="users">User Access</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Security Configuration</CardTitle>
              <CardDescription>Manage system security settings and controls</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockSecurityData.securitySettings.map((setting, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">{setting.setting}</h4>
                      <p className="text-sm text-muted-foreground">{setting.description}</p>
                    </div>
                    <Switch 
                      checked={setting.enabled}
                      onCheckedChange={() => handleToggleSetting(setting.setting)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Security Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Security Recommendations</CardTitle>
              <CardDescription>AI-powered security improvement suggestions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900">🔒 Enhanced Security</h4>
                  <p className="text-blue-700 text-sm mt-1">
                    Consider enabling IP whitelist for additional access control
                  </p>
                  <Button size="sm" variant="outline" className="mt-2">
                    Enable IP Whitelist
                  </Button>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900">✅ Good Practice</h4>
                  <p className="text-green-700 text-sm mt-1">
                    Multi-factor authentication is properly configured for all users
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-semibold text-yellow-900">⚠️ Review Recommended</h4>
                  <p className="text-yellow-700 text-sm mt-1">
                    Some users haven't changed passwords in 90+ days
                  </p>
                  <Button size="sm" variant="outline" className="mt-2">
                    Send Reminders
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          {/* Active User Sessions */}
          <Card>
            <CardHeader>
              <CardTitle>Active User Sessions</CardTitle>
              <CardDescription>Monitor current user activity and sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockSecurityData.userSessions.map((session, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                        {session.user.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="font-semibold">{session.user}</h4>
                        <p className="text-sm text-muted-foreground">
                          {session.device} • {session.location}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          IP: {session.ipAddress} • Duration: {session.duration}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={session.status === 'Active' ? 'default' : 'secondary'}>
                        {session.status}
                      </Badge>
                      {session.status === 'Active' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleRevokeAccess(session.user)}
                        >
                          Revoke Access
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Role-Based Permissions */}
          <Card>
            <CardHeader>
              <CardTitle>Role-Based Access Control</CardTitle>
              <CardDescription>Manage user roles and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockSecurityData.permissions.map((role, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{role.role}</h4>
                        <p className="text-sm text-muted-foreground">{role.users} users</p>
                      </div>
                      <Badge variant="outline">{role.dataAccess}</Badge>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium">Permissions:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {role.permissions.map((permission, permIndex) => (
                            <Badge key={permIndex} variant="secondary" className="text-xs">
                              {permission}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          {/* Audit Log */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Security Audit Log</CardTitle>
                  <CardDescription>Detailed log of all system activities and security events</CardDescription>
                </div>
                <Button variant="outline" onClick={handleExportAuditLog}>
                  <FileText className="h-4 w-4 mr-2" />
                  Export Log
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockSecurityData.auditLog.map((entry, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${
                        entry.riskLevel === 'High' ? 'bg-red-500' :
                        entry.riskLevel === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`} />
                      <div>
                        <h4 className="font-semibold">{entry.action}</h4>
                        <p className="text-sm text-muted-foreground">
                          {entry.user} • {entry.resource}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={entry.result === 'Success' ? 'default' : 'destructive'}>
                        {entry.result}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(entry.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Security Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold">247</div>
                  <div className="text-sm text-muted-foreground">Security events today</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Failed Attempts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">3</div>
                  <div className="text-sm text-muted-foreground">Failed login attempts</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Access</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold">156</div>
                  <div className="text-sm text-muted-foreground">Authorized data exports</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          {/* Compliance Status */}
          <Card>
            <CardHeader>
              <CardTitle>Regulatory Compliance Status</CardTitle>
              <CardDescription>Current compliance status for all applicable regulations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockSecurityData.complianceSettings.map((regulation, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{regulation.regulation}</h4>
                        <p className="text-sm text-muted-foreground">
                          Last checked: {new Date(regulation.lastCheck).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="default" className="bg-green-600">
                          {regulation.status}
                        </Badge>
                        {regulation.actions > 0 && (
                          <Badge variant="destructive">
                            {regulation.actions} actions needed
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Requirements:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {regulation.requirements.map((req, reqIndex) => (
                          <Badge key={reqIndex} variant="outline" className="text-xs">
                            ✓ {req}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Compliance Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Compliance Management</CardTitle>
              <CardDescription>Tools and actions for maintaining compliance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-20 flex-col">
                  <FileText className="h-6 w-6 mb-2" />
                  Generate Compliance Report
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Shield className="h-6 w-6 mb-2" />
                  Run Security Audit
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Eye className="h-6 w-6 mb-2" />
                  Data Privacy Review
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Key className="h-6 w-6 mb-2" />
                  Access Review
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManagerSecurity;
