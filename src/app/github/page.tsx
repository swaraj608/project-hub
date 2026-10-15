"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import AppLayout from "@/components/AppLayout";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  CodeXml,
  ExternalLink,
  FolderKanban,
  GitFork,
  Globe,
  Layers3,
  RefreshCw,
  Search,
  Sparkles,
  Star,
  Terminal,
} from "lucide-react";

type ProjectCategory =
  | "AI / Machine Learning"
  | "Full-Stack Development"
  | "Frontend / UI"
  | "Backend / API"
  | "Culture & Heritage"
  | "Environment"
  | "Mobile Development"
  | "Other";

type GitHubProfile = {
  username: string;
  name: string | null;
  avatar: string;
  bio: string | null;
  profileUrl: string;
  publicRepos: number;
  followers: number;
  following: number;
};

type GitHubRepo = {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  url: string;
  homepage: string | null;
  language: string | null;
  stars: number;
  forks: number;
  createdAt: string;
  updatedAt: string;
  isFork: boolean;
  archived: boolean;
  topics: string[];
};

type GitHubData = {
  profile: GitHubProfile;
  repos: GitHubRepo[];
  fetchedAt?: string;
};

type ProjectMetadata = {
  category?: ProjectCategory;
};

type ProjectMetadataMap = Record<string, ProjectMetadata>;

const STORAGE_KEY = "project-hub-github-project-metadata";

const panel = "rounded-2xl border border-[#344339] bg-[#18231B]";

const categories: ProjectCategory[] = [
  "AI / Machine Learning",
  "Full-Stack Development",
  "Frontend / UI",
  "Backend / API",
  "Culture & Heritage",
  "Environment",
  "Mobile Development",
  "Other",
];

