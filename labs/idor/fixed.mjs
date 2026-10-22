import { createLabServer } from "./app.mjs";

const port = Number(process.env.PORT ?? 8787);
const server = createLabServer({ enforceOwnership: true });

server.listen(port, "127.0.0.1", () => {
  console.log(`FIXED training API: http://127.0.0.1:${port}`);
  console.log("Synthetic data only. Loopback only.");
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
