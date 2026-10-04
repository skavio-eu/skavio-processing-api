# Storage Fabric — API 1.6.0

Contract: /v1, API 1.6.0 + Pricing V2. Released 2026-10-04.

New sources and results use private S3 object storage. Existing valid local uploads/results remain compatible. All API calls below use the company-scoped Bearer key; signed storage URLs need no API key. Never forward your Skavio key to a storage host.

## Direct upload

1. POST /v1/storage/direct-uploads with filename, size_bytes, optional content_type and SHA-256 (recommended).
2. POST multipart/form-data to the returned url. Copy every returned fields entry unchanged and append file last. Do not manually set the multipart Content-Type.
3. POST /v1/storage/direct-uploads/{upload_session_id}/complete. The server verifies bytes and the supplied SHA-256 and freezes the accepted object. Only this successful response makes the source usable.
4. Use response.upload.id in the existing estimate/jobs/batches/bulks APIs.

Direct uploads accept 1–524,288,000 bytes (500 MiB). Sessions default to 900 seconds, configurable 60–3,600. Storage quota and processing operation limits still apply.

In a browser, keep the API key on your application server. Obtain the signed form from your server, then:

```javascript
const form = new FormData();
for (const [key, value] of Object.entries(session.fields)) form.append(key, value);
form.append("file", file);
await fetch(session.url, { method: "POST", mode: "no-cors", body: form });
// The provider response is opaque: do not inspect its status or call this success.
// Ask your server to call the authenticated /complete endpoint.
// Treat only successful /complete (verified size/hash) as upload success.
```

The production provider does not return an Access-Control-Allow-Origin header on signed POST responses. An ordinary cross-origin fetch that tries to read the response will fail. Do not send Authorization or custom headers to the storage URL. A network error or failed /complete must be reported/retried; an opaque POST response alone proves nothing.

## Import from a customer cloud

POST /v1/storage/imports:
```json
{
  "source_url": "https://YOUR_APPROVED_CLOUD_HOST/path?SIGNED_QUERY",
  "filename": "source.png",
  "max_bytes": 1048576,
  "expected_bytes": 1048576,
  "expected_sha256": "YOUR_64_HEX_SHA256"
}
```
Use your actual size/hash or omit optional expected fields; always bound max_bytes. Poll GET /v1/storage/imports/{import_id}. After completed, use upload_id.

Only approved public HTTPS cloud hosts are accepted. Private/reserved addresses and redirects to unapproved destinations are rejected; DNS is pinned. Source URLs are encrypted at rest. Multipart checkpoints permit resumable transfer when the source supports stable ranged reads. Keep the signed source URL valid long enough for transfer/retries.

The request schema permits a maximum of 5,000,000,000,000 bytes; this is a protocol bound, not a promise of processing a 5 TB file. The production default quota is 2 GiB per company, and individual tools retain their limits. Query GET /v1/storage and GET /v1/storage/usage before submitting. Quota increases require an operator.

## Retention, archive, hold and backup

GET/PATCH /v1/storage/policy controls source_retention_days and result_retention_days (1–90, default 7), archive_retention_days (1–3,650, default 365), and backup_enabled. Policy changes govern newly admitted objects; inspect each object's retain_until. Clients cannot raise max_bytes.

GET /v1/storage/objects lists tenant objects. GET /v1/storage/objects/{object_id} returns metadata. POST the object's /archive or /restore with an optional retention_days JSON field. POST /hold with {"hold":true} prevents deletion/expiry; release with false. DELETE removes an unheld object and its backup.

Backup is opt-in, stored in a separate private bucket. POST /backup creates or repairs the verified backup; POST /restore-backup restores primary bytes after validating size/SHA-256. A separate bucket is not protection against compromise of credentials shared by both buckets. Archive is an application retention state and does not imply a provider cold-storage tier.

## Downloads and compatibility

Authenticated GET /v1/storage/objects/{object_id}/download-link returns a short-lived signed URL. Existing job result download paths redirect with HTTP 307 to signed URLs. Follow the redirect without forwarding the API key to the storage host. Server-side curl: use -L; do not use --location-trusted. Downloads and object IDs from another company return 404.

Pricing V2, /v1 route names, idempotent job submission, batches and bulk manifests remain compatible. Downloads expire according to the object's retention and hold state. Consult the live OpenAPI contract for exact schemas and errors.
