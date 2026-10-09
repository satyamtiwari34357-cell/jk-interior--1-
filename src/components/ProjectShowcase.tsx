import React, { useState, useEffect } from "react";
import { Compass } from "lucide-react";
import type { PublicProject } from "../lib/data/projectsRepository.ts";
import { trackEvent } from "../lib/analytics.ts";
import { ProjectCard } from "./ProjectCard.tsx";
import { PROJECT_CATEGORIES } from "../data/customerExperience.ts";

interface ProjectShowcaseProps {
  onInquireProject: (projectName: string) => void;
  onOpenConsultation: () => void;
}

export const ProjectShowcase: React.FC<ProjectShowcaseProps> = ({
  onInquireProject,
  onOpenConsultation,
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
    ...PROJECT_CATEGORIES.filter((category) =>
      realProjects.some((project) =>
        project.category.toLowerCase().includes(category.toLowerCase()),
      ),
    ),
  ];

  const filteredProjects =
    selectedCategory === "All"
      ? realProjects
      : realProjects.filter((project) => {
          const categoryText = project.category?.toLowerCase() || "";
          return categoryText.includes(selectedCategory.toLowerCase());
        });

  const layoutClasses = [
    "md:col-span-7",
    "md:col-span-5",
    "md:col-span-6",
    "md:col-span-6",
    "md:col-span-5",
    "md:col-span-7",
  ];

  return (
    <section
      id="projects"
      className="scroll-mt-20 bg-dark-800 py-20 px-6 md:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-8 border-b border-taupe/30 pb-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl space-y-4">
            <span className="block text-[11px] font-medium uppercase tracking-[0.28em] text-terracotta">
              Projects
            </span>
            <h2 className="font-serif text-4xl text-ivory sm:text-5xl md:text-6xl">
              Find a project like yours.
            </h2>
            <p className="max-w-xl text-sm leading-relaxed text-ivory-muted md:text-base">
              Explore selected residential and commercial interior work by JK Interior.
            </p>
          </div>

          <div className="flex items-center gap-4 self-start rounded-full border border-taupe/40 bg-sand/5 px-5 py-3 text-ivory md:self-end">
            <div className="text-3xl font-light tracking-[-0.05em] text-ivory">
              300+
            </div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-ivory-muted">
              Completed Projects
            </div>
          </div>
        </div>

        <div role="group" aria-label="Filter projects by type" className="mb-8 flex items-center gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categories.map((category) => {
            const active = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => {
                  setSelectedCategory(category);
                  trackEvent("project_filter_used", { category });
                }}
                className={`whitespace-nowrap rounded-full border px-4 py-2 text-[11px] font-medium uppercase tracking-[0.18em] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-dark-800 ${
                  active
                    ? "border-terracotta bg-terracotta text-white shadow-[0_10px_30px_rgba(183,101,63,0.25)]"
                    : "border-taupe/25 bg-transparent text-sand-muted hover:border-taupe/60 hover:text-ivory"
                }`}
                aria-pressed={active}
              >
                {category}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center text-sm uppercase tracking-[0.22em] text-ivory-muted">
            Loading portfolio
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
            {filteredProjects.map((project, index) => (
              <div
                key={project.id}
                className={layoutClasses[index % layoutClasses.length]}
              >
                <ProjectCard
                  project={project}
                  projectNumber={index + 1}
                  variant={
                    index % 4 === 0
                      ? "featured"
                      : index % 3 === 1
                        ? "portrait"
                        : index % 3 === 2
                          ? "wide"
                          : "square"
                  }
                  onSelect={() => {
                    window.history.pushState(null, "", `/projects/${project.slug}`);
                    window.dispatchEvent(new PopStateEvent("popstate"));
                  }}
                  className="h-full"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="mx-auto my-8 max-w-3xl rounded-[1.75rem] border border-taupe/25 bg-graphite p-8 text-center sm:p-12">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-terracotta/10 text-terracotta">
              <Compass className="h-6 w-6" />
            </div>
            <h3 className="font-serif text-3xl text-ivory">
              JK Interior project portfolio is being prepared.
            </h3>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ivory-muted">
              Our official photographic documentation of completed residential and commercial projects is being curated with client confidentiality in mind.
            </p>
            <button
              type="button"
              onClick={onOpenConsultation}
              className="mt-6 min-h-11 rounded-lg bg-terracotta px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.2em] text-white transition-colors hover:bg-terracotta-royal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ivory"
            >
              Book a Consultation
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
