# Skavio Processing API developer guide

Contract snapshot: **1.5.0 + Pricing V2**, 2026-10-04. API route version: **/v1**.

Live documentation: https://www.skavio.eu/api/docs/

## Your first processing job

API base: https://www.skavio.eu/v1. Create a Skavio account and company profile in the company workspace, then create a read/write API key. The secret is shown once. A company receives 1,000 trial credits; availability is subject to the current signup policy.

Upload the source, estimate its price, submit the job with a stable idempotency key, poll until terminal status, then download the results. Do not put API keys in frontend code.



```
export SKAVIO_API_KEY='YOUR_KEY'
curl -sS https://www.skavio.eu/v1/uploads \
  -H "Authorization: Bearer $SKAVIO_API_KEY" \
  -F 'files=@invoice.pdf'

# Copy the returned upload ID; create request.json:
{
  "operation": "flow-extract",
  "upload_ids": ["UPLOAD_ID"],
  "fields": ["supplier", "invoice_number", "currency", "total"],
  "instructions": "Normalize unambiguous dates to YYYY-MM-DD.",
  "max_credits": 200
}

curl -sS https://www.skavio.eu/v1/estimate \
  -H "Authorization: Bearer $SKAVIO_API_KEY" \
  -H 'Content-Type: application/json' --data-binary @request.json

\# Before submission, replace max_credits with the estimate returned above.
curl -sS https://www.skavio.eu/v1/jobs \
  -H "Authorization: Bearer $SKAVIO_API_KEY" \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: invoice-run-2026-001' \
  --data-binary @request.json

curl -sS https://www.skavio.eu/v1/jobs/JOB_ID \
  -H "Authorization: Bearer $SKAVIO_API_KEY"

curl -fS https://www.skavio.eu/v1/jobs/JOB_ID/results/0 \
  -H "Authorization: Bearer $SKAVIO_API_KEY" -o data.xlsx
```



## Endpoint reference

Download complete OpenAPI JSON

Import this contract into Postman, Insomnia or your OpenAPI client generator. Request bodies, field constraints and multipart upload schemas are generated from the implementation. Routes use the authenticated company scope; IDs from another company return 404.

See openapi-v1.json for all endpoint methods, authentication requirements and schemas.

## Operations and supported files

flow-extract accepts PDF, images and UTF-8 text. Every input document produces one document row; line items use a separate worksheet. Output: XLSX, CSV and JSON. Fields use unique names starting with a letter and containing letters, numbers or underscores, maximum 64 characters and 30 fields. Metadata names items, warnings, evidence, review_required and human_review are reserved. Missing values are null. Evidence is checked against the source text; this is an aid to review, not a guarantee of correctness.

transcribe and meeting accept one audio or video source. Normal file operations accept one source; pdf-merge accepts 2–20 PDFs. Use /v1/batches for ordinary batches of up to 100 items. Use /v1/bulks for resumable manifests of up to 100,000 items with bounded incremental dispatch. Saved workflows currently support document extraction.



## Operation options

Put settings in the options object. File Toolbox validates source dimensions, duration, page ranges and passwords before processing. Passwords are forwarded privately to the PDF worker; do not log request bodies.


Operation | Example options | 
--- | --- | 
pdf-extract / pdf-delete | {"pages":"1-3,5"} | 
pdf-rotate | {"pages":"1-2","angle":90} · 90, 180 or 270 degrees | 
pdf-protect / pdf-unlock | {"password":"user-supplied-secret"} · 1–128 characters | 
pdf-watermark | {"text":"DRAFT","pages":""} · empty pages selects all | 
pdf-number | {"start":1,"pages":""} | 
image-edit | {"width":1200,"height":1200,"angle":0,"flip":"none","format":"webp","crop":[0,0,800,800]} · resize contains image within the box and preserves aspect ratio; supply both dimensions | 
image-compress | {"format":"webp","level":"balanced"} · formats jpg/png/webp; level balanced/strong | 
audio-trim / video-trim | {"start":10,"end":60} · seconds within source duration | 
video-rotate | {"angle":90} | 
video-resize | {"height":720} · 240, 360, 480, 720, 1080, 1440, 2160 | 
audio-compress / video-compress | {"level":"balanced"} | 
transcribe | {"output_format":"txt"} · TXT, DOCX, SRT, VTT; check the returned result formats |

