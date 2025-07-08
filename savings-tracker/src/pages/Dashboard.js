import React, { useState } from 'react';
import { useGroups } from '../hooks/useGroups';
import { useAuth } from '../contexts/AuthContext';
import { getGroupContributions } from '../services/firestore';
import GroupCard from '../components/groups/GroupCard';
import CreateGroup from '../components/groups/CreateGroup';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';

const Dashboard = () => {
  const { groups, loading, refreshGroups } = useGroups();
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [userContributions, setUserContributions] = useState({});

  // Calculer les contributions de l'utilisateur pour chaque groupe
  React.useEffect(() => {
    const fetchContributions = async () => {
      const contributions = {};
      
      for (const group of groups) {
        try {
          const groupContributions = await getGroupContributions(group.id);
          const userTotal = groupContributions
            .filter(contrib => contrib.userId === user.uid)
            .reduce((sum, contrib) => sum + contrib.amount, 0);
          contributions[group.id] = userTotal;
        } catch (error) {
          console.error('Error fetching contributions for group:', group.id, error);
          contributions[group.id] = 0;
        }
      }
      
      setUserContributions(contributions);
    };

    if (groups.length > 0) {
      fetchContributions();
    }
  }, [groups, user.uid]);

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    refreshGroups();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de vos groupes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mes groupes</h1>
            <p className="text-gray-600">Gérez vos objectifs financiers entre amis</p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2"
          >
            <span>+</span>
            Créer un groupe
          </Button>
        </div>

        {groups.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Aucun groupe pour le moment
            </h2>
            <p className="text-gray-600 mb-6">
              Créez votre premier groupe pour commencer à épargner avec vos amis
            </p>
            <Button
              onClick={() => setShowCreateModal(true)}
              size="lg"
            >
              Créer mon premier groupe
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {groups.map((group) => (
              <GroupCard
                key={group.id}
                group={group}
                userContributions={userContributions[group.id] || 0}
              />
            ))}
          </div>
        )}

        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Créer un nouveau groupe"
          maxWidth="max-w-lg"
        >
          <CreateGroup
            onSuccess={handleCreateSuccess}
            onCancel={() => setShowCreateModal(false)}
          />
        </Modal>
      </div>
    </div>
  );
};

export default Dashboard;