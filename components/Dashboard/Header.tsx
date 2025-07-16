import React from 'react';
import { Activity, LogOut, User, LogIn } from 'lucide-react';

interface HeaderProps {
  user: { name: string; email: string } | null;
  onLogout: () => void;
  onLoginClick?: () => void;
}

export default function Header({ user, onLogout, onLoginClick }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 rounded-lg p-2">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">BAIMM</h1>
              <p className="text-sm text-gray-600">Medication Demand Forecasting</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                </div>
                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition-colors duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <div className="text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                  Guest Mode - Limited Access
                </div>
                <button
                  onClick={onLoginClick}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}