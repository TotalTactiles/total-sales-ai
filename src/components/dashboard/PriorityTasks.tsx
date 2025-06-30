import React from 'react';
import { PriorityTask } from '../../types/dashboard';

interface PriorityTasksProps {
  tasks: PriorityTask[];
}

export const PriorityTasks: React.FC<PriorityTasksProps> = ({ tasks }) => {
  const getPriorityClasses = (priority: string) => {
    const priorityMap = {
      high: 'border-red-500 bg-red-50 bg-red-100 text-red-700',
      medium: 'border-yellow-500 bg-yellow-50 bg-yellow-100 text-yellow-700',
      low: 'border-green-500 bg-green-50 bg-green-100 text-green-700'
    };
    return priorityMap[priority as keyof typeof priorityMap] || priorityMap.medium;
  };

  const getTaskIcon = (type: string) => {
    const iconMap = {
      call: '📞',
      email: '📧',
      meeting: '🤝',
      proposal: '📋'
    };
    return iconMap[type as keyof typeof iconMap] || '📋';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <span className="mr-2">⚡</span>Suggested Tasks
        </h3>
        <button className="text-blue-600 hover:text-blue-700 text-sm">View All</button>
      </div>
      
      <div className="space-y-3">
        {tasks.map((task) => {
          const priorityClasses = getPriorityClasses(task.priority);
          const [borderClass, bgClass, badgeBg, badgeText] = priorityClasses.split(' ');
          
          return (
            <div key={task.id} className={`flex items-center justify-between p-4 border-l-4 ${borderClass} ${bgClass} rounded-r-lg`}>
              <div className="flex-1">
                <div className="flex items-center mb-1">
                  <span className="mr-2">{getTaskIcon(task.type)}</span>
                  <span className="font-medium text-gray-900">{task.title}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className={`px-2 py-1 ${badgeBg} ${badgeText} rounded text-xs mr-2`}>
                    {task.priority} priority
                  </span>
                  <span>Suggested: {task.suggestedTime}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{task.description}</p>
              </div>
              <button className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                Start
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
