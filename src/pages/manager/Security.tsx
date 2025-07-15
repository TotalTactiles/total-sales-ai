
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Shield, 
  Lock, 
  Eye, 
  CheckCircle, 
  AlertTriangle,
  Activity,
  Key,
  Globe,
  FileText
} from 'lucide-react';

const Security: React.FC = () => {
  const [encryptionEnabled, setEncryptionEnabled] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [auditLogsEnabled, setAuditLogsEnabled] = useState(true);

  const complianceStandards = [
    { name: 'SOC 2 Type II', status: 'certified', logo: '🛡️' },
    { name: 'GDPR Compliant', status: 'certified', logo: '🇪🇺' },
    { name: 'ISO 27001', status: 'certified', logo: '📋' },
    { name: 'HIPAA Ready', status: 'certified', logo: '🏥' }
  ];

  const recentSecurityEvents = [
    { event: 'User login successful', timestamp: new Date(), status: 'success' },
    { event: 'Data backup completed', timestamp: new Date(Date.now() - 300000), status: 'success' },
    { event: 'System security scan passed', timestamp: new Date(Date.now() - 600000), status: 'success' },
    { event: 'SSL certificate renewed', timestamp: new Date(Date.now() - 900000), status: 'success' },
    { event: 'Access control updated', timestamp: new Date(Date.now() - 1200000), status: 'success' }
  ];

  const threatScans = [
    { type: 'Malware Scan', lastRun: new Date(), status: 'clean', nextRun: new Date(Date.now() + 86400000) },
    { type: 'Vulnerability Assessment', lastRun: new Date(Date.now() - 3600000), status: 'clean', nextRun: new Date(Date.now() + 86400000) },
    { type: 'Network Security Scan', lastRun: new Date(Date.now() - 7200000), status: 'clean', nextRun: new Date(Date.now() + 86400000) }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Shield className="h-8 w-8 text-green-600" />
              Security Center
            </h1>
            <p className="text-muted-foreground">Your data is protected with enterprise-grade security</p>
          </div>
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-4 w-4 mr-1" />
            All Systems Secure
          </Badge>
        </div>

        {/* Security Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Lock className="h-5 w-5 text-blue-600" />
                Encryption
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm">AES-256 Encryption</span>
                <Switch 
                  checked={encryptionEnabled}
                  onCheckedChange={setEncryptionEnabled}
                />
              </div>
              <Badge className="mt-2 bg-green-100 text-green-800">Active</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Key className="h-5 w-5 text-purple-600" />
                2FA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm">Two-Factor Auth</span>
                <Switch 
                  checked={twoFactorEnabled}
                  onCheckedChange={setTwoFactorEnabled}
                />
              </div>
              <Badge className="mt-2 bg-green-100 text-green-800">Enabled</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Eye className="h-5 w-5 text-orange-600" />
                Audit Logs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm">Activity Monitoring</span>
                <Switch 
                  checked={auditLogsEnabled}
                  onCheckedChange={setAuditLogsEnabled}
                />
              </div>
              <Badge className="mt-2 bg-green-100 text-green-800">Monitoring</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Globe className="h-5 w-5 text-green-600" />
                SSL/TLS
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm">Secure Transport</span>
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <Badge className="mt-2 bg-green-100 text-green-800">TLS 1.3</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Compliance Standards */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Compliance & Certifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {complianceStandards.map((standard) => (
                <div key={standard.name} className="text-center p-4 border rounded-lg">
                  <div className="text-4xl mb-2">{standard.logo}</div>
                  <h3 className="font-medium mb-2">{standard.name}</h3>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Certified
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Threat Detection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Security Scans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {threatScans.map((scan) => (
                <div key={scan.type} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <h4 className="font-medium">{scan.type}</h4>
                    <p className="text-sm text-muted-foreground">
                      Last run: {scan.lastRun.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-green-100 text-green-800 mb-1">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Clean
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      Next: {scan.nextRun.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Security Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentSecurityEvents.map((event, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">{event.event}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {event.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View Full Security Log
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Security Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-auto p-4">
                <div className="text-center">
                  <Shield className="h-6 w-6 mx-auto mb-2" />
                  <div className="font-medium">Run Security Scan</div>
                  <div className="text-sm text-muted-foreground">Full system check</div>
                </div>
              </Button>
              <Button variant="outline" className="h-auto p-4">
                <div className="text-center">
                  <Lock className="h-6 w-6 mx-auto mb-2" />
                  <div className="font-medium">Update Passwords</div>
                  <div className="text-sm text-muted-foreground">Team password policy</div>
                </div>
              </Button>
              <Button variant="outline" className="h-auto p-4">
                <div className="text-center">
                  <FileText className="h-6 w-6 mx-auto mb-2" />
                  <div className="font-medium">Download Report</div>
                  <div className="text-sm text-muted-foreground">Security compliance</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Security;
