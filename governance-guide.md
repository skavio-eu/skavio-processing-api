# Usage, budgets and recovery — API 1.7.0

All routes remain under `/v1`. Existing jobs, batches, bulks, Storage Fabric and Pricing V2 are supported. Company ownership and existing read/write key scopes still apply.

## Observe consumption

`GET /v1/usage?month=2026-10` separates charged credits and outstanding reservations, grouped by operation, web/API channel and API key. Optional `key_id` narrows attribution. `GET /v1/usage/jobs` supports a stable `cursor` and a limit of 1–200. `GET /v1/usage/export.csv` exports up to 10,000 rows with spreadsheet-formula protection. `GET /v1/usage/payments` separately lists monetary payment records; usage credits are not cash revenue or fiscal invoices.

The calendar month uses UTC **job admission time**, even if completion falls in a later month. Historical jobs cannot be reliably attributed to an API key before 1.7; their company attribution remains available.

## Control spending and keys

`GET /v1/budgets` returns company and key budgets. A signed-in company administrator can use `PUT /v1/budgets`:

```json
{"monthly_credits":100000,"warning_percent":80,"low_balance":1000,"key_id":null}
```

`null` monthly_credits removes a ceiling; zero blocks new charged work. A key_id applies the limit to that key. A limit below existing charges/reservations is rejected. Admission checks occur atomically with wallet reservation for standalone jobs, entire batches, incremental bulk child batches and paid web tools. HTTP 409 with error_code `budget_exceeded` rejects new work. Existing accepted work retains its quoted amount. Bulk processing pauses when its budget or original key policy prevents further child admission.

`GET /v1/keys/{key_id}/policy` reads key policy for a company administrator. Session-only `PUT` can set an aware future `expires_at` timestamp and permissions `read`, `upload`, `process`, `results`. These restrict existing scopes. Empty permissions deny all; null restores the original scope behavior. An API key cannot increase its own budget or permissions. Administrative writes require a same-origin administrator web session, not a Bearer token; use the dashboard or a properly configured session cookie.

## Handle operational issues

- `GET /v1/alerts`: persisted, deduplicated budget/low-balance warnings. The app checks periodically; this release does not send alert emails.
- `GET /v1/operations`: company queue state, ages, retry state and attention flags. Unknown ETA is not a throughput promise.
- `GET /v1/governance/audit`: administrator-visible policy changes, cancellations and webhook replay history.
- `POST /v1/jobs/{job_id}/cancel`: cancels only an unstarted standalone queued job; refunds/releases its reservation once. Accepted provider work, running jobs, retries and batch children cannot be cancelled through this route. Cancellation is represented as terminal failed with a cancellation stage/error for compatibility and does not count as a processing failure.
- `GET /v1/webhooks/deliveries?kind=job`: administrator-visible job, batch or bulk delivery history, bounded pagination.
- `POST /v1/webhooks/deliveries/{kind}/{delivery_id}/replay`: same-origin administrator session plus a persisted Idempotency-Key. Only exhausted failed deliveries with a stored original payload and an active owned hook can be replayed. Historical payloads unavailable for safe replay return 410. At most ten manual replays, with a sixty-second cooldown. A retry of the same administrative request must keep its key. Processing and billing do not run again.

Webhook receivers still verify HMAC on raw bytes and deduplicate event IDs; delivery is at least once. Sources/results still follow Storage Fabric retention and hold rules. Always follow the authenticated result path supplied by the API; do not invent a URL from a filename.

## Error correlation and compatibility

Errors retain `detail` and add `error_code`, `request_id`, `retryable`. Responses expose a server-generated X-Request-Id. Use error codes for decisions and retain request IDs for private support; never log keys, PDF passwords or customer documents. Validation errors do not echo secret request input. A retryable flag is not permission to blindly repeat a charged action: preserve the exact request and its original Idempotency-Key.

There is no general multi-operation chaining, full SDK, provider-side accepted-job cancellation or guaranteed throughput in this release. Processing limits remain shared across plans. Czech, German and English dashboard/developer-guide additions support mobile and desktop.

## API 1.9.0 controls and notifications

Bulk pause and cancel require Idempotency-Key and enforce company isolation. Pause prevents new child admission; accepted jobs drain and settle once. Cancel is final and prevents further dispatch. GET /v1/notifications and GET /v1/notifications/settings are tenant-scoped. PUT /v1/notifications/settings requires a company administrator web session. Notifications are disabled by default; email requires configured transport. Frozen events are deduplicated and retried within a bounded delivery window. Email follows the current company billing address and supports cs/de/en.
