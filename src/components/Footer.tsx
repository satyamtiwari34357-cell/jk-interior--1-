import React from 'react';
import { MapPin, Phone, Mail, ArrowUp, MessageSquare } from 'lucide-react';
import { phoneHref, usePublicSiteSettings, whatsappHref } from '../lib/publicSiteSettings.ts';
import { trackEvent } from '../lib/analytics.ts';

interface FooterProps {
  onOpenConsultation: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenConsultation }) => {
  const settings = usePublicSiteSettings();
  const callUrl = phoneHref(settings.phone);
  const whatsappUrl = whatsappHref(settings.whatsapp, 'Hello JK Interior, I would like to discuss my interior project.');
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className={`bg-dark-900 border-t border-white/10 text-porcelain pt-20 ${callUrl || whatsappUrl ? 'pb-24 md:pb-12' : 'pb-12'} px-6 md:px-10`}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          
          {/* Brand Info */}
          <div className="lg:col-span-5 space-y-5">
            <div>
              <span className="text-2xl sm:text-3xl font-serif text-ivory-soft font-semibold tracking-widest">
                {settings.studioName}
              </span>
              {settings.founderName && <span className="text-[10px] uppercase tracking-[0.25em] text-gold-500 block font-sans mt-0.5">Mumbai · {settings.founderName}</span>}
            </div>
            <p className="text-xs sm:text-sm text-stone-600 font-light max-w-md leading-relaxed">
              Residential and commercial interior design in {settings.serviceArea || 'Mumbai'}.
            </p>
            <div className="pt-2">
              <button
                onClick={onOpenConsultation}
                className="px-6 py-3 bg-gold-500 hover:bg-gold-400 text-dark-900 text-xs font-semibold uppercase tracking-widest rounded transition-colors shadow-lg shadow-gold-500/10"
              >
                Book a Consultation
              </button>
            </div>
          </div>

          {/* Studio Coordinates */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-gold-500 font-medium">
              Contact
            </h4>
            <div className="space-y-3 text-xs text-stone-400 font-light">
              {settings.address && <div className="flex items-start gap-3"><MapPin className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" /><span>{settings.address}</span></div>}
              {callUrl && <div className="flex items-center gap-3"><Phone className="w-4 h-4 text-gold-500 shrink-0" /><a href={callUrl} className="hover:text-white transition-colors">{settings.phone}</a></div>}
              {settings.email && <div className="flex items-center gap-3"><Mail className="w-4 h-4 text-gold-500 shrink-0" /><a href={`mailto:${settings.email}`} className="hover:text-white transition-colors">{settings.email}</a></div>}
              {whatsappUrl && <div className="flex items-center gap-3"><MessageSquare className="w-4 h-4 text-gold-500 shrink-0" /><a href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('whatsapp_clicked', { source: 'footer' })} className="hover:text-white transition-colors">WhatsApp the studio</a></div>}
            </div>
          </div>

          {/* Quick Nav */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-gold-500 font-medium">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-stone-600">
              <li><a href="/projects" className="hover:text-ivory-soft transition-colors">Projects</a></li>
              <li>
                <a href="#estimator" className="hover:text-ivory-soft transition-colors">
                  Budget Guidance
                </a>
              </li>
              <li>
                <a href="#atelier" className="hover:text-ivory-soft transition-colors">
                  Materials
                </a>
              </li>
              <li>
                <a href="#craftsmanship" className="hover:text-ivory-soft transition-colors">
                  How We Work
                </a>
              </li>
              <li>
                <a href="#founder" className="hover:text-ivory-soft transition-colors">
                  Kishorilal Sharma
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#706c62]">
          <div className="flex items-center gap-3">
            <span>© {new Date().getFullYear()} {settings.studioName}. All Rights Reserved.</span>
            <span>·</span>
            <a href="#admin" className="hover:text-gold-500 transition-colors underline decoration-white/20">
              Studio CMS
            </a>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-[11px]">Interior design · Mumbai</span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
              title="Return to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
