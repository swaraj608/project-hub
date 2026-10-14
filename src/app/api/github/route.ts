const GITHUB_USERNAME = "swaraj608";

type GitHubRepositoryResponse = {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  created_at: string;
  updated_at: string;
  fork: boolean;
  archived: boolean;
  topics?: string[];
};

async function readGitHubResponse(response: Response) {
  const raw = await response.text();

  if (!raw.trim()) {
    throw new Error(
      `GitHub returned an empty response (${response.status})`
    );
  }

  let data: unknown;

  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error(
      `GitHub returned invalid JSON (${response.status})`
    );
  }

  if (!response.ok) {
    const message =
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof data.message === "string"
        ? data.message
        : "GitHub request failed";

    throw new Error(`${response.status}: ${message}`);
  }

  return data;
}

export async function GET() {
  try {
    const headers = {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    };

    const [profileResponse, reposResponse] = await Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, {
        headers,
        cache: "no-store",
      }),

      fetch(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?type=owner&sort=updated&per_page=100`,
        {
          headers,
          cache: "no-store",
        }
      ),
    ]);

    const [profileData, reposData] = await Promise.all([
      readGitHubResponse(profileResponse),
      readGitHubResponse(reposResponse),
    ]);

    if (
      typeof profileData !== "object" ||
      profileData === null ||
      !("login" in profileData)
    ) {
      throw new Error("Invalid GitHub profile data");
    }

    if (!Array.isArray(reposData)) {
      throw new Error("Invalid GitHub repositories data");
    }

    const repositories =
      reposData as GitHubRepositoryResponse[];

    const profile = profileData as {
      login: string;
      name: string | null;
      avatar_url: string;
      bio: string | null;
      html_url: string;
      public_repos: number;
      followers: number;
      following: number;
    };

    const repos = repositories.map((repo) => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description,
      url: repo.html_url,
      homepage: repo.homepage,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      createdAt: repo.created_at,
      updatedAt: repo.updated_at,
      isFork: repo.fork,
      archived: repo.archived,
      topics: repo.topics ?? [],
    }));

    return Response.json(
      {
        profile: {
          username: profile.login,
          name: profile.name,
          avatar: profile.avatar_url,
          bio: profile.bio,
          profileUrl: profile.html_url,
          publicRepos: profile.public_repos,
          followers: profile.followers,
          following: profile.following,
        },
        repos,
        fetchedAt: new Date().toISOString(),
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown GitHub connection error";

    console.error("GitHub connection failed:", message);

    return Response.json(
      {
        error: "Unable to fetch GitHub data.",
        details: message,
      },
      { status: 502 }
    );
  }
}