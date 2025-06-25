import React from 'react';

interface LoadingIndicatorProps {
  message?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-yellow-500 rounded-full animate-spin"></div>
        <div className="w-8 h-8 border-3 border-gray-400 border-t-amber-600 rounded-full animate-spin absolute top-2 left-2" style={{animationDirection: 'reverse', animationDuration: '0.8s'}}></div>
      </div>
      <p className="mt-4 text-gray-300 text-center max-w-md">{message}</p>
    </div>
  );
};
export default LoadingIndicator;