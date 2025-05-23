
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface IndustryStepProps {
  settings: any;
  updateSettings: (data: any) => void;
}

const IndustryStep: React.FC<IndustryStepProps> = ({ settings, updateSettings }) => {
  const industries = [
    'SaaS', 'E-commerce', 'Healthcare', 'Financial Services',
    'Real Estate', 'Manufacturing', 'Professional Services', 'Education',
    'Technology', 'Telecommunications', 'Other'
  ];

  const handleIndustryChange = (value: string) => {
    updateSettings({ industry: value });
  };
  
  const handleMarketTypeChange = (value: string) => {
    updateSettings({ 
      marketType: value,
      personalization_flags: {
        ...settings.personalization_flags,
        marketTypeSet: true
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">Tell us about your business</h1>
        <p className="text-muted-foreground">
          We'll customize your sales experience based on your industry
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="industry">Your Industry</Label>
          <Select 
            value={settings.industry} 
            onValueChange={handleIndustryChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your industry" />
            </SelectTrigger>
            <SelectContent>
              {industries.map(industry => (
                <SelectItem key={industry} value={industry}>{industry}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {settings.industry === 'Other' && (
          <div>
            <Label htmlFor="customIndustry">Specify your industry</Label>
            <Input
              id="customIndustry"
              placeholder="Enter your industry"
              value={settings.customIndustry || ''}
              onChange={(e) => updateSettings({ customIndustry: e.target.value })}
            />
          </div>
        )}

        <div className="mt-6">
          <Label className="mb-3 block">What type of market do you serve?</Label>
          <RadioGroup 
            value={settings.marketType || 'b2b'} 
            onValueChange={handleMarketTypeChange}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="b2b" id="b2b" />
              <Label htmlFor="b2b" className="cursor-pointer">B2B (Business to Business)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="b2c" id="b2c" />
              <Label htmlFor="b2c" className="cursor-pointer">B2C (Business to Consumer)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="both" id="both" />
              <Label htmlFor="both" className="cursor-pointer">Both B2B and B2C</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
};

export default IndustryStep;
