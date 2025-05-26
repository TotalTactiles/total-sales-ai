
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CardTabsProps {
  cardId: string;
  activeCardTab: Record<string, string>;
  setCardTab: (cardId: string, tab: string) => void;
  children: React.ReactNode;
}

export const CardTabs: React.FC<CardTabsProps> = ({ 
  cardId, 
  activeCardTab, 
  setCardTab, 
  children 
}) => {
  const getCardTab = (cardId: string) => {
    return activeCardTab[cardId] || 'overview';
  };

  return (
    <Tabs value={getCardTab(cardId)} onValueChange={(value) => setCardTab(cardId, value)}>
      <TabsList className="grid w-full grid-cols-4 mb-6 bg-slate-100/80 p-1 rounded-xl">
        <TabsTrigger 
          value="overview" 
          className="text-xs font-medium rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all"
        >
          Overview
        </TabsTrigger>
        <TabsTrigger 
          value="data-sources" 
          className="text-xs font-medium rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all"
        >
          Data Sources
        </TabsTrigger>
        <TabsTrigger 
          value="ai-suggestions" 
          className="text-xs font-medium rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all"
        >
          AI Suggestions
        </TabsTrigger>
        <TabsTrigger 
          value="logs" 
          className="text-xs font-medium rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all"
        >
          Logs
        </TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  );
};
