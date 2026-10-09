import React, { useState, useEffect } from 'react';
import { MessageSquareQuote, Plus, Edit2, Trash2, X, Save, Loader2, Quote } from 'lucide-react';

interface AdminTestimonialsProps {
  token: string;
}

export const AdminTestimonials: React.FC<AdminTestimonialsProps> = ({ token }) => {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadTestimonials = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/testimonials', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTestimonials(data.testimonials || []);
      }
    } catch (err) {
      console.error('Failed to load testimonials:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, [token]);

  const handleSave = async (data: any) => {
    setSaving(true);
    const isEdit = Boolean(data.id);
    const url = isEdit ? `/api/admin/testimonials/${data.id}` : '/api/admin/testimonials';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        setEditingItem(null);
        setIsAdding(false);
        await loadTestimonials();
      }
    } catch (err) {
      console.error('Failed to save testimonial:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this client testimonial?')) return;
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        await loadTestimonials();
      }
    } catch (err) {
      console.error('Failed to delete testimonial:', err);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h2 className="text-2xl font-serif text-ivory-soft">
            Client Testimonials Management
          </h2>
          <p className="text-xs text-stone-600 mt-0.5">
            Verified client quotes from completed residential and commercial handovers.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingItem({
              clientName: '',
              projectName: '',
              role: '',
              quote: '',
              image: '',
              published: false,
              sortOrder: testimonials.length
            });
            setIsAdding(true);
          }}
          className="px-4 py-2 bg-gold-500 hover:bg-gold-400 text-black text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5 shadow-md shadow-gold-500/15"
        >
          <Plus className="w-4 h-4" />
          <span>Add Testimonial</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-gold-500 animate-spin mx-auto" />
          <p className="text-xs uppercase tracking-widest text-stone-700">Loading testimonials...</p>
        </div>
      ) : testimonials.length === 0 ? (
        <div className="py-16 text-center text-stone-700 space-y-3 bg-graphite rounded-xl border border-white/5 p-8">
          <MessageSquareQuote className="w-8 h-8 text-gold-500/40 mx-auto" />
          <p className="text-base font-serif text-ivory-soft">No testimonials yet.</p>
          <p className="text-xs text-warm-grey">Add verified homeowner reflections from Mumbai projects.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="p-6 rounded-xl bg-graphite border border-white/5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Quote className="w-5 h-5 text-gold-500" />
                  <span className={`px-2 py-0.5 text-[9px] uppercase font-mono rounded ${
                    t.published ? 'bg-emerald-500/10 text-emerald-300' : 'bg-amber-500/10 text-amber-300'
                  }`}>
                    {t.published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <p className="text-xs italic font-serif text-[#ded9ce] line-clamp-4">
                  "{t.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-white">{t.clientName}</h4>
                  <span className="text-[10px] text-stone-700 block">
                    {t.projectName || t.role}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setEditingItem(t);
                      setIsAdding(false);
                    }}
                    className="p-1.5 rounded hover:bg-white/10 text-white/70 hover:text-white"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="p-1.5 rounded hover:bg-red-500/20 text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit/Add Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-graphite-strong border border-white/10 rounded-xl p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-serif text-ivory-soft">
                {isAdding ? 'Add Client Testimonial' : 'Edit Testimonial'}
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                className="p-1 rounded-full text-white/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave(editingItem);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-stone-700 uppercase mb-1">Client Name *</label>
                <input
                  type="text"
                  required
                  value={editingItem.clientName}
                  onChange={(e) => setEditingItem({ ...editingItem, clientName: e.target.value })}
                  placeholder="e.g. Rajiv Singhania"
                  className="w-full bg-graphite-deep border border-white/10 rounded px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-stone-700 uppercase mb-1">Residence / Project Reference</label>
                <input
                  type="text"
                  value={editingItem.projectName}
                  onChange={(e) => setEditingItem({ ...editingItem, projectName: e.target.value })}
                  placeholder="The Worli Seaface Penthouse"
                  className="w-full bg-graphite-deep border border-white/10 rounded px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-stone-700 uppercase mb-1">Client Designation / Role</label>
                <input
                  type="text"
                  value={editingItem.role || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, role: e.target.value })}
                  placeholder="Managing Partner, Bay Capital"
                  className="w-full bg-graphite-deep border border-white/10 rounded px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-stone-700 uppercase mb-1">Testimonial Quote *</label>
                <textarea
                  rows={4}
                  required
                  value={editingItem.quote}
                  onChange={(e) => setEditingItem({ ...editingItem, quote: e.target.value })}
                  placeholder="Share the client's reflection on turnkey craftsmanship..."
                  className="w-full bg-graphite-deep border border-white/10 rounded px-3 py-2 text-white"
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.published}
                    onChange={(e) => setEditingItem({ ...editingItem, published: e.target.checked })}
                    className="accent-[#c5a880]"
                  />
                  <span>Verified and approved for publication</span>
                </label>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 text-white/60 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-gold-500 text-black font-semibold uppercase tracking-wider rounded"
                >
                  {saving ? 'Saving...' : 'Save Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
