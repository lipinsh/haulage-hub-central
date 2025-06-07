
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Truck, LogOut, Users } from 'lucide-react';

interface SimpleLayoutProps {
  children: React.ReactNode;
}

export const SimpleLayout: React.FC<SimpleLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-slate-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Truck className="h-8 w-8 text-lime-500" />
            <h1 className="text-xl font-bold text-black">Messages Generator</h1>
          </div>
          <div className="flex items-center space-x-4">
            {user?.role === 'admin' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/users')}
                className="text-white border-white hover:bg-white hover:text-slate-900"
              >
                <Users className="h-4 w-4 mr-2" />
                Manage Users
              </Button>
            )}
            <span className="text-sm">Welcome, {user?.username}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="text-white border-white hover:bg-white hover:text-slate-900"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {children}
      </main>
    </div>
  );
};
