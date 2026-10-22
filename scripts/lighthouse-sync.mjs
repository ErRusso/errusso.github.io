import { spawn, spawnSync } from "node:child_process";
import { brotliCompressSync, gzipSync } from "node:zlib";
import { createServer } from "node:http";
import { mkdtemp, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { extname, join, resolve } from "node:path";
import { tmpdir } from "node:os";

/*
 * Refresh the "This website" case-study metrics with a real Lighthouse run.
 *
 *   bun run build          # produces out/
 *   bun run lighthouse:sync
 *   bun run build          # second pass, now with the fresh metrics
 *
 * CI runs the same three steps on non-PR builds. Lighthouse itself is fetched
 * with `bunx` so it never becomes a runtime dependency of the site (and never
 * changes the package count quoted on the security page).
 */

const root = resolve("out");
const nowPath = resolve("content/now.json");

if (!existsSync(join(root, "index.html"))) {
  console.error("[lighthouse:sync] out/index.html is missing. Run `bun run build` first.");
  process.exit(1);
}

const chrome = [
  process.env.CHROME_PATH,
  process.env.CHROMIUM_BIN,
  "google-chrome-stable",
  "google-chrome",
  "chromium",
  "chromium-browser",
]
  .filter(Boolean)
  .map((bin) => {
    const result = spawnSync("which", [bin], { encoding: "utf8" });
    return result.status === 0 ? result.stdout.trim() : null;
  })
  .find(Boolean);

if (!chrome) {
  console.warn("[lighthouse:sync] no Chrome/Chromium found; keeping the previous metrics.");
  process.exit(0);
}

const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".pdf": "application/pdf",
};

const isCompressible = (type) =>
  /^(?:text\/|application\/(?:json|xml|javascript)|image\/svg\+xml)/.test(type);

// Compress the text assets before Lighthouse starts. Doing it on demand would
// block the server's event loop during the audit and inflate LCP/TTFB.
const compressed = new Map();
async function precompress(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = join(dir, entry.name);
    if (entry.isDirectory()) {
      await precompress(file);
      continue;
    }
    const type = mime[extname(file)];
    if (!type || !isCompressible(type)) continue;
    compressed.set(file, brotliCompressSync(await readFile(file)));
  }
}
await precompress(root);

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? "/", "http://127.0.0.1");
    let pathname = decodeURIComponent(url.pathname);
    if (pathname.endsWith("/")) pathname += "index.html";

    let file = resolve(join(root, pathname));
    if (!file.startsWith(root)) {
      res.writeHead(403).end("Forbidden");
      return;
    }

    try {
      await stat(file);
    } catch {
      file = resolve(join(root, `${pathname}/index.html`));
      if (!file.startsWith(root)) {
        res.writeHead(403).end("Forbidden");
        return;
      }
    }

    const body = await readFile(file);
    const type = mime[extname(file)] ?? "application/octet-stream";
    const headers = {
      "content-type": type,
      // Allow the preloaded fonts to be reused when the CSS asks for them.
      // `no-store` makes Chrome fetch each preloaded font a second time.
      "cache-control": "public, max-age=3600",
      vary: "Accept-Encoding",
    };

    // GitHub Pages compresses text assets. Match it so transfer size and LCP
    // are not measured against an artificially slow local server.
    let response = body;
    if (isCompressible(type)) {
      const accept = req.headers["accept-encoding"] ?? "";
      const brotli = compressed.get(file);
      if (brotli && /\bbr\b/.test(accept)) {
        response = brotli;
        headers["content-encoding"] = "br";
      } else if (/\bgzip\b/.test(accept)) {
        response = gzipSync(body);
        headers["content-encoding"] = "gzip";
      }
    }

    headers["content-length"] = String(response.length);
    res.writeHead(200, headers);
    res.end(response);
  } catch {
    res.writeHead(404).end("Not found");
  }
});

const todayInRome = () =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Rome",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

const RUNS = Math.max(1, Number(process.env.LIGHTHOUSE_RUNS) || 3);

const score = (report, id) => Math.round((report.categories?.[id]?.score ?? 0) * 100);
const metric = (report, id) => report.audits?.[id]?.numericValue ?? 0;

function summarize(report) {
  return {
    performance: score(report, "performance"),
    accessibility: score(report, "accessibility"),
    bestPractices: score(report, "best-practices"),
    seo: score(report, "seo"),
    transferredKb: Math.round(metric(report, "total-byte-weight") / 1024),
    lcpSeconds: Number((metric(report, "largest-contentful-paint") / 1000).toFixed(1)),
    cls: Number(metric(report, "cumulative-layout-shift").toFixed(3)),
  };
}

