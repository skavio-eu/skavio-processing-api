## Batch processing — API 1.2.0

Submit up to 100 items for any advertised operation through the same processing pipeline. A batch uses one operation/options set and creates ordinary child jobs. Processing remains one active job per company and three globally; a batch does not promise 100 parallel executions.

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

