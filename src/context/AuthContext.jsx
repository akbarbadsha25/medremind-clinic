import { createContext, useContext, useState } from 'react';

const USERS = [
  {
    id: 1,
    name: 'Dr. Arjun Mehta',
    email: 'dr.arjun@mehtaaesthetics.com',
    password: 'doctor123',
    role: 'doctor',
    initials: 'AM',
  },
  {
    id: 2,
    name: 'Priya Nair',
    email: 'reception@mehtaaesthetics.com',
    password: 'staff123',
    role: 'receptionist',
    initials: 'PN',
  },
];

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('medremind_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  function login(email, password) {
    const user = USERS.find(u => u.email === email && u.password === password);
    if (user) {
      const { password: _, ...safeUser } = user;
      setCurrentUser(safeUser);
      localStorage.setItem('medremind_user', JSON.stringify(safeUser));
      return true;
    }
    return false;
  }

  function logout() {
    setCurrentUser(null);
    localStorage.removeItem('medremind_user');
  }

  const isDoctor = currentUser?.role === 'doctor';
  const isReceptionist = currentUser?.role === 'receptionist';

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isDoctor, isReceptionist }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
