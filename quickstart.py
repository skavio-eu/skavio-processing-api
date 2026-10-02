import os, time, pathlib, requests
base = "https://www.skavio.eu"
headers = {"Authorization": "Bearer " + os.environ["SKAVIO_API_KEY"]}
source_path = pathlib.Path(os.environ.get("SKAVIO_SOURCE", "sample-invoice.txt"))
idem = os.environ["SKAVIO_IDEMPOTENCY_KEY"]  # Persist and reuse for the same request.
with source_path.open("rb") as source:
    r = requests.post(base + "/v1/uploads", headers=headers,
                      files={"files": (source_path.name, source)}, timeout=180)
r.raise_for_status()
payload = {"operation": "flow-extract",
           "upload_ids": [r.json()["uploads"][0]["id"]],
           "fields": ["supplier", "invoice_number", "total"]}
q = requests.post(base + "/v1/estimate", headers=headers, json=payload, timeout=30)
q.raise_for_status()
payload["max_credits"] = q.json()["estimated_credits"]
# Persist this key with your business request before submitting.
job_headers = {**headers, "Idempotency-Key": idem}
r = requests.post(base + "/v1/jobs", headers=job_headers, json=payload, timeout=30)
r.raise_for_status()
job_id = r.json()["id"]
for _ in range(720):
    r = requests.get(base + "/v1/jobs/" + job_id, headers=headers, timeout=30)
    r.raise_for_status()
    job = r.json()
    if job["status"] in ("completed", "failed"):
        break
    time.sleep(5)
else:
    raise TimeoutError("Job still processing; resume polling with the same job ID")
if job["status"] == "failed":
    raise RuntimeError(job["error"])
result = next(f for f in job["result"]["files"] if f["name"].endswith(".json"))
if not result["download_path"].startswith("/v1/jobs/"):
    raise RuntimeError("Unexpected download path")
r = requests.get(base + result["download_path"], headers=headers, timeout=180)
r.raise_for_status()
pathlib.Path("results").mkdir(exist_ok=True)
with (pathlib.Path("results") / pathlib.Path(result["name"]).name).open("wb") as output:
    output.write(r.content)
print("Completed:", job_id, "charged credits:", job["charged_credits"])

