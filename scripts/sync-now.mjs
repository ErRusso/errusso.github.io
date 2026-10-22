import { execFileSync } from "node:child_process";
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
 *   - the latest PipeDuck release (name, date, tag, link);
 *   - the PipeDuck version shown in "In development";
 *   - the Marmotta cumulative contribution stats (lines added/removed, files);
 *   - the "updated" date.
 *
 * Curated bodies are preserved when the release URL is already present.
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
const RELEASE_REPO = { owner: "ErRusso", repo: "pipeduck" };
const MARMOTTA = { owner: "napi-bindings", repo: "marmotta", author: "ErRusso" };

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

function shortVersion(tag) {
  const version = String(tag || "").replace(/^v/i, "");
  return version.split(".").slice(0, 2).join(".") || version;
}

async function latestRelease() {
  try {
    return await github(
      `/repos/${RELEASE_REPO.owner}/${RELEASE_REPO.repo}/releases/latest`,
      { allow404: true },
    );
  } catch (error) {
    console.warn(`[now:sync] release: ${error.message}`);
    if (strict) throw error;
    return null;
  }
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

const now = JSON.parse(await readFile(nowPath, "utf8"));
const before = JSON.stringify(now);

const release = await latestRelease();
if (release) {
  const tag = release.tag_name || "latest";
  const version = tag.replace(/^v/i, "");
  const name = release.name?.trim() || `PipeDuck ${version}`;
  const href = release.html_url;
  const previous = now.release?.href === href ? now.release : null;

  now.release = {
    name,
    date: dateOnly(release.published_at),
    meta: {
      en: `Latest release · MIT · ${tag}`,
      it: `Ultima release · MIT · ${tag}`,
    },
    body:
      previous?.body ??
      {
        en: `${name} is out. See the release notes for the changes.`,
        it: `${name} è disponibile. Vedi le note di release per le modifiche.`,
      },
    href,
  };

  const pipeDuck = now.building?.find((item) => item.id === "pipeduck");
  if (pipeDuck) {
    const minor = shortVersion(tag);
    pipeDuck.meta = `C++20 · PipeWire · ${tag}`;
    pipeDuck.body = {
      en: `Post-${minor} maintenance. Next: threat-model the tray and D-Bus surface, then the next release.`,
      it: `Manutenzione post-${minor}. Prossimo passo: threat model della tray e della superficie D-Bus, poi la prossima release.`,
    };
  }
}

const marmotta = await contributionStats(MARMOTTA);
if (marmotta) {
  now.projectStats = { ...(now.projectStats ?? {}), marmotta };
}

now.updated = todayInRome();
const after = JSON.stringify(now, null, 2) + "\n";
const changed = JSON.stringify(now) !== before;

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
  `[now:sync] updated ${release ? `release ${release.tag_name}` : "release unchanged"}; ${now.updated}`,
);
