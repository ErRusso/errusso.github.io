import type { Lang } from "@/lib/i18n";

export type SimulatorCopy = {
  kicker: string;
  title: string;
  intro: string;
  identity: string;
  invoice: string;
  mode: string;
  modes: { vulnerable: string; fixed: string };
  send: string;
  attack: string;
  replay: string;
  anonymous: string;
  yours: string;
  skipped: string;
  rerunNote: string;
  request: string;
  response: string;
  trace: string;
  state: { idle: string; live: string; done: string };
  stages: { auth: string; route: string; lookup: string; owner: string };
  badges: { leak: string; own: string; denied: string; anon: string };
  traceLines: {
    authOk: string;
    authFail: string;
    route: string;
    lookup: string;
    ownerMissing: string;
    ownerDenied: string;
    ownerPass: string;
    leak: string;
    own: string;
    denied: string;
    anon: string;
  };
  captions: {
    idle: string;
    auth: string;
    route: string;
    lookup: string;
    ownerMissing: string;
    ownerDenied: string;
    ownerPass: string;
    leak: string;
    own: string;
    denied: string;
    anon: string;
  };
};

export type LabStep = {
  title: string;
  body: string;
  code: string;
  output: string;
};

export type LabCopy = {
  meta: { title: string; description: string };
  kicker: string;
  title: string;
  intro: string;
  chips: string[];
  warning: string;
  warningLabel: string;
  facts: { label: string; value: string }[];
  cta: { play: string; run: string };
  nav: { simulator: string; run: string; bug: string; test: string };
  onThisPage: string;
  simulationNote: string;
  simulator: SimulatorCopy;
  howto: {
    kicker: string;
    title: string;
    intro: string;
    terminal: string;
    output: string;
    copy: string;
    copied: string;
    steps: LabStep[];
    hint: string;
  };
  bug: {
    kicker: string;
    title: string;
    intro: string;
    vulnerableLabel: string;
    fixedLabel: string;
    vulnerableCode: string;
    fixedCode: string;
    caption: string;
  };
  impact: { kicker: string; title: string; intro: string; items: string[] };
  rootCause: {
    kicker: string;
    title: string;
    intro: string;
    body: string;
    checks: { label: string; title: string; body: string; result: string; state: "pass" | "fail" }[];
  };
  test: {
    kicker: string;
    title: string;
    intro: string;
    code: string;
    output: string;
    note: string;
    assertions: string[];
  };
  lessons: { kicker: string; title: string; intro: string; items: string[] };
  limits: { kicker: string; title: string; body: string };
  links: { kicker: string; title: string; items: { label: string; href: string; note: string }[] };
  back: string;
};

const testOutput = `[vulnerable] alice -> invoice #2: 200 (Bob Srl)
[fixed] alice -> invoice #2: 404
[fixed] alice -> invoice #1: 200
[fixed] anonymous -> invoice #1: 401
[fixed] bob -> invoice #2: 200
PASS: 9 assertions`;

const vulnerableCode = `const invoice = INVOICES.find((item) => item.id === Number(match[1]));

if (!invoice) return sendJson(response, 404, { error: "not found" });

// ! no owner check: any session can read this object
return sendJson(response, 200, invoice);`;

const fixedCode = `const invoice = INVOICES.find((item) => item.id === Number(match[1]));

if (!invoice) return sendJson(response, 404, { error: "not found" });

// + the check that was missing
if (invoice.ownerId !== session.userId) {
  return sendJson(response, 404, { error: "not found" });
}

return sendJson(response, 200, invoice);`;

