import React from 'react';
import { AIAssistantStats } from '../../types/dashboard';

interface AIAssistantHubProps {
  stats: AIAssistantStats;
}

export const AIAssistantHub: React.FC<AIAssistantHubProps> = ({ stats }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">🤖 AI Assistant Summary</h3>
        <span className="text-green-600 text-sm font-medium">Active</span>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="mr-2">📧</span>
            <span className="text-gray-600">Emails Drafted</span>
          </div>
          <span className="text-2xl font-bold text-blue-600">{stats.emailsDrafted}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="mr-2">📞</span>
            <span className="text-gray-600">Calls Scheduled</span>
          </div>
          <span className="text-2xl font-bold text-green-600">{stats.callsScheduled}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="mr-2">📋</span>
            <span className="text-gray-600">Proposals Generated</span>
          </div>
          <span className="text-2xl font-bold text-purple-600">{stats.proposalsGenerated}</span>
        </div>
        
        <div className="pt-3 border-t">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Performance Improvement</span>
            <span className="text-green-600 font-semibold">+{stats.performanceImprovement}% ↗</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Compared to previous period</p>
        </div>
      </div>
    </div>
  );
};
