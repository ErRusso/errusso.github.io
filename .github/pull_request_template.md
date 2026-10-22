## Summary

<!-- What changed and why. One or two sentences is enough. -->

## Linked issue

Closes #

<!-- The link is required: the `PR policy` check fails without a closing
     keyword and an open linked issue. Use `Closes #12`, `Fixes #12` or
     `Resolves #12`. -->

## Type of change

- [ ] Bug fix
- [ ] New feature
- [ ] Content update (copy, projects, now.json, photos)
- [ ] Tooling / CI / documentation
- [ ] Refactor (no behaviour change)

## Changes

<!-- Bullet points. Mention the files or sections that changed. -->

-

## Checklist

- [ ] `bun run typecheck` passes
- [ ] `bun run build` produces `out/` (the `next.config.ts` static export)
- [ ] EN (`/`) and IT (`/it`) content are both updated, or the change is locale-agnostic
- [ ] Copy changes live in `content/`, not hard-coded in components
- [ ] No secrets, tokens or `.env` values are included
- [ ] The `labs/idor/` lab stays loopback-only and out of the static export
- [ ] Screenshots attached for visible UI changes

## Deploy note

Merging to `main` rebuilds and publishes **https://errusso.github.io**
immediately. If this PR should not go live yet, say so here.
