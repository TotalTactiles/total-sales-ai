
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Star, 
  Clock, 
  CheckCircle, 
  Bookmark, 
  Play, 
  FileText, 
  Video, 
  Mic, 
  BookOpen,
  Lightbulb,
  TrendingUp
} from 'lucide-react';

export interface ContentItem {
  id: string;
  title: string;
  type: 'video' | 'document' | 'audio' | 'guide' | 'script';
  category: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  completed: boolean;
  bookmarked: boolean;
  rating: number;
  views: number;
  description: string;
  tags: string[];
  aiRecommended?: boolean;
  trending?: boolean;
  addedRecently?: boolean;
}

interface ContentCardProps {
  item: ContentItem;
  onContentClick: (item: ContentItem) => void;
  onToggleBookmark: (itemId: string) => void;
  onMarkComplete: (itemId: string) => void;
}

const ContentCard: React.FC<ContentCardProps> = ({
  item,
  onContentClick,
  onToggleBookmark,
  onMarkComplete
}) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'document': return <FileText className="h-4 w-4" />;
      case 'audio': return <Mic className="h-4 w-4" />;
      case 'guide': return <BookOpen className="h-4 w-4" />;
      case 'script': return <FileText className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card 
      className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
      onClick={() => onContentClick(item)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {getTypeIcon(item.type)}
            <span className="text-sm text-slate-600 capitalize">{item.type}</span>
            {item.aiRecommended && (
              <Badge className="bg-purple-100 text-purple-700">
                <Lightbulb className="h-3 w-3 mr-1" />
                AI Pick
              </Badge>
            )}
            {item.trending && (
              <Badge className="bg-orange-100 text-orange-700">
                <TrendingUp className="h-3 w-3 mr-1" />
                Trending
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onToggleBookmark(item.id);
              }}
              className="p-1 h-auto"
            >
              <Bookmark className={`h-4 w-4 ${item.bookmarked ? 'fill-yellow-400 text-yellow-400' : 'text-slate-400'}`} />
            </Button>
            {item.completed && (
              <CheckCircle className="h-4 w-4 text-green-500" />
            )}
          </div>
        </div>
        <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
          {item.title}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-slate-600 mb-4">{item.description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-400" />
            <span className="text-sm text-slate-600">{item.duration}</span>
          </div>
          <Badge className={getDifficultyColor(item.difficulty)}>
            {item.difficulty}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm text-slate-600">{item.rating}</span>
            <span className="text-xs text-slate-500">({item.views} views)</span>
          </div>
          
          {!item.completed ? (
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onMarkComplete(item.id);
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Play className="h-4 w-4 mr-1" />
              Start
            </Button>
          ) : (
            <Button variant="outline" size="sm">
              <CheckCircle className="h-4 w-4 mr-1" />
              Review
            </Button>
          )}
        </div>
        
        <div className="flex flex-wrap gap-1 mt-3">
          {item.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentCard;
