import Link from "next/link";
import { ArrowLeft, FolderKanban } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { starterProjects } from "@/lib/projects";

export const instant = false;
export function generateStaticParams() {
  return starterProjects.map((project) => ({
    id: String(project.id),
  }));
}

export default async function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = starterProjects.find((item) => String(item.id) === id);

  return (
    <AppLayout>
      <Link
        href="/projects"
        className="mb-7 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white"
      >
        <ArrowLeft size={16} />
        Back to projects
      </Link>

      {!project ? (
        <div className="rounded-2xl border border-white/10 p-10 text-center">
          <h1 className="text-xl font-bold">Project not found</h1>
          <p className="mt-2 text-sm text-gray-400">
            This project does not exist in the starter project list.
          </p>
        </div>
      ) : (
        <section className="max-w-3xl rounded-3xl border border-white/10 bg-gradient-to-br from-violet-500/10 to-transparent p-7 md:p-10">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-300">
            <FolderKanban size={28} />
          </div>

          <p className="text-sm text-violet-300">{project.category}</p>
          <h1 className="mt-3 text-3xl font-bold">{project.title}</h1>
          <p className="mt-4 leading-7 text-gray-400">
            {project.description}
          </p>

          <div className="mt-8 flex justify-between text-sm">
            <span className="text-gray-400">Status: {project.status}</span>
            <span>{project.progress}% complete</span>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-violet-500"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </section>
      )}
    </AppLayout>
  );
}
