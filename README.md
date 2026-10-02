# Skavio Processing API

One company-scoped API for document extraction, PDF and image tools, media processing, transcription and meetings.

- [Product and pricing](https://www.skavio.eu/api/)
- [Live developer documentation](https://www.skavio.eu/api/docs/)
- [Company workspace: register and create an API key](https://www.skavio.eu/dashboard/)
- [OpenAPI v1](openapi-v1.json) · [Developer guide](developer-guide.md)
- [Python quickstart](quickstart.py) · [Node.js quickstart](quickstart.mjs)
- [Postman collection](Skavio-Processing-API.postman_collection.json)
- [Webhook verification](verify_webhook.py)

**API route version:** /v1. **Contract snapshot:** 1.1.0, captured 2026-10-02.
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
Normal file jobs accept one source; PDF merge accepts 2–20 PDFs; Flow can process multiple document sources. Transcribe and Meeting accept one media source. General multi-operation chaining and arbitrary media/image batch jobs are **not available in this release**.

## Credits and price control

All web tools and API share a prepaid company wallet. No unlimited processing entitlement is advertised in this kit.
The server measures bytes, pages and media duration. It reserves the quoted amount on submission, charges that fixed quote on success, and releases the reservation on failure.
Use `max_credits` to reject unexpectedly expensive submissions and `GET /v1/wallet` to track balance and reservations.

| Operation | Current rate | Minimum |
| --- | --- | --- |
| Flow extraction | 100 credits/page | 200/document |
| OCR | 30 credits/page | 60 |
| File tools | 30 per started 10 MB or 10 PDF pages, larger basis | 30 |
| Transcribe | 20 per started minute | 60 |
| Meeting | 60 per started minute | 500 |
| Media tools | 20 per started minute | 100 |

Current top-ups start at **€6.99 / 6,990 credits**. Bonus packs and monthly company plans have different effective credit prices. See live pricing before purchase. Paid packs do not expire; subscriptions add credits after paid invoices. Opening checkout does not credit the wallet.
A synthetic single-page Flow input is currently quoted at 200 credits; use the estimate endpoint rather than hard-coding this amount.

## Reliability and integration rules

- `queued → processing → completed | failed`; submission returns HTTP 202.
- Replaying the identical job request with the same idempotency key returns the same job. Changing its payload returns 409.
- Persist business request, exact payload, key and job ID in your system. If a response is lost, retry with the original key.
- A failed job releases credits; an intentional new attempt uses a new key.
- A platform restart can fail an interrupted job and release its reservation rather than repeat a potentially billed external call.
- Webhooks deliver at least once; verify HMAC on the raw bytes and deduplicate event IDs. Polling remains supported.
- Results/source retention is 7 days. Download and archive your results before expiry.
- Extraction can be wrong. Check evidence and review flags; review line items against the source before downstream accounting.

## Limits (current deployment)

120 requests/minute per key/session; up to 100 files/500 MB per upload; 2 GB source storage/company; 100 pages/PDF; 100 queued jobs/company; one active platform job/company and three globally. Transcribe/Meeting input can be up to 10 hours; File Toolbox media up to 2 hours.
These are ceilings, not guaranteed throughput or an SLA. Back off on 429 and transient 5xx responses. Current plans share the processing limits.

## Errors

JSON errors use `detail` (a string or validation details).

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

