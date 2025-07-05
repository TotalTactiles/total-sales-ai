
import React from 'react';
import { Card } from '@/components/ui/card';
import { 
  FileText, 
  Bot, 
  Upload, 
  RefreshCw, 
  Loader2,
  Brain,
  BarChart3,
  Database
} from 'lucide-react';

interface LoadingOverlayProps {
  isVisible: boolean;
  type: 'report' | 'ai' | 'upload' | 'sync' | 'brain' | 'analytics' | 'database' | 'default';
  message?: string;
  progress?: number;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  isVisible, 
  type, 
  message,
  progress 
}) => {
  if (!isVisible) return null;

  const getLoadingContent = () => {
    switch (type) {
      case 'report':
        return {
          icon: <FileText className="h-12 w-12 text-blue-500" />,
          title: 'Generating Report',
          description: message || 'AI is analyzing data and creating your report...',
          animation: 'animate-bounce'
        };
      case 'ai':
      case 'brain':
        return {
          icon: <Brain className="h-12 w-12 text-purple-500" />,
          title: 'TSAM Brain Processing',
          description: message || 'AI assistant is thinking...',
          animation: 'animate-pulse'
        };
      case 'upload':
        return {
          icon: <Upload className="h-12 w-12 text-green-500" />,
          title: 'Uploading Files',
          description: message || 'Files are being uploaded to the cloud...',
          animation: 'animate-bounce'
        };
      case 'sync':
        return {
          icon: <RefreshCw className="h-12 w-12 text-orange-500" />,
          title: 'Syncing Data',
          description: message || 'Synchronizing with backend systems...',
          animation: 'animate-spin'
        };
      case 'analytics':
        return {
          icon: <BarChart3 className="h-12 w-12 text-cyan-500" />,
          title: 'Processing Analytics',
          description: message || 'Crunching numbers and generating insights...',
          animation: 'animate-pulse'
        };
      case 'database':
        return {
          icon: <Database className="h-12 w-12 text-indigo-500" />,
          title: 'Database Operation',
          description: message || 'Updating database records...',
          animation: 'animate-bounce'
        };
      default:
        return {
          icon: <Loader2 className="h-12 w-12 text-blue-500" />,
          title: 'Loading',
          description: message || 'Please wait...',
          animation: 'animate-spin'
        };
    }
  };

  const content = getLoadingContent();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <Card className="p-8 max-w-md mx-4 text-center bg-background/95 backdrop-blur">
        <div className="flex flex-col items-center space-y-6">
          <div className={content.animation}>
            {content.icon}
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-foreground">{content.title}</h3>
            <p className="text-sm text-muted-foreground">{content.description}</p>
          </div>
          {progress !== undefined && (
            <div className="w-full space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
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
    </div>
  );
};

export default LoadingOverlay;
