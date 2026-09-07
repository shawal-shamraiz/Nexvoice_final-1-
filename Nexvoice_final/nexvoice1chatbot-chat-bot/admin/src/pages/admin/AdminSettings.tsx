import React, { useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { AdminService } from '../../services/adminService';
import { Key, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { admin } = useAdminAuth();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New password and confirmation do not match.' });
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      await AdminService.updatePassword(newPassword);
      setMessage({ type: 'success', text: 'Your administrator password was updated successfully.' });
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.message || 'Failed to update password. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-3xl mx-auto">
        <div>
          <h1 className="text-2xl font-black text-[#1E2B37]">Admin Account Settings</h1>
          <p className="text-xs text-[#64748B] mt-1">
            Manage your credentials and view your administrator role configuration.
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[#1E2B37] border-b border-[#E2E8F0] pb-3 flex items-center">
            <ShieldCheck className="w-4 h-4 mr-2 text-[#0EA5E9]" />
            Administrator Profile Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[#64748B] block font-bold uppercase tracking-wider text-[10px] mb-0.5">Admin Name</span>
              <span className="font-semibold text-[#1E2B37] text-sm">{admin?.full_name || 'Administrator'}</span>
            </div>

            <div>
              <span className="text-[#64748B] block font-bold uppercase tracking-wider text-[10px] mb-0.5">Access Role</span>
              <span className="inline-block px-2.5 py-0.5 rounded bg-sky-50 text-[#0EA5E9] font-bold text-xs border border-sky-100">
                {admin?.role || 'ADMIN'}
              </span>
            </div>
          </div>
        </div>

        {/* Password Update Form */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[#1E2B37] border-b border-[#E2E8F0] pb-3 flex items-center">
            <Key className="w-4 h-4 mr-2 text-[#0EA5E9]" />
            Change Administrator Password
          </h2>

          {message && (
            <div
              className={`p-4 rounded-xl border flex items-start space-x-3 text-xs ${
                message.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-rose-50 border-rose-200 text-rose-700'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1E2B37] mb-1.5">
                New Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min 6 characters)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:border-[#0EA5E9] focus:outline-none bg-[#FAF9F6]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1E2B37] mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:border-[#0EA5E9] focus:outline-none bg-[#FAF9F6]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-[#0EA5E9] hover:bg-sky-600 text-white font-bold text-xs shadow-sm transition-all disabled:opacity-50"
            >
              {loading ? 'Updating Password...' : 'Update Admin Password'}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};
