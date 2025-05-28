
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const TerritoryPerformanceTab = () => {
  const mockTerritories = [
    { territory: 'North America', leads: 89, conversion: 28.5, revenue: 1250000 },
    { territory: 'Europe', leads: 45, conversion: 32.1, revenue: 890000 },
    { territory: 'Asia Pacific', leads: 34, conversion: 25.8, revenue: 567000 }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Territory Performance Overview</CardTitle>
        <CardDescription>Regional lead performance and revenue analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockTerritories.map((territory, index) => (
            <div key={index} className="grid grid-cols-4 gap-4 p-4 border rounded-lg">
              <div>
                <h4 className="font-semibold">{territory.territory}</h4>
                <p className="text-sm text-muted-foreground">Geographic Region</p>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold">{territory.leads}</div>
                <div className="text-xs text-muted-foreground">Active Leads</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold">{territory.conversion}%</div>
                <div className="text-xs text-muted-foreground">Conversion Rate</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-green-600">
                  ${territory.revenue.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">Revenue</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TerritoryPerformanceTab;
