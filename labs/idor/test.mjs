import assert from "node:assert/strict";
import { createLabServer } from "./app.mjs";

async function start(options) {
  const server = createLabServer(options);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();
  return { server, base: `http://127.0.0.1:${port}` };
}

async function stop(server) {
  await new Promise((resolve) => server.close(resolve));
}

async function login(base, username) {
  const response = await fetch(`${base}/login`, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ username, password: username }),
  });
  assert.equal(response.status, 200, `login ${username}`);
  return response.headers.get("set-cookie").split(";")[0];
}

async function get(base, path, cookie) {
  const response = await fetch(base + path, {
    headers: cookie ? { cookie } : {},
  });
  return { status: response.status, body: await response.json() };
}

// 1. Vulnerable build: alice can read bob's invoice.
{
  const { server, base } = await start({ enforceOwnership: false });
  const alice = await login(base, "alice");
  const result = await get(base, "/api/invoices/2", alice);
  assert.equal(result.status, 200);
  assert.equal(result.body.customer, "Bob Srl");
  console.log(`[vulnerable] alice -> invoice #2: ${result.status} (${result.body.customer})`);
  await stop(server);
}

// 2. Fixed build: the same request becomes a 404, while the owner still works.
{
  const { server, base } = await start({ enforceOwnership: true });
  const alice = await login(base, "alice");
  const crossTenant = await get(base, "/api/invoices/2", alice);
  const own = await get(base, "/api/invoices/1", alice);
  const anonymous = await get(base, "/api/invoices/1");
  const bob = await login(base, "bob");
  const owner = await get(base, "/api/invoices/2", bob);

  assert.equal(crossTenant.status, 404);
  assert.equal(own.status, 200);
  assert.equal(anonymous.status, 401);
  assert.equal(owner.status, 200);
  assert.equal(owner.body.customer, "Bob Srl");

  console.log(`[fixed] alice -> invoice #2: ${crossTenant.status}`);
  console.log(`[fixed] alice -> invoice #1: ${own.status}`);
  console.log(`[fixed] anonymous -> invoice #1: ${anonymous.status}`);
  console.log(`[fixed] bob -> invoice #2: ${owner.status}`);
  await stop(server);
}

console.log("PASS: 9 assertions");
