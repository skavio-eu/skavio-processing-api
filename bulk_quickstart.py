import json, os, uuid, requests

BASE = os.getenv("SKAVIO_BASE_URL", "https://www.skavio.eu")
API_KEY = os.environ["SKAVIO_API_KEY"]
UPLOAD_IDS = json.loads(os.environ["SKAVIO_BULK_UPLOAD_IDS"])
if not UPLOAD_IDS:
    raise SystemExit("SKAVIO_BULK_UPLOAD_IDS must be a JSON array of upload IDs")

headers = {"Authorization": f"Bearer {API_KEY}"}
idem = os.environ.get("SKAVIO_BULK_IDEMPOTENCY_KEY", str(uuid.uuid4()))
spec = {
    "operation": os.getenv("SKAVIO_BULK_OPERATION", "jpg"),
    "total_items": len(UPLOAD_IDS),
    "declared_input_bytes": int(os.getenv("SKAVIO_BULK_INPUT_BYTES", "500000000")),
    "declared_output_bytes": int(os.getenv("SKAVIO_BULK_OUTPUT_BYTES", "1000000000")),
    "declared_scratch_bytes": int(os.getenv("SKAVIO_BULK_SCRATCH_BYTES", "2000000000")),
    "max_credits": int(os.getenv("SKAVIO_BULK_MAX_CREDITS", "100000")),
}
r = requests.post(BASE + "/v1/bulks", headers={**headers, "Idempotency-Key": idem}, json=spec, timeout=30)
r.raise_for_status()
bulk = r.json()
bulk_id = bulk["id"]

for offset in range(0, len(UPLOAD_IDS), 100):
    ids = UPLOAD_IDS[offset:offset + 100]
    page = {
        "offset": offset,
        "items": [
            {"upload_ids": [u], "output_bytes": 10_000_000, "scratch_bytes": 20_000_000}
            for u in ids
        ],
    }
    r = requests.put(BASE + f"/v1/bulks/{bulk_id}/manifest", headers=headers, json=page, timeout=30)
    r.raise_for_status()

r = requests.post(BASE + f"/v1/bulks/{bulk_id}/seal", headers=headers, timeout=30)
r.raise_for_status()
print(json.dumps(r.json(), indent=2))
print("Bulk ID:", bulk_id)
