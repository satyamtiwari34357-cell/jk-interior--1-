import React, { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle2, Loader2 } from 'lucide-react';

interface AdminSettingsProps {
  token: string;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({ token }) => {
  const [formData, setFormData] = useState({
    studioName: 'JK Interior',
    founderName: 'Kishorilal Sharma',
    phone: '+91 98201 23456',
    whatsapp: '+91 98201 23456',
    email: 'atelier@jkinterior.in',
    address: 'Sun Mill Compound, Senapati Bapat Marg, Lower Parel West, Mumbai 400013',
    serviceArea: 'Mumbai',
    instagram: 'https://instagram.com',
    facebook: '',
    linkedin: '',
    youtube: '',
    seoTitle: 'JK Interior | Luxury Interior Design & Turnkey Craftsmanship Mumbai',
    seoDescription: 'Contemporary luxury interior design, architecture, and turnkey craftsmanship studio in Mumbai established by Kishorilal Sharma.'
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/admin/settings', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.settings) {
            setFormData(prev => ({ ...prev, ...data.settings }));
          }
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSettings();
    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 4000);
      }
    } catch (err) {
      console.error('Failed to update settings:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <Loader2 className="w-8 h-8 text-[#c5a880] animate-spin mx-auto" />
        <p className="text-xs uppercase tracking-widest text-[#8e8a7f]">Loading studio settings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h2 className="text-2xl font-serif text-[#fbf9f5]">
            Studio Identity & Site Settings
          </h2>
          <p className="text-xs text-[#9f9b90] mt-0.5">
            Configure centralized branding, contact coordinates, WhatsApp desk, and SEO metadata.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings saved successfully</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Studio Identity */}
        <div className="p-6 rounded-xl bg-[#121319] border border-white/5 space-y-4">
          <h3 className="text-sm uppercase tracking-wider text-[#c5a880] font-semibold border-b border-white/5 pb-2">
            1. Brand Identity & Founder
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[#8e8a7f] uppercase mb-1">Studio Brand Name</label>
              <input
                type="text"
                value={formData.studioName}
                onChange={(e) => setFormData({ ...formData, studioName: e.target.value })}
                className="w-full bg-[#181a22] border border-white/10 rounded px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-[#8e8a7f] uppercase mb-1">Founder / Master Craftsman</label>
              <input
                type="text"
                value={formData.founderName}
                onChange={(e) => setFormData({ ...formData, founderName: e.target.value })}
                className="w-full bg-[#181a22] border border-white/10 rounded px-3 py-2 text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[#8e8a7f] uppercase mb-1">Service Area / Territories</label>
              <input
                type="text"
                value={formData.serviceArea}
                onChange={(e) => setFormData({ ...formData, serviceArea: e.target.value })}
                className="w-full bg-[#181a22] border border-white/10 rounded px-3 py-2 text-white"
              />
            </div>
          </div>
        </div>

        {/* Contact Coordinates & WhatsApp */}
        <div className="p-6 rounded-xl bg-[#121319] border border-white/5 space-y-4">
          <h3 className="text-sm uppercase tracking-wider text-[#c5a880] font-semibold border-b border-white/5 pb-2">
            2. Contact Channels & WhatsApp Concierge
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[#8e8a7f] uppercase mb-1">Primary Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-[#181a22] border border-white/10 rounded px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-[#8e8a7f] uppercase mb-1">Studio WhatsApp Number</label>
              <input
                type="text"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="w-full bg-[#181a22] border border-white/10 rounded px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-[#8e8a7f] uppercase mb-1">Studio Desk Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#181a22] border border-white/10 rounded px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-[#8e8a7f] uppercase mb-1">Instagram URL</label>
              <input
                type="url"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                className="w-full bg-[#181a22] border border-white/10 rounded px-3 py-2 text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[#8e8a7f] uppercase mb-1">Physical Atelier & Workshop Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-[#181a22] border border-white/10 rounded px-3 py-2 text-white"
              />
            </div>
          </div>
        </div>

        {/* Global SEO */}
        <div className="p-6 rounded-xl bg-[#121319] border border-white/5 space-y-4">
          <h3 className="text-sm uppercase tracking-wider text-[#c5a880] font-semibold border-b border-white/5 pb-2">
            3. Search Engine Optimization (SEO)
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-[#8e8a7f] uppercase mb-1">Default Meta Title</label>
              <input
                type="text"
                value={formData.seoTitle}
                onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                className="w-full bg-[#181a22] border border-white/10 rounded px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-[#8e8a7f] uppercase mb-1">Default Meta Description</label>
              <textarea
                rows={2}
                value={formData.seoDescription}
                onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                className="w-full bg-[#181a22] border border-white/10 rounded px-3 py-2 text-white"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-[#c5a880] hover:bg-[#d4b88f] text-black text-xs font-semibold uppercase tracking-widest rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-[#c5a880]/15"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Settings</span>
          </button>
        </div>

      </form>
    </div>
  );
};