Without a saved workflow, set operation, upload_ids, optional fields and instructions. With a saved workflow, also set workflow_id; the saved operation, options, fields and instructions take precedence. max_credits rejects a job if its quote is too high.



## Job lifecycle, retries and idempotency

queued → processing → completed | failed. A job ID is returned immediately with HTTP 202. Poll every 3–10 seconds; back off on 429 or transient 5xx errors.

Use a unique Idempotency-Key for each business request, 8–128 characters: letters, numbers, underscore, dot, colon or dash. Retrying the identical request with the same key returns the same job without charging again. Reusing a key with different parameters returns 409. On a lost submission response, retry with the original key; do not create another key.

Failed jobs release reserved credits. Submit a new job with a new idempotency key when you intentionally retry a terminal failure. Temporary provider outages and restarts preserve queued jobs, retry schedules, durable checkpoints and reservations. Permanent failures release credits; replays do not charge again.

Authenticated downloads use the paths in result.files; no public result URL or API key in a query string. Use the dashboard to correct extracted scalar fields and regenerate exports without another processing charge. Review changes are recorded; line items must still be checked against the original. Results expire after 7 days. Preserve them in your system before expiration.



## Large bulk workloads — API 1.5.0

Use `/v1/bulks` when a workload can exceed the normal 100-item batch boundary. A bulk parent can declare up to 100,000 items, while manifest pages are appended in chunks of 1–100 items and child jobs are admitted incrementally.

The client flow is:

1. `POST /v1/bulks` with a persisted Idempotency-Key, operation, item count, declared input/output/scratch bytes and max_credits.
2. Upload sources normally with `POST /v1/uploads`.
3. Append immutable pages with `PUT /v1/bulks/{bulk_id}/manifest`.
4. After every declared item is present, `POST /v1/bulks/{bulk_id}/seal`.
5. Read parent state from `GET /v1/bulks/{bulk_id}` and bounded status/output pages from `/items` and `/outputs`.
6. If the parent pauses after a storage/auth/credit/capacity check, fix the cause and call `POST /v1/bulks/{bulk_id}/resume`.
7. For a terminal partial/failed workload, retry failed items only with `POST /v1/bulks/{bulk_id}/retry-failed` and a new persisted idempotency key.

Current bulk contract: 100,000 maximum items, 100 items per manifest page, 16-item incremental child window, maximum 10 open bulk manifests per company. These are admission/scheduling limits, not parallel-processing guarantees.

`GET /v1/storage` exposes authenticated company quota and current data-disk admission headroom. Large workload declarations include storage envelopes so the service can apply backpressure before processing rather than accepting work that cannot fit.

Scheduler state, child admission, reservations and provider-intent checkpoints are durable across service restart. Persist IDs and idempotency keys in your own system and continue polling/resuming after transient failures instead of creating a duplicate parent.

See [bulk-guide.md](bulk-guide.md) for request examples, storage behavior, cancellation and retry rules.

## Credits, estimation and payments

POST /v1/estimate returns the price without starting work. The current contract reserves and charges that fixed quote on success. A failed job releases the full reservation. Estimates use server-measured source bytes, PDF pages and media duration.

| Operation | Pricing V2 |
| --- | --- |
| Raw OCR text (ocr-txt) | 3 credits/page |
| OCR document output (ocr-docx / ocr-pdf) | 10 credits/page |
| Flow extraction and export | 25 credits/page |
| PDF/image/office/text file operation | 2 per started 25 MB or 10 pages, larger basis per source |
| Transcribe | 8 per started minute |
| Meeting | 15 per started minute |
| File Toolbox audio/video | 4 per started minute |

Nominally 1 EUR = 1,000 credits. Top-ups: EUR10/10,000; EUR25/26,000; EUR50/53,000; EUR100/108,000; EUR250/280,000; EUR500/570,000. A retail EUR6.99/6,990 pack is also available.

Monthly plans: Starter EUR29/30,000 credits; Business EUR79/85,000; Pro EUR199/225,000; Enterprise EUR499/600,000. Paid credits never expire; monthly credits roll over. Current plans share the deployment processing limits.

Web tools and API share one wallet. Submit reserves the measured quote; success charges it once; a permanent failure releases it. Temporary provider outages keep jobs queued with durable checkpoints and reserved credits. Existing quoted jobs and purchased checkout/subscription offers retain their original amounts.

Canonical live catalog: GET /v1/pricing. Always estimate before submission and use max_credits rather than hard-coding a rate.

## Keys, company scope and teams

