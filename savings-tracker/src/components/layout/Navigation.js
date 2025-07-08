import React from 'react';
import { useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/dashboard', label: 'Mes groupes', icon: '🏠' },
    { path: '/profile', label: 'Profil', icon: '👤' }
  ];

  return (
    <nav className="bg-white border-t fixed bottom-0 left-0 right-0 z-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-around">
          {navItems.map((item) => (
            <a
              key={item.path}
              href={item.path}
              className={`flex flex-col items-center py-2 px-4 text-xs ${
                location.pathname === item.path
                  ? 'text-primary-600 font-medium'
                  : 'text-gray-600'
              }`}
            >
              <span className="text-lg mb-1">{item.icon}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;