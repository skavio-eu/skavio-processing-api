# 1.4.0 + Pricing V2 — 2026-10-03

Shared canonical pricing for web/API/billing; new operation rates, bonus packs and Enterprise plan. GET /v1/pricing exposes the full catalog. OpenAI document processing and AssemblyAI speech processing use durable provider retry queues and checkpoints. Native-word JSON and anonymous speaker segments are available for Transcribe. Existing quoted jobs, checkouts and purchased subscriptions retain their original credit offers.

# 1.2.0 — 2026-10-02

First-class batch estimates, atomic credit reservations, per-item progress/results, partial completion, ZIP archives, failed-item retry, batch/item/both webhooks and dashboard batch mode. Retry idempotency is parent-bound. Terminal polling preserves retention timestamps; expired ZIP files return 410. Database contexts now close connections after commit/rollback to prevent file descriptor exhaustion. Existing /v1/jobs endpoints remain available.

# Changelog

## Developer kit 1.1.0 — 2026-10-02

Initial public kit for the deployed API 1.1.0 under /v1. Includes the live OpenAPI contract, current shared-wallet credits, Python/Node examples, synthetic invoice, Postman collection, webhook verification and documented limits.

Batch processing is available since 1.2.0. General multi-operation chaining is not currently available.

