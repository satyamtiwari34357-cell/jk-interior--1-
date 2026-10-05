import React, { useState, useEffect } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Search,
  Filter,
  Trash2,
  Eye,
  ExternalLink,
  Check,
  X,
  Loader2
} from 'lucide-react';

interface AdminMediaProps {
  token: string;
}

export const AdminMedia: React.FC<AdminMediaProps> = ({ token }) => {
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState('ALL');
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);
  const [uploading, setUploading] = useState(false);

  const loadMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/media?search=${encodeURIComponent(search)}&source=${sourceFilter}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMediaItems(data.media || []);
      }
    } catch (err) {
      console.error('Failed to load media:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, [search, sourceFilter, token]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      // 1. Request signature from server
      const sigRes = await fetch('/api/sign-cloudinary-params', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ folder: 'jk-interior/media' })
      });
      const sigData = await sigRes.json();

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        let assetUrl = '';
        let publicId = null;

        if (sigData.configured) {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('api_key', sigData.apiKey);
          formData.append('timestamp', sigData.timestamp.toString());
          formData.append('signature', sigData.signature);
          formData.append('folder', sigData.folder);

          const cRes = await fetch(`https://api.cloudinary.com/v1_1/${sigData.cloudName}/image/upload`, {
            method: 'POST',
            body: formData
          });

          if (cRes.ok) {
            const cJson = await cRes.json();
            assetUrl = cJson.secure_url || cJson.url;
            publicId = cJson.public_id;
          }
        } else {
          assetUrl = URL.createObjectURL(file);
        }

        if (assetUrl) {
          await fetch('/api/admin/media', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              url: assetUrl,
              publicId,
              filename: file.name,
              originalFilename: file.name,
              mimeType: file.type,
              format: file.name.split('.').pop() || 'jpg',
              source: 'JK_INTERIOR',
              folder: 'jk-interior/media'
            })
          });
        }
      }

      await loadMedia();
    } catch (err) {
      console.error('Media upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, publicId?: string) => {
    if (!window.confirm('Delete this media asset?')) return;
    try {
      const res = await fetch(`/api/admin/media/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ publicId })
      });
      if (res.ok) {
        setSelectedAsset(null);
        await loadMedia();
      }
    } catch (err) {
      console.error('Failed to delete media asset:', err);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h2 className="text-2xl font-serif text-[#fbf9f5]">
            Media Library & Cloudinary Assets
          </h2>
          <p className="text-xs text-[#9f9b90] mt-0.5">
            Cloud-hosted photography for project portfolios, joinery ateliers, and architectural references.
          </p>
        </div>

        <label className="px-4 py-2 bg-[#c5a880] hover:bg-[#d4b88f] text-black text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#c5a880]/15">
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          <span>{uploading ? 'Uploading...' : 'Upload Media'}</span>
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search assets by filename or alt description..."
            className="w-full bg-[#121319] border border-white/10 rounded-lg pl-10 pr-3.5 py-2 text-xs text-white placeholder-white/30 focus:border-[#c5a880] focus:outline-none"
          />
        </div>

        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          className="bg-[#121319] border border-white/10 rounded-lg px-3.5 py-2 text-xs text-white focus:border-[#c5a880] focus:outline-none"
        >
          <option value="ALL">All Media Sources</option>
          <option value="JK_INTERIOR">JK Interior (Approved)</option>
          <option value="INSPIRATION">Inspiration</option>
          <option value="CONCEPT">Concept Studies</option>
        </select>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-[#c5a880] animate-spin mx-auto" />
          <p className="text-xs uppercase tracking-widest text-[#8e8a7f]">Loading media assets...</p>
        </div>
      ) : mediaItems.length === 0 ? (
        <div className="py-16 text-center text-[#8e8a7f] space-y-3 bg-[#121319] rounded-xl border border-white/5 p-8">
          <ImageIcon className="w-8 h-8 text-[#c5a880]/40 mx-auto" />
          <p className="text-base font-serif text-[#fbf9f5]">No media found.</p>
          <p className="text-xs text-[#6e6a60]">Upload professional photography or connect your Cloudinary cloud.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {mediaItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedAsset(item)}
              className="group relative cursor-pointer aspect-square bg-[#14151b] border border-white/5 rounded-lg overflow-hidden hover:border-[#c5a880]/50 transition-all"
            >
              <img
                src={item.secureUrl || item.url}
                alt={item.alt || item.filename}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
                <span className="text-xs text-white font-medium truncate block">
                  {item.filename}
                </span>
                <span className="text-[10px] text-[#c5a880] font-mono block">
                  {item.format?.toUpperCase()} · {item.width}x{item.height}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Asset Detail Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-[#121319] border border-white/10 rounded-xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-serif text-[#fbf9f5] truncate">
                {selectedAsset.filename}
              </h3>
              <button
                onClick={() => setSelectedAsset(null)}
                className="p-1.5 rounded-full text-white/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">
              <div className="aspect-[4/3] rounded-lg overflow-hidden bg-black/50 border border-white/5">
                <img
                  src={selectedAsset.secureUrl || selectedAsset.url}
                  alt={selectedAsset.alt || selectedAsset.filename}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="space-y-3 text-xs text-[#cfc9be]">
                <div>
                  <span className="text-[10px] text-[#8e8a7f] uppercase block">Source Classification</span>
                  <span className="font-mono text-[#c5a880]">{selectedAsset.source || 'JK_INTERIOR'}</span>
                </div>

                <div>
                  <span className="text-[10px] text-[#8e8a7f] uppercase block">Dimensions & Format</span>
                  <span>{selectedAsset.width || 1600} x {selectedAsset.height || 1066} ({selectedAsset.format?.toUpperCase() || 'JPG'})</span>
                </div>

                {selectedAsset.publicId && (
                  <div>
                    <span className="text-[10px] text-[#8e8a7f] uppercase block">Cloudinary Public ID</span>
                    <span className="font-mono text-[11px] text-white/80 break-all">{selectedAsset.publicId}</span>
                  </div>
                )}

                <div>
                  <span className="text-[10px] text-[#8e8a7f] uppercase block">Direct URL</span>
                  <a
                    href={selectedAsset.secureUrl || selectedAsset.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#c5a880] hover:underline flex items-center gap-1 text-[11px] break-all"
                  >
                    <span>Open Full Resolution Asset</span>
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  </a>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <button
                    onClick={() => handleDelete(selectedAsset.id, selectedAsset.publicId)}
                    className="py-2 px-3 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded flex items-center gap-1.5 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Asset</span>
                  </button>

                  <button
                    onClick={() => setSelectedAsset(null)}
                    className="py-2 px-4 bg-white/10 hover:bg-white/20 text-white rounded text-xs"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
