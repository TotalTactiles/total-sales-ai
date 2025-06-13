import React from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';

const LoadingScreen: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner className="text-primary" size="lg" />
  </div>
);

export default LoadingScreen;
