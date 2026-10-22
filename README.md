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
bun run cv       # regenerates the four CV PDFs (requires Chromium)
```

The project uses **bun** (`bun.lock` is committed). npm works too:
`npm install && npm run dev`.

## Where content lives

| What | File |
| --- | --- |
| Copy for every section (EN + IT) | `content/copy.ts` |
| Projects and case studies | `content/projects.ts` |
| "Off the clock" photos | `content/photos.ts` + `public/photos/` |
| Now / Building data (release, projects, goals, study) | `content/now.json` |
| Professional page, timeline, skills, CVs | `content/professional.ts` |
| CV PDFs (full-stack/AppSec, EN/IT) | `public/cv/*.pdf` (generated from `/cv/`, `/cv/appsec/`, `/it/cv/`, `/it/cv/appsec/`) |
| Email, GitHub, Instagram, site URL, timezone | `lib/site.ts` |
| Colours, fonts, base classes | `app/globals.css` |
| Section components | `components/*.tsx` |

To add a project, append an object to `projects` in `content/projects.ts`: the
home card, `/work/[slug]`, `/it/work/[slug]`, the sitemap and the "next
project" link all update automatically.

## Now / Building sync

The **Now / Building** section has one automatic part and one manual part.
`bun run now:sync` reads public data from GitHub and updates
`content/now.json`: the latest PipeDuck release, the PipeDuck version under
development, the cumulative Marmotta contribution metrics (added/removed lines
and files) and the update date. Curated copy is preserved when the release URL
is unchanged; new entries receive a short generated description that can be
edited afterwards.

The script also runs in the deploy workflow (`main` and `workflow_dispatch`)
before the build, so the published site stays current even when the JSON has
not been recommitted. Pull request builds skip it to keep checks
deterministic. Locally it falls back to `gh auth token`; in Actions it receives
`GITHUB_TOKEN`. The token is never printed.

```bash
bun run now:sync                 # update content/now.json
bun run now:sync -- --dry-run    # report whether anything would change
bun run now:sync -- --check      # exit 1 when the JSON is stale
bun run now:sync -- --strict     # fail when GitHub does not respond
bun run deploy:prepare           # sync + typecheck + local build
```

Monthly goals, "In study" copy, descriptions for non-PipeDuck "In
development" cards and editorial notes remain manual.

## Professional profile and CVs

The professional page is at `/professional` and `/it/professional`. PDFs are
generated from the printable routes `/cv/`, `/cv/appsec/`, `/it/cv/` and
`/it/cv/appsec/` with `bun run cv`. Committed PDFs are included in the build,
so CI does not need Chromium. The full-stack CV emphasises features, APIs,
databases, auth, tests and CI; the AppSec CV emphasises review, labs,
remediation and regression tests.

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

Publishing is automatic: every push to `main` builds `out/` and deploys it. The
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
PR so the checks run. Every merged push to `main` is deployed by the workflow.
A manual deploy can also be started from the Actions tab with
`workflow_dispatch`.

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
