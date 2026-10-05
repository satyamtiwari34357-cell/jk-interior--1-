import React, { useRef, useEffect } from 'react';
import { ArrowRight, MessageSquare, Sparkles } from 'lucide-react';
import { trackEvent } from '../lib/analytics.ts';
import { gsap, ScrollTrigger, MOTION_TOKENS, isReducedMotion } from '../lib/motion.ts';

interface DarkCTAProps {
  onOpenConsultation: () => void;
}

export const DarkCTA: React.FC<DarkCTAProps> = ({ onOpenConsultation }) => {
  const ctaRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ctaRef.current || isReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.dark-cta-element',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: MOTION_TOKENS.ease.editorial,
          scrollTrigger: {
            trigger: ctaRef.current,
            start: 'top 80%',
            once: true
          }
        }
      );

      gsap.fromTo(
        '.dark-cta-line',
        { width: 0 },
        {
          width: 80,
          duration: 0.9,
          delay: 0.4,
          ease: MOTION_TOKENS.ease.editorial,
          scrollTrigger: {
            trigger: ctaRef.current,
            start: 'top 80%',
            once: true
          }
        }
      );
    }, ctaRef);

    return () => ctx.revert();
  }, []);

  const handleConsult = () => {
    trackEvent('consultation_form_started', { trigger: 'dark_cta' });
    onOpenConsultation();
  };

  const handleWhatsApp = () => {
    trackEvent('whatsapp_clicked', { source: 'dark_cta' });
  };

  return (
    <section
      ref={ctaRef}
      className="py-24 px-6 md:px-10 bg-[#1a1815] border-t border-white/5 relative overflow-hidden"
    >
      <div className="max-w-4xl mx-auto text-center space-y-6">
        
        {/* Subtle Eyebrow */}
        <div className="dark-cta-element inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#c5a880] font-medium">
          <Sparkles className="w-3.5 h-3.5 text-[#B7653F]" />
          <span>Begin Your Engagement</span>
        </div>

        {/* Headline */}
        <h2 className="dark-cta-element text-3xl sm:text-4xl md:text-5xl font-serif text-[#fbf9f5] font-light leading-tight">
          Ready to Realize Your Signature Residence?
        </h2>

        {/* Terracotta signature accent line */}
        <div className="dark-cta-line h-[2px] bg-[#B7653F] mx-auto" />

        {/* Narrative prose */}
        <p className="dark-cta-element text-sm sm:text-base text-[#b8b3a8] font-light max-w-2xl mx-auto leading-relaxed">
          Discuss your architectural layouts, material ambitions, and turnkey scope directly with Kishorilal Sharma and our senior design desk at our Sun Mill Compound atelier.
        </p>

        {/* Buttons with micro-interactions */}
        <div className="dark-cta-element pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleConsult}
            className="group w-full sm:w-auto px-8 py-3.5 bg-[#c5a880] hover:bg-[#d4b88f] text-[#0a0a0c] text-xs font-semibold uppercase tracking-widest rounded transition-all duration-300 flex items-center justify-center gap-2 shadow-xl shadow-[#c5a880]/15"
          >
            <span>Request Turnkey Consultation</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>

          <a
            href="https://wa.me/919820123456?text=Hello%20JK%20Interior%20Desk%2C%20I%20would%20like%20to%20discuss%20my%20interior%20project."
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleWhatsApp}
            className="group w-full sm:w-auto px-8 py-3.5 bg-white/5 hover:bg-white/10 text-white border border-white/15 hover:border-[#c5a880]/60 text-xs font-semibold uppercase tracking-widest rounded transition-all duration-300 flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4 text-[#25D366] transition-transform duration-300 group-hover:scale-110" />
            <span>Direct WhatsApp Concierge</span>
          </a>
        </div>

      </div>
    </section>
  );
};
