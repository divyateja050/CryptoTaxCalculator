import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

interface AuthContextType {
  authToken: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = "http://127.0.0.1:8000/api/auth/token/";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authToken, setAuthToken] = useState<string | null>(() => localStorage.getItem('authToken'));
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // This effect handles the initial authentication check when the app loads
  useEffect(() => {
    if (authToken) {
      // If user is logged in and tries to access login page, redirect to dashboard
      if (location.pathname === '/login') {
        navigate('/dashboard');
      }
    } else {
      // If user is not logged in and is not on the login page, force them to login
      if (location.pathname !== '/login') {
        navigate('/login');
      }
    }
  }, [authToken, location.pathname, navigate]);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post(API_URL, { username, password });
      if (response.data.token) {
        const token = response.data.token;
        localStorage.setItem('authToken', token);
        setAuthToken(token); // This state update will trigger the useEffect above to navigate
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw new Error('Invalid username or password.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setAuthToken(null); // This state update will trigger the useEffect to navigate to login
  };

  const value = { authToken, login, logout, isLoading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

