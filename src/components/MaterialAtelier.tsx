import React, { useState } from 'react';
import { Sparkles, Layers, Check, Plus, Eye } from 'lucide-react';
import { MATERIALS } from '../data/materials.ts';
import { MaterialSwatch } from '../types.ts';

interface MaterialAtelierProps {
  selectedMaterialIds: string[];
  onToggleMaterial: (material: MaterialSwatch) => void;
  onOpenMoodboard: () => void;
}

export const MaterialAtelier: React.FC<MaterialAtelierProps> = ({
  selectedMaterialIds,
  onToggleMaterial,
  onOpenMoodboard
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [inspectedMaterial, setInspectedMaterial] = useState<MaterialSwatch | null>(null);

  const categories = ['All', 'Stone & Marble', 'Wood & Veneer', 'Metals', 'Plasters & Glass', 'Textiles'];

  const filteredMaterials = activeCategory === 'All'
    ? MATERIALS
    : MATERIALS.filter(m => m.category === activeCategory);

  return (
    <section id="atelier" className="py-24 px-6 md:px-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/10 pb-8">
        <div>
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-gold-500 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Virtual Sample Board</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-ivory-soft font-light">
            The Material Atelier
          </h2>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <p className="text-sm text-stone-500 max-w-md font-light leading-relaxed">
            Choose materials and add swatches to your moodboard to share the looks you like.
          </p>
          {selectedMaterialIds.length > 0 && (
            <button
              onClick={onOpenMoodboard}
              className="px-4 py-2 bg-white/10 hover:bg-gold-500 hover:text-black border border-white/10 text-xs font-semibold uppercase tracking-wider rounded transition-colors whitespace-nowrap flex items-center gap-2"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Review Palette ({selectedMaterialIds.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 text-xs uppercase tracking-wider rounded transition-all duration-200 whitespace-nowrap ${
              activeCategory === cat
                ? 'bg-gold-500 text-dark-900 font-semibold'
                : 'bg-white/5 text-stone-500 hover:text-ivory-soft hover:bg-white/10 border border-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Material Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMaterials.map((material) => {
          const isSelected = selectedMaterialIds.includes(material.id);
          return (
            <div
              key={material.id}
              className="group bg-graphite border border-white/10 hover:border-gold-500/60 rounded-lg overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl"
            >
              <div>
                {/* Material Texture Preview */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/40">
                  <img
                    src={material.imageUrl}
                    alt={material.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-graphite via-transparent to-transparent opacity-80" />
                  
                  {/* Origin tag */}
                  <span className="absolute top-3 left-3 px-2 py-0.5 text-[9px] uppercase tracking-wider bg-black/70 backdrop-blur-sm text-gold-400 rounded border border-white/10">
                    {material.origin}
                  </span>

                  {/* Inspect button */}
                  <button
                    onClick={() => setInspectedMaterial(material)}
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-white/70 hover:text-white hover:bg-black/90 transition-colors"
                    title="Inspect tactile specifications"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Details */}
                <div className="p-5 space-y-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-stone-700 block font-sans">
                      {material.finish}
                    </span>
                    <h3 className="text-lg font-serif text-ivory-soft group-hover:text-gold-500 transition-colors">
                      {material.name}
                    </h3>
                  </div>

                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {material.description}
                  </p>

                  <div className="pt-2 text-[11px] text-[#7a766c]">
                    <span className="text-stone-500 font-medium">Ideal For:</span> {material.idealApplication}
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="p-4 pt-0">
                <button
                  onClick={() => onToggleMaterial(material)}
                  className={`w-full py-2.5 px-4 text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 ${
                    isSelected
                      ? 'bg-gold-500 text-dark-900'
                      : 'bg-white/5 hover:bg-white/10 text-[#d8d4cb] border border-white/10'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>In Moodboard</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5 text-gold-500" />
                      <span>Add to Moodboard</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Inspect Modal */}
      {inspectedMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-graphite-strong border border-white/10 rounded-lg p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="aspect-[16/9] w-full rounded overflow-hidden">
              <img
                src={inspectedMaterial.imageUrl}
                alt={inspectedMaterial.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-gold-500">
                {inspectedMaterial.category} · {inspectedMaterial.origin}
              </span>
              <h3 className="text-2xl font-serif text-ivory-soft mt-1">
                {inspectedMaterial.name}
              </h3>
            </div>
            <div className="space-y-2 text-xs text-[#b8b4a8] leading-relaxed">
              <p>{inspectedMaterial.description}</p>
              <div className="p-3 rounded bg-white/5 border border-white/5">
                <span className="font-semibold text-gold-500 block mb-1">Tactile & Sensual Note:</span>
                {inspectedMaterial.tactileNote}
              </div>
              <p>
                <span className="font-semibold text-white">Recommended Application:</span>{' '}
                {inspectedMaterial.idealApplication}
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                onClick={() => setInspectedMaterial(null)}
                className="px-4 py-2 text-xs text-white/70 hover:text-white"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onToggleMaterial(inspectedMaterial);
                  setInspectedMaterial(null);
                }}
                className="px-5 py-2.5 bg-gold-500 hover:bg-gold-400 text-black text-xs font-semibold uppercase tracking-wider rounded"
              >
                {selectedMaterialIds.includes(inspectedMaterial.id) ? 'Remove from Board' : 'Add to Moodboard'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