function formatDate(date: string) {
  if (!date) return "Unknown";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "Unknown";

  return parsed.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getWebsiteUrl(value: string): string | null {
  const trimmed = value.trim();

  if (!trimmed) return null;

  const normalized = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : "https://" + trimmed;

  try {
    const url = new URL(normalized);

    if (url.protocol === "http:" || url.protocol === "https:") {
      return url.toString();
    }

    return null;
  } catch {
    return null;
  }
}

function suggestCategory(repo: GitHubRepo): ProjectCategory {
  const text = [
    repo.name,
    repo.description ?? "",
    ...repo.topics,
  ]
    .join(" ")
    .toLowerCase();

  if (
    /heritage|culture|cultural|history|museum|monument|tradition|virasat/.test(
      text
    )
  ) {
    return "Culture & Heritage";
  }

  if (
    /environment|sustainability|eco-friendly|climate|green-energy|carbon/.test(
      text
    )
  ) {
    return "Environment";
  }

  if (
    /machine-learning|deep-learning|artificial-intelligence|\bai\b|llm|chatbot|tensorflow|pytorch/.test(
      text
    )
  ) {
    return "AI / Machine Learning";
  }

  if (/android|flutter|react-native|mobile-app|ios-app/.test(text)) {
    return "Mobile Development";
  }

  if (
    /api|backend|server|express|fastapi|django|spring-boot|node-api/.test(
      text
    )
  ) {
    return "Backend / API";
  }

  if (
    /full.?stack|fullstack|next\.?js|nextjs|mern|mean-stack/.test(
      text
    )
  ) {
    return "Full-Stack Development";
  }

  if (
    /frontend|front-end|portfolio|landing-page|ui-design|dashboard|website|web-app/.test(
      text
    )
  ) {
    return "Frontend / UI";
  }

  if (
    ["HTML", "CSS", "JavaScript", "TypeScript"].includes(
      repo.language ?? ""
    )
  ) {
    return "Frontend / UI";
  }

  return "Other";
}

export default function GitHubPage() {
  const [data, setData] = useState<GitHubData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState("All");
  const [category, setCategory] = useState("All");
  const [showForks, setShowForks] = useState(true);
  const [metadata, setMetadata] = useState<ProjectMetadataMap>({});
  const [metadataReady, setMetadataReady] = useState(false);

  // Load previously saved categories and ignore old status data.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved) as ProjectMetadataMap;
        const cleaned: ProjectMetadataMap = {};

        Object.entries(parsed).forEach(([key, value]) => {
          if (
            value?.category &&
            categories.includes(value.category)
          ) {
            cleaned[key] = { category: value.category };
          }
        });

        setMetadata(cleaned);
      }
    } catch {
      // Continue with empty metadata if storage is unavailable.
    } finally {
      setMetadataReady(true);
    }
  }, []);

  // Save category selections in this browser.
  useEffect(() => {
    if (!metadataReady) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(metadata));
    } catch {
      // The page still works if browser storage is unavailable.
    }
  }, [metadata, metadataReady]);

  const loadGitHubData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/github", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Could not load GitHub data."
        );
      }

      setData(result as GitHubData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to connect to GitHub."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadGitHubData();
  }, [loadGitHubData]);

  const getCategory = useCallback(
    (repo: GitHubRepo): ProjectCategory => {
      return (
        metadata[String(repo.id)]?.category ??
        suggestCategory(repo)
      );
    },
    [metadata]
  );

  const updateCategory = (
    repo: GitHubRepo,
    value: ProjectCategory
  ) => {
    const key = String(repo.id);

    setMetadata((previous) => ({
      ...previous,
      [key]: {
        category: value,
      },
    }));
  };

  const languages = useMemo(() => {
    const values = (data?.repos ?? [])
      .map((repo) => repo.language)
      .filter((value): value is string => Boolean(value));

    return ["All", ...Array.from(new Set(values)).sort()];
  }, [data]);

  const ownedRepos = useMemo(
    () => (data?.repos ?? []).filter((repo) => !repo.isFork),
    [data]
  );

  const totalStars = ownedRepos.reduce(
    (total, repo) => total + repo.stars,
    0
  );

  const totalForks = ownedRepos.reduce(
    (total, repo) => total + repo.forks,
    0
  );

  const liveCount = ownedRepos.filter(
    (repo) =>
      Boolean(repo.homepage && getWebsiteUrl(repo.homepage))
  ).length;

  const languageStats = useMemo(() => {
    const counts: Record<string, number> = {};

    ownedRepos.forEach((repo) => {
      const name = repo.language || "Unspecified";
      counts[name] = (counts[name] ?? 0) + 1;
    });

    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [ownedRepos]);

  const categoryStats = useMemo(() => {
    const counts: Record<string, number> = {};

    ownedRepos.forEach((repo) => {
      const name = getCategory(repo);
      counts[name] = (counts[name] ?? 0) + 1;
    });

    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [ownedRepos, getCategory]);

  const filteredRepos = useMemo(() => {
    const query = search.trim().toLowerCase();

    return (data?.repos ?? [])
      .filter((repo) => showForks || !repo.isFork)
      .filter(
        (repo) => language === "All" || repo.language === language
      )
      .filter(
        (repo) => category === "All" || getCategory(repo) === category
      )
      .filter((repo) =>
        [
          repo.name,
          repo.description ?? "",
          repo.language ?? "",
          ...repo.topics,
          getCategory(repo),
        ]
          .join(" ")
          .toLowerCase()
          .includes(query)
      );
  }, [
    data,
    search,
    language,
    category,
    showForks,
    getCategory,
  ]);

  return (
    <AppLayout>
      <main className="mx-auto max-w-7xl space-y-8 pb-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#C0C8BC] transition hover:text-[#D6E5B4]"
        >
          <ArrowLeft size={16} />
          Back to Project Hub
        </Link>

        <section className="relative isolate overflow-hidden rounded-[28px] border border-[#405443] bg-[#1C2D22] p-6 sm:p-9">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-24 -z-10 h-72 w-72 rounded-full border border-[#D6E5B4]/15"
          />

          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#52684A] bg-[#263B2B] px-3 py-2 text-xs font-medium text-[#D6E5B4]">
                <CodeXml size={15} />
                GITHUB ANALYTICS
              </div>

              <h1 className="mt-5 text-3xl font-semibold tracking-tight text-[#F5F2E9] sm:text-4xl">
                Your work, in perspective.
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#C0C8BC]">
                Explore your repositories, understand your tech stack,
                organise project types, and see your GitHub activity in one place.
              </p>

              {data && (
                <a
                  href={data.profile.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#D6E5B4] hover:text-white"
                >
                  @{data.profile.username}
                  <ExternalLink size={15} />
                </a>
              )}
            </div>

            <button
              onClick={() => void loadGitHubData()}
              disabled={loading}
              className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-[#52684A] bg-[#263B2B] px-4 py-3 text-sm font-medium text-[#F5F2E9] transition hover:bg-[#344B37] disabled:opacity-60 sm:self-center"
            >
              <RefreshCw
                size={16}
                className={loading ? "animate-spin" : ""}
              />
              Refresh GitHub
            </button>
          </div>
        </section>

        {error && (
          <section
            role="alert"
            className="rounded-2xl border border-[#75513E] bg-[#30241F] p-5"
          >
            <p className="font-semibold text-[#F5F2E9]">
              GitHub connection failed
            </p>
            <p className="mt-2 text-sm text-[#E3A080]">{error}</p>
            <button
              onClick={() => void loadGitHubData()}
              className="mt-4 rounded-lg bg-[#E3A080] px-4 py-2 text-sm font-semibold text-[#18231B]"
            >
              Try again
            </button>
          </section>
        )}

        {loading && !data && (
          <section className={`${panel} p-10 text-center`}>
            <RefreshCw
              size={28}
              className="mx-auto animate-spin text-[#D6E5B4]"
            />
            <p className="mt-4 font-medium text-[#F5F2E9]">
              Connecting to GitHub...
            </p>
          </section>
        )}

        {data && (
          <>
            <section
              className={`${panel} flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-6`}
            >
              <img
                src={data.profile.avatar}
                alt={`${data.profile.username}'s avatar`}
                className="h-20 w-20 rounded-2xl border border-[#405443] object-cover"
              />

              <div className="min-w-0 flex-1">
                <h2 className="text-xl font-semibold text-[#F5F2E9]">
                  {data.profile.name || data.profile.username}
                </h2>
                <p className="mt-1 text-sm text-[#D6E5B4]">
                  @{data.profile.username}
                </p>
                <p className="mt-2 text-sm leading-6 text-[#C0C8BC]">
                  {data.profile.bio ||
                    "Building projects and learning by creating."}
                </p>
                <p className="mt-2 text-xs text-[#AAB7A5]">
                  {data.profile.followers} followers · {data.profile.following} following
                </p>
              </div>

              <a
                href={data.profile.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#D6E5B4] px-4 py-3 text-sm font-semibold text-[#18231B] hover:bg-[#E5EED0]"
              >
                Visit GitHub <ArrowUpRight size={16} />
              </a>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                icon={<CodeXml size={19} />}
                label="Public repositories"
                value={data.profile.publicRepos}
                note="Reported by GitHub"
              />
              <StatCard
                icon={<FolderKanban size={19} />}
                label="Owned projects loaded"
                value={ownedRepos.length}
                note="Excludes forked repositories"
              />
              <StatCard
                icon={<Star size={19} />}
                label="Total stars"
                value={totalStars}
                note="Across owned repositories"
              />
              <StatCard
                icon={<Globe size={19} />}
                label="Repositories with demo links"
                value={liveCount}
                note="Homepage URLs available"
              />
            </section>

            <section className="grid gap-4 sm:grid-cols-2">
              <StatCard
                icon={<GitFork size={19} />}
                label="Total forks received"
                value={totalForks}
                note="Across owned repositories"
              />
              <StatCard
                icon={<Layers3 size={19} />}
                label="Languages used"
                value={
                  languageStats.filter(([name]) => name !== "Unspecified")
                    .length
                }
                note="Distinct languages detected by GitHub"
              />
            </section>

            <section className="grid gap-4 lg:grid-cols-2">
              <div className={`${panel} p-5 sm:p-6`}>
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-[#263B2B] p-2.5 text-[#D6E5B4]">
                    <Layers3 size={20} />
                  </div>
                  <div>
                    <h2 className="font-semibold text-[#F5F2E9]">
                      Technology breakdown
                    </h2>
                    <p className="mt-1 text-xs text-[#AAB7A5]">
                      Languages reported by GitHub
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  {languageStats.slice(0, 7).map(([name, count]) => (
                    <div key={name}>
                      <div className="mb-2 flex justify-between gap-3 text-sm">
                        <span className="text-[#E0E5DA]">{name}</span>
                        <span className="text-[#C0C8BC]">{count}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-[#26372B]">
                        <div
                          className="h-full rounded-full bg-[#A9BE86]"
                          style={{
                            width: `${Math.max(
                              5,
                              (count / Math.max(1, ownedRepos.length)) * 100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}

                  {languageStats.length === 0 && (
                    <p className="text-sm text-[#AAB7A5]">
                      No language data is available yet.
                    </p>
                  )}
                </div>
              </div>

              <div className={`${panel} p-5 sm:p-6`}>
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-[#263B2B] p-2.5 text-[#D6E5B4]">
                    <FolderKanban size={20} />
                  </div>
                  <div>
                    <h2 className="font-semibold text-[#F5F2E9]">
                      Project categories
                    </h2>
                    <p className="mt-1 text-xs text-[#AAB7A5]">
                      Suggested from repository details; editable below
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {categoryStats.map(([name, count]) => (
                    <button
                      key={name}
                      onClick={() => setCategory(name)}
                      className="flex w-full items-center justify-between gap-3 rounded-xl border border-[#344339] bg-[#202F24] p-3 text-left transition hover:border-[#6C835E]"
                    >
                      <span className="text-sm text-[#E0E5DA]">{name}</span>
                      <span className="rounded-lg bg-[#344B37] px-2.5 py-1 text-xs font-semibold text-[#D6E5B4]">
                        {count}
                      </span>
                    </button>
                  ))}

                  {categoryStats.length === 0 && (
                    <p className="text-sm text-[#AAB7A5]">
                      No categories available.
                    </p>
                  )}
                </div>
              </div>
            </section>

            <section>
              <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <p className="text-xs font-semibold tracking-[0.16em] text-[#A9BE86]">
                    YOUR COLLECTION
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-[#F5F2E9] sm:text-3xl">
                    Project inventory
                  </h2>
                  <p className="mt-2 text-sm text-[#C0C8BC]">
                    {filteredRepos.length} matching repositories ·{" "}
                    {ownedRepos.length} owned, non-fork repositories loaded
                  </p>
                </div>

                <a
                  href={`${data.profile.profileUrl}?tab=repositories`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 self-start rounded-xl border border-[#52684A] px-4 py-3 text-sm font-medium text-[#F5F2E9] hover:bg-[#263B2B]"
                >
                  All on GitHub <ArrowUpRight size={16} />
                </a>
              </div>

              <div
                className={`${panel} mb-5 grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-3`}
              >
                <div className="relative min-w-0">
                  <Search
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#AAB7A5]"
                  />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search projects..."
                    aria-label="Search projects"
                    className="w-full rounded-xl border border-[#344339] bg-[#111914] py-3 pl-10 pr-3 text-sm text-[#F5F2E9] outline-none placeholder:text-[#829080] focus:border-[#8DA775]"
                  />
                </div>

                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  aria-label="Filter by project category"
                  className="min-w-0 rounded-xl border border-[#344339] bg-[#111914] px-3 py-3 text-sm text-[#F5F2E9] outline-none"
                >
                  <option value="All">All categories</option>
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>

                <select
                  value={language}
                  onChange={(event) => setLanguage(event.target.value)}
                  aria-label="Filter by language"
                  className="min-w-0 rounded-xl border border-[#344339] bg-[#111914] px-3 py-3 text-sm text-[#F5F2E9] outline-none"
                >
                  {languages.map((item) => (
                    <option key={item} value={item}>
                      {item === "All" ? "All languages" : item}
                    </option>
                  ))}
                </select>

                <label className="flex cursor-pointer items-center gap-2 text-sm text-[#C0C8BC] sm:col-span-2 xl:col-span-3">
                  <input
                    type="checkbox"
                    checked={showForks}
                    onChange={(event) => setShowForks(event.target.checked)}
                    className="accent-[#D6E5B4]"
                  />
                  Include forked repositories
                </label>
              </div>

              {filteredRepos.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {filteredRepos.map((repo) => {
                    const website = repo.homepage
                      ? getWebsiteUrl(repo.homepage)
                      : null;

                    const currentCategory = getCategory(repo);

                    return (
                      <article
                        key={repo.id}
                        className="group flex min-w-0 flex-col rounded-2xl border border-[#344339] bg-[#18231B] p-5 transition duration-200 hover:-translate-y-1 hover:border-[#6C835E] hover:bg-[#202F24]"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#405443] bg-[#263B2B] text-[#D6E5B4]">
                            <Terminal size={21} />
                          </div>
                          <a
                            href={repo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Open ${repo.name} on GitHub`}
                            className="rounded-lg p-2 text-[#AAB7A5] hover:bg-[#344B37] hover:text-[#D6E5B4]"
                          >
                            <ArrowUpRight size={19} />
                          </a>
                        </div>

                        <h3 className="mt-5 break-words text-lg font-semibold text-[#F5F2E9]">
                          {repo.name}
                        </h3>

                        <p className="mt-2 min-h-12 break-words text-sm leading-6 text-[#C0C8BC]">
                          {repo.description ||
                            "No repository description has been added yet."}
                        </p>

                        <div className="mt-4">
                          <label className="mb-2 block text-xs text-[#AAB7A5]">
                            Project category
                          </label>
                          <select
                            value={currentCategory}
                            onChange={(event) =>
                              updateCategory(
                                repo,
                                event.target.value as ProjectCategory
                              )
                            }
                            className="w-full rounded-lg border border-[#405443] bg-[#111914] px-3 py-2.5 text-xs text-[#F5F2E9] outline-none focus:border-[#8DA775]"
                          >
                            {categories.map((item) => (
                              <option key={item} value={item}>
                                {item}
                              </option>
                            ))}
                          </select>
                        </div>

                        {repo.topics.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {repo.topics.slice(0, 3).map((topic) => (
                              <span
                                key={topic}
                                className="rounded-full border border-[#405443] bg-[#263B2B] px-2.5 py-1 text-[11px] text-[#D6E5B4]"
                              >
                                {topic}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#C0C8BC]">
                          {repo.language && (
                            <span className="inline-flex items-center gap-1.5">
                              <span className="h-2 w-2 rounded-full bg-[#D6E5B4]" />
                              {repo.language}
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1">
                            <Star size={13} /> {repo.stars}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <GitFork size={13} /> {repo.forks}
                          </span>
                        </div>

                        <div className="mt-3 flex items-center gap-1.5 text-xs text-[#AAB7A5]">
                          <CalendarDays size={13} />
                          Updated {formatDate(repo.updatedAt)}
                        </div>

                        <div className="mt-5 flex flex-wrap gap-2 border-t border-[#344339] pt-4">
                          <a
                            href={repo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg bg-[#D6E5B4] px-3 py-2 text-xs font-semibold text-[#18231B] hover:bg-[#E5EED0]"
                          >
                            Repository <ArrowRight size={13} />
                          </a>

                          {website && (
                            <a
                              href={website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-lg border border-[#52684A] px-3 py-2 text-xs font-medium text-[#F5F2E9] hover:bg-[#263B2B]"
                            >
                              <Globe size={13} /> Live demo
                            </a>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className={`${panel} p-10 text-center`}>
                  <Search size={26} className="mx-auto text-[#AAB7A5]" />
                  <h3 className="mt-4 font-semibold text-[#F5F2E9]">
                    No repositories found
                  </h3>
                  <p className="mt-2 text-sm text-[#C0C8BC]">
                    Try changing your search or filters.
                  </p>
                  <button
                    onClick={() => {
                      setSearch("");
                      setCategory("All");
                      setLanguage("All");
                      setShowForks(true);
                    }}
                    className="mt-4 text-sm font-semibold text-[#D6E5B4] hover:text-white"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-[#405443] bg-[#202F24] p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-[#344B37] p-2 text-[#D6E5B4]">
                  <Sparkles size={19} />
                </div>
                <div>
                  <h3 className="font-semibold text-[#F5F2E9]">
                    Your GitHub, at a glance
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#C0C8BC]">
                    Categories are suggested using repository names,
                    descriptions, and topics. You can edit them anytime.
                    Category changes are saved in this browser and are not
                    written back to GitHub or synced to another device.
                    Demo counts reflect repositories with homepage URLs;
                    they do not verify whether a website is currently online.
                  </p>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </AppLayout>
  );
}

function StatCard({
  icon,
  label,
  value,
  note,
}: {
  icon: ReactNode;
  label: string;
  value: number;
  note: string;
}) {
  return (
    <div className="group rounded-2xl border border-[#344339] bg-[#18231B] p-5 transition hover:border-[#6C835E]">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm text-[#C0C8BC]">{label}</span>
        <span className="text-[#D6E5B4]">{icon}</span>
      </div>
      <p className="mt-4 text-3xl font-semibold text-[#F5F2E9]">
        {value.toLocaleString("en-IN")}
      </p>
      <p className="mt-1 text-xs text-[#AAB7A5]">{note}</p>
    </div>
  );
}