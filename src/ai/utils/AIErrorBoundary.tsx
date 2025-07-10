
// AI Error Boundary Component
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logger } from '@/utils/logger';
import { AI_CONFIG } from '../config/AIConfig';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  feature?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class AIErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('AI Error Boundary caught an error', {
      error: error.message,
      errorInfo,
      feature: this.props.feature
    });
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            <span className="text-sm font-medium text-yellow-800">
              {AI_CONFIG.DISABLED_MESSAGES.SUGGESTIONS}
            </span>
          </div>
          <p className="text-xs text-yellow-600 mt-1">
            Feature temporarily unavailable
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
