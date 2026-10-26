import type { Lang } from "@/lib/i18n";
import { now } from "@/lib/now";

const marmottaFallback = {
  additions: 1115,
  deletions: 44,
  changedFiles: 15,
  contributions: 2,
  firstMergedOn: "2026-10-13",
};

const marmottaStats = now.projectStats?.marmotta ?? marmottaFallback;
const marmottaDiff = `+${marmottaStats.additions} / −${marmottaStats.deletions}`;

const pipeduckStats = now.projectStats?.pipeduck ?? {
  testFunctions: 29,
  assertions: 431,
  trackedFiles: 86,
  cppKb: 368,
  buildJobs: 4,
};
const pipeduckBuildJobs = pipeduckStats.buildJobs ?? 4;
const pipeduckRelease = now.release;
const audit = now.audit;
// Seed values, used only if the committed JSON predates the Lighthouse sync.
// `content/now.json` normally carries the live `site` block.
const siteStats = now.site ?? {
  lighthouseVersion: "13.5",
  date: "2026-10-21",
  mobile: {
    performance: 95,
    accessibility: 100,
    bestPractices: 100,
    seo: 100,
    transferredKb: 287,
    lcpSeconds: 2.7,
    cls: 0,
  },
  desktop: {
    performance: 100,
    accessibility: 100,
    bestPractices: 100,
    seo: 100,
    transferredKb: 0,
    lcpSeconds: 0,
    cls: 0,
  },
};

function formatDate(value: string, lang: Lang): string {
  return new Intl.DateTimeFormat(lang === "it" ? "it-IT" : "en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T12:00:00Z`));
}

function formatMonth(value: string, lang: Lang): string {
  return new Intl.DateTimeFormat(lang === "it" ? "it-IT" : "en-GB", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T12:00:00Z`));
}

function formatLongDate(value: string, lang: Lang): string {
  return new Intl.DateTimeFormat(lang === "it" ? "it-IT" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T12:00:00Z`));
}

