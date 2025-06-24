
import React from 'react';

interface LoadingIndicatorProps {
  message?: string;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 my-8 bg-slate-800/50 rounded-lg shadow-xl border border-slate-700/50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-500" aria-hidden="true"></div>
      <p className="mt-4 text-lg text-slate-300 tracking-wide" role="status" aria-live="polite">
        {message}
      </p>
    </div>
  );
};