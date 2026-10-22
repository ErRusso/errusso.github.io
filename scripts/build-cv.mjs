import { spawn, spawnSync } from "node:child_process";
import { createServer } from "node:http";
import { mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { extname, join, resolve } from "node:path";
import { tmpdir } from "node:os";

/*
 * Regenerate the four committed CV PDFs from the static export.
 *
 *   bun run cv
 *
 * The script builds the site first (package.json), serves `out/`, prints the
 * full-stack and AppSec routes through headless Chromium, and writes the PDFs to
 * both `public/cv/` (source) and `out/cv/` (current build).
 *
 * CI runs it after the final build (`bun run cv:build`), so the deployed PDFs
 * are regenerated on every deploy. Locally, set CHROMIUM_BIN if the browser is
 * not one of the names detected below.
 */

const root = resolve("out");
const publicCv = resolve("public/cv");
const outCv = resolve("out/cv");
const routes = [
  { path: "/cv/", file: "simone-russo-cv-fullstack-en.pdf" },
  { path: "/cv/appsec/", file: "simone-russo-cv-appsec-en.pdf" },
  { path: "/it/cv/", file: "simone-russo-cv-fullstack-it.pdf" },
  { path: "/it/cv/appsec/", file: "simone-russo-cv-appsec-it.pdf" },
];

const legacy = ["simone-russo-cv-en.pdf", "simone-russo-cv-it.pdf"];

if (!existsSync(join(root, "cv/index.html"))) {
  console.error("out/cv/index.html is missing. Run `bun run build` first (or `bun run cv`).");
  process.exit(1);
}

const candidates = [
  process.env.CHROMIUM_BIN,
  "chromium",
  "chromium-browser",
  "google-chrome-stable",
  "google-chrome",
  "chrome",
].filter(Boolean);
const chromium = candidates.find(
  (bin) => spawnSync("which", [bin], { stdio: "ignore" }).status === 0,
);
if (!chromium) {
  console.error(
    `Chromium not found (tried ${candidates.join(", ")}). Set CHROMIUM_BIN to the browser binary.`,
  );
  process.exit(1);
}

const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".pdf": "application/pdf",
};

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
    res.writeHead(200, {
      "content-type": mime[extname(file)] ?? "application/octet-stream",
      "cache-control": "no-store",
    });
    res.end(body);
  } catch {
    res.writeHead(404).end("Not found");
  }
});

await new Promise((ok) => server.listen(0, "127.0.0.1", ok));
const port = server.address().port;
const base = `http://127.0.0.1:${port}`;

const profile = join(tmpdir(), `errusso-cv-${process.pid}`);
const browser = spawn(
  chromium,
  [
    "--headless=new",
    "--no-sandbox",
    "--disable-gpu",
    "--disable-dev-shm-usage",
    "--hide-scrollbars",
    "--remote-debugging-port=0",
    `--user-data-dir=${profile}`,
    "about:blank",
  ],
  { stdio: "ignore" },
);

const sleep = (ms) => new Promise((ok) => setTimeout(ok, ms));

// `--remote-debugging-port=0` writes the chosen port to DevToolsActivePort.
// Read it before asking /json/list.
let debugPort = 0;
for (let i = 0; i < 100; i += 1) {
  try {
    const lines = (await readFile(join(profile, "DevToolsActivePort"), "utf8")).trim().split("\n");
    debugPort = Number(lines[0]);
    if (debugPort) break;
  } catch {
    // Browser not up yet.
  }
  await sleep(100);
}
if (!debugPort) throw new Error("Chromium did not expose a DevTools port");

const list = await (await fetch(`http://127.0.0.1:${debugPort}/json/list`)).json();
const target = list.find((item) => item.type === "page");
if (!target?.webSocketDebuggerUrl) throw new Error("Chromium did not expose a page target");

const ws = new WebSocket(target.webSocketDebuggerUrl);
let nextId = 0;
const pending = new Map();
ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  if (message.id && pending.has(message.id)) {
    pending.get(message.id)(message.result);
    pending.delete(message.id);
  }
};
await new Promise((ok) => (ws.onopen = ok));

const send = (method, params = {}) =>
  new Promise((ok) => {
    const id = ++nextId;
    pending.set(id, ok);
    ws.send(JSON.stringify({ id, method, params }));
  });

await send("Page.enable");
await send("Runtime.enable");

for (const file of legacy) {
  await rm(join(publicCv, file), { force: true });
  await rm(join(outCv, file), { force: true });
}

for (const route of routes) {
  await send("Page.navigate", { url: base + route.path });
  for (let i = 0; i < 100; i += 1) {
    const state = await send("Runtime.evaluate", {
      expression: "document.readyState",
      returnByValue: true,
    });
    if (state.result?.value === "complete") break;
    await sleep(100);
  }
  await send("Runtime.evaluate", {
    expression: "document.fonts.ready.then(() => true)",
    awaitPromise: true,
    returnByValue: true,
  });
  await sleep(250);

  const pdf = await send("Page.printToPDF", {
    printBackground: true,
    preferCSSPageSize: true,
    displayHeaderFooter: false,
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
  });

  const data = Buffer.from(pdf.data, "base64");
  await mkdir(publicCv, { recursive: true });
  await mkdir(outCv, { recursive: true });
  await writeFile(join(publicCv, route.file), data);
  await writeFile(join(outCv, route.file), data);
  console.log(`${route.file}: ${(data.length / 1024).toFixed(1)} kB`);
}

ws.close();
browser.kill("SIGTERM");
server.close();
