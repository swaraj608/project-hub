
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDownUp,
  ArrowRight,
  ExternalLink,
  FlaskConical,
  Lightbulb,
  Search,
  Sparkles,
} from "lucide-react";

import AppLayout from "@/components/AppLayout";
import { starterProjects } from "@/lib/projects";

export default function ProjectsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All categories");
  const [status, setStatus] = useState("All statuses");
  const [sort, setSort] = useState("Featured");

  const categories = [
    "All categories",
    ...Array.from(new Set(starterProjects.map((p) => p.category))).sort(),
  ];

  const projects = useMemo(() => {
    const query = search.trim().toLowerCase();

    return starterProjects
      .filter((project) => {
        const searchableText = [
          project.title,
          project.description,
          project.category,
          project.problem,
          project.innovation,
          ...project.techStack,
        ]
          .join(" ")
          .toLowerCase();

        return (
          (!query || searchableText.includes(query)) &&
          (category === "All categories" || project.category === category) &&
          (status === "All statuses" || project.status === status)
        );
      })
      .sort((a, b) => {
        if (sort === "A–Z") return a.title.localeCompare(b.title);
        if (sort === "Progress") return b.progress - a.progress;
        return a.id - b.id;
      });
  }, [search, category, status, sort]);

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl space-y-9 pb-12">
        <section className="relative isolate overflow-hidden rounded-3xl border border-[#344339] bg-[#18231B] p-6 sm:p-10">
          <div className="pointer-events-none absolute -right-12 -top-16 -z-10 h-64 w-64 rounded-full bg-[#D6E5B4]/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 right-1/4 -z-10 h-52 w-52 rounded-full bg-[#E3A080]/10 blur-3xl" />

          <div className="relative max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#405C43] bg-[#202F24] px-3 py-1.5 text-xs font-semibold tracking-wide text-[#D6E5B4]">
              <Sparkles size={14} />
              THE EXPERIMENTAL IDEA CATALOGUE
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-[#F5F2E9] sm:text-5xl">
              Think beyond
              <span className="block text-[#D6E5B4]">
                the obvious.
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#C0C8BC] sm:text-base">
              A curated collection of unconventional ideas at the intersection
              of technology, society, culture, climate and human experience.
              Not another list of generic app clones.
            </p>

            <div className="mt-7 grid grid-cols-1 gap-3 min-[420px]:grid-cols-3">
              <div className="rounded-2xl border border-[#344339] bg-[#111914]/70 p-4">
                <p className="text-2xl font-bold text-[#F5F2E9]">
                  {starterProjects.length}
                </p>
                <p className="mt-1 text-xs text-[#C0C8BC]">
                  Curated concepts
                </p>
              </div>

              <div className="rounded-2xl border border-[#344339] bg-[#111914]/70 p-4">
                <p className="text-2xl font-bold text-[#F5F2E9]">
                  {categories.length - 1}
                </p>
                <p className="mt-1 text-xs text-[#C0C8BC]">
                  Innovation fields
                </p>
              </div>

              <div className="rounded-2xl border border-[#344339] bg-[#111914]/70 p-4">
                <p className="text-2xl font-bold text-[#D6E5B4]">0</p>
                <p className="mt-1 text-xs text-[#C0C8BC]">
                  Database dependencies
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-5">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-[#D6E5B4]">
                <FlaskConical size={17} />
                Explore the collection
              </div>
              <h2 className="mt-2 text-xl font-bold text-[#F5F2E9] sm:text-2xl">
                Ideas worth investigating
              </h2>
            </div>

            <p className="text-sm text-[#C0C8BC]">
              Showing {projects.length} of {starterProjects.length} concepts
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_220px_180px_150px]">
            <label className="relative block">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#AAB7A5]"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search ideas, problems, technologies..."
                className="w-full rounded-xl border border-[#344339] bg-[#18231B] py-3 pl-10 pr-4 text-sm text-[#F5F2E9] outline-none placeholder:text-[#879487] transition focus:border-[#A9BE86] focus:ring-2 focus:ring-[#A9BE86]/15"
              />
            </label>

            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="rounded-xl border border-[#344339] bg-[#18231B] px-3 py-3 text-sm text-[#F5F2E9] outline-none focus:border-[#A9BE86]"
            >
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>

            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="rounded-xl border border-[#344339] bg-[#18231B] px-3 py-3 text-sm text-[#F5F2E9] outline-none focus:border-[#A9BE86]"
            >
              {["All statuses", "Planning", "In progress", "Completed"].map(
                (item) => (
                  <option key={item}>{item}</option>
                )
              )}
            </select>

            <label className="relative">
              <ArrowDownUp
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#AAB7A5]"
              />
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="w-full appearance-none rounded-xl border border-[#344339] bg-[#18231B] py-3 pl-9 pr-3 text-sm text-[#F5F2E9] outline-none focus:border-[#A9BE86]"
              >
                {["Featured", "A–Z", "Progress"].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
          </div>

          {projects.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {projects.map((project, index) => (
                <article
                  key={project.id}
                  className="group flex h-full flex-col rounded-2xl border border-[#344339] bg-[#18231B] p-5 transition duration-200 hover:-translate-y-1 hover:border-[#718B60] hover:shadow-xl hover:shadow-black/10"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#405C43] bg-[#26372B] text-[#D6E5B4] transition group-hover:bg-[#344B37]">
                      {index % 3 === 0 ? (
                        <Lightbulb size={21} />
                      ) : index % 3 === 1 ? (
                        <FlaskConical size={21} />
                      ) : (
                        <Sparkles size={21} />
                      )}
                    </div>

                    <span className="rounded-full border border-[#405C43] bg-[#202F24] px-2.5 py-1 text-xs text-[#D6E5B4]">
                      {project.status}
                    </span>
                  </div>

                  <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-[#A9BE86]">
                    {project.category}
                  </p>

                  <h3 className="mt-2 text-xl font-bold text-[#F5F2E9] transition group-hover:text-[#D6E5B4]">
                    {project.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-[#C0C8BC]">
                    {project.description}
                  </p>

                  <div className="mt-5 rounded-xl border border-[#344339]/80 bg-[#111914]/70 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#A9BE86]">
                      The interesting part
                    </p>
                    <p className="mt-1 text-sm leading-5 text-[#D5DBD0]">
                      {project.innovation}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md border border-[#344339] bg-[#202F24] px-2 py-1 text-xs text-[#C0C8BC]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto pt-6">
                    <div className="mb-3 flex items-center justify-between text-xs text-[#AAB7A5]">
                      <span>Exploration progress</span>
                      <span>{project.progress}%</span>
                    </div>

                    <div
                      className="mb-5 h-1.5 overflow-hidden rounded-full bg-[#344339]"
                      role="progressbar"
                      aria-label={`${project.title} exploration progress`}
                      aria-valuenow={Math.min(
                        100,
                        Math.max(0, project.progress)
                      )}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <div
                        className="h-full rounded-full bg-[#A9BE86] transition-all duration-500"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(0, project.progress)
                          )}%`,
                        }}
                      />
                    </div>

                    <Link
                      href={`/projects/${project.id}`}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#D6E5B4] px-4 py-3 text-sm font-semibold text-[#18231B] transition hover:bg-[#E3EDCE] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E3A080]"
                    >
                      Explore concept
                      <ArrowRight size={16} />
                    </Link>

                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-[#E3A080] hover:underline"
                      >
                        Live demo <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#405C43] bg-[#18231B]/60 px-6 py-16 text-center">
              <Search
                className="mx-auto mb-3 text-[#A9BE86]"
                size={28}
              />
              <h3 className="font-semibold text-[#F5F2E9]">
                No matching ideas
              </h3>
              <p className="mt-2 text-sm text-[#C0C8BC]">
                Try a different keyword or clear your filters.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setCategory("All categories");
                  setStatus("All statuses");
                  setSort("Featured");
                }}
                className="mt-4 rounded-xl bg-[#D6E5B4] px-4 py-2.5 text-sm font-semibold text-[#18231B] transition hover:bg-[#E3EDCE]"
              >
                Reset filters
              </button>
            </div>
          )}
        </section>
      </div>
    </AppLayout>
  );
}
