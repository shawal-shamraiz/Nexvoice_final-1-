import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { AdminService } from '../../services/adminService';
import { AdminEmptyState } from '../../components/admin/AdminEmptyState';
import { AdminLoadingState } from '../../components/admin/AdminLoadingState';
import type { ContactMessageInput } from '../../types';
import { Mail, Search, Clock, User, MessageSquare } from 'lucide-react';

export const AdminMessages: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessageInput[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    setLoading(true);
    const data = await AdminService.fetchContactMessages();
    setMessages(data);
    setLoading(false);
  };

  const filteredMessages = messages.filter((m) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.subject.toLowerCase().includes(q) ||
      m.message.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <AdminLayout>
        <AdminLoadingState message="Loading contact messages from database..." />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-[#1E2B37] flex items-center">
              <Mail className="w-6 h-6 mr-2.5 text-[#0EA5E9]" />
              Contact Messages Inbox
            </h1>
            <p className="text-xs text-[#64748B] mt-1">
              View and manage inquiries, feedback, and guardian support messages submitted via the public Contact page.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="px-3 py-1.5 rounded-xl bg-sky-50 border border-sky-200 text-[#0EA5E9] font-bold text-xs">
              Total Messages: {messages.length}
            </span>
            <button
              onClick={loadMessages}
              className="px-3.5 py-1.5 rounded-xl bg-white border border-[#E2E8F0] hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search messages by name, email, subject, or content..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#1E2B37] outline-none focus:border-[#0EA5E9] focus:shadow-xs transition-all"
          />
        </div>

        {/* Messages List */}
        {filteredMessages.length === 0 ? (
          <AdminEmptyState
            title="No Contact Messages Found"
            description="There are currently no contact messages matching your search."
          />
        ) : (
          <div className="space-y-4">
            {filteredMessages.map((msg, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs space-y-3 hover:border-[#0EA5E9]/50 transition-all"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2E8F0] pb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-sky-100 text-[#0EA5E9] flex items-center justify-center font-bold text-xs">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-[#1E2B37]">{msg.name}</h3>
                      <a
                        href={`mailto:${msg.email}`}
                        className="text-[11px] font-mono text-[#0EA5E9] hover:underline"
                      >
                        {msg.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5 text-slate-400 text-xs font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Contact Inquiry #{filteredMessages.length - index}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-bold text-[#1E2B37]">Subject: {msg.subject}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                    {msg.message}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
