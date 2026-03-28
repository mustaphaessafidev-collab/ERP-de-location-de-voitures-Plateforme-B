import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { authService } from '../services/auth';

export default function TestLoggedPage() {
  const navigate = useNavigate();
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 border border-gray-100 text-center">
        
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Logged In!
        </h1>
        
        <p className="text-gray-600 mb-6">
          {user?.nom_complet || 'User'} ... test page.
        </p>

        
        
        <button
          onClick={handleLogout}
          className="flex items-center justify-center w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Log Out
        </button>
      </div>
    </div>
  );
}
