"""Quote and submit previously uploaded files. Persist IDs and keys before running."""
import json, os, time, urllib.request
base = os.environ.get("SKAVIO_API_BASE", "https://www.skavio.eu").rstrip("/")
key = os.environ["SKAVIO_API_KEY"]
ids = json.loads(os.environ["SKAVIO_UPLOAD_IDS"])
idem = os.environ["SKAVIO_BATCH_IDEMPOTENCY_KEY"]

def request(method, path, payload=None):
    headers = {"Authorization": "Bearer " + key, "Content-Type": "application/json"}
    if method == "POST" and path == "/v1/batches": headers["Idempotency-Key"] = idem
    req = urllib.request.Request(base + path, data=json.dumps(payload).encode() if payload is not None else None, headers=headers, method=method)
    with urllib.request.urlopen(req, timeout=60) as response: return json.load(response)

payload = {"operation": os.environ.get("SKAVIO_BATCH_OPERATION", "jpg"), "upload_ids": ids}
quote = request("POST", "/v1/batches/estimate", payload)
payload["max_credits"] = quote["estimated_credits"]
# Persist this exact payload before submission; use it unchanged on replay.
batch = request("POST", "/v1/batches", payload)
print(json.dumps({"batch_id": batch["id"], "payload": payload}))
deadline = time.monotonic() + 3600
while batch["status"] not in {"completed", "partial", "failed"}:
    if time.monotonic() > deadline: raise TimeoutError("Poll the saved batch ID later")
    time.sleep(5)
    batch = request("GET", "/v1/batches/" + batch["id"])
print(json.dumps(batch, indent=2))
# Download /v1/batches/{id}/results.zip with the same Bearer authentication.
