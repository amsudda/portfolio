import { Link } from "@tanstack/react-router";
import type { Project } from "@/data/projects";
import { ArrowUpRightIcon } from "./icons";

interface ProjectCardProps {
  project: Project;
  index?: number;
  size?: "default" | "large";
}

export function ProjectCard({ project, index, size = "default" }: ProjectCardProps) {
  return (
    <Link
      to="/work/$slug"
      params={{ slug: project.slug }}
      className="group block"
    >
      <div
        className={`relative w-full overflow-hidden rounded-lg bg-surface ${
          size === "large" ? "aspect-[16/10]" : "aspect-[4/3]"
        }`}
        style={
          project.thumbnail.image
            ? {
                backgroundImage: `url(${project.thumbnail.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : {
                backgroundImage: `linear-gradient(135deg, ${project.thumbnail.from}, ${project.thumbnail.to})`,
              }
        }
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent transition-opacity duration-700 group-hover:opacity-80" />

        {/* Index number (editorial touch) */}
        {typeof index === "number" && (
          <span className="absolute left-5 top-5 font-mono text-[10px] uppercase tracking-[0.25em] text-white/60">
            {String(index + 1).padStart(2, "0")}
          </span>
        )}

        {/* Hover hook reveal */}
        <div className="absolute inset-x-0 bottom-0 translate-y-2 p-6 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 md:p-8">
          <p className="max-w-md font-display text-base text-white/95 text-balance md:text-lg">
            {project.hook}
          </p>
        </div>

        {/* Top-right hover arrow */}
        <span className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full border border-white/30 text-white opacity-0 transition-all duration-500 group-hover:opacity-100">
          <ArrowUpRightIcon className="h-4 w-4" />
        </span>
      </div>

      <div className="mt-5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-display text-2xl leading-tight tracking-tight md:text-3xl">
            {project.title}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {project.client} <span className="mx-1.5 opacity-40">·</span> {project.year}
          </p>
        </div>
        <span className="shrink-0 rounded-full border border-border px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {project.category}
        </span>
      </div>
    </Link>
  );
}
