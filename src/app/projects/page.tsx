"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowDownUp,
  ArrowRight,
  ExternalLink,
  FlaskConical,
  Lightbulb,
  Search,
  Sparkles,
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  FolderKanban,
  CheckCircle2,
} from "lucide-react";

import AppLayout from "@/components/AppLayout";
import {
  starterProjects,
  type Project,
  type ProjectStatus,
} from "@/lib/projects";
import { readProjects, saveProjects } from "@/lib/storage";

type ProjectForm = {
  title: string;
  description: string;
  category: string;
  status: ProjectStatus;
  progress: number;
  color: string;
  techStack: string;
  problem: string;
  innovation: string;
  githubUrl: string;
  liveUrl: string;
};

const emptyForm: ProjectForm = {
  title: "",
  description: "",
  category: "",
  status: "Planning",
  progress: 0,
  color: "#A9BE86",
  techStack: "",
  problem: "",
  innovation: "",
  githubUrl: "",
  liveUrl: "",
};

const inputClass =
  "w-full rounded-xl border border-[#344339] bg-[#111914] px-4 py-3 text-sm text-[#F5F2E9] outline-none placeholder:text-[#879487] transition focus:border-[#A9BE86] focus:ring-2 focus:ring-[#A9BE86]/15";

const labelClass =
  "mb-2 block text-sm font-medium text-[#D5DBD0]";

function statusColor(status: ProjectStatus) {
  if (status === "Completed") {
    return "border-[#52684A] bg-[#263B2B] text-[#D6E5B4]";
  }

  if (status === "In progress") {
    return "border-[#75513E] bg-[#493329] text-[#E3A080]";
  }

  return "border-[#6C6040] bg-[#443D29] text-[#E8CF8C]";
}

