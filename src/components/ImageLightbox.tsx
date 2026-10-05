import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { OnlineVisual } from '../types/visuals.ts';

interface ImageLightboxProps {
  visual: OnlineVisual | null;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({
  visual,
  onClose,
  onNext,
  onPrev,
  hasPrev,
  hasNext
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && hasNext) onNext();
      if (e.key === 'ArrowLeft' && hasPrev) onPrev();
    };

    if (visual) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [visual, hasNext, hasPrev, onClose, onNext, onPrev]);

  if (!visual) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image Preview Lightbox"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
    >
      {/* Background click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-5xl bg-[#121318] border border-white/10 rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="px-5 py-3.5 border-b border-white/10 flex items-center justify-between bg-[#0e0f13]">
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 text-[9px] uppercase tracking-widest bg-white/5 text-[#c5a880] border border-white/10 rounded font-mono">
              {visual.category}
            </span>
            <span className="text-xs text-[#a09c91] hidden sm:inline">
              {visual.subcategory}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close image viewer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Image Display Area with Prev/Next Navigation */}
        <div className="relative flex-1 bg-black/60 flex items-center justify-center min-h-[320px] max-h-[68vh] overflow-hidden p-2 sm:p-6">
          <img
            src={visual.imageUrl}
            alt={visual.alt}
            className="max-h-[64vh] w-auto max-w-full object-contain rounded select-none shadow-2xl"
          />

          {/* Navigation Controls */}
          {hasPrev && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPrev();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 text-white/80 hover:text-white hover:bg-black/90 border border-white/10 transition-all"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {hasNext && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 text-white/80 hover:text-white hover:bg-black/90 border border-white/10 transition-all"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Bottom Metadata & Required Attribution Bar */}
        <div className="px-5 py-4 border-t border-white/10 bg-[#0e0f13] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div>
            <p className="text-sm font-serif text-[#fbf9f5] leading-snug">
              {visual.alt}
            </p>
            <div className="text-[#8e8a7f] text-[11px] mt-1 flex items-center gap-2 flex-wrap">
              <span>
                Photo by{' '}
                <a
                  href={visual.photographerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#c5a880] hover:underline font-medium"
                >
                  {visual.photographer}
                </a>
                {' '}on Pexels
              </span>
              <span>·</span>
              <span>Reference Idea for Turnkey Architecture</span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end flex-shrink-0">
            <a
              href={visual.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 rounded flex items-center gap-1.5 transition-colors text-[11px]"
            >
              <span>View on Pexels</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
