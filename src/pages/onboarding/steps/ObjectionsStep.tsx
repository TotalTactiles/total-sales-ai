
import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { useOnboarding } from '../OnboardingContext';
import { motion } from 'framer-motion';
import FoggedGlassSelection from '../components/metaphorical-ui/FoggedGlassSelection';

interface ObjectionsStepProps {
  settings: any;
  updateSettings: (data: any) => void;
}

const ObjectionsStep: React.FC<ObjectionsStepProps> = ({ settings, updateSettings }) => {
  const [customObjection, setCustomObjection] = React.useState('');
  const { canUseMetaphoricalUI } = useOnboarding();
  
  const commonObjections = [
    { id: 'price', label: 'Price / Budget', description: 'Product or service is too expensive' },
    { id: 'timing', label: 'Timing', description: 'Not the right time to buy' },
    { id: 'competitor', label: 'Using Competitor', description: 'Already using a competing solution' },
    { id: 'authority', label: 'No Authority', description: 'Not the decision maker' },
    { id: 'need', label: 'No Need', description: 'Don\'t see the value or necessity' },
    { id: 'trust', label: 'Trust Issues', description: 'Skeptical about claims or company' },
    { id: 'complex', label: 'Complexity', description: 'Seems too complicated to implement' },
  ];

  const toggleObjection = (id: string) => {
    const updatedObjections = settings.pain_points?.includes(id)
      ? settings.pain_points.filter((item: string) => item !== id)
      : [...(settings.pain_points || []), id];
    
    updateSettings({ pain_points: updatedObjections });
  };

  const addCustomObjection = () => {
    if (customObjection.trim() && !settings.pain_points.includes(customObjection.trim())) {
      updateSettings({
        pain_points: [...(settings.pain_points || []), customObjection.trim()]
      });
      setCustomObjection('');
    }
  };

  const removeObjection = (objection: string) => {
    updateSettings({
      pain_points: settings.pain_points.filter((o: string) => o !== objection)
    });
  };

  // Custom objections section
  const renderCustomObjections = () => (
    <motion.div 
      className="border-t pt-4 mt-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
    >
      <Label>Add Custom Objections</Label>
      
      <div className="flex items-center gap-2 mt-2">
        <Input
          placeholder="Enter custom objection"
          value={customObjection}
          onChange={(e) => setCustomObjection(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addCustomObjection();
            }
          }}
        />
        <Button 
          type="button" 
          onClick={addCustomObjection}
          variant="outline"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Custom objection chips */}
      {settings.pain_points?.filter((objection: string) => 
        !commonObjections.map(o => o.id).includes(objection)).length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {settings.pain_points
            .filter((objection: string) => !commonObjections.map(o => o.id).includes(objection))
            .map((objection: string) => (
              <motion.div 
                key={objection}
                className="bg-primary/10 text-primary px-3 py-1 rounded-full flex items-center gap-1 text-sm"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
              >
                {objection}
                <button 
                  onClick={() => removeObjection(objection)}
                  className="ml-1 hover:text-primary/80"
                >
                  <X className="h-3 w-3" />
                </button>
              </motion.div>
            ))
          }
        </div>
      )}
    </motion.div>
  );

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
          <h1 className="text-2xl font-bold">What objections do you face?</h1>
          <p className="text-muted-foreground">
            Select the most common objections your sales team encounters
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <FoggedGlassSelection
            options={commonObjections}
            selectedOptions={settings.pain_points || []}
            onChange={toggleObjection}
            label="Common Objections"
          />
        </motion.div>

        {renderCustomObjections()}
      </motion.div>
    );
  }

  // Fallback UI for browsers/devices that don't support advanced features
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">What objections do you face?</h1>
        <p className="text-muted-foreground">
          Select the most common objections your sales team encounters
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {commonObjections.map((objection) => (
          <div 
            key={objection.id}
            className={`border rounded-lg p-4 cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 ${
              settings.pain_points?.includes(objection.id) 
                ? 'border-primary bg-primary/5' 
                : 'border-border'
            }`}
            onClick={() => toggleObjection(objection.id)}
          >
            <div className="flex items-start gap-3">
              <Checkbox 
                checked={settings.pain_points?.includes(objection.id)} 
                onCheckedChange={() => toggleObjection(objection.id)}
                id={`objection-${objection.id}`}
                className="mt-1"
              />
              <div>
                <Label 
                  htmlFor={`objection-${objection.id}`}
                  className="font-medium cursor-pointer"
                >
                  {objection.label}
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {objection.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t pt-4 mt-6">
        <Label>Add Custom Objections</Label>
        
        <div className="flex items-center gap-2 mt-2">
          <Input
            placeholder="Enter custom objection"
            value={customObjection}
            onChange={(e) => setCustomObjection(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addCustomObjection();
              }
            }}
          />
          <Button 
            type="button" 
            onClick={addCustomObjection}
            variant="outline"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Custom objection chips */}
        {settings.pain_points?.filter((objection: string) => 
          !commonObjections.map(o => o.id).includes(objection)).length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {settings.pain_points
              .filter((objection: string) => !commonObjections.map(o => o.id).includes(objection))
              .map((objection: string) => (
                <div 
                  key={objection}
                  className="bg-primary/10 text-primary px-3 py-1 rounded-full flex items-center gap-1 text-sm"
                >
                  {objection}
                  <button 
                    onClick={() => removeObjection(objection)}
                    className="ml-1 hover:text-primary/80"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default ObjectionsStep;
