import type { Lang } from "@/lib/i18n";

export type LabCopy = {
  meta: { title: string; description: string };
  kicker: string;
  title: string;
  intro: string;
  chips: string[];
  warning: string;
  scope: { title: string; intro: string; items: string[] };
  setup: { title: string; intro: string; code: string; note: string };
  bug: { title: string; intro: string; code: string; caption: string };
  reproduction: {
    title: string;
    intro: string;
    steps: { label: string; code: string }[];
    output: string;
    note: string;
  };
  impact: { title: string; intro: string; items: string[] };
  rootCause: { title: string; intro: string; body: string };
  fix: { title: string; intro: string; code: string; body: string };
  test: { title: string; intro: string; code: string; output: string; note: string };
  lessons: { title: string; items: string[] };
  limits: { title: string; body: string };
  links: { title: string; items: { label: string; href: string; note: string }[] };
  back: string;
};

const reproductionOutput = `{"user":{"id":1,"username":"alice"}}
{"id":2,"ownerId":2,"customer":"Bob Srl","amount":5400,"currency":"EUR"}`;

const testOutput = `[vulnerable] alice -> invoice #2: 200 (Bob Srl)
[fixed] alice -> invoice #2: 404
[fixed] alice -> invoice #1: 200
[fixed] anonymous -> invoice #1: 401
[fixed] bob -> invoice #2: 200
PASS: 9 assertions`;

