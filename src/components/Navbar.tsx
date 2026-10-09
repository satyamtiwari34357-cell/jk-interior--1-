import React, { useState, useEffect } from 'react';
import { Layers, Menu, X, Phone, Sparkles, MessageSquare } from 'lucide-react';
import { trackEvent } from '../lib/analytics.ts';
import { phoneHref, usePublicSiteSettings, whatsappHref } from '../lib/publicSiteSettings.ts';

interface NavbarProps {
  onOpenConsultation: () => void;
  onOpenMoodboard: () => void;
  moodboardCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenConsultation,
  onOpenMoodboard,
  moodboardCount
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuButtonRef = React.useRef<HTMLButtonElement>(null);
  const settings = usePublicSiteSettings();
  const callUrl = phoneHref(settings.phone);
  const whatsappUrl = whatsappHref(settings.whatsapp, 'Hello JK Interior, I would like to discuss my interior project.');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Escape key handler & body scroll lock for mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (sectionName: string, event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setMobileMenuOpen(false);
    trackEvent('page_view', { page: sectionName });
    if (sectionName === 'home') {
      window.history.pushState(null, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    window.history.pushState(null, '', `/#${sectionName}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.setTimeout(() => {
      document.getElementById(sectionName)?.scrollIntoView({ behavior: 'smooth' });
      if (menuButtonRef.current && mobileMenuOpen) menuButtonRef.current.focus();
    }, 100);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        isScrolled
          ? 'bg-dark-900/90 backdrop-blur-md border-b border-white/5 py-4 shadow-2xl'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="/"
          onClick={(event) => handleNavClick('home', event)}
          className="group flex flex-col focus:outline-none focus:ring-1 focus:ring-gold-500 rounded"
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl md:text-3xl font-serif tracking-widest text-ivory font-semibold group-hover:text-gold-500 transition-colors">
              JK INTERIOR
            </span>
          </div>
          <span className="text-[10px] tracking-[0.25em] text-[#9b978e] uppercase font-sans -mt-0.5">
            Mumbai · Kishorilal Sharma
          </span>
        </a>

        {/* Desktop Nav with subtle hover interactions */}
        <nav className="hidden xl:flex items-center gap-7 text-xs uppercase tracking-widest text-stone-400">
          <a
            href="#inspiration"
            onClick={(event) => handleNavClick('inspiration', event)}
            className="text-gold-400 hover:text-ivory transition-colors py-1 relative hover:after:w-full after:w-0 after:h-[1px] after:bg-gold-500 after:absolute after:bottom-0 after:left-0 after:transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3 h-3 text-gold-500" />
            <span>Inspiration</span>
          </a>
          <a
            href="#projects"
            onClick={(event) => handleNavClick('projects', event)}
            className="hover:text-ivory transition-colors py-1 relative hover:after:w-full after:w-0 after:h-[1px] after:bg-gold-500 after:absolute after:bottom-0 after:left-0 after:transition-all"
          >
            Projects
          </a>
          <a
            href="#services"
            onClick={(event) => handleNavClick('services', event)}
            className="hover:text-ivory transition-colors py-1 relative hover:after:w-full after:w-0 after:h-[1px] after:bg-gold-500 after:absolute after:bottom-0 after:left-0 after:transition-all"
          >
            Services
          </a>
          <a
            href="#estimator"
            onClick={(event) => handleNavClick('estimator', event)}
            className="hover:text-ivory transition-colors py-1 relative hover:after:w-full after:w-0 after:h-[1px] after:bg-gold-500 after:absolute after:bottom-0 after:left-0 after:transition-all"
          >
            Budget Guidance
          </a>
          <a
            href="#atelier"
            onClick={(event) => handleNavClick('atelier', event)}
            className="hover:text-ivory transition-colors py-1 relative hover:after:w-full after:w-0 after:h-[1px] after:bg-gold-500 after:absolute after:bottom-0 after:left-0 after:transition-all"
          >
            Atelier
          </a>
          <a
            href="#craftsmanship"
            onClick={(event) => handleNavClick('craftsmanship', event)}
            className="hover:text-ivory transition-colors py-1 relative hover:after:w-full after:w-0 after:h-[1px] after:bg-gold-500 after:absolute after:bottom-0 after:left-0 after:transition-all"
          >
            How We Work
          </a>
          <a
            href="#founder"
            onClick={(event) => handleNavClick('founder', event)}
            className="hover:text-ivory transition-colors py-1 relative hover:after:w-full after:w-0 after:h-[1px] after:bg-gold-500 after:absolute after:bottom-0 after:left-0 after:transition-all"
          >
            Founder
          </a>
          <a
            href="#contact"
            onClick={(event) => handleNavClick('contact', event)}
            className="hover:text-ivory transition-colors py-1 relative hover:after:w-full after:w-0 after:h-[1px] after:bg-gold-500 after:absolute after:bottom-0 after:left-0 after:transition-all"
          >
            Studio
          </a>
        </nav>

        {/* Action Controls with Micro-interactions */}
        <div className="flex items-center gap-3">
          {whatsappUrl && <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('whatsapp_clicked', { source: 'header' })} aria-label="Contact JK Interior on WhatsApp" className="hidden md:inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/10 p-2.5 text-ivory hover:border-gold-500/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"><MessageSquare className="h-4 w-4" /></a>}
          {/* Moodboard button */}
          <button
            onClick={() => {
              onOpenMoodboard();
              trackEvent('project_filter_used', { action: 'opened_moodboard' });
            }}
            type="button"
            aria-label="Open moodboard palette"
            className="relative p-2.5 rounded-full border border-white/10 hover:border-gold-500/60 bg-white/5 hover:bg-white/10 transition-colors text-[#e8e4dc]"
            title="View Moodboard Palette"
          >
            <Layers className="w-4 h-4 text-gold-500" />
            {moodboardCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-gold-500 text-black font-bold text-[9px] rounded-full flex items-center justify-center">
                {moodboardCount}
              </span>
            )}
          </button>

          {/* Quick Consultation CTA */}
          <button
            onClick={() => {
              onOpenConsultation();
              trackEvent('consultation_form_started', { trigger: 'navbar_cta' });
            }}
            className="group hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-gold-500 hover:bg-gold-400 text-dark-900 text-xs font-semibold uppercase tracking-wider rounded transition-all duration-300 shadow-lg shadow-gold-500/10 hover:shadow-gold-500/20"
          >
            <Sparkles className="w-3.5 h-3.5 transition-transform duration-300 group-hover:scale-110" />
            <span>Consult Studio</span>
          </button>

          {/* Mobile hamburger */}
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden min-h-11 min-w-11 p-2 text-white/80 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer with Smooth Transitions */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          className="xl:hidden fixed inset-x-0 top-[73px] bottom-0 bg-obsidian/95 backdrop-blur-xl border-b border-white/10 px-6 py-8 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-top-4 duration-300 z-50"
        >
          <nav className="flex flex-col gap-4 text-sm uppercase tracking-widest text-taupe">
            <a
              href="#inspiration"
              onClick={(event) => handleNavClick('inspiration', event)}
              className="text-gold-400 py-2 border-b border-white/5 flex items-center justify-between"
            >
              <span>Design Inspiration</span>
              <Sparkles className="w-3.5 h-3.5" />
            </a>
            <a
              href="#projects"
              onClick={(event) => handleNavClick('projects', event)}
              className="hover:text-gold-500 py-2 border-b border-white/5"
            >
              Projects
            </a>
            <a
              href="#services"
              onClick={(event) => handleNavClick('services', event)}
              className="hover:text-gold-500 py-2 border-b border-white/5"
            >
              Services
            </a>
            <a
              href="#estimator"
              onClick={(event) => handleNavClick('estimator', event)}
              className="hover:text-gold-500 py-2 border-b border-white/5"
            >
              Budget Guidance
            </a>
            <a
              href="#atelier"
              onClick={(event) => handleNavClick('atelier', event)}
              className="hover:text-gold-500 py-2 border-b border-white/5"
            >
              Materials
            </a>
            <a
              href="#craftsmanship"
              onClick={(event) => handleNavClick('craftsmanship', event)}
              className="hover:text-gold-500 py-2 border-b border-white/5"
            >
              How We Work
            </a>
            <a
              href="#founder"
              onClick={(event) => handleNavClick('founder', event)}
              className="hover:text-gold-500 py-2 border-b border-white/5"
            >
              Kishorilal Sharma
            </a>
            <a
              href="#contact"
              onClick={(event) => handleNavClick('contact', event)}
              className="hover:text-gold-500 py-2 border-b border-white/5"
            >
              Contact
            </a>
          </nav>

          <div className="pt-6 flex flex-col gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenConsultation();
                trackEvent('consultation_form_started', { trigger: 'mobile_menu' });
              }}
              className="w-full py-3.5 bg-gold-500 text-dark-900 text-xs font-semibold uppercase tracking-widest rounded text-center shadow-lg"
            >
              Book Private Consultation
            </button>
            {callUrl && <a href={callUrl} onClick={() => trackEvent('phone_clicked')} className="flex items-center justify-center gap-2 py-3 text-xs text-[#a09c93] border border-white/10 rounded"><Phone className="w-3.5 h-3.5 text-gold-500" /><span>Call the studio</span></a>}
            {whatsappUrl && <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('whatsapp_clicked', { source: 'mobile_menu' })} className="flex items-center justify-center gap-2 py-3 text-xs text-[#a09c93] border border-white/10 rounded"><MessageSquare className="w-3.5 h-3.5 text-gold-500" /><span>Message on WhatsApp</span></a>}
          </div>
        </div>
      )}
    </header>
  );
};
