import { execFileSync, spawnSync } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/*
 * Keep the public Now/Building data current without a build-time CMS.
 *
 *   bun run now:sync
 *   bun run now:sync -- --dry-run
 *   bun run now:sync -- --check
 *
 * It reads public GitHub data for:
 *   - the latest PipeDuck release (tag, date, link);
 *   - PipeDuck test/assertion/file/size counts and build-matrix job count;
 *   - the three most-used repositories (this site's repo excluded);
 *   - recently closed and open issues authored by or assigned to the owner;
 *   - the Marmotta cumulative contribution stats (lines added/removed, files);
 *   - `bun audit` for the package count and vulnerability count shown on the
 *     security page and the "This website" case study;
 *   - the "updated" date.
 *
 * The script is safe to run without a token, but GitHub's unauthenticated rate
 * limit is low. Locally it falls back to `gh auth token`; in GitHub Actions the
 * deploy workflow passes GITHUB_TOKEN. Tokens are never printed.
 */

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const nowPath = join(root, "content/now.json");
const args = new Set(process.argv.slice(2));
const check = args.has("--check");
const dryRun = args.has("--dry-run");
const strict = args.has("--strict");

const API = "https://api.github.com";
const GITHUB_USER = "ErRusso";
const PIPEDUCK = { owner: "ErRusso", repo: "pipeduck" };
const MARMOTTA = { owner: "napi-bindings", repo: "marmotta", author: "ErRusso" };
const TOP_REPOS = 3;
const DONE_ISSUES = 5;
const NEXT_ISSUES = 5;

// Never show this site's repository (it is the container, not the work) or the
// profile README (it is not a project).
const EXCLUDED_REPOS = new Set([
  "ErRusso/errusso.github.io",
  "ErRusso/ErRusso",
]);

