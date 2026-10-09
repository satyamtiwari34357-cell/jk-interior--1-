import React, { useState, useEffect } from 'react';
import {
  FolderKanban,
  Users,
  Briefcase,
  MessageSquareQuote,
  Plus,
  ArrowRight,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Clock,
  Loader2
} from 'lucide-react';
import { AdminStats, AdminTab } from './types.ts';

interface AdminDashboardProps {
  onNavigate: (tab: AdminTab) => void;
  token: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate, token }) => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchDashboardData = async () => {
      try {
        const [statsRes, leadsRes] = await Promise.all([
          fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/admin/leads?status=ALL', { headers: { Authorization: `Bearer ${token}` } })
        ]);

        if (statsRes.ok) {
          const s = await statsRes.json();
          if (isMounted) setStats(s);
        }

        if (leadsRes.ok) {
          const l = await leadsRes.json();
          if (isMounted) setRecentLeads((l.leads || []).slice(0, 5));
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDashboardData();
    return () => {
      isMounted = false;
    };
  }, [token]);

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <Loader2 className="w-8 h-8 text-gold-500 animate-spin mx-auto" />
        <p className="text-xs uppercase tracking-widest text-stone-700">Loading studio metrics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif text-ivory-soft">
            Studio Overview
          </h2>
          <p className="text-xs text-stone-600 mt-1">
            Real-time project inventory, client consultations, and turnkey atelier metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('project-new')}
            className="px-4 py-2.5 bg-gold-500 hover:bg-gold-400 text-dark-900 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5 shadow-md shadow-gold-500/15"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* 4 Primary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Projects Metric */}
        <div
          onClick={() => onNavigate('projects')}
          className="cursor-pointer p-6 rounded-xl bg-graphite border border-white/5 hover:border-gold-500/40 transition-all space-y-3 group"
        >
          <div className="flex items-center justify-between text-xs text-stone-700">
            <span>Portfolio Projects</span>
            <FolderKanban className="w-4 h-4 text-gold-500" />
          </div>
          <div className="text-3xl font-serif text-ivory-soft">
            {stats?.projects.total ?? 0}
          </div>
          <div className="flex items-center justify-between text-[11px] text-stone-700 pt-2 border-t border-white/5">
            <span>Published: <strong className="text-emerald-400">{stats?.projects.published ?? 0}</strong></span>
            <span>Drafts: <strong className="text-amber-400">{stats?.projects.draft ?? 0}</strong></span>
          </div>
        </div>

        {/* Leads Metric */}
        <div
          onClick={() => onNavigate('leads')}
          className="cursor-pointer p-6 rounded-xl bg-graphite border border-white/5 hover:border-gold-500/40 transition-all space-y-3 group"
        >
          <div className="flex items-center justify-between text-xs text-stone-700">
            <span>Consultation Enquiries</span>
            <Users className="w-4 h-4 text-gold-500" />
          </div>
          <div className="text-3xl font-serif text-ivory-soft">
            {stats?.leads.total ?? 0}
          </div>
          <div className="flex items-center justify-between text-[11px] text-stone-700 pt-2 border-t border-white/5">
            <span>New Inquiries: <strong className="text-gold-500">{stats?.leads.newEnquiries ?? 0}</strong></span>
            <span className="text-gold-500 group-hover:underline">Review →</span>
          </div>
        </div>

        {/* Services Metric */}
        <div
          onClick={() => onNavigate('services')}
          className="cursor-pointer p-6 rounded-xl bg-graphite border border-white/5 hover:border-gold-500/40 transition-all space-y-3 group"
        >
          <div className="flex items-center justify-between text-xs text-stone-700">
            <span>Turnkey Disciplines</span>
            <Briefcase className="w-4 h-4 text-gold-500" />
          </div>
          <div className="text-3xl font-serif text-ivory-soft">
            {stats?.services ?? 6}
          </div>
          <div className="text-[11px] text-stone-700 pt-2 border-t border-white/5">
            <span>Confirmed Atelier Disciplines</span>
          </div>
        </div>

        {/* Testimonials Metric */}
        <div
          onClick={() => onNavigate('testimonials')}
          className="cursor-pointer p-6 rounded-xl bg-graphite border border-white/5 hover:border-gold-500/40 transition-all space-y-3 group"
        >
          <div className="flex items-center justify-between text-xs text-stone-700">
            <span>Patron Testimonials</span>
            <MessageSquareQuote className="w-4 h-4 text-gold-500" />
          </div>
          <div className="text-3xl font-serif text-ivory-soft">
            {stats?.testimonials ?? 0}
          </div>
          <div className="text-[11px] text-stone-700 pt-2 border-t border-white/5">
            <span>Verified Client Endorsements</span>
          </div>
        </div>

      </div>

      {/* Recent Enquiries Section */}
      <div className="p-6 rounded-xl bg-graphite border border-white/5 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-serif text-ivory-soft">
              Recent Consultation Inquiries
            </h3>
            <p className="text-xs text-stone-700">
              Direct submissions from homeowners interested in turnkey craftsmanship.
            </p>
          </div>
          <button
            onClick={() => onNavigate('leads')}
            className="text-xs text-gold-500 hover:underline flex items-center gap-1 font-medium"
          >
            <span>View All Enquiries</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentLeads.length === 0 ? (
          <div className="py-10 text-center text-stone-700 space-y-2">
            <Users className="w-6 h-6 text-gold-500/40 mx-auto" />
            <p className="text-sm">No enquiries yet.</p>
            <p className="text-xs text-warm-grey">When visitors submit the Book a Consultation form, they appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-taupe">
              <thead className="text-[10px] uppercase tracking-wider text-stone-700 bg-white/5 border-b border-white/5">
                <tr>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Project Type</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Timeline</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 px-4">
                      <strong className="text-white block font-medium">{lead.name}</strong>
                      <span className="text-[11px] text-stone-700">{lead.phone}</span>
                    </td>
                    <td className="py-3 px-4">{lead.projectType}</td>
                    <td className="py-3 px-4">{lead.location}</td>
                    <td className="py-3 px-4 text-stone-700">{lead.timeline || 'Within 3 months'}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono font-medium ${
                        lead.status === 'NEW'
                          ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                          : lead.status === 'WON'
                          ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                          : 'bg-white/10 text-white/80'
                      }`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onNavigate('leads')}
                        className="text-xs text-gold-500 hover:underline"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
