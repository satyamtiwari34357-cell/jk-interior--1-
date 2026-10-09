import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Maximize2,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  ChevronRight,
} from "lucide-react";
import type { PublicProject } from "../lib/data/projectsRepository.ts";
import { trackEvent } from "../lib/analytics.ts";
import { updatePageSeo } from "../lib/seo.ts";
import { usePublicSiteSettings, whatsappHref } from "../lib/publicSiteSettings.ts";

interface ProjectDetailViewProps {
  slug: string;
  onBack: () => void;
  onHome: () => void;
  onOpenConsultationWithProject: (projectName: string) => void;
  onSelectProjectBySlug: (slug: string) => void;
}

export const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({
  slug,
  onBack,
  onHome,
  onOpenConsultationWithProject,
  onSelectProjectBySlug,
}) => {
  const [project, setProject] = useState<PublicProject | null>(null);
  const [relatedProjects, setRelatedProjects] = useState<PublicProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const settings = usePublicSiteSettings();

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const loadProject = async () => {
      try {
        const res = await fetch(`/api/projects/${slug}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.project) {
            setProject(data.project);
            trackEvent("project_viewed", {
              title: data.project.title,
              category: data.project.category,
            });
            updatePageSeo({
              title: `${data.project.title} | JK Interior`,
              description:
                data.project.shortDescription ||
                `${data.project.title} turnkey interior architecture in ${data.project.location}.`,
              canonicalPath: `/projects/${data.project.slug}`,
              breadcrumbs: [
                { name: "Home", url: "/" },
                { name: "Projects", url: "/projects" },
                {
                  name: data.project.title,
                  url: `/projects/${data.project.slug}`,
                },
              ],
            });
          }
        } else {
          // If not found in API, check if it matches concept study
          if (isMounted) setProject(null);
        }

        // Fetch related projects
        const listRes = await fetch("/api/projects");
        if (listRes.ok) {
          const listData = await listRes.json();
          if (isMounted && listData.projects) {
            setRelatedProjects(
              listData.projects.filter((p: any) => p.slug !== slug).slice(0, 3),
            );
          }
        }
      } catch (err) {
        console.warn("Failed to load project details:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadProject();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center text-center p-8">
        <div className="space-y-4">
          <div className="w-10 h-10 border-2 border-terracotta border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs uppercase tracking-widest text-warm-grey">
            Opening project documentation...
          </p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto py-24 px-6 text-center space-y-6">
        <h2 className="text-3xl font-serif text-charcoal">
          Project Portfolio Notice
        </h2>
        <p className="text-sm text-warm-grey max-w-md mx-auto leading-relaxed">
          The requested project documentation is currently being curated or has
          been preserved under client privacy agreements.
        </p>
        <button
          onClick={onBack}
          className="px-6 py-2.5 bg-terracotta text-white text-xs font-semibold uppercase tracking-wider rounded"
        >
          ← Return to Projects
        </button>
      </div>
    );
  }

  const coverImage = project.images.find((img) => img.isCover) || project.images[0] || null;
  const projectWhatsApp = whatsappHref(
    settings.whatsapp,
    "Hello JK Interior, I liked this project and would like to discuss a similar interior.",
  );

  return (
    <article className="min-h-screen bg-ivory text-charcoal selection:bg-terracotta selection:text-white pt-24 pb-20">
      {/* 1. Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 mb-6">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs text-warm-grey"
        >
          <button
            onClick={onHome}
            className="hover:text-charcoal transition-colors"
          >
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-taupe" />
          <button
            onClick={onBack}
            className="hover:text-charcoal transition-colors"
          >
            Projects
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-taupe" />
          <span className="text-charcoal font-medium truncate">
            {project.title}
          </span>
        </nav>
      </div>

      {/* 2. Project Header & Hero */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-taupe pb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-terracotta mb-3 font-medium">
              <span>{project.category}</span>
              <span>·</span>
              <span>{project.location}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-charcoal font-light leading-tight">
              {project.title}
            </h1>
          </div>

          <button
            onClick={() => onOpenConsultationWithProject(project.title)}
            className="px-7 py-3.5 bg-terracotta hover:bg-terracotta-deep text-white text-xs font-semibold uppercase tracking-widest rounded transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-terracotta/15 shrink-0"
          >
            <span>Book a Consultation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Hero Image */}
        <div className="mt-8 relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-sand border border-taupe">
          {coverImage ? (
            <img
              src={coverImage.url}
              alt={coverImage.alt || project.title}
              fetchPriority="high"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-warm-grey">
              Project photography will be added here.
            </div>
          )}
        </div>
      </div>

      {/* 3. Project Facts Strip */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 mb-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 p-6 sm:p-8 rounded-xl bg-sand border border-taupe text-xs">
          <div>
            <span className="block text-[10px] uppercase text-warm-grey tracking-wider">
              Location
            </span>
            <span className="text-sm font-medium text-charcoal mt-1 block">
              {project.location}
            </span>
          </div>
          <div>
            <span className="block text-[10px] uppercase text-warm-grey tracking-wider">
              Property Scale
            </span>
            <span className="text-sm font-medium text-charcoal mt-1 block">
              {project.area || "Not provided"}
            </span>
          </div>
          <div>
            <span className="block text-[10px] uppercase text-warm-grey tracking-wider">
              Handover Year
            </span>
            <span className="text-sm font-medium text-charcoal mt-1 block">
              {project.year || "Not provided"}
            </span>
          </div>
          <div>
            <span className="block text-[10px] uppercase text-warm-grey tracking-wider">
              Turnkey Scope
            </span>
            <span className="text-sm font-medium text-charcoal mt-1 block">
              {project.scopeOfWork || "Not provided"}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Narrative, Concept & Materials */}
      <div className="max-w-5xl mx-auto px-6 md:px-10 space-y-16 mb-20">
        {/* Architectural Concept */}
        {project.concept && (
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-[0.25em] text-terracotta font-medium block">
              Architectural Concept
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-charcoal leading-relaxed font-light">
              {project.concept}
            </h2>
          </div>
        )}

        {/* Narrative Prose */}
        {project.fullDescription && (
          <div className="space-y-4 text-warm-grey text-sm sm:text-base leading-relaxed font-light">
            <p>{project.fullDescription}</p>
          </div>
        )}

        {/* Materials Palette */}
        {project.materials && project.materials.length > 0 && (
          <div className="p-8 rounded-xl bg-white border border-taupe space-y-4">
            <span className="text-xs uppercase tracking-[0.25em] text-terracotta font-medium block">
              Specified Materials & Finishes
            </span>
            <div className="flex flex-wrap gap-2.5 pt-2">
              {project.materials.map((mat, idx) => (
                <span
                  key={idx}
                  className="px-3.5 py-1.5 rounded-full bg-sand text-charcoal text-xs font-medium border border-taupe"
                >
                  {mat}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Full Gallery */}
        {project.images.length > 1 && (
          <div className="space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] text-terracotta font-medium block">
              Project Documentation Gallery
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative aspect-[4/3] rounded-lg overflow-hidden bg-sand border border-taupe"
                >
                  <img
                    src={img.url}
                    alt={img.alt || `${project.title} view ${idx + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  {img.caption && (
                    <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-xs p-3">
                      {img.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 5. Bottom Consultation Banner */}
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="p-10 rounded-2xl bg-espresso text-ivory flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs uppercase tracking-[0.25em] text-terracotta">Like this style?</span>
            <h3 className="text-2xl sm:text-3xl font-serif">Tell us about your space.</h3>
            <p className="text-xs sm:text-sm text-taupe max-w-xl font-light">We can discuss what may be possible for your project.</p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <button
              onClick={() => onOpenConsultationWithProject(project.title)}
              className="min-h-11 px-6 py-3.5 bg-terracotta hover:bg-terracotta-deep text-white text-xs font-semibold uppercase tracking-widest rounded transition-colors shadow-lg"
            >Book a Consultation</button>
            {projectWhatsApp && <a
              href={projectWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("whatsapp_clicked", { source: "project_detail" })}
              className="min-h-11 border border-white/30 px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-widest text-white"
            >WhatsApp Us</a>}
          </div>
        </div>
      </div>
    </article>
  );
};
