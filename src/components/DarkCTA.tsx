import React, { useRef, useEffect } from 'react';
import { ArrowRight, MessageSquare, Sparkles } from 'lucide-react';
import { trackEvent } from '../lib/analytics.ts';
import { gsap, ScrollTrigger, MOTION_TOKENS, isReducedMotion } from '../lib/motion.ts';
import { usePublicSiteSettings, whatsappHref } from '../lib/publicSiteSettings.ts';

interface DarkCTAProps {
  onOpenConsultation: () => void;
}

export const DarkCTA: React.FC<DarkCTAProps> = ({ onOpenConsultation }) => {
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const settings = usePublicSiteSettings();
  const whatsappUrl = whatsappHref(settings.whatsapp, 'Hello JK Interior, I would like to discuss my interior project.');

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
        <div className="dark-cta-element inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-gold-500 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-terracotta" />
          <span>Begin Your Engagement</span>
        </div>

        {/* Headline */}
        <h2 className="dark-cta-element text-3xl sm:text-4xl md:text-5xl font-serif text-ivory-soft font-light leading-tight">
          Ready to Realize Your Signature Residence?
        </h2>

        {/* Terracotta signature accent line */}
        <div className="dark-cta-line h-[2px] bg-terracotta mx-auto" />

        {/* Narrative prose */}
        <p className="dark-cta-element text-sm sm:text-base text-stone-400 font-light max-w-2xl mx-auto leading-relaxed">
          Tell us about your space and what you need help with.
        </p>

        {/* Buttons with micro-interactions */}
        <div className="dark-cta-element pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleConsult}
            className="group w-full sm:w-auto px-8 py-3.5 bg-gold-500 hover:bg-gold-400 text-dark-900 text-xs font-semibold uppercase tracking-widest rounded transition-all duration-300 flex items-center justify-center gap-2 shadow-xl shadow-gold-500/15"
          >
            <span>Request Turnkey Consultation</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>

          {whatsappUrl && <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleWhatsApp}
            className="group w-full sm:w-auto px-8 py-3.5 bg-white/5 hover:bg-white/10 text-white border border-white/15 hover:border-gold-500/60 text-xs font-semibold uppercase tracking-widest rounded transition-all duration-300 flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4 text-[#25D366] transition-transform duration-300 group-hover:scale-110" />
            <span>Direct WhatsApp Concierge</span>
          </a>}
        </div>

      </div>
    </section>
  );
};
