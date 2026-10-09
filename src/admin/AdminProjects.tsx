import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Loader2,
  FolderKanban
} from 'lucide-react';
import { AdminProjectForm } from './AdminProjectForm.tsx';

interface AdminProjectsProps {
  token: string;
}

export const AdminProjects: React.FC<AdminProjectsProps> = ({ token }) => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const url = `/api/admin/projects?search=${encodeURIComponent(search)}&category=${categoryFilter}&status=${statusFilter}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
      }
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [search, categoryFilter, statusFilter, token]);

  const handleSave = async (projectData: any) => {
    const isEdit = Boolean(editingProject?.id);
    const url = isEdit ? `/api/admin/projects/${editingProject.id}` : '/api/admin/projects';
    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(projectData)
    });

    if (!res.ok) {
      const json = await res.json();
      throw new Error(json.error || 'Failed to save project.');
    }

    setEditingProject(null);
    setIsCreatingNew(false);
    await loadProjects();
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        await loadProjects();
      }
    } catch (err) {
      console.error('Failed to delete project:', err);
    } finally {
      setDeletingId(null);
    }
  };

  // If creating new or editing
  if (isCreatingNew || editingProject) {
    return (
      <AdminProjectForm
        initialData={editingProject}
        onSave={handleSave}
        onCancel={() => {
          setIsCreatingNew(false);
          setEditingProject(null);
        }}
        token={token}
      />
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h2 className="text-2xl font-serif text-ivory-soft">
            Project Management
          </h2>
          <p className="text-xs text-stone-600 mt-0.5">
            Manage real JK Interior turnkeys and development concept studies.
          </p>
        </div>

        <button
          onClick={() => setIsCreatingNew(true)}
          className="px-4 py-2 bg-gold-500 hover:bg-gold-400 text-black text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5 shadow-md shadow-gold-500/15"
        >
          <Plus className="w-4 h-4" />
          <span>Add Project</span>
        </button>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects by title, precinct, or slug..."
            className="w-full bg-graphite border border-white/10 rounded-lg pl-10 pr-3.5 py-2 text-xs text-white placeholder-white/30 focus:border-gold-500 focus:outline-none"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-graphite border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-gold-500 focus:outline-none"
        >
          <option value="ALL">All Categories</option>
          <option value="Penthouse">Penthouse</option>
          <option value="Seafront Villa">Seafront Villa</option>
          <option value="Bespoke Residence">Bespoke Residence</option>
          <option value="Commercial Atelier">Commercial Atelier</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-graphite border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-gold-500 focus:outline-none"
        >
          <option value="ALL">All Statuses</option>
          <option value="PUBLISHED">Published</option>
          <option value="DRAFT">Draft</option>
        </select>
      </div>

      {/* Projects Table */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-gold-500 animate-spin mx-auto" />
          <p className="text-xs uppercase tracking-widest text-stone-700">Loading projects...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="py-16 text-center text-stone-700 space-y-3 bg-graphite rounded-xl border border-white/5 p-8">
          <FolderKanban className="w-8 h-8 text-gold-500/40 mx-auto" />
          <p className="text-base font-serif text-ivory-soft">No projects found.</p>
          <p className="text-xs text-warm-grey">Click "Add Project" to register your first turnkey architecture project.</p>
        </div>
      ) : (
        <div className="bg-graphite rounded-xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-taupe">
              <thead className="text-[10px] uppercase tracking-wider text-stone-700 bg-white/5 border-b border-white/5">
                <tr>
                  <th className="py-3.5 px-4">Project</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Photos</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {projects.map((proj) => {
                  const coverImg = proj.images?.find((i: any) => i.isCover) || proj.images?.[0];
                  return (
                    <tr key={proj.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={coverImg?.url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=200&q=80'}
                            alt={proj.title}
                            className="w-12 h-10 object-cover rounded bg-black/40 shrink-0"
                          />
                          <div>
                            <span className="font-serif text-sm text-ivory-soft block font-medium">
                              {proj.title}
                            </span>
                            <span className="text-[10px] font-mono text-stone-700">
                              /{proj.slug}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">{proj.category}</td>
                      <td className="py-3.5 px-4">{proj.location}</td>
                      <td className="py-3.5 px-4">
                        <span className="text-xs font-mono text-stone-500">
                          {proj.images?.length || 0}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono font-medium ${
                              proj.status === 'PUBLISHED'
                                ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                                : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                            }`}
                          >
                            {proj.status}
                          </span>
                          {proj.isConcept && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] uppercase font-mono bg-purple-500/10 text-purple-300 border border-purple-500/20">
                              Concept
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditingProject(proj)}
                            className="p-1.5 rounded hover:bg-white/10 text-white/70 hover:text-white"
                            title="Edit Project"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(proj.id, proj.title)}
                            disabled={deletingId === proj.id}
                            className="p-1.5 rounded hover:bg-red-500/20 text-red-400"
                            title="Delete Project"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
