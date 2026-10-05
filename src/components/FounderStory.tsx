import React, { useRef, useEffect } from 'react';
import { Award, Compass, HeartHandshake, ShieldCheck, Quote } from 'lucide-react';
import { gsap, ScrollTrigger, MOTION_TOKENS, isReducedMotion } from '../lib/motion.ts';

export const FounderStory: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const plaqueRef = useRef<HTMLDivElement | null>(null);
  const narrativeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!sectionRef.current || isReducedMotion()) return;

    const ctx = gsap.context(() => {
      // 1. Philosophy Plaque entrance
      if (plaqueRef.current) {
        gsap.fromTo(
          plaqueRef.current,
          { opacity: 0, x: -25 },
          {
            opacity: 1,
            x: 0,
            duration: 0.9,
            ease: MOTION_TOKENS.ease.editorial,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
              once: true
            }
          }
        );
      }

      // 2. Narrative entrance
      if (narrativeRef.current) {
        gsap.fromTo(
          narrativeRef.current.children,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: MOTION_TOKENS.ease.editorial,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              once: true
            }
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="founder"
      className="py-24 px-6 md:px-10 max-w-7xl mx-auto scroll-mt-20"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Architectural Atelier & Philosophy Plaque */}
        <div ref={plaqueRef} className="lg:col-span-5">
          <div className="relative p-8 sm:p-10 rounded-xl bg-gradient-to-br from-[#161720] via-[#121319] to-[#0e0f14] border border-[#c5a880]/30 shadow-2xl flex flex-col justify-between space-y-8">
            
            {/* Top Emblem & Kicker */}
            <div className="flex items-center justify-between border-b border-white/10 pb-6">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#c5a880] font-sans font-medium block">
                  Founding Philosophy
                </span>
                <h3 className="text-2xl font-serif text-[#fbf9f5] mt-1">
                  Kishorilal Sharma
                </h3>
              </div>
              <span className="text-xs font-mono text-[#c5a880] px-2.5 py-1 rounded bg-[#c5a880]/10 border border-[#c5a880]/20">
                Estd. 1999
              </span>
            </div>

            {/* Signature Quote */}
            <div className="space-y-4">
              <Quote className="w-8 h-8 text-[#c5a880]/50" />
              <blockquote className="text-base sm:text-lg font-serif italic text-[#ede8de] leading-relaxed">
                "A true luxury interior is not about superficial gilding; it is the silent integrity of seamless joints and materials that breathe with time."
              </blockquote>
              <div className="text-xs text-[#9f9b90]">
                <span className="text-[#c5a880] font-medium">— Kishorilal Sharma</span>, Master Craftsman & Founder
              </div>
            </div>

            {/* Studio Workshop Principles */}
            <div className="pt-6 border-t border-white/10 grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[10px] uppercase text-[#7e7a70] block">Atelier Location</span>
                <span className="text-[#ded9ce] font-medium mt-0.5 block">Sun Mill, Lower Parel</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-[#7e7a70] block">Supervision Policy</span>
                <span className="text-[#ded9ce] font-medium mt-0.5 block">Zero Subcontracting</span>
              </div>
            </div>

            {/* Terracotta signature accent line */}
            <div className="h-[2px] w-16 bg-gradient-to-r from-[#B7653F] to-[#c5a880]" />

          </div>
        </div>

        {/* Story Narrative */}
        <div ref={narrativeRef} className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#c5a880] font-medium">
            <Award className="w-3.5 h-3.5" />
            <span>The Founder’s Legacy</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#fbf9f5] font-light leading-tight">
            Craftsmanship Rooted in Truth to Materials
          </h2>

          <div className="space-y-4 text-sm text-[#b8b3a8] font-light leading-relaxed">
            <p>
              In a metropolis where speed often eclipses substance, Kishorilal Sharma established JK Interior with a resolute belief: that exceptional residences are born in the workshop, not merely on a rendering screen.
            </p>
            <p>
              Beginning over two decades ago crafting bespoke teak millwork for South Mumbai’s historic Art Deco apartments, Kishorilal honed an instinctive mastery of timber moisture equilibrium, natural stone veining, and micro-tolerance joinery.
            </p>
            <p>
              Today, JK Interior stands as a full-spectrum architecture and turnkey studio spanning 40,000 square feet of dedicated fabrication ateliers in Lower Parel. Kishorilal personally supervises every signature residence, maintaining a strict limit on concurrent projects to ensure uncompromised devotion.
            </p>
          </div>

          {/* 3 Core Values */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10 text-xs">
            <div className="space-y-1.5">
              <span className="text-sm font-serif text-[#fbf9f5] block">Direct Oversight</span>
              <p className="text-[#888479]">
                Kishorilal Sharma personally conducts weekly site reviews and joinery mockups.
              </p>
            </div>
            <div className="space-y-1.5">
              <span className="text-sm font-serif text-[#fbf9f5] block">Zero Compromise</span>
              <p className="text-[#888479]">
                Only certified European adhesives, Blum mechanics, and seasoned A-grade timbers.
              </p>
            </div>
            <div className="space-y-1.5">
              <span className="text-sm font-serif text-[#fbf9f5] block">Snag-Free Delivery</span>
              <p className="text-[#888479]">
                3-stage internal snag audit before client walkthrough and key handover.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
