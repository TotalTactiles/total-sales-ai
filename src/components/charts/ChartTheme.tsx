
import React from 'react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

export const chartTheme = {
  colors: {
    primary: '#8B5CF6',
    secondary: '#A855F7',
    accent: '#EC4899',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#3B82F6',
    gradients: [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
    ]
  },
  animations: {
    hover: {
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      transform: 'scale(1.02)',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
    }
  },
  typography: {
    metric: {
      fontSize: '2rem',
      fontWeight: '700',
      lineHeight: '1.2'
    },
    label: {
      fontSize: '0.875rem',
      fontWeight: '500',
      opacity: '0.8'
    }
  }
};

export const ChartWrapper: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <div className={`rounded-xl bg-gradient-to-br from-white to-gray-50 p-4 shadow-sm ${className}`}>
    {children}
  </div>
);

export const MetricCard: React.FC<{
  title: string;
  value: string;
  change?: string;
  icon: React.ReactNode;
  gradient: string;
  onClick?: () => void;
}> = ({ title, value, change, icon, gradient, onClick }) => (
  <div
    onClick={onClick}
    className={`
      relative overflow-hidden rounded-xl p-6 cursor-pointer
      transition-all duration-300 hover:scale-105 hover:shadow-lg
      ${gradient}
    `}
    style={{
      background: gradient
    }}
  >
    <div className="flex items-center justify-between">
      <div className="text-white">
        <p className="text-sm font-medium opacity-90">{title}</p>
        <p className="text-3xl font-bold mt-1">{value}</p>
        {change && (
          <p className="text-sm mt-2 opacity-90">{change}</p>
        )}
      </div>
      <div className="text-white opacity-80">
        {icon}
      </div>
    </div>
  </div>
);
