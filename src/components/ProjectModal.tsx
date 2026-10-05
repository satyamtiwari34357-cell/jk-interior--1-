import React, { useState, useEffect } from 'react';
import { X, MapPin, Calendar, Maximize2, Clock, CheckCircle2, Quote, ArrowRight } from 'lucide-react';
import { Project } from '../types.ts';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onInquire: (projectName: string) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  onClose,
  onInquire
}) => {
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#111216] border border-white/10 rounded-lg shadow-2xl text-[#ede9e1] my-8 max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0e0f13]">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-[#c5a880] block font-sans">
              {project.category} · {project.location}
            </span>
            <h2 className="text-xl sm:text-2xl font-serif text-[#fbf9f5] font-normal">
              {project.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/60 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-8 flex-1">
          {/* Main Visual Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-[16/9] w-full rounded-md overflow-hidden bg-black/60 border border-white/5">
              <img
                key={activeImageIdx}
                src={project.gallery[activeImageIdx] || project.heroImage}
                alt={project.title}
                className="w-full h-full object-cover transition-all duration-500 ease-out animate-in fade-in zoom-in-98"
              />
            </div>
            
            {/* Gallery Thumbnails */}
            {project.gallery.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {project.gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`relative w-20 h-14 rounded overflow-hidden flex-shrink-0 border-2 transition-all duration-300 ${
                      activeImageIdx === idx ? 'border-[#c5a880] opacity-100 scale-95' : 'border-transparent opacity-60 hover:opacity-100 hover:scale-100'
                    }`}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Architectural Metadata Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded bg-[#17181f] border border-white/5 text-xs text-[#b8b3a8]">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#c5a880] flex-shrink-0" />
              <div>
                <span className="block text-[10px] uppercase text-[#888377]">Location</span>
                <span className="text-[#f0ede6] font-medium">{project.location}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Maximize2 className="w-4 h-4 text-[#c5a880] flex-shrink-0" />
              <div>
                <span className="block text-[10px] uppercase text-[#888377]">Scale / Carpet</span>
                <span className="text-[#f0ede6] font-medium">{project.area}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#c5a880] flex-shrink-0" />
              <div>
                <span className="block text-[10px] uppercase text-[#888377]">Turnkey Execution</span>
                <span className="text-[#f0ede6] font-medium">{project.duration}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#c5a880] flex-shrink-0" />
              <div>
                <span className="block text-[10px] uppercase text-[#888377]">Handover Year</span>
                <span className="text-[#f0ede6] font-medium">{project.year}</span>
              </div>
            </div>
          </div>

          {/* Dual Narrative: Concept & Client Brief */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#c5a880]">
                Architectural Concept
              </h3>
              <p className="text-sm text-[#c5c0b5] leading-relaxed font-light">
                {project.architecturalConcept}
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#c5a880]">
                Client Brief & Mandate
              </h3>
              <p className="text-sm text-[#c5c0b5] leading-relaxed font-light">
                {project.clientBrief}
              </p>
            </div>
          </div>

          {/* Material Palette Used */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#f5f2eb]">
              Curated Material Palette
            </h3>
            <div className="flex flex-wrap gap-2 text-xs text-[#dcd7cd]">
              {project.materials.map((mat, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded bg-white/5 border border-white/10"
                >
                  {mat}
                </span>
              ))}
            </div>
          </div>

          {/* Craftsmanship & Precision Engineering */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#f5f2eb]">
              Joinery & Atelier Highlights
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#b8b3a8]">
              {project.craftHighlights.map((hl, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#c5a880] flex-shrink-0 mt-0.5" />
                  <span>{hl}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Testimonial Quote if present */}
          {project.testimonial && (
            <div className="p-5 rounded bg-gradient-to-r from-[#1b1c24] to-[#14151b] border-l-2 border-[#c5a880] space-y-3">
              <Quote className="w-6 h-6 text-[#c5a880]/60" />
              <p className="text-sm italic text-[#e6e2d9] font-serif leading-relaxed">
                "{project.testimonial.quote}"
              </p>
              <div className="text-xs text-[#9f9b90]">
                <strong className="text-[#f5f2eb] font-medium">{project.testimonial.author}</strong> · {project.testimonial.designation}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer CTA */}
        <div className="px-6 py-4 border-t border-white/10 bg-[#0e0f13] flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-[#9b978e]">
            Interested in bespoke execution of similar architectural caliber?
          </span>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-1/2 sm:w-auto px-4 py-2 text-xs text-white/70 hover:text-white transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onInquire(project.title);
              }}
              className="w-1/2 sm:w-auto px-5 py-2.5 bg-[#c5a880] hover:bg-[#d4b88f] text-[#0a0a0c] text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2"
            >
              <span>Consult On Similar Project</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
