
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Upload, FileText, Globe } from 'lucide-react';

const ManagerCompanyBrain = () => {
  return (
    <div className="flex-1 px-4 md:px-6 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Company Brain</h1>
            <p className="text-muted-foreground">Centralized knowledge management and content distribution</p>
          </div>
          <Button>
            <Upload className="h-4 w-4 mr-2" />
            Upload Content
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI Processing
              </CardTitle>
              <CardDescription>Content analysis status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">92%</div>
              <p className="text-sm text-muted-foreground">Content processed and indexed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
              Documents
              </CardTitle>
              <CardDescription>Total knowledge base</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">1,247</div>
              <p className="text-sm text-muted-foreground">Documents and resources</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Sources
              </CardTitle>
              <CardDescription>Connected data sources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">8</div>
              <p className="text-sm text-muted-foreground">Active integrations</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Content Management</CardTitle>
              <CardDescription>Manage SOPs, case studies, and training materials</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                Content Management Interface Placeholder
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Auto-Ingestion Sources</CardTitle>
              <CardDescription>Connected platforms and data feeds</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                Data Sources Configuration Placeholder
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ManagerCompanyBrain;
