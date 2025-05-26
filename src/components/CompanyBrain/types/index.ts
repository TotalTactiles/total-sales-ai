
import React from 'react';

export interface DataSourceCard {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  status: 'connected' | 'disconnected' | 'error';
  itemCount: number;
  lastUpdated: Date | null;
  description: string;
  actionButton: {
    text: string;
    action: () => void;
  };
}
