
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  createUser: (username: string, password: string, role: string) => boolean;
  removeUser: (username: string) => boolean;
  getUsers: () => User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<Array<{username: string, password: string, role: string}>>([
    { username: 'admin', password: 'admin123', role: 'admin' }
  ]);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('haulage_user');
    const savedUsers = localStorage.getItem('haulage_users');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    const foundUser = users.find(
      cred => cred.username === username && cred.password === password
    );

    if (foundUser) {
      const userObj = { id: foundUser.username, username: foundUser.username, role: foundUser.role };
      setUser(userObj);
      localStorage.setItem('haulage_user', JSON.stringify(userObj));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('haulage_user');
  };

  const createUser = (username: string, password: string, role: string): boolean => {
    if (users.find(u => u.username === username)) {
      return false; // User already exists
    }
    
    const newUsers = [...users, { username, password, role }];
    setUsers(newUsers);
    localStorage.setItem('haulage_users', JSON.stringify(newUsers));
    return true;
  };

  const removeUser = (username: string): boolean => {
    if (username === 'admin') {
      return false; // Cannot remove admin
    }
    
    const newUsers = users.filter(u => u.username !== username);
    setUsers(newUsers);
    localStorage.setItem('haulage_users', JSON.stringify(newUsers));
    return true;
  };

  const getUsers = (): User[] => {
    return users.map(u => ({ id: u.username, username: u.username, role: u.role }));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, createUser, removeUser, getUsers }}>
      {children}
    </AuthContext.Provider>
  );
};
