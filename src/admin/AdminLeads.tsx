import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Users,
  Phone,
  MessageSquare,
  Mail,
  Calendar,
  MapPin,
  Clock,
  X,
  CheckCircle2,
  Save,
  Loader2,
  AlertCircle
} from 'lucide-react';

interface AdminLeadsProps {
  token: string;
}

export const AdminLeads: React.FC<AdminLeadsProps> = ({ token }) => {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [savingNotes, setSavingNotes] = useState(false);
  const [internalNotes, setInternalNotes] = useState('');
  const [currentStatus, setCurrentStatus] = useState('NEW');

  const leadStatuses = [
    'NEW',
    'CONTACTED',
    'QUALIFIED',
    'SITE_VISIT',
    'PROPOSAL',
    'WON',
    'CLOSED'
  ];

  const loadLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/leads?status=${statusFilter}&search=${encodeURIComponent(search)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads || []);
      }
    } catch (err) {
      console.error('Failed to load leads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, [statusFilter, search, token]);

  const handleSelectLead = (lead: any) => {
    setSelectedLead(lead);
    setInternalNotes(lead.internalNotes || '');
    setCurrentStatus(lead.status || 'NEW');
  };

  const handleUpdateLead = async () => {
    if (!selectedLead) return;
    setSavingNotes(true);
    try {
      const res = await fetch(`/api/admin/leads/${selectedLead.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          status: currentStatus,
          internalNotes,
          lastContactedAt: new Date().toISOString()
        })
      });

      if (res.ok) {
        const data = await res.json();
        setSelectedLead((prev: any) => ({ ...prev, ...data.lead }));
        await loadLeads();
      }
    } catch (err) {
      console.error('Failed to update lead:', err);
    } finally {
      setSavingNotes(false);
    }
  };

  // WhatsApp click-to-chat generator
  const getWhatsAppLink = (lead: any) => {
    const rawNumber = (lead.whatsapp || lead.phone || '').replace(/[^0-9]/g, '');
    const cleanNumber = rawNumber.startsWith('91') ? rawNumber : `91${rawNumber}`;
    const text = encodeURIComponent(
      `Hello ${lead.name},\n\nThank you for sharing your project details with JK Interior. I am reaching out from Kishorilal Sharma’s executive studio regarding your ${lead.projectType} inquiry in ${lead.location}.\n\nWhen would be a convenient time for a brief discussion regarding your layout and requirements?`
    );
    return `https://wa.me/${cleanNumber}?text=${text}`;
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto relative">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h2 className="text-2xl font-serif text-[#fbf9f5]">
            Consultation Enquiries & Leads
          </h2>
          <p className="text-xs text-[#9f9b90] mt-0.5">
            Prospective homeowner submissions received through Book a Consultation.
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by client name, contact number, or location..."
            className="w-full bg-[#121319] border border-white/10 rounded-lg pl-10 pr-3.5 py-2 text-xs text-white placeholder-white/30 focus:border-[#c5a880] focus:outline-none"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#121319] border border-white/10 rounded-lg px-3.5 py-2 text-xs text-white focus:border-[#c5a880] focus:outline-none"
        >
          <option value="ALL">All Statuses</option>
          {leadStatuses.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>
      </div>

      {/* Leads Table */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-[#c5a880] animate-spin mx-auto" />
          <p className="text-xs uppercase tracking-widest text-[#8e8a7f]">Loading enquiries...</p>
        </div>
      ) : leads.length === 0 ? (
        <div className="py-16 text-center text-[#8e8a7f] space-y-3 bg-[#121319] rounded-xl border border-white/5 p-8">
          <Users className="w-8 h-8 text-[#c5a880]/40 mx-auto" />
          <p className="text-base font-serif text-[#fbf9f5]">No enquiries yet.</p>
          <p className="text-xs text-[#6e6a60]">When prospective clients submit the consultation form, they will appear here.</p>
        </div>
      ) : (
        <div className="bg-[#121319] rounded-xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#cfc9be]">
              <thead className="text-[10px] uppercase tracking-wider text-[#8e8a7f] bg-white/5 border-b border-white/5">
                <tr>
                  <th className="py-3.5 px-4">Client</th>
                  <th className="py-3.5 px-4">Project</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Budget</th>
                  <th className="py-3.5 px-4">Timeline</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Submitted</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {leads.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => handleSelectLead(lead)}
                    className="hover:bg-white/[0.03] cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <strong className="text-white block font-medium">{lead.name}</strong>
                      <span className="text-[11px] text-[#8e8a7f]">{lead.phone}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-white font-medium block">{lead.projectType}</span>
                      {lead.carpetAreaRange && (
                        <span className="text-[11px] text-[#8e8a7f]">{lead.carpetAreaRange}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">{lead.location}</td>
                    <td className="py-3.5 px-4 text-[#c5a880]">{lead.budgetRange || 'Not specified'}</td>
                    <td className="py-3.5 px-4 text-[#8e8a7f]">{lead.timeline || 'Immediate'}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono font-medium ${
                          lead.status === 'NEW'
                            ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                            : lead.status === 'WON'
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                            : lead.status === 'SITE_VISIT'
                            ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                            : lead.status === 'PROPOSAL'
                            ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                            : 'bg-white/10 text-white/80'
                        }`}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#78746c] text-[11px]">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button className="text-xs text-[#c5a880] hover:underline font-medium">
                        View Details →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Side-Panel Lead Detail Drawer */}
      {selectedLead && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xl bg-[#111218] border-l border-white/10 shadow-2xl p-6 sm:p-8 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
          
          <div className="space-y-6">
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#c5a880] font-sans">
                  Enquiry ID: {selectedLead.id.slice(0, 12)}
                </span>
                <h3 className="text-xl font-serif text-[#fbf9f5] mt-0.5">
                  {selectedLead.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-1.5 rounded-full text-white/60 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-3 gap-3">
              {selectedLead.phone && (
                <a
                  href={`tel:${selectedLead.phone}`}
                  className="py-2.5 px-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-white flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#c5a880]" />
                  <span>Call</span>
                </a>
              )}
              {selectedLead.phone && (
                <a
                  href={getWhatsAppLink(selectedLead)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/30 rounded-lg text-xs text-[#25D366] flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 fill-current" />
                  <span>WhatsApp</span>
                </a>
              )}
              {selectedLead.email ? (
                <a
                  href={`mailto:${selectedLead.email}`}
                  className="py-2.5 px-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-white flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-[#c5a880]" />
                  <span>Email</span>
                </a>
              ) : (
                <div className="py-2.5 px-3 bg-white/5 opacity-40 rounded-lg text-xs text-white/50 text-center">
                  No Email
                </div>
              )}
            </div>

            {/* Section 1: Customer Contact */}
            <div className="p-4 rounded-lg bg-[#161720] border border-white/5 space-y-2 text-xs">
              <h4 className="text-[10px] uppercase tracking-wider text-[#8e8a7f] font-semibold">
                Customer Information
              </h4>
              <div className="grid grid-cols-2 gap-2 text-[#cfc9be]">
                <div>
                  <span className="text-[#78746c] block text-[10px]">Phone</span>
                  <span>{selectedLead.phone}</span>
                </div>
                <div>
                  <span className="text-[#78746c] block text-[10px]">Email</span>
                  <span>{selectedLead.email || 'None provided'}</span>
                </div>
                <div>
                  <span className="text-[#78746c] block text-[10px]">Location</span>
                  <span>{selectedLead.location}</span>
                </div>
                <div>
                  <span className="text-[#78746c] block text-[10px]">Customer Type</span>
                  <span>{selectedLead.customerType || 'Homeowner'}</span>
                </div>
              </div>
            </div>

            {/* Section 2: Project Scope */}
            <div className="p-4 rounded-lg bg-[#161720] border border-white/5 space-y-2 text-xs">
              <h4 className="text-[10px] uppercase tracking-wider text-[#c5a880] font-semibold">
                Project Scope & Timeline
              </h4>
              <div className="grid grid-cols-2 gap-2 text-[#cfc9be]">
                <div>
                  <span className="text-[#78746c] block text-[10px]">Project Type</span>
                  <span className="text-white font-medium">{selectedLead.projectType}</span>
                </div>
                <div>
                  <span className="text-[#78746c] block text-[10px]">Carpet Area</span>
                  <span>{selectedLead.carpetAreaRange || 'Not specified'}</span>
                </div>
                <div>
                  <span className="text-[#78746c] block text-[10px]">Estimated Budget</span>
                  <span className="text-[#c5a880] font-medium">{selectedLead.budgetRange || 'Not specified'}</span>
                </div>
                <div>
                  <span className="text-[#78746c] block text-[10px]">Timeline</span>
                  <span>{selectedLead.timeline || 'Immediate'}</span>
                </div>
              </div>
            </div>

            {/* Section 3: Requirements Message */}
            {selectedLead.message && (
              <div className="p-4 rounded-lg bg-[#161720] border border-white/5 space-y-1.5 text-xs">
                <h4 className="text-[10px] uppercase tracking-wider text-[#8e8a7f] font-semibold">
                  Client Design Notes
                </h4>
                <p className="text-[#cfc9be] leading-relaxed font-light">
                  {selectedLead.message}
                </p>
              </div>
            )}

            {/* Section 4: Management & Internal Notes (Admin Only) */}
            <div className="p-4 rounded-lg bg-[#161720] border border-[#c5a880]/30 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs uppercase tracking-wider text-[#c5a880] font-semibold">
                  Management Status & Internal Notes
                </h4>
                <span className="text-[10px] text-[#8e8a7f]">Admin Private</span>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#8e8a7f] mb-1">
                  Lead Status
                </label>
                <select
                  value={currentStatus}
                  onChange={(e) => setCurrentStatus(e.target.value)}
                  className="w-full bg-[#111218] border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-[#c5a880] focus:outline-none"
                >
                  {leadStatuses.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#8e8a7f] mb-1">
                  Internal Atelier Notes (Never visible to client)
                </label>
                <textarea
                  rows={3}
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="e.g. Called client on Thursday. Site visit scheduled for Sunday at Worli Seaface. Looking for Statuario marble and bespoke walnut walk-in dressing suite."
                  className="w-full bg-[#111218] border border-white/10 rounded px-3 py-2 text-xs text-white placeholder-white/30 focus:border-[#c5a880] focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={handleUpdateLead}
                disabled={savingNotes}
                className="w-full py-2.5 bg-[#c5a880] hover:bg-[#d4b88f] text-black text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2"
              >
                {savingNotes ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>Save Notes & Status</span>
              </button>
            </div>

          </div>

          <div className="pt-6 border-t border-white/10 text-[11px] text-[#78746c] flex items-center justify-between">
            <span>Received: {new Date(selectedLead.createdAt).toLocaleString()}</span>
            <button
              onClick={() => setSelectedLead(null)}
              className="hover:text-white"
            >
              Close
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
