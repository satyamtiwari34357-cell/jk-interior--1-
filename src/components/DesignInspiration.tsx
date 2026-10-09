import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Sparkles, Filter, Loader2, Compass, Layers } from 'lucide-react';
import { OnlineVisual, InspirationFilter, InspirationApiResponse } from '../types/visuals.ts';
import { ImageLightbox } from './ImageLightbox.tsx';

interface DesignInspirationProps {
  onOpenConsultationWithInspiration?: (conceptName: string) => void;
}

export const DesignInspiration: React.FC<DesignInspirationProps> = ({
  onOpenConsultationWithInspiration
}) => {
  const [filter, setFilter] = useState<InspirationFilter>('All');
  const [visuals, setVisuals] = useState<OnlineVisual[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(320);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filters: InspirationFilter[] = [
    'All',
    'Living',
    'Bedroom',
    'Kitchen',
    'Dining',
    'Office',
    'Commercial',
    'Furniture',
    'Lighting',
    'Materials',
    'Architecture'
  ];

  // Fetch visuals when filter changes
  useEffect(() => {
    let isMounted = true;
    const loadInitialData = async () => {
      setLoading(true);
      setPage(1);
      try {
        const res = await fetch(`/api/inspiration?filter=${encodeURIComponent(filter)}&page=1&limit=16`);
        if (res.ok) {
          const data: InspirationApiResponse = await res.json();
          if (isMounted) {
            setVisuals(data.items);
            setTotalCount(data.total);
            setHasMore(data.hasMore);
          }
        }
      } catch (err) {
        console.error('Failed to load inspiration visuals:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadInitialData();
    return () => {
      isMounted = false;
    };
  }, [filter]);

  // Load more pagination
  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    try {
      const res = await fetch(`/api/inspiration?filter=${encodeURIComponent(filter)}&page=${nextPage}&limit=16`);
      if (res.ok) {
        const data: InspirationApiResponse = await res.json();
        setVisuals(prev => [...prev, ...data.items]);
        setPage(nextPage);
        setHasMore(data.hasMore);
      }
    } catch (err) {
      console.error('Failed to load more visuals:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  // Lightbox handlers
  const activeVisual = lightboxIndex !== null ? visuals[lightboxIndex] : null;
  const handleNext = () => {
    if (lightboxIndex !== null && lightboxIndex < visuals.length - 1) {
      setLightboxIndex(lightboxIndex + 1);
    }
  };
  const handlePrev = () => {
    if (lightboxIndex !== null && lightboxIndex > 0) {
      setLightboxIndex(lightboxIndex - 1);
    }
  };

  return (
    <section id="inspiration" className="py-24 px-6 md:px-10 max-w-7xl mx-auto scroll-mt-20">
      
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/10 pb-8">
        <div>
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-gold-500 mb-2 font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Online Visuals</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-ivory-soft font-light">
            Design Inspiration
          </h2>
        </div>
        <div className="max-w-md space-y-2">
          <p className="text-sm text-stone-500 font-light leading-relaxed">
            Explore a collection of interior references and design ideas across residential and commercial spaces.
          </p>
          <div className="text-[11px] text-stone-700 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
            <span>Strictly concept inspiration. Not presented as completed JK Interior projects.</span>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={`px-4 py-2 text-xs uppercase tracking-wider rounded transition-all duration-200 whitespace-nowrap ${
              filter === f
                ? 'bg-gold-500 text-dark-900 font-semibold shadow-md shadow-gold-500/10'
                : 'bg-white/5 text-stone-500 hover:text-ivory-soft hover:bg-white/10 border border-white/5'
            } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-gold-500 animate-spin mx-auto" />
          <p className="text-xs uppercase tracking-widest text-stone-700">Loading inspiration collection...</p>
        </div>
      ) : visuals.length === 0 ? (
        <div className="py-20 text-center text-stone-700 space-y-3 bg-graphite rounded-xl border border-white/5 p-8">
          <p className="text-base font-serif text-ivory-soft">No visual references found in this category.</p>
          <p className="text-xs text-warm-grey">Select another category or view All to explore 300+ interior concepts.</p>
        </div>
      ) : (
        <>
          {/* Asymmetric Editorial Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {visuals.map((visual, idx) => {
              // Controlled asymmetry: every 5th item spans 2 columns on desktop for editorial rhythm
              const isFeatureCard = idx % 7 === 0;

              return (
                <button
                  key={visual.id}
                  type="button"
                  onClick={() => setLightboxIndex(idx)}
                  aria-label={`View inspiration: ${visual.alt}`}
                  className={`group relative w-full text-left cursor-pointer flex flex-col bg-graphite-lighter border border-white/5 rounded-lg overflow-hidden hover:border-gold-500/50 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 ${
                    isFeatureCard ? 'sm:col-span-2' : ''
                  }`}
                >
                  {/* Image Container with controlled aspect ratios */}
                  <div
                    className={`relative w-full overflow-hidden bg-black/40 ${
                      isFeatureCard
                        ? 'aspect-[16/9]'
                        : visual.orientation === 'portrait'
                        ? 'aspect-[3/4]'
                        : 'aspect-[4/3]'
                    }`}
                  >
                    <img
                      src={visual.thumbnailUrl}
                      alt={visual.alt}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121318] via-transparent to-transparent opacity-80" />

                    {/* Hover Overlay Arrow */}
                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/70 opacity-0 group-hover:opacity-100 group-hover:bg-gold-500 group-hover:text-black transition-all duration-300">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Card Content & Subtle Attribution */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-stone-700 block font-sans">
                        {visual.subcategory}
                      </span>
                      <h4 className="text-sm font-serif text-ivory-soft group-hover:text-gold-500 transition-colors mt-0.5 line-clamp-2">
                        {visual.alt}
                      </h4>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-[#7e7a70]">
                      <span className="truncate pr-2">
                        Photo by <span className="text-gold-500">{visual.photographer}</span>
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-[#9a958a] shrink-0">
                        Pexels
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Load More & Pagination Bar */}
          <div className="mt-14 flex flex-col items-center justify-center gap-4">
            <div className="text-xs text-stone-700">
              Showing {visuals.length} of {totalCount} curated inspiration references
            </div>

            {hasMore ? (
              <button
                type="button"
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="min-h-11 px-8 py-3.5 bg-white/5 hover:bg-white/10 active:scale-[0.99] border border-white/15 hover:border-gold-500/60 text-ivory text-xs font-semibold uppercase tracking-widest rounded transition-all duration-200 flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-gold-500" />
                    <span>Loading References...</span>
                  </>
                ) : (
                  <>
                    <Compass className="w-4 h-4 text-gold-500" />
                    <span>Load More References</span>
                  </>
                )}
              </button>
            ) : (
              <div className="text-xs text-[#7e7a70] py-2">
                All curated references loaded in this category.
              </div>
            )}
          </div>
        </>
      )}

      {/* Subtle Required Attribution Area */}
      <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7e7a70]">
        <div>
          <span>Photos provided by </span>
          <a
            href="https://www.pexels.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold-500 hover:underline font-medium"
          >
            Pexels
          </a>
          <span> under the Pexels license for architectural and interior inspiration.</span>
        </div>
        <div className="text-[11px]">
          Concept reference collection · 300+ items cached server-side
        </div>
      </div>

      {/* Consultation Conversion CTA */}
      <div className="mt-12 p-8 rounded-xl bg-gradient-to-r from-[#171822] via-[#14151b] to-[#171822] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl sm:text-2xl font-serif text-ivory-soft">
            Inspired by these concepts?
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 font-light mt-1">
            Tell us about the space you are planning and what you need help with.
          </p>
        </div>
        {onOpenConsultationWithInspiration && (
          <button
            type="button"
            onClick={() => onOpenConsultationWithInspiration('Design Inspiration Collection')}
            className="min-h-11 px-6 py-3 bg-gold-500 hover:bg-gold-400 active:scale-[0.99] text-dark-900 text-xs font-semibold uppercase tracking-widest rounded whitespace-nowrap transition-transform shadow-lg shadow-gold-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ivory"
          >
            Book a Consultation
          </button>
        )}
      </div>

      {/* Lightbox Viewer */}
      <ImageLightbox
        visual={activeVisual}
        onClose={() => setLightboxIndex(null)}
        onNext={handleNext}
        onPrev={handlePrev}
        hasPrev={lightboxIndex !== null && lightboxIndex > 0}
        hasNext={lightboxIndex !== null && lightboxIndex < visuals.length - 1}
        currentIndex={lightboxIndex ?? 0}
        totalCount={visuals.length}
      />
    </section>
  );
};
