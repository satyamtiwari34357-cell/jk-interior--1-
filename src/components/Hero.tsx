import React, { useRef, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { trackEvent } from '../lib/analytics.ts';
import { gsap, ScrollTrigger, MOTION_TOKENS, isReducedMotion } from '../lib/motion.ts';

interface HeroProps {
  onOpenConsultation: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenConsultation }) => {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const bgImageRef = useRef<HTMLImageElement | null>(null);
  const textContentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!heroRef.current || isReducedMotion()) return;

    const ctx = gsap.context(() => {
      // 1. Entrance timeline
      const tl = gsap.timeline({ defaults: { ease: MOTION_TOKENS.ease.editorial } });

      tl.fromTo(
        '.hero-eyebrow',
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.7, delay: 0.1 }
      )
        .fromTo(
          '.hero-heading',
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.9 },
          '-=0.4'
        )
        .fromTo(
          '.hero-desc',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8 },
          '-=0.5'
        )
        .fromTo(
          '.hero-cta',
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.7 },
          '-=0.5'
        )
        .fromTo(
          '.hero-stats',
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.7 },
          '-=0.4'
        );

      // 2. Subtle scroll parallax on desktop only
      if (window.innerWidth >= 768 && bgImageRef.current && textContentRef.current) {
        gsap.to(bgImageRef.current, {
          yPercent: 12,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.5
          }
        });

        gsap.to(textContentRef.current, {
          y: -30,
          opacity: 0.85,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.5
          }
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 px-6 md:px-10 overflow-hidden"
    >
      {/* Background Image with Dark Vignette Gradient */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          ref={bgImageRef}
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=85"
          alt="Interior design inspiration reference image"
          width={1920}
          height={1080}
          fetchPriority="high"
          className="w-full h-full object-cover object-center brightness-[0.38] scale-105 will-change-transform"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian/80 via-transparent to-obsidian/80" />
        <span className="absolute bottom-3 right-4 z-10 text-[9px] uppercase tracking-wider text-ivory/70">Inspiration reference image</span>
      </div>

      <div
        ref={textContentRef}
        className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center will-change-transform"
      >
        {/* Eyebrow */}
        <div className="hero-eyebrow inline-flex items-center gap-3 text-xs md:text-sm uppercase tracking-[0.3em] text-gold-500 mb-6">
          <span>Mumbai · Interior Design Studio</span>
          <span className="w-1.5 h-1.5 rounded-full bg-gold-500/60" />
        </div>

        {/* Primary Editorial Title */}
        <h1 className="hero-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-ivory-soft font-light leading-[1.12] tracking-tight max-w-4xl">
          Spaces designed with purpose.<br />Interiors crafted with experience.
        </h1>

        {/* Descriptive Prose */}
        <p className="hero-desc mt-6 text-base sm:text-lg md:text-xl text-[#c2beaf] font-light max-w-2xl leading-relaxed">
          JK Interior creates residential and commercial interiors across Mumbai.
        </p>

        {/* Action Buttons with Micro-interactions */}
        <div className="hero-cta mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <a
            href="/projects"
            onClick={() => trackEvent('project_filter_used', { filter: 'hero_cta' })}
            className="group w-full sm:w-auto px-8 py-3.5 bg-gold-500 hover:bg-gold-400 text-dark-900 text-xs font-semibold uppercase tracking-widest rounded transition-all duration-300 flex items-center justify-center gap-2 shadow-xl shadow-gold-500/15"
          >
            <span>View Projects</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
          <button
            type="button"
            onClick={onOpenConsultation}
            className="group w-full sm:w-auto px-8 py-3.5 bg-white/5 hover:bg-white/10 text-ivory border border-white/15 hover:border-gold-500/60 text-xs font-semibold uppercase tracking-widest rounded transition-all duration-300 flex items-center justify-center gap-2"
          >
            <span>Book a Consultation</span>
          </button>
        </div>

        {/* Studio Pillars & Factual Metrics */}
        <div className="hero-stats mt-16 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-12 w-full text-left">
          <div className="space-y-1">
            <span className="text-2xl md:text-3xl font-serif text-ivory-soft font-light">20+</span>
            <span className="block text-[11px] uppercase tracking-wider text-stone-600">Years of Experience</span>
          </div>
          <div className="space-y-1">
            <span className="text-2xl md:text-3xl font-serif text-ivory-soft font-light">300+</span>
            <span className="block text-[11px] uppercase tracking-wider text-stone-600">Projects</span>
          </div>
          <div className="space-y-1">
            <span className="text-2xl md:text-3xl font-serif text-ivory-soft font-light">Mumbai</span>
            <span className="block text-[11px] uppercase tracking-wider text-stone-600">Based</span>
          </div>
        </div>

      </div>
    </section>
  );
};
