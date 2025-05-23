
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Bot, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useOnboarding } from '../OnboardingContext';
import AgentBirthPod from '../components/metaphorical-ui/AgentBirthPod';

interface AgentNameStepProps {
  settings: any;
  updateSettings: (data: any) => void;
}

const AgentNameStep: React.FC<AgentNameStepProps> = ({ settings, updateSettings }) => {
  const [nameSource, setNameSource] = React.useState<string>('suggested');
  const { canUseMetaphoricalUI } = useOnboarding();
  
  const suggestedNames = [
    'SalesOS',
    'SalesBoost',
    'RevEngine',
    'SalesPro',
    'DealMaker',
    'SalesGenius',
    'RevenueOS'
  ];

  const handleNameChange = (name: string) => {
    updateSettings({ agent_name: name });
  };

  const selectSuggestion = (name: string) => {
    updateSettings({ agent_name: name });
  };

  // Enhanced UI with metaphorical elements
  if (canUseMetaphoricalUI) {
    return (
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="text-center mb-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold">Name your AI sales assistant</h1>
          <p className="text-muted-foreground">
            Choose a name that resonates with your team's identity
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <AgentBirthPod
            value={settings.agent_name}
            onChange={handleNameChange}
            label="AI Assistant Name"
            suggestions={suggestedNames}
          />
        </motion.div>
      </motion.div>
    );
  }

  // Fallback UI for browsers/devices that don't support advanced features
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">Name your AI sales assistant</h1>
        <p className="text-muted-foreground">
          Choose a name that fits with your company culture
        </p>
      </div>

      <Tabs 
        defaultValue="suggested" 
        value={nameSource}
        onValueChange={setNameSource}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="suggested" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" /> Suggested
          </TabsTrigger>
          <TabsTrigger value="custom" className="flex items-center gap-2">
            <User className="h-4 w-4" /> Custom
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="suggested" className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            {suggestedNames.map((name) => (
              <div 
                key={name}
                className={`border rounded-lg p-4 flex items-center justify-center cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 ${
                  settings.agent_name === name 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border'
                }`}
                onClick={() => selectSuggestion(name)}
              >
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary" />
                  <span className="font-medium">{name}</span>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="custom" className="mt-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="agentName">Custom Assistant Name</Label>
              <Input
                id="agentName"
                placeholder="Enter a name for your AI assistant"
                value={settings.agent_name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="mt-1"
              />
              <p className="mt-2 text-sm text-muted-foreground">
                This name will be used throughout the platform when referring to your AI assistant.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AgentNameStep;
