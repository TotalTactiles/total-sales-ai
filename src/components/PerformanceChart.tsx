
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PerformanceChart = () => {
  const data = [
    { day: 'Mon', calls: 32, conversions: 4, meetings: 2 },
    { day: 'Tue', calls: 28, conversions: 5, meetings: 3 },
    { day: 'Wed', calls: 35, conversions: 7, meetings: 4 },
    { day: 'Thu', calls: 42, conversions: 8, meetings: 5 },
    { day: 'Fri', calls: 38, conversions: 6, meetings: 3 },
    { day: 'Mon', calls: 40, conversions: 7, meetings: 4 },
    { day: 'Tue', calls: 45, conversions: 9, meetings: 6 },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Weekly Performance</CardTitle>
      </CardHeader>
      <CardContent>
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
                  <stop offset="5%" stopColor="#1a3c6e" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#1a3c6e" stopOpacity={0.01}/>
                </linearGradient>
                <linearGradient id="colorConversions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.02}/>
                </linearGradient>
                <linearGradient id="colorMeetings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0.02}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="day" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="calls" stroke="#1a3c6e" fillOpacity={1} fill="url(#colorCalls)" />
              <Area type="monotone" dataKey="conversions" stroke="#38bdf8" fillOpacity={1} fill="url(#colorConversions)" />
              <Area type="monotone" dataKey="meetings" stroke="#22c55e" fillOpacity={1} fill="url(#colorMeetings)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center mt-2 gap-4">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-salesBlue"></div>
            <span className="text-xs">Calls</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-salesCyan"></div>
            <span className="text-xs">Conversions</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-salesGreen"></div>
            <span className="text-xs">Meetings</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceChart;
