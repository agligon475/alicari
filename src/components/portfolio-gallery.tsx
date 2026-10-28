import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Maximize2, ExternalLink, ChevronLeft, ChevronRight, X } from "lucide-react";
import projectsData from "@/data/projects.json";

export interface Project {
  id: string;
  title: string;
  category: string;
  meta?: string;
  imageUrl: string;
  behanceUrl: string;
}

const CATEGORIES = [
  { id: "all", label: "Todos" },
  { id: "uxui", label: "UX/UI" },
  { id: "webdesign", label: "Web Design" },
  { id: "branding", label: "Branding" },
  { id: "multimedia", label: "Multimedia" },
  { id: "fotografia", label: "Fotografía" },
  { id: "marketing", label: "Marketing" },
] as const;

const CATEGORY_LABELS: Record<string, string> = {
  uxui: "Diseño UX/UI · Behance",
  webdesign: "Diseño Web · Behance",
  branding: "Branding · Behance",
  multimedia: "Multimedia · Behance",
  fotografia: "Fotografía · Behance",
  marketing: "Marketing · Behance",
};

export function PortfolioGallery() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isImageLoading, setIsImageLoading] = useState<boolean>(false);

  const projects: Project[] = projectsData as Project[];

  const filteredProjects = useMemo(() => {
    if (activeCategory === "all") return projects;
    return projects.filter((project) => project.category === activeCategory);
  }, [projects, activeCategory]);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const goToPrev = useCallback(() => {
    setLightboxIndex((prev) => {
      if (prev === null || prev <= 0) return prev;
      setIsImageLoading(true);
      return prev - 1;
    });
  }, []);

  const goToNext = useCallback(() => {
    setLightboxIndex((prev) => {
      if (prev === null || prev >= filteredProjects.length - 1) return prev;
      setIsImageLoading(true);
      return prev + 1;
    });
  }, [filteredProjects.length]);

  useEffect(() => {
    if (lightboxIndex === null) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === "ArrowRight") goToNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [lightboxIndex, closeLightbox, goToPrev, goToNext]);

  const activeLightboxProject =
    lightboxIndex !== null ? filteredProjects[lightboxIndex] : null;

  return (
    <>
      {/* Filter Bar */}
      <div className="gallery-filter-wrap">
        <div className="gallery-filter" role="toolbar" aria-label="Filter gallery">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setActiveCategory(cat.id);
                  setLightboxIndex(null);
                }}
                className={`filter__btn ${isActive ? "is-active" : ""}`}
                data-filter={cat.id}
                aria-pressed={isActive}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Portfolio Masonry Grid */}
      <main className="gallery" aria-label="Portfolio gallery">
        {filteredProjects.map((project, index) => {
          const metaText =
            project.meta || CATEGORY_LABELS[project.category] || "Ver en Behance";

          return (
            <div
              key={project.id}
              className="gallery__item group relative"
              data-category={project.category}
              data-full={project.imageUrl}
              data-title={project.title}
              data-meta={metaText}
            >
              <a
                href={project.behanceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full h-full"
              >
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="gallery__image"
                  loading="lazy"
                />
                <div className="gallery__caption">
                  <span className="gallery__caption-title">{project.title}</span>
                  <span className="gallery__caption-meta inline-flex items-center gap-1.5">
                    <span>Ver en Behance</span>
                    <ExternalLink className="w-3 h-3 opacity-80 inline-block" />
                  </span>
                </div>
                <button
                  type="button"
                  className="gallery__expand-icon border-0 cursor-pointer"
                  aria-label={`Vista previa de ${project.title}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsImageLoading(false);
                    setLightboxIndex(index);
                  }}
                >
                  <Maximize2 className="w-3 h-3 text-white" strokeWidth={1.75} />
                </button>
              </a>
            </div>
          );
        })}
      </main>

      {/* Lightbox Viewer */}
      <div
        className={`lightbox ${activeLightboxProject ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Photo viewer"
        onClick={(e) => {
          if (
            e.target === e.currentTarget ||
            (e.target as HTMLElement).classList.contains("lightbox__stage")
          ) {
            closeLightbox();
          }
        }}
      >
        <div className="lightbox__bar">
          <span className="lightbox__counter" aria-live="polite">
            {lightboxIndex !== null
              ? `${lightboxIndex + 1} / ${filteredProjects.length}`
              : ""}
          </span>
          <button
            type="button"
            className="lightbox__close"
            aria-label="Close photo viewer"
            onClick={closeLightbox}
          >
            <X className="w-[18px] h-[18px]" strokeWidth={1.5} />
          </button>
        </div>

        <div className="lightbox__stage">
          <button
            type="button"
            className="lightbox__nav lightbox__nav--prev"
            aria-label="Previous photo"
            style={{
              visibility:
                lightboxIndex !== null && lightboxIndex > 0 ? "visible" : "hidden",
            }}
            onClick={goToPrev}
          >
            <ChevronLeft className="w-4 h-4" strokeWidth={1.75} />
          </button>

          {activeLightboxProject && (
            <img
              src={activeLightboxProject.imageUrl}
              alt={activeLightboxProject.title}
              className={`lightbox__image ${isImageLoading ? "is-loading" : ""}`}
              onLoad={() => setIsImageLoading(false)}
            />
          )}

          <button
            type="button"
            className="lightbox__nav lightbox__nav--next"
            aria-label="Next photo"
            style={{
              visibility:
                lightboxIndex !== null &&
                lightboxIndex < filteredProjects.length - 1
                  ? "visible"
                  : "hidden",
            }}
            onClick={goToNext}
          >
            <ChevronRight className="w-4 h-4" strokeWidth={1.75} />
          </button>
        </div>

        <div className="lightbox__caption">
          {activeLightboxProject && (
            <>
              <p className="lightbox__caption-title">
                {activeLightboxProject.title}
              </p>
              <p className="lightbox__caption-meta flex items-center justify-center gap-2">
                <span>
                  {activeLightboxProject.meta ||
                    CATEGORY_LABELS[activeLightboxProject.category] ||
                    "Behance"}
                </span>
                <span>·</span>
                <a
                  href={activeLightboxProject.behanceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-white/80 hover:text-white underline underline-offset-4 transition-colors"
                >
                  <span>Abrir en Behance</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}
export default PortfolioGallery;
