import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency, formatDate, getDaysRemaining } from '../../utils/formatters';
import ProgressBar from '../ui/ProgressBar';

const GroupCard = ({ group, userContributions = 0 }) => {
  const navigate = useNavigate();
  const daysRemaining = getDaysRemaining(group.targetDate);

  const handleClick = () => {
    navigate(`/group/${group.id}`);
  };

  return (
    <div 
      onClick={handleClick}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900">{group.name}</h3>
        <span className="text-sm text-gray-500">
          {group.members?.length || 0} membre(s)
        </span>
      </div>
      
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Votre progression</span>
            <span>{formatCurrency(userContributions)} / {formatCurrency(group.targetAmount)}</span>
          </div>
          <ProgressBar 
            current={userContributions} 
            target={group.targetAmount}
            showLabel={false}
          />
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Date limite:</span>
          <span className="font-medium">{formatDate(group.targetDate)}</span>
        </div>
        
        {daysRemaining !== null && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Temps restant:</span>
            <span className={`font-medium ${daysRemaining < 30 ? 'text-red-500' : 'text-green-500'}`}>
              {daysRemaining > 0 ? `${daysRemaining} jour(s)` : 'Expiré'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupCard;