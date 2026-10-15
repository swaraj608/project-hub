"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AppLayout from "@/components/AppLayout";
import { starterProjects, type Project } from "@/lib/projects";
import { readProjects, readTasks, type Task } from "@/lib/storage";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  CircleDashed,
  Clock3,
  CodeXml,
  Compass,
  FlaskConical,
  FolderKanban,
  Landmark,
  Lightbulb,
  ListTodo,
  MapPinned,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";

const accents = [
  {
    icon: Landmark,
    color: "text-[#D6E5B4]",
    tile: "bg-[#344B37]",
    line: "border-[#52684A]",
  },
  {
    icon: MapPinned,
    color: "text-[#E3A080]",
    tile: "bg-[#493329]",
    line: "border-[#75513E]",
  },
  {
    icon: Lightbulb,
    color: "text-[#E8CF8C]",
    tile: "bg-[#443D29]",
    line: "border-[#6C6040]",
  },
];

function StatCard({
  label,
  value,
  detail,
  icon: Icon,
  accent = "text-[#D6E5B4]",
}: {
  label: string;
  value: string | number;
  detail: string;
  icon: typeof FolderKanban;
  accent?: string;
}) {
  return (
    <div className="group rounded-2xl border border-[#344339] bg-[#18231B] p-5 transition duration-300 hover:-translate-y-1 hover:border-[#6C835E]">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm text-[#C0C8BC]">{label}</span>
        <Icon
          size={20}
          className={`${accent} transition group-hover:scale-110`}
        />
      </div>
      <p className="mt-4 text-3xl font-semibold text-[#F5F2E9]">{value}</p>
      <p className="mt-1 text-xs leading-5 text-[#AAB7A5]">{detail}</p>
    </div>
  );
}

function ProgressBar({ value }: { value: number }) {
  const progress = Math.min(100, Math.max(0, value));

  return (
    <div
      className="h-2 overflow-hidden rounded-full bg-[#344339]"
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

function statusColor(status: Project["status"]) {
  if (status === "Completed") {
    return "border-[#52684A] bg-[#263B2B] text-[#D6E5B4]";
  }

  if (status === "In progress") {
    return "border-[#75513E] bg-[#493329] text-[#E3A080]";
  }

  return "border-[#6C6040] bg-[#443D29] text-[#E8CF8C]";
}

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>(starterProjects);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadDashboard = () => {
      setProjects(readProjects(starterProjects));
      setTasks(readTasks([]));
      setLoaded(true);
    };

    loadDashboard();

    // Refresh when project/task data changes in another browser tab.
    window.addEventListener("storage", loadDashboard);

    return () => {
      window.removeEventListener("storage", loadDashboard);
    };
  }, []);

  const stats = useMemo(() => {
    const total = projects.length;
    const completed = projects.filter(
      (project) => project.status === "Completed"
    ).length;
    const active = projects.filter(
      (project) => project.status === "In progress"
    ).length;
    const planning = projects.filter(
      (project) => project.status === "Planning"
    ).length;

    const averageProgress =
      total > 0
        ? Math.round(
            projects.reduce(
              (sum, project) => sum + project.progress,
              0
            ) / total
          )
        : 0;

    const completedTasks = tasks.filter((task) => task.done).length;
    const pendingTasks = tasks.length - completedTasks;

    const categoryCount = new Set(
      projects.map((project) => project.category)
    ).size;

    return {
      total,
      completed,
      active,
      planning,
      averageProgress,
      completedTasks,
      pendingTasks,
      categoryCount,
    };
  }, [projects, tasks]);

  const featuredProjects = projects.slice(0, 3);

  const nextProjects = projects
    .filter((project) => project.status !== "Completed")
    .slice(0, 4);

  const taskCompletion =
    tasks.length > 0
      ? Math.round((stats.completedTasks / tasks.length) * 100)
      : 0;

  return (
    <AppLayout>
      <main className="mx-auto max-w-6xl space-y-10 pb-8">
        {/* Hero */}
        <section className="relative isolate overflow-hidden rounded-[28px] border border-[#405443] bg-[#1C2D22]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-24 -z-10 h-80 w-80 rounded-full border border-[#D6E5B4]/15"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-8 -top-12 -z-10 h-56 w-56 rounded-full border border-[#E3A080]/20"
          />

          <div className="grid gap-8 p-6 sm:p-9 lg:grid-cols-[1.3fr_0.7fr] lg:items-center lg:p-12">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#52684A] bg-[#263B2B] px-3 py-2 text-xs font-medium text-[#D6E5B4]">
                <Sparkles size={14} />
                YOUR PROJECT COMMAND CENTER
              </div>

              <h1 className="mt-6 max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-[#F5F2E9] sm:text-5xl">
                Ideas into projects.
                <span className="block text-[#D6E5B4]">
                  Projects into impact.
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-7 text-[#D0D7CC] sm:text-base">
                Keep your projects organized, monitor progress, track tasks,
                and turn ambitious ideas into meaningful outcomes — all from
                one workspace.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#D6E5B4] px-5 py-3 text-sm font-semibold text-[#18231B] transition hover:bg-[#E5EED0]"
                >
                  Manage projects <ArrowUpRight size={17} />
                </Link>

                <Link
                  href="/workspace"
                  className="inline-flex items-center gap-2 rounded-xl border border-[#52684A] px-5 py-3 text-sm font-medium text-[#F5F2E9] transition hover:bg-[#2B4030]"
                >
                  Open workspace <ListTodo size={16} />
                </Link>
              </div>
            </div>

            {/* Decorative illustration */}
            <div className="relative mx-auto flex aspect-square w-full max-w-[290px] items-center justify-center">
              <div className="absolute inset-[7%] rounded-full border border-[#A9BE86]/25" />
              <div className="absolute inset-[18%] rounded-full border border-dashed border-[#E3A080]/40" />
              <div className="absolute inset-[29%] rounded-full border border-[#A9BE86]/35" />

              <div className="relative flex h-28 w-28 items-center justify-center rounded-[30px] border border-[#708A62] bg-[#344B37] shadow-2xl shadow-black/20 sm:h-32 sm:w-32">
                <FolderKanban
                  size={48}
                  strokeWidth={1.3}
                  className="text-[#D6E5B4]"
                />
              </div>

              <div className="absolute right-[8%] top-[16%] flex h-12 w-12 items-center justify-center rounded-2xl border border-[#75513E] bg-[#493329] text-[#E3A080] shadow-lg">
                <Lightbulb size={22} />
              </div>

              <div className="absolute bottom-[14%] left-[8%] flex h-12 w-12 items-center justify-center rounded-2xl border border-[#52684A] bg-[#263B2B] text-[#D6E5B4] shadow-lg">
                <Compass size={22} />
              </div>

              <span className="absolute left-0 top-[23%] h-2 w-2 rounded-full bg-[#E3A080]" />
              <span className="absolute bottom-[20%] right-[5%] h-3 w-3 rounded-full bg-[#D6E5B4]" />
              <span className="absolute right-[22%] top-[3%] h-1.5 w-1.5 rounded-full bg-[#E8CF8C]" />
            </div>
          </div>
        </section>

        {/* Live overview */}
        <section>
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold tracking-[0.16em] text-[#A9BE86]">
                YOUR OVERVIEW
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#F5F2E9]">
                Project health at a glance
              </h2>
            </div>

            <Link
              href="/analytics"
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[#D6E5B4] transition hover:bg-[#26372B]"
            >
              Detailed analytics <ArrowRight size={15} />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Total projects"
              value={loaded ? stats.total : "—"}
              detail="Projects in your saved collection"
              icon={FolderKanban}
            />

            <StatCard
              label="In progress"
              value={loaded ? stats.active : "—"}
              detail="Projects currently underway"
              icon={TrendingUp}
              accent="text-[#E3A080]"
            />

            <StatCard
              label="Completed"
              value={loaded ? stats.completed : "—"}
              detail="Projects marked as completed"
              icon={CheckCircle2}
            />

            <StatCard
              label="Average progress"
              value={loaded ? `${stats.averageProgress}%` : "—"}
              detail="Average across all saved projects"
              icon={Zap}
              accent="text-[#E8CF8C]"
            />
          </div>
        </section>

        {/* Progress and tasks */}
        <section className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-[#344339] bg-[#18231B] p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-[0.15em] text-[#A9BE86]">
                  PROJECT STATUS
                </p>
                <h2 className="mt-2 text-xl font-semibold text-[#F5F2E9]">
                  Where things stand
                </h2>
              </div>
              <div className="rounded-xl bg-[#263B2B] p-3 text-[#D6E5B4]">
                <CircleDashed size={22} />
              </div>
            </div>

            <div className="mt-6 space-y-5">
              {[
                {
                  label: "In progress",
                  value: stats.active,
                  color: "bg-[#A9BE86]",
                },
                {
                  label: "Planning",
                  value: stats.planning,
                  color: "bg-[#E8CF8C]",
                },
                {
                  label: "Completed",
                  value: stats.completed,
                  color: "bg-[#E3A080]",
                },
              ].map((item) => {
                const percentage =
                  stats.total > 0
                    ? Math.round((item.value / stats.total) * 100)
                    : 0;

                return (
                  <div key={item.label}>
                    <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                      <span className="text-[#D0D7CC]">{item.label}</span>
                      <span className="text-[#F5F2E9]">
                        {item.value}
                        <span className="ml-2 text-xs text-[#AAB7A5]">
                          {percentage}%
                        </span>
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-[#344339]">
                      <div
                        className={`h-full rounded-full ${item.color} transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <Link
              href="/projects"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#D6E5B4] hover:text-[#E5EED0]"
            >
              Review all projects <ArrowRight size={15} />
            </Link>
          </div>

          <div className="rounded-2xl border border-[#344339] bg-[#18231B] p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-[0.15em] text-[#A9BE86]">
                  TASK TRACKER
                </p>
                <h2 className="mt-2 text-xl font-semibold text-[#F5F2E9]">
                  Your execution progress
                </h2>
              </div>
              <div className="rounded-xl bg-[#493329] p-3 text-[#E3A080]">
                <ListTodo size={22} />
              </div>
            </div>

            <div className="mt-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-4xl font-semibold text-[#F5F2E9]">
                  {loaded ? `${taskCompletion}%` : "—"}
                </p>
                <p className="mt-1 text-sm text-[#AAB7A5]">
                  Tasks completed
                </p>
              </div>
              <p className="text-right text-sm text-[#C0C8BC]">
                {stats.completedTasks} of {tasks.length} tasks
              </p>
            </div>

            <div className="mt-4">
              <ProgressBar value={taskCompletion} />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-[#344339] bg-[#202F24] p-4">
                <div className="flex items-center gap-2 text-[#D6E5B4]">
                  <CheckCircle2 size={17} />
                  <span className="text-xs">Completed</span>
                </div>
                <p className="mt-3 text-2xl font-semibold text-[#F5F2E9]">
                  {stats.completedTasks}
                </p>
              </div>

              <div className="rounded-xl border border-[#344339] bg-[#202F24] p-4">
                <div className="flex items-center gap-2 text-[#E3A080]">
                  <Clock3 size={17} />
                  <span className="text-xs">Pending</span>
                </div>
                <p className="mt-3 text-2xl font-semibold text-[#F5F2E9]">
                  {stats.pendingTasks}
                </p>
              </div>
            </div>

            <Link
              href="/workspace"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#D6E5B4] hover:text-[#E5EED0]"
            >
              Open task workspace <ArrowRight size={15} />
            </Link>
          </div>
        </section>

        {/* Project collection */}
        <section>
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.16em] text-[#A9BE86]">
                PROJECT COLLECTION
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#F5F2E9] sm:text-3xl">
                Your projects, in focus
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-[#C0C8BC]">
                A quick look at projects from your saved collection.
              </p>
            </div>

            <Link
              href="/projects"
              className="shrink-0 rounded-lg px-3 py-2 text-sm font-medium text-[#D6E5B4] transition hover:bg-[#26372B]"
            >
              View all <span aria-hidden="true">↗</span>
            </Link>
          </div>

          {featuredProjects.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {featuredProjects.map((project, index) => {
                const accent = accents[index % accents.length];
                const Icon = accent.icon;

                return (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border ${accent.line} bg-[#18231B] p-5 transition duration-300 hover:-translate-y-1 hover:bg-[#202F24]`}
                  >
                    <div
                      className={`absolute right-0 top-0 h-24 w-24 rounded-bl-full ${accent.tile} opacity-30 transition group-hover:opacity-60`}
                    />

                    <div className="relative flex items-start justify-between gap-3">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl ${accent.tile} ${accent.color}`}
                      >
                        <Icon size={23} strokeWidth={1.6} />
                      </div>
                      <ArrowUpRight
                        size={19}
                        className="text-[#AAB7A5] transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#D6E5B4]"
                      />
                    </div>

                    <p className="mt-5 text-xs font-medium text-[#D6E5B4]">
                      {project.category}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-[#F5F2E9]">
                      {project.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-6 text-[#C0C8BC]">
                      {project.description}
                    </p>

                    <div className="mt-5">
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <span
                          className={`rounded-full border px-2.5 py-1 text-xs ${statusColor(project.status)}`}
                        >
                          {project.status}
                        </span>
                        <span className="text-xs font-medium text-[#D6E5B4]">
                          {project.progress}%
                        </span>
                      </div>
                      <ProgressBar value={project.progress} />
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#52684A] bg-[#18231B] p-8 text-center">
              <FolderKanban
                size={32}
                className="mx-auto text-[#A9BE86]"
              />
              <h3 className="mt-3 text-lg font-semibold text-[#F5F2E9]">
                Your next project starts here
              </h3>
              <p className="mt-2 text-sm text-[#C0C8BC]">
                Explore your project collection to get started.
              </p>
              <Link
                href="/projects"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#D6E5B4] px-4 py-2.5 text-sm font-semibold text-[#18231B] hover:bg-[#E5EED0]"
              >
                Explore projects <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </section>

        {/* Continue working */}
        <section>
          <div className="mb-5">
            <p className="text-xs font-semibold tracking-[0.15em] text-[#A9BE86]">
              KEEP MOVING
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-[#F5F2E9]">
              Pick up where you left off
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {nextProjects.slice(0, 2).map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="group rounded-2xl border border-[#344339] bg-[#18231B] p-5 transition hover:border-[#6C835E] hover:bg-[#202F24]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-[#A9BE86]">
                      {project.category}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-[#F5F2E9]">
                      {project.title}
                    </h3>
                  </div>
                  <ArrowUpRight
                    size={19}
                    className="shrink-0 text-[#AAB7A5] transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#D6E5B4]"
                  />
                </div>

                <div className="mt-5 flex items-center justify-between gap-3 text-xs text-[#C0C8BC]">
                  <span>{project.status}</span>
                  <span>{project.progress}% complete</span>
                </div>
                <div className="mt-3">
                  <ProgressBar value={project.progress} />
                </div>
              </Link>
            ))}

            {nextProjects.length === 0 && (
              <div className="rounded-2xl border border-[#344339] bg-[#18231B] p-5 sm:col-span-2">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={24} className="text-[#D6E5B4]" />
                  <div>
                    <p className="font-semibold text-[#F5F2E9]">
                      All projects are marked completed!
                    </p>
                    <p className="mt-1 text-sm text-[#AAB7A5]">
                      Explore the collection whenever you are ready for your
                      next project.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Quick actions */}
        <section>
          <div className="mb-5">
            <p className="text-xs font-semibold tracking-[0.15em] text-[#A9BE86]">
              QUICK ACCESS
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-[#F5F2E9]">
              What would you like to do?
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Link
              href="/projects"
              className="group rounded-2xl border border-[#344339] bg-[#18231B] p-5 transition hover:-translate-y-1 hover:border-[#6C835E] hover:bg-[#202F24]"
            >
              <FolderKanban
                size={23}
                className="text-[#D6E5B4] transition group-hover:scale-110"
              />
              <h3 className="mt-4 font-semibold text-[#F5F2E9]">
                Manage projects
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#AAB7A5]">
                Browse your projects and explore their details.
              </p>
              <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[#D6E5B4]">
                Open projects <ArrowRight size={14} />
              </span>
            </Link>

            <Link
              href="/workspace"
              className="group rounded-2xl border border-[#344339] bg-[#18231B] p-5 transition hover:-translate-y-1 hover:border-[#6C835E] hover:bg-[#202F24]"
            >
              <ListTodo
                size={23}
                className="text-[#E3A080] transition group-hover:scale-110"
              />
              <h3 className="mt-4 font-semibold text-[#F5F2E9]">
                Track tasks
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#AAB7A5]">
                Review your task list and keep work moving.
              </p>
              <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[#D6E5B4]">
                Open workspace <ArrowRight size={14} />
              </span>
            </Link>

            <Link
              href="/analytics"
              className="group rounded-2xl border border-[#344339] bg-[#18231B] p-5 transition hover:-translate-y-1 hover:border-[#6C835E] hover:bg-[#202F24]"
            >
              <TrendingUp
                size={23}
                className="text-[#E8CF8C] transition group-hover:scale-110"
              />
              <h3 className="mt-4 font-semibold text-[#F5F2E9]">
                Analytics & insights
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#AAB7A5]">
                Understand project distribution and overall progress.
              </p>
              <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[#D6E5B4]">
                View analytics <ArrowRight size={14} />
              </span>
            </Link>

            <Link
              href="/innovation-lab"
              className="group rounded-2xl border border-[#344339] bg-[#18231B] p-5 transition hover:-translate-y-1 hover:border-[#6C835E] hover:bg-[#202F24]"
            >
              <FlaskConical
                size={23}
                className="text-[#D6E5B4] transition group-hover:scale-110"
              />
              <h3 className="mt-4 font-semibold text-[#F5F2E9]">
                Innovation Lab
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#AAB7A5]">
                Explore experiments, ideas, and interactive tools.
              </p>
              <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[#D6E5B4]">
                Explore lab <ArrowRight size={14} />
              </span>
            </Link>
          </div>
        </section>

        {/* GitHub */}
        <section className="relative overflow-hidden rounded-2xl border border-[#52684A] bg-[#202F24] p-6 sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-8">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -top-20 h-48 w-48 rounded-full border border-[#A9BE86]/20"
          />

          <div className="relative">
            <div className="flex items-center gap-3">
              <CodeXml size={25} className="text-[#D6E5B4]" />
              <p className="text-xs font-semibold tracking-[0.15em] text-[#E3A080]">
                YOUR DEVELOPER SPACE
              </p>
            </div>

            <h2 className="mt-3 text-xl font-semibold text-[#F5F2E9] sm:text-2xl">
              Your code, your progress, your next big idea.
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#C0C8BC]">
              Explore your public GitHub repositories, programming languages,
              and project links.
            </p>
          </div>

          <Link
            href="/github"
            className="relative mt-5 inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#D6E5B4] px-5 py-3 text-sm font-semibold text-[#18231B] transition hover:bg-[#E5EED0] sm:mt-0"
          >
            Open GitHub dashboard <ArrowUpRight size={17} />
          </Link>
        </section>

        {/* Closing section */}
        <section className="relative overflow-hidden rounded-2xl border border-[#405443] bg-[#1C2D22] p-6 sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-8">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -top-20 h-48 w-48 rounded-full border border-[#A9BE86]/20"
          />

          <div className="relative">
            <p className="text-xs font-semibold tracking-[0.15em] text-[#E3A080]">
              SMALL STEPS. REAL PROGRESS.
            </p>
            <h2 className="mt-2 text-xl font-semibold text-[#F5F2E9] sm:text-2xl">
              Make your next move count.
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#C0C8BC]">
              Choose a project, track your next task, and keep building
              momentum.
            </p>
          </div>

          <Link
            href="/projects"
            className="relative mt-5 inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#D6E5B4] px-5 py-3 text-sm font-semibold text-[#18231B] transition hover:bg-[#E5EED0] sm:mt-0"
          >
            Continue building <ArrowUpRight size={17} />
          </Link>
        </section>
      </main>
    </AppLayout>
  );
}
