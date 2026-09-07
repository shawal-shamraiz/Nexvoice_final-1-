import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Profile } from '../types';
import { AdminService } from '../services/adminService';

interface AdminAuthContextType {
  admin: Profile | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  refreshAdminProfile: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshAdminProfile = async () => {
    try {
      const profile = await AdminService.getCurrentAdminProfile();
      setAdmin(profile);
    } catch {
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAdminProfile();
  }, []);

  const signIn = async (email: string, pass: string) => {
    const { profile, error } = await AdminService.signIn(email, pass);
    if (error || !profile) {
      return { success: false, error: error?.message || 'Failed to authenticate admin' };
    }
    setAdmin(profile);
    return { success: true };
  };

  const signOut = async () => {
    await AdminService.signOut();
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider value={{ admin, loading, signIn, signOut, refreshAdminProfile }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
