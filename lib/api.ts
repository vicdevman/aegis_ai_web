const BASE = process.env["NEXT_PUBLIC_BACKEND_URL"] ?? "https://aegisai.mooo.com";

async function post(path: string, body?: unknown) {
  const res = await fetch(`${BASE}/api${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  return res.json();
}

async function get(path: string) {
  const res = await fetch(`${BASE}/api${path}`);
  return res.json();
}

export const api = {
  status: ()                   => get("/status"),
  startBot: ()                 => post("/bot/start"),
  stopBot: ()                  => post("/bot/stop"),
  setStrategy: (s: string)     => post("/bot/strategy", { strategy: s }),
  positions: ()                => get("/positions"),
  positionHistory: (limit?: number) => get(`/positions/history${limit ? `?limit=${limit}` : ""}`),
  closeAllPositions: ()        => post("/positions/close_all"),
};
