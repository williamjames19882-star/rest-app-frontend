import React, { createContext, useContext, useState, useEffect } from 'react';
import { decodeToken } from '../utils/jwt';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userId, setUserId] = useState(localStorage.getItem('userId'));
  const [role, setRole] = useState(localStorage.getItem('role'));
  const [userName, setUserName] = useState(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      const decoded = decodeToken(storedToken);
      return decoded?.name || null;
    }
    return null;
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    if (userId) {
      localStorage.setItem('userId', userId);
    } else {
      localStorage.removeItem('userId');
    }
  }, [userId]);

  useEffect(() => {
    if (role) {
      localStorage.setItem('role', role);
    } else {
      localStorage.removeItem('role');
    }
  }, [role]);

  useEffect(() => {
    if (token) {
      const decoded = decodeToken(token);
      setUserName(decoded?.name || null);
    } else {
      setUserName(null);
    }
  }, [token]);

  const login = (newToken, newUserId, newRole) => {
    setToken(newToken);
    setUserId(newUserId);
    setRole(newRole);
  };

  const logout = () => {
    setToken(null);
    setUserId(null);
    setRole(null);
    setUserName(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
  };

  const isAdmin = role === 'admin';

  const value = {
    token,
    userId,
    role,
    userName,
    isAdmin,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

