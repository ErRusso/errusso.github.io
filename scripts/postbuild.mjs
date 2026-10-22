import { copyFile, rm } from "node:fs/promises";
import { existsSync } from "node:fs";

// Next.js exports its own 404.html from the internal not-found route.
// GitHub Pages serves /404.html for unknown paths, so we replace it with the
// branded static page (which needs no JavaScript and works without hydration).
if (existsSync("out/404.html")) {
  await copyFile("public/404.html", "out/404.html");
}

// The internal route group scaffolding is not part of the public site.
for (const path of ["out/404", "out/_not-found"]) {
  if (existsSync(path)) await rm(path, { recursive: true, force: true });
}

console.log("postbuild: 404.html replaced, internal not-found routes removed");
