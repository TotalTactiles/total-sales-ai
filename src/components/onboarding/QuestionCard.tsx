
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface AIConfig {
  name: string;
  tone: string;
  conversation_style?: string;
  command_style?: string;
  voice_style: string;
}

interface QuestionCardProps {
  question: {
    id: string;
    type: 'select' | 'input' | 'ai-config';
    label: string;
    options?: string[];
    allowCustomInput?: boolean;
    fields?: string[];
  };
  value: any;
  onChange: (value: any) => void;
  onNext: () => void;
  onPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
  isLoading?: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  value,
  onChange,
  onNext,
  onPrev,
  isFirst,
  isLast,
  isLoading
}) => {
  const [customInput, setCustomInput] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [aiConfig, setAiConfig] = useState<AIConfig>(
    value || { name: 'Assistant', tone: 'professional', voice_style: 'friendly' }
  );

  const handleSelectChange = (selectedValue: string) => {
    if (selectedValue === 'Other' && question.allowCustomInput) {
      setShowCustomInput(true);
    } else {
      onChange(selectedValue);
      setShowCustomInput(false);
    }
  };

  const handleCustomInputSubmit = () => {
    if (customInput.trim()) {
      onChange(customInput.trim());
      setShowCustomInput(false);
    }
  };

  const handleAIConfigChange = (field: string, value: string) => {
    const newConfig = { ...aiConfig, [field]: value };
    setAiConfig(newConfig);
    onChange(newConfig);
  };

  const canProceed = () => {
    if (question.type === 'input') return value && value.trim() !== '';
    if (question.type === 'select') return value !== '' && value !== undefined;
    if (question.type === 'ai-config') return aiConfig.name && aiConfig.tone && aiConfig.voice_style;
    return true;
  };

  const renderInput = () => {
    switch (question.type) {
      case 'select':
        return (
          <div className="space-y-4">
            <Select value={value || ''} onValueChange={handleSelectChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {question.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {showCustomInput && (
              <div className="space-y-2">
                <Input
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="Enter your custom option"
                />
                <Button onClick={handleCustomInputSubmit} size="sm">
                  Add Custom Option
                </Button>
              </div>
            )}
          </div>
        );

      case 'input':
        return (
          <Textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Type your answer here..."
            className="min-h-[100px]"
          />
        );

      case 'ai-config':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="ai-name">Assistant Name</Label>
              <Input
                id="ai-name"
                value={aiConfig.name}
                onChange={(e) => handleAIConfigChange('name', e.target.value)}
                placeholder="e.g., Nova, Alex, Assistant"
              />
            </div>
            
            <div>
              <Label htmlFor="ai-tone">Tone</Label>
              <Select value={aiConfig.tone} onValueChange={(val) => handleAIConfigChange('tone', val)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                  <SelectItem value="direct">Direct</SelectItem>
                  <SelectItem value="supportive">Supportive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {question.fields?.includes('conversation_style') && (
              <div>
                <Label htmlFor="conversation-style">Conversation Style</Label>
                <Select 
                  value={aiConfig.conversation_style || ''} 
                  onValueChange={(val) => handleAIConfigChange('conversation_style', val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="coach">Coach</SelectItem>
                    <SelectItem value="mentor">Mentor</SelectItem>
                    <SelectItem value="partner">Partner</SelectItem>
                    <SelectItem value="advisor">Advisor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {question.fields?.includes('command_style') && (
              <div>
                <Label htmlFor="command-style">Command Style</Label>
                <Select 
                  value={aiConfig.command_style || ''} 
                  onValueChange={(val) => handleAIConfigChange('command_style', val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select command style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="authoritative">Authoritative</SelectItem>
                    <SelectItem value="collaborative">Collaborative</SelectItem>
                    <SelectItem value="strategic">Strategic</SelectItem>
                    <SelectItem value="analytical">Analytical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label htmlFor="voice-style">Voice Style</Label>
              <Select value={aiConfig.voice_style} onValueChange={(val) => handleAIConfigChange('voice_style', val)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="energetic">Energetic</SelectItem>
                  <SelectItem value="calm">Calm</SelectItem>
                  <SelectItem value="motivational">Motivational</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">{question.label}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {renderInput()}
        
        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={onPrev}
            disabled={isFirst}
          >
            Previous
          </Button>
          
          <Button
            onClick={onNext}
            disabled={!canProceed() || isLoading}
          >
            {isLast ? (isLoading ? 'Launching...' : 'Launch OS') : 'Next'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
