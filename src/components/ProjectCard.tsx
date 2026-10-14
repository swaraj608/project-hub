
import Link from "next/link";
import { ArrowUpRight, Trash2 } from "lucide-react";
import type { Project } from "@/lib/projects";

type Props = {
  project: Project;
  onDelete?: (id: number) => void;
};

export default function ProjectCard({ project, onDelete }: Props) {
  const accent =
    project.color === "cyan"
      ? "from-cyan-500/20 to-blue-500/5"
      : project.color === "amber"
      ? "from-amber-500/20 to-orange-500/5"
      : "from-violet-500/20 to-fuchsia-500/5";

  return (
    <article className={`rounded-2xl border border-white/10 bg-gradient-to-br ${accent} p-5 transition hover:-translate-y-1 hover:border-violet-400/40`}>
      <div className="mb-5 flex items-start justify-between gap-3">
        <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-gray-300">
          {project.category}
        </span>
        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(project.id)}
            aria-label={`Delete ${project.title}`}
            className="rounded-lg p-2 text-gray-500 hover:bg-red-500/10 hover:text-red-400"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      <h3 className="mb-2 text-lg font-semibold text-white">{project.title}</h3>
      <p className="mb-5 min-h-12 text-sm leading-6 text-gray-400">
        {project.description}
      </p>

      <div className="mb-2 flex justify-between text-xs">
        <span className="text-gray-400">{project.status}</span>
        <span className="text-gray-200">{project.progress}%</span>
      </div>
      <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-violet-500"
          style={{ width: `${Math.min(100, Math.max(0, project.progress))}%` }}
        />
      </div>

      <Link
        href={`/projects/${project.id}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-violet-300 hover:text-violet-200"
      >
        View project <ArrowUpRight size={16} />
      </Link>
    </article>
  );
}
