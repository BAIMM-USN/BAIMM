"use client";
import { useState, useEffect } from 'react';

interface User {
  name: string;
  email: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (email: string, password: string) => {
    // Simulate login - in real app, you'd validate credentials
    const userData = {
      name: email.split('@')[0],
      email: email
    };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const signup = (name: string, email: string, password: string) => {
    // Simulate signup - in real app, you'd create account
    const userData = {
      name: name,
      email: email
    };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return {
    user,
    isLoading,
    login,
    signup,
    logout,
    isAuthenticated: !!user
  };
};