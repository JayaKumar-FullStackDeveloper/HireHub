import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Get user from localStorage and set it in state
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('User');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (userData, token) => {
    localStorage.setItem('Token', token);
    localStorage.setItem('User', JSON.stringify(userData));
    setUser(userData); // Set user state
  };

  const logout = () => {
    localStorage.removeItem('Token');
    localStorage.removeItem('User');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
