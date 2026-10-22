# IDOR / BOLA training lab

**Intentionally vulnerable. Local only. Synthetic data. Do not deploy.**

This is a teaching lab, not a client engagement and not a real-world finding.
It demonstrates a broken object-level authorization (BOLA/IDOR) bug in a tiny
invoicing API: authentication works, but the invoice endpoint never checks who
owns the invoice.

## Run the vulnerable build

```bash
node labs/idor/vulnerable.mjs
# in another terminal
curl -s -c /tmp/idor.cookie \
  -d 'username=alice&password=alice' \
  http://127.0.0.1:8787/login
curl -s -b /tmp/idor.cookie http://127.0.0.1:8787/api/invoices/2
```

Expected: Alice is authenticated as user 1 and receives invoice 2, which
belongs to user 2.

## Run the fixed build and the regression test

```bash
node labs/idor/fixed.mjs   # same API, ownership enforced
node labs/idor/test.mjs    # tests vulnerable + fixed builds
```

The test asserts:

- vulnerable build: Alice can read Bob's invoice (`200`);
- fixed build: the same request returns `404`;
- fixed build: Alice can still read her own invoice (`200`);
- fixed build: anonymous access returns `401`;
- fixed build: Bob can still read his own invoice (`200`).

## The fix

```diff
 const invoice = INVOICES.find((item) => item.id === Number(match[1]));
 if (!invoice) return sendJson(response, 404, { error: "not found" });
+
+if (enforceOwnership && invoice.ownerId !== session.userId) {
+  return sendJson(response, 404, { error: "not found" });
+}
 
 return sendJson(response, 200, invoice);
```

The fixed build sets `enforceOwnership: true`; the vulnerable build passes
`false`. Returning `404` instead of `403` avoids confirming that another
tenant's invoice exists. The check belongs in the data-access path, not only in
the UI.

## Why a training app?

I do not claim paid penetration tests or a real-world CVE. The goal is to show
the complete loop on something I am allowed to break: scope, reproduction,
impact, root cause, fix, and a test that proves the fix. The full write-up is
at `/security/lab-idor/`.
