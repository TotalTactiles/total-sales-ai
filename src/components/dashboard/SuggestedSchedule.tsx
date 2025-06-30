import React, { useState } from 'react';
import { ScheduleItem } from '../../types/dashboard';

interface SuggestedScheduleProps {
  schedule: ScheduleItem[];
}

export const SuggestedSchedule: React.FC<SuggestedScheduleProps> = ({ schedule }) => {
  const [collapsed, setCollapsed] = useState(false);

  const totalDuration = schedule.reduce((total, item) => {
    const duration = parseFloat(item.duration);
    return total + (isNaN(duration) ? 0 : duration);
  }, 0);

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'text-blue-600 bg-blue-500',
      green: 'text-green-600 bg-green-500',
      orange: 'text-orange-600 bg-orange-500'
    };
    return colorMap[color as keyof typeof colorMap] || 'text-blue-600 bg-blue-500';
  };

  return (
    <div className="bg-blue-50 p-6 rounded-lg shadow-sm mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <span className="mr-2">📅</span>Suggested Schedule
        </h3>
        <div className="flex items-center space-x-3">
          <span className="text-blue-600 text-sm font-medium">{totalDuration}h total</span>
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            {collapsed ? 'Show ▼' : 'Hide ▲'}
          </button>
        </div>
      </div>
      
      {!collapsed && (
        <div className="space-y-3">
          {schedule.map((item) => {
            const colorClasses = getColorClasses(item.color);
            return (
              <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div className="flex items-center">
                  <span className={`mr-3 ${colorClasses.split(' ')[0]}`}>🕘 {item.time}</span>
                  <div>
                    <span className="font-medium text-gray-900">{item.title}</span>
                    <div className="flex items-center mt-1">
                      <span className={`w-2 h-2 ${colorClasses.split(' ')[1]} rounded-full mr-2`}></span>
                      <span className="text-sm text-gray-600">{item.description}</span>
                    </div>
                  </div>
                </div>
                <span className="text-gray-500 text-sm">{item.duration}</span>
              </div>
            );
          })}
        </div>
      )}
      
      <p className="text-xs text-blue-600 mt-3 flex items-center">
        <span className="mr-1">💡</span>
        Suggested based on your activity patterns and optimal contact times
      </p>
    </div>
  );
};
