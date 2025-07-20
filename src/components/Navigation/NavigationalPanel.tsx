
import React from 'react';
import { Calendar, Clock, Calculator, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import ChatButton from '@/components/Chat/ChatButton';

const NavigationalPanel: React.FC = () => {
  const tools = [
    { icon: Calendar, label: 'Calendar', action: () => console.log('Calendar clicked') },
    { icon: Clock, label: 'World Clock', action: () => console.log('Clock clicked') },
    { icon: Calculator, label: 'Calculator', action: () => console.log('Calculator clicked') },
    { icon: Lightbulb, label: 'Quick Ideas', action: () => console.log('Ideas clicked') },
  ];

  return (
    <TooltipProvider>
      <div className="flex items-center gap-1">
        {tools.map((tool, index) => {
          const IconComponent = tool.icon;
          return (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={tool.action}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <IconComponent className="h-5 w-5 text-gray-600" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{tool.label}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
        
        {/* Chat Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <ChatButton />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Team Chat</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

export default NavigationalPanel;
