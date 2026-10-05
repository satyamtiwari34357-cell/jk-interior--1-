import React, { useState, useEffect } from "react";
import {
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Factory,
  CheckCircle2,
} from "lucide-react";
import type { ServiceItem } from "../lib/data/servicesRepository.ts";
import { trackEvent } from "../lib/analytics.ts";
import { updatePageSeo } from "../lib/seo.ts";

interface ServiceDetailViewProps {
  slug: string;
  onBack: () => void;
  onOpenConsultationWithService: (serviceName: string) => void;
  onSelectServiceBySlug: (slug: string) => void;
}

export const ServiceDetailView: React.FC<ServiceDetailViewProps> = ({
  slug,
  onBack,
  onOpenConsultationWithService,
  onSelectServiceBySlug,
}) => {
  const [service, setService] = useState<ServiceItem | null>(null);
  const [otherServices, setOtherServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setOtherServices([]);

    fetch("/api/services")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && Array.isArray(data?.services)) {
          setOtherServices(
            data.services.filter((item: ServiceItem) => item.slug !== slug),
          );
        }
      })
      .catch(() => {
        if (isMounted) setOtherServices([]);
      });

    const loadService = async () => {
      try {
        const res = await fetch(`/api/services/${slug}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.service) {
            setService(data.service);
            trackEvent("service_view", { service: data.service.name });
            updatePageSeo({
              title: `${data.service.name} | JK Interior`,
              description: data.service.shortDescription,
              canonicalPath: `/services/${data.service.slug}`,
              breadcrumbs: [
                { name: "Home", url: "/" },
                { name: "Services", url: "/services" },
                {
                  name: data.service.name,
                  url: `/services/${data.service.slug}`,
                },
              ],
            });
            return;
          }
        }
      } catch (err) {
        console.warn("API service lookup skipped:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadService();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-center p-8">
        <div className="w-8 h-8 border-2 border-[#B7653F] border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="max-w-4xl mx-auto py-24 px-6 text-center space-y-6">
        <h2 className="text-3xl font-serif text-[#181816]">
          Service Discipline
        </h2>
        <p className="text-sm text-[#68645C]">
          The requested discipline could not be found.
        </p>
        <button
          onClick={onBack}
          className="px-6 py-2.5 bg-[#B7653F] text-white text-xs font-semibold uppercase tracking-wider rounded"
        >
          ← Return to Services
        </button>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-[#F5F2EB] text-[#181816] selection:bg-[#B7653F] selection:text-white pt-24 pb-20">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 mb-6">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs text-[#68645C]"
        >
          <button
            onClick={onBack}
            className="hover:text-[#181816] transition-colors"
          >
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-[#D2CBC0]" />
          <button
            onClick={onBack}
            className="hover:text-[#181816] transition-colors"
          >
            Services
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-[#D2CBC0]" />
          <span className="text-[#181816] font-medium truncate">
            {service.name}
          </span>
        </nav>
      </div>

      {/* Header & Hero */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#D2CBC0] pb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#B7653F] mb-3 font-medium">
              <span>Turnkey Discipline</span>
              <span>·</span>
              <span>Mumbai Atelier</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-[#181816] font-light leading-tight">
              {service.name}
            </h1>
          </div>

          <button
            onClick={() => onOpenConsultationWithService(service.name)}
            className="px-7 py-3.5 bg-[#B7653F] hover:bg-[#a15532] text-white text-xs font-semibold uppercase tracking-widest rounded transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-[#B7653F]/15 flex-shrink-0"
          >
            <span>Consult on {service.name}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Hero Image */}
        <div className="mt-8 relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-[#E9E3D8] border border-[#D2CBC0]">
          <img
            src={service.image}
            alt={service.name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Narrative & Atelier Standards */}
      <div className="max-w-4xl mx-auto px-6 md:px-10 space-y-12 mb-20">
        <div className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-serif text-[#181816]">
            {service.shortDescription}
          </h2>
          <p className="text-base text-[#68645C] leading-relaxed font-light">
            {service.description}
          </p>
        </div>

        {/* Workshop Guarantee */}
        <div className="p-8 rounded-xl bg-[#E9E3D8] border border-[#D2CBC0] space-y-4">
          <div className="flex items-center gap-2 text-[#B7653F]">
            <Factory className="w-5 h-5" />
            <span className="text-xs uppercase tracking-widest font-semibold">
              The In-House Guarantee
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#181816] leading-relaxed">
            All millwork, stone-dressing, and structural fit-outs for this
            discipline are fabricated inside our 40,000 sq.ft Lower Parel
            workshop under Kishorilal Sharma’s direct inspection with zero
            subcontracting.
          </p>
        </div>
      </div>

      {/* Other Disciplines */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 mb-16">
        <h3 className="text-xs uppercase tracking-[0.25em] text-[#B7653F] mb-6 font-semibold">
          Explore Other Studio Disciplines
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherServices.slice(0, 3).map((s) => (
            <div
              key={s.slug}
              onClick={() => onSelectServiceBySlug(s.slug)}
              className="p-6 rounded-lg bg-white border border-[#D2CBC0] hover:border-[#B7653F] transition-all cursor-pointer group"
            >
              <h4 className="text-lg font-serif text-[#181816] group-hover:text-[#B7653F] transition-colors">
                {s.name}
              </h4>
              <p className="text-xs text-[#68645C] mt-2 line-clamp-2">
                {s.shortDescription}
              </p>
              <span className="text-[11px] text-[#B7653F] mt-4 block font-medium">
                View Discipline Details →
              </span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
};
