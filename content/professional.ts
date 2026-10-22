import { site } from "@/lib/site";
import type { CvTrack } from "@/lib/cv";
import type { Lang } from "@/lib/i18n";
import { now } from "@/lib/now";

export type LinkItem = { label: string; href: string };

export type TimelineItem = {
  period: string;
  title: string;
  org: string;
  body: string;
  tags?: string[];
  links?: LinkItem[];
  current?: boolean;
};

export type SkillGroup = {
  id: string;
  title: string;
  body: string;
  items: string[];
  links?: LinkItem[];
};

export type ExperienceItem = {
  period: string;
  role: string;
  org: string;
  meta: string;
  body: string;
  bullets: string[];
  links?: LinkItem[];
};

export type CvExperience = {
  period: string;
  role: string;
  org: string;
  meta: string;
  bullets: string[];
  links?: LinkItem[];
};

export type CvShared = {
  profileTitle: string;
  experienceTitle: string;
  skillsTitle: string;
  educationTitle: string;
  linksTitle: string;
  availabilityTitle: string;
  education: { period: string; title: string; org: string; detail: string }[];
  links: LinkItem[];
  languages: string;
  footer: string;
};

export type CvVariant = {
  label: string;
  cardTitle: string;
  cardBody: string;
  cardBullets: string[];
  role: string;
  profile: string;
  experience: CvExperience[];
  skills: { label: string; value: string }[];
  availability: string;
};

export type CvContent = {
  shared: CvShared;
  tracks: Record<CvTrack, CvVariant>;
};

export type ProfessionalCopy = {
  meta: { title: string; description: string };
  hero: {
    kicker: string;
    role: string;
    intro: string;
    status: string;
    location: string;
    emailCta: string;
    githubCta: string;
    spec: { key: string; value: string }[];
  };
  now: {
    number: string;
    title: string;
    intro: string;
    labels: {
      repos: string;
      reposNote: string;
      done: string;
      next: string;
      lastPush: string;
      open: string;
      nothingDone: string;
      nothingNext: string;
      updated: string;
      all: string;
    };
  };
  timeline: { number: string; title: string; intro: string; items: TimelineItem[] };
  skills: { number: string; title: string; intro: string; groups: SkillGroup[] };
  experience: { number: string; title: string; intro: string; items: ExperienceItem[] };
  proof: {
    number: string;
    kicker: string;
    title: string;
    intro: string;
    labTitle: string;
    labBody: string;
    bullets: string[];
    pageCta: string;
    sourceCta: string;
    note: string;
  };
  availability: {
    number: string;
    title: string;
    intro: string;
    body: string;
    roles: string[];
    note: string;
  };
  cv: CvContent;
};

const pipeduckRepo = "https://github.com/ErRusso/pipeduck";
const pipeduckVersion = now.release.version;
const pipeduckRelease = now.release.href;
const pipeduckLatestRelease = `${pipeduckRepo}/releases/latest`;
const marmottaRepo = "https://github.com/napi-bindings/marmotta";
const marmottaStats = now.projectStats?.marmotta;
const pipeduckStats = now.projectStats?.pipeduck ?? {
  testFunctions: 29,
  assertions: 431,
  trackedFiles: 86,
  cppKb: 368,
  buildJobs: 4,
};
const pipeduckBuildJobs = pipeduckStats.buildJobs ?? 4;
const marmottaDiff = marmottaStats
  ? `+${marmottaStats.additions} / −${marmottaStats.deletions}`
  : "+165 / −11";
const marmottaFiles = marmottaStats?.changedFiles ?? 6;
const labPageEn = `${site.url}/security/lab-idor/`;
const labPageIt = `${site.url}/it/security/lab-idor/`;

function monthYear(value: string | Date, lang: Lang): string {
  const date = typeof value === "string" ? new Date(`${value}T12:00:00Z`) : value;
  return new Intl.DateTimeFormat(lang === "it" ? "it-IT" : "en-GB", {
    month: "long",
    year: "numeric",
    timeZone: "Europe/Rome",
  }).format(date);
}

const updatedEn = monthYear(now.updated, "en");
const updatedIt = monthYear(now.updated, "it");
// The PDFs are regenerated on every deploy, so the CV footer follows the
// build date; the hero "Updated" value follows the data snapshot.
const cvUpdatedEn = monthYear(new Date(), "en");
const cvUpdatedIt = monthYear(new Date(), "it");
export const labSource = `${site.repo}/tree/main/labs/idor`;

