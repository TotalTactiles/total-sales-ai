
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
      <TabsList className="grid w-full grid-cols-4 mb-4">
        <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
        <TabsTrigger value="data-sources" className="text-xs">Data Sources</TabsTrigger>
        <TabsTrigger value="ai-suggestions" className="text-xs">AI Suggestions</TabsTrigger>
        <TabsTrigger value="logs" className="text-xs">Logs</TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  );
};
