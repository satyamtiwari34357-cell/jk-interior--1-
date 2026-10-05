import React, { useState, useEffect } from "react";
import { ArrowUpRight, MapPin, Compass } from "lucide-react";
import type { PublicProject } from "../lib/data/projectsRepository.ts";
import { trackEvent } from "../lib/analytics.ts";
import { updatePageSeo } from "../lib/seo.ts";

interface ProjectShowcaseProps {
  onInquireProject: (projectName: string) => void;
}

export const ProjectShowcase: React.FC<ProjectShowcaseProps> = ({
  onInquireProject,
}) => {
  const [realProjects, setRealProjects] = useState<PublicProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        if (data.projects && Array.isArray(data.projects)) {
          setRealProjects(data.projects);
        }
      })
      .catch((err) => {
        console.warn("Projects fetch failed:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const categories = [
    "All",
    "Residential",
    "Luxury Home",
    "Office",
    "Turnkey",
    "Custom Furniture",
  ];
  const filteredProjects =
    selectedCategory === "All"
      ? realProjects
      : realProjects.filter((p) =>
          p.category.toLowerCase().includes(selectedCategory.toLowerCase()),
        );

  return (
    <section
      id="projects"
      className="py-24 px-6 md:px-10 max-w-7xl mx-auto scroll-mt-20"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-white/10 pb-8">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#c5a880] block mb-2 font-medium">
            Turnkey Portfolio
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#fbf9f5] font-light">
            JK Interior Projects
          </h2>
          <p className="text-xs sm:text-sm text-[#9f9b90] mt-2 max-w-xl font-light">
            Explore selected residential and commercial interiors executed
            across South Mumbai, Bandra, Worli, and Juhu.
          </p>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-300 ${
              selectedCategory === cat
                ? "bg-[#B7653F] text-white shadow-md shadow-[#B7653F]/20"
                : "bg-white/5 text-[#9f9b90] hover:text-white hover:bg-white/10 border border-white/5"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Real Projects Display or Preparation State */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((proj) => (
            <div
              key={proj.id}
              onClick={() => {
                window.history.pushState(null, "", `/projects/${proj.slug}`);
                window.dispatchEvent(new PopStateEvent("popstate"));
              }}
              className="group bg-[#121319] border border-white/5 rounded-lg overflow-hidden flex flex-col justify-between hover:border-[#c5a880]/50 transition-all duration-300 relative cursor-pointer"
            >
              <div className="aspect-[4/3] bg-black/40 overflow-hidden relative">
                <img
                  src={proj.images[0]?.url || ""}
                  alt={proj.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-600 ease-out group-hover:scale-[1.03]"
                />
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-serif text-[#fbf9f5] group-hover:text-[#c5a880] transition-colors">
                  {proj.title}
                </h3>
                <p className="text-xs text-[#a09c91] mt-1 line-clamp-2">
                  {proj.shortDescription}
                </p>
                <div className="mt-3 text-[11px] text-[#c5a880] flex items-center gap-1 font-medium">
                  <span>View Project Details</span>
                  <span>→</span>
                </div>
              </div>
              {/* Subtle terracotta/gold accent line reveal */}
              <div className="h-[2px] w-0 group-hover:w-full bg-[#c5a880] transition-all duration-500" />
            </div>
          ))}
        </div>
      ) : realProjects.length > 0 ? (
        <div className="py-16 text-center space-y-3 border border-white/5 rounded-xl bg-white/[0.02]">
          <p className="text-sm text-[#9f9b90]">
            No projects found in the "{selectedCategory}" category.
          </p>
          <button
            onClick={() => setSelectedCategory("All")}
            className="text-xs text-[#c5a880] hover:underline font-medium"
          >
            ← View All Studio Projects
          </button>
        </div>
      ) : (
        /* Strict Rule Requirement: If no real projects are published, show: */
        <div className="my-12 p-8 sm:p-12 rounded-xl bg-[#121319] border border-white/10 text-center max-w-3xl mx-auto space-y-6">
          <div className="w-12 h-12 rounded-full bg-[#c5a880]/15 text-[#c5a880] flex items-center justify-center mx-auto">
            <Compass className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-serif text-[#fbf9f5]">
              JK Interior project portfolio is being prepared.
            </h3>
            <p className="text-xs sm:text-sm text-[#9f9b90] font-light max-w-lg mx-auto leading-relaxed">
              Our official photographic documentation of completed residential
              and commercial projects across Mumbai is currently being curated
              with client confidentiality agreements.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#inspiration"
              onClick={() =>
                trackEvent("project_filter_used", {
                  action: "explored_inspiration_from_projects",
                })
              }
              className="px-6 py-3 bg-[#c5a880] hover:bg-[#d4b88f] text-[#0a0a0c] text-xs font-semibold uppercase tracking-widest rounded transition-colors shadow-lg shadow-[#c5a880]/10"
            >
              Explore Design Inspiration (300+ References)
            </a>
          </div>
        </div>
      )}
    </section>
  );
};
