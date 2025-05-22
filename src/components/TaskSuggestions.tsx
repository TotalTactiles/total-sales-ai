
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Task {
  id: number;
  title: string;
  description: string;
  type: 'call' | 'follow-up' | 'lead' | 'admin';
  reward?: {
    xp: number;
    credits: number;
  };
  deadline?: string;
  priority: 'high' | 'medium' | 'low';
}

const TaskSuggestions = () => {
  const tasks: Task[] = [
    { 
      id: 1, 
      title: 'Call Michael Scott', 
      description: 'LinkedIn lead from yesterday, interested in premium plan',
      type: 'call',
      reward: { xp: 30, credits: 15 },
      priority: 'high'
    },
    { 
      id: 2, 
      title: 'Follow-up with Jim Halpert', 
      description: 'Requested pricing quote last week',
      type: 'follow-up',
      deadline: 'Today, 3:00 PM',
      reward: { xp: 25, credits: 10 },
      priority: 'medium'
    },
    { 
      id: 3, 
      title: 'Respond to Pam Beesly', 
      description: 'New inbound lead, asked about integration options',
      type: 'lead',
      reward: { xp: 35, credits: 20 },
      priority: 'high'
    },
  ];
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'call': return '📞';
      case 'follow-up': return '🔄';
      case 'lead': return '🎯';
      case 'admin': return '📋';
      default: return '📝';
    }
  };
  
  const getTypeClass = (type: string) => {
    switch (type) {
      case 'call': return 'bg-salesBlue text-white';
      case 'follow-up': return 'bg-amber-500 text-white';
      case 'lead': return 'bg-salesGreen text-white';
      case 'admin': return 'bg-slate-500 text-white';
      default: return 'bg-slate-200 text-slate-700';
    }
  };
  
  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-salesRed';
      case 'medium': return 'text-amber-500';
      case 'low': return 'text-slate-500';
      default: return 'text-slate-500';
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">AI-Suggested Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="p-3 border rounded-md hover:shadow-sm transition-all">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-md ${getTypeClass(task.type)}`}>
                  {getTypeIcon(task.type)}
                </div>
                <div className="flex-1">
                  <div className="font-medium flex items-center justify-between">
                    {task.title}
                    <span className={`text-xs font-medium ${getPriorityClass(task.priority)}`}>
                      {task.priority.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mt-1">{task.description}</p>
                  
                  <div className="flex mt-2 justify-between items-center">
                    <div className="flex items-center gap-1">
                      {task.deadline && (
                        <span className="text-xs bg-slate-100 px-2 py-0.5 rounded">
                          {task.deadline}
                        </span>
                      )}
                      {task.reward && (
                        <div className="flex gap-1">
                          <span className="text-xs bg-salesBlue-light text-white px-2 py-0.5 rounded flex items-center gap-0.5">
                            <span className="text-[10px]">🧠</span> {task.reward.xp} XP
                          </span>
                          <span className="text-xs bg-salesGreen-light text-white px-2 py-0.5 rounded flex items-center gap-0.5">
                            <span className="text-[10px]">💰</span> {task.reward.credits}
                          </span>
                        </div>
                      )}
                    </div>
                    {task.type === 'call' && (
                      <Button size="sm" className="h-7 bg-salesGreen hover:bg-salesGreen-dark">
                        Call Now
                      </Button>
                    )}
                    {task.type === 'follow-up' && (
                      <Button size="sm" className="h-7 bg-amber-500 hover:bg-amber-600">
                        Follow Up
                      </Button>
                    )}
                    {task.type === 'lead' && (
                      <Button size="sm" className="h-7 bg-salesBlue hover:bg-salesBlue-dark">
                        Respond
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-3">
          <Button variant="outline" size="sm" className="text-salesBlue">View All Tasks</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskSuggestions;
