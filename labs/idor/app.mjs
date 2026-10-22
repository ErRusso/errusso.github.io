import { randomUUID } from "node:crypto";
import { createServer } from "node:http";

/*
 * Intentionally vulnerable training app. Synthetic users, synthetic invoices,
 * loopback only. Do not deploy this file. The point is the missing object-level
 * authorization check, not the rest of the API.
 */

const USERS = [
  { id: 1, username: "alice", password: "alice", name: "Alice" },
  { id: 2, username: "bob", password: "bob", name: "Bob" },
];

const INVOICES = [
  { id: 1, ownerId: 1, customer: "Alice Co", amount: 1200, currency: "EUR" },
  { id: 2, ownerId: 2, customer: "Bob Srl", amount: 5400, currency: "EUR" },
  { id: 3, ownerId: 1, customer: "Alice Labs", amount: 800, currency: "EUR" },
];

function parseCookies(request) {
  const header = request.headers.cookie ?? "";
  return Object.fromEntries(
    header
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const index = part.indexOf("=");
        if (index < 0) return [part, ""];
        return [part.slice(0, index), decodeURIComponent(part.slice(index + 1))];
      }),
  );
}

function sendJson(response, status, body, headers = {}) {
  const payload = JSON.stringify(body);
  response.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(payload),
    "cache-control": "no-store",
    ...headers,
  });
  response.end(payload);
}

async function readBody(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
}

/**
 * @param {{ enforceOwnership?: boolean }} options
 * `enforceOwnership: false` reproduces the vulnerability. `true` is the fix.
 */
export function createLabServer({ enforceOwnership = true } = {}) {
  const sessions = new Map();

  return createServer(async (request, response) => {
    try {
      const url = new URL(request.url ?? "/", "http://127.0.0.1");
      const session = sessions.get(parseCookies(request).sid);

      if (request.method === "GET" && url.pathname === "/health") {
        return sendJson(response, 200, { ok: true });
      }

      if (request.method === "POST" && url.pathname === "/login") {
        const raw = await readBody(request);
        const form = new URLSearchParams(raw);
        const user = USERS.find(
          (candidate) =>
            candidate.username === form.get("username") &&
            candidate.password === form.get("password"),
        );

        if (!user) return sendJson(response, 401, { error: "invalid credentials" });

        const sid = randomUUID();
        sessions.set(sid, { userId: user.id, username: user.username });
        return sendJson(
          response,
          200,
          { user: { id: user.id, username: user.username } },
          { "set-cookie": `sid=${sid}; HttpOnly; SameSite=Lax; Path=/` },
        );
      }

      if (request.method === "POST" && url.pathname === "/logout") {
        if (session) sessions.delete(parseCookies(request).sid);
        return sendJson(response, 200, { ok: true }, { "set-cookie": "sid=; Max-Age=0; Path=/" });
      }

      if (url.pathname.startsWith("/api/") && !session) {
        return sendJson(response, 401, { error: "authentication required" });
      }

      if (request.method === "GET" && url.pathname === "/api/invoices") {
        const own = INVOICES.filter((invoice) => invoice.ownerId === session.userId);
        return sendJson(response, 200, own);
      }

      const match = url.pathname.match(/^\/api\/invoices\/(\d+)$/);
      if (request.method === "GET" && match) {
        const invoice = INVOICES.find((item) => item.id === Number(match[1]));

        if (!invoice) return sendJson(response, 404, { error: "not found" });

        if (enforceOwnership && invoice.ownerId !== session.userId) {
          return sendJson(response, 404, { error: "not found" });
        }

        return sendJson(response, 200, invoice);
      }

      return sendJson(response, 404, { error: "not found" });
    } catch {
      return sendJson(response, 500, { error: "internal error" });
    }
  });
}
