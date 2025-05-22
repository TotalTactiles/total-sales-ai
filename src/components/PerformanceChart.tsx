
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Button } from "@/components/ui/button";

const PerformanceChart = () => {
  const [activeMetrics, setActiveMetrics] = useState<string[]>(['calls', 'conversions', 'meetings']);
  
  const data = [
    { day: 'Mon', calls: 32, conversions: 4, meetings: 2 },
    { day: 'Tue', calls: 28, conversions: 5, meetings: 3 },
    { day: 'Wed', calls: 35, conversions: 7, meetings: 4 },
    { day: 'Thu', calls: 42, conversions: 8, meetings: 5 },
    { day: 'Fri', calls: 38, conversions: 6, meetings: 3 },
    { day: 'Mon', calls: 40, conversions: 7, meetings: 4 },
    { day: 'Tue', calls: 45, conversions: 9, meetings: 6 },
  ];
  
  const toggleMetric = (metric: string) => {
    if (activeMetrics.includes(metric)) {
      // Don't allow removing all metrics
      if (activeMetrics.length > 1) {
        setActiveMetrics(activeMetrics.filter(m => m !== metric));
      }
    } else {
      setActiveMetrics([...activeMetrics, metric]);
    }
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-all duration-300">
      <CardContent className="p-5">
        <div className="flex justify-end gap-2 mb-3">
          <Button
            size="sm"
            variant={activeMetrics.includes('calls') ? "default" : "outline"}
            className={`py-1 px-2 h-auto text-xs ${activeMetrics.includes('calls') ? 'bg-salesBlue' : ''}`}
            onClick={() => toggleMetric('calls')}
          >
            Calls
          </Button>
          <Button
            size="sm"
            variant={activeMetrics.includes('conversions') ? "default" : "outline"}
            className={`py-1 px-2 h-auto text-xs ${activeMetrics.includes('conversions') ? 'bg-salesCyan' : ''}`}
            onClick={() => toggleMetric('conversions')}
          >
            Conversions
          </Button>
          <Button
            size="sm"
            variant={activeMetrics.includes('meetings') ? "default" : "outline"}
            className={`py-1 px-2 h-auto text-xs ${activeMetrics.includes('meetings') ? 'bg-salesGreen' : ''}`}
            onClick={() => toggleMetric('meetings')}
          >
            Meetings
          </Button>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 10,
                left: -20,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1a3c6e" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#1a3c6e" stopOpacity={0.05}/>
                </linearGradient>
                <linearGradient id="colorConversions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.05}/>
                </linearGradient>
                <linearGradient id="colorMeetings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="day" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: '1px solid #eee', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
                labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
              />
              {activeMetrics.includes('calls') && (
                <Area 
                  type="monotone" 
                  dataKey="calls" 
                  stroke="#1a3c6e" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorCalls)"
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              )}
              {activeMetrics.includes('conversions') && (
                <Area 
                  type="monotone" 
                  dataKey="conversions" 
                  stroke="#38bdf8" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorConversions)"
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              )}
              {activeMetrics.includes('meetings') && (
                <Area 
                  type="monotone" 
                  dataKey="meetings" 
                  stroke="#22c55e" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorMeetings)"
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex justify-center mt-4 gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-salesBlue"></div>
            <span className="text-xs">Calls</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-salesCyan"></div>
            <span className="text-xs">Conversions</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-salesGreen"></div>
            <span className="text-xs">Meetings</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceChart;
