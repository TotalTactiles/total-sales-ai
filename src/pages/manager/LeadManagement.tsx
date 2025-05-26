
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Filter, Plus } from 'lucide-react';

const ManagerLeadManagement = () => {
  return (
    <div className="flex-1 px-4 md:px-6 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Lead Management</h1>
            <p className="text-muted-foreground">Manage and distribute leads across your team</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Import Leads
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Unassigned Leads
              </CardTitle>
              <CardDescription>Leads waiting for assignment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">47</div>
              <p className="text-sm text-muted-foreground">Requires immediate attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hot Leads</CardTitle>
              <CardDescription>High-priority prospects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">23</div>
              <p className="text-sm text-muted-foreground">Response needed within 24h</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Conversion Rate</CardTitle>
              <CardDescription>This month's performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">34%</div>
              <p className="text-sm text-muted-foreground">+8% from last month</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lead Distribution & Assignment</CardTitle>
            <CardDescription>AI-powered lead routing and team workload management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-96 flex items-center justify-center text-muted-foreground">
              Lead Management Interface Placeholder
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManagerLeadManagement;
