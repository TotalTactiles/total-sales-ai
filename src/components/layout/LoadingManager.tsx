
import React from 'react';
import { Card } from '@/components/ui/card';
import { Loader2, FileText, Bot, Upload, RefreshCw } from 'lucide-react';
import { useOptimizedPerformance } from '@/hooks/useOptimizedPerformance';

interface LoadingManagerProps {
  type: 'report' | 'ai' | 'upload' | 'sync' | 'default';
  message?: string;
  progress?: number;
  className?: string;
}

const LoadingManager: React.FC<LoadingManagerProps> = ({ 
  type = 'default', 
  message, 
  progress,
  className = ''
}) => {
  const { isSlowDevice } = useOptimizedPerformance();

  const getLoadingContent = () => {
    switch (type) {
      case 'report':
        return {
          icon: <FileText className="h-8 w-8 text-blue-500 animate-pulse" />,
          title: 'Generating Report',
          description: message || 'AI is analyzing data and creating your report...',
          animation: isSlowDevice ? '' : 'animate-bounce'
        };
      case 'ai':
        return {
          icon: <Bot className="h-8 w-8 text-purple-500 animate-pulse" />,
          title: 'TSAM Brain Processing',
          description: message || 'AI assistant is thinking...',
          animation: isSlowDevice ? '' : 'animate-pulse'
        };
      case 'upload':
        return {
          icon: <Upload className="h-8 w-8 text-green-500 animate-bounce" />,
          title: 'Uploading Files',
          description: message || 'Files are being uploaded to the cloud...',
          animation: isSlowDevice ? '' : 'animate-bounce'
        };
      case 'sync':
        return {
          icon: <RefreshCw className="h-8 w-8 text-orange-500 animate-spin" />,
          title: 'Syncing Data',
          description: message || 'Synchronizing with backend systems...',
          animation: isSlowDevice ? '' : 'animate-spin'
        };
      default:
        return {
          icon: <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />,
          title: 'Loading',
          description: message || 'Please wait...',
          animation: isSlowDevice ? '' : 'animate-spin'
        };
    }
  };

  const content = getLoadingContent();

  return (
    <Card className={`p-6 text-center ${className}`}>
      <div className="flex flex-col items-center space-y-4">
        <div className={content.animation}>
          {content.icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">{content.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{content.description}</p>
        </div>
        {progress !== undefined && (
          <div className="w-full max-w-xs">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default LoadingManager;
