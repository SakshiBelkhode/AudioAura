import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('spotify_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const saveUser = (userData) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem('spotify_user', JSON.stringify(userData));
    } else {
      localStorage.removeItem('spotify_user');
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser: saveUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
