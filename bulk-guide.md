# Bulk processing — API 1.5.0

API 1.5.0 adds resumable bulk manifests for workloads that are too large for a normal 100-item batch.

The normal `/v1/batches` API remains the simplest choice for up to 100 items. Use `/v1/bulks` when a business workload can contain hundreds, thousands or up to **100,000 items** and should be admitted incrementally without creating every child job at once.

## Capacity model

Current deployment limits are exposed by `GET /v1/capabilities`:

- 4 active platform jobs globally
- up to 4 active jobs for one company when capacity is available
- 100 queued ordinary jobs per company
- batch: up to 100 items
- bulk manifest: up to 100,000 items
- manifest pages: 1–100 items
- incremental bulk child window: 16 items
- maximum 10 open bulk manifests per company
- 120 API requests/minute per key/session

A 100,000-item manifest is **not** 100,000 parallel executions. The parent workload stays durable while the scheduler admits bounded child jobs as capacity becomes available.

## Lifecycle

```text
draft → queued → processing → completed
                    ↘ paused
                    ↘ partial / failed
```

A bulk can pause when storage headroom, authorization, credits or capacity need attention. Inspect the bulk status and `pause_reason`, correct the condition, then call `POST /v1/bulks/{bulk_id}/resume`.

## 1. Declare the workload

`POST /v1/bulks` declares the operation, maximum item count, storage envelope and maximum allowed credits. This reserves storage headroom but does not eagerly create all child jobs.

Use a durable `Idempotency-Key`.

```json
{
  "operation": "jpg",
  "total_items": 2,
  "declared_input_bytes": 50000000,
  "declared_output_bytes": 100000000,
  "declared_scratch_bytes": 200000000,
  "max_credits": 5000,
  "webhook_mode": "bulk"
}
```

The declared storage envelope must be realistic. Each manifest item also declares output and scratch requirements; scratch must cover at least twice the measured input for that item, with a 4096-byte minimum.

## 2. Append immutable manifest pages

Upload sources through `POST /v1/uploads`, then append manifest pages in order with `PUT /v1/bulks/{bulk_id}/manifest`.

```json
{
  "offset": 0,
  "items": [
    {
      "upload_ids": ["UPLOAD_A"],
      "output_bytes": 50000000,
      "scratch_bytes": 100000000
    },
    {
      "upload_ids": ["UPLOAD_B"],
      "output_bytes": 50000000,
      "scratch_bytes": 100000000
    }
  ]
}
```

Each page contains 1–100 items. Append at the next offset. Replaying the same offset and same payload is safe; changing an already accepted page is rejected.

For grouped operations, one item may contain several upload IDs. PDF merge still requires 2–20 PDFs per child job.

## 3. Seal after the complete manifest is uploaded

Call `POST /v1/bulks/{bulk_id}/seal`.

Seal performs full preflight against the measured manifest, available wallet balance and storage headroom. If the complete quote exceeds the wallet, nothing is enqueued.

After sealing, the scheduler starts bounded incremental dispatch.

## 4. Resume and inspect without loading the whole manifest

Use bounded authenticated pages:

- `GET /v1/bulks/{bulk_id}` — parent state and progress
- `GET /v1/bulks/{bulk_id}/items?after=-1&limit=100` — input/status page
- `GET /v1/bulks/{bulk_id}/outputs?after=-1&limit=100` — output page
- `GET /v1/storage` — company quota and current admission headroom

The output page returns authenticated job result paths. Download them with the same company authorization.

## 5. Recovery and retry rules

API 1.5.0 persists scheduler state, child admission, provider intents, storage reservations and accounting data so queued work can recover after service restarts.

If a bulk pauses, call `POST /v1/bulks/{bulk_id}/resume` only after correcting the reported condition. Resume rechecks authorization and storage before dispatch continues.

For a terminal `partial` or `failed` bulk, retry only failed items with `POST /v1/bulks/{bulk_id}/retry-failed`.

Supply a new persisted `Idempotency-Key`. Successful items are not reset or charged again. Replaying the same retry action is idempotent.

## Storage pressure

Bulk submission is storage-aware. The API tracks company source usage, logical reservations and free-space floors instead of accepting unlimited work and failing later during processing.

Treat HTTP 503 with a storage-related pause as backpressure: do not spin on retries. Free space or wait for retained data to expire, then resume the same bulk.

## Fair scheduling

Bulk parents are rotated across companies before bounded child admission. A paused large workload does not reserve all processing slots indefinitely. Current processing ceilings remain four active platform jobs globally.

These are deployment ceilings, not an SLA. Always query `GET /v1/capabilities` for current limits.

## Retention and cancellation

Source/results retention remains seven days. Download durable business outputs before expiry.

`DELETE /v1/bulks/{bulk_id}` cancels future dispatch. Already admitted children keep their existing billing and retention. Cancellation waits until admitted queued/processing children finish.

## Webhooks

Set `webhook_id` and choose `webhook_mode`:

- `bulk` — terminal parent events
- `items` — child events
- `both` — both layers

Webhook delivery remains at least once. Verify the HMAC signature and deduplicate event IDs.
