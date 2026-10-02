// Node.js 22+. Use previously uploaded IDs and persist the exact payload/key.
const base = (process.env.SKAVIO_API_BASE || "https://www.skavio.eu").replace(/\/$/, "");
const key = process.env.SKAVIO_API_KEY;
const ids = JSON.parse(process.env.SKAVIO_UPLOAD_IDS);
const idem = process.env.SKAVIO_BATCH_IDEMPOTENCY_KEY;
if (!key || !idem) throw new Error("Set API key and persisted batch idempotency key");
async function request(method, path, payload) {
  const headers = {Authorization: `Bearer ${key}`, "Content-Type": "application/json"};
  if (method === "POST" && path === "/v1/batches") headers["Idempotency-Key"] = idem;
  const response = await fetch(base + path, {method, headers, body: payload === undefined ? undefined : JSON.stringify(payload), signal: AbortSignal.timeout(60000)});
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${await response.text()}`);
  return response.json();
}
const payload = {operation: process.env.SKAVIO_BATCH_OPERATION || "jpg", upload_ids: ids};
const quote = await request("POST", "/v1/batches/estimate", payload);
payload.max_credits = quote.estimated_credits;
// Persist this exact payload before submission; use it unchanged on replay.
let batch = await request("POST", "/v1/batches", payload);
console.log(JSON.stringify({batch_id: batch.id, payload}));
const deadline = Date.now() + 3600000;
while (!["completed", "partial", "failed"].includes(batch.status)) {
  if (Date.now() > deadline) throw new Error("Poll the saved batch ID later");
  await new Promise(resolve => setTimeout(resolve, 5000));
  batch = await request("GET", "/v1/batches/" + batch.id);
}
console.log(JSON.stringify(batch, null, 2));
// Download /v1/batches/{id}/results.zip with the same Bearer authentication.