function decimal(value: number, lang: Lang): string {
  return value.toLocaleString(lang === "it" ? "it-IT" : "en-GB", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

function marmottaEvidence(lang: Lang): { value: string; label: string }[] {
  return [
    {
      value: "Marmotta",
      label:
        lang === "it"
          ? `Open source · dal ${formatDate(marmottaStats.firstMergedOn, lang)}`
          : `Open source · since ${formatDate(marmottaStats.firstMergedOn, lang)}`,
    },
    {
      value: `+${marmottaStats.additions}`,
      label: lang === "it" ? "Righe aggiunte" : "Lines added",
    },
    {
      value: `−${marmottaStats.deletions}`,
      label: lang === "it" ? "Righe rimosse" : "Lines removed",
    },
    {
      value: String(marmottaStats.contributions),
      label: lang === "it" ? "Contributi merged" : "Merged contributions",
    },
  ];
}

export type ProjectCopy = {
  summary: string;
  tagline: string;
  sections: { title: string; body: string }[];
  result: string;
};

export type Project = {
  slug: string;
  name: Record<Lang, string>;
  year: string;
  kicker: Record<Lang, string>;
  statusKey: "shipped" | "contributed" | "live";
  client: Record<Lang, string>;
  role: Record<Lang, string>;
  stack: string[];
  evidence: Record<Lang, { value: string; label: string }[]>;
  highlight: Record<Lang, string>;
  repo?: string;
  live?: string;
  cover: "wave" | "zig" | "window";
  copy: Record<Lang, ProjectCopy>;
};

export const projects: Project[] = [
  {
    slug: "pipeduck",
    name: { en: "PipeDuck", it: "PipeDuck" },
    year: "2026",
    kicker: { en: "Flagship build", it: "Progetto principale" },
    statusKey: "shipped",
    client: { en: "Personal project", it: "Progetto personale" },
    role: { en: "Creator, everything", it: "Creatore, tutto" },
    stack: ["C++20", "PipeWire", "libpulse", "GTK4", "CMake", "GitHub Actions"],
    highlight: {
      en: `${pipeduckStats.testFunctions} test functions · ${pipeduckBuildJobs} build jobs · v${pipeduckRelease.version}`,
      it: `${pipeduckStats.testFunctions} funzioni di test · ${pipeduckBuildJobs} job di build · v${pipeduckRelease.version}`,
    },
    evidence: {
      en: [
        {
          value: `v${pipeduckRelease.version}`,
          label: `Release · ${formatMonth(pipeduckRelease.date, "en")}`,
        },
        {
          value: `${pipeduckStats.testFunctions}`,
          label: `Test functions · ${pipeduckStats.assertions} assertions`,
        },
        { value: `${pipeduckBuildJobs}`, label: "Build jobs · compiler × GUI matrix" },
        {
          value: `${pipeduckStats.trackedFiles}`,
          label: `Tracked files · ~${pipeduckStats.cppKb} KB of C++`,
        },
      ],
      it: [
        {
          value: `v${pipeduckRelease.version}`,
          label: `Release · ${formatMonth(pipeduckRelease.date, "it")}`,
        },
        {
          value: `${pipeduckStats.testFunctions}`,
          label: `Funzioni di test · ${pipeduckStats.assertions} asserzioni`,
        },
        { value: `${pipeduckBuildJobs}`, label: "Job di build · matrice compilatore × GUI" },
        {
          value: `${pipeduckStats.trackedFiles}`,
          label: `File tracciati · ~${pipeduckStats.cppKb} KB di C++`,
        },
      ],
    },
    repo: "https://github.com/ErRusso/pipeduck",
    cover: "wave",
    copy: {
      en: {
        summary:
          "A C++20 daemon that turns your music down when someone talks in a call — and fades it back properly.",
        tagline: `Automatic audio ducking for PipeWire. Born from a small annoyance, now at v${pipeduckRelease.version}.`,
        sections: [
          {
            title: "The opening",
            body: "Every call starts the same way: somebody speaks, the music is too loud, you fumble for the volume slider and miss the first sentence. Existing tools either duck too aggressively or snap back to full volume like nothing happened. I wanted one that behaves like a hand on a fader: down fast, back smoothly, and only when it matters.",
          },
          {
            title: "The middle game",
            body: "PipeDuck is a C++20 reimplementation of pw-duck with different priorities. It subscribes to libpulse once and reacts to stream events instead of polling pactl. Fades are smoothstep ramps driven by the control tick, so new speech interrupts a return fade immediately. Routing goes through a temporary virtual sink that is restored automatically — and if something fails, the sink stays alive instead of killing your application audio. On top of the daemon: a StatusNotifier tray with live status, a GTK4 tuner, a terminal tuner and a CLI.",
          },
          {
            title: "The endgame",
            body: `Version ${pipeduckRelease.version} is tagged, MIT-licensed, built by CI on every commit across gcc and clang with the GUI both on and off, and it has been running on my machine since before it had a name. The interesting part was never the DSP — it was making audio routing state safe to touch.`,
          },
        ],
        result: `${pipeduckRelease.version} shipped · MIT · ${pipeduckStats.testFunctions} test functions in CI`,
      },
      it: {
        summary:
          "Un daemon C++20 che abbassa la musica quando qualcuno parla in chiamata — e la riporta su come si deve.",
        tagline: `Ducking audio automatico per PipeWire. Nato da un fastidio, arrivato alla v${pipeduckRelease.version}.`,
        sections: [
          {
            title: "L’apertura",
            body: "Ogni chiamata inizia allo stesso modo: qualcuno parla, la musica è troppo alta, cerchi il cursore del volume e perdi la prima frase. Gli strumenti esistenti abbassano troppo o tornano al massimo come se niente fosse. Volevo qualcosa che si comportasse come una mano sul fader: giù veloce, su morbido, e solo quando serve.",
          },
          {
            title: "La partita di mezzo",
            body: "PipeDuck è una riscrittura in C++20 di pw-duck con priorità diverse. Si iscrive a libpulse una volta sola e reagisce agli eventi degli stream invece di fare polling su pactl. Le dissolvenze sono rampe smoothstep guidate dal tick di controllo, così una nuova voce interrompe subito il ritorno. Il routing passa da un sink virtuale temporaneo ripristinato in automatico — e se qualcosa fallisce il sink resta vivo invece di uccidere l’audio delle applicazioni. Sopra il daemon: tray StatusNotifier con stato live, tuner GTK4, tuner da terminale e CLI.",
          },
          {
            title: "Il finale",
            body: `La ${pipeduckRelease.version} è taggata, licenza MIT, compilata dalla CI a ogni commit su gcc e clang con la GUI attiva e disattivata, e gira sulla mia macchina da prima che avesse un nome. La parte interessante non è mai stato il DSP: era rendere sicuro toccare lo stato del routing audio.`,
          },
        ],
        result: `${pipeduckRelease.version} rilasciata · MIT · ${pipeduckStats.testFunctions} funzioni di test in CI`,
      },
    },
  },
  {
    slug: "marmotta",
    name: { en: "Marmotta", it: "Marmotta" },
    year: "2026",
    kicker: { en: "Open source contribution", it: "Contributo open source" },
    statusKey: "contributed",
    client: { en: "napi-bindings (open source)", it: "napi-bindings (open source)" },
    role: { en: "Contributor", it: "Contributor" },
    stack: ["TypeScript", "Zig", "Node-API", "node:test"],
    highlight: {
      en: `Marmotta · ${marmottaDiff} lines`,
      it: `Marmotta · ${marmottaDiff} righe`,
    },
    evidence: {
      en: marmottaEvidence("en"),
      it: marmottaEvidence("it"),
    },
    repo: "https://github.com/napi-bindings/marmotta",
    cover: "zig",
    copy: {
      en: {
        summary:
          "A Node.js native-addon build tool that compiles C/C++ with Zig. I contribute upstream to the toolchain and build reliability.",
        tagline: "Ongoing upstream work on a build tool that runs on machines I will never see.",
        sections: [
          {
            title: "The project",
            body: "Marmotta builds Node-API addons in C and C++ using Zig, and manages the compiler toolchain for the user. It is infrastructure: invisible when it works, blocking everything when it does not.",
          },
          {
            title: "The problem space",
            body: "Builds have to survive corporate proxies, restricted filesystems, different operating systems and evolving compiler versions. Toolchain discovery, cache isolation and clear diagnostics matter more than the happy path.",
          },
          {
            title: "The collaboration",
            body: "Work happens upstream, in small reviewed changes. The focus is build reliability, clearer failures and regression coverage, so the tool keeps working on machines beyond this one.",
          },
        ],
        result: "Ongoing upstream contribution · cumulative diff",
      },
      it: {
        summary:
          "Un tool di build per addon nativi Node.js che compila C/C++ con Zig. Contribuisco upstream alla toolchain e all’affidabilità della build.",
        tagline: "Lavoro upstream continuo su un tool che gira su macchine che non vedrò mai.",
        sections: [
          {
            title: "Il progetto",
            body: "Marmotta compila addon Node-API in C e C++ usando Zig e gestisce la toolchain del compilatore per l’utente. È infrastruttura: invisibile quando funziona, bloccante quando non funziona.",
          },
          {
            title: "Lo spazio del problema",
            body: "Le build devono sopravvivere a proxy aziendali, filesystem limitati, sistemi operativi diversi e versioni del compilatore in evoluzione. Scoperta della toolchain, isolamento della cache e diagnostica chiara contano più del caso felice.",
          },
          {
            title: "La collaborazione",
            body: "Il lavoro passa upstream, in modifiche piccole e riviste. Il focus è l’affidabilità della build, errori più chiari e copertura di regressione, così il tool continua a funzionare su macchine oltre questa.",
          },
        ],
        result: "Contributo upstream continuo · diff cumulativo",
      },
    },
  },
  {
    slug: "this-website",
    name: { en: "This website", it: "Questo sito" },
    year: "2026",
    kicker: { en: "Meta project", it: "Progetto meta" },
    statusKey: "live",
    client: { en: "Myself", it: "Me stesso" },
    role: { en: "Design and build", it: "Design e sviluppo" },
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "GitHub Pages"],
    highlight: {
      en: `${siteStats.mobile.performance} Lighthouse mobile · ${siteStats.mobile.transferredKb} KB transferred`,
      it: `${siteStats.mobile.performance} Lighthouse mobile · ${siteStats.mobile.transferredKb} KB trasferiti`,
    },
    evidence: {
      en: [
        {
          value: `${siteStats.mobile.performance}`,
          label: "Lighthouse performance · mobile",
        },
        {
          value: `${siteStats.mobile.accessibility}/${siteStats.mobile.bestPractices}/${siteStats.mobile.seo}`,
          label: "Accessibility · best practices · SEO",
        },
        {
          value: `${siteStats.mobile.transferredKb} KB`,
          label: `Transferred on mobile · CLS ${siteStats.mobile.cls}`,
        },
        {
          value: `${audit.vulnerabilities}`,
          label: `Known vulnerabilities · ${audit.packages} packages`,
        },
      ],
      it: [
        {
          value: `${siteStats.mobile.performance}`,
          label: "Performance Lighthouse · mobile",
        },
        {
          value: `${siteStats.mobile.accessibility}/${siteStats.mobile.bestPractices}/${siteStats.mobile.seo}`,
          label: "Accessibilità · best practice · SEO",
        },
        {
          value: `${siteStats.mobile.transferredKb} KB`,
          label: `Trasferiti su mobile · CLS ${siteStats.mobile.cls}`,
        },
        {
          value: `${audit.vulnerabilities}`,
          label: `Vulnerabilità note · ${audit.packages} pacchetti`,
        },
      ],
    },
    cover: "window",
    copy: {
      en: {
        summary:
          "No template, no CMS, no 2MB of JavaScript. Brutalist on purpose, static by design.",
        tagline: "The portfolio you are reading. Built the way I would build a client’s.",
        sections: [
          {
            title: "The opening",
            body: "Most developer portfolios are a template with a photo on top. I wanted mine to be recognisable in three seconds and fast enough to prove a point: the site itself is the first deliverable.",
          },
          {
            title: "The middle game",
            body: "Next.js with static export, TypeScript, Tailwind and self-hosted typefaces. Two languages with proper hreflang, generated metadata, no contact form for spammers, no database to maintain. Everything interactive is a few kilobytes of client code: a marquee, a clock, a copy button and a piano hidden in the footer.",
          },
          {
            title: "The endgame",
            body: `Deployed to GitHub Pages from a single workflow. Lighthouse ${siteStats.lighthouseVersion} on the production build, ${formatLongDate(siteStats.date, "en")}: ${siteStats.mobile.performance} on mobile and ${siteStats.desktop.performance} on desktop, ${siteStats.mobile.transferredKb} KB transferred, LCP ${decimal(siteStats.mobile.lcpSeconds, "en")}s on mobile and ${siteStats.mobile.cls === 0 ? "zero layout shift" : `CLS ${siteStats.mobile.cls}`}.`,
          },
        ],
        result: `${siteStats.mobile.performance}/100 mobile · ${siteStats.desktop.performance}/100 desktop · CLS ${siteStats.mobile.cls}`,
      },
      it: {
        summary:
          "Nessun template, nessun CMS, niente 2MB di JavaScript. Brutalist per scelta, statico per design.",
        tagline: "Il portfolio che stai leggendo. Costruito come costruirei quello di un cliente.",
        sections: [
          {
            title: "L’apertura",
            body: "La maggior parte dei portfolio da developer è un template con una foto sopra. Volevo che il mio fosse riconoscibile in tre secondi e abbastanza veloce da dimostrare un punto: il sito stesso è il primo deliverable.",
          },
          {
            title: "La partita di mezzo",
            body: "Next.js con export statico, TypeScript, Tailwind e caratteri self-hosted. Due lingue con hreflang corretto, metadata generati, nessun form per gli spammer, nessun database da mantenere. Tutto ciò che è interattivo sono pochi kilobyte di codice client: un marquee, un orologio, un pulsante copia e un pianoforte nascosto nel footer.",
          },
          {
            title: "Il finale",
            body: `Deploy su GitHub Pages da un unico workflow. Lighthouse ${siteStats.lighthouseVersion} sulla build di produzione, ${formatLongDate(siteStats.date, "it")}: ${siteStats.mobile.performance} su mobile e ${siteStats.desktop.performance} su desktop, ${siteStats.mobile.transferredKb} KB trasferiti, LCP ${decimal(siteStats.mobile.lcpSeconds, "it")}s su mobile e ${siteStats.mobile.cls === 0 ? "zero layout shift" : `CLS ${siteStats.mobile.cls}`}.`,
          },
        ],
        result: `${siteStats.mobile.performance}/100 mobile · ${siteStats.desktop.performance}/100 desktop · CLS ${siteStats.mobile.cls}`,
      },
    },
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getNextProject(slug: string): Project {
  const index = projects.findIndex((project) => project.slug === slug);
  return projects[(index + 1) % projects.length];
}
