
import React from 'react';
import AIAssistantPanel from '@/components/manager/AIAssistantPanel';

const AIAssistant: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AI Assistant</h1>
          <p className="text-gray-600">Your intelligent COO companion for strategic insights</p>
        </div>
        
        <div className="h-[calc(100vh-12rem)]">
          <AIAssistantPanel />
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