export const lab: Record<Lang, LabCopy> = {
  en: {
    meta: {
      title: "Training lab: BOLA/IDOR in an invoicing API — Simone Russo",
      description:
        "A reproducible, deliberately vulnerable local API: object-level authorization missing, impact, fix and regression test. Training lab, not a real-world finding.",
    },
    kicker: "Security / training lab",
    title: "One authenticated user. Another tenant's invoice.",
    intro:
      "A deliberately vulnerable local API, built to show the full loop: reproduce, explain the impact, fix, and prove the fix with a regression test.",
    chips: ["Local only", "Synthetic data", "CWE-639", "OWASP API1:2023"],
    warning: "Training exercise. I built it, so the exploit is authorized. Do not deploy this build. No client system, no real data.",
    scope: {
      title: "Scope and authorization",
      intro:
        "A local training app with synthetic users and invoices. I built it to practise object-level authorization. It is not a client system and not a real-world finding.",
      items: [
        "Binds to 127.0.0.1; no external target",
        "Synthetic users, invoices and sessions",
        "Authentication is in scope; object-level authorization is the bug",
        "The source is public so the reproduction can be checked",
      ],
    },
    setup: {
      title: "Run it",
      intro: "Clone the repository and start the vulnerable build. No dependencies: Node 18+ is enough.",
      code: `git clone https://github.com/ErRusso/errusso.github.io.git
cd errusso.github.io
node labs/idor/vulnerable.mjs`,
      note: "The server prints a loopback URL. Leave it running in one terminal and use a second terminal for the requests.",
    },
    bug: {
      title: "The missing check",
      intro:
        "The route authenticates the session, finds the invoice, and returns it. It never compares the invoice owner with the session user.",
      code: `const invoice = INVOICES.find((item) => item.id === Number(match[1]));

if (!invoice) return sendJson(response, 404, { error: "not found" });

// No owner check: any authenticated session can read this object.
return sendJson(response, 200, invoice);`,
      caption: "Authentication is enforced earlier in the request. Authorization for this object is not.",
    },
    reproduction: {
      title: "Reproduce it",
      intro: "Log in as Alice (user 1), then request invoice 2, which belongs to Bob (user 2).",
      steps: [
        {
          label: "Log in as Alice",
          code: `curl -s -c /tmp/idor.cookie \\
  -d 'username=alice&password=alice' \\
  http://127.0.0.1:8787/login`,
        },
        {
          label: "Read Bob's invoice",
          code: `curl -s -b /tmp/idor.cookie \\
  http://127.0.0.1:8787/api/invoices/2`,
        },
      ],
      output: reproductionOutput,
      note: "Alice is authenticated as user 1. The response is user 2's invoice. No secret was guessed: the object id is sequential.",
    },
    impact: {
      title: "Impact",
      intro:
        "Horizontal privilege escalation: any authenticated user can read another tenant's invoice by changing the id.",
      items: [
        "Confidentiality: customer name and amount exposed",
        "Predictable ids make enumeration trivial",
        "The UI never needs to show another tenant's data for the API to leak it",
        "A 403 would confirm existence; the fix returns 404",
      ],
    },
    rootCause: {
      title: "Root cause",
      intro: "Authentication is not authorization.",
      body: "The session proves who is calling. It does not prove that the caller may access this specific invoice. The check belongs in the data-access path, next to the lookup, not only in the UI or in a route guard that checks a role.",
    },
    fix: {
      title: "The fix",
      intro: "Compare the invoice owner with the authenticated user and return 404 on a mismatch.",
      code: `const invoice = INVOICES.find((item) => item.id === Number(match[1]));

if (!invoice || (enforceOwnership && invoice.ownerId !== session.userId)) {
  return sendJson(response, 404, { error: "not found" });
}

return sendJson(response, 200, invoice);`,
      body: "404 avoids telling an attacker whether another tenant's invoice exists. The fixed build keeps owner access and anonymous 401 behavior intact.",
    },
    test: {
      title: "Prove it",
      intro: "The test runs both builds: the vulnerable one must leak, the fixed one must not.",
      code: `node labs/idor/test.mjs`,
      output: testOutput,
      note: "The test asserts the vulnerable state too. A regression test that only checks the fixed state can pass for the wrong reason.",
    },
    lessons: {
      title: "What I would carry into a review",
      items: [
        "Find every object id in a route and ask who is allowed to use it.",
        "Test the negative case with a second tenant, not only the happy path.",
        "Return 404 when the object is outside the caller's scope; do not confirm existence.",
        "Put the check in the query or data-access layer so a new route cannot forget it.",
        "Keep a failing test for the vulnerable behavior and a passing test for the fix.",
      ],
    },
    limits: {
      title: "Scope and honesty",
      body: "This is a training lab, not a paid penetration test and not a real-world CVE. The app is deliberately vulnerable, runs only on loopback, and uses synthetic data. It demonstrates method and remediation, not production impact.",
    },
    links: {
      title: "References",
      items: [
        {
          label: "OWASP API Security Top 10 2023 — API1 BOLA",
          href: "https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization/",
          note: "The category this lab exercises.",
        },
        {
          label: "CWE-639: Authorization Bypass Through User-Controlled Key",
          href: "https://cwe.mitre.org/data/definitions/639.html",
          note: "The weakness class.",
        },
        {
          label: "Lab source",
          href: "https://github.com/ErRusso/errusso.github.io/tree/main/labs/idor",
          note: "Runnable code, README and test.",
        },
      ],
    },
    back: "Back to security notes",
  },
  it: {
    meta: {
      title: "Training lab: BOLA/IDOR in un'API di fatture — Simone Russo",
      description:
        "API locale deliberatamente vulnerabile e riproducibile: autorizzazione a livello di oggetto assente, impatto, fix e test di regressione. Training lab, non un finding reale.",
    },
    kicker: "Sicurezza / training lab",
    title: "Un utente autenticato. La fattura di un altro tenant.",
    intro:
      "Un'API locale deliberatamente vulnerabile, costruita per mostrare il ciclo completo: riproduzione, impatto, fix e prova del fix con un test di regressione.",
    chips: ["Solo locale", "Dati sintetici", "CWE-639", "OWASP API1:2023"],
    warning: "Esercizio di formazione. L'ho costruito io, quindi lo sfruttamento è autorizzato. Non distribuire questa build. Nessun sistema cliente, nessun dato reale.",
    scope: {
      title: "Perimetro e autorizzazione",
      intro:
        "Un'app di formazione locale con utenti e fatture sintetiche. L'ho costruita per esercitarmi sull'autorizzazione a livello di oggetto. Non è un sistema cliente né un finding reale.",
      items: [
        "Ascolta su 127.0.0.1; nessun target esterno",
        "Utenti, fatture e sessioni sintetici",
        "L'autenticazione è nel perimetro; il bug è l'autorizzazione sull'oggetto",
        "Il codice è pubblico, così la riproduzione è verificabile",
      ],
    },
    setup: {
      title: "Avvialo",
      intro: "Clona il repository e avvia la build vulnerabile. Nessuna dipendenza: basta Node 18+.",
      code: `git clone https://github.com/ErRusso/errusso.github.io.git
cd errusso.github.io
node labs/idor/vulnerable.mjs`,
      note: "Il server stampa un URL di loopback. Lascialo attivo in un terminale e usa un secondo terminale per le richieste.",
    },
    bug: {
      title: "Il controllo mancante",
      intro:
        "La route autentica la sessione, trova la fattura e la restituisce. Non confronta mai il proprietario della fattura con l'utente della sessione.",
      code: `const invoice = INVOICES.find((item) => item.id === Number(match[1]));

if (!invoice) return sendJson(response, 404, { error: "not found" });

// No owner check: any authenticated session can read this object.
return sendJson(response, 200, invoice);`,
      caption: "L'autenticazione è applicata prima nella richiesta. L'autorizzazione su questo oggetto no.",
    },
    reproduction: {
      title: "Riproducilo",
      intro: "Accedi come Alice (utente 1), poi richiedi la fattura 2, che appartiene a Bob (utente 2).",
      steps: [
        {
          label: "Accedi come Alice",
          code: `curl -s -c /tmp/idor.cookie \\
  -d 'username=alice&password=alice' \\
  http://127.0.0.1:8787/login`,
        },
        {
          label: "Leggi la fattura di Bob",
          code: `curl -s -b /tmp/idor.cookie \\
  http://127.0.0.1:8787/api/invoices/2`,
        },
      ],
      output: reproductionOutput,
      note: "Alice è autenticata come utente 1. La risposta è la fattura dell'utente 2. Nessun segreto è stato indovinato: l'id dell'oggetto è sequenziale.",
    },
    impact: {
      title: "Impatto",
      intro:
        "Privilege escalation orizzontale: qualsiasi utente autenticato può leggere la fattura di un altro tenant cambiando l'id.",
      items: [
        "Riservatezza: nome cliente e importo esposti",
        "Id prevedibili rendono l'enumerazione banale",
        "La UI non deve mostrare i dati di un altro tenant perché l'API li esponga",
        "Un 403 confermerebbe l'esistenza; il fix restituisce 404",
      ],
    },
    rootCause: {
      title: "Root cause",
      intro: "Autenticazione non è autorizzazione.",
      body: "La sessione dimostra chi sta chiamando. Non dimostra che chi chiama possa accedere a questa specifica fattura. Il controllo appartiene al percorso di accesso ai dati, accanto alla lookup, non solo alla UI o a una route guard che verifica un ruolo.",
    },
    fix: {
      title: "Il fix",
      intro: "Confronta il proprietario della fattura con l'utente autenticato e restituisci 404 se non coincidono.",
      code: `const invoice = INVOICES.find((item) => item.id === Number(match[1]));

if (!invoice || (enforceOwnership && invoice.ownerId !== session.userId)) {
  return sendJson(response, 404, { error: "not found" });
}

return sendJson(response, 200, invoice);`,
      body: "Il 404 evita di dire a un attaccante se la fattura di un altro tenant esiste. La build corretta mantiene l'accesso del proprietario e il 401 per gli anonimi.",
    },
    test: {
      title: "Dimostralo",
      intro: "Il test esegue entrambe le build: quella vulnerabile deve perdere dati, quella corretta no.",
      code: `node labs/idor/test.mjs`,
      output: testOutput,
      note: "Il test verifica anche lo stato vulnerabile. Un test di regressione che controlla solo il fix può passare per il motivo sbagliato.",
    },
    lessons: {
      title: "Cosa porterei in una review",
      items: [
        "Trova ogni object id in una route e chiediti chi può usarlo.",
        "Testa il caso negativo con un secondo tenant, non solo l'happy path.",
        "Restituisci 404 quando l'oggetto è fuori dal perimetro del chiamante; non confermarne l'esistenza.",
        "Metti il controllo nella query o nel data-access, così una nuova route non può dimenticarlo.",
        "Mantieni un test che fallisce sul comportamento vulnerabile e uno che passa sul fix.",
      ],
    },
    limits: {
      title: "Perimetro e onestà",
      body: "Questo è un training lab, non un penetration test retribuito e non un CVE reale. L'app è deliberatamente vulnerabile, ascolta solo su loopback e usa dati sintetici. Dimostra metodo e remediation, non impatto in produzione.",
    },
    links: {
      title: "Riferimenti",
      items: [
        {
          label: "OWASP API Security Top 10 2023 — API1 BOLA",
          href: "https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization/",
          note: "La categoria esercitata dal lab.",
        },
        {
          label: "CWE-639: Authorization Bypass Through User-Controlled Key",
          href: "https://cwe.mitre.org/data/definitions/639.html",
          note: "La classe di debolezza.",
        },
        {
          label: "Sorgenti del lab",
          href: "https://github.com/ErRusso/errusso.github.io/tree/main/labs/idor",
          note: "Codice eseguibile, README e test.",
        },
      ],
    },
    back: "Torna alle note di sicurezza",
  },
};
