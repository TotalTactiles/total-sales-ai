
import React from 'react';
import StatsCard from './StatsCard';

const QuickStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard 
        title="Today's Calls" 
        value={42} 
        change="+15% vs. yesterday" 
        changeType="increase" 
        icon="📞"
      />
      <StatsCard 
        title="Leads Converted" 
        value={7} 
        change="+3 from yesterday" 
        changeType="increase" 
        icon="🎯"
      />
      <StatsCard 
        title="Meetings Scheduled" 
        value={4} 
        change="Same as yesterday" 
        changeType="neutral" 
        icon="🗓️"
      />
      <StatsCard 
        title="Avg. Response Time" 
        value="3:42" 
        change="-12% vs. yesterday" 
        changeType="increase" 
        icon="⏱️"
      />
    </div>
  );
};

export default QuickStats;
