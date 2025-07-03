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
const AICoachingPanel: React.FC<AICoachingPanelProps> = ({
  className = ''
}) => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const coachingItems: CoachingItem[] = [{
    id: '1',
    type: 'objection_handling',
    title: 'Overcoming Price Objections',
    description: 'Master techniques to handle price concerns and demonstrate value',
    difficulty: 'intermediate',
    estimatedTime: 25,
    progress: 60,
    priority: 'high'
  }, {
    id: '2',
    type: 'closing_technique',
    title: 'Assumptive Close Mastery',
    description: 'Learn to guide prospects naturally toward commitment',
    difficulty: 'advanced',
    estimatedTime: 35,
    progress: 20,
    priority: 'high'
  }, {
    id: '3',
    type: 'product_knowledge',
    title: 'Feature-Benefit Mapping',
    description: 'Connect product features to customer pain points effectively',
    difficulty: 'beginner',
    estimatedTime: 15,
    progress: 80,
    priority: 'medium'
  }];
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'objection_handling':
        return Target;
      case 'closing_technique':
        return GraduationCap;
      case 'product_knowledge':
        return BookOpen;
      default:
        return Target;
    }
  };
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const handleStartCoaching = (item: CoachingItem) => {
    if (!aiConfig.enabled) {
      console.log(`Demo: Would start coaching session for ${item.title}`);
      return;
    }
    // Real coaching session would be implemented here
  };
  return;
};
export default AICoachingPanel;