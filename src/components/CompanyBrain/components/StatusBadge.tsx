
import React from 'react';

interface StatusBadgeProps {
  status: 'connected' | 'disconnected' | 'error';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusConfig = {
    connected: { color: 'bg-green-500', text: 'Connected' },
    disconnected: { color: 'bg-gray-400', text: 'Disconnected' },
    error: { color: 'bg-red-500', text: 'Error' }
  };
  
  const config = statusConfig[status];
  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${config.color}`} />
      <span className="text-xs text-slate-600">{config.text}</span>
    </div>
  );
};
