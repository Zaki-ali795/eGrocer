import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  sellerId: number | null;
  user: any | null;
  login: (id: number, userData: any) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sellerId, setSellerId] = useState<number | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedId = localStorage.getItem('sellerId');
    const savedUser = localStorage.getItem('user');
    const urlParams = new URLSearchParams(window.location.search);
    const urlId = urlParams.get('sellerId');
    const urlToken = urlParams.get('token');
    
    if (urlId) {
      const newId = parseInt(urlId);
      setSellerId(newId);
      localStorage.setItem('sellerId', urlId);
      if (urlToken) localStorage.setItem('token', urlToken);
      // Also clear old user data to force a re-fetch of the new profile
      localStorage.removeItem('user');
      setUser(null);
      window.history.replaceState({}, '', window.location.pathname);
    } else if (savedId) {
      setSellerId(parseInt(savedId));
      setUser(savedUser ? JSON.parse(savedUser) : null);
    }
    setIsLoading(false);
  }, []);

  const login = (id: number, userData: any) => {
    setSellerId(id);
    setUser(userData);
    localStorage.setItem('sellerId', id.toString());
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setSellerId(null);
    setUser(null);
    localStorage.removeItem('sellerId');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ sellerId, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
