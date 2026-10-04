# API 1.9.0 / SDK 1.1.0 — 2026-10-04

Added tenant-safe, idempotent bulk pause/cancel with safe in-flight drain and exactly-once settlement. Definitively cancelled bulks cannot resume. Added opt-in webhook/email notification history and company settings with frozen events, deduplication, bounded retries, billing-recipient safety and Czech/German/English text. Notifications default to disabled; email availability reflects configured transport. Python/JavaScript SDK registries cover all 92 OpenAPI operations; new convenience methods and matching TypeScript definitions include bulk controls and notification settings. Administrator settings require a company administrator web session. GET Retry-After supports HTTP dates; mutations are never automatically retried.

# API 1.8.0 — 2026-10-04

Durable linear workflow pipelines with process, human review and archive steps. Per-run credit caps, idempotent actions, checkpointed resume and exactly-once child-job settlement. Responsive CZ/DE/EN Dashboard controls. Production verified with actual S3 storage and conversion workers. See workflow-guide.md.

# API 1.6.0 — 2026-10-04

## 1.7.0 — 2026-10-04

Usage/payments visibility, atomic company/key budgets, expiring granular keys, persistent alerts, queue operations and audit. Unstarted standalone-job cancellation and idempotent frozen webhook replay. Error correlation and multilingual responsive dashboard. Existing /v1, Pricing V2 and Storage Fabric contracts remain supported. See governance-guide.md for restrictions.

Storage Fabric: private S3 sources/results, verified direct upload, cloud import with durable multipart checkpoints, retention/archive/hold, separate-bucket backup and checksum-verified recovery. Pricing V2 is unchanged. See [storage-guide.md](storage-guide.md).

# 1.5.0 — 2026-10-04

Added resumable bulk manifests for workloads up to 100,000 items, immutable 1–100 item manifest pages, bounded incremental child admission, authenticated paginated item/output views, storage-aware admission and `GET /v1/storage`, resume after storage/auth/credit/capacity pauses, failed-item-only retry, durable scheduler/recovery state, provider-intent reconciliation, and fair rotation across companies. Normal 100-item batches remain supported. Current processing ceiling remains 4 active platform jobs globally and up to 4 for one company when capacity is available.

# 1.4.0 + Pricing V2 — 2026-10-03

Shared canonical pricing for web/API/billing; new operation rates, bonus packs and Enterprise plan. GET /v1/pricing exposes the full catalog. OpenAI document processing and AssemblyAI speech processing use durable provider retry queues and checkpoints. Native-word JSON and anonymous speaker segments are available for Transcribe. Existing quoted jobs, checkouts and purchased subscriptions retain their original credit offers.

# 1.2.0 — 2026-10-02

First-class batch estimates, atomic credit reservations, per-item progress/results, partial completion, ZIP archives, failed-item retry, batch/item/both webhooks and dashboard batch mode. Retry idempotency is parent-bound. Terminal polling preserves retention timestamps; expired ZIP files return 410. Database contexts now close connections after commit/rollback to prevent file descriptor exhaustion. Existing /v1/jobs endpoints remain available.

# Changelog

## Developer kit 1.1.0 — 2026-10-02

Initial public kit for the deployed API 1.1.0 under /v1. Includes the live OpenAPI contract, current shared-wallet credits, Python/Node examples, synthetic invoice, Postman collection, webhook verification and documented limits.

Batch processing is available since 1.2.0. General multi-operation chaining is not currently available.

