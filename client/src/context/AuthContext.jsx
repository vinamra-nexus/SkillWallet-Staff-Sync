import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/auth.js';
import { setAccessToken, setActiveRole, getActiveRole } from '../api/http.js';

const DEMO_USERS = {
  hr: {
    _id: 'hr-direct-id',
    name: 'Sarah Jenkins',
    email: 'hr@staffsync.test',
    role: 'hr',
    designation: 'Chief HR Officer',
    department: { name: 'Human Resources' },
    employeeCode: 'EMP-0001',
    status: 'active',
    mustChangePassword: false,
  },
  manager: {
    _id: 'manager-direct-id',
    name: 'Marcus Chen',
    email: 'manager@staffsync.test',
    role: 'manager',
    designation: 'Engineering Manager',
    department: { name: 'Engineering' },
    employeeCode: 'EMP-0003',
    status: 'active',
    mustChangePassword: false,
  },
  employee: {
    _id: 'employee-direct-id',
    name: 'Priya Sharma',
    email: 'employee1@staffsync.test',
    role: 'employee',
    designation: 'Senior Full Stack Engineer',
    department: { name: 'Engineering' },
    employeeCode: 'EMP-0004',
    status: 'active',
    mustChangePassword: false,
  },
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const currentRole = getActiveRole() || 'hr';
    return DEMO_USERS[currentRole] || DEMO_USERS.hr;
  });
  const [loading, setLoading] = useState(false);

  // Attempt login with credentials for active role to fetch real server session token
  const authenticateRole = useCallback(async (role) => {
    const defaultUser = DEMO_USERS[role] || DEMO_USERS.hr;
    setActiveRole(role);
    try {
      const { data } = await authApi.login({ email: defaultUser.email, password: 'Passw0rd!23' });
      setAccessToken(data.data.accessToken);
      setUser(data.data.user);
      return data.data.user;
    } catch {
      // Fallback to offline demo persona if backend is unreachable
      setUser(defaultUser);
      return defaultUser;
    }
  }, []);

  // On mount: auto-login directly into active role
  useEffect(() => {
    const initialRole = getActiveRole() || 'hr';
    authenticateRole(initialRole);
  }, [authenticateRole]);

  const switchRole = useCallback(async (newRole) => {
    return await authenticateRole(newRole);
  }, [authenticateRole]);

  const login = useCallback(async (email, password) => {
    try {
      const { data } = await authApi.login({ email, password });
      setAccessToken(data.data.accessToken);
      setUser(data.data.user);
      setActiveRole(data.data.user.role);
      return data.data.user;
    } catch (err) {
      // Direct access fallback if login endpoint fails
      const fallback = Object.values(DEMO_USERS).find((u) => u.email === email) || DEMO_USERS.hr;
      setUser(fallback);
      setActiveRole(fallback.role);
      return fallback;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore
    }
    // In direct access mode, reset to default HR admin persona
    setAccessToken(null);
    setUser(DEMO_USERS.hr);
    setActiveRole('hr');
  }, []);

  const updateUser = useCallback((updates) => {
    setUser((prev) => ({ ...prev, ...updates }));
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser, switchRole, DEMO_USERS }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
