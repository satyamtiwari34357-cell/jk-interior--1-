import React from "react";
import { ArrowUpRight } from "lucide-react";
import type { PublicProject } from "../lib/data/projectsRepository.ts";

interface ProjectCardProps {
  project: PublicProject;
  projectNumber: number;
  variant?: "featured" | "portrait" | "wide" | "square";
  onSelect: () => void;
  className?: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  projectNumber,
  variant = "featured",
  onSelect,
  className = "",
}) => {
  const image =
    project.images.find((img) => img.isCover) || project.images[0] || null;
  const number = String(projectNumber).padStart(2, "0");
  const highlight = project.category || "Interior Project";
  const fallbackLabel = project.isConcept ? "CONCEPT VISUAL" : "PROJECT IMAGE";

  const imageClasses = {
    featured: "aspect-[4/3]",
    portrait: "aspect-[3/4]",
    wide: "aspect-[16/9]",
    square: "aspect-square",
  }[variant];

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={`View ${project.title}`}
      className={`group block w-full text-left relative overflow-hidden rounded-3xl border border-taupe/80 bg-ivory text-charcoal shadow-[0_20px_50px_rgba(17,16,15,0.06)] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-ivory ${className}`}
    >
      <div className={`relative overflow-hidden bg-sand ${imageClasses}`}>
        {image?.url ? (
          <img
            src={image.url}
            alt={image.alt || `${project.title} project image`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-sand text-center text-[10px] font-semibold uppercase tracking-[0.28em] text-warm-grey">
            {fallbackLabel}
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-linear-to-t from-charcoal/80 via-charcoal/15 to-transparent px-4 pb-4 pt-8 text-white">
          <span className="text-[10px] uppercase tracking-[0.22em] text-ivory">
            {project.isConcept ? "CONCEPT VISUAL" : "JK Interior Project"}
          </span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm transition-transform duration-300 group-hover:translate-x-1">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>

      <div className="space-y-4 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="text-[10px] uppercase tracking-[0.28em] text-terracotta">
            {number}
          </div>
          <div className="h-px flex-1 bg-taupe" />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl sm:text-2xl font-serif text-charcoal transition-transform duration-300 group-hover:-translate-y-0.5">
            {project.title}
          </h3>
          <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-warm-grey">
            {project.location && <span>{project.location}</span>}
            <span className="text-taupe">•</span>
            <span>{highlight}</span>
            {project.year ? (
              <>
                <span className="text-taupe">•</span>
                <span>{project.year}</span>
              </>
            ) : null}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-taupe pt-3 text-[11px] font-medium uppercase tracking-[0.2em] text-charcoal">
          <span>{project.isConcept ? "Concept review" : "View Project"}</span>
          <span className="text-terracotta">→</span>
        </div>
      </div>
    </button>
  );
};
