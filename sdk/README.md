# Skavio SDK 1.1.0 — Python and Node.js

Server-side clients for the production Skavio Processing API 1.9.0. Keep API keys in your company's backend, never in a public browser/mobile bundle. These clients do not grant administrator-only session permissions.

## Installation from this repository

```bash
python3 -m pip install ./sdk/python
npm install ./sdk/javascript
```

Python 3.10+ / Node.js 22+. These packages are supplied here; they are not yet published to PyPI or npm. JavaScript includes TypeScript declarations and has no runtime dependencies.

## Python: submit once, resume by job ID

```python
import os
from skavio import SkavioClient

with SkavioClient(os.environ['SKAVIO_API_KEY']) as api:
    source = api.upload(['invoice.pdf'])['uploads'][0]['id']
    payload = {'operation': 'flow-extract', 'upload_ids': [source],
               'fields': ['supplier', 'invoice_number', 'total', 'currency']}
    payload['max_credits'] = api.estimate(payload)['estimated_credits']
    job = api.submit_job(payload, idempotency_key='erp-invoice-2026-1001')
    # Store job['id'] durably against this ERP invoice before polling.
    result = api.wait('job', job['id'])
    if result['status'] == 'completed':
        file = result['result']['files'][0]
        content = api.download(file['download_path'])
```

## JavaScript

```javascript
import {SkavioClient} from '@skavio/sdk';
const api = new SkavioClient(process.env.SKAVIO_API_KEY);
const source = (await api.upload(['invoice.pdf'])).uploads[0].id;
const payload = {operation: 'flow-extract', upload_ids: [source], fields: ['supplier', 'total']};
payload.max_credits = (await api.estimate(payload)).estimated_credits;
const job = await api.submitJob(payload, 'erp-invoice-2026-1001');
// Persist job.id in your ERP before waiting.
const result = await api.wait('job', job.id);
if (result.status === 'completed') {
  const content = await api.download(result.result.files[0].download_path);
}
```

## Durable integration rules

Persist a business idempotency key and the original payload BEFORE submitting a job/batch/bulk/workflow. If submission times out, reuse the same key and unchanged payload to resolve whether it was accepted; do not generate a new key. Uploads are not automatically retried because they do not have this guarantee. Read requests retry connection failures and HTTP 429/502/503/504 up to twice; mutation requests are never automatically retried. Keep IDs in your database so a restarted process can continue polling.

`wait()` returns on completed/failed/cancelled/partial, and on paused/waiting_review/draft when human action is required. A polling timeout leaves the server workload running. Inspect `status` yourself; return from `wait()` is not necessarily success. Pause/cancel stops future workflow steps; already accepted work keeps its normal processing/billing.

Downloads follow a bounded chain of HTTPS redirects and strip the API key when leaving the API origin. They return bounded bytes in memory (500 MiB default); use direct signed object links with your own streaming transport for larger results. Node uploads read files into memory; large-source integrations should use the direct-upload/cloud-import API. Regular upload has the platform's current 500 MiB limit.

## Workflows, batches and bulk manifests

Python: `submit_batch`, `create_bulk`, `append_manifest`, `seal_bulk`, `get_bulk`, `resume_bulk`, `start_workflow`, `get_workflow`, `control_workflow`.

JavaScript: `submitBatch`, `createBulk`, `appendManifest`, `sealBulk`, `getBulk`, `resumeBulk`, `startWorkflow`, `getWorkflow`, `controlWorkflow`.

See [bulk guide](../bulk-guide.md) and [workflow guide](../workflow-guide.md) for payloads, limits and administrator review rules. Individual operations require the appropriate company/key permissions; SDK convenience methods do not bypass them.

## All 92 OpenAPI operations

`call()` covers every `/v1/` operation from the current published OpenAPI specification. Use the exact operationId from [OpenAPI](../openapi-v1.json), pass path parameters separately, and supply a persisted idempotency key where the contract requires it.

```python
usage = api.call('usage_v1_usage_get', query={'month': '2026-10'})
```

```javascript
const usage = await api.call('usage_v1_usage_get', {query: {month: '2026-10'}});
```

For CSV/ZIP responses use `request(..., raw=True)` in Python or `{raw: true}` in JavaScript; use `download()` for result endpoints that redirect. `SkavioError` exposes HTTP status, API error code, request ID and Retry-After. Error messages deliberately omit signed URLs and credentials.

## Webhook receiver

Verify signatures on the exact received bytes BEFORE JSON parsing. Python exports `verify_webhook`; JavaScript exports `verifyWebhook`. Supply `X-Skavio-Timestamp` and `X-Skavio-Signature`; signatures are HMAC-SHA256 with a five-minute window. Store/deduplicate `X-Skavio-Event-Id`, acknowledge only after durable receipt, then process asynchronously. Verification does not perform business actions or deduplication itself.

## Tests

```bash
python3 sdk/tests/test_python.py
node --test sdk/tests/test_javascript.mjs
```

Offline tests cover retries, ambiguous submissions, request IDs, resumable polling, webhook integrity/freshness and credential stripping on result redirects. Public production capabilities are checked separately without submitting paid processing work.

## API 1.9.0 / SDK 1.1.0

The operation registry contains all 92 operations from OpenAPI 1.9.0. Use `call(operationId, ...)` for every endpoint, including tenant administration operations. Authorization remains enforced by the server.

Python: `pause_bulk(id, idempotency_key=key)`, `cancel_bulk(id, idempotency_key=key)`, `notifications()`, `notification_settings()`, `update_notification_settings(settings, admin_session=session)`.
JavaScript: `pauseBulk(id, key)`, `cancelBulk(id, key)`, `notifications()`, `notificationSettings()`, `updateNotificationSettings(settings, adminSession)`.

Pause stops new admission while accepted work finishes. Cancel stops new work permanently; accepted work settles once. A cancelled bulk cannot resume. Persist separate idempotency keys for each action. Notification settings updates require a company administrator web session (`skavio_web_account`), not an API bearer key. The SDK sends the explicit admin session only for that request and omits bearer authorization. Notifications are disabled by default; email activation requires a configured production transport.

Use these SDKs on trusted servers only. Never embed API keys or administrator session tokens in browser or mobile public bundles. GET retries honor numeric or HTTP-date Retry-After; mutations are never automatically retried.
