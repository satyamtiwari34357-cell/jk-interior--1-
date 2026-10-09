import React, { useRef, useEffect } from 'react';
import { Award } from 'lucide-react';
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
          <div className="relative p-8 sm:p-10 rounded-xl bg-gradient-to-br from-graphite-deep via-graphite to-ink-soft border border-gold-500/30 shadow-2xl flex flex-col justify-between space-y-8">
            
            {/* Top Emblem & Kicker */}
            <div className="flex items-center justify-between border-b border-white/10 pb-6">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-gold-500 font-sans font-medium block">
                  The Studio
                </span>
                <h3 className="text-2xl font-serif text-ivory-soft mt-1">
                  Kishorilal Sharma
                </h3>
              </div>
            </div>

            {/* Signature Quote */}
            <div className="space-y-4">
              <p className="text-base sm:text-lg font-serif text-[#ede8de] leading-relaxed">JK Interior creates residential and commercial interiors across Mumbai.</p>
              <p className="text-xs text-stone-600">Kishorilal Sharma · JK Interior</p>
            </div>

            {/* Studio Workshop Principles */}
            <div className="pt-6 border-t border-white/10 grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[10px] uppercase text-[#7e7a70] block">Experience</span>
                <span className="text-[#ded9ce] font-medium mt-0.5 block">20+ years</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-[#7e7a70] block">Completed projects</span>
                <span className="text-[#ded9ce] font-medium mt-0.5 block">300+</span>
              </div>
            </div>

            {/* Terracotta signature accent line */}
            <div className="h-[2px] w-16 bg-gradient-to-r from-terracotta to-gold-500" />

          </div>
        </div>

        {/* Story Narrative */}
        <div ref={narrativeRef} className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-gold-500 font-medium">
            <Award className="w-3.5 h-3.5" />
              <span>JK Interior · Mumbai</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-ivory-soft font-light leading-tight">
            A studio for the spaces you use every day.
          </h2>

          <div className="space-y-4 text-sm text-stone-400 font-light leading-relaxed">
            <p>
              Kishorilal Sharma leads JK Interior, a Mumbai studio working across residential and commercial interiors.
            </p>
            <p>
              The studio brings more than 20 years of experience and has completed over 300 projects.
            </p>
            <p>
              Its team of approximately 30 people works with clients across Mumbai.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};
