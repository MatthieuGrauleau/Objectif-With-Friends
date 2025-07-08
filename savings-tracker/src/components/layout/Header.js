import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { logoutUser } from '../../services/auth';
import Button from '../ui/Button';

const Header = () => {
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-primary-600">
              SavingsTracker
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Bonjour, {user?.displayName || user?.email}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
            >
              Déconnexion
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;