// Median of the successful runs. Lighthouse mobile scores move by a few points
// between runs; a single sample makes the published number noisy.
function medianSummary(summaries) {
  const keys = [
    "performance",
    "accessibility",
    "bestPractices",
    "seo",
    "transferredKb",
    "lcpSeconds",
    "cls",
  ];
  const integerKeys = new Set([
    "performance",
    "accessibility",
    "bestPractices",
    "seo",
    "transferredKb",
  ]);
  const result = {};
  for (const key of keys) {
    const values = summaries.map((item) => item[key]).sort((a, b) => a - b);
    const middle = Math.floor(values.length / 2);
    const value =
      values.length % 2 === 1
        ? values[middle]
        : (values[middle - 1] + values[middle]) / 2;
    result[key] = integerKeys.has(key) ? Math.round(value) : value;
  }
  return result;
}

await new Promise((ok) => server.listen(0, "127.0.0.1", ok));
const port = server.address().port;
const url = `http://127.0.0.1:${port}/`;
const work = await mkdtemp(join(tmpdir(), "errusso-lighthouse-"));

try {
  const run = (file, preset) => {
    const args = [
      "lighthouse",
      url,
      "--output=json",
      `--output-path=${file}`,
      "--only-categories=performance,accessibility,best-practices,seo",
      "--chrome-flags=--headless=new --no-sandbox --disable-gpu --disable-dev-shm-usage",
      "--quiet",
    ];
    if (preset) args.push(`--preset=${preset}`);

    return new Promise((resolve, reject) => {
      const child = spawn("bunx", args, {
        cwd: work,
        env: { ...process.env, CHROME_PATH: chrome },
        stdio: ["ignore", "pipe", "pipe"],
      });
      let stdout = "";
      let stderr = "";
      child.stdout.on("data", (chunk) => (stdout += chunk));
      child.stderr.on("data", (chunk) => (stderr += chunk));

      // Do not use spawnSync here: it would block this process's event loop and
      // the static server could not answer Lighthouse's requests.
      const timer = setTimeout(() => {
        child.kill("SIGTERM");
        reject(new Error(`lighthouse ${preset ?? "mobile"} timed out`));
      }, 180_000);

      child.on("error", (error) => {
        clearTimeout(timer);
        reject(error);
      });
      child.on("close", (code) => {
        clearTimeout(timer);
        if (code === 0) resolve();
        else
          reject(
            new Error(
              `lighthouse ${preset ?? "mobile"} failed (${code}): ${(stderr || stdout).trim()}`,
            ),
          );
      });
    });
  };

  const collect = async (label, preset) => {
    const reports = [];
    const scores = [];
    for (let index = 0; index < RUNS; index += 1) {
      const file = join(work, `${label}-${index}.json`);
      try {
        await run(file, preset);
        const report = JSON.parse(await readFile(file, "utf8"));
        reports.push(report);
        scores.push(score(report, "performance"));
      } catch (error) {
        console.warn(`[lighthouse:sync] ${error.message}`);
      }
    }
    if (reports.length === 0) {
      throw new Error(`lighthouse ${label} produced no report`);
    }
    console.log(`[lighthouse:sync] ${label} runs: ${scores.join("/")}`);
    return {
      report: reports[0],
      summary: medianSummary(reports.map(summarize)),
    };
  };

  const mobile = await collect("mobile", null);
  const desktop = await collect("desktop", "desktop");

  const now = JSON.parse(await readFile(nowPath, "utf8"));
  const site = {
    lighthouseVersion:
      mobile.report.lighthouseVersion ?? desktop.report.lighthouseVersion ?? "unknown",
    date: todayInRome(),
    mobile: mobile.summary,
    desktop: desktop.summary,
  };
  now.site = site;

  await writeFile(nowPath, `${JSON.stringify(now, null, 2)}\n`);
  console.log(
    `[lighthouse:sync] ${site.lighthouseVersion}: mobile ${site.mobile.performance}, desktop ${site.desktop.performance}, ${site.mobile.transferredKb} KB, LCP ${site.mobile.lcpSeconds}s, CLS ${site.mobile.cls}; ${site.date}`,
  );
} catch (error) {
  console.warn(`[lighthouse:sync] ${error.message}`);
  console.warn("[lighthouse:sync] keeping the previous metrics");
} finally {
  server.close();
  await rm(work, { recursive: true, force: true });
}
