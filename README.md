# Skavio Processing API

One company-scoped API for document extraction, PDF and image tools, media processing, transcription and meetings.

- [Product and pricing](https://www.skavio.eu/api/)
- [Live developer documentation](https://www.skavio.eu/api/docs/)
- [Company workspace: register and create an API key](https://www.skavio.eu/dashboard/)
- [OpenAPI v1](openapi-v1.json) · [Developer guide](developer-guide.md)
- [Python quickstart](quickstart.py) · [Node.js quickstart](quickstart.mjs) · [Bulk guide](bulk-guide.md)
- [Postman public documentation](https://documenter.getpostman.com/view/58677341/2sBYHNWi4n) · [Collection](Skavio-Processing-API.postman_collection.json)
- [DEV.to integration article](https://dev.to/skavioeu/building-a-retry-safe-file-processing-api-estimates-idempotency-and-signed-webhooks-32p6)
- [Webhook verification](verify_webhook.py)

**API route version:** /v1. **Contract snapshot:** 1.9.0 + Pricing V2, captured 2026-10-04.

## What is new in API 1.7.0

- Monthly charged/reserved usage and separate payment history, bounded CSV and key attribution.
- Atomic company/key budgets for API, batch, bulk and paid web admission.
- Expiring API keys with granular permissions and administrator-only policy writes.
- Queue visibility, persisted alerts, cancellation of unstarted standalone jobs and governance audit.
- Idempotent replay of failed job/batch/bulk webhook deliveries using the frozen original event.
- Structured errors and X-Request-Id correlation; Czech/German/English dashboard additions.

Read the [Usage, budgets and recovery guide](governance-guide.md) for authorization, UTC month rules, limits and compatibility.

## Storage Fabric introduced in API 1.6.0

- Private S3 sources/results and compatible legacy local files.
- Verified direct uploads and resumable imports from approved customer cloud URLs.
- Company-scoped retention, archive, deletion hold and opt-in separate-bucket backups.
- Manual verified backup/restore, signed result downloads and encrypted import credentials.
- Existing Pricing V2, jobs, batches and bulk contracts remain supported.

Read the [Storage Fabric guide](storage-guide.md) for endpoints, production limits and browser upload handling.

## Bulk features introduced in API 1.5.0

- **Bulk manifests up to 100,000 items** with immutable manifest pages of 1–100 items and bounded incremental child admission.
- **Storage-aware admission** through `GET /v1/storage`, declared input/output/scratch envelopes and durable storage reservations.
- **Resume and failed-item retry** for large workloads without resubmitting successful items.
- **Crash/restart recovery** for scheduler state, reservations, checkpoints and provider-intent reconciliation.
- **Fair scheduling across companies** while preserving the current ceiling of 4 active platform jobs globally.
- Existing **100-item batches** remain available for simpler workloads.

Start with [Bulk processing guide](bulk-guide.md) or the [Python bulk quickstart](bulk_quickstart.py).
This repository contains the public developer kit. The hosted processing service requires a Skavio account and credits.

## First result

1. Register, create a company profile and generate a read/write key in the company workspace. Copy it once and keep it server-side.
2. Upload a source using multipart field `files`.
3. Call `POST /v1/estimate` without starting processing.
4. Set `max_credits` to the returned `estimated_credits`.
5. Submit `POST /v1/jobs` with a stable `Idempotency-Key`.
6. Poll the returned job ID until completed or failed; download through the authenticated result paths.

The included invoice is **synthetic**, contains no customer data, and can be used for an extraction test.

### Python 3.10+

```bash
python -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
# Set SKAVIO_API_KEY securely in your local environment.
export SKAVIO_IDEMPOTENCY_KEY="your-persisted-invoice-request-001"
python quickstart.py
```

### Node.js 22+

```bash
# Set SKAVIO_API_KEY securely in your local environment.
export SKAVIO_IDEMPOTENCY_KEY="your-persisted-invoice-request-002"
node quickstart.mjs
```

Both examples use `sample-invoice.txt`; set `SKAVIO_SOURCE` to a PDF/image/text source to change it. They estimate cost before submission and write JSON output into `results/`.
For intentional processing of a different source or changed payload, use a **new** idempotency key.
The examples are server-side starters, not a full SDK or a durable workflow engine.

### Postman

Import the collection or fork its public workspace copy. Set **your own local/private environment** variable `api_key`; never save a real key in the public collection. Set `source_file` to a local source. Run Upload → Estimate → Submit → Job status → Download. Poll every 3–10 seconds until the job is terminal before downloading.
Requests cover the API-key processing endpoints; administration, key creation, billing and webhook registration use an interactive company administrator session in the dashboard.
Before a new business request, clear `upload_id`, `job_id`, `download_path`, `max_credits` and `idempotency_key` in your private environment. Preserve the idempotency key when retrying the same submission.

## What can I process?

| Workflow | Operations |
| --- | --- |
| Documents | `flow-extract` → XLSX, CSV, JSON; chosen fields, evidence, review flags |
| PDFs | merge, split, extract/delete/rotate pages, compression, watermark, page numbering, protect/unlock with your password, OCR |
| Images | resize/crop/rotate/flip, compression, format conversion, OCR |
| Audio/video | conversion, trimming, compression; video rotation/resolution/mute |
| Speech | `transcribe`, `meeting` |

[Capabilities snapshot](capabilities.json) lists exact operation names. Query `GET /v1/capabilities` for current prices and limits.
Normal file jobs accept one source; PDF merge accepts 2–20 PDFs; Flow can process multiple document sources. Transcribe and Meeting accept one media source. Batch processing supports up to 100 items. API 1.5.0 bulk manifests support up to 100,000 items with incremental dispatch; see [bulk-guide.md](bulk-guide.md). General multi-operation chaining is not available.

## Credits and price control

All web tools and API share a prepaid company wallet. No unlimited processing entitlement is advertised in this kit.
The server measures bytes, pages and media duration. It reserves the quoted amount on submission, charges that fixed quote on success, and releases the reservation on failure.
Use `max_credits` to reject unexpectedly expensive submissions and `GET /v1/wallet` to track balance and reservations.

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

## Reliability and integration rules

- `queued → processing → completed | failed`; submission returns HTTP 202.
- Replaying the identical job request with the same idempotency key returns the same job. Changing its payload returns 409.
- Persist business request, exact payload, key and job ID in your system. If a response is lost, retry with the original key.
- A failed job releases credits; an intentional new attempt uses a new key.
- Provider outages and service restarts preserve durable jobs/checkpoints and reservations; permanent failures release them.
- Webhooks deliver at least once; verify HMAC on the raw bytes and deduplicate event IDs. Polling remains supported.
- Results/source retention defaults to 7 days. Storage Fabric policy, archive and hold control object retention; inspect retain_until and preserve results before expiry.
- Extraction can be wrong. Check evidence and review flags; review line items against the source before downstream accounting.

## Limits (current deployment)

120 requests/minute per key/session; up to 100 files/500 MB per upload; 2 GB source storage/company; 100 pages/PDF; 100 queued jobs/company; 4 active platform jobs/company and 4 globally. Transcribe/Meeting input can be up to 10 hours; File Toolbox media up to 2 hours.
These are ceilings, not guaranteed throughput or an SLA. Back off on 429 and transient 5xx responses. Current plans share the processing limits.

## Errors

JSON errors retain `detail` and add `error_code`, `request_id` and `retryable`; X-Request-Id provides correlation. Use stable codes rather than matching error text. Validation does not echo secret inputs.

| HTTP | Meaning |
| --- | --- |
| 401 / 403 | Missing/invalid authentication, scope or permission |
| 402 | Insufficient credits |
| 404 | Missing object or another company’s object |
| 409 | State/idempotency conflict or max-credit rejection |
| 410 | Expired result |
| 413 / 422 | Upload/storage limit or invalid source/parameters |
| 429 | Request/queue limit |
| 502 / 503 / 504 | Processing/provider unavailable or timeout |

## Security and support

Use `Authorization: Bearer <your-key>` over HTTPS. Never expose keys in frontend apps, URLs, screenshots, commits or shared Postman environments. Company-scoped object IDs cannot access another company.
Create/revoke keys and register webhooks in the dashboard. PDF passwords are secrets; do not log payloads.
Review [Privacy](https://www.skavio.eu/privacy/) and [Terms](https://www.skavio.eu/terms/) before regulated/sensitive inputs. Source processing can involve external providers; backup/provider retention is separate from platform deletion.

Report integration issues through this repository with **synthetic reproductions only**, or contact **work@skavio.eu** privately. Never attach customer documents, keys or billing data to a public issue.

## Versioning

Compatible additions remain under /v1; clients should ignore unknown response fields. Breaking changes require a major API version or an announced migration. [Changelog](CHANGELOG.md).

## License

Example code and documentation in this developer kit are MIT licensed. This does not license the hosted backend or grant free use of the hosted service; service use follows its Terms and credit pricing.


## Batch processing — API 1.5.0

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


Batch starters: [Python](batch_quickstart.py) · [Node.js](batch_quickstart.mjs) · [Batch guide](batch-guide.md). Set `SKAVIO_API_KEY`, `SKAVIO_UPLOAD_IDS` (JSON array from upload), and a persisted `SKAVIO_BATCH_IDEMPOTENCY_KEY`. The examples poll and print authenticated result paths; archive results before retention expires.

## Durable workflow pipelines

Linear process/review/archive steps, checkpointed execution and per-step credit settlement. See [workflow guide](workflow-guide.md).

## Official SDK clients

Python and Node.js clients are in [sdk/README.md](sdk/README.md). Install from this repository with `python3 -m pip install ./sdk/python` or `npm install ./sdk/javascript`. They cover all 92 current OpenAPI operations, durable submission keys, resumable polling, signed webhook verification and authenticated result downloads. Packages are not yet published to PyPI/npm.


## API 1.9.0 controls and notifications

Bulk pause and cancel require Idempotency-Key and enforce company isolation. Pause prevents new child admission; accepted jobs drain and settle once. Cancel is final and prevents further dispatch. GET /v1/notifications and GET /v1/notifications/settings are tenant-scoped. PUT /v1/notifications/settings requires a company administrator web session. Notifications are disabled by default; email requires configured transport. Frozen events are deduplicated and retried within a bounded delivery window. Email follows the current company billing address and supports cs/de/en.
