import React from 'react';

const FallbackError: React.FC = () => (
  <div className="p-6 text-center text-red-600">
    <h2 className="text-xl font-bold">Something broke 😬</h2>
    <p>Dashboard failed to load. Try refreshing or contact support.</p>
  </div>
);

export default FallbackError;
