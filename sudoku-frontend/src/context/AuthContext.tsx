// src/context/AuthContext.tsx

import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  userId: number | null;
  token: string | null;
  login: (token: string, userId: number) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  userId: null,
  token: null,
  login: () => {},
  logout: () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userId, setUserId] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));

  const login = (token: string, userId: number) => {
    localStorage.setItem('token', token);
    setToken(token);
    setUserId(userId);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUserId(null);
  };

  return (
    <AuthContext.Provider value={{ userId, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);