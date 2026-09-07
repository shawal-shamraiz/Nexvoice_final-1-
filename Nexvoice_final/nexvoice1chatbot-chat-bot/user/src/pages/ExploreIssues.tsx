import React, { useEffect, useState } from 'react';
import { ISSUE_CATEGORIES, PROVINCES } from '../types';
import type { Issue } from '../types';
import { DataService } from '../lib/supabase';
import { IssueCard } from '../components/IssueCard';
import { ReportModal } from '../components/ReportModal';
import { Search, RefreshCw, Layers, BadgeCheck, FileText } from 'lucide-react';

export const ExploreIssues: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedProvince, setSelectedProvince] = useState<string>('ALL');
  const [selectedCity, setSelectedCity] = useState<string>('ALL');
  const [submissionTypeFilter, setSubmissionTypeFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'NEWEST' | 'OLDEST'>('NEWEST');

  // Report Modal
  const [reportingIssueId, setReportingIssueId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await DataService.fetchIssues();
    setIssues(data);
    setLoading(false);
  };

  // Filter effect
  useEffect(() => {
    let result = [...issues];

    // Search query (title, institution, issue_number)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.institution_name.toLowerCase().includes(q) ||
          i.issue_number.toLowerCase().includes(q)
      );
    }

    // Category
    if (selectedCategory !== 'ALL') {
      result = result.filter((i) => i.category === selectedCategory);
    }

    // Province
    if (selectedProvince !== 'ALL') {
      result = result.filter((i) => i.province === selectedProvince);
    }

    // City
    if (selectedCity !== 'ALL') {
      result = result.filter((i) => i.city.toLowerCase() === selectedCity.toLowerCase());
    }

    // Submission Type
    if (submissionTypeFilter !== 'ALL') {
      result = result.filter((i) => i.submission_type === submissionTypeFilter);
    }

    // Sort
    result.sort((a, b) => {
      const timeA = new Date(a.created_at).getTime();
      const timeB = new Date(b.created_at).getTime();
      return sortBy === 'NEWEST' ? timeB - timeA : timeA - timeB;
    });

    setFilteredIssues(result);
  }, [searchQuery, selectedCategory, selectedProvince, selectedCity, submissionTypeFilter, sortBy, issues]);

  // Extract unique cities for filter dropdown
  const uniqueCities = Array.from(new Set(issues.map((i) => i.city))).filter(Boolean);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-[#0F172A] text-white rounded-3xl p-8 sm:p-10 border border-[#4F46E5] shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#F8FAFC]"><FileText className="h-3.5 w-3.5 text-[#10B981]" />Public Issue Register</span>
          <h1 className="text-3xl font-black">Explore Student Issues</h1>
          <p className="text-sm text-[#CBD5E1] max-w-xl">
            Browse published academic records, each organized around a clear issue, location, institution, and verification state.
          </p>
        </div>

        <button
          onClick={loadData}
          className="px-4 py-2.5 rounded-xl bg-[#4F46E5] hover:bg-[#4F46E5]/80 text-white font-semibold text-xs inline-flex items-center shadow-xs"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Feed
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by issue title, institution name, or reference code (e.g. NV-2026-000001)..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#4F46E5] focus:outline-none"
          />
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          
          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 bg-white focus:outline-none"
            >
              <option value="ALL">All Categories</option>
              {ISSUE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">Province</label>
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 bg-white focus:outline-none"
            >
              <option value="ALL">All Provinces</option>
              {PROVINCES.map((prov) => (
                <option key={prov} value={prov}>{prov}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">City</label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 bg-white focus:outline-none"
            >
              <option value="ALL">All Cities</option>
              {uniqueCities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">Submitted By</label>
            <select
              value={submissionTypeFilter}
              onChange={(e) => setSubmissionTypeFilter(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 bg-white focus:outline-none"
            >
              <option value="ALL">All Types</option>
              <option value="STUDENT">Student</option>
              <option value="INSTITUTION_REPRESENTATIVE">Institution Rep</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'NEWEST' | 'OLDEST')}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 bg-white focus:outline-none"
            >
              <option value="NEWEST">Newest First</option>
              <option value="OLDEST">Oldest First</option>
            </select>
          </div>

        </div>

        {/* Results Counter & Clear */}
        <div className="flex items-center justify-between pt-2 text-xs text-gray-500 border-t border-gray-100">
          <span>Showing <strong>{filteredIssues.length}</strong> public issues</span>
          {(searchQuery || selectedCategory !== 'ALL' || selectedProvince !== 'ALL' || selectedCity !== 'ALL' || submissionTypeFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('ALL');
                setSelectedProvince('ALL');
                setSelectedCity('ALL');
                setSubmissionTypeFilter('ALL');
              }}
              className="text-[#4F46E5] font-semibold hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Issues Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-64 rounded-2xl bg-gray-100 animate-pulse border border-gray-200" />
          ))}
        </div>
      ) : filteredIssues.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 space-y-3">
          <Layers className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="text-lg font-bold text-[#1E293B]">No issues match your criteria</h3>
          <p className="text-sm text-gray-500">Try broadening your search term or filter selection.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredIssues.map((issue) => (
            <IssueCard
              key={issue.id}
              issue={issue}
              onReportClick={(id) => setReportingIssueId(id)}
            />
          ))}
        </div>
      )}

      {/* Report Modal */}
      {reportingIssueId && (
        <ReportModal
          issueId={reportingIssueId}
          isOpen={Boolean(reportingIssueId)}
          onClose={() => setReportingIssueId(null)}
        />
      )}

    </div>
  );
};
