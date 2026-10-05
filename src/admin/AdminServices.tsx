import React, { useState, useEffect } from "react";
import { Briefcase, Edit2, Save, X, Check, Loader2 } from "lucide-react";
import type { ServiceItem } from "../lib/data/servicesRepository.ts";

interface AdminServicesProps {
  token: string;
}

export const AdminServices: React.FC<AdminServicesProps> = ({ token }) => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<ServiceItem | null>(
    null,
  );
  const [saving, setSaving] = useState(false);

  const loadServices = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/services", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setServices(data.services || []);
      }
    } catch (err) {
      console.error("Failed to load services:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, [token]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    setSaving(true);

    try {
      const res = await fetch(`/api/admin/services/${editingService.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingService),
      });

      if (res.ok) {
        setEditingService(null);
        await loadServices();
      }
    } catch (err) {
      console.error("Failed to update service:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h2 className="text-2xl font-serif text-[#fbf9f5]">
            Architectural Services Management
          </h2>
          <p className="text-xs text-[#9f9b90] mt-0.5">
            Manage the six confirmed JK Interior turnkey disciplines and public
            presentations.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-[#c5a880] animate-spin mx-auto" />
          <p className="text-xs uppercase tracking-widest text-[#8e8a7f]">
            Loading services...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, idx) => (
            <div
              key={service.slug}
              className="bg-[#121319] border border-white/5 rounded-xl overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/10] w-full bg-black/40 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 text-[10px] font-mono text-[#c5a880] bg-black/70 px-2 py-0.5 rounded border border-white/10">
                    Discipline 0{idx + 1}
                  </span>
                  <span
                    className={`absolute top-3 right-3 text-[9px] uppercase px-2 py-0.5 rounded font-mono ${
                      service.published
                        ? "bg-emerald-500/80 text-black font-bold"
                        : "bg-amber-500/80 text-black font-bold"
                    }`}
                  >
                    {service.published ? "Published" : "Draft"}
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="text-lg font-serif text-[#fbf9f5]">
                    {service.name}
                  </h3>
                  <p className="text-xs text-[#a09c91] leading-relaxed line-clamp-2">
                    {service.shortDescription}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => setEditingService(service)}
                  className="w-full py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold rounded border border-white/10 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5 text-[#c5a880]" />
                  <span>Edit Discipline</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-[#14151b] border border-white/10 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-serif text-[#fbf9f5]">
                Edit Service Discipline
              </h3>
              <button
                onClick={() => setEditingService(null)}
                className="p-1 rounded-full text-white/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#8e8a7f] uppercase mb-1">
                  Discipline Name
                </label>
                <input
                  type="text"
                  required
                  value={editingService.name}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      name: e.target.value,
                    })
                  }
                  className="w-full bg-[#181a22] border border-white/10 rounded px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-[#8e8a7f] uppercase mb-1">
                  Short Description
                </label>
                <input
                  type="text"
                  value={editingService.shortDescription}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      shortDescription: e.target.value,
                    })
                  }
                  className="w-full bg-[#181a22] border border-white/10 rounded px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-[#8e8a7f] uppercase mb-1">
                  Full Description
                </label>
                <textarea
                  rows={3}
                  value={editingService.description}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      description: e.target.value,
                    })
                  }
                  className="w-full bg-[#181a22] border border-white/10 rounded px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-[#8e8a7f] uppercase mb-1">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  value={editingService.image}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      image: e.target.value,
                    })
                  }
                  className="w-full bg-[#181a22] border border-white/10 rounded px-3 py-2 text-white"
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingService.published}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        published: e.target.checked,
                      })
                    }
                    className="accent-[#c5a880]"
                  />
                  <span>Published on public website</span>
                </label>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-4 py-2 text-white/60 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#c5a880] text-black font-semibold uppercase tracking-wider rounded"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
