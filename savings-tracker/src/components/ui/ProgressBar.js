import React from 'react';

const ProgressBar = ({ current, target, showLabel = true, className = '' }) => {
  const percentage = Math.min((current / target) * 100, 100);
  
  const getProgressColor = () => {
    if (percentage >= 100) return 'bg-success-500';
    if (percentage >= 75) return 'bg-primary-500';
    if (percentage >= 50) return 'bg-warning-500';
    return 'bg-gray-400';
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between text-sm text-gray-600 mt-1">
          <span>{current}€</span>
          <span>{Math.round(percentage)}%</span>
          <span>{target}€</span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;