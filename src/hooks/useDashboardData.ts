import { useState, useEffect } from 'react';
import { DashboardData } from '../types/dashboard';

export const useDashboardData = () => {
  const [data, setData] = useState<DashboardData>({
    aiSummary: "Good morning! You have 12 high-priority leads requiring immediate attention. Your conversion rate improved by 23% this week. AI suggests focusing on Enterprise leads today.",
    aiAssistant: {
      emailsDrafted: 23,
      callsScheduled: 12,
      proposalsGenerated: 5,
      performanceImprovement: 34
    },
    suggestedSchedule: [
      {
        id: '1',
        time: '09:00',
        title: 'Priority Lead Calls',
        description: 'High impact activities',
        duration: '2h',
        priority: 'high',
        color: 'blue'
      },
      {
        id: '2',
        time: '11:30',
        title: 'Follow-up Emails',
        description: 'Nurture warm leads',
        duration: '30m',
        priority: 'medium',
        color: 'green'
      },
      {
        id: '3',
        time: '14:00',
        title: 'Warm Lead Outreach',
        description: 'Peak response time',
        duration: '1.5h',
        priority: 'medium',
        color: 'orange'
      }
    ],
    priorityTasks: [
      {
        id: '1',
        type: 'call',
        title: 'Call Maria Rodriguez at TechCorp',
        description: 'Warm lead ready to close - $125K potential',
        suggestedTime: '2:30 PM',
        priority: 'high',
        value: '$125K'
      },
      {
        id: '2',
        type: 'email',
        title: 'Send follow-up email to Global Solutions',
        description: 'Proposal sent 3 days ago - follow up needed',
        suggestedTime: '3:15 PM',
        priority: 'medium'
      }
    ],
    pipelineData: [
      {
        id: '1',
        company: 'TechCorp Inc.',
        contact: 'Maria Rodriguez',
        status: 'qualified',
        priority: 'high',
        value: '$125K',
        avatar: 'T'
      },
      {
        id: '2',
        company: 'Global Solutions',
        contact: 'Mike Chen',
        status: 'proposal',
        priority: 'medium',
        value: '$85K',
        avatar: 'G'
      }
    ]
  });

  const [loading, setLoading] = useState(false);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => ({
        ...prev,
        aiAssistant: {
          ...prev.aiAssistant,
          performanceImprovement: prev.aiAssistant.performanceImprovement + Math.floor(Math.random() * 3 - 1)
        }
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return { data, loading, setData };
};
