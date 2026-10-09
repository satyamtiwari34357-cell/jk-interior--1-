import React, { useState, useEffect } from "react";
import {
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import type { ServiceItem } from "../lib/data/servicesRepository.ts";
import { trackEvent } from "../lib/analytics.ts";
import { updatePageSeo } from "../lib/seo.ts";
import { SERVICE_HELP } from "../data/customerExperience.ts";
import { usePublicSiteSettings, whatsappHref } from "../lib/publicSiteSettings.ts";

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
  const settings = usePublicSiteSettings();
  const serviceWhatsApp = whatsappHref(settings.whatsapp, `Hello JK Interior, I am interested in ${service?.name || "your interior services"}.`);

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
        <div className="w-8 h-8 border-2 border-terracotta border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="max-w-4xl mx-auto py-24 px-6 text-center space-y-6">
        <h2 className="text-3xl font-serif text-charcoal">
          Service Discipline
        </h2>
        <p className="text-sm text-warm-grey">
          The requested discipline could not be found.
        </p>
        <button
          onClick={onBack}
          className="px-6 py-2.5 bg-terracotta text-white text-xs font-semibold uppercase tracking-wider rounded"
        >
          ← Return to Services
        </button>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-ivory text-charcoal selection:bg-terracotta selection:text-white pt-24 pb-20">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 mb-6">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs text-warm-grey"
        >
          <button
            onClick={onBack}
            className="hover:text-charcoal transition-colors"
          >
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-taupe" />
          <button
            onClick={onBack}
            className="hover:text-charcoal transition-colors"
          >
            Services
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-taupe" />
          <span className="text-charcoal font-medium truncate">
            {service.name}
          </span>
        </nav>
      </div>

      {/* Header & Hero */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-taupe pb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-terracotta mb-3 font-medium">
              <span>Service</span>
              <span>·</span>
              <span>Mumbai</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-charcoal font-light leading-tight">
              {service.name}
            </h1>
          </div>

          <button
            onClick={() => onOpenConsultationWithService(service.name)}
            className="px-7 py-3.5 bg-terracotta hover:bg-terracotta-deep text-white text-xs font-semibold uppercase tracking-widest rounded transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-terracotta/15 shrink-0"
          >
            <span>Book a Consultation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          {serviceWhatsApp && <a href={serviceWhatsApp} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("whatsapp_clicked", { source: "service_detail" })} className="min-h-11 border border-taupe px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider">WhatsApp Us</a>}
        </div>

        {/* Hero Image */}
        <div className="mt-8 relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-sand border border-taupe">
          <img
            src={service.image}
            alt={`Service imagery for ${service.name}`}
            className="w-full h-full object-cover"
          />
          <span className="absolute bottom-3 left-3 rounded bg-black/70 px-2 py-1 text-[9px] uppercase tracking-wider text-white">Service imagery</span>
        </div>
      </div>

      {/* Narrative & Atelier Standards */}
      <div className="max-w-4xl mx-auto px-6 md:px-10 space-y-12 mb-20">
        <div className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-serif text-charcoal">{service.name}</h2>
          <p className="text-base text-warm-grey leading-relaxed font-light">{SERVICE_HELP[service.slug] || service.shortDescription}</p>
        </div>
      </div>

      {/* Other Disciplines */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 mb-16">
        <h3 className="text-xs uppercase tracking-[0.25em] text-terracotta mb-6 font-semibold">
          Explore Other Studio Disciplines
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherServices.slice(0, 3).map((s) => (
            <button
              type="button"
              key={s.slug}
              onClick={() => onSelectServiceBySlug(s.slug)}
              className="p-6 text-left rounded-lg bg-white border border-taupe hover:border-terracotta transition-all cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
            >
              <h4 className="text-lg font-serif text-charcoal group-hover:text-terracotta transition-colors">
                {s.name}
              </h4>
              <p className="text-xs text-warm-grey mt-2 line-clamp-2">
                {s.shortDescription}
              </p>
              <span className="text-[11px] text-terracotta mt-4 block font-medium">
                View Discipline Details →
              </span>
            </button>
          ))}
        </div>
      </div>
    </article>
  );
};
