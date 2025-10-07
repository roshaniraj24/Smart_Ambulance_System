import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, signup as apiSignup, forgotPassword as apiForgotPassword } from '../services/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('authToken');
    if (storedUser && token) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password, role) => {
    setLoading(true);
    try {
      // Use mock API (window.fetch is overridden in mockApi.js)
      const response = await window.fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username, password, role })
      });
      const data = await response.json();

      if (data?.success) {
        const normalizedUser = {
          id: data.user?.id,
          name: data.user?.fullName || [data.user?.firstName, data.user?.lastName].filter(Boolean).join(' ') || data.user?.username || username,
          email: data.user?.email || username,
          role: data.user?.role || role,
          permissions: data.user?.permissions || []
        };

        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(normalizedUser));
        setUser(normalizedUser);
        setLoading(false);
        return { success: true, user: normalizedUser };
      }

      setLoading(false);
      return { success: false, error: data?.error || 'Login failed. Please try again.' };
    } catch (error) {
      setLoading(false);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const signup = async (userData) => {
    setLoading(true);
    try {
      const result = await apiSignup(userData);
      setLoading(false);
      return result;
    } catch (error) {
      setLoading(false);
      return { success: false, error: 'Signup failed. Please try again.' };
    }
  };

  const forgotPassword = async (identifier) => {
    setLoading(true);
    try {
      const result = await apiForgotPassword(identifier);
      setLoading(false);
      return result;
    } catch (error) {
      setLoading(false);
      return { success: false, error: 'Forgot password failed. Please try again.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
  };

  const updateUser = (userData) => {
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const isAuthenticated = () => {
    return user !== null;
  };

  const hasRole = (role) => {
    return user && user.role === role;
  };

  const hasPermission = (permission) => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    return user.permissions && user.permissions.includes(permission);
  };

  const value = {
    user,
    loading,
    login,
    signup,
    forgotPassword,
    logout,
    updateUser,
    isAuthenticated,
    hasRole,
    hasPermission,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
