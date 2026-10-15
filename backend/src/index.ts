import { Elysia } from "elysia";

const VERSION = process.env.APP_VERSION ?? "1.0.0";
const PORT = Number(process.env.PORT ?? 3001);

export const app = new Elysia()
  .get("/health", () => ({ status: "ok", version: VERSION }))
  .get("/api/hello", () => ({
    message: "Hello from University Lab backend",
    version: VERSION,
  }))
  .listen(PORT);

console.log(`backend ${VERSION} listening on :${PORT}`);
