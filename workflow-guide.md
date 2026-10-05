# Skavio API 1.9.0 — durable workflow pipelines

API 1.9.0 supports durable multi-step workflows. Original extraction templates under /v1/workflows remain unchanged.

## Start a run

Upload via /v1/uploads, then POST /v1/workflow-runs with Idempotency-Key (8–128 safe characters):

    {
      "pipeline": {
        "name": "Extract, review, archive",
        "steps": [
          {"id": "extract", "operation": "flow-extract",
           "fields": ["supplier", "invoice_number", "currency", "total"]},
          {"id": "check", "kind": "review"},
          {"id": "archive", "kind": "archive", "retention_days": 365}
        ]
      },
      "upload_ids": ["UPLOAD_ID"],
      "max_credits": 100
    }

HTTP 202 means accepted, not completed. Poll GET /v1/workflow-runs/{run_id} or Dashboard → Pipelines. A process uses the preceding process output unless source_step names another earlier process. For multiple outputs, a process requires file_name, e.g. data.csv. Archive applies to all selected upstream files unless file_name is specified; archive must be last. Maximum 20 steps and 50 open runs per company.

POST /v1/pipelines saves an immutable template. A run with pipeline_id snapshots its definition. DELETE disables future use without changing accepted runs. Saving/disabling templates requires a same-origin administrator session. Options may not contain nested credentials/passwords.

## Checkpoints, billing and retention

Each process is a normal job with existing scheduler concurrency, provider routing/retries, tenant isolation, wallet, key policy and monthly budget. Credits reserve only when a step dispatches. The hard cap includes charged and reserved credits, not an upfront whole-run estimate; downstream metadata is measured from real output.

Completed steps never replay on resume. S3 output promotion is idempotent; reservation, child link and ledger commit together. Provider retries stay within the job. Permanent child failure ends the workflow. No manual failed-step replay, branching or workflow webhook events in this release; poll state.

Access/source/result changes are checked before dispatch. Revoked/expired keys prevent new steps. Administrator resume can set max_credits or an owned active key_id; accepted jobs keep original accounting attribution. Original/promoted inputs and current results are pinned while open; terminal runs return to normal retention. Add archive for longer retention.

Storage Fabric must be configured. Local-only mode shows the editor but rejects run creation. Arbitrary API-created template options/source references are preserved by the Dashboard editor, whose default form exposes fields, instructions and filenames.

## Review and controls

POST /v1/workflow-runs/{run_id}/approve with {"approved": true, "note": "optional"} requires an administrator session and Idempotency-Key. First correct/approve flagged extraction documents with existing /v1/jobs/{job_id}/review. Output revisions are allowed only at the pending workflow review gate, never after downstream consumption. Members retain existing document-correction permissions; only administrators release gates.

Pause/resume/cancel require idempotency keys. Pause stops future dispatch; accepted work finishes. Cancel stops future steps with normal billing for accepted work. Standalone child cancel is rejected: use parent controls. Resume with {} continues a pause; changing cap/key requires an administrator. Work is not force-aborted.

States: queued, processing, waiting_review, pause_requested, paused, stopping, completed, failed, cancelled. Pause reasons include workflow_cap_exceeded, budget_exceeded, insufficient_credits, processing_access_denied and storage_unavailable. Resolve cause before resuming. Dashboard allows admin cap increases; key replacement uses admin-session API.

## Verification and deployment

Offline tests use synthetic accounts/documents, fake engines and mocked S3 to verify orchestration/accounting. Separate production release smoke tests verify real managed processing and S3; neither is a throughput benchmark or SLA.

This guide describes the published API 1.9.0 contract. See the live documentation and capabilities for current deployment limits. Processing credits and storage policies apply to workflow runs.