Send Authorization: Bearer sk_live_…. Keys are hashed at rest and can have read-only or read/write scope. Administrators create and revoke keys through an interactive same-origin web session; API keys cannot create other keys or start billing checkouts. Revoke and replace keys to rotate them. Maximum 20 active keys per company.

API keys belong to a company and the member who created them. Removing membership invalidates access through that key. Team invitations are created in the dashboard. Invitations are accepted by the matching signed-in account; no email is sent automatically. Each account belongs to one company. Maximum 20 members. Company billing administrators manage settings; ordinary members can process and download files within their company. Do not share accounts between unrelated companies.



## Limits, errors and retention


Limit | Current release | 
--- | --- | 
Requests | 120 per minute per key/session | 
Upload batch | 100 files; total 500 MB | 
Company source storage | 2 GB; delete unused uploads to free it | 
Document | 100 pages per PDF; images count as one page | 
Media duration | Transcribe/Meeting: 10 hours; File Toolbox media: 2 hours | 
Queue | 100 pending jobs per company | 
Processing | 4 platform jobs globally; up to 4 active for one company when capacity is available; fair scheduler rotates companies | 
Results and source retention | 7 days; accounting metadata retained separately | Errors return JSON with a detail field. 401: missing/invalid key or login. 402: insufficient credits. 403: scope/role/suspension. 404: object absent or not in your company. 409: incompatible state, mismatched idempotency or max-credit rejection. 410: expired result. 413: upload/storage limit. 422: invalid parameters/source. 429: request/queue limit. 502/503/504: processing/provider temporarily unavailable or timeout.

Delete a terminal job to remove platform result data while preserving accounting. Delete an unused upload to remove its source. In-flight sources cannot be deleted. Upstream processors and backups have their own retention; deletion is not a promise of immediate purge from all backups. Text from extraction is sent to the configured OpenAI model; Meeting and transcription use their existing configured processing providers. Review the privacy page and contact us for specific retention arrangements before uploading regulated data.



## Webhook status

Register a public HTTPS callback URL in the dashboard or through an administrator session at POST /v1/webhooks. Save the returned signing secret; it is shown once. Pass its id as webhook_id when submitting a job.

On completion or failure we POST a JSON event with id, type (job.completed / job.failed), created_at and a job object. Job result paths still require your API key. No private source data is included in the event.

Verify X-Skavio-Signature as v1=HMAC_SHA256(secret, timestamp + "." + raw_body), using the exact body bytes and X-Skavio-Timestamp. Use constant-time comparison and reject timestamps older than five minutes. Deduplicate by X-Skavio-Event-Id. Acknowledge with a 2xx response after durable receipt.

Delivery is at least once. Up to six attempts are made, with backoff approximately 60, 120, 240, 480 and 960 seconds after failures. A disabled webhook receives no further deliveries. URL redirects are not followed; DNS is checked on every attempt and the HTTPS connection is pinned to a public IP. View status and errors under Webhooks.



```
import hashlib, hmac, time
def verify(secret, timestamp, raw_body, signature):
    if abs(time.time() - int(timestamp)) > 300:
        return False
    expected = "v1=" + hmac.new(secret.encode(),
        timestamp.encode() + b"." + raw_body, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, signature)
```



## Python example



```
import os, time, uuid, requests
base = "https://www.skavio.eu"
headers = {"Authorization": "Bearer " + os.environ["SKAVIO_API_KEY"]}
with open("invoice.pdf", "rb") as source:
    r = requests.post(base + "/v1/uploads", headers=headers,
                      files={"files": ("invoice.pdf", source)}, timeout=180)
r.raise_for_status()
payload = {"operation": "flow-extract",
           "upload_ids": [r.json()["uploads"][0]["id"]],
           "fields": ["supplier", "invoice_number", "total"]}
q = requests.post(base + "/v1/estimate", headers=headers, json=payload, timeout=30)
q.raise_for_status()
payload["max_credits"] = q.json()["estimated_credits"]
# Persist this key with your business request before submitting.
job_headers = {**headers, "Idempotency-Key": str(uuid.uuid4())}
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
result = job["result"]["files"][0]
r = requests.get(base + result["download_path"], headers=headers, timeout=180)
r.raise_for_status()
with open(result["name"], "wb") as output:
    output.write(r.content)
```



## JavaScript / Node.js example



