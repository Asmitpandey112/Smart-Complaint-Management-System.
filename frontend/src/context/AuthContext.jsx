import React, { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

const DEFAULT_USERS = {
  user: {
    name: 'Asmit Kumar',
    role: 'user',
    email: 'asmit@gmail.com',
    roleLabel: 'Citizen / Applicant',
    department: 'General Citizen',
  },
  admin: {
    name: 'Chief Officer Admin',
    role: 'admin',
    email: 'admin.scms@gov.in',
    roleLabel: 'Municipal Commissioner / Admin',
    department: 'Central Municipal Council',
  },
  staff: {
    name: 'Officer Rohit Sharma',
    role: 'staff',
    email: 'rohit.sharma@pwd.gov.in',
    roleLabel: 'Field Engineer / Staff',
    department: 'Public Works & Electrical',
  },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('scms_auth_user');
      return saved ? JSON.parse(saved) : DEFAULT_USERS.user;
    } catch {
      return DEFAULT_USERS.user;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('scms_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('scms_auth_user');
    }
  }, [user]);

  const login = (name, role, email = '') => {
    const defaultData = DEFAULT_USERS[role] || DEFAULT_USERS.user;
    const userData = {
      name: name || defaultData.name,
      role: role || 'user',
      email: email || defaultData.email,
      roleLabel: defaultData.roleLabel,
      department: defaultData.department,
    };
    setUser(userData);
    return userData;
  };

  const switchRole = (newRole) => {
    if (DEFAULT_USERS[newRole]) {
      setUser(DEFAULT_USERS[newRole]);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, switchRole, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