export const professional: Record<Lang, ProfessionalCopy> = {
  en: {
    meta: {
      title: "Profile — full-stack & application security",
      description:
        "Simone Russo: full-stack developer and application security. Skills by area, verifiable contributions, a timeline, and separate full-stack and AppSec CVs in English and Italian.",
    },
    hero: {
      kicker: "Profile / open to work",
      role: "Full-stack developer · Application security",
      intro:
        "I build web products end to end and test them the way an attacker would. Currently studying Computer Science at UniMol, and looking for full-stack or application security work.",
      status: "Open to full-stack / AppSec roles",
      location: "Italy · remote (EU timezone)",
      emailCta: "Email me",
      githubCta: "GitHub",
      spec: [
        { key: "Focus", value: "TypeScript · Node · PostgreSQL" },
        { key: "Security", value: "OWASP · threat modeling · CTF" },
        { key: "Studying", value: "BSc Computer Science, UniMol" },
        { key: "Updated", value: updatedEn },
      ],
    },
    now: {
      number: "NOW",
      title: "Now / Building",
      intro:
        "A live snapshot from GitHub: the repositories I am working in, the issues I closed, and the ones still open.",
      labels: {
        repos: "Repos in use",
        reposNote: "Top 3, this site excluded",
        done: "Done",
        next: "To do",
        lastPush: "Last push",
        open: "Open repo",
        nothingDone: "No issues closed yet.",
        nothingNext: "Nothing open right now.",
        updated: "Last updated",
        all: "Full profile & CV",
      },
    },
    timeline: {
      number: "01",
      title: "Timeline",
      intro:
        "Education, work and public milestones. Exact dates where they exist; ranges where they do not.",
      items: [
        {
          period: "21 OCT 2026",
          title: "Portfolio & professional profile",
          org: "This site",
          body: "Bilingual Next.js static site with required checks and separate full-stack/AppSec CVs in both languages.",
          tags: ["Next.js", "TypeScript", "static export"],
          links: [
            { label: "Live site", href: site.url },
            { label: "Source", href: site.repo },
          ],
          current: true,
        },
        {
          period: "19 OCT 2026",
          title: "PipeDuck",
          org: "Personal project",
          body: "Faster ducking, event-driven PipeWire state, live tray menus and DBusMenu integration tests. MIT.",
          tags: ["C++20", "PipeWire", "GTK4"],
          links: [{ label: "Latest release", href: pipeduckLatestRelease }],
        },
        {
          period: "08 OCT 2026",
          title: "Marmotta",
          org: "Open source",
          body: `Started contributing — since then I have changed ${marmottaDiff} lines across ${marmottaFiles} files.`,
          tags: ["Zig", "Node-API", "CI"],
          links: [{ label: "Marmotta", href: marmottaRepo }],
        },
        {
          period: "2025 — PRESENT",
          title: "BSc Computer Science",
          org: "Università degli Studi del Molise (UniMol)",
          body: "Currently enrolled. The degree runs alongside the projects and the security practice.",
          tags: ["BSc", "Computer Science"],
          links: [{ label: "UniMol", href: "https://www.unimol.it/" }],
        },
        {
          period: "17 JUN — 31 AUG 2024",
          title: "Software development support",
          org: "Packly Prinigraf SRL",
          body: "Occasional autonomous collaboration on an internal real-time dashboard for production devices: Next.js/TypeScript, Fastify/Node, JWT/cookie auth, SQLite, Socket.IO and CI.",
          tags: ["Contract", "Next.js", "Fastify"],
        },
        {
          period: "2019/20 — 2024/25",
          title: "Technical diploma, Computer Science",
          org: "Istituto Tecnico G. Marconi, Campobasso",
          body: "Five-year technical track. The foundation under everything else on this page.",
          tags: ["Diploma", "Computer Science"],
          links: [{ label: "School", href: "https://www.iti-marconi.edu.it/" }],
        },
      ],
    },
    skills: {
      number: "02",
      title: "Skills by area",
      intro:
        "Grouped by where I actually use them. No percentages; public evidence is linked where it exists.",
      groups: [
        {
          id: "frontend",
          title: "Frontend",
          body: "The interface layer: static export, responsive layout, motion with a reduced-motion escape hatch.",
          items: ["TypeScript", "React", "Next.js", "Tailwind CSS", "Semantic HTML", "Responsive CSS"],
          links: [{ label: "This site", href: site.repo }],
        },
        {
          id: "backend",
          title: "Backend",
          body: "The part that has to survive real data and real users. One internal production dashboard; public evidence is thinner and described as such.",
          items: ["Node.js", "Fastify", "REST APIs", "JWT/cookie auth", "SQLite", "PostgreSQL"],
        },
        {
          id: "systems",
          title: "Systems",
          body: "Native code, Linux plumbing and the build chain around it.",
          items: ["C++20", "Zig", "CMake", "Linux", "PipeWire/libpulse", "GTK4", "Node-API"],
          links: [
            { label: "PipeDuck", href: pipeduckRepo },
            { label: "Marmotta", href: marmottaRepo },
          ],
        },
        {
          id: "security",
          title: "Application security",
          body: "Early-career and public: notes, tests and a reproducible lab, not a certificate collection.",
          items: ["OWASP Top 10", "BOLA/IDOR", "Threat modeling", "Secure code review", "CTF"],
          links: [
            { label: "Security notes", href: `${site.url}/security/` },
            { label: "IDOR lab", href: labPageEn },
          ],
        },
        {
          id: "tooling",
          title: "Tooling",
          body: "The boring infrastructure that keeps changes reversible.",
          items: ["Git/GitHub", "GitHub Actions", "Vitest", "Docker", "Bun", "Static export"],
          links: [{ label: "Source", href: site.repo }],
        },
        {
          id: "languages",
          title: "Languages",
          body: "Italian is the native language. English is the working language for code, docs and reviews.",
          items: ["Italian — native", "English — working proficiency"],
        },
      ],
    },
    experience: {
      number: "03",
      title: "Experience & proof",
      intro:
        "The paid work is short and recent. The public track record is growing. Both are listed without inflation.",
      items: [
        {
          period: "17 JUN — 31 AUG 2024",
          role: "Software development support",
          org: "Packly Prinigraf SRL",
          meta: "Campochiaro (CB) · internal project, code not public",
          body: "Occasional autonomous collaboration on an internal real-time dashboard for production devices. The contract defines a fixed scope; the project and customer data stay private.",
          bullets: [
            "Next.js/TypeScript UI, Fastify/Node REST API, JWT/cookie auth, SQLite and Socket.IO.",
            "Controller/sensor views, API-backed forms and Slack alerts; Vitest coverage ran in CI.",
            "No repository name, code, screenshots or customer data published.",
          ],
        },
        {
          period: "13 OCT 2026",
          role: "Open-source contributor",
          org: "napi-bindings/marmotta",
          meta: `Open source · ${marmottaDiff} · ${marmottaFiles} files`,
          body: "Upstream contributions to Marmotta’s Zig toolchain and build pipeline, with a focus on cache isolation, diagnostics and regression coverage.",
          bullets: [
            "Documented the variable in the README and CLI help.",
            "Added regression coverage for custom directories, cache preservation and failure paths.",
          ],
          links: [
            { label: "Marmotta", href: marmottaRepo },
          ],
        },
        {
          period: "19 OCT 2026",
          role: "Creator & maintainer",
          org: "PipeDuck",
          meta: `MIT · v${pipeduckVersion}`,
          body: "C++20 PipeWire ducking daemon with smooth return fades and microphone-triggered ducking. The 1.x line moved state reading to a single libpulse event subscription and added live tray menus.",
          bullets: [
            `${pipeduckStats.testFunctions} test functions · ${pipeduckBuildJobs} build jobs.`,
            "DBusMenu/StatusNotifierItem integration tests under dbus-run-session.",
          ],
          links: [
            { label: "Repository", href: pipeduckRepo },
            { label: `Release v${pipeduckVersion}`, href: pipeduckRelease },
          ],
        },
        {
          period: "21 OCT 2026",
          role: "Design & build",
          org: "This site",
          meta: "Next.js · TypeScript · static export",
          body: "Bilingual brutalist portfolio with a custom cursor, scroll memory and required checks.",
          bullets: [
            "Static export on GitHub Pages.",
            "Reduced-motion and no-JS fallbacks are part of the spec.",
          ],
          links: [
            { label: "Live", href: site.url },
            { label: "Source", href: site.repo },
          ],
        },
      ],
    },
    proof: {
      number: "04",
      kicker: "Public proof / training lab",
      title: "One bug, end to end.",
      intro:
        "No certifications and no paid pentests. One deliberately vulnerable local API, documented from scope to regression test.",
      labTitle: "BOLA/IDOR in an invoicing API",
      labBody:
        "Authentication works. Object-level authorization does not. Alice logs in and reads Bob's invoice; the fixed build returns 404 and the regression test proves both states.",
      bullets: [
        "Reproducible on loopback with synthetic data",
        "Impact, root cause and a minimal fix",
        "Regression test: vulnerable 200, fixed 404",
      ],
      pageCta: "Read the lab",
      sourceCta: "Source",
      note: "Training exercise, not a client engagement.",
    },
    availability: {
      number: "05",
      title: "Availability",
      intro:
        "If you need someone who can build the feature and then try to break it, that is the pitch.",
      body: "Open to full-stack or application security roles. Based in Italy, working remote on EU time. No certifications yet: the security work is public and reproducible, and the rest is on this page.",
      roles: ["Full-stack developer", "Application security"],
      note: "Two CVs: full-stack or AppSec. One page, no photo.",
    },
    cv: {
      shared: {
        profileTitle: "Profile",
        experienceTitle: "Experience",
        skillsTitle: "Skills",
        educationTitle: "Education",
        linksTitle: "Selected links",
        availabilityTitle: "Availability",
        education: [
          {
            period: "2025–present",
            title: "BSc Computer Science",
            org: "Università degli Studi del Molise (UniMol)",
            detail: "Currently enrolled.",
          },
          {
            period: "2019/20–2024/25",
            title: "Technical diploma, Computer Science",
            org: "Istituto Tecnico G. Marconi, Campobasso",
            detail: "Five-year technical track.",
          },
        ],
        links: [
          { label: "Portfolio", href: site.url },
          { label: "GitHub", href: site.github },
          { label: "Security lab", href: labPageEn },
          { label: `PipeDuck v${pipeduckVersion}`, href: pipeduckRelease },
          { label: "Marmotta", href: marmottaRepo },
        ],
        languages: "Italian — native · English — working proficiency.",
        footer: `CV updated ${cvUpdatedEn} · errusso.github.io`,
      },
      tracks: {
        fullstack: {
          label: "Full-stack",
          cardTitle: "Build the feature. Test it. Ship it.",
          cardBody:
            "Next.js/TypeScript on the surface, Node/Fastify and SQL underneath. One internal production dashboard, public projects, tests and CI.",
          cardBullets: ["UI → API → schema", "Tests + GitHub Actions", "Security review before ship"],
          role: "Full-stack developer",
          profile:
            "Full-stack developer with a security bias. I can take a feature from interface to API to schema, write the tests and ship it through CI. I have worked on an internal real-time dashboard for production devices and maintain public projects in TypeScript and C++. Currently studying Computer Science at UniMol; open to junior full-stack roles.",
          experience: [
            {
              period: "Jun–Aug 2024",
              role: "Software development support",
              org: "Packly Prinigraf SRL",
              meta: "Campochiaro (CB), Italy · internal project, code not public",
              bullets: [
                "Contributed to an internal real-time dashboard for production devices: Next.js/TypeScript UI, Fastify/Node REST API, JWT/cookie auth and SQLite.",
                "Worked on controller/sensor views, API-backed forms and Slack alerts; Vitest coverage ran in CI.",
              ],
            },
            {
              period: "Oct 2026",
              role: "Design & build",
              org: "errusso.github.io",
              meta: "Next.js · TypeScript · static export",
              bullets: [
                "Bilingual static portfolio with required checks and no server-side runtime.",
                "Custom cursor, scroll memory and a one-page CV generator, with reduced-motion and no-JS fallbacks.",
              ],
              links: [
                { label: "Live", href: site.url },
                { label: "Source", href: site.repo },
              ],
            },
            {
              period: "Oct 2026",
              role: "Creator & maintainer",
              org: "PipeDuck",
              meta: `MIT · v${pipeduckVersion}`,
              bullets: [
                "C++20 PipeWire ducking daemon with event-driven libpulse state, smooth return fades and microphone triggering.",
                `GTK4 tray, DBusMenu integration tests and CI matrix; ${pipeduckStats.testFunctions} test functions across ${pipeduckBuildJobs} build jobs.`,
              ],
              links: [
                { label: "Repository", href: pipeduckRepo },
                { label: "Release", href: pipeduckRelease },
              ],
            },
            {
              period: "Oct 2026",
              role: "Open-source contributor",
              org: "napi-bindings/marmotta",
              meta: "Open source",
              bullets: [
                "Upstream contributor on the Zig toolchain, cache isolation and build reliability.",
                `Documented the variable and added regression tests. ${marmottaDiff} across ${marmottaFiles} files.`,
              ],
              links: [{ label: "Marmotta", href: marmottaRepo }],
            },
          ],
          skills: [
            { label: "Frontend", value: "TypeScript · React · Next.js · Tailwind CSS · semantic HTML" },
            { label: "Backend", value: "Node.js · Fastify · REST APIs · JWT/cookie auth · SQLite/PostgreSQL" },
            { label: "Testing & CI", value: "Vitest · node:test · GitHub Actions · lint/build gates" },
            { label: "Systems & tooling", value: "C++20 · Zig · CMake · Linux · Git/GitHub · Docker" },
            { label: "Security", value: "OWASP Top 10 · secure code review · threat modeling" },
          ],
          availability: "Junior full-stack roles · Italy / remote (EU timezone).",
        },
        appsec: {
          label: "Application security",
          cardTitle: "Find it. Prove it. Fix it.",
          cardBody:
            "OWASP-focused review, reproducible findings and regression tests. One public training lab; no paid pentests claimed.",
          cardBullets: ["BOLA/IDOR training lab", "Secure code review", "Repro + regression test"],
          role: "Application security",
          profile:
            "Application security, early career. I review code against the OWASP Top 10, model trust boundaries, and write reproducible checks plus regression tests. I also build the software, so remediation is practical. One public training lab; no paid pentests claimed. Currently studying Computer Science at UniMol; open to junior AppSec roles.",
          experience: [
            {
              period: "Oct 2026",
              role: "Author · training lab",
              org: "BOLA/IDOR in an invoicing API",
              meta: "Local, synthetic data · errusso.github.io/security/lab-idor",
              bullets: [
                "Built a local invoicing API with authentication but no object-level authorization; reproduced Alice reading Bob's invoice.",
                "Documented impact, root cause and fix; the regression test asserts vulnerable 200, fixed 404, owner/self 200 and anonymous 401.",
              ],
              links: [
                { label: "Lab", href: labPageEn },
                { label: "Source", href: labSource },
              ],
            },
            {
              period: "Jun–Aug 2024",
              role: "Software development support",
              org: "Packly Prinigraf SRL",
              meta: "Campochiaro (CB), Italy · internal project, code not public",
              bullets: [
                "Worked on an internal real-time dashboard with JWT/cookie auth, REST endpoints, SQLite persistence and a Slack integration.",
                "Hands-on with authentication boundaries and object-level data access in a production-facing internal tool; code private.",
              ],
            },
            {
              period: "Oct 2026",
              role: "Open-source contributor",
              org: "napi-bindings/marmotta",
              meta: "Open source",
              bullets: [
                "Reviewed an unfamiliar Node-API build tool, focusing on toolchain paths and failure handling.",
                `Covered custom-directory and failure paths with regression tests; ${marmottaDiff} across ${marmottaFiles} files; documented upstream.`,
              ],
              links: [{ label: "Marmotta", href: marmottaRepo }],
            },
            {
              period: "Oct 2026",
              role: "Creator & maintainer",
              org: "PipeDuck",
              meta: `MIT · v${pipeduckVersion}`,
              bullets: [
                "TOML config validation, threshold clamping and hot reload; unit tests cover parsing and routing invariants.",
                "Threat-modeled audio-routing failure paths; tray/D-Bus surface remains open and is documented.",
              ],
              links: [
                { label: "Repository", href: pipeduckRepo },
                { label: "Release", href: pipeduckRelease },
              ],
            },
          ],
          skills: [
            { label: "Web security", value: "OWASP Top 10 · BOLA/IDOR · authn vs authz · input handling" },
            { label: "Review", value: "Secure code review · threat modeling · remediation notes" },
            { label: "Proof", value: "Reproduction steps · regression tests · scoped disclosure" },
            { label: "Platforms", value: "Node.js/Fastify · TypeScript/Next.js · SQL/SQLite · GitHub Actions" },
            { label: "Systems", value: "C++20 · Zig · Linux · PipeWire/libpulse" },
          ],
          availability: "Junior application security roles · Italy / remote (EU timezone).",
        },
      },
    },

  },
  it: {
    meta: {
      title: "Profilo — full-stack e application security",
      description:
        "Simone Russo: sviluppatore full-stack e application security. Competenze per area, contributi verificabili, timeline e CV separati full-stack e AppSec in italiano e inglese.",
    },
    hero: {
      kicker: "Profilo / aperto a proposte",
      role: "Sviluppatore full-stack · Application security",
      intro:
        "Costruisco prodotti web da capo a fondo e li testo come farebbe un attaccante. Studio Informatica all'UniMol e cerco ruoli full-stack o application security.",
      status: "Disponibile per ruoli full-stack / AppSec",
      location: "Italia · remoto (fuso UE)",
      emailCta: "Scrivimi",
      githubCta: "GitHub",
      spec: [
        { key: "Focus", value: "TypeScript · Node · PostgreSQL" },
        { key: "Sicurezza", value: "OWASP · threat modeling · CTF" },
        { key: "Studio", value: "Laurea in Informatica, UniMol" },
        { key: "Aggiornato", value: updatedIt },
      ],
    },
    now: {
      number: "ORA",
      title: "Ora / In costruzione",
      intro:
        "Un'istantanea live da GitHub: i repository su cui sto lavorando, le issue chiuse e quelle ancora aperte.",
      labels: {
        repos: "Repo in uso",
        reposNote: "I 3 più attivi, escluso questo sito",
        done: "Fatte",
        next: "Da fare",
        lastPush: "Ultimo push",
        open: "Apri repo",
        nothingDone: "Nessuna issue chiusa finora.",
        nothingNext: "Niente in sospeso al momento.",
        updated: "Ultimo aggiornamento",
        all: "Profilo completo e CV",
      },
    },
    timeline: {
      number: "01",
      title: "Timeline",
      intro:
        "Formazione, lavoro e milestone pubbliche. Date esatte dove esistono; intervalli dove non esistono.",
      items: [
        {
          period: "21 OTT 2026",
          title: "Portfolio e profilo professionale",
          org: "Questo sito",
          body: "Sito statico bilingue in Next.js, check obbligatori e CV separati full-stack/AppSec in entrambe le lingue.",
          tags: ["Next.js", "TypeScript", "static export"],
          links: [
            { label: "Sito live", href: site.url },
            { label: "Sorgenti", href: site.repo },
          ],
          current: true,
        },
        {
          period: "19 OTT 2026",
          title: "PipeDuck",
          org: "Progetto personale",
          body: "Ducking più rapido, stato PipeWire event-driven, menu della tray aggiornati e test di integrazione DBusMenu. MIT.",
          tags: ["C++20", "PipeWire", "GTK4"],
          links: [{ label: "Ultima release", href: pipeduckLatestRelease }],
        },
        {
          period: "08 OTT 2026",
          title: "Marmotta",
          org: "Open source",
          body: `Ho iniziato a contribuire — da allora ho modificato ${marmottaDiff} righe in ${marmottaFiles} file.`,
          tags: ["Zig", "Node-API", "CI"],
          links: [{ label: "Marmotta", href: marmottaRepo }],
        },
        {
          period: "2025 — OGGI",
          title: "Laurea in Informatica",
          org: "Università degli Studi del Molise (UniMol)",
          body: "Attualmente iscritto. Il percorso universitario convive con i progetti e la pratica sulla sicurezza.",
          tags: ["Laurea", "Informatica"],
          links: [{ label: "UniMol", href: "https://www.unimol.it/" }],
        },
        {
          period: "17 GIU — 31 AGO 2024",
          title: "Supporto allo sviluppo software",
          org: "Packly Prinigraf SRL",
          body: "Collaborazione occasionale autonoma su una dashboard interna real-time per dispositivi di produzione: Next.js/TypeScript, Fastify/Node, auth JWT/cookie, SQLite, Socket.IO e CI.",
          tags: ["Contratto", "Next.js", "Fastify"],
        },
        {
          period: "2019/20 — 2024/25",
          title: "Diploma tecnico, Informatica",
          org: "Istituto Tecnico G. Marconi, Campobasso",
          body: "Percorso tecnico di cinque anni. La base sotto tutto il resto di questa pagina.",
          tags: ["Diploma", "Informatica"],
          links: [{ label: "Scuola", href: "https://www.iti-marconi.edu.it/" }],
        },
      ],
    },
    skills: {
      number: "02",
      title: "Competenze per area",
      intro:
        "Raggruppate per dove le uso davvero. Niente percentuali; le prove pubbliche sono linkate dove esistono.",
      groups: [
        {
          id: "frontend",
          title: "Frontend",
          body: "Il livello dell'interfaccia: export statico, layout responsive, motion con una via di fuga per reduced-motion.",
          items: ["TypeScript", "React", "Next.js", "Tailwind CSS", "HTML semantico", "CSS responsive"],
          links: [{ label: "Questo sito", href: site.repo }],
        },
        {
          id: "backend",
          title: "Backend",
          body: "La parte che deve sopravvivere a dati e utenti reali. Una dashboard interna in produzione; le prove pubbliche sono poche e descritte come tali.",
          items: ["Node.js", "Fastify", "API REST", "Auth JWT/cookie", "SQLite", "PostgreSQL"],
        },
        {
          id: "systems",
          title: "Sistemi",
          body: "Codice nativo, impianto Linux e la build chain intorno.",
          items: ["C++20", "Zig", "CMake", "Linux", "PipeWire/libpulse", "GTK4", "Node-API"],
          links: [
            { label: "PipeDuck", href: pipeduckRepo },
            { label: "Marmotta", href: marmottaRepo },
          ],
        },
        {
          id: "security",
          title: "Application security",
          body: "Primi anni e tutto pubblico: note, test e un laboratorio riproducibile, non una collezione di certificati.",
          items: ["OWASP Top 10", "BOLA/IDOR", "Threat modeling", "Secure code review", "CTF"],
          links: [
            { label: "Note di sicurezza", href: `${site.url}/it/security/` },
            { label: "Lab IDOR", href: labPageIt },
          ],
        },
        {
          id: "tooling",
          title: "Tooling",
          body: "L'infrastruttura noiosa che rende reversibili le modifiche.",
          items: ["Git/GitHub", "GitHub Actions", "Vitest", "Docker", "Bun", "Static export"],
          links: [{ label: "Sorgenti", href: site.repo }],
        },
        {
          id: "languages",
          title: "Lingue",
          body: "L'italiano è la lingua madre. L'inglese è la lingua di lavoro per codice, documentazione e review.",
          items: ["Italiano — madrelingua", "Inglese — livello professionale"],
        },
      ],
    },
    experience: {
      number: "03",
      title: "Esperienza e prove",
      intro:
        "Il lavoro retribuito è breve e recente. Il track record pubblico sta crescendo. Entrambi sono elencati senza gonfiature.",
      items: [
        {
          period: "17 GIU — 31 AGO 2024",
          role: "Supporto allo sviluppo software",
          org: "Packly Prinigraf SRL",
          meta: "Campochiaro (CB) · progetto interno, codice non pubblico",
          body: "Collaborazione occasionale autonoma su una dashboard interna real-time per dispositivi di produzione. Il contratto definisce un perimetro concordato; progetto e dati dei clienti restano privati.",
          bullets: [
            "UI Next.js/TypeScript, API REST Fastify/Node, auth JWT/cookie, SQLite e Socket.IO.",
            "Viste controller/sensori, form collegati alle API e alert Slack; copertura Vitest in CI.",
            "Nessun nome di repository, codice, screenshot o dato cliente pubblicato.",
          ],
        },
        {
          period: "13 OTT 2026",
          role: "Contributore open source",
          org: "napi-bindings/marmotta",
          meta: `Open source · ${marmottaDiff} · ${marmottaFiles} file`,
          body: "Contributi upstream alla toolchain Zig e alla pipeline di build di Marmotta, con focus su isolamento della cache, diagnostica e copertura di regressione.",
          bullets: [
            "Variabile documentata nel README e nell'help della CLI.",
            "Test di regressione per directory custom, conservazione della cache e percorsi di errore.",
          ],
          links: [
            { label: "Marmotta", href: marmottaRepo },
          ],
        },
        {
          period: "19 OTT 2026",
          role: "Creatore e maintainer",
          org: "PipeDuck",
          meta: `MIT · v${pipeduckVersion}`,
          body: "Daemon di ducking audio per PipeWire in C++20, con fade di ritorno morbidi e attivazione da microfono. La linea 1.x legge lo stato da una singola sottoscrizione eventi libpulse e aggiunge menu della tray aggiornati.",
          bullets: [
            `${pipeduckStats.testFunctions} funzioni di test · ${pipeduckBuildJobs} job di build.`,
            "Test di integrazione DBusMenu/StatusNotifierItem sotto dbus-run-session.",
          ],
          links: [
            { label: "Repository", href: pipeduckRepo },
            { label: `Release v${pipeduckVersion}`, href: pipeduckRelease },
          ],
        },
        {
          period: "21 OTT 2026",
          role: "Design e sviluppo",
          org: "Questo sito",
          meta: "Next.js · TypeScript · static export",
          body: "Portfolio brutalista bilingue con cursore custom, memoria dello scroll e check obbligatori.",
          bullets: [
            "Export statico su GitHub Pages.",
            "Fallback per reduced-motion e no-JS parte della specifica.",
          ],
          links: [
            { label: "Live", href: site.url },
            { label: "Sorgenti", href: site.repo },
          ],
        },
      ],
    },
    proof: {
      number: "04",
      kicker: "Prova pubblica / training lab",
      title: "Una vulnerabilità, dall'inizio alla fine.",
      intro:
        "Nessuna certificazione e nessun pentest retribuito. Una piccola API locale deliberatamente vulnerabile, documentata dal perimetro al test di regressione.",
      labTitle: "BOLA/IDOR in un'API di fatture",
      labBody:
        "L'autenticazione funziona. L'autorizzazione a livello di oggetto no. Alice accede e legge la fattura di Bob; la build corretta restituisce 404 e il test di regressione dimostra entrambi gli stati.",
      bullets: [
        "Riproducibile in loopback con dati sintetici",
        "Impatto, root cause e fix minimale",
        "Test di regressione: 200 vulnerabile, 404 corretto",
      ],
      pageCta: "Leggi il lab",
      sourceCta: "Sorgenti",
      note: "Esercizio di formazione, non un incarico per un cliente.",
    },
    availability: {
      number: "05",
      title: "Disponibilità",
      intro:
        "Se cerchi qualcuno che costruisca la feature e poi provi a romperla, il pitch è questo.",
      body: "Disponibile per ruoli full-stack o application security. Base in Italia, lavoro da remoto sul fuso UE. Nessuna certificazione per ora: il lavoro sulla sicurezza è pubblico e riproducibile, il resto è in questa pagina.",
      roles: ["Sviluppatore full-stack", "Application security"],
      note: "Due CV: full-stack o AppSec. Una pagina, senza foto.",
    },
    cv: {
      shared: {
        profileTitle: "Profilo",
        experienceTitle: "Esperienza",
        skillsTitle: "Competenze",
        educationTitle: "Formazione",
        linksTitle: "Link selezionati",
        availabilityTitle: "Disponibilità",
        education: [
          {
            period: "2025–oggi",
            title: "Laurea in Informatica",
            org: "Università degli Studi del Molise (UniMol)",
            detail: "Attualmente iscritto.",
          },
          {
            period: "2019/20–2024/25",
            title: "Diploma tecnico, Informatica",
            org: "Istituto Tecnico G. Marconi, Campobasso",
            detail: "Percorso tecnico di cinque anni.",
          },
        ],
        links: [
          { label: "Portfolio", href: site.url },
          { label: "GitHub", href: site.github },
          { label: "Lab di sicurezza", href: labPageIt },
          { label: `PipeDuck v${pipeduckVersion}`, href: pipeduckRelease },
          { label: "Marmotta", href: marmottaRepo },
        ],
        languages: "Italiano — madrelingua · Inglese — livello professionale.",
        footer: `CV aggiornato a ${cvUpdatedIt} · errusso.github.io`,
      },
      tracks: {
        fullstack: {
          label: "Full-stack",
          cardTitle: "Costruisci la feature. Testala. Rilasciala.",
          cardBody:
            "Next.js/TypeScript in superficie, Node/Fastify e SQL sotto. Una dashboard interna in produzione, progetti pubblici, test e CI.",
          cardBullets: ["UI → API → schema", "Test + GitHub Actions", "Security review prima del rilascio"],
          role: "Sviluppatore full-stack",
          profile:
            "Sviluppatore full-stack con un'inclinazione per la sicurezza. Porto una feature dall'interfaccia all'API allo schema, scrivo i test e la rilascio tramite CI. Ho lavorato su una dashboard interna real-time per dispositivi di produzione e mantengo progetti pubblici in TypeScript e C++. Studio Informatica all'UniMol; disponibile per ruoli full-stack junior.",
          experience: [
            {
              period: "Giu–Ago 2024",
              role: "Supporto allo sviluppo software",
              org: "Packly Prinigraf SRL",
              meta: "Campochiaro (CB), Italia · progetto interno, codice non pubblico",
              bullets: [
                "Dashboard interna real-time per dispositivi di produzione: UI Next.js/TypeScript, API REST Fastify/Node, auth JWT/cookie e SQLite.",
                "Viste controller/sensori, form collegati alle API e alert Slack; copertura Vitest in CI.",
              ],
            },
            {
              period: "Ott 2026",
              role: "Design e sviluppo",
              org: "errusso.github.io",
              meta: "Next.js · TypeScript · static export",
              bullets: [
                "Portfolio statico bilingue con check obbligatori e nessun runtime server-side.",
                "Cursore custom, memoria dello scroll e generatore di CV di una pagina, con fallback reduced-motion e no-JS.",
              ],
              links: [
                { label: "Live", href: site.url },
                { label: "Sorgenti", href: site.repo },
              ],
            },
            {
              period: "Ott 2026",
              role: "Creatore e maintainer",
              org: "PipeDuck",
              meta: `MIT · v${pipeduckVersion}`,
              bullets: [
                "Daemon di ducking audio per PipeWire in C++20 con stato libpulse event-driven, fade di ritorno morbidi e attivazione da microfono.",
                `Tray GTK4, test di integrazione DBusMenu e matrice CI; ${pipeduckStats.testFunctions} funzioni di test su ${pipeduckBuildJobs} job di build.`,
              ],
              links: [
                { label: "Repository", href: pipeduckRepo },
                { label: "Release", href: pipeduckRelease },
              ],
            },
            {
              period: "Ott 2026",
              role: "Contributore open source",
              org: "napi-bindings/marmotta",
              meta: "Open source",
              bullets: [
                "Contributore upstream su toolchain Zig, isolamento della cache e affidabilità della build.",
                `Variabile documentata e test di regressione aggiunti. ${marmottaDiff} su ${marmottaFiles} file.`,
              ],
              links: [{ label: "Marmotta", href: marmottaRepo }],
            },
          ],
          skills: [
            { label: "Frontend", value: "TypeScript · React · Next.js · Tailwind CSS · HTML semantico" },
            { label: "Backend", value: "Node.js · Fastify · API REST · auth JWT/cookie · SQLite/PostgreSQL" },
            { label: "Test e CI", value: "Vitest · node:test · GitHub Actions · gate lint/build" },
            { label: "Sistemi e tooling", value: "C++20 · Zig · CMake · Linux · Git/GitHub · Docker" },
            { label: "Sicurezza", value: "OWASP Top 10 · secure code review · threat modeling" },
          ],
          availability: "Ruoli full-stack junior · Italia / remoto (fuso UE).",
        },
        appsec: {
          label: "Application security",
          cardTitle: "Trovala. Dimostrala. Correggila.",
          cardBody:
            "Review orientata a OWASP, finding riproducibili e test di regressione. Un training lab pubblico; nessun pentest retribuito dichiarato.",
          cardBullets: ["Training lab BOLA/IDOR", "Secure code review", "Repro + test di regressione"],
          role: "Application security",
          profile:
            "Application security, primi anni. Rivedo codice rispetto alle OWASP Top 10, modello i confini di fiducia e scrivo verifiche riproducibili più test di regressione. Costruisco anche il software, quindi la remediation è pratica. Un training lab pubblico; nessun pentest retribuito dichiarato. Studio Informatica all'UniMol; disponibile per ruoli AppSec junior.",
          experience: [
            {
              period: "Ott 2026",
              role: "Autore · training lab",
              org: "BOLA/IDOR in un'API di fatture",
              meta: "Dati locali e sintetici · errusso.github.io/it/security/lab-idor",
              bullets: [
                "API locale di fatture con autenticazione ma senza autorizzazione a livello di oggetto; riproduzione di Alice che legge la fattura di Bob.",
                "Documentati impatto, root cause e fix; il test di regressione verifica 200 vulnerabile, 404 corretto, 200 owner/self e 401 anonimo.",
              ],
              links: [
                { label: "Lab", href: labPageIt },
                { label: "Sorgenti", href: labSource },
              ],
            },
            {
              period: "Giu–Ago 2024",
              role: "Supporto allo sviluppo software",
              org: "Packly Prinigraf SRL",
              meta: "Campochiaro (CB), Italia · progetto interno, codice non pubblico",
              bullets: [
                "Lavoro su una dashboard interna real-time con auth JWT/cookie, endpoint REST, persistenza SQLite e integrazione Slack.",
                "Esperienza pratica con confini di autenticazione e accesso ai dati a livello di oggetto in uno strumento interno; codice privato.",
              ],
            },
            {
              period: "Ott 2026",
              role: "Contributore open source",
              org: "napi-bindings/marmotta",
              meta: "Open source",
              bullets: [
                "Revisione di un build tool Node-API non familiare, con focus su percorsi della toolchain e gestione degli errori.",
                `Coperti directory custom e percorsi di errore con test di regressione; ${marmottaDiff} su ${marmottaFiles} file; documentata upstream.`,
              ],
              links: [{ label: "Marmotta", href: marmottaRepo }],
            },
            {
              period: "Ott 2026",
              role: "Creatore e maintainer",
              org: "PipeDuck",
              meta: `MIT · v${pipeduckVersion}`,
              bullets: [
                "Validazione config TOML, clamping delle soglie e hot reload; i test unitari coprono parsing e invarianti di routing.",
                "Threat model dei percorsi di errore del routing audio; superficie tray/D-Bus ancora aperta e documentata.",
              ],
              links: [
                { label: "Repository", href: pipeduckRepo },
                { label: "Release", href: pipeduckRelease },
              ],
            },
          ],
          skills: [
            { label: "Sicurezza web", value: "OWASP Top 10 · BOLA/IDOR · authn vs authz · gestione input" },
            { label: "Review", value: "Secure code review · threat modeling · note di remediation" },
            { label: "Prove", value: "Passi di riproduzione · test di regressione · disclosure con perimetro" },
            { label: "Piattaforme", value: "Node.js/Fastify · TypeScript/Next.js · SQL/SQLite · GitHub Actions" },
            { label: "Sistemi", value: "C++20 · Zig · Linux · PipeWire/libpulse" },
          ],
          availability: "Ruoli application security junior · Italia / remoto (fuso UE).",
        },
      },
    },

  },
};
