import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [userId, setUserId] = useState(() => localStorage.getItem('userId') || '');
  const [user, setUser] = useState(() => {
    const existing = localStorage.getItem('token');
    if (!existing) return null;
    try {
      const payload = JSON.parse(atob(existing.split('.')[1]));
      return { id: localStorage.getItem('userId') || '', email: payload?.email, role: payload?.role };
    } catch (_) {
      return { id: localStorage.getItem('userId') || '' };
    }
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

  const login = (newToken, newUserId) => {
    setToken(newToken || '');
    setUserId(newUserId || '');
    if (newToken) {
      try {
        const payload = JSON.parse(atob(newToken.split('.')[1]));
        setUser({ id: newUserId || '', email: payload?.email, role: payload?.role });
      } catch {
        setUser({ id: newUserId || '' });
      }
    }
  };

  const logout = () => {
    setToken('');
    setUserId('');
    setUser(null);
  };

  const value = useMemo(() => ({
    token,
    userId,
    user,
    isLoggedIn: !!token,
    isAdmin: !!user && user.role === 'admin' && user.email === 'cantonstore@gmail.com',
    login,
    logout,
  }), [token, userId, user]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


