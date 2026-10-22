import type { Lang } from "@/lib/i18n";

export type SecurityRow = {
  surface: string;
  threat: string;
  status: "verified" | "open";
  evidence: string;
};

export type SecurityCopy = {
  meta: { title: string; description: string };
  kicker: string;
  title: string;
  intro: string;
  legend: { tested: string; hardened: string; learning: string };
  tested: { title: string; intro: string; items: string[] };
  hardened: { title: string; intro: string; items: string[] };
  learning: { title: string; intro: string; items: string[] };
  lab: { kicker: string; title: string; body: string; cta: string; note: string };
  model: { title: string; intro: string; columns: { surface: string; threat: string; status: string; evidence: string }; rows: SecurityRow[] };
  status: { verified: string; open: string };
  checks: { title: string; intro: string; items: { command: string; output: string }[] };
  limits: { title: string; body: string };
  back: string;
};

export const security: Record<Lang, SecurityCopy> = {
  en: {
    meta: {
      title: "Security notes — tested, hardened, learning",
      description:
        "An honest security page: reproducible checks on this site and PipeDuck, one public training lab, a short threat model, and a clear line between what is tested, hardened and still being learned.",
    },
    kicker: "Security notes",
    title: "What I can prove",
    intro:
      "Security is the easiest thing to claim and the hardest to demonstrate. So this page lists what I actually tested, what I hardened, and what I am still learning — with the commands to check it yourself.",
    legend: { tested: "Tested", hardened: "Hardened", learning: "Learning" },
    tested: {
      title: "Tested",
      intro: "Checks I can reproduce on systems I am allowed to touch.",
      items: [
        "This site is a static export: no server code, no database, no forms, no cookies. There is no session or injection surface to speak of.",
        "Dependencies: bun audit reports 0 known vulnerabilities across 103 packages.",
        "No third-party scripts or CDNs. Fonts are self-hosted, there is no analytics and no external font API.",
        "Every external link opens with rel=\"noreferrer\".",
        "No secrets tracked: .env* is ignored and the repository contains no keys.",
        "PipeDuck config parser: malformed lines are rejected with the line number, and numeric thresholds are clamped instead of trusted.",
      ],
    },
    hardened: {
      title: "Hardened",
      intro: "The defaults around the code, not just the code.",
      items: [
        "main is protected: every change requires review and the required checks, enforced for the owner too.",
        "Two required checks: build, plus a policy check that every change closes a real issue.",
        "The Actions token is read-only by default; only the deploy job gets pages: write.",
        "No collaborators and no pending invitations. Force-push and branch deletion are blocked.",
        "Linear history only: squash or rebase, no merge commits.",
      ],
    },
    learning: {
      title: "Learning",
      intro: "Stated plainly, because pretending otherwise would be a lie.",
      items: [
        "CTFs: ongoing practice. One public training lab below; more write-ups to come.",
        "Bug bounty: just started. No accepted reports yet.",
        "No security certifications. I do not sell penetration tests.",
        "Training lab: BOLA/IDOR in a local invoicing API — reproduce, impact, fix and regression test.",
      ],
    },
    lab: {
      kicker: "Public proof / training lab",
      title: "BOLA/IDOR in an invoicing API",
      body: "Authentication works; object-level authorization does not. A local, synthetic API reproduces another tenant's invoice, then fixes it and proves both states with a regression test. Deliberately vulnerable, loopback only, not a client engagement.",
      cta: "Read the lab",
      note: "Training exercise, not a real-world CVE.",
    },
    model: {
      title: "Threat model",
      intro: "What could go wrong in the two things I maintain, and the current status of each mitigation.",
      columns: { surface: "Surface", threat: "Threat", status: "Status", evidence: "Mitigation" },
      rows: [
        {
          surface: "This site",
          threat: "Defacement through the repository",
          status: "verified",
          evidence: "Protected main, required checks, read-only token, no collaborators.",
        },
        {
          surface: "This site",
          threat: "Third-party code injected at build time",
          status: "verified",
          evidence: "Lockfile-pinned dependencies, zero known vulnerabilities, no external scripts.",
        },
        {
          surface: "This site",
          threat: "Missing browser security headers",
          status: "open",
          evidence:
            "GitHub Pages does not allow custom headers: no CSP, no X-Frame-Options. On a custom host I would set them.",
        },
        {
          surface: "PipeDuck",
          threat: "Malformed or hostile values in the config file",
          status: "verified",
          evidence:
            "The parser rejects bad lines with line numbers and clamps percentages and thresholds; covered by config tests.",
        },
        {
          surface: "PipeDuck",
          threat: "Audio lost when ducking stops or the sink fails",
          status: "verified",
          evidence: "The virtual sink has an abandon path as a fallback, and restore failures are tested.",
        },
        {
          surface: "PipeDuck",
          threat: "Tray and D-Bus surface",
          status: "open",
          evidence: "Not threat-modeled yet. Next item on the list.",
        },
      ],
    },
    status: { verified: "Verified", open: "Open" },
    checks: {
      title: "Check it yourself",
      intro: "The same three commands I ran, with the output I got.",
      items: [
        { command: "bun audit", output: "No vulnerabilities found (checked 103 packages)" },
        {
          command: "curl -sI https://errusso.github.io",
          output: "strict-transport-security present · no content-security-policy (GitHub Pages)",
        },
        { command: "git ls-files | grep -i env", output: "(no output — no environment files tracked)" },
      ],
    },
    limits: {
      title: "What this page is not",
      body: "It is not a pentest portfolio. I have not been paid to break into anyone's system, and I will not claim I have. The lab is a deliberately vulnerable local exercise, not a client finding. Everything above is either verifiable in this repository or explicitly marked as learning.",
    },
    back: "Back to the homepage",
  },
  it: {
    meta: {
      title: "Note di sicurezza — testato e in apprendimento",
      description:
        "Una pagina onesta sulla sicurezza: verifiche riproducibili su questo sito e su PipeDuck, un training lab pubblico, un threat model breve e un confine chiaro tra testato, rafforzato e in apprendimento.",
    },
    kicker: "Note di sicurezza",
    title: "Cosa posso dimostrare",
    intro:
      "La sicurezza è la cosa più facile da dichiarare e la più difficile da dimostrare. Qui c’è quello che ho testato davvero, quello che ho rafforzato e quello che sto ancora imparando — con i comandi per verificarlo.",
    legend: { tested: "Testato", hardened: "Rafforzato", learning: "In apprendimento" },
    tested: {
      title: "Testato",
      intro: "Verifiche riproducibili su sistemi che posso toccare.",
      items: [
        "Questo sito è un export statico: nessun codice server, nessun database, nessun form, nessun cookie. Non c’è superficie di sessione o di injection.",
        "Dipendenze: bun audit riporta 0 vulnerabilità note su 103 pacchetti.",
        "Nessuno script o CDN di terze parti. Font self-hosted, nessuna analytics, nessuna API esterna per i font.",
        "Ogni link esterno si apre con rel=\"noreferrer\".",
        "Nessun segreto nel repository: i file .env* sono ignorati e non ci sono chiavi.",
        "Parser della configurazione di PipeDuck: le righe malformate vengono rifiutate con il numero di riga e le soglie numeriche vengono limitate, non prese per buone.",
      ],
    },
    hardened: {
      title: "Rafforzato",
      intro: "Le impostazioni intorno al codice, non solo il codice.",
      items: [
        "main è protetto: ogni modifica richiede review e i check obbligatori, anche per il proprietario.",
        "Due check obbligatori: build e una verifica che ogni modifica chiuda una issue reale.",
        "Il token delle Actions è read-only per default; solo il job di deploy ha pages: write.",
        "Nessun collaboratore e nessun invito pendente. Force-push e cancellazione del branch sono bloccati.",
        "Solo storia lineare: squash o rebase, niente merge commit.",
      ],
    },
    learning: {
      title: "In apprendimento",
      intro: "Detto chiaramente, perché fingere il contrario sarebbe una bugia.",
      items: [
        "CTF: pratica continua. Un training lab pubblico qui sotto; altri write-up in arrivo.",
        "Bug bounty: appena iniziato. Nessun report accettato.",
        "Nessuna certificazione di sicurezza. Non vendo penetration test.",
        "Training lab: BOLA/IDOR in un'API locale di fatture — riproduzione, impatto, fix e test di regressione.",
      ],
    },
    lab: {
      kicker: "Prova pubblica / training lab",
      title: "BOLA/IDOR in un'API di fatture",
      body: "L'autenticazione funziona; l'autorizzazione a livello di oggetto no. Un'API locale e sintetica riproduce la fattura di un altro tenant, poi la corregge e dimostra entrambi gli stati con un test di regressione. Deliberatamente vulnerabile, solo loopback, non un incarico per un cliente.",
      cta: "Leggi il lab",
      note: "Esercizio di formazione, non un CVE reale.",
    },
    model: {
      title: "Modello di minaccia",
      intro: "Cosa può andare storto nelle due cose che mantengo, e lo stato attuale di ogni mitigazione.",
      columns: { surface: "Superficie", threat: "Minaccia", status: "Stato", evidence: "Mitigazione" },
      rows: [
        {
          surface: "Questo sito",
          threat: "Defacement attraverso il repository",
          status: "verified",
          evidence: "main protetto, check obbligatori, token read-only, nessun collaboratore.",
        },
        {
          surface: "Questo sito",
          threat: "Codice di terze parti iniettato in build",
          status: "verified",
          evidence: "Dipendenze bloccate dal lockfile, zero vulnerabilità note, nessuno script esterno.",
        },
        {
          surface: "Questo sito",
          threat: "Header di sicurezza del browser assenti",
          status: "open",
          evidence:
            "GitHub Pages non permette header personalizzati: niente CSP, niente X-Frame-Options. Su un host custom li imposterei.",
        },
        {
          surface: "PipeDuck",
          threat: "Valori malformati o ostili nel file di configurazione",
          status: "verified",
          evidence:
            "Il parser rifiuta le righe errate con il numero di riga e limita percentuali e soglie; coperto dai test di configurazione.",
        },
        {
          surface: "PipeDuck",
          threat: "Audio perso quando il ducking si ferma o il sink fallisce",
          status: "verified",
          evidence: "Il sink virtuale ha un percorso di abbandono come fallback e i fallimenti di ripristino sono testati.",
        },
        {
          surface: "PipeDuck",
          threat: "Superficie tray e D-Bus",
          status: "open",
          evidence: "Non ancora modellata. È il prossimo punto.",
        },
      ],
    },
    status: { verified: "Verificato", open: "Aperto" },
    checks: {
      title: "Verificalo tu",
      intro: "Gli stessi tre comandi che ho eseguito, con l’output ottenuto.",
      items: [
        { command: "bun audit", output: "No vulnerabilities found (checked 103 packages)" },
        {
          command: "curl -sI https://errusso.github.io",
          output: "strict-transport-security presente · content-security-policy assente (GitHub Pages)",
        },
        { command: "git ls-files | grep -i env", output: "(nessun output — nessun file di ambiente tracciato)" },
      ],
    },
    limits: {
      title: "Cosa non è questa pagina",
      body: "Non è un portfolio da penetration tester. Non sono stato pagato per entrare nel sistema di qualcuno e non lo dirò mai. Il lab è un esercizio locale deliberatamente vulnerabile, non un finding su un cliente. Tutto ciò che c’è sopra o è verificabile in questo repository o è dichiarato esplicitamente come in apprendimento.",
    },
    back: "Torna alla homepage",
  },
};
