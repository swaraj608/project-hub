"use client";

import { useEffect, useMemo, useState } from "react";

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

type Repository = {
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
  repos: Repository[];
  fetchedAt: string;
};

export default function GitHubPage() {
  const [data, setData] = useState<GitHubData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState("All");

  async function loadGitHubData() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/github", {
        cache: "no-store",
      });

      const raw = await response.text();

      if (!raw.trim()) {
        throw new Error(
          `The server returned an empty response (${response.status}).`
        );
      }

      let result: unknown;

      try {
        result = JSON.parse(raw);
      } catch {
        throw new Error(
          "The server returned invalid JSON. Check your Next.js terminal."
        );
      }

      if (!response.ok) {
        const message =
          typeof result === "object" &&
          result !== null &&
          "details" in result &&
          typeof result.details === "string"
            ? result.details
            : typeof result === "object" &&
                result !== null &&
                "error" in result &&
                typeof result.error === "string"
              ? result.error
              : `Request failed (${response.status}).`;

        throw new Error(message);
      }

      const payload = result as GitHubData;

      if (
        !payload.profile ||
        !Array.isArray(payload.repos) ||
        !payload.profile.username
      ) {
        throw new Error("The GitHub API returned unexpected data.");
      }

      setData(payload);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to connect to GitHub. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadGitHubData();
  }, []);

  const languages = useMemo(() => {
    if (!data) return ["All"];

    return [
      "All",
      ...Array.from(
        new Set(
          data.repos
            .map((repo) => repo.language)
            .filter((value): value is string => Boolean(value))
        )
      ).sort(),
    ];
  }, [data]);

  const filteredRepos = useMemo(() => {
    if (!data) return [];

    const query = search.trim().toLowerCase();

    return data.repos.filter((repo) => {
      const matchesSearch =
        !query ||
        repo.name.toLowerCase().includes(query) ||
        (repo.description ?? "").toLowerCase().includes(query) ||
        repo.topics.some((topic) =>
          topic.toLowerCase().includes(query)
        );

      const matchesLanguage =
        language === "All" || repo.language === language;

      return matchesSearch && matchesLanguage;
    });
  }, [data, search, language]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#080b12] px-6 text-white">
        <div className="text-center">
          <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-violet-400" />
          <h1 className="text-xl font-semibold">
            Connecting to GitHub
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Fetching profile and repositories for swaraj608...
          </p>
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#080b12] px-5 text-white">
        <div className="w-full max-w-lg rounded-2xl border border-red-400/20 bg-white/[0.03] p-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-400/10 text-2xl">
            !
          </div>

          <h1 className="text-2xl font-bold">
            GitHub connection failed
          </h1>

          <p className="mt-3 break-words text-sm leading-6 text-gray-400">
            {error || "GitHub data could not be loaded."}
          </p>

          <button
            onClick={() => void loadGitHubData()}
            className="mt-6 rounded-xl bg-violet-600 px-6 py-3 font-medium transition hover:bg-violet-500"
          >
            Try again
          </button>

          <div className="mt-5">
            <a
              href="https://github.com/swaraj608"
              target="_blank"
              rel="noreferrer"
              className="text-sm text-violet-300 hover:underline"
            >
              Open GitHub profile directly ↗
            </a>
          </div>
        </div>
      </main>
    );
  }

  const { profile, repos } = data;

  const totalStars = repos.reduce(
    (total, repo) => total + repo.stars,
    0
  );

  const totalForks = repos.reduce(
    (total, repo) => total + repo.forks,
    0
  );

  return (
    <main className="min-h-screen bg-[#080b12] text-white">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:py-14">
        {/* Header */}
        <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <a
            href="/"
            className="text-sm text-gray-400 transition hover:text-white"
          >
            ← Back to Home
          </a>

          <a
            href={profile.profileUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-white/10 px-4 py-2.5 text-sm transition hover:border-violet-400/50 hover:bg-white/5"
          >
            View GitHub ↗
          </a>
        </header>

        {/* Profile */}
        <section className="relative mb-10 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-500/15 via-[#101522] to-cyan-500/10 p-6 sm:p-10">
          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
            <img
              src={profile.avatar}
              alt={`${profile.username}'s GitHub avatar`}
              className="h-24 w-24 rounded-2xl border border-white/15 object-cover shadow-xl sm:h-32 sm:w-32"
            />

            <div className="min-w-0 flex-1">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-violet-300">
                Developer Portfolio
              </p>

              <h1 className="break-words text-3xl font-bold tracking-tight sm:text-5xl">
                {profile.name || profile.username}
              </h1>

              <a
                href={profile.profileUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-gray-400 transition hover:text-violet-300"
              >
                @{profile.username} ↗
              </a>

              <p className="mt-4 max-w-2xl leading-7 text-gray-300">
                {profile.bio ||
                  "Exploring technology, building projects, and turning ideas into code."}
              </p>
            </div>
          </div>

          <div className="relative mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              {
                label: "Public Repositories",
                value: profile.publicRepos,
              },
              {
                label: "Followers",
                value: profile.followers,
              },
              {
                label: "Following",
                value: profile.following,
              },
              {
                label: "Stars Earned",
                value: totalStars,
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/[0.08] bg-black/20 p-4"
              >
                <p className="text-2xl font-bold">
                  {stat.value.toLocaleString()}
                </p>
                <p className="mt-1 text-xs leading-5 text-gray-400">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Repository heading */}
        <section>
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
                Explore the work
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                My Repositories
              </h2>

              <p className="mt-2 text-sm text-gray-400">
                {filteredRepos.length} of {repos.length} repositories
                {" · "}
                {totalForks} total forks
              </p>
            </div>

            <button
              onClick={() => void loadGitHubData()}
              className="self-start rounded-xl border border-white/10 px-4 py-2.5 text-sm transition hover:bg-white/5 sm:self-auto"
            >
              ↻ Refresh data
            </button>
          </div>

          {/* Search and filter */}
          <div className="mb-7 flex flex-col gap-3 sm:flex-row">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search repositories or topics..."
              className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none transition placeholder:text-gray-500 focus:border-violet-400/60"
            />

            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              className="rounded-xl border border-white/10 bg-[#111521] px-4 py-3 text-sm text-white outline-none focus:border-violet-400/60"
              aria-label="Filter by programming language"
            >
              {languages.map((item) => (
                <option key={item} value={item}>
                  {item === "All" ? "All languages" : item}
                </option>
              ))}
            </select>
          </div>

          {/* Repository cards */}
          {filteredRepos.length === 0 ? (
            <div className="rounded-2xl border border-white/10 p-10 text-center">
              <h3 className="text-lg font-semibold">
                No repositories found
              </h3>
              <p className="mt-2 text-sm text-gray-400">
                Try another search term or language.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setLanguage("All");
                }}
                className="mt-4 text-sm text-violet-300 hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredRepos.map((repo) => (
                <article
                  key={repo.id}
                  className="group flex min-w-0 flex-col rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition duration-200 hover:-translate-y-1 hover:border-violet-400/40 hover:bg-white/[0.045]"
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300">
                        <svg
                          viewBox="0 0 24 24"
                          width="22"
                          height="22"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.56.1.76-.24.76-.54v-2.1c-3.1.67-3.76-1.32-3.76-1.32-.5-1.29-1.23-1.63-1.23-1.63-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15.99 1.7 2.59 1.21 3.22.92.1-.72.39-1.21.7-1.49-2.47-.28-5.07-1.23-5.07-5.48 0-1.21.43-2.2 1.15-2.97-.12-.28-.5-1.4.11-2.92 0 0 .94-.3 3.05 1.14a10.6 10.6 0 0 1 5.55 0c2.11-1.44 3.05-1.14 3.05-1.14.61 1.52.23 2.64.11 2.92.72.77 1.15 1.76 1.15 2.97 0 4.26-2.61 5.2-5.1 5.47.4.35.75 1.02.75 2.06v3.1c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z" />
                        </svg>
                      </span>

                      <h3 className="break-words font-semibold leading-6 text-white group-hover:text-violet-300">
                        {repo.name}
                      </h3>
                    </div>

                    {repo.archived && (
                      <span className="shrink-0 rounded-full bg-amber-400/10 px-2 py-1 text-xs text-amber-300">
                        Archived
                      </span>
                    )}
                  </div>

                  <p className="mb-5 min-h-12 flex-1 text-sm leading-6 text-gray-400">
                    {repo.description || "No description provided."}
                  </p>

                  {repo.topics.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                      {repo.topics.slice(0, 4).map((topic) => (
                        <span
                          key={topic}
                          className="rounded-full bg-violet-400/10 px-2.5 py-1 text-xs text-violet-200"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-400">
                    {repo.language && (
                      <span className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-cyan-300" />
                        {repo.language}
                      </span>
                    )}

                    <span>☆ {repo.stars}</span>
                    <span>⑂ {repo.forks}</span>
                  </div>

                  <div className="flex flex-wrap gap-3 border-t border-white/[0.08] pt-4">
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg bg-violet-500/10 px-3 py-2 text-sm font-medium text-violet-200 transition hover:bg-violet-500/20"
                    >
                      View Code ↗
                    </a>

                    {repo.homepage && (
                      <a
                        href={repo.homepage}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg border border-white/10 px-3 py-2 text-sm text-gray-300 transition hover:bg-white/5"
                      >
                        Live Demo ↗
                      </a>
                    )}
                  </div>

                  <p className="mt-4 text-xs text-gray-500">
                    Updated{" "}
                    {new Date(repo.updatedAt).toLocaleDateString(
                      "en-IN",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>

        <footer className="mt-14 border-t border-white/10 pt-6 text-center text-xs text-gray-500">
          Live public data from GitHub API ·{" "}
          <a
            href="https://github.com/swaraj608"
            target="_blank"
            rel="noreferrer"
            className="text-violet-300 hover:underline"
          >
            github.com/swaraj608
          </a>
        </footer>
      </div>
    </main>
  );
}