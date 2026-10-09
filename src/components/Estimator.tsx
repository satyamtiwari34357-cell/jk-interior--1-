import React, { useState, useMemo } from 'react';
import { Calculator, Check, ArrowRight, ShieldCheck, Sparkles, SlidersHorizontal } from 'lucide-react';

interface EstimatorProps {
  onOpenConsultationWithScope: (scopeDetails: {
    propertyType: string;
    carpetArea: string;
    tier: string;
    budget: string;
    timeline: string;
  }) => void;
}

export const Estimator: React.FC<EstimatorProps> = ({ onOpenConsultationWithScope }) => {
  const [propertyType, setPropertyType] = useState<string>('3-4 BHK Luxury Apartment');
  const [carpetArea, setCarpetArea] = useState<number>(2400);
  const [designTier, setDesignTier] = useState<'Signature' | 'Haute' | 'Presidential'>('Haute');
  
  // Optional add-ons
  const [inclusions, setInclusions] = useState({
    smartAutomation: true,
    italianKitchen: true,
    acousticEngineering: false,
    rareStoneBookmatch: true,
    customArtisanFurniture: true,
  });

  const propertyTypes = [
    '2-3 BHK Luxury Flat',
    '3-4 BHK Luxury Apartment',
    'Duplex / Penthouse',
    'Seafront Villa / Bungalow',
    'Boutique Office / Atelier'
  ];

  const tierDetails = {
    Signature: {
      name: 'Signature Turnkey',
      rate: 3800,
      description: 'Refined modern luxury featuring European veneers, fluted paneling, quartz counters, and premium architectural hardware.',
      timelineBaseMonths: 4,
    },
    Haute: {
      name: 'Haute Atelier',
      rate: 5800,
      description: 'Our most requested tier. Imported Italian Statuario/Calacatta, custom solid oak joinery from our Lower Parel workshop, and DALI-2 lighting.',
      timelineBaseMonths: 6,
    },
    Presidential: {
      name: 'Presidential Bespoke',
      rate: 8500,
      description: 'Ultra-luxury bespoke detailing. Monolithic architectural stone, hand-patinated bronze trims, acoustic suites, and museum-grade finishes.',
      timelineBaseMonths: 8,
    }
  };

  // Calculate pricing
  const calculation = useMemo(() => {
    const baseRate = tierDetails[designTier].rate;
    let multiplier = 1.0;
    if (inclusions.smartAutomation) multiplier += 0.08;
    if (inclusions.italianKitchen) multiplier += 0.07;
    if (inclusions.acousticEngineering) multiplier += 0.05;
    if (inclusions.rareStoneBookmatch) multiplier += 0.09;
    if (inclusions.customArtisanFurniture) multiplier += 0.06;

    const totalEstimate = Math.round(carpetArea * baseRate * multiplier);
    const lowEst = Math.round(totalEstimate * 0.95);
    const highEst = Math.round(totalEstimate * 1.1);

    // Format Indian numbering (Crores and Lakhs)
    const formatINR = (val: number) => {
      if (val >= 10000000) {
        return `₹${(val / 10000000).toFixed(2)} Cr`;
      }
      return `₹${(val / 100000).toFixed(1)} Lakhs`;
    };

    // Calculate months
    const areaFactor = carpetArea > 3500 ? 2 : carpetArea > 2000 ? 1 : 0;
    const totalMonths = tierDetails[designTier].timelineBaseMonths + areaFactor;

    return {
      formattedLow: formatINR(lowEst),
      formattedHigh: formatINR(highEst),
      rawTotal: totalEstimate,
      months: `${totalMonths} – ${totalMonths + 1.5} Months`,
      breakdown: {
        joinery: Math.round(totalEstimate * 0.35),
        civilAndStone: Math.round(totalEstimate * 0.28),
        kitchenAndBaths: Math.round(totalEstimate * 0.16),
        lightingAndAuto: Math.round(totalEstimate * 0.12),
        curationAndStyling: Math.round(totalEstimate * 0.09)
      }
    };
  }, [carpetArea, designTier, inclusions]);

  const toggleInclusion = (key: keyof typeof inclusions) => {
    setInclusions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleConsultation = () => {
    onOpenConsultationWithScope({
      propertyType,
      carpetArea: `${carpetArea} sq.ft`,
      tier: tierDetails[designTier].name,
      budget: `${calculation.formattedLow} – ${calculation.formattedHigh}`,
      timeline: calculation.months
    });
  };

  return (
    <section id="estimator" className="py-24 px-6 md:px-10 bg-ink-soft border-y border-white/5">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-gold-500 mb-3">
            <Calculator className="w-3.5 h-3.5" />
            <span>Interactive Estimator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-ivory-soft font-light">
            Turnkey Cost & Timeline Estimator
          </h2>
          <p className="mt-4 text-sm text-stone-500 font-light leading-relaxed">
            Gain immediate architectural transparency for your Mumbai residence. Tailored for turnkey scopes executed with in-house workshop joinery and master supervision.
          </p>
        </div>

        {/* Calculator Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Column */}
          <div className="lg:col-span-7 bg-graphite p-6 sm:p-8 rounded-xl border border-white/10 space-y-8">
            
            {/* 1. Property Type */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-taupe font-semibold mb-3">
                1. Property Typology
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {propertyTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setPropertyType(type)}
                    className={`p-3 text-xs text-left rounded border transition-all ${
                      propertyType === type
                        ? 'border-gold-500 bg-gold-500/10 text-ivory-soft font-medium'
                        : 'border-white/10 bg-white/5 text-stone-600 hover:text-ivory-soft hover:border-white/20'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Carpet Area Slider */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs uppercase tracking-wider text-taupe font-semibold flex items-center gap-2">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-gold-500" />
                  <span>2. Carpet Area (Sq.Ft)</span>
                </label>
                <span className="text-base font-serif text-gold-500 font-semibold">
                  {carpetArea.toLocaleString()} sq.ft
                </span>
              </div>
              <input
                type="range"
                min={800}
                max={7500}
                step={100}
                value={carpetArea}
                onChange={(e) => setCarpetArea(Number(e.target.value))}
                className="w-full h-1.5 bg-white/15 rounded-lg appearance-none cursor-pointer accent-[#c5a880]"
              />
              <div className="flex justify-between text-[11px] text-stone-800 mt-1.5">
                <span>800 sq.ft (Boutique)</span>
                <span>3,500 sq.ft (Duplex)</span>
                <span>7,500+ sq.ft (Villa/Estate)</span>
              </div>
            </div>

            {/* 3. Luxury Finish Tier */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-taupe font-semibold mb-3">
                3. Craftsmanship & Finish Tier
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(['Signature', 'Haute', 'Presidential'] as const).map((tierKey) => {
                  const t = tierDetails[tierKey];
                  const isSelected = designTier === tierKey;
                  return (
                    <div
                      key={tierKey}
                      onClick={() => setDesignTier(tierKey)}
                      className={`cursor-pointer p-4 rounded-lg border transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-gold-500 bg-graphite-deep shadow-lg ring-1 ring-gold-500'
                          : 'border-white/10 bg-white/5 opacity-80 hover:opacity-100 hover:border-white/20'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-serif text-ivory-soft font-medium">{t.name}</h4>
                          {isSelected && <Check className="w-4 h-4 text-gold-500" />}
                        </div>
                        <span className="text-xs text-gold-500 font-mono mt-1 block">
                          ~₹{t.rate}/sq.ft base
                        </span>
                        <p className="mt-2 text-[11px] text-[#9b978d] leading-relaxed">
                          {t.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4. Scope Customizations */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-taupe font-semibold mb-3">
                4. Turnkey Scope Customizations
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  onClick={() => toggleInclusion('rareStoneBookmatch')}
                  className={`p-2.5 px-3 rounded border text-xs text-left flex items-center justify-between transition-colors ${
                    inclusions.rareStoneBookmatch
                      ? 'border-gold-500/60 bg-gold-500/10 text-ivory-soft'
                      : 'border-white/10 bg-white/5 text-[#888479]'
                  }`}
                >
                  <span>Italian Bookmatched Marble Slabs</span>
                  {inclusions.rareStoneBookmatch && <Check className="w-3.5 h-3.5 text-gold-500" />}
                </button>

                <button
                  onClick={() => toggleInclusion('smartAutomation')}
                  className={`p-2.5 px-3 rounded border text-xs text-left flex items-center justify-between transition-colors ${
                    inclusions.smartAutomation
                      ? 'border-gold-500/60 bg-gold-500/10 text-ivory-soft'
                      : 'border-white/10 bg-white/5 text-[#888479]'
                  }`}
                >
                  <span>DALI-2 Lighting & Climate Automation</span>
                  {inclusions.smartAutomation && <Check className="w-3.5 h-3.5 text-gold-500" />}
                </button>

                <button
                  onClick={() => toggleInclusion('italianKitchen')}
                  className={`p-2.5 px-3 rounded border text-xs text-left flex items-center justify-between transition-colors ${
                    inclusions.italianKitchen
                      ? 'border-gold-500/60 bg-gold-500/10 text-ivory-soft'
                      : 'border-white/10 bg-white/5 text-[#888479]'
                  }`}
                >
                  <span>Chef’s Modular Island & Dry Bar</span>
                  {inclusions.italianKitchen && <Check className="w-3.5 h-3.5 text-gold-500" />}
                </button>

                <button
                  onClick={() => toggleInclusion('customArtisanFurniture')}
                  className={`p-2.5 px-3 rounded border text-xs text-left flex items-center justify-between transition-colors ${
                    inclusions.customArtisanFurniture
                      ? 'border-gold-500/60 bg-gold-500/10 text-ivory-soft'
                      : 'border-white/10 bg-white/5 text-[#888479]'
                  }`}
                >
                  <span>Bespoke Handcrafted Furniture Pieces</span>
                  {inclusions.customArtisanFurniture && <Check className="w-3.5 h-3.5 text-gold-500" />}
                </button>

                <button
                  onClick={() => toggleInclusion('acousticEngineering')}
                  className={`p-2.5 px-3 rounded border text-xs text-left flex items-center justify-between transition-colors sm:col-span-2 ${
                    inclusions.acousticEngineering
                      ? 'border-gold-500/60 bg-gold-500/10 text-ivory-soft'
                      : 'border-white/10 bg-white/5 text-[#888479]'
                  }`}
                >
                  <span>Acoustic Fluting & Private Home Theatre Shelling</span>
                  {inclusions.acousticEngineering && <Check className="w-3.5 h-3.5 text-gold-500" />}
                </button>
              </div>
            </div>

          </div>

          {/* Dynamic Summary Card */}
          <div className="lg:col-span-5 bg-gradient-to-b from-graphite-deep to-graphite p-6 sm:p-8 rounded-xl border border-gold-500/30 shadow-2xl space-y-6 sticky top-28">
            <div className="border-b border-white/10 pb-5">
              <span className="text-[11px] uppercase tracking-widest text-gold-500 block font-sans">
                Estimated Turnkey Investment
              </span>
              <div className="mt-2 text-3xl sm:text-4xl font-serif text-ivory-soft font-light">
                {calculation.formattedLow} <span className="text-xl text-stone-600">to</span> {calculation.formattedHigh}
              </div>
              <p className="text-xs text-[#8f8b80] mt-1">
                Estimated execution: <strong className="text-ivory">{calculation.months}</strong>
              </p>
            </div>

            {/* Scope Summary */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-[#888479]">Typology & Scale</span>
                <span className="text-porcelain font-medium">{propertyType} ({carpetArea} sq.ft)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-[#888479]">Execution Tier</span>
                <span className="text-gold-500 font-medium">{tierDetails[designTier].name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-[#888479]">Workshop Fabrication</span>
                <span className="text-porcelain">Lower Parel Atelier (JK In-House)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-[#888479]">Warranty & Snag Cover</span>
                <span className="text-porcelain">10-Year Structural & Joinery Warranty</span>
              </div>
            </div>

            {/* Approximate Allocation Split */}
            <div className="space-y-2 pt-2">
              <span className="text-[11px] uppercase tracking-wider text-[#888479] block">
                Estimated Budget Allocation
              </span>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between text-[#bbb7ad]">
                  <span>Bespoke Joinery, Wardrobes & Millwork (35%)</span>
                  <span>~₹{(calculation.breakdown.joinery / 100000).toFixed(1)}L</span>
                </div>
                <div className="flex justify-between text-[#bbb7ad]">
                  <span>Civil Restructuring, Marble & Flooring (28%)</span>
                  <span>~₹{(calculation.breakdown.civilAndStone / 100000).toFixed(1)}L</span>
                </div>
                <div className="flex justify-between text-[#bbb7ad]">
                  <span>Modular Kitchen, Bathrooms & Plumbing (16%)</span>
                  <span>~₹{(calculation.breakdown.kitchenAndBaths / 100000).toFixed(1)}L</span>
                </div>
                <div className="flex justify-between text-[#bbb7ad]">
                  <span>DALI Architectural Lighting & Automation (12%)</span>
                  <span>~₹{(calculation.breakdown.lightingAndAuto / 100000).toFixed(1)}L</span>
                </div>
                <div className="flex justify-between text-[#bbb7ad]">
                  <span>Soft Furnishings & Fine Curation (9%)</span>
                  <span>~₹{(calculation.breakdown.curationAndStyling / 100000).toFixed(1)}L</span>
                </div>
              </div>
            </div>

            {/* Kishorilal Sharma Quality Seal */}
            <div className="p-3 rounded bg-white/5 border border-white/10 flex items-start gap-3 text-xs text-stone-600">
              <ShieldCheck className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
              <span>
                Zero subcontracting guarantee. Supervised directly by Kishorilal Sharma with milestone-based stage billing and transparent material logs.
              </span>
            </div>

            {/* Action CTA */}
            <button
              onClick={handleConsultation}
              className="w-full py-4 bg-gold-500 hover:bg-gold-400 text-dark-900 text-xs font-semibold uppercase tracking-widest rounded transition-all duration-300 flex items-center justify-center gap-2 shadow-xl shadow-gold-500/15"
            >
              <span>Consult Studio With This Scope</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};
