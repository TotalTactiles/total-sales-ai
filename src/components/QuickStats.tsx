
import React from 'react';
import StatsCard from './StatsCard';
import { PhoneCall, Target, Calendar, Timer } from 'lucide-react';

const QuickStats = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="futuristic-card group hover:scale-105 transition-all duration-300">
        <StatsCard
          title="Today's Calls"
          value={42}
          change="+15% vs. yesterday"
          changeType="increase"
          icon={<PhoneCall className="h-4 w-4" />}
          tooltip="Call volume is a leading indicator of your conversion success. Aim for 50+ daily calls for optimal results."
          chartData={[15, 22, 28, 32, 38, 42]}
          color="yellow"
        />
      </div>
      <div className="futuristic-card group hover:scale-105 transition-all duration-300">
        <StatsCard
          title="Leads Converted"
          value={7}
          change="+3 from yesterday"
          changeType="increase"
          icon={<Target className="h-4 w-4" />}
          tooltip="You're converting 16.7% of your calls today - well above the team average of 12%!"
          chartData={[2, 3, 4, 5, 6, 7]}
          color="green"
        />
      </div>
      <div className="futuristic-card group hover:scale-105 transition-all duration-300">
        <StatsCard
          title="Meetings Scheduled"
          value={4}
          change="Same as yesterday"
          changeType="neutral"
          icon={<Calendar className="h-4 w-4" />}
          tooltip="Consistent meeting scheduling leads to more predictable revenue. You need 2 more today to hit your goal."
          chartData={[3, 5, 2, 6, 4, 4]}
          color="blue"
        />
      </div>
      <div className="futuristic-card group hover:scale-105 transition-all duration-300">
        <StatsCard
          title="Response Time"
          value="3:42"
          change="-12% vs. yesterday"
          changeType="increase"
          icon={<Timer className="h-4 w-4" />}
          tooltip="Faster response times correlate with 28% higher conversion rates. You're trending in the right direction!"
          chartData={[5.2, 4.8, 4.5, 4.1, 3.9, 3.7]}
          color="purple"
        />
      </div>
    </div>
  );
};

export default QuickStats;