function readToken() {
  for (const key of ["GITHUB_TOKEN", "GH_TOKEN", "GITHUB_PAT"]) {
    const value = process.env[key]?.trim();
    if (value) return value;
  }

  try {
    return execFileSync("gh", ["auth", "token"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return "";
  }
}

const token = readToken();
const headers = {
  Accept: "application/vnd.github+json",
  "User-Agent": "errusso-portfolio-now-sync",
  "X-GitHub-Api-Version": "2022-11-28",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
};

async function github(path, { allow404 = false } = {}) {
  const response = await fetch(`${API}${path}`, {
    headers,
    signal: AbortSignal.timeout(20_000),
  });

  if (allow404 && response.status === 404) return null;

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(
      `${response.status} ${response.statusText} for ${path}${body ? `: ${body.slice(0, 200)}` : ""}`,
    );
  }

  return response.json();
}

async function graphql(query, variables) {
  const response = await fetch(`${API}/graphql`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    signal: AbortSignal.timeout(20_000),
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText} for /graphql`);
  }

  if (payload?.errors?.length) {
    throw new Error(payload.errors.map((error) => error.message).join("; "));
  }

  return payload?.data;
}

function todayInRome() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Rome",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function dateOnly(value) {
  return value ? value.slice(0, 10) : todayInRome();
}

function clean(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function slug(value) {
  return (
    String(value)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "item"
  );
}

async function contributionStats({ owner, repo, author }) {
  try {
    const pulls = [];

    for (let page = 1; ; page += 1) {
      const batch = await github(
        `/repos/${owner}/${repo}/pulls?state=closed&sort=created&direction=asc&per_page=100&page=${page}`,
      );
      pulls.push(...batch);
      if (batch.length < 100) break;
    }

    const merged = pulls
      .filter(
        (pull) =>
          pull.merged_at && pull.user?.login?.toLowerCase() === author.toLowerCase(),
      )
      .sort((a, b) => a.merged_at.localeCompare(b.merged_at));

    if (merged.length === 0) return null;

    let additions = 0;
    let deletions = 0;
    let changedFiles = 0;

    for (const pull of merged) {
      const details = await github(`/repos/${owner}/${repo}/pulls/${pull.number}`);
      additions += details.additions ?? 0;
      deletions += details.deletions ?? 0;
      changedFiles += details.changed_files ?? 0;
    }

    return {
      additions,
      deletions,
      changedFiles,
      contributions: merged.length,
      firstMergedOn: dateOnly(merged[0].merged_at),
    };
  } catch (error) {
    console.warn(`[now:sync] ${owner}/${repo} (${author}): ${error.message}`);
    if (strict) throw error;
    return null;
  }
}

async function latestRelease() {
  try {
    const release = await github(`/repos/${PIPEDUCK.owner}/${PIPEDUCK.repo}/releases/latest`);
    if (!release?.tag_name) return null;

    const tag = release.tag_name;
    return {
      tag,
      version: tag.replace(/^v/i, ""),
      name: release.name || tag,
      date: dateOnly(release.published_at),
      href: release.html_url,
    };
  } catch (error) {
    console.warn(`[now:sync] latest release: ${error.message}`);
    if (strict) throw error;
    return null;
  }
}

/**
 * `bun audit` is the same command the security page tells readers to run.
 * Keep the JSON field optional: if the registry is unreachable, preserve the
 * previous numbers instead of publishing a fresh date over stale claims.
 */
function auditStats() {
  try {
    const result = spawnSync("bun", ["audit"], {
      encoding: "utf8",
      timeout: 60_000,
    });
    const text = `${result.stdout ?? ""}\n${result.stderr ?? ""}`;
    const packages = /checked\s+(\d+)\s+packages/i.exec(text)?.[1];
    if (!packages) return null;

    const vulnerabilities = /no vulnerabilities found/i.test(text)
      ? 0
      : Number(/found\s+(\d+)\s+vulnerabilit/i.exec(text)?.[1] ?? NaN);
    if (!Number.isFinite(vulnerabilities)) return null;

    return { packages: Number(packages), vulnerabilities };
  } catch (error) {
    console.warn(`[now:sync] bun audit: ${error.message}`);
    return null;
  }
}

/**
 * Counts for the PipeDuck case study. Derived from the repository tree and the
 * test sources instead of being edited by hand:
 *   - tracked files: every blob in the default branch;
 *   - C++ size: sum of the sizes of C/C++ headers and sources;
 *   - test functions: `void test_*()` definitions in `tests/`;
 *   - assertions: `CHECK*` / `REQUIRE*` macro calls in those files.
 */
async function pipeduckStats() {
  try {
    const repo = await github(`/repos/${PIPEDUCK.owner}/${PIPEDUCK.repo}`);
    const branch = repo.default_branch;
    const tree = await github(
      `/repos/${PIPEDUCK.owner}/${PIPEDUCK.repo}/git/trees/${branch}?recursive=1`,
    );
    const blobs = (tree.tree ?? []).filter((entry) => entry.type === "blob");
    if (blobs.length === 0) return null;

    const cpp = blobs.filter((entry) => /\.(?:cpp|cc|cxx|hpp|hh|h)$/i.test(entry.path));
    const testFiles = blobs.filter((entry) =>
      /^tests\/.*\.(?:cpp|cc|cxx)$/i.test(entry.path),
    );

    let source = "";
    for (const file of testFiles) {
      const response = await fetch(
        `https://raw.githubusercontent.com/${PIPEDUCK.owner}/${PIPEDUCK.repo}/${branch}/${file.path}`,
        {
          headers: { "User-Agent": "errusso-portfolio-now-sync" },
          signal: AbortSignal.timeout(20_000),
        },
      );
      if (response.ok) source += `\n${await response.text()}`;
    }

    return {
      testFunctions: (source.match(/^\s*void\s+test_[A-Za-z0-9_]+\s*\(/gm) ?? []).length,
      assertions: source
        .split("\n")
        .filter((line) => !/^\s*#define\b/.test(line))
        .reduce(
          (count, line) =>
            count +
            (line.match(
              /\b(?:CHECK_THROW|REQUIRE_THROW|CHECK_FALSE|REQUIRE_FALSE|CHECK|REQUIRE)\s*\(/g,
            )?.length ?? 0),
          0,
        ),
      trackedFiles: blobs.length,
      cppKb: Math.round(cpp.reduce((sum, entry) => sum + (entry.size ?? 0), 0) / 1024),
    };
  } catch (error) {
    console.warn(`[now:sync] pipeduck stats: ${error.message}`);
    if (strict) throw error;
    return null;
  }
}

/** Count the build matrix entries in the latest main-branch CI run. */
async function pipeduckCi() {
  try {
    const runs = await github(
      `/repos/${PIPEDUCK.owner}/${PIPEDUCK.repo}/actions/workflows/ci.yml/runs?branch=main&per_page=1`,
    );
    const run = runs.workflow_runs?.[0];
    if (!run) return null;

    const jobs = await github(
      `/repos/${PIPEDUCK.owner}/${PIPEDUCK.repo}/actions/runs/${run.id}/jobs?per_page=100`,
    );
    const buildJobs = (jobs.jobs ?? []).filter((job) => /^Build \(/.test(job.name)).length;
    return buildJobs > 0 ? { buildJobs } : null;
  } catch (error) {
    // Supplementary stat: keep the previous count if the Actions API is
    // unavailable or the token cannot read another repository's runs.
    console.warn(`[now:sync] pipeduck CI: ${error.message}`);
    return null;
  }
}

const TOP_REPOS_QUERY = `
  query ($from: DateTime!, $to: DateTime!) {
    user(login: "${GITHUB_USER}") {
      contributionsCollection(from: $from, to: $to) {
        commitContributionsByRepository(maxRepositories: 20) {
          repository {
            name
            nameWithOwner
            owner { login }
            description
            pushedAt
            url
            isPrivate
            isFork
            isArchived
            primaryLanguage { name }
          }
          contributions { totalCount }
        }
      }
    }
  }
`;

function normalizeRepo(repo) {
  return {
    fullName: repo.nameWithOwner ?? repo.full_name ?? "",
    name: repo.name ?? "",
    owner: repo.owner?.login ?? "",
    description: repo.description ?? "",
    pushedAt: repo.pushedAt ?? repo.pushed_at ?? null,
    url: repo.html_url ?? repo.url ?? "",
    language: repo.primaryLanguage?.name ?? repo.language ?? "",
    private: repo.isPrivate ?? repo.private ?? false,
    archived: repo.isArchived ?? repo.archived ?? false,
    fork: repo.isFork ?? repo.fork ?? false,
    contributions: repo.contributions ?? 0,
  };
}

function isPublicProject(repo) {
  return (
    Boolean(repo.fullName && repo.url) &&
    !repo.private &&
    !repo.archived &&
    !repo.fork &&
    !EXCLUDED_REPOS.has(repo.fullName)
  );
}

async function topRepositories() {
  const ranked = [];

  if (token) {
    try {
      const to = new Date();
      const from = new Date(to.getTime() - 360 * 24 * 60 * 60 * 1000);
      const data = await graphql(TOP_REPOS_QUERY, {
        from: from.toISOString(),
        to: to.toISOString(),
      });
      const entries =
        data?.user?.contributionsCollection?.commitContributionsByRepository ?? [];
      ranked.push(
        ...entries.map(({ repository, contributions }) => ({
          ...normalizeRepo(repository),
          contributions: contributions?.totalCount ?? 0,
        })),
      );
    } catch (error) {
      console.warn(`[now:sync] top repositories: ${error.message}`);
    }
  }

  ranked.sort(
    (a, b) =>
      b.contributions - a.contributions ||
      String(b.pushedAt ?? "").localeCompare(String(a.pushedAt ?? "")),
  );

  const collected = [];
  const seen = new Set();

  const accept = (repo) => {
    if (!isPublicProject(repo) || seen.has(repo.fullName)) return;
    seen.add(repo.fullName);
    collected.push(repo);
  };

  ranked.forEach(accept);

  // A public profile often has fewer than three repos with commits in the
  // window (no token locally, or a quiet year). Fill the rest with the most
  // recently pushed public repositories, which is the next-best "in use" signal.
  if (collected.length < TOP_REPOS) {
    try {
      const path = token
        ? `/user/repos?affiliation=owner,collaborator,organization_member&sort=pushed&direction=desc&per_page=100`
        : `/users/${GITHUB_USER}/repos?sort=pushed&direction=desc&per_page=100&type=owner`;
      const repos = await github(path);
      repos.map(normalizeRepo).forEach(accept);
    } catch (error) {
      console.warn(`[now:sync] top repositories: ${error.message}`);
      if (strict) throw error;
    }
  }

  if (collected.length === 0) return null;

  // Keep hand-written labels and descriptions for repositories already shown;
  // repos that newly enter the list get a description generated from GitHub.
  const previous = new Map();
  for (const item of [...(now.repos ?? []), ...(now.projects ?? [])]) {
    if (item.href) previous.set(item.href, item);
  }

  return collected.slice(0, TOP_REPOS).map((repo) => {
    const old = previous.get(repo.url);
    const description = clean(repo.description);
    const fallbackBody = description
      ? { en: description, it: description }
      : {
          en: `${repo.name} on GitHub.`,
          it: `${repo.name} su GitHub.`,
        };

    return {
      id: old?.id ?? slug(repo.fullName),
      name: old?.name ?? old?.label ?? repo.name,
      repo: repo.fullName,
      language: repo.language || "—",
      date: dateOnly(repo.pushedAt),
      body: old?.body ?? fallbackBody,
      href: repo.url,
    };
  });
}

const ISSUES_QUERY = `
  query (
    $nextAuthored: String!
    $nextAssigned: String!
    $doneAuthored: String!
    $doneAssigned: String!
  ) {
    nextAuthored: search(query: $nextAuthored, type: ISSUE, first: 25) {
      nodes { ...IssueFields }
    }
    nextAssigned: search(query: $nextAssigned, type: ISSUE, first: 25) {
      nodes { ...IssueFields }
    }
    doneAuthored: search(query: $doneAuthored, type: ISSUE, first: 25) {
      nodes { ...IssueFields }
    }
    doneAssigned: search(query: $doneAssigned, type: ISSUE, first: 25) {
      nodes { ...IssueFields }
    }
  }

  fragment IssueFields on Issue {
    number
    title
    url
    createdAt
    closedAt
    repository {
      name
      nameWithOwner
      url
      isPrivate
    }
  }
`;

function issuePriority(title) {
  const match = /\[p(\d)\]/i.exec(title);
  return match ? Number(match[1]) : 99;
}

function issueEntry(item, fullName, repoName) {
  return {
    id: `${slug(fullName)}-${item.number}`,
    repo: repoName,
    number: item.number,
    title: item.title,
    date: dateOnly(item.date),
    href: item.url,
  };
}

async function issues() {
  const collected = new Map();
  let fetched = false;

  const add = (node, bucket) => {
    if (!node?.repository || node.repository.isPrivate) return;
    if (EXCLUDED_REPOS.has(node.repository.nameWithOwner)) return;

    const key = `${bucket}:${node.url}`;
    collected.set(key, {
      key,
      bucket,
      fullName: node.repository.nameWithOwner,
      repo: node.repository.name,
      number: node.number,
      title: node.title,
      url: node.url,
      createdAt: node.createdAt,
      closedAt: node.closedAt,
      date: bucket === "done" ? node.closedAt : node.createdAt,
    });
  };

  if (token) {
    try {
      const data = await graphql(ISSUES_QUERY, {
        nextAuthored: `is:issue state:open author:${GITHUB_USER} sort:created-desc`,
        nextAssigned: `is:issue state:open assignee:${GITHUB_USER} sort:created-desc`,
        doneAuthored: `is:issue state:closed author:${GITHUB_USER} sort:closed-desc`,
        doneAssigned: `is:issue state:closed assignee:${GITHUB_USER} sort:closed-desc`,
      });

      for (const node of data?.nextAuthored?.nodes ?? []) add(node, "next");
      for (const node of data?.nextAssigned?.nodes ?? []) add(node, "next");
      for (const node of data?.doneAuthored?.nodes ?? []) add(node, "done");
      for (const node of data?.doneAssigned?.nodes ?? []) add(node, "done");
      fetched = true;
    } catch (error) {
      console.warn(`[now:sync] issues: ${error.message}`);
    }
  }

  // Without a token, `involves:` is the only workable search. It is broader
  // than author/assignee, but unauthenticated runs cannot see private repos, so
  // everything it returns is public and linkable.
  if (!fetched) {
    try {
      for (const [bucket, state] of [
        ["next", "open"],
        ["done", "closed"],
      ]) {
        const result = await github(
          `/search/issues?q=is:issue+state:${state}+involves:${GITHUB_USER}&sort=updated&order=desc&per_page=50`,
        );

        for (const item of result.items ?? []) {
          if (item.pull_request) continue;
          const fullName = item.repository_url?.split("/repos/")[1] ?? "";
          if (EXCLUDED_REPOS.has(fullName)) continue;

          collected.set(`${bucket}:${item.html_url}`, {
            key: `${bucket}:${item.html_url}`,
            bucket,
            fullName,
            repo: fullName.split("/")[1] ?? fullName,
            number: item.number,
            title: item.title,
            url: item.html_url,
            createdAt: item.created_at,
            closedAt: item.closed_at,
            date: bucket === "done" ? item.closed_at : item.created_at,
          });
        }
      }
    } catch (error) {
      console.warn(`[now:sync] issues: ${error.message}`);
      if (strict) throw error;
      return null;
    }
  }

  const all = [...collected.values()];

  const next = all
    .filter((item) => item.bucket === "next")
    .sort(
      (a, b) =>
        issuePriority(a.title) - issuePriority(b.title) ||
        String(b.createdAt ?? "").localeCompare(String(a.createdAt ?? "")),
    )
    .slice(0, NEXT_ISSUES)
    .map((item) => issueEntry(item, item.fullName, item.repo));

  const done = all
    .filter((item) => item.bucket === "done")
    .sort((a, b) =>
      String(b.closedAt ?? "").localeCompare(String(a.closedAt ?? "")),
    )
    .slice(0, DONE_ISSUES)
    .map((item) => issueEntry(item, item.fullName, item.repo));

  if (next.length === 0 && done.length === 0) return null;

  return { done, next };
}

const now = JSON.parse(await readFile(nowPath, "utf8"));
const before = JSON.stringify(now);

const marmotta = await contributionStats(MARMOTTA);
const release = await latestRelease();
const pipeduck = await pipeduckStats();
const pipeduckCiStats = await pipeduckCi();
const audit = auditStats();
const repos = await topRepositories();
const issueBoard = await issues();

const output = {
  updated: todayInRome(),
  release: release ?? now.release,
  audit: audit ?? now.audit,
  repos: repos ?? now.repos ?? [],
  issues: issueBoard ?? now.issues ?? { done: [], next: [] },
  projectStats: {
    ...(now.projectStats ?? {}),
    ...(marmotta ? { marmotta } : {}),
    ...(pipeduck
      ? { pipeduck: { ...pipeduck, ...(pipeduckCiStats ?? {}) } }
      : {}),
  },
  site: now.site,
};

const after = JSON.stringify(output, null, 2) + "\n";
const changed = JSON.stringify(output) !== before;

if (!changed) {
  console.log("[now:sync] already up to date");
  process.exit(0);
}

if (check) {
  console.error("[now:sync] content/now.json is stale; run `bun run now:sync`");
  process.exit(1);
}

if (dryRun) {
  console.log("[now:sync] would update content/now.json");
  process.exit(0);
}

await writeFile(nowPath, after);
console.log(
  `[now:sync] release ${output.release?.tag ?? "unchanged"}, ${output.audit?.packages ?? "?"} packages; ${output.repos.length} repos, ${output.issues.done.length} done / ${output.issues.next.length} next; ${output.updated}`,
);
