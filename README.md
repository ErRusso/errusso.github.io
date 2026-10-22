# Simone Russo — Portfolio

Personal portfolio: full-stack developer and application security.
Brutalist on purpose, static by design. English at `/`, Italian at `/it`.

Built with Next.js (static export), TypeScript and Tailwind CSS v4. No CMS,
no database, no contact form: the site is a set of static files.

## Development

```bash
bun install
bun dev          # http://localhost:3000
bun run build    # writes out/ (static export)
bun run typecheck
bun run cv       # build + regenerate the four CV PDFs (requires Chromium)
bun run cv:build # regenerate PDFs from an existing out/
bun run lighthouse:sync # audit out/ and update the site metrics
```

The project uses **bun** (`bun.lock` is committed). npm works too:
`npm install && npm run dev`.

## Where content lives

| What | File |
| --- | --- |
| Copy for every section (EN + IT) | `content/copy.ts` |
| Projects and case studies | `content/projects.ts` |
| "Off the clock" photos | `content/photos.ts` + `public/photos/` |
| Now / Building data (repos, issues, stats) | `content/now.json` |
| Professional page, timeline, skills, CVs | `content/professional.ts` |
| CV PDFs (full-stack/AppSec, EN/IT) | `public/cv/*.pdf` (generated from `/cv/`, `/cv/appsec/`, `/it/cv/`, `/it/cv/appsec/`) |
| Email, GitHub, Instagram, site URL, timezone | `lib/site.ts` |
| Colours, fonts, base classes | `app/globals.css` |
| Section components | `components/*.tsx` |

To add a project, append an object to `projects` in `content/projects.ts`: the
home card, `/work/[slug]`, `/it/work/[slug]`, the sitemap and the "next
project" link all update automatically.

## Now / Building sync

`bun run now:sync` reads public data and rebuilds `content/now.json`: the latest
PipeDuck release, PipeDuck's test/assertion/file/size counts and build-matrix
job count, the three most-used repositories, the issues closed and still open,
the cumulative Marmotta contribution metrics (added/removed lines and files),
the `bun audit` package/vulnerability counts and the update date.

The repo list ranks the owner's commit contributions over the last year via
GraphQL, then fills any remaining slots with the most recently pushed public
repositories. This site's repo (`ErRusso/errusso.github.io`), the profile
README, private repos, archived repos and forks are excluded, as are this
site's own issues. Repositories already shown keep their hand-written label and
description, so new entries and reordering happen automatically without losing
copy.

The issue board shows up to five recently closed issues (`done`) and five open
ones (`next`), authored by or assigned to the owner, excluding pull requests and
private repos. Open issues are ordered by their `[P1]`/`[P2]`/`[P3]` prefix,
then by creation date; closed issues by close date.

The script also runs in the deploy workflow (`main`, `workflow_dispatch` and a
weekly schedule) before the build, so the published site stays current even
when the JSON has not been recommitted. Pull request builds skip it to keep
checks deterministic. Locally it falls back to `gh auth token`; in Actions it
receives `GITHUB_TOKEN`. The token is never printed. Without a token the repo
ranking falls back to recent pushes and the issue search to public `involves:`
results.

The scheduled run is `.github/workflows/deploy.yml` every **Monday at 06:00
UTC** (`cron: "0 6 * * 1"`). It rebuilds and deploys without a commit, and
runs `now:sync --strict`: a GitHub outage fails the job instead of publishing
the committed stats under a fresh "updated" date. Push and manual runs stay
lenient, so an outage never blocks a deployment.

```bash
bun run now:sync                 # update content/now.json
bun run now:sync -- --dry-run    # report whether anything would change
bun run now:sync -- --check      # exit 1 when the JSON is stale
bun run now:sync -- --strict     # fail when GitHub does not respond
bun run deploy:prepare           # sync + typecheck + local build
```

The PipeDuck case study and CV links use the latest release tag from
`/releases/latest`; the test count is the number of `void test_*()` definitions
in the repository's `tests/` directory, and assertions are `CHECK*` /
`REQUIRE*` macro calls in those files. Tracked files and C++ size come from the
default branch tree. The security page and the "This website" case study use
the `bun audit` result. Editorial copy, historical timeline dates, photo dates
and the branch-protection claims remain manual.

## Lighthouse sync

`bun run lighthouse:sync` serves `out/`, runs Lighthouse mobile and desktop
against the local production build, and writes a `site` block into
`content/now.json`. It takes the median of three runs per form factor to smooth
out local variance; set `LIGHTHOUSE_RUNS=1` for a quick single audit. The deploy
workflow runs it after the first build, then rebuilds so the "This website"
case study and its audit date show the fresh numbers. The local server
compresses text assets and allows the browser to reuse preloaded fonts, so
transfer size/LCP are representative. Pull request builds skip the audit.

