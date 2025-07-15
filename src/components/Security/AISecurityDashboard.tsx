
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Shield, 
  Lock, 
  Eye, 
  Server, 
  AlertTriangle, 
  CheckCircle, 
  Key,
  Globe,
  Database,
  Wifi
} from 'lucide-react';

const AISecurityDashboard: React.FC = () => {
  const complianceLogos = [
    { name: 'SOC 2', status: 'certified' },
    { name: 'ISO 27001', status: 'certified' },
    { name: 'GDPR', status: 'compliant' },
    { name: 'CCPA', status: 'compliant' },
    { name: 'HIPAA', status: 'ready' }
  ];

  const threatScans = [
    { type: 'Malware Scan', status: 'clean', lastRun: '2 hours ago' },
    { type: 'Vulnerability Assessment', status: 'clean', lastRun: '6 hours ago' },
    { type: 'Network Intrusion', status: 'clean', lastRun: '1 hour ago' },
    { type: 'Data Breach Monitor', status: 'clean', lastRun: '30 minutes ago' }
  ];

  const recentActivity = [
    { action: 'SSL Certificate Renewed', timestamp: '2 hours ago', status: 'secure' },
    { action: 'Password Policy Updated', timestamp: '1 day ago', status: 'secure' },
    { action: 'API Access Granted to Integration', timestamp: '2 days ago', status: 'secure' },
    { action: 'Data Backup Completed', timestamp: '6 hours ago', status: 'secure' },
    { action: 'Security Audit Passed', timestamp: '1 week ago', status: 'secure' }
  ];

  return (
    <div className="space-y-6">
      {/* Compliance Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Compliance & Certifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {complianceLogos.map((cert) => (
              <div key={cert.name} className="text-center p-4 border rounded-lg">
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="font-medium text-sm">{cert.name}</h4>
                <Badge className="bg-green-100 text-green-800 text-xs mt-1">
                  {cert.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Threat Detection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Threat Detection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {threatScans.map((scan) => (
                <div key={scan.type} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-sm">{scan.type}</h4>
                    <p className="text-xs text-gray-500">Last scan: {scan.lastRun}</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {scan.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Encryption & Access
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Data Encryption</h4>
                  <p className="text-sm text-gray-500">AES-256 encryption enabled</p>
                </div>
                <Switch checked={true} disabled />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-500">Required for all users</p>
                </div>
                <Switch checked={true} disabled />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">API Rate Limiting</h4>
                  <p className="text-sm text-gray-500">DDoS protection active</p>
                </div>
                <Switch checked={true} disabled />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">VPN Access Only</h4>
                  <p className="text-sm text-gray-500">Admin functions restricted</p>
                </div>
                <Switch checked={false} disabled />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Recent Security Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{activity.action}</h4>
                    <p className="text-xs text-gray-500">{activity.timestamp}</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">
                  Secure
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Network Security */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Globe className="h-4 w-4" />
              Firewall Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
              <p className="text-xs text-gray-500 mt-2">Blocking 99.9% of threats</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Database className="h-4 w-4" />
              Data Backup
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Database className="h-8 w-8 text-blue-600" />
              </div>
              <Badge className="bg-blue-100 text-blue-800">Encrypted</Badge>
              <p className="text-xs text-gray-500 mt-2">Last backup: 2 hours ago</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Wifi className="h-4 w-4" />
              SSL Certificate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Key className="h-8 w-8 text-purple-600" />
              </div>
              <Badge className="bg-purple-100 text-purple-800">Valid</Badge>
              <p className="text-xs text-gray-500 mt-2">Expires in 11 months</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Disclaimer */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="pt-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-orange-800">Security Dashboard</h4>
              <p className="text-sm text-orange-700 mt-1">
                This dashboard provides visual security status indicators. All security measures are maintained 
                automatically by our infrastructure team. No manual configuration is required.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AISecurityDashboard;
