import React from 'react';
import { MapPin, Phone, Mail, Clock, ArrowUp, Instagram, Linkedin } from 'lucide-react';

interface FooterProps {
  onOpenConsultation: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenConsultation }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="bg-[#08080a] border-t border-white/10 text-[#ede9e1] pt-20 pb-12 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          
          {/* Brand Info */}
          <div className="lg:col-span-5 space-y-5">
            <div>
              <span className="text-2xl sm:text-3xl font-serif text-[#fbf9f5] font-semibold tracking-widest">
                JK INTERIOR
              </span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#c5a880] block font-sans mt-0.5">
                Mumbai · Estd. Kishorilal Sharma
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#9f9b90] font-light max-w-md leading-relaxed">
              Bespoke luxury interior design, architectural renovation, and turnkey joinery execution in Mumbai. Delivering residential sanctuaries for discerning patrons with unyielding craftsmanship.
            </p>
            <div className="pt-2">
              <button
                onClick={onOpenConsultation}
                className="px-6 py-3 bg-[#c5a880] hover:bg-[#d4b88f] text-[#0a0a0c] text-xs font-semibold uppercase tracking-widest rounded transition-colors shadow-lg shadow-[#c5a880]/10"
              >
                Schedule Studio Visitation
              </button>
            </div>
          </div>

          {/* Studio Coordinates */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-[#c5a880] font-medium">
              Atelier & Workshop Coordinates
            </h4>
            <div className="space-y-3 text-xs text-[#b8b4a7] font-light">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#c5a880] flex-shrink-0 mt-0.5" />
                <span>
                  JK Interior Atelier & Joinery Works<br />
                  Sun Mill Compound, Senapati Bapat Marg,<br />
                  Lower Parel West, Mumbai, Maharashtra 400013
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#c5a880] flex-shrink-0" />
                <a href="tel:+919820123456" className="hover:text-white transition-colors">
                  +91 98201 23456 / +91 22 2498 0000
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#c5a880] flex-shrink-0" />
                <a href="mailto:atelier@jkinterior.in" className="hover:text-white transition-colors">
                  atelier@jkinterior.in
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-[#c5a880] flex-shrink-0" />
                <span>Mon – Sat: 10:00 AM – 7:30 PM (By Appointment)</span>
              </div>
            </div>
          </div>

          {/* Quick Nav */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-[#c5a880] font-medium">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-[#9f9b90]">
              <li>
                <a href="#portfolio" className="hover:text-[#fbf9f5] transition-colors">
                  Masterworks Portfolio
                </a>
              </li>
              <li>
                <a href="#estimator" className="hover:text-[#fbf9f5] transition-colors">
                  Turnkey Cost Estimator
                </a>
              </li>
              <li>
                <a href="#atelier" className="hover:text-[#fbf9f5] transition-colors">
                  Virtual Material Atelier
                </a>
              </li>
              <li>
                <a href="#craftsmanship" className="hover:text-[#fbf9f5] transition-colors">
                  In-House Workshop Standard
                </a>
              </li>
              <li>
                <a href="#founder" className="hover:text-[#fbf9f5] transition-colors">
                  Kishorilal Sharma
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#706c62]">
          <div className="flex items-center gap-3">
            <span>© {new Date().getFullYear()} JK Interior Mumbai. Founded by Kishorilal Sharma. All Rights Reserved.</span>
            <span>·</span>
            <a href="#admin" className="hover:text-[#c5a880] transition-colors underline decoration-white/20">
              Studio CMS
            </a>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-[11px]">Precision Turnkey Interiors · Zero Subcontracting</span>
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
