import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('lifepath_token'));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('lifepath_user');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem('lifepath_token', token);
    } else {
      localStorage.removeItem('lifepath_token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('lifepath_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('lifepath_user');
    }
  }, [user]);

  const login = (nextToken, nextUser) => {
    setToken(nextToken);
    setUser(nextUser);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated: Boolean(token), login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}