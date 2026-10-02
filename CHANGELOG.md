# 1.2.0 — 2026-10-02

First-class batch estimates, atomic credit reservations, per-item progress/results, partial completion, ZIP archives, failed-item retry, batch/item/both webhooks and dashboard batch mode. Retry idempotency is parent-bound. Terminal polling preserves retention timestamps; expired ZIP files return 410. Database contexts now close connections after commit/rollback to prevent file descriptor exhaustion. Existing /v1/jobs endpoints remain available.

# Changelog

## Developer kit 1.1.0 — 2026-10-02

Initial public kit for the deployed API 1.1.0 under /v1. Includes the live OpenAPI contract, current shared-wallet credits, Python/Node examples, synthetic invoice, Postman collection, webhook verification and documented limits.

Future batch processing and operation chaining are roadmap items, not available capabilities.