```
// Node.js 22+; server-side only.
import { readFile, writeFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
const base = 'https://www.skavio.eu';
const auth = { Authorization: `Bearer ${process.env.SKAVIO_API_KEY}` };
async function json(path, options = {}) {
  const r = await fetch(base + path, { ...options,
    headers: { ...auth, ...options.headers } });
  const data = await r.json();
  if (!r.ok) throw new Error(JSON.stringify(data));
  return data;
}
const form = new FormData();
form.append('files', new Blob([await readFile('invoice.pdf')]), 'invoice.pdf');
const uploaded = await json('/v1/uploads', { method: 'POST', body: form });
const payload = { operation: 'flow-extract',
  upload_ids: [uploaded.uploads[0].id], fields: ['supplier','total'] };
const opts = { method: 'POST', headers: { 'Content-Type':'application/json' },
  body: JSON.stringify(payload) };
const quote = await json('/v1/estimate', opts);
payload.max_credits = quote.estimated_credits;
const idem = randomUUID(); // Persist before submission.
let job = await json('/v1/jobs', { ...opts,
  headers: { ...opts.headers, 'Idempotency-Key': idem },
  body: JSON.stringify(payload) });
while (!['completed','failed'].includes(job.status)) {
  await new Promise(resolve => setTimeout(resolve, 5000));
  job = await json('/v1/jobs/' + job.id);
}
if (job.status === 'failed') throw new Error(job.error);
const file = job.result.files[0];
const r = await fetch(base + file.download_path, { headers: auth });
if (!r.ok) throw new Error('Download failed');
await writeFile(file.name, Buffer.from(await r.arrayBuffer()));
```



## Versioning and changelog

v1.0.0: company wallet and scoped keys, asynchronous file/audio jobs, document extraction with saved workflows and XLSX/CSV/JSON export, estimates, authenticated downloads and developer contract.

The API lives under /v1. Clients should ignore unknown response fields. Incompatible changes require a new major API version or an announced migration. The OpenAPI document and capabilities endpoint describe the currently deployed release.





## Batch processing — API 1.4.0

Submit up to 100 items for any advertised operation through the same processing pipeline. A batch uses one operation/options set and creates ordinary child jobs. Processing remains 4 active jobs per company and 4 globally; a batch does not promise 100 parallel executions.

1. Upload files with `POST /v1/uploads`; retain their upload IDs.
2. Quote `POST /v1/batches/estimate` using `{"operation":"jpg","upload_ids":["UPLOAD_A","UPLOAD_B"]}`.
3. Submit the same payload to `POST /v1/batches` with `max_credits` set to the total quote and a persisted `Idempotency-Key` (8–128 allowed characters).
4. Poll `GET /v1/batches/{batch_id}`. Each `items[].job` includes status, credits and result download paths. `progress` ranges from 0 to 1; terminal states are `completed`, `partial`, `failed`.
5. Download `GET /v1/batches/{batch_id}/results.zip` after completion. The archive includes successful results and `manifest.json`. Missing/expired files return 410. ZIP output is limited to 1 GB; use individual authenticated downloads for larger results.
6. Use `POST /v1/batches/{batch_id}/retry-failed` with a new persisted key to create a separately billed batch of failed items. Retry requests are bound to the original batch. Download successes before retention expires.

Credits reserve atomically for the complete batch. Every child has separate accounting; successful items are charged and failed items release their reservation. Replaying the same submission does not reserve credits again. Changing a request while reusing its key returns 409. Batch items count toward the 100 queued jobs per company.

Use either `upload_ids` (one child per source) or `items` (explicit groups), never both. PDF merge requires groups with 2–20 PDFs each:

```json
{"operation":"pdf-merge","items":[{"upload_ids":["PDF_A","PDF_B"]},{"upload_ids":["PDF_C","PDF_D"]}],"webhook_mode":"both"}
```

Grouped Flow inputs use the same `items` shape. Optional `webhook_id` must belong to your company. `webhook_mode` accepts `batch` (parent events), `items` (child events), or `both`. Parent events are `batch.completed`, `batch.partial`, `batch.failed`; verify the same signature and deduplicate event IDs. Parent delivery IDs are distinct from child delivery IDs.

`GET /v1/batches` lists recent company batches. `DELETE /v1/batches/{batch_id}` deletes terminal result/source specifications while preserving accounting. Source/result retention is seven days. A repeated-failure guard may return 429; contact support rather than continuously resubmitting failing sources. Save exact payloads, keys and returned IDs in durable storage.

