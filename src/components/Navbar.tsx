import React, { useState, useEffect } from 'react';
import { Layers, Menu, X, Phone, Sparkles } from 'lucide-react';
import { trackEvent } from '../lib/analytics.ts';

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

  const handleNavClick = (sectionName: string) => {
    setMobileMenuOpen(false);
    trackEvent('page_view', { page: sectionName });
    if (sectionName === 'home') {
      if (window.location.pathname !== '/' && window.location.pathname !== '') {
        window.history.pushState(null, '', '/');
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (window.location.pathname !== '/' && window.location.pathname !== '') {
      window.history.pushState(null, '', `/#${sectionName}`);
      window.dispatchEvent(new PopStateEvent('popstate'));
      setTimeout(() => {
        const el = document.getElementById(sectionName);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        isScrolled
          ? 'bg-[#0a0a0c]/90 backdrop-blur-md border-b border-white/5 py-4 shadow-2xl'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="#"
          onClick={() => handleNavClick('home')}
          className="group flex flex-col focus:outline-none focus:ring-1 focus:ring-[#c5a880] rounded"
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl md:text-3xl font-serif tracking-widest text-[#f5f2eb] font-semibold group-hover:text-[#c5a880] transition-colors">
              JK INTERIOR
            </span>
          </div>
          <span className="text-[10px] tracking-[0.25em] text-[#9b978e] uppercase font-sans -mt-0.5">
            Mumbai · Estd. Kishorilal Sharma
          </span>
        </a>

        {/* Desktop Nav with subtle hover interactions */}
        <nav className="hidden xl:flex items-center gap-7 text-xs uppercase tracking-widest text-[#b8b3a8]">
          <a
            href="#inspiration"
            onClick={() => handleNavClick('inspiration')}
            className="text-[#d4b88f] hover:text-[#f5f2eb] transition-colors py-1 relative hover:after:w-full after:w-0 after:h-[1px] after:bg-[#c5a880] after:absolute after:bottom-0 after:left-0 after:transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3 h-3 text-[#c5a880]" />
            <span>Inspiration</span>
          </a>
          <a
            href="#projects"
            onClick={() => handleNavClick('projects')}
            className="hover:text-[#f5f2eb] transition-colors py-1 relative hover:after:w-full after:w-0 after:h-[1px] after:bg-[#c5a880] after:absolute after:bottom-0 after:left-0 after:transition-all"
          >
            Projects
          </a>
          <a
            href="#services"
            onClick={() => handleNavClick('services')}
            className="hover:text-[#f5f2eb] transition-colors py-1 relative hover:after:w-full after:w-0 after:h-[1px] after:bg-[#c5a880] after:absolute after:bottom-0 after:left-0 after:transition-all"
          >
            Services
          </a>
          <a
            href="#estimator"
            onClick={() => handleNavClick('estimator')}
            className="hover:text-[#f5f2eb] transition-colors py-1 relative hover:after:w-full after:w-0 after:h-[1px] after:bg-[#c5a880] after:absolute after:bottom-0 after:left-0 after:transition-all"
          >
            Turnkey Estimator
          </a>
          <a
            href="#atelier"
            onClick={() => handleNavClick('atelier')}
            className="hover:text-[#f5f2eb] transition-colors py-1 relative hover:after:w-full after:w-0 after:h-[1px] after:bg-[#c5a880] after:absolute after:bottom-0 after:left-0 after:transition-all"
          >
            Atelier
          </a>
          <a
            href="#craftsmanship"
            onClick={() => handleNavClick('craftsmanship')}
            className="hover:text-[#f5f2eb] transition-colors py-1 relative hover:after:w-full after:w-0 after:h-[1px] after:bg-[#c5a880] after:absolute after:bottom-0 after:left-0 after:transition-all"
          >
            Craftsmanship
          </a>
          <a
            href="#founder"
            onClick={() => handleNavClick('founder')}
            className="hover:text-[#f5f2eb] transition-colors py-1 relative hover:after:w-full after:w-0 after:h-[1px] after:bg-[#c5a880] after:absolute after:bottom-0 after:left-0 after:transition-all"
          >
            Founder
          </a>
          <a
            href="#contact"
            onClick={() => handleNavClick('contact')}
            className="hover:text-[#f5f2eb] transition-colors py-1 relative hover:after:w-full after:w-0 after:h-[1px] after:bg-[#c5a880] after:absolute after:bottom-0 after:left-0 after:transition-all"
          >
            Studio
          </a>
        </nav>

        {/* Action Controls with Micro-interactions */}
        <div className="flex items-center gap-3">
          {/* Moodboard button */}
          <button
            onClick={() => {
              onOpenMoodboard();
              trackEvent('project_filter_used', { action: 'opened_moodboard' });
            }}
            className="relative p-2.5 rounded-full border border-white/10 hover:border-[#c5a880]/60 bg-white/5 hover:bg-white/10 transition-colors text-[#e8e4dc]"
            title="View Moodboard Palette"
          >
            <Layers className="w-4 h-4 text-[#c5a880]" />
            {moodboardCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#c5a880] text-black font-bold text-[9px] rounded-full flex items-center justify-center">
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
            className="group hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-[#c5a880] hover:bg-[#d4b88f] text-[#0a0a0c] text-xs font-semibold uppercase tracking-wider rounded transition-all duration-300 shadow-lg shadow-[#c5a880]/10 hover:shadow-[#c5a880]/20"
          >
            <Sparkles className="w-3.5 h-3.5 transition-transform duration-300 group-hover:scale-110" />
            <span>Consult Studio</span>
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 text-white/80 hover:text-white focus:outline-none"
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
          className="xl:hidden fixed inset-x-0 top-[73px] bottom-0 bg-[#0c0d10]/95 backdrop-blur-xl border-b border-white/10 px-6 py-8 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-top-4 duration-300 z-50"
        >
          <nav className="flex flex-col gap-4 text-sm uppercase tracking-widest text-[#cfc9be]">
            <a
              href="#inspiration"
              onClick={() => handleNavClick('inspiration')}
              className="text-[#d4b88f] py-2 border-b border-white/5 flex items-center justify-between"
            >
              <span>Design Inspiration (300+ References)</span>
              <Sparkles className="w-3.5 h-3.5" />
            </a>
            <a
              href="#projects"
              onClick={() => handleNavClick('projects')}
              className="hover:text-[#c5a880] py-2 border-b border-white/5"
            >
              JK Interior Projects
            </a>
            <a
              href="#services"
              onClick={() => handleNavClick('services')}
              className="hover:text-[#c5a880] py-2 border-b border-white/5"
            >
              Architectural Services
            </a>
            <a
              href="#estimator"
              onClick={() => handleNavClick('estimator')}
              className="hover:text-[#c5a880] py-2 border-b border-white/5"
            >
              Turnkey Estimator
            </a>
            <a
              href="#atelier"
              onClick={() => handleNavClick('atelier')}
              className="hover:text-[#c5a880] py-2 border-b border-white/5"
            >
              Material Atelier
            </a>
            <a
              href="#craftsmanship"
              onClick={() => handleNavClick('craftsmanship')}
              className="hover:text-[#c5a880] py-2 border-b border-white/5"
            >
              Craftsmanship & Workshop
            </a>
            <a
              href="#founder"
              onClick={() => handleNavClick('founder')}
              className="hover:text-[#c5a880] py-2 border-b border-white/5"
            >
              Kishorilal Sharma
            </a>
            <a
              href="#contact"
              onClick={() => handleNavClick('contact')}
              className="hover:text-[#c5a880] py-2 border-b border-white/5"
            >
              Studio Coordinates
            </a>
          </nav>

          <div className="pt-6 flex flex-col gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenConsultation();
                trackEvent('consultation_form_started', { trigger: 'mobile_menu' });
              }}
              className="w-full py-3.5 bg-[#c5a880] text-[#0a0a0c] text-xs font-semibold uppercase tracking-widest rounded text-center shadow-lg"
            >
              Book Private Consultation
            </button>
            <a
              href="tel:+919820123456"
              onClick={() => trackEvent('phone_clicked')}
              className="flex items-center justify-center gap-2 py-3 text-xs text-[#a09c93] border border-white/10 rounded"
            >
              <Phone className="w-3.5 h-3.5 text-[#c5a880]" />
              <span>Direct Studio Desk: +91 98201 23456</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
