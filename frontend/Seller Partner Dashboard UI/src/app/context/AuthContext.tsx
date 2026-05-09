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
    // Pretend to check for a session/token
    const savedId = localStorage.getItem('sellerId');
    const savedUser = localStorage.getItem('user');
    
    if (savedId) {
      setSellerId(parseInt(savedId));
      setUser(savedUser ? JSON.parse(savedUser) : null);
    } else {
      // Default to 2 for now so it doesn't break, but it's now managed here
      setSellerId(2);
      localStorage.setItem('sellerId', '2');
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
