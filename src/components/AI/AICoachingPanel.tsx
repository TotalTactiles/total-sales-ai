
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { GraduationCap, Target, BookOpen, Clock, ChevronRight } from 'lucide-react';
import { aiConfig } from '@/config/ai';

interface CoachingItem {
  id: string;
  type: 'objection_handling' | 'closing_technique' | 'product_knowledge' | 'communication';
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  progress: number;
  priority: 'high' | 'medium' | 'low';
}

interface AICoachingPanelProps {
  className?: string;
}

const AICoachingPanel: React.FC<AICoachingPanelProps> = ({ className = '' }) => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const coachingItems: CoachingItem[] = [
    {
      id: '1',
      type: 'objection_handling',
      title: 'Overcoming Price Objections',
      description: 'Master techniques to handle price concerns and demonstrate value',
      difficulty: 'intermediate',
      estimatedTime: 25,
      progress: 60,
      priority: 'high'
    },
    {
      id: '2',
      type: 'closing_technique',
      title: 'Assumptive Close Mastery',
      description: 'Learn to guide prospects naturally toward commitment',
      difficulty: 'advanced',
      estimatedTime: 35,
      progress: 20,
      priority: 'high'
    },
    {
      id: '3',
      type: 'product_knowledge',
      title: 'Feature-Benefit Mapping',
      description: 'Connect product features to customer pain points effectively',
      difficulty: 'beginner',
      estimatedTime: 15,
      progress: 80,
      priority: 'medium'
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'objection_handling': return Target;
      case 'closing_technique': return GraduationCap;
      case 'product_knowledge': return BookOpen;
      default: return Target;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStartCoaching = (item: CoachingItem) => {
    if (!aiConfig.enabled) {
      console.log(`Demo: Would start coaching session for ${item.title}`);
      return;
    }
    // Real coaching session would be implemented here
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-purple-600" />
          AI Sales Coaching
          {!aiConfig.enabled && (
            <Badge variant="outline" className="text-xs">Demo Mode</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {coachingItems.map((item) => {
            const TypeIcon = getTypeIcon(item.type);
            const isSelected = selectedItem === item.id;
            
            return (
              <div 
                key={item.id} 
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  isSelected ? 'border-purple-300 bg-purple-50' : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedItem(isSelected ? null : item.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <TypeIcon className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{item.title}</h4>
                        <Badge className={getDifficultyColor(item.difficulty)}>
                          {item.difficulty}
                        </Badge>
                        <Badge className={getPriorityColor(item.priority)}>
                          {item.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Progress</span>
                          <span className="font-medium">{item.progress}%</span>
                        </div>
                        <Progress value={item.progress} className="h-2" />
                        
                        <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {item.estimatedTime} min
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartCoaching(item);
                      }}
                    >
                      {item.progress > 0 ? 'Continue' : 'Start'}
                    </Button>
                    <ChevronRight className={`h-4 w-4 transition-transform ${
                      isSelected ? 'rotate-90' : ''
                    }`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default AICoachingPanel;
