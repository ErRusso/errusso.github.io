import type { Lang } from "@/lib/i18n";

const year = new Intl.DateTimeFormat("en", {
  year: "numeric",
  timeZone: "Europe/Rome",
}).format(new Date());

export type LoadoutItem = { key: string; value: string };

export type ServiceItem = {
  id: string;
  title: string;
  body: string;
  bullets: string[];
};

export type Copy = {
  meta: { title: string; description: string };
  nav: { work: string; services: string; about: string; cv: string; photos: string; security: string; contact: string; skip: string; menu: string };
  hero: {
    badge: string;
    line1: string;
    line2a: string;
    accent: string;
    line2b: string;
    sub: string;
    location: string;
    workCta: string;
    emailCta: string;
    proof: {
      label: string;
      updated: string;
      tabs: { build: string; test: string; audit: string };
      build: { unit: string; detail: string };
      test: { unit: string; detail: string };
      audit: { unit: string; detail: string };
      linkCase: string;
      linkSecurity: string;
    };
  };
  marquee: string[];
  work: {
    number: string;
    title: string;
    intro: string;
    read: string;
    all: string;
    status: Record<string, string>;
  };
  services: {
    number: string;
    title: string;
    intro: string;
    items: ServiceItem[];
  };
  about: {
    number: string;
    title: string;
    intro: string;
    paragraphs: string[];
    quote: string;
    loadoutTitle: string;
    loadout: LoadoutItem[];
    portrait: { label: string; alt: string; sub: string };
  };
  contact: {
    number: string;
    title: string;
    intro: string;
    line: string;
    copy: string;
    copied: string;
    github: string;
    availability: string;
  };
  photography: {
    number: string;
    title: string;
    intro: string;
    handle: string;
    follow: string;
  };
  footer: {
    built: string;
    source: string;
    rights: string;
    top: string;
  };
  notFound: { code: string; title: string; line: string; cta: string };
  theme: { toggle: string };
  caseStudy: {
    back: string;
    overview: string;
    facts: { client: string; role: string; year: string; status: string };
    stack: string;
    result: string;
    repo: string;
    next: string;
    evidence: string;
  };
};

