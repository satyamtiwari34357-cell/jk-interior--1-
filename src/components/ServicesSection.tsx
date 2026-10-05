import React, { useState, useEffect } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { ServiceItem } from "../lib/data/servicesRepository.ts";
import { trackEvent } from "../lib/analytics.ts";

interface ServicesSectionProps {
  onOpenConsultationWithService?: (serviceName: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onOpenConsultationWithService,
}) => {
  const [services, setServices] = useState<ServiceItem[]>([]);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/services")
      .then((res) => res.json())
      .then((data) => {
        if (
          isMounted &&
          data.services &&
          Array.isArray(data.services) &&
          data.services.length > 0
        ) {
          setServices(data.services);
        }
      })
      .catch((err) => {
        console.warn("Using local confirmed services fallback:", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleConsultService = (serviceName: string) => {
    trackEvent("service_view", { service: serviceName });
    if (onOpenConsultationWithService) {
      onOpenConsultationWithService(serviceName);
    }
  };

  if (services.length === 0) {
    return (
      <section
        id="services"
        className="py-24 px-6 md:px-10 max-w-7xl mx-auto scroll-mt-20"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-white/10 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#c5a880] mb-2 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Turnkey Disciplines</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#fbf9f5] font-light">
              Architectural Services
            </h2>
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#121319] p-8 text-center text-sm text-[#a09c91]">
          Service offerings will be published here once the studio profile is
          finalized.
        </div>
      </section>
    );
  }

  return (
    <section
      id="services"
      className="py-24 px-6 md:px-10 max-w-7xl mx-auto scroll-mt-20"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-white/10 pb-8">
        <div>
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#c5a880] mb-2 font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Turnkey Disciplines</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#fbf9f5] font-light">
            Architectural Services
          </h2>
        </div>
        <p className="text-sm text-[#a8a396] max-w-md font-light leading-relaxed">
          Six foundational practices executed under single-point accountability.
          Fabricated in our 40,000 sq.ft Lower Parel atelier with zero
          subcontracting.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, idx) => (
          <div
            key={service.slug}
            className="group bg-[#121319] hover:bg-[#151620] border border-white/5 rounded-lg overflow-hidden flex flex-col justify-between hover:border-[#c5a880]/50 transition-all duration-300 hover:shadow-2xl relative"
          >
            <div>
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/40">
                <img
                  src={service.image}
                  alt={service.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121319] via-transparent to-transparent opacity-85" />
                <span className="absolute top-3 left-3 text-xs font-mono text-[#c5a880] bg-black/70 px-2 py-0.5 rounded border border-white/10">
                  0{idx + 1}
                </span>
              </div>

              <div className="p-6 space-y-3">
                <h3 className="text-xl font-serif text-[#fbf9f5] group-hover:text-[#c5a880] transition-colors group-hover:translate-x-0.5 transform duration-300">
                  {service.name}
                </h3>
                <p className="text-xs text-[#a09c91] leading-relaxed font-light">
                  {service.shortDescription}
                </p>
                <p className="text-xs text-[#7d796f] leading-relaxed pt-1">
                  {service.description}
                </p>
              </div>
            </div>

            <div className="p-6 pt-0 space-y-2">
              <button
                onClick={() => handleConsultService(service.name)}
                className="group/btn w-full py-2.5 px-4 bg-[#B7653F] hover:bg-[#a15532] text-white border border-[#B7653F] text-xs font-semibold uppercase tracking-wider rounded transition-all duration-300 flex items-center justify-center gap-2 shadow-md shadow-[#B7653F]/15"
              >
                <span>Consult on {service.name}</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
              </button>

              <button
                type="button"
                onClick={() => {
                  window.history.pushState(
                    null,
                    "",
                    `/services/${service.slug}`,
                  );
                  window.dispatchEvent(new PopStateEvent("popstate"));
                }}
                className="w-full py-1.5 text-center text-[11px] text-[#a09c91] hover:text-[#c5a880] transition-colors"
              >
                View Discipline Details →
              </button>
            </div>

            {/* Subtle Accent Line Reveal */}
            <div className="h-[2px] w-0 group-hover:w-full bg-[#c5a880] transition-all duration-400" />
          </div>
        ))}
      </div>
    </section>
  );
};