The script uses `bunx lighthouse` (not a project dependency) and auto-detects
Chrome/Chromium, including `google-chrome-stable` on the GitHub runner. Set
`CHROME_PATH` or `CHROMIUM_BIN` to override the browser.

## Professional profile and CVs

The professional page is at `/professional` and `/it/professional`. PDFs are
generated from the printable routes `/cv/`, `/cv/appsec/`, `/it/cv/` and
`/it/cv/appsec/` with `bun run cv`, or with `bun run cv:build` against an
existing `out/`. The deploy workflow runs `cv:build` after the final build, so
the published PDFs are regenerated on every deploy. Committed PDFs remain as a
fallback for local builds without Chrome.

The "CV updated" footer follows the build date, so it matches the regenerated
PDFs; the hero "Updated" value follows the weekly sync date. The full-stack CV
emphasises features, APIs, databases, auth, tests and CI; the AppSec CV
emphasises review, labs, remediation and regression tests.

## Security lab

The BOLA/IDOR lab lives in `labs/idor/` and is **deliberately vulnerable**. It
listens only on `127.0.0.1`, uses synthetic data and is not included in the
static export (Next publishes `app/` and `public/`, not `labs/`). Do not
distribute it.

```bash
node labs/idor/vulnerable.mjs   # reproduction, loopback only
node labs/idor/fixed.mjs        # same API, ownership enforced
node labs/idor/test.mjs         # tests: 200 vulnerable, 404 fixed, 401 anonymous
```

The bilingual write-up is at `/security/lab-idor/` and
`/it/security/lab-idor/`.

## Theme

Colours live in `app/globals.css`: the `@theme` block defines the light tokens
and `[data-theme="dark"]` overrides them. `--color-surface` /
`--color-on-surface` are the inverse surfaces (footer, marquee, artwork): they
stay dark in both themes, so dark mode does not produce light bands.

The toggle is `components/ThemeToggle.tsx`. The preference is stored in
`localStorage` and applied before the first paint by the inline script in
`lib/theme.ts` (no flash). Without a stored preference the site follows
`prefers-color-scheme`.

## Portrait

The portrait is `public/portrait.jpg` (768×960, 4:5 ratio), already cropped to
remove the social icons from the original image. It is rendered by
`components/Portrait.tsx` with `next/image` in `fill` + `object-cover`.

To replace it, overwrite `public/portrait.jpg` with another vertical 4:5 image
(ideally 1200×1500). The layout does not change: frame, violet shadow and crop
marks stay identical. The alt text is in `content/copy.ts`
(`about.portrait.alt`).

## Deployment

The site is published at **https://errusso.github.io** from the repository
**`ErRusso/errusso.github.io`** (a user site: no subpath and no `basePath`).

Publishing is automatic: every push to `main` builds `out/` and deploys it,
and a weekly scheduled run redeploys to refresh the generated stats. The
workflow is `.github/workflows/deploy.yml`. Pages is configured with
**Settings → Pages → Source: GitHub Actions**.

### Repository model

Issues are enabled and use the templates in `.github/ISSUE_TEMPLATE/`:
**Bug report** and **Feature request**. Blank issues are disabled; use the
contact links for README and lab documentation instead.

Pull requests use `.github/pull_request_template.md` and must link an open
issue with a closing keyword (`Closes #12`): the `pr-policy` workflow
(`.github/workflows/pr-policy.yml`) fails otherwise. `main` is not protected, so
small direct commits are possible, but changes should go through a branch and a
PR so the checks run. Every merged push to `main` is deployed by the workflow,
and a scheduled run redeploys weekly (Mondays, 06:00 UTC) to refresh the Now /
Building stats. A manual deploy can also be started from the Actions tab with
`workflow_dispatch`; the run name shows which event triggered it.

The build also includes a branded `404.html`, used by GitHub Pages for missing
URLs. The artifact is served as-is: Jekyll does not run, so `_next/` is not
ignored.

### Custom domain (future)

1. Add `public/CNAME` with the domain (for example `simonerusso.dev`).
2. Change `url` in `lib/site.ts`.
3. Configure DNS according to the GitHub Pages documentation.

Everything else (canonical, hreflang, OpenGraph, sitemap) updates
automatically.

## Notes

- Email: `s.russo06@icloud.com`, editable in `lib/site.ts`.
- Accessibility: skip link, visible focus, AA contrast, `prefers-reduced-motion`.
- Project illustrations are generated in SVG/CSS: there are no images to
  optimise and no fake screenshots.