export const copy: Record<Lang, Copy> = {
  en: {
    meta: {
      title: "Simone Russo — Full-stack developer & application security",
      description:
        "Full-stack developer and application security. I build web products in TypeScript, Node and PostgreSQL — built to work, tested to break.",
    },
    nav: {
      work: "Work",
      services: "Services",
      about: "About",
      cv: "CV",
      photos: "Photos",
      security: "Security",
      contact: "Contact",
      skip: "Skip to content",
      menu: "Menu",
    },
    hero: {
      badge: "Available for new projects",
      line1: "Built to work.",
      line2a: "Tested to ",
      accent: "break",
      line2b: ".",
      sub: "Full-stack developer and application security. I take a product from an empty repository to production, then try to break it.",
      location: "Italy · remote",
      workCta: "See the work",
      emailCta: "Write me",
      proof: {
        label: "Live proof",
        updated: "Updated",
        tabs: { build: "Build", test: "Test", audit: "Audit" },
        build: {
          unit: "CI build jobs",
          detail: "PipeDuck {version}, {files} tracked files, ~{kb} KB C++.",
        },
        test: {
          unit: "assertions",
          detail: "{tests} test functions, run on every push.",
        },
        audit: {
          unit: "known vulnerabilities",
          detail: "{packages} packages audited with bun audit.",
        },
        linkCase: "Read the case study",
        linkSecurity: "See the security notes",
      },
    },
    marquee: [
      "TypeScript",
      "Next.js",
      "React",
      "Node.js",
      "PostgreSQL",
      "Docker",
      "Linux",
      "C++20",
      "PipeWire",
      "CTF",
      "Zig",
      "OWASP Top 10",
    ],
    work: {
      number: "01",
      title: "Selected work",
      intro:
        "Three shipped projects. Schemas, APIs, CI and the security review behind them.",
      read: "Read the case study",
      all: "Everything else lives on GitHub",
      status: { shipped: "Shipped", contributed: "Contributed", live: "Live" },
    },
    services: {
      number: "02",
      title: "What I build",
      intro:
        "Three ways I work: build the product, review the code, rescue the project that stalled. Every engagement starts with a written scope.",
      items: [
        {
          id: "S.01",
          title: "Product build",
          body: "From an empty repository to something real users can break. I handle the schema, the API and the interface, and I stay for the boring part: maintenance.",
          bullets: [
            "MVPs in weeks, not quarters",
            "TypeScript, Next.js, Node, PostgreSQL",
            "Handover-friendly code, documented decisions",
          ],
        },
        {
          id: "S.02",
          title: "Secure review",
          body: "I read your code like an attacker and hand you a list of what to fix first. Offensive mindset, defensive delivery.",
          bullets: [
            "OWASP Top 10 review",
            "Threat modeling and auth flows",
            "CTF player, starting bug bounty",
            "Written authorization and scope, always",
          ],
        },
        {
          id: "S.03",
          title: "Rescue",
          body: "For the project that was almost done eight months ago. I assess it, cut what is dead, and get it to production.",
          bullets: [
            "Codebase audit in days",
            "Refactor without a rewrite",
            "Deployment, CI and monitoring",
          ],
        },
      ],
    },
    about: {
      number: "03",
      title: "The player",
      intro: "The short version, no buzzwords.",
      paragraphs: [
        "I'm Simone, a full-stack developer in Italy. I build web products end to end: Next.js and TypeScript on the front end, Node and PostgreSQL on the back end, deployment and maintenance included. Most of my work starts as an empty repository.",
        "The parts I care about are the ones nobody demos: schemas that survive the second feature, auth that fails closed, error handling that doesn't wake anyone at 3 a.m. I play CTFs and I'm getting into bug bounty, because shipping software without knowing how it breaks is just guessing.",
        "I work alone or embedded in a team, and I write down the decisions that are expensive to undo.",
      ],
      quote: "I like software that's boring to maintain. That's the whole philosophy.",
      loadoutTitle: "Loadout",
      loadout: [
        { key: "Photography", value: "@erru.sso · light first" },
        { key: "Karting", value: "KZ 125 · K9C" },
        { key: "Piano", value: "Since secondary school" },
        { key: "Cinema", value: "Tarantino, chapter by chapter" },
        { key: "Now", value: "CTFs, bug bounty, PipeDuck" },
      ],
      portrait: {
        label: "Portrait",
        alt: "Portrait of Simone Russo, full-stack developer",
        sub: "Shot 04 · 2026",
      },
    },
    contact: {
      number: "05",
      title: "Contact",
      intro: "One email is enough to start.",
      line: "Got something to build, or something to break?",
      copy: "Copy email",
      copied: "Copied",
      github: "github.com/ErRusso",
      availability: "Available for new projects",
    },
    photography: {
      number: "04",
      title: "Off the clock",
      intro: "Two frames from @erru.sso. The rest of the roll is on Instagram.",
      handle: "@erru.sso",
      follow: "More on Instagram",
    },
    footer: {
      built: "Built with Next.js. The irony is intentional.",
      source: "Source",
      rights: `© ${year} Simone Russo`,
      top: "Back to top",
    },
    notFound: {
      code: "404",
      title: "This page does not compile.",
      line: "The link is broken, moved, or never existed. That is not a bug, it is a feature of the internet.",
      cta: "Back to the homepage",
    },
    theme: { toggle: "Toggle dark mode" },
    caseStudy: {
      back: "All work",
      overview: "Overview",
      facts: { client: "Client", role: "Role", year: "Year", status: "Status" },
      stack: "Stack",
      result: "Result",
      repo: "Repository",
      next: "Next project",
      evidence: "Proof",
    },
  },
  it: {
    meta: {
      title: "Simone Russo — Sviluppatore full-stack e application security",
      description:
        "Sviluppatore full-stack e application security. Prodotti web in TypeScript, Node e PostgreSQL: costruiti per funzionare, testati per rompersi.",
    },
    nav: {
      work: "Lavori",
      services: "Servizi",
      about: "Chi sono",
      cv: "CV",
      photos: "Foto",
      security: "Sicurezza",
      contact: "Contatti",
      skip: "Vai al contenuto",
      menu: "Menu",
    },
    hero: {
      badge: "Disponibile per nuovi progetti",
      line1: "Costruito per funzionare.",
      line2a: "Testato per ",
      accent: "rompersi",
      line2b: ".",
      sub: "Sviluppatore full-stack e application security. Porto un prodotto da un repository vuoto alla produzione, poi provo a romperlo.",
      location: "Italia · remoto",
      workCta: "Guarda i lavori",
      emailCta: "Scrivimi",
      proof: {
        label: "Prove live",
        updated: "Aggiornato",
        tabs: { build: "Build", test: "Test", audit: "Audit" },
        build: {
          unit: "job di build CI",
          detail: "PipeDuck {version}, {files} file tracciati, ~{kb} KB di C++.",
        },
        test: {
          unit: "asserzioni",
          detail: "{tests} funzioni di test, eseguite a ogni push.",
        },
        audit: {
          unit: "vulnerabilità note",
          detail: "{packages} pacchetti verificati con bun audit.",
        },
        linkCase: "Leggi il case study",
        linkSecurity: "Vedi le note di sicurezza",
      },
    },
    marquee: [
      "TypeScript",
      "Next.js",
      "React",
      "Node.js",
      "PostgreSQL",
      "Docker",
      "Linux",
      "C++20",
      "PipeWire",
      "CTF",
      "Zig",
      "OWASP Top 10",
    ],
    work: {
      number: "01",
      title: "Lavori scelti",
      intro:
        "Tre progetti rilasciati. Schemi, API, CI e la revisione di sicurezza dietro ognuno.",
      read: "Leggi il case study",
      all: "Tutto il resto è su GitHub",
      status: { shipped: "Rilasciato", contributed: "Contributo", live: "Online" },
    },
    services: {
      number: "02",
      title: "Cosa costruisco",
      intro:
        "Tre modi di lavorare: costruire il prodotto, rivedere il codice, recuperare il progetto che si è fermato. Ogni collaborazione parte da uno scope scritto.",
      items: [
        {
          id: "S.01",
          title: "Sviluppo prodotto",
          body: "Da un repository vuoto a qualcosa che gli utenti veri possono rompere. Mi occupo dello schema, delle API e dell’interfaccia, e resto per la parte noiosa: la manutenzione.",
          bullets: [
            "MVP in settimane, non trimestri",
            "TypeScript, Next.js, Node, PostgreSQL",
            "Codice passabile di mano, decisioni documentate",
          ],
        },
        {
          id: "S.02",
          title: "Revisione di sicurezza",
          body: "Leggo il tuo codice come farebbe un attaccante e ti consegno una lista di priorità. Mente offensiva, consegna difensiva.",
          bullets: [
            "Revisione OWASP Top 10",
            "Threat modeling e flussi di autenticazione",
            "Giocatore CTF, agli inizi nel bug bounty",
            "Autorizzazione e scope scritti, sempre",
          ],
        },
        {
          id: "S.03",
          title: "Recupero progetti",
          body: "Per il progetto che era quasi finito otto mesi fa. Lo analizzo, taglio ciò che è morto e lo porto in produzione.",
          bullets: [
            "Audit del codice in pochi giorni",
            "Refactor senza riscrivere tutto",
            "Deploy, CI e monitoraggio",
          ],
        },
      ],
    },
    about: {
      number: "03",
      title: "Il giocatore",
      intro: "La versione breve, senza fuffa.",
      paragraphs: [
        "Sono Simone, sviluppatore full-stack in Italia. Costruisco prodotti web end-to-end: Next.js e TypeScript come frontend, Node e PostgreSQL come backend, deploy e manutenzione compresi. Quasi tutto quello che faccio parte da un repository vuoto.",
        "Le parti che mi interessano sono quelle che nessuno mette in una demo: schemi che reggono la seconda feature, autenticazione che fallisce dalla parte giusta, errori gestiti in modo che nessuno venga svegliato alle tre di notte. Gioco a CTF e sto iniziando con il bug bounty: consegnare software senza sapere come si rompe è tirare a indovinare.",
        "Lavoro da solo o dentro un team, e metto per iscritto le decisioni che poi costano care da cambiare.",
      ],
      quote: "Mi piace il software noioso da mantenere. È tutta la filosofia.",
      loadoutTitle: "Dotazione",
      loadout: [
        { key: "Fotografia", value: "@erru.sso · prima la luce" },
        { key: "Kart", value: "KZ 125 · K9C" },
        { key: "Pianoforte", value: "Dalla terza media" },
        { key: "Cinema", value: "Tarantino, capitolo per capitolo" },
        { key: "Ora", value: "CTF, bug bounty, PipeDuck" },
      ],
      portrait: {
        label: "Ritratto",
        alt: "Ritratto di Simone Russo, sviluppatore full-stack",
        sub: "Scatto 04 · 2026",
      },
    },
    contact: {
      number: "05",
      title: "Contatti",
      intro: "Basta una mail per iniziare.",
      line: "Hai qualcosa da costruire, o qualcosa da rompere?",
      copy: "Copia email",
      copied: "Copiata",
      github: "github.com/ErRusso",
      availability: "Disponibile per nuovi progetti",
    },
    photography: {
      number: "04",
      title: "Fuori orario",
      intro: "Due scatti da @erru.sso. Il resto del rullino è su Instagram.",
      handle: "@erru.sso",
      follow: "Altri scatti su Instagram",
    },
    footer: {
      built: "Fatto con Next.js. L’ironia è voluta.",
      source: "Sorgenti",
      rights: `© ${year} Simone Russo`,
      top: "Torna su",
    },
    notFound: {
      code: "404",
      title: "Questa pagina non compila.",
      line: "Il link è rotto, spostato o non è mai esistito. Non è un bug, è una feature di internet.",
      cta: "Torna alla homepage",
    },
    theme: { toggle: "Attiva o disattiva il tema scuro" },
    caseStudy: {
      back: "Tutti i lavori",
      overview: "Panoramica",
      facts: { client: "Cliente", role: "Ruolo", year: "Anno", status: "Stato" },
      stack: "Stack",
      result: "Risultato",
      repo: "Repository",
      next: "Prossimo progetto",
      evidence: "Prove",
    },
  },
};
