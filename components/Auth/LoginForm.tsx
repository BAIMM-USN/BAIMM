"use client";
import React, { useState } from 'react';
import { X, User, Lock, Mail, ArrowRight } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string) => void;
  onSignup: (name: string, email: string, password: string) => void;
}

export default function LoginModal({ isOpen, onClose, onLogin, onSignup }: LoginModalProps) {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'login') {
      onLogin(formData.email, formData.password);
    } else {
      onSignup(formData.name, formData.email, formData.password);
    }
    onClose();
    setFormData({ name: '', email: '', password: '' });
  };

  const handleClose = () => {
    onClose();
    setAuthMode('login');
    setFormData({ name: '', email: '', password: '' });
  };

  return (
    <div className="fixed inset-0 bg-opacity-40 backdrop-blur-sm flex items-center justify-center p-4 z-70">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative animate-in fade-in duration-200">
      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="p-8">
        <div className="text-center mb-8">
        <div className="bg-blue-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <User className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
        </h1>
        <p className="text-gray-600">
          {authMode === 'login' 
          ? 'Sign in to access all medication predictions' 
          : 'Join to unlock full access to predictions'
          }
        </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
        {authMode === 'signup' && (
          <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter your full name"
            required
            />
          </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
          </label>
          <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter your email"
            required
          />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
          Password
          </label>
          <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder={authMode === 'login' ? 'Enter your password' : 'Create a password'}
            required
          />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
        >
          {authMode === 'login' ? 'Sign In' : 'Create Account'}
          <ArrowRight className="w-4 h-4" />
        </button>
        </form>

        <div className="mt-6 text-center">
        <p className="text-gray-600">
          {authMode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
          onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
          className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
          >
          {authMode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
        </div>
      </div>
      </div>
    </div>
  );
}