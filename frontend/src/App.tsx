import { useEffect, useState } from "react";

const FRONTEND_VERSION = import.meta.env.VITE_APP_VERSION ?? "1.0.0";

interface HelloResponse {
  message: string;
  version: string;
}

export function App() {
  const [backend, setBackend] = useState<HelloResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/hello")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<HelloResponse>;
      })
      .then(setBackend)
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : "request failed"),
      );
  }, []);

  return (
    <main style={{ fontFamily: "system-ui", padding: 32 }}>
      <h1>University DevOps Lab</h1>
      <p data-testid="frontend-version">
        Frontend version: {FRONTEND_VERSION}
      </p>
      {backend && (
        <p data-testid="backend-version">
          {backend.message} (backend {backend.version})
        </p>
      )}
      {error && <p data-testid="backend-error">Backend unreachable: {error}</p>}
    </main>
  );
}
