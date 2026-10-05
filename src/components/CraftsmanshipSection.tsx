import React, { useRef, useEffect } from 'react';
import { Factory } from 'lucide-react';
import { gsap, ScrollTrigger, MOTION_TOKENS, isReducedMotion } from '../lib/motion.ts';

export const CraftsmanshipSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const steps = [
    {
      num: '01',
      kicker: 'Discover',
      title: 'Spatial Discovery & Flow',
      desc: 'Deep inquiry into how your family lives, entertains, and retreats. Structural load-bearing assessments, natural daylight mapping, and ergonomic spatial flow modeling.'
    },
    {
      num: '02',
      kicker: 'Plan',
      title: '3D Photorealism & Palette',
      desc: 'Millimeter-accurate virtual renderings paired with physical full-scale stone, veneer, and fabric samples before a single piece of timber is cut.'
    },
    {
      num: '03',
      kicker: 'Design & Build',
      title: 'In-House Ateliers',
      desc: 'All joinery, fluted wall systems, custom wardrobes, and vanities are fabricated in our 40,000 sq.ft Lower Parel atelier using precision European CNC technology.'
    },
    {
      num: '04',
      kicker: 'Execute',
      title: 'White-Glove Turnkey Assembly',
      desc: 'Zero-dust site assembly. Factory-finished modular modules are transported and assembled on-site with zero-tolerance joints under direct master inspection.'
    },
    {
      num: '05',
      kicker: 'Deliver',
      title: 'Handover & Snag-Free Guarantee',
      desc: 'Comprehensive post-handover care. We stand behind every hinge, veneer finish, and water-seal with our signature JK decade-long craftsmanship warranty.'
    }
  ];

  useEffect(() => {
    if (!sectionRef.current || isReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.process-step-card',
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: MOTION_TOKENS.ease.editorial,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            once: true
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="craftsmanship"
      className="py-24 px-6 md:px-10 bg-[#0c0d12] border-t border-white/5 scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-white/10 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#c5a880] mb-2 font-medium">
              <Factory className="w-3.5 h-3.5" />
              <span>The Atelier Standard</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#fbf9f5] font-light">
              Crafted in Mumbai. Finished Without Compromise.
            </h2>
          </div>
          <p className="text-sm text-[#a8a396] max-w-md font-light leading-relaxed">
            Unlike design agencies that subcontract your home to third-party vendors, JK Interior owns the entire lifecycle from timber seasoning to final key handover.
          </p>
        </div>

        {/* 5-Step Process Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-16">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="process-step-card group p-6 rounded-lg bg-[#13141a] border border-white/5 flex flex-col justify-between hover:border-[#c5a880]/50 transition-all duration-300 relative overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-serif text-[#c5a880]/60 font-light block group-hover:text-[#c5a880] transition-colors">
                    {step.num}
                  </span>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#8e8a7f] bg-white/5 px-2 py-0.5 rounded">
                    {step.kicker}
                  </span>
                </div>
                <h3 className="text-base font-serif text-[#fbf9f5] mb-2 group-hover:text-[#c5a880] transition-colors">
                  {step.title}
                </h3>
                <p className="text-xs text-[#9c978b] leading-relaxed font-light">
                  {step.desc}
                </p>
              </div>

              <div className="pt-6 border-t border-white/5 mt-6 flex items-center gap-1.5 text-[10px] text-[#706c62]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c5a880]/50" />
                <span>Zero Subcontracting</span>
              </div>

              {/* Subtle Terracotta Accent Line on hover */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] w-0 group-hover:w-full bg-[#c5a880] transition-all duration-400" />
            </div>
          ))}
        </div>

        {/* Atelier Credentials Banner */}
        <div className="p-8 rounded-xl bg-gradient-to-r from-[#14151c] via-[#101117] to-[#0c0d12] border border-[#c5a880]/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-serif text-[#fbf9f5]">
              Sun Mill Atelier & Joinery Works
            </h3>
            <p className="text-xs text-[#9f9b90] mt-1 max-w-xl font-light leading-relaxed">
              Kishorilal Sharma personally supervises joinery mockups, veneer flitch matching, and marble book-matching at our Lower Parel workshops before dispatch to your residence.
            </p>
          </div>
          <a
            href="#contact"
            className="px-6 py-2.5 bg-white/5 hover:bg-[#c5a880] hover:text-black border border-white/10 text-xs font-semibold uppercase tracking-wider rounded transition-all duration-300 flex-shrink-0"
          >
            Visit Our Atelier
          </a>
        </div>

      </div>
    </section>
  );
};