export const lab: Record<Lang, LabCopy> = {
  en: {
    meta: {
      title: "Training lab: IDOR/BOLA in an invoicing API — Simone Russo",
      description:
        "Interactive training lab: watch a missing object-level authorization check leak another tenant's invoice, reproduce it locally, apply the fix and run the regression test.",
    },
    kicker: "Security / training lab",
    title: "Log in as Alice. Read Bob's invoice.",
    intro:
      "A tiny invoicing API that runs on your machine. Login works. Sessions work. The lookup works. The one missing piece is the check that decides whether this invoice is yours. Play it below, then reproduce it for real in two terminals.",
    chips: ["127.0.0.1 only", "Synthetic data", "CWE-639", "OWASP API1:2023"],
    warning:
      "This build is deliberately vulnerable. I wrote it, so breaking it here is the exercise — but keep it on loopback. Never deploy it and never point it at data you care about.",
    warningLabel: "Warning",
    facts: [
      { label: "Setup", value: "no dependencies" },
      { label: "Runtime", value: "Node 18+" },
      { label: "Port", value: "127.0.0.1:8787" },
      { label: "Time", value: "about 2 minutes" },
    ],
    cta: { play: "Play the request", run: "Run it locally" },
    nav: { simulator: "Simulator", run: "Run it", bug: "The bug", test: "The test" },
    onThisPage: "On this page",
    simulationNote:
      "Client-side simulation: it mirrors the logic in labs/idor/app.mjs and does not run the server.",
    simulator: {
      kicker: "Interactive explainer",
      title: "The check that isn't there",
      intro:
        "The same logic as the lab server, drawn as a request. Choose a session and an invoice, then send it. Flip the build to Fixed and send the exact same request.",
      identity: "Session",
      invoice: "Invoice",
      mode: "Build",
      modes: { vulnerable: "Vulnerable", fixed: "Fixed" },
      send: "Send request",
      attack: "Run the attack",
      replay: "Replay",
      anonymous: "Anonymous",
      yours: "yours",
      skipped: "skipped",
      rerunNote: "Once a request has run, changing any option replays it with the new configuration.",
      request: "Request",
      response: "Response",
      trace: "Server trace",
      state: { idle: "idle", live: "live", done: "done" },
      stages: { auth: "Session", route: "Handler", lookup: "Lookup", owner: "Owner" },
      badges: { leak: "Leaked", own: "Authorized", denied: "Hidden", anon: "Rejected" },
      traceLines: {
        authOk: "session {sid} → user {userId} ({name})",
        authFail: "no session cookie",
        route: "GET /api/invoices/{invoice} → handler",
        lookup: "invoice {invoice} found · ownerId {ownerId}",
        ownerMissing: "ownership check: not implemented",
        ownerDenied: "invoice.ownerId {ownerId} ≠ session.userId {userId} → deny",
        ownerPass: "invoice.ownerId {ownerId} = session.userId {userId} → allow",
        leak: "200 · returning invoice {invoice} to user {userId}",
        own: "200 · returning the caller's own invoice",
        denied: "404 · object outside the caller's scope",
        anon: "401 · authentication required",
      },
      captions: {
        idle: "Alice reading invoice 2 is already set up. Press “Send request” to walk the trace.",
        auth: "The cookie resolves to a user. Anonymous callers stop here.",
        route:
          "The handler reads the invoice id from the URL. Nothing in this step knows who owns the invoice.",
        lookup:
          "The invoice is loaded by id. Perfectly normal code — and exactly where the missing check belongs.",
        ownerMissing:
          "No comparison between invoice.ownerId and session.userId. The handler moves straight to the response, whatever the relationship.",
        ownerDenied:
          "The fixed build compares the owner with the session user and refuses to return the object.",
        ownerPass: "Owner and caller match. The invoice is legitimately returned.",
        leak: "Alice is authenticated. The response contains Bob's invoice. Authentication passed; authorization did not.",
        own: "The request is legitimate: the invoice belongs to the authenticated user.",
        denied:
          "Same request, fixed build: 404. The API does not confirm whether the object exists.",
        anon: "Without a session there is no user to authorize. The request ends with 401.",
      },
    },
    howto: {
      kicker: "Hands-on",
      title: "Two terminals, six steps",
      intro:
        "One terminal keeps the server alive; the other sends requests. Every command is copy-paste, and the data is fake. The whole loop takes about two minutes.",
      terminal: "Terminal",
      output: "Output",
      copy: "Copy",
      copied: "Copied",
      steps: [
        {
          title: "Get the code",
          body: "Clone the repository and enter it. There is no install step: the lab is plain Node with no dependencies.",
          code: `git clone https://github.com/ErRusso/errusso.github.io.git
cd errusso.github.io`,
          output: "",
        },
        {
          title: "Start the vulnerable build",
          body: "Leave this running in the first terminal. The server prints the loopback URL and never binds to a public interface.",
          code: `node labs/idor/vulnerable.mjs`,
          output: `VULNERABLE training API: http://127.0.0.1:8787
Synthetic data only. Loopback only. Do not deploy.`,
        },
        {
          title: "Log in as Alice",
          body: "The session cookie is written to /tmp/idor.cookie. Alice is user 1; her invoices are 1 and 3.",
          code: `curl -s -c /tmp/idor.cookie \\
  -d 'username=alice&password=alice' \\
  http://127.0.0.1:8787/login`,
          output: `{"user":{"id":1,"username":"alice"}}`,
        },
        {
          title: "Change the id",
          body: "You are still Alice. Invoice 2 belongs to Bob (user 2). The vulnerable build answers with 200 and the full invoice.",
          code: `curl -s -b /tmp/idor.cookie \\
  http://127.0.0.1:8787/api/invoices/2`,
          output: `{"id":2,"ownerId":2,"customer":"Bob Srl","amount":5400,"currency":"EUR"}`,
        },
        {
          title: "Swap in the fixed build",
          body: "Stop the server with Ctrl-C, start the fixed build, and repeat the same request with the same cookie. It returns 404: the object is hidden, not confirmed.",
          code: `node labs/idor/fixed.mjs
curl -s -o /dev/null -w '%{http_code}\\n' \\
  -b /tmp/idor.cookie \\
  http://127.0.0.1:8787/api/invoices/2`,
          output: `404`,
        },
        {
          title: "Run the regression test",
          body: "One command starts both builds and asserts the leak, the denial, owner access and anonymous 401 — in both directions.",
          code: `node labs/idor/test.mjs`,
          output: testOutput,
        },
      ],
      hint:
        "If curl returns nothing, the server is probably not running in the other terminal. The port is fixed at 8787; override it with PORT=8788 node labs/idor/vulnerable.mjs and change the URL to match.",
    },
    bug: {
      kicker: "The bug",
      title: "Authentication is not authorization.",
      intro:
        "The route proves that a session exists, parses the id, loads the invoice and sends it back. Every line is correct except the one that is absent: a comparison between the invoice owner and the session user.",
      vulnerableLabel: "Vulnerable build",
      fixedLabel: "Fixed build",
      vulnerableCode,
      fixedCode,
      caption:
        "The response is a valid 200 with a valid session. The caller simply has no relationship to the object. That is broken object-level authorization, or IDOR.",
    },
    impact: {
      kicker: "Impact",
      title: "One changed number",
      intro:
        "Horizontal privilege escalation: any authenticated user can read another tenant's invoice by walking a predictable id range.",
      items: [
        "Confidentiality: customer name and amount of another tenant.",
        "Enumeration: ids 1, 2, 3… are trivial to walk; the regression test does exactly that.",
        "A hidden UI is no defence: the API answers even when no screen links to the object.",
        "Silent by design: the vulnerable build logs a successful request, not an attack.",
      ],
    },
    rootCause: {
      kicker: "Root cause",
      title: "Where the check belongs",
      intro: "Login answers who is calling. It cannot answer what they may read.",
      body:
        "The ownership check belongs next to the lookup, in the data-access path, so every route that fetches an invoice inherits it. A UI guard or a role check farther upstream does not know that invoice 2 belongs to user 2.",
      checks: [
        {
          label: "01",
          title: "Authentication",
          body: "Is there a valid session?",
          result: "Yes — user 1 (alice)",
          state: "pass",
        },
        {
          label: "02",
          title: "Authorization",
          body: "May user 1 read invoice 2?",
          result: "Never asked",
          state: "fail",
        },
      ],
    },
    test: {
      kicker: "Proof",
      title: "Make the fix fail loudly",
      intro:
        "The regression test starts both builds and asserts five behaviours: the leak, the denial, and the three things the fix must not break.",
      code: `node labs/idor/test.mjs`,
      output: testOutput,
      note:
        "The test asserts the vulnerable state too. A test that only checks the fixed state can pass because the request never worked in the first place.",
      assertions: [
        "Vulnerable build: Alice reads Bob's invoice (200).",
        "Fixed build: the same request is hidden (404).",
        "Fixed build: Alice still reads her own invoice (200).",
        "Fixed build: anonymous access is rejected (401).",
        "Fixed build: Bob still reads his own invoice (200).",
      ],
    },
    lessons: {
      kicker: "Review checklist",
      title: "Five questions for every id in a route",
      intro: "What I now ask before calling an endpoint finished.",
      items: [
        "Who is allowed to use this object id, and where is that written down?",
        "Does the query itself filter by owner, instead of a guard someone can forget?",
        "What happens with a second tenant's id — not just my own happy path?",
        "On denial, do I return 404 instead of confirming that the object exists?",
        "Is there a test that fails when the ownership check is removed?",
      ],
    },
    limits: {
      kicker: "Scope and honesty",
      title: "What this page is not",
      body:
        "This is a training lab, not a paid penetration test and not a real-world CVE. The app is deliberately vulnerable, binds only to loopback and uses synthetic data. It demonstrates method and remediation, not production impact. I built the target, so the exploit is authorized.",
    },
    links: {
      kicker: "References",
      title: "Read the source, not just the claim",
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
      title: "Training lab: IDOR/BOLA in un'API di fatture — Simone Russo",
      description:
        "Training lab interattivo: guarda un controllo di autorizzazione mancante esporre la fattura di un altro tenant, riproducilo in locale, applica il fix ed esegui il test di regressione.",
    },
    kicker: "Sicurezza / training lab",
    title: "Accedi come Alice. Leggi la fattura di Bob.",
    intro:
      "Una piccola API di fatture che gira sulla tua macchina. Il login funziona. Le sessioni funzionano. La lookup funziona. Manca solo il controllo che decide se quella fattura è tua. Guardalo qui sotto, poi riproducilo davvero in due terminali.",
    chips: ["Solo 127.0.0.1", "Dati sintetici", "CWE-639", "OWASP API1:2023"],
    warning:
      "Questa build è deliberatamente vulnerabile. L'ho scritta io, quindi qui romperla è l'esercizio — ma resta su loopback. Non distribuirla e non puntarla mai a dati che ti interessano.",
    warningLabel: "Avvertenza",
    facts: [
      { label: "Setup", value: "nessuna dipendenza" },
      { label: "Runtime", value: "Node 18+" },
      { label: "Porta", value: "127.0.0.1:8787" },
      { label: "Tempo", value: "circa 2 minuti" },
    ],
    cta: { play: "Prova la richiesta", run: "Avvialo in locale" },
    nav: { simulator: "Simulatore", run: "Avvialo", bug: "Il bug", test: "Il test" },
    onThisPage: "In questa pagina",
    simulationNote:
      "Simulazione lato client: rispecchia la logica di labs/idor/app.mjs, non esegue il server.",
    simulator: {
      kicker: "Spiegazione interattiva",
      title: "Il controllo che non c'è",
      intro:
        "La stessa logica del server del lab, disegnata come una richiesta. Scegli una sessione e una fattura, poi inviala. Passa alla build corretta e invia la stessa identica richiesta.",
      identity: "Sessione",
      invoice: "Fattura",
      mode: "Build",
      modes: { vulnerable: "Vulnerabile", fixed: "Corretta" },
      send: "Invia richiesta",
      attack: "Esegui l'attacco",
      replay: "Ripeti",
      anonymous: "Anonimo",
      yours: "tua",
      skipped: "saltato",
      rerunNote: "Dopo la prima richiesta, cambiare un'opzione la riesegue con la nuova configurazione.",
      request: "Richiesta",
      response: "Risposta",
      trace: "Traccia del server",
      state: { idle: "in attesa", live: "in corso", done: "completata" },
      stages: { auth: "Sessione", route: "Handler", lookup: "Lookup", owner: "Owner" },
      badges: { leak: "Esposta", own: "Autorizzata", denied: "Nascosta", anon: "Rifiutata" },
      traceLines: {
        authOk: "sessione {sid} → utente {userId} ({name})",
        authFail: "nessun cookie di sessione",
        route: "GET /api/invoices/{invoice} → handler",
        lookup: "fattura {invoice} trovata · ownerId {ownerId}",
        ownerMissing: "controllo di proprietà: non implementato",
        ownerDenied: "fattura.ownerId {ownerId} ≠ sessione.userId {userId} → nega",
        ownerPass: "fattura.ownerId {ownerId} = sessione.userId {userId} → consenti",
        leak: "200 · fattura {invoice} restituita all'utente {userId}",
        own: "200 · restituita la fattura del chiamante",
        denied: "404 · oggetto fuori dal perimetro del chiamante",
        anon: "401 · autenticazione richiesta",
      },
      captions: {
        idle: "Alice che legge la fattura 2 è già impostato. Premi «Invia richiesta» per seguire la traccia.",
        auth: "Il cookie identifica un utente. Chi non ha sessione si ferma qui.",
        route:
          "L'handler legge l'id della fattura dall'URL. In questo passaggio nessuno sa a chi appartiene.",
        lookup:
          "La fattura viene caricata per id. Codice del tutto normale — ed è esattamente qui che manca il controllo.",
        ownerMissing:
          "Nessun confronto tra invoice.ownerId e session.userId. L'handler passa diretto alla risposta, qualunque sia la relazione.",
        ownerDenied:
          "La build corretta confronta il proprietario con l'utente della sessione e rifiuta di restituire l'oggetto.",
        ownerPass: "Proprietario e chiamante coincidono. La fattura viene restituita legittimamente.",
        leak: "Alice è autenticata. La risposta contiene la fattura di Bob. L'autenticazione è passata; l'autorizzazione no.",
        own: "La richiesta è legittima: la fattura appartiene all'utente autenticato.",
        denied: "Stessa richiesta, build corretta: 404. L'API non conferma se l'oggetto esiste.",
        anon: "Senza sessione non c'è un utente da autorizzare. La richiesta termina con 401.",
      },
    },
    howto: {
      kicker: "Parte pratica",
      title: "Due terminali, sei passi",
      intro:
        "Un terminale tiene vivo il server; l'altro invia le richieste. Ogni comando è copia-incolla e i dati sono finti. Il giro completo richiede circa due minuti.",
      terminal: "Terminale",
      output: "Output",
      copy: "Copia",
      copied: "Copiato",
      steps: [
        {
          title: "Prendi il codice",
          body: "Clona il repository ed entraci. Nessuna installazione: il lab è Node puro, senza dipendenze.",
          code: `git clone https://github.com/ErRusso/errusso.github.io.git
cd errusso.github.io`,
          output: "",
        },
        {
          title: "Avvia la build vulnerabile",
          body: "Lasciala attiva nel primo terminale. Il server stampa l'URL di loopback e non si lega mai a un'interfaccia pubblica.",
          code: `node labs/idor/vulnerable.mjs`,
          output: `VULNERABLE training API: http://127.0.0.1:8787
Synthetic data only. Loopback only. Do not deploy.`,
        },
        {
          title: "Accedi come Alice",
          body: "Il cookie di sessione viene scritto in /tmp/idor.cookie. Alice è l'utente 1; le sue fatture sono la 1 e la 3.",
          code: `curl -s -c /tmp/idor.cookie \\
  -d 'username=alice&password=alice' \\
  http://127.0.0.1:8787/login`,
          output: `{"user":{"id":1,"username":"alice"}}`,
        },
        {
          title: "Cambia l'id",
          body: "Sei ancora Alice. La fattura 2 appartiene a Bob (utente 2). La build vulnerabile risponde 200 con la fattura completa.",
          code: `curl -s -b /tmp/idor.cookie \\
  http://127.0.0.1:8787/api/invoices/2`,
          output: `{"id":2,"ownerId":2,"customer":"Bob Srl","amount":5400,"currency":"EUR"}`,
        },
        {
          title: "Passa alla build corretta",
          body: "Ferma il server con Ctrl-C, avvia la build corretta e ripeti la stessa richiesta con lo stesso cookie. Ora risponde 404: l'oggetto viene nascosto, non confermato.",
          code: `node labs/idor/fixed.mjs
curl -s -o /dev/null -w '%{http_code}\\n' \\
  -b /tmp/idor.cookie \\
  http://127.0.0.1:8787/api/invoices/2`,
          output: `404`,
        },
        {
          title: "Esegui il test di regressione",
          body: "Un solo comando avvia entrambe le build e verifica la fuga, il blocco, l'accesso del proprietario e il 401 anonimo — in entrambe le direzioni.",
          code: `node labs/idor/test.mjs`,
          output: testOutput,
        },
      ],
      hint:
        "Se curl non restituisce nulla, probabilmente il server non è attivo nell'altro terminale. La porta è fissa a 8787; cambiala con PORT=8788 node labs/idor/vulnerable.mjs e aggiorna l'URL.",
    },
    bug: {
      kicker: "Il bug",
      title: "Autenticazione non è autorizzazione.",
      intro:
        "La route dimostra che esiste una sessione, legge l'id, carica la fattura e la restituisce. Ogni riga è corretta tranne quella assente: il confronto tra il proprietario della fattura e l'utente della sessione.",
      vulnerableLabel: "Build vulnerabile",
      fixedLabel: "Build corretta",
      vulnerableCode,
      fixedCode,
      caption:
        "La risposta è un 200 valido con una sessione valida. Il chiamante semplicemente non ha alcuna relazione con l'oggetto. Questa è broken object-level authorization, o IDOR.",
    },
    impact: {
      kicker: "Impatto",
      title: "Un numero cambiato",
      intro:
        "Privilege escalation orizzontale: qualsiasi utente autenticato può leggere la fattura di un altro tenant scorrendo un intervallo di id prevedibile.",
      items: [
        "Riservatezza: nome cliente e importo di un altro tenant.",
        "Enumerazione: gli id 1, 2, 3… si percorrono banalmente; il test di regressione fa esattamente questo.",
        "Una UI che nasconde il link non è una difesa: l'API risponde anche quando nessuna schermata punta all'oggetto.",
        "Silenzioso per design: la build vulnerabile registra una richiesta riuscita, non un attacco.",
      ],
    },
    rootCause: {
      kicker: "Root cause",
      title: "Dove va il controllo",
      intro: "Il login risponde a chi sta chiamando. Non può rispondere a cosa può leggere.",
      body:
        "Il controllo di proprietà va accanto alla lookup, nel percorso di accesso ai dati, così ogni route che carica una fattura lo eredita. Una guard nella UI o un controllo di ruolo più a monte non sa che la fattura 2 appartiene all'utente 2.",
      checks: [
        {
          label: "01",
          title: "Autenticazione",
          body: "Esiste una sessione valida?",
          result: "Sì — utente 1 (alice)",
          state: "pass",
        },
        {
          label: "02",
          title: "Autorizzazione",
          body: "L'utente 1 può leggere la fattura 2?",
          result: "Mai chiesto",
          state: "fail",
        },
      ],
    },
    test: {
      kicker: "Prova",
      title: "Fai fallire il fix ad alta voce",
      intro:
        "Il test di regressione avvia entrambe le build e verifica cinque comportamenti: la fuga, il blocco e le tre cose che il fix non deve rompere.",
      code: `node labs/idor/test.mjs`,
      output: testOutput,
      note:
        "Il test verifica anche lo stato vulnerabile. Un test che controlla solo il fix può passare perché la richiesta non ha mai funzionato davvero.",
      assertions: [
        "Build vulnerabile: Alice legge la fattura di Bob (200).",
        "Build corretta: la stessa richiesta viene nascosta (404).",
        "Build corretta: Alice legge ancora la propria fattura (200).",
        "Build corretta: l'accesso anonimo viene rifiutato (401).",
        "Build corretta: Bob legge ancora la propria fattura (200).",
      ],
    },
    lessons: {
      kicker: "Checklist di review",
      title: "Cinque domande per ogni id in una route",
      intro: "Cosa chiedo ora prima di considerare finito un endpoint.",
      items: [
        "Chi può usare questo id, e dove è scritto?",
        "La query filtra già per proprietario, invece di affidarsi a una guard che qualcuno può dimenticare?",
        "Cosa succede con l'id di un secondo tenant, non solo con il mio happy path?",
        "In caso di rifiuto restituisco 404, invece di confermare che l'oggetto esiste?",
        "Esiste un test che fallisce se qualcuno rimuove il controllo di proprietà?",
      ],
    },
    limits: {
      kicker: "Perimetro e onestà",
      title: "Cosa non è questa pagina",
      body:
        "Questo è un training lab, non un penetration test retribuito e non un CVE reale. L'app è deliberatamente vulnerabile, ascolta solo su loopback e usa dati sintetici. Dimostra metodo e remediation, non impatto in produzione. Il target l'ho costruito io, quindi lo sfruttamento è autorizzato.",
    },
    links: {
      kicker: "Riferimenti",
      title: "Leggi il sorgente, non solo la dichiarazione",
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
