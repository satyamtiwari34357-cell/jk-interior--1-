import React from 'react';
import { X, Trash2, ArrowRight, Layers, Sparkles } from 'lucide-react';
import { MaterialSwatch } from '../types.ts';

interface MoodboardDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMaterials: MaterialSwatch[];
  onRemoveMaterial: (id: string) => void;
  onClearAll: () => void;
  onRequestSampleKit: (materialNames: string[]) => void;
}

export const MoodboardDrawer: React.FC<MoodboardDrawerProps> = ({
  isOpen,
  onClose,
  selectedMaterials,
  onRemoveMaterial,
  onClearAll,
  onRequestSampleKit
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#121319] border-l border-white/10 h-full flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#0e0f14]">
          <div className="flex items-center gap-2.5">
            <Layers className="w-4 h-4 text-[#c5a880]" />
            <div>
              <h3 className="text-base font-serif text-[#fbf9f5]">Your Curated Moodboard</h3>
              <span className="text-[10px] uppercase tracking-wider text-[#8e8a7f]">
                {selectedMaterials.length} Finishes Selected
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-white/60 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content List */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {selectedMaterials.length === 0 ? (
            <div className="py-20 text-center text-[#8e8a7f] space-y-3">
              <Sparkles className="w-8 h-8 text-[#c5a880]/50 mx-auto" />
              <p className="text-sm font-light">No material swatches added yet.</p>
              <p className="text-xs text-[#6e6a60]">
                Explore our Material Atelier and select marbles, smoked woods, and patinated metals to compose your bespoke palette.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedMaterials.map((mat) => (
                <div
                  key={mat.id}
                  className="flex items-center gap-3.5 p-3 rounded-lg bg-[#181920] border border-white/5 group"
                >
                  <img
                    src={mat.imageUrl}
                    alt={mat.name}
                    className="w-16 h-16 rounded object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] uppercase tracking-wider text-[#c5a880] block truncate">
                      {mat.category} · {mat.origin}
                    </span>
                    <h4 className="text-sm font-serif text-[#fbf9f5] truncate">{mat.name}</h4>
                    <p className="text-[10px] text-[#8e8a7f] truncate">{mat.finish}</p>
                  </div>
                  <button
                    onClick={() => onRemoveMaterial(mat.id)}
                    className="p-2 text-white/40 hover:text-red-400 transition-colors"
                    title="Remove from board"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {selectedMaterials.length > 0 && (
          <div className="p-6 border-t border-white/10 bg-[#0e0f14] space-y-3">
            <button
              onClick={() => {
                onRequestSampleKit(selectedMaterials.map(m => m.name));
                onClose();
              }}
              className="w-full py-3.5 bg-[#c5a880] hover:bg-[#d4b88f] text-[#0a0a0c] text-xs font-semibold uppercase tracking-widest rounded transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#c5a880]/15"
            >
              <span>Schedule Studio Tactile Review</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onClearAll}
              className="w-full py-2 text-xs text-[#8e8a7f] hover:text-white transition-colors text-center"
            >
              Clear Palette
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
