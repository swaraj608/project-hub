"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  CircleDashed,
  Clock3,
  FolderKanban,
  ListTodo,
  RefreshCw,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";

import AppLayout from "@/components/AppLayout";
import {
  starterProjects,
  type Project,
} from "@/lib/projects";
import {
  readProjects,
  readTasks,
  type Task,
} from "@/lib/storage";

const statusStyles: Record<string, string> = {
  Planning: "border-amber-400/20 bg-amber-400/10 text-amber-200",
  "In progress": "border-sky-400/20 bg-sky-400/10 text-sky-200",
  Completed: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
};

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  accent,
}: {
  title: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
  accent: string;
}) {
  return (
    <article className="rounded-2xl border border-[#344339] bg-[#18231B] p-5 transition hover:border-[#607657]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-[#B8C4B4]">{title}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-[#F5F2E9]">
            {value}
          </p>
        </div>
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${accent}`}
        >
          <Icon size={21} />
        </div>
      </div>
      <p className="mt-4 text-xs leading-5 text-[#AAB7A5]">
        {description}
      </p>
    </article>
  );
}

function ProgressBar({
  value,
  color = "bg-[#A9BE86]",
}: {
  value: number;
  color?: string;
}) {
  const safeValue = Math.min(100, Math.max(0, value));

  return (
    <div
      className="h-2 overflow-hidden rounded-full bg-[#344339]"
      role="progressbar"
      aria-valuenow={safeValue}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`h-full rounded-full transition-all duration-700 ${color}`}
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
}

export default function AnalyticsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    function loadAnalyticsData() {
      setProjects(readProjects(starterProjects));
      setTasks(readTasks([]));
      setLoaded(true);
    }

    loadAnalyticsData();

    window.addEventListener("storage", loadAnalyticsData);

    return () => {
      window.removeEventListener("storage", loadAnalyticsData);
    };
  }, []);

  const stats = useMemo(() => {
    const totalProjects = projects.length;
    const completedProjects = projects.filter(
      (project) => project.status === "Completed"
    ).length;
    const activeProjects = projects.filter(
      (project) => project.status === "In progress"
    ).length;
    const planningProjects = projects.filter(
      (project) => project.status === "Planning"
    ).length;

    const averageProgress =
      totalProjects > 0
        ? Math.round(
            projects.reduce(
              (sum, project) =>
                sum + Math.min(100, Math.max(0, project.progress)),
              0
            ) / totalProjects
          )
        : 0;

    const completedTasks = tasks.filter((task) => task.done).length;
    const pendingTasks = tasks.length - completedTasks;

    const priorities = {
      High: tasks.filter((task) => task.priority === "High" && !task.done)
        .length,
      Medium: tasks.filter(
        (task) => task.priority === "Medium" && !task.done
      ).length,
      Low: tasks.filter((task) => task.priority === "Low" && !task.done)
        .length,
    };

    const completionRate =
      tasks.length > 0
        ? Math.round((completedTasks / tasks.length) * 100)
        : 0;

    const categories = projects.reduce<Record<string, number>>(
      (result, project) => {
        result[project.category] = (result[project.category] || 0) + 1;
        return result;
      },
      {}
    );

    const topCategories = Object.entries(categories)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return {
      totalProjects,
      completedProjects,
      activeProjects,
      planningProjects,
      averageProgress,
      completedTasks,
      pendingTasks,
      totalTasks: tasks.length,
      completionRate,
      priorities,
      topCategories,
    };
  }, [projects, tasks]);

  const projectStatus = [
    {
      label: "In progress",
      count: stats.activeProjects,
      color: "bg-sky-300",
    },
    {
      label: "Planning",
      count: stats.planningProjects,
      color: "bg-amber-300",
    },
    {
      label: "Completed",
      count: stats.completedProjects,
      color: "bg-emerald-300",
    },
  ];

  const insights = [
    {
      title: "Project momentum",
      description:
        stats.activeProjects > 0
          ? `${stats.activeProjects} project${stats.activeProjects === 1 ? "" : "s"} currently marked In progress.`
          : "No projects are currently marked In progress.",
      icon: Activity,
    },
    {
      title: "Task completion",
      description:
        stats.totalTasks > 0
          ? `${stats.completionRate}% of your saved tasks are completed.`
          : "Add tasks in your Workspace to start tracking task completion.",
      icon: CheckCircle2,
    },
    {
      title: "Next priority",
      description:
        stats.priorities.High > 0
          ? `${stats.priorities.High} high-priority task${stats.priorities.High === 1 ? "" : "s"} remain unfinished.`
          : stats.pendingTasks > 0
            ? `${stats.pendingTasks} task${stats.pendingTasks === 1 ? "" : "s"} remain unfinished.`
            : "No unfinished tasks are currently recorded.",
      icon: Target,
    },
  ];

  if (!loaded) {
    return (
      <AppLayout>
        <div className="flex min-h-[60vh] items-center justify-center text-[#D6E5B4]">
          <RefreshCw className="mr-3 animate-spin" size={20} />
          Loading your analytics...
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl space-y-8 pb-12">
        {/* Header */}
        <section className="relative isolate overflow-hidden rounded-3xl border border-[#344339] bg-[#18231B] p-6 sm:p-9">
          <div className="pointer-events-none absolute -right-16 -top-20 -z-10 h-72 w-72 rounded-full bg-[#D6E5B4]/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-1/3 -z-10 h-56 w-56 rounded-full bg-[#E3A080]/10 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#405C43] bg-[#202F24] px-3 py-1.5 text-xs font-semibold tracking-wide text-[#D6E5B4]">
                <Sparkles size={14} />
                PROJECT INTELLIGENCE
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-[#F5F2E9] sm:text-5xl">
                Analytics
                <span className="block text-[#D6E5B4]">
                  &amp; Insights.
                </span>
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-7 text-[#C0C8BC] sm:text-base">
                Understand your project portfolio, monitor progress and see
                what needs your attention next. Your dashboard uses your saved
                project and task data.
              </p>
            </div>

            <Link
              href="/projects"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#D6E5B4] px-5 py-3 text-sm font-semibold text-[#18231B] transition hover:bg-[#E3EDCE]"
            >
              View projects
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        {/* Main stats */}
        <section>
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-[#A9BE86]" />
            <h2 className="text-lg font-semibold text-[#F5F2E9]">
              Portfolio overview
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total projects"
              value={stats.totalProjects}
              description="Projects currently available in your saved portfolio."
              icon={FolderKanban}
              accent="bg-[#344B37] text-[#D6E5B4]"
            />
            <StatCard
              title="In progress"
              value={stats.activeProjects}
              description="Projects marked as actively being worked on."
              icon={Zap}
              accent="bg-sky-400/10 text-sky-200"
            />
            <StatCard
              title="Completed"
              value={stats.completedProjects}
              description="Projects marked as completed."
              icon={CheckCircle2}
              accent="bg-emerald-400/10 text-emerald-200"
            />
            <StatCard
              title="Average progress"
              value={`${stats.averageProgress}%`}
              description="Average progress across all available projects."
              icon={Target}
              accent="bg-amber-400/10 text-amber-200"
            />
          </div>
        </section>

        {/* Charts and status */}
        <section className="grid gap-5 lg:grid-cols-2">
          <article className="rounded-2xl border border-[#344339] bg-[#18231B] p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold text-[#F5F2E9]">
                  Project status
                </h2>
                <p className="mt-1 text-xs text-[#AAB7A5]">
                  How your projects are distributed.
                </p>
              </div>
              <FolderKanban className="text-[#A9BE86]" size={20} />
            </div>

            <div className="mt-7 space-y-5">
              {projectStatus.map((item) => {
                const percentage =
                  stats.totalProjects > 0
                    ? Math.round((item.count / stats.totalProjects) * 100)
                    : 0;

                return (
                  <div key={item.label}>
                    <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                      <span className="text-[#D5DBD0]">{item.label}</span>
                      <span className="text-[#F5F2E9]">
                        {item.count}
                        <span className="ml-2 text-xs text-[#AAB7A5]">
                          {percentage}%
                        </span>
                      </span>
                    </div>
                    <ProgressBar
                      value={percentage}
                      color={item.color}
                    />
                  </div>
                );
              })}
            </div>

            <div className="mt-7 rounded-xl border border-[#344339] bg-[#202F24]/70 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-[#D6E5B4]">
                <CircleDashed size={16} />
                Planning queue
              </div>
              <p className="mt-2 text-sm leading-6 text-[#C0C8BC]">
                {stats.planningProjects > 0
                  ? `${stats.planningProjects} project${stats.planningProjects === 1 ? " is" : "s are"} waiting in the planning stage.`
                  : "You have no projects currently marked as Planning."}
              </p>
            </div>
          </article>

          <article className="rounded-2xl border border-[#344339] bg-[#18231B] p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold text-[#F5F2E9]">
                  Task progress
                </h2>
                <p className="mt-1 text-xs text-[#AAB7A5]">
                  Completion across your saved tasks.
                </p>
              </div>
              <ListTodo className="text-[#A9BE86]" size={20} />
            </div>

            <div className="mt-6 flex items-center gap-5">
              <div className="flex h-28 w-28 shrink-0 flex-col items-center justify-center rounded-full border-[8px] border-[#405443] bg-[#202F24]">
                <span className="text-2xl font-bold text-[#F5F2E9]">
                  {stats.completionRate}%
                </span>
                <span className="mt-1 text-[10px] text-[#AAB7A5]">
                  completed
                </span>
              </div>
              <div className="min-w-0 flex-1 space-y-4">
                <div>
                  <p className="text-2xl font-bold text-[#D6E5B4]">
                    {stats.completedTasks}
                  </p>
                  <p className="text-xs text-[#AAB7A5]">
                    Completed tasks
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#F5F2E9]">
                    {stats.pendingTasks}
                  </p>
                  <p className="text-xs text-[#AAB7A5]">
                    Pending tasks
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-7">
              <div className="mb-2 flex justify-between text-xs text-[#AAB7A5]">
                <span>Overall task completion</span>
                <span>
                  {stats.completedTasks}/{stats.totalTasks}
                </span>
              </div>
              <ProgressBar value={stats.completionRate} />
            </div>

            <div className="mt-7 border-t border-[#344339] pt-5">
              <h3 className="mb-4 text-sm font-medium text-[#D5DBD0]">
                Pending tasks by priority
              </h3>

              {(
                [
                  ["High", stats.priorities.High, "bg-rose-300"],
                  ["Medium", stats.priorities.Medium, "bg-amber-300"],
                  ["Low", stats.priorities.Low, "bg-emerald-300"],
                ] as const
              ).map(([label, count, color]) => (
                <div
                  key={label}
                  className="mb-3 flex items-center justify-between gap-3 last:mb-0"
                >
                  <div className="flex items-center gap-2 text-sm text-[#C0C8BC]">
                    <span className={`h-2 w-2 rounded-full ${color}`} />
                    {label} priority
                  </div>
                  <span className="text-sm font-semibold text-[#F5F2E9]">
                    {count}
                  </span>
                </div>
              ))}
            </div>

            <Link
              href="/workspace"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#D6E5B4] hover:text-white"
            >
              Open workspace
              <ArrowRight size={15} />
            </Link>
          </article>
        </section>

        {/* Project progress */}
        <section className="rounded-2xl border border-[#344339] bg-[#18231B] p-5 sm:p-6">
          <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-2 text-sm text-[#D6E5B4]">
                <Activity size={17} />
                Project tracking
              </div>
              <h2 className="mt-2 text-xl font-bold text-[#F5F2E9]">
                Progress by project
              </h2>
              <p className="mt-1 text-sm text-[#AAB7A5]">
                A closer look at individual project progress.
              </p>
            </div>
            <span className="text-xs text-[#AAB7A5]">
              {projects.length} projects
            </span>
          </div>

          {projects.length > 0 ? (
            <div className="space-y-5">
              {[...projects]
                .sort((a, b) => b.progress - a.progress)
                .map((project) => (
                  <div key={project.id}>
                    <div className="mb-2 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                      <div className="min-w-0">
                        <Link
                          href={`/projects/${project.id}`}
                          className="font-medium text-[#F5F2E9] transition hover:text-[#D6E5B4]"
                        >
                          {project.title}
                        </Link>
                        <p className="mt-1 text-xs text-[#AAB7A5]">
                          {project.category}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`rounded-full border px-2.5 py-1 text-[11px] ${
                            statusStyles[project.status] ||
                            "border-[#405443] bg-[#202F24] text-[#D6E5B4]"
                          }`}
                        >
                          {project.status}
                        </span>
                        <span className="w-10 text-right text-sm font-semibold text-[#F5F2E9]">
                          {Math.min(100, Math.max(0, project.progress))}%
                        </span>
                      </div>
                    </div>
                    <ProgressBar value={project.progress} />
                  </div>
                ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-[#405443] p-8 text-center">
              <FolderKanban className="mx-auto mb-3 text-[#A9BE86]" size={26} />
              <p className="font-medium text-[#F5F2E9]">
                No projects to analyse
              </p>
              <p className="mt-2 text-sm text-[#AAB7A5]">
                Add a project to start tracking progress.
              </p>
            </div>
          )}

          <div className="mt-6 border-t border-[#344339] pt-5">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#D6E5B4] transition hover:text-white"
            >
              Explore all projects
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        {/* Category breakdown */}
        <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
          <article className="rounded-2xl border border-[#344339] bg-[#18231B] p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-[#D6E5B4]" />
              <h2 className="font-semibold text-[#F5F2E9]">
                Innovation landscape
              </h2>
            </div>
            <p className="mt-2 text-sm text-[#AAB7A5]">
              The categories represented across your projects.
            </p>

            {stats.topCategories.length > 0 ? (
              <div className="mt-6 space-y-4">
                {stats.topCategories.map(([category, count]) => {
                  const percentage =
                    stats.totalProjects > 0
                      ? Math.round((count / stats.totalProjects) * 100)
                      : 0;

                  return (
                    <div key={category}>
                      <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                        <span className="text-[#D5DBD0]">{category}</span>
                        <span className="text-[#AAB7A5]">
                          {count} project{count === 1 ? "" : "s"}
                        </span>
                      </div>
                      <ProgressBar
                        value={percentage}
                        color="bg-[#D6E5B4]"
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="mt-6 text-sm text-[#AAB7A5]">
                Project categories will appear here when projects are available.
              </p>
            )}
          </article>

          <article className="rounded-2xl border border-[#344339] bg-[#18231B] p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <Zap size={18} className="text-[#E3A080]" />
              <h2 className="font-semibold text-[#F5F2E9]">
                Actionable insights
              </h2>
            </div>
            <p className="mt-2 text-sm text-[#AAB7A5]">
              Summaries calculated from your current saved data.
            </p>

            <div className="mt-5 space-y-3">
              {insights.map((insight, index) => {
                const Icon = insight.icon;

                return (
                  <div
                    key={insight.title}
                    className="flex gap-3 rounded-xl border border-[#344339] bg-[#202F24]/60 p-4"
                  >
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                        index === 2
                          ? "bg-[#E3A080]/10 text-[#E3A080]"
                          : "bg-[#344B37] text-[#D6E5B4]"
                      }`}
                    >
                      <Icon size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-[#F5F2E9]">
                        {insight.title}
                      </h3>
                      <p className="mt-1 text-xs leading-5 text-[#B8C4B4]">
                        {insight.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </article>
        </section>

        {/* Footer note */}
        <div className="flex items-start gap-3 rounded-xl border border-[#344339] bg-[#202F24]/50 p-4">
          <Clock3 size={17} className="mt-0.5 shrink-0 text-[#A9BE86]" />
          <p className="text-xs leading-5 text-[#AAB7A5]">
            Insights are calculated from the project and task data currently
            saved in this browser. Task records do not currently include
            deadlines or project assignments, so overdue tasks and
            project-specific task totals are not included.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}