function ProgressBar({ value }: { value: number }) {
  const progress = Math.min(100, Math.max(0, value));

  return (
    <div
      className="h-1.5 overflow-hidden rounded-full bg-[#344339]"
      role="progressbar"
      aria-label="Project progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
    >
      <div
        className="h-full rounded-full bg-[#A9BE86] transition-all duration-500"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

export default function ProjectsPage() {
  const [allProjects, setAllProjects] =
    useState<Project[]>(starterProjects);

  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All categories");
  const [status, setStatus] = useState("All statuses");
  const [sort, setSort] = useState("Featured");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ProjectForm>(emptyForm);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setAllProjects(readProjects(starterProjects));
    setLoaded(true);

    const handleStorage = (event: StorageEvent) => {
      if (
        event.key === "project-hub-projects" ||
        event.key === null
      ) {
        setAllProjects(readProjects(starterProjects));
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const categories = useMemo(
    () => [
      "All categories",
      ...Array.from(
        new Set(allProjects.map((project) => project.category))
      ).sort(),
    ],
    [allProjects]
  );

  const projects = useMemo(() => {
    const query = search.trim().toLowerCase();

    return allProjects
      .filter((project) => {
        const searchableText = [
          project.title,
          project.description,
          project.category,
          project.problem,
          project.innovation,
          ...(Array.isArray(project.techStack) ? project.techStack : []),
        ]
          .join(" ")
          .toLowerCase();

        return (
          (!query || searchableText.includes(query)) &&
          (category === "All categories" ||
            project.category === category) &&
          (status === "All statuses" || project.status === status)
        );
      })
      .sort((a, b) => {
        if (sort === "A–Z") {
          return a.title.localeCompare(b.title);
        }

        if (sort === "Progress") {
          return b.progress - a.progress;
        }

        return a.id - b.id;
      });
  }, [allProjects, search, category, status, sort]);

  function persistProjects(updatedProjects: Project[]) {
    setAllProjects(updatedProjects);
    saveProjects(updatedProjects);
  }

  function openAddModal() {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
    setModalOpen(true);
  }

  function openEditModal(project: Project) {
    setEditingId(project.id);
    setForm({
      title: project.title,
      description: project.description,
      category: project.category,
      status: project.status,
      progress: project.progress,
      color: project.color || "#A9BE86",
      techStack: Array.isArray(project.techStack)? project.techStack.join(", "): "",
      problem: project.problem,
      innovation: project.innovation,
      githubUrl: project.githubUrl || "",
      liveUrl: project.liveUrl || "",
    });
    setFormError("");
    setModalOpen(true);
  }

  function closeModal() {
    if (saving) return;
    setModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
  }

  function updateForm<K extends keyof ProjectForm>(
    key: K,
    value: ProjectForm[K]
  ) {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    const title = form.title.trim();
    const description = form.description.trim();
    const categoryValue = form.category.trim();

    if (!title || !description || !categoryValue) {
      setFormError(
        "Please fill in the project title, description and category."
      );
      return;
    }

    const progress = Math.min(
      100,
      Math.max(0, Number(form.progress) || 0)
    );

    const techStack = Array.from(
      new Set(
        form.techStack
          .split(",")
          .map((tech) => tech.trim())
          .filter(Boolean)
      )
    );

    const existingProject =
      editingId === null
        ? undefined
        : allProjects.find((project) => project.id === editingId);

    const projectData: Project = {
      id: editingId ?? Math.max(0, ...allProjects.map((p) => p.id)) + 1,
      title,
      description,
      category: categoryValue,
      status: form.status,
      progress,
      color: form.color,
      techStack,
      problem: form.problem.trim(),
      innovation: form.innovation.trim(),
      githubUrl: form.githubUrl.trim() || undefined,
      liveUrl: form.liveUrl.trim() || undefined,

      ...(existingProject?.architecture
        ? { architecture: existingProject.architecture }
        : {}),
      ...(existingProject?.features
        ? { features: existingProject.features }
        : {}),
      ...(existingProject?.roadmap
        ? { roadmap: existingProject.roadmap }
        : {}),
      ...(existingProject?.difficulty
        ? { difficulty: existingProject.difficulty }
        : {}),
    };

    setSaving(true);

    try {
      let updatedProjects: Project[];

      if (editingId !== null) {
        updatedProjects = allProjects.map((project) =>
          project.id === editingId ? projectData : project
        );
      } else {
        updatedProjects = [...allProjects, projectData];
      }

      persistProjects(updatedProjects);
      setModalOpen(false);
      setEditingId(null);
      setForm(emptyForm);
    } catch {
      setFormError(
        "Could not save this project. Please check your browser storage and try again."
      );
    } finally {
      setSaving(false);
    }
  }

  function deleteProject(project: Project) {
    const confirmed = window.confirm(
      `Delete "${project.title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      persistProjects(
        allProjects.filter((item) => item.id !== project.id)
      );
    } catch {
      window.alert(
        "Could not delete the project. Please try again."
      );
    }
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl space-y-9 pb-12">
        {/* Hero */}
        <section className="relative isolate overflow-hidden rounded-3xl border border-[#344339] bg-[#18231B] p-6 sm:p-10">
          <div className="pointer-events-none absolute -right-12 -top-16 -z-10 h-64 w-64 rounded-full bg-[#D6E5B4]/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 right-1/4 -z-10 h-52 w-52 rounded-full bg-[#E3A080]/10 blur-3xl" />

          <div className="relative max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#405C43] bg-[#202F24] px-3 py-1.5 text-xs font-semibold tracking-wide text-[#D6E5B4]">
              <Sparkles size={14} />
              YOUR PROJECT COLLECTION
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-[#F5F2E9] sm:text-5xl">
              Think beyond
              <span className="block text-[#D6E5B4]">
                the obvious.
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#C0C8BC] sm:text-base">
              Organize your ideas, manage your projects, monitor progress,
              and keep every promising concept moving toward implementation.
            </p>

            <button
              onClick={openAddModal}
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#D6E5B4] px-5 py-3 text-sm font-semibold text-[#18231B] transition hover:bg-[#E3EDCE] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E3A080]"
            >
              <Plus size={18} />
              Add new project
            </button>

            <div className="mt-7 grid grid-cols-1 gap-3 min-[420px]:grid-cols-3">
              <div className="rounded-2xl border border-[#344339] bg-[#111914]/70 p-4">
                <p className="text-2xl font-bold text-[#F5F2E9]">
                  {loaded ? allProjects.length : "—"}
                </p>
                <p className="mt-1 text-xs text-[#C0C8BC]">
                  Total projects
                </p>
              </div>

              <div className="rounded-2xl border border-[#344339] bg-[#111914]/70 p-4">
                <p className="text-2xl font-bold text-[#F5F2E9]">
                  {loaded ? categories.length - 1 : "—"}
                </p>
                <p className="mt-1 text-xs text-[#C0C8BC]">
                  Project categories
                </p>
              </div>

              <div className="rounded-2xl border border-[#344339] bg-[#111914]/70 p-4">
                <p className="text-2xl font-bold text-[#D6E5B4]">
                  {loaded
                    ? allProjects.filter(
                        (project) => project.status === "Completed"
                      ).length
                    : "—"}
                </p>
                <p className="mt-1 text-xs text-[#C0C8BC]">
                  Completed projects
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Collection and filters */}
        <section className="space-y-5">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
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
              Showing {projects.length} of {allProjects.length} projects
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
                placeholder="Search projects, problems, technologies..."
                className={`${inputClass} pl-10`}
                aria-label="Search projects"
              />
            </label>

            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className={inputClass}
              aria-label="Filter by category"
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className={inputClass}
              aria-label="Filter by status"
            >
              {[
                "All statuses",
                "Planning",
                "In progress",
                "Completed",
              ].map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <label className="relative">
              <ArrowDownUp
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#AAB7A5]"
              />
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className={`${inputClass} appearance-none pl-9`}
                aria-label="Sort projects"
              >
                {["Featured", "A–Z", "Progress"].map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* Project cards */}
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

                    <span
                      className={`rounded-full border px-2.5 py-1 text-xs ${statusColor(project.status)}`}
                    >
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
                      {project.innovation || "A solution worth exploring."}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {(Array.isArray(project.techStack) ? project.techStack : []).map((tech) => (
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
                      <span>Project progress</span>
                      <span>{project.progress}%</span>
                    </div>

                    <ProgressBar value={project.progress} />

                    <Link
                      href={`/projects/${project.id}`}
                      className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#D6E5B4] px-4 py-3 text-sm font-semibold text-[#18231B] transition hover:bg-[#E3EDCE] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E3A080]"
                    >
                      View project details
                      <ArrowRight size={16} />
                    </Link>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(project)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#52684A] px-3 py-2.5 text-sm font-medium text-[#D6E5B4] transition hover:bg-[#263B2B]"
                      >
                        <Pencil size={15} />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteProject(project)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#75513E] px-3 py-2.5 text-sm font-medium text-[#E3A080] transition hover:bg-[#493329]"
                      >
                        <Trash2 size={15} />
                        Delete
                      </button>
                    </div>

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

                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-[#D6E5B4] hover:underline"
                      >
                        GitHub repository <ExternalLink size={12} />
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
                No matching projects
              </h3>
              <p className="mt-2 text-sm text-[#C0C8BC]">
                Try another keyword or reset your filters.
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => {
                    setSearch("");
                    setCategory("All categories");
                    setStatus("All statuses");
                    setSort("Featured");
                  }}
                  className="rounded-xl border border-[#52684A] px-4 py-2.5 text-sm font-semibold text-[#D6E5B4] transition hover:bg-[#263B2B]"
                >
                  Reset filters
                </button>
                <button
                  onClick={openAddModal}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#D6E5B4] px-4 py-2.5 text-sm font-semibold text-[#18231B] transition hover:bg-[#E3EDCE]"
                >
                  <Plus size={16} />
                  Add project
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Add/Edit modal */}
        {modalOpen && (
          <div
            className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm sm:items-center sm:p-6"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) closeModal();
            }}
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="project-modal-title"
              className="my-4 w-full max-w-2xl overflow-hidden rounded-3xl border border-[#52684A] bg-[#18231B] shadow-2xl shadow-black/40"
            >
              <div className="flex items-start justify-between gap-4 border-b border-[#344339] p-5 sm:p-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#A9BE86]">
                    <FolderKanban size={15} />
                    Project management
                  </div>
                  <h2
                    id="project-modal-title"
                    className="mt-2 text-2xl font-bold text-[#F5F2E9]"
                  >
                    {editingId === null
                      ? "Create a project"
                      : "Edit project"}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-[#C0C8BC]">
                    {editingId === null
                      ? "Add a new idea to your project collection."
                      : "Update the details and progress of your project."}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  aria-label="Close project form"
                  className="rounded-xl border border-[#344339] p-2 text-[#C0C8BC] transition hover:bg-[#263B2B] hover:text-white disabled:opacity-50"
                >
                  <X size={19} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="max-h-[65vh] space-y-5 overflow-y-auto p-5 sm:p-6">
                  <div>
                    <label htmlFor="project-title" className={labelClass}>
                      Project title *
                    </label>
                    <input
                      id="project-title"
                      required
                      maxLength={120}
                      value={form.title}
                      onChange={(event) =>
                        updateForm("title", event.target.value)
                      }
                      placeholder="e.g. Smart City Dashboard"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="project-description"
                      className={labelClass}
                    >
                      Description *
                    </label>
                    <textarea
                      id="project-description"
                      required
                      rows={3}
                      maxLength={1000}
                      value={form.description}
                      onChange={(event) =>
                        updateForm("description", event.target.value)
                      }
                      placeholder="What does this project do?"
                      className={inputClass}
                    />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="project-category"
                        className={labelClass}
                      >
                        Category *
                      </label>
                      <input
                        id="project-category"
                        required
                        maxLength={80}
                        value={form.category}
                        onChange={(event) =>
                          updateForm("category", event.target.value)
                        }
                        placeholder="e.g. Climate Tech"
                        className={inputClass}
                        list="project-category-options"
                      />
                      <datalist id="project-category-options">
                        {categories
                          .filter((item) => item !== "All categories")
                          .map((item) => (
                            <option key={item} value={item} />
                          ))}
                      </datalist>
                    </div>

                    <div>
                      <label
                        htmlFor="project-status"
                        className={labelClass}
                      >
                        Status
                      </label>
                      <select
                        id="project-status"
                        value={form.status}
                        onChange={(event) =>
                          updateForm(
                            "status",
                            event.target.value as ProjectStatus
                          )
                        }
                        className={inputClass}
                      >
                        <option value="Planning">Planning</option>
                        <option value="In progress">In progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-[1fr_120px]">
                    <div>
                      <label
                        htmlFor="project-progress"
                        className={labelClass}
                      >
                        Progress: {form.progress}%
                      </label>
                      <input
                        id="project-progress"
                        type="range"
                        min={0}
                        max={100}
                        step={5}
                        value={form.progress}
                        onChange={(event) =>
                          updateForm("progress", Number(event.target.value))
                        }
                        className="mt-3 w-full accent-[#A9BE86]"
                      />
                      <div className="mt-2 flex justify-between text-xs text-[#AAB7A5]">
                        <span>0%</span>
                        <span>50%</span>
                        <span>100%</span>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="project-color" className={labelClass}>
                        Accent color
                      </label>
                      <input
                        id="project-color"
                        type="color"
                        value={form.color}
                        onChange={(event) =>
                          updateForm("color", event.target.value)
                        }
                        className="h-12 w-full cursor-pointer rounded-xl border border-[#344339] bg-[#111914] p-1"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="project-tech" className={labelClass}>
                      Tech stack
                    </label>
                    <input
                      id="project-tech"
                      value={form.techStack}
                      onChange={(event) =>
                        updateForm("techStack", event.target.value)
                      }
                      placeholder="Next.js, TypeScript, PostgreSQL"
                      className={inputClass}
                    />
                    <p className="mt-2 text-xs text-[#AAB7A5]">
                      Separate technologies with commas.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="project-problem" className={labelClass}>
                      Problem being solved
                    </label>
                    <textarea
                      id="project-problem"
                      rows={2}
                      value={form.problem}
                      onChange={(event) =>
                        updateForm("problem", event.target.value)
                      }
                      placeholder="What problem does this project address?"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="project-innovation"
                      className={labelClass}
                    >
                      Innovation / unique approach
                    </label>
                    <textarea
                      id="project-innovation"
                      rows={2}
                      value={form.innovation}
                      onChange={(event) =>
                        updateForm("innovation", event.target.value)
                      }
                      placeholder="What makes this project different?"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="project-github" className={labelClass}>
                      GitHub repository URL
                    </label>
                    <input
                      id="project-github"
                      type="url"
                      value={form.githubUrl}
                      onChange={(event) =>
                        updateForm("githubUrl", event.target.value)
                      }
                      placeholder="https://github.com/username/repository"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="project-live" className={labelClass}>
                      Live demo URL
                    </label>
                    <input
                      id="project-live"
                      type="url"
                      value={form.liveUrl}
                      onChange={(event) =>
                        updateForm("liveUrl", event.target.value)
                      }
                      placeholder="https://your-project.vercel.app"
                      className={inputClass}
                    />
                  </div>

                  {formError && (
                    <div
                      role="alert"
                      className="rounded-xl border border-[#75513E] bg-[#493329]/60 p-3 text-sm leading-6 text-[#F0B49A]"
                    >
                      {formError}
                    </div>
                  )}
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-[#344339] bg-[#111914]/50 p-5 sm:flex-row sm:justify-end sm:p-6">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={saving}
                    className="rounded-xl border border-[#52684A] px-5 py-3 text-sm font-medium text-[#D5DBD0] transition hover:bg-[#263B2B] disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D6E5B4] px-5 py-3 text-sm font-semibold text-[#18231B] transition hover:bg-[#E3EDCE] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {editingId === null ? (
                      <Plus size={17} />
                    ) : (
                      <Save size={17} />
                    )}
                    {saving
                      ? "Saving..."
                      : editingId === null
                        ? "Create project"
                        : "Save changes"}
                  </button>
                </div>
              </form>
            </section>
          </div>
        )}

        {/* Bottom note */}
        <div className="flex items-start gap-3 rounded-2xl border border-[#344339] bg-[#18231B] p-4">
          <CheckCircle2
            size={19}
            className="mt-0.5 shrink-0 text-[#A9BE86]"
          />
          <p className="text-sm leading-6 text-[#C0C8BC]">
            Projects are saved in this browser using local storage. Your
            changes persist across refreshes in this browser, but are not
            automatically synced to other devices or users.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
