import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useGroupContributions } from '../hooks/useGroups';
import { getUserGroups } from '../services/firestore';
import { formatCurrency, formatDate, getDaysRemaining } from '../utils/formatters';
import AddContribution from '../components/groups/AddContribution';
import ProgressBar from '../components/ui/ProgressBar';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';

const GroupDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { contributions, loading: contributionsLoading, refreshContributions } = useGroupContributions(id);
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const userGroups = await getUserGroups(user.uid);
        const currentGroup = userGroups.find(g => g.id === id);
        
        if (!currentGroup) {
          navigate('/dashboard');
          return;
        }
        
        setGroup(currentGroup);
      } catch (error) {
        console.error('Error fetching group:', error);
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    if (user && id) {
      fetchGroup();
    }
  }, [user, id, navigate]);

  const handleAddSuccess = () => {
    setShowAddModal(false);
    refreshContributions();
  };

  // Calculer les statistiques
  const userContributions = contributions.filter(c => c.userId === user.uid);
  const userTotal = userContributions.reduce((sum, c) => sum + c.amount, 0);
  const daysRemaining = group ? getDaysRemaining(group.targetDate) : null;

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du groupe...</p>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Groupe non trouvé</p>
          <Button onClick={() => navigate('/dashboard')} className="mt-4">
            Retour au dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="container py-6">
        {/* En-tête du groupe */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{group.name}</h1>
              {group.description && (
                <p className="text-gray-600 mt-1">{group.description}</p>
              )}
            </div>
            <Button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2"
            >
              <span>+</span>
              Ajouter
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {formatCurrency(group.targetAmount)}
              </div>
              <div className="text-sm text-gray-600">Objectif par personne</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(userTotal)}
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

          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Votre progression</span>
              <span>{Math.round((userTotal / group.targetAmount) * 100)}%</span>
            </div>
            <ProgressBar current={userTotal} target={group.targetAmount} showLabel={false} />
          </div>

          <div className="text-sm text-gray-600">
            <span className="font-medium">Date limite :</span> {formatDate(group.targetDate)}
          </div>
        </div>

        {/* Contributions par membre */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Contributions des membres</h2>
          
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
                      {userId === user.uid && ' (Vous)'}
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
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Historique des contributions</h2>
          
          {contributionsLoading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto"></div>
            </div>
          ) : contributions.length === 0 ? (
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
                      {contribution.userId === user.uid && ' (Vous)'}
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

        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Ajouter une contribution"
          maxWidth="max-w-md"
        >
          <AddContribution
            groupId={id}
            onSuccess={handleAddSuccess}
            onCancel={() => setShowAddModal(false)}
          />
        </Modal>
      </div>
    </div>
  );
};

export default GroupDetailPage;