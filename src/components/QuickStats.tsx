
import React from 'react';
import StatsCard from './StatsCard';
import { TooltipProvider } from '@/components/ui/tooltip';

const QuickStats = () => {
  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Today's Calls" 
          value={42} 
          change="+15% vs. yesterday" 
          changeType="increase" 
          icon="📞"
          tooltip="Call volume is a leading indicator of your conversion success. Aim for 50+ daily calls for optimal results."
          chartData={[15, 22, 28, 32, 38, 42]}
        />
        <StatsCard 
          title="Leads Converted" 
          value={7} 
          change="+3 from yesterday" 
          changeType="increase" 
          icon="🎯"
          tooltip="You're converting 16.7% of your calls today - well above the team average of 12%!"
          chartData={[2, 3, 4, 5, 6, 7]}
        />
        <StatsCard 
          title="Meetings Scheduled" 
          value={4} 
          change="Same as yesterday" 
          changeType="neutral" 
          icon="🗓️"
          tooltip="Consistent meeting scheduling leads to more predictable revenue. You need 2 more today to hit your goal."
          chartData={[3, 5, 2, 6, 4, 4]}
        />
        <StatsCard 
          title="Avg. Response Time" 
          value="3:42" 
          change="-12% vs. yesterday" 
          changeType="increase" 
          icon="⏱️"
          tooltip="Faster response times correlate with 28% higher conversion rates. You're trending in the right direction!"
          chartData={[5.2, 4.8, 4.5, 4.1, 3.9, 3.7]}
        />
      </div>
    </TooltipProvider>
  );
};

export default QuickStats;
