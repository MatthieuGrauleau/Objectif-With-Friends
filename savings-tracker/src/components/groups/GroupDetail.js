import React from 'react';
import { formatCurrency, formatDate, getDaysRemaining } from '../../utils/formatters';
import ProgressBar from '../ui/ProgressBar';

const GroupDetail = ({ group, contributions, userContributions }) => {
  const daysRemaining = getDaysRemaining(group.targetDate);
  
  // Calculer les contributions par utilisateur
  const contributionsByUser = contributions.reduce((acc, contribution) => {
    if (!acc[contribution.userId]) {
      acc[contribution.userId] = {
        userName: contribution.userName,
        total: 0,
        contributions: []
      };
    }
    acc[contribution.userId].total += contribution.amount;
    acc[contribution.userId].contributions.push(contribution);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Informations du groupe */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{group.name}</h2>
        
        {group.description && (
          <p className="text-gray-600 mb-4">{group.description}</p>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">
              {formatCurrency(group.targetAmount)}
            </div>
            <div className="text-sm text-gray-600">Objectif par personne</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(userContributions)}
            </div>
            <div className="text-sm text-gray-600">Votre progression</div>
          </div>
          
          <div className="text-center">
            <div className={`text-2xl font-bold ${daysRemaining && daysRemaining < 30 ? 'text-red-600' : 'text-gray-900'}`}>
              {daysRemaining !== null ? (daysRemaining > 0 ? `${daysRemaining} jours` : 'Expiré') : 'N/A'}
            </div>
            <div className="text-sm text-gray-600">Temps restant</div>
          </div>
        </div>
        
        <div className="mt-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Votre progression</span>
            <span>{Math.round((userContributions / group.targetAmount) * 100)}%</span>
          </div>
          <ProgressBar 
            current={userContributions} 
            target={group.targetAmount} 
            showLabel={false}
          />
        </div>
        
        <div className="mt-4 text-sm text-gray-600">
          <span className="font-medium">Date limite :</span> {formatDate(group.targetDate)}
        </div>
      </div>

      {/* Contributions des membres */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Contributions des membres
        </h3>
        
        {Object.keys(contributionsByUser).length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">💰</div>
            <p className="text-gray-600">Aucune contribution pour le moment</p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(contributionsByUser).map(([userId, userData]) => (
              <div key={userId} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-900">
                    {userData.userName}
                  </span>
                  <span className="text-lg font-semibold text-primary-600">
                    {formatCurrency(userData.total)}
                  </span>
                </div>
                <div className="mb-2">
                  <ProgressBar 
                    current={userData.total} 
                    target={group.targetAmount} 
                    showLabel={false}
                  />
                </div>
                <div className="text-sm text-gray-600">
                  {Math.round((userData.total / group.targetAmount) * 100)}% de l'objectif
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Historique des contributions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Historique des contributions
        </h3>
        
        {contributions.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">📝</div>
            <p className="text-gray-600">Aucune contribution enregistrée</p>
          </div>
        ) : (
          <div className="space-y-3">
            {contributions.map((contribution) => (
              <div key={contribution.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">
                    {contribution.userName}
                  </div>
                  {contribution.description && (
                    <div className="text-sm text-gray-600">{contribution.description}</div>
                  )}
                  <div className="text-xs text-gray-500">
                    {formatDate(contribution.createdAt)}
                  </div>
                </div>
                <div className="text-lg font-semibold text-green-600">
                  +{formatCurrency(contribution.amount)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupDetail;