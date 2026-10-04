export default {
  "estimate_batch_v1_batches_estimate_post": {
    "method": "POST",
    "path": "/v1/batches/estimate",
    "idempotency_required": false,
    "path_parameters": []
  },
  "submit_batch_v1_batches_post": {
    "method": "POST",
    "path": "/v1/batches",
    "idempotency_required": true,
    "path_parameters": []
  },
  "batches_v1_batches_get": {
    "method": "GET",
    "path": "/v1/batches",
    "idempotency_required": false,
    "path_parameters": []
  },
  "batch_v1_batches__batch_id__get": {
    "method": "GET",
    "path": "/v1/batches/{batch_id}",
    "idempotency_required": false,
    "path_parameters": [
      "batch_id"
    ]
  },
  "delete_batch_v1_batches__batch_id__delete": {
    "method": "DELETE",
    "path": "/v1/batches/{batch_id}",
    "idempotency_required": false,
    "path_parameters": [
      "batch_id"
    ]
  },
  "batch_zip_v1_batches__batch_id__results_zip_get": {
    "method": "GET",
    "path": "/v1/batches/{batch_id}/results.zip",
    "idempotency_required": false,
    "path_parameters": [
      "batch_id"
    ]
  },
  "retry_failed_v1_batches__batch_id__retry_failed_post": {
    "method": "POST",
    "path": "/v1/batches/{batch_id}/retry-failed",
    "idempotency_required": true,
    "path_parameters": [
      "batch_id"
    ]
  },
  "create_v1_bulks_post": {
    "method": "POST",
    "path": "/v1/bulks",
    "idempotency_required": true,
    "path_parameters": []
  },
  "listing_v1_bulks_get": {
    "method": "GET",
    "path": "/v1/bulks",
    "idempotency_required": false,
    "path_parameters": []
  },
  "append_v1_bulks__bulk_id__manifest_put": {
    "method": "PUT",
    "path": "/v1/bulks/{bulk_id}/manifest",
    "idempotency_required": false,
    "path_parameters": [
      "bulk_id"
    ]
  },
  "seal_v1_bulks__bulk_id__seal_post": {
    "method": "POST",
    "path": "/v1/bulks/{bulk_id}/seal",
    "idempotency_required": false,
    "path_parameters": [
      "bulk_id"
    ]
  },
  "status_v1_bulks__bulk_id__get": {
    "method": "GET",
    "path": "/v1/bulks/{bulk_id}",
    "idempotency_required": false,
    "path_parameters": [
      "bulk_id"
    ]
  },
  "cancel_v1_bulks__bulk_id__delete": {
    "method": "DELETE",
    "path": "/v1/bulks/{bulk_id}",
    "idempotency_required": false,
    "path_parameters": [
      "bulk_id"
    ]
  },
  "items_v1_bulks__bulk_id__items_get": {
    "method": "GET",
    "path": "/v1/bulks/{bulk_id}/items",
    "idempotency_required": false,
    "path_parameters": [
      "bulk_id"
    ]
  },
  "outputs_v1_bulks__bulk_id__outputs_get": {
    "method": "GET",
    "path": "/v1/bulks/{bulk_id}/outputs",
    "idempotency_required": false,
    "path_parameters": [
      "bulk_id"
    ]
  },
  "resume_v1_bulks__bulk_id__resume_post": {
    "method": "POST",
    "path": "/v1/bulks/{bulk_id}/resume",
    "idempotency_required": false,
    "path_parameters": [
      "bulk_id"
    ]
  },
  "retry_v1_bulks__bulk_id__retry_failed_post": {
    "method": "POST",
    "path": "/v1/bulks/{bulk_id}/retry-failed",
    "idempotency_required": true,
    "path_parameters": [
      "bulk_id"
    ]
  },
  "list_pipelines_v1_pipelines_get": {
    "method": "GET",
    "path": "/v1/pipelines",
    "idempotency_required": false,
    "path_parameters": []
  },
  "create_pipeline_v1_pipelines_post": {
    "method": "POST",
    "path": "/v1/pipelines",
    "idempotency_required": true,
    "path_parameters": []
  },
  "delete_pipeline_v1_pipelines__pipeline_id__delete": {
    "method": "DELETE",
    "path": "/v1/pipelines/{pipeline_id}",
    "idempotency_required": true,
    "path_parameters": [
      "pipeline_id"
    ]
  },
  "create_run_v1_workflow_runs_post": {
    "method": "POST",
    "path": "/v1/workflow-runs",
    "idempotency_required": true,
    "path_parameters": []
  },
  "list_runs_v1_workflow_runs_get": {
    "method": "GET",
    "path": "/v1/workflow-runs",
    "idempotency_required": false,
    "path_parameters": []
  },
  "get_run_v1_workflow_runs__run_id__get": {
    "method": "GET",
    "path": "/v1/workflow-runs/{run_id}",
    "idempotency_required": false,
    "path_parameters": [
      "run_id"
    ]
  },
  "pause_v1_workflow_runs__run_id__pause_post": {
    "method": "POST",
    "path": "/v1/workflow-runs/{run_id}/pause",
    "idempotency_required": true,
    "path_parameters": [
      "run_id"
    ]
  },
  "cancel_v1_workflow_runs__run_id__cancel_post": {
    "method": "POST",
    "path": "/v1/workflow-runs/{run_id}/cancel",
    "idempotency_required": true,
    "path_parameters": [
      "run_id"
    ]
  },
  "resume_v1_workflow_runs__run_id__resume_post": {
    "method": "POST",
    "path": "/v1/workflow-runs/{run_id}/resume",
    "idempotency_required": true,
    "path_parameters": [
      "run_id"
    ]
  },
  "approve_v1_workflow_runs__run_id__approve_post": {
    "method": "POST",
    "path": "/v1/workflow-runs/{run_id}/approve",
    "idempotency_required": true,
    "path_parameters": [
      "run_id"
    ]
  },
  "public_pricing_v1_pricing_get": {
    "method": "GET",
    "path": "/v1/pricing",
    "idempotency_required": false,
    "path_parameters": []
  },
  "capabilities_v1_capabilities_get": {
    "method": "GET",
    "path": "/v1/capabilities",
    "idempotency_required": false,
    "path_parameters": []
  },
  "storage_status_v1_storage_get": {
    "method": "GET",
    "path": "/v1/storage",
    "idempotency_required": false,
    "path_parameters": []
  },
  "wallet_v1_wallet_get": {
    "method": "GET",
    "path": "/v1/wallet",
    "idempotency_required": false,
    "path_parameters": []
  },
  "keys_v1_keys_get": {
    "method": "GET",
    "path": "/v1/keys",
    "idempotency_required": false,
    "path_parameters": []
  },
  "new_key_v1_keys_post": {
    "method": "POST",
    "path": "/v1/keys",
    "idempotency_required": false,
    "path_parameters": []
  },
  "revoke_v1_keys__key_id__delete": {
    "method": "DELETE",
    "path": "/v1/keys/{key_id}",
    "idempotency_required": false,
    "path_parameters": [
      "key_id"
    ]
  },
  "uploads_v1_uploads_post": {
    "method": "POST",
    "path": "/v1/uploads",
    "idempotency_required": false,
    "path_parameters": []
  },
  "delete_upload_v1_uploads__upload_id__delete": {
    "method": "DELETE",
    "path": "/v1/uploads/{upload_id}",
    "idempotency_required": false,
    "path_parameters": [
      "upload_id"
    ]
  },
  "estimate_v1_estimate_post": {
    "method": "POST",
    "path": "/v1/estimate",
    "idempotency_required": false,
    "path_parameters": []
  },
  "submit_v1_jobs_post": {
    "method": "POST",
    "path": "/v1/jobs",
    "idempotency_required": true,
    "path_parameters": []
  },
  "jobs_v1_jobs_get": {
    "method": "GET",
    "path": "/v1/jobs",
    "idempotency_required": false,
    "path_parameters": []
  },
  "job_v1_jobs__job_id__get": {
    "method": "GET",
    "path": "/v1/jobs/{job_id}",
    "idempotency_required": false,
    "path_parameters": [
      "job_id"
    ]
  },
  "delete_job_v1_jobs__job_id__delete": {
    "method": "DELETE",
    "path": "/v1/jobs/{job_id}",
    "idempotency_required": false,
    "path_parameters": [
      "job_id"
    ]
  },
  "result_v1_jobs__job_id__results__result_id__get": {
    "method": "GET",
    "path": "/v1/jobs/{job_id}/results/{result_id}",
    "idempotency_required": false,
    "path_parameters": [
      "job_id",
      "result_id"
    ]
  },
  "workflows_v1_workflows_get": {
    "method": "GET",
    "path": "/v1/workflows",
    "idempotency_required": false,
    "path_parameters": []
  },
  "save_workflow_v1_workflows_post": {
    "method": "POST",
    "path": "/v1/workflows",
    "idempotency_required": false,
    "path_parameters": []
  },
  "delete_workflow_v1_workflows__workflow_id__delete": {
    "method": "DELETE",
    "path": "/v1/workflows/{workflow_id}",
    "idempotency_required": false,
    "path_parameters": [
      "workflow_id"
    ]
  },
  "checkout_v1_billing_checkout_post": {
    "method": "POST",
    "path": "/v1/billing/checkout",
    "idempotency_required": false,
    "path_parameters": []
  },
  "confirm_v1_billing_confirm_post": {
    "method": "POST",
    "path": "/v1/billing/confirm",
    "idempotency_required": false,
    "path_parameters": []
  },
  "storage_usage_v1_storage_usage_get": {
    "method": "GET",
    "path": "/v1/storage/usage",
    "idempotency_required": false,
    "path_parameters": []
  },
  "get_storage_policy_v1_storage_policy_get": {
    "method": "GET",
    "path": "/v1/storage/policy",
    "idempotency_required": false,
    "path_parameters": []
  },
  "patch_storage_policy_v1_storage_policy_patch": {
    "method": "PATCH",
    "path": "/v1/storage/policy",
    "idempotency_required": false,
    "path_parameters": []
  },
  "direct_upload_v1_storage_direct_uploads_post": {
    "method": "POST",
    "path": "/v1/storage/direct-uploads",
    "idempotency_required": false,
    "path_parameters": []
  },
  "complete_direct_v1_storage_direct_uploads__session_id__complete_post": {
    "method": "POST",
    "path": "/v1/storage/direct-uploads/{session_id}/complete",
    "idempotency_required": false,
    "path_parameters": [
      "session_id"
    ]
  },
  "cloud_import_v1_storage_imports_post": {
    "method": "POST",
    "path": "/v1/storage/imports",
    "idempotency_required": false,
    "path_parameters": []
  },
  "import_status_v1_storage_imports__import_id__get": {
    "method": "GET",
    "path": "/v1/storage/imports/{import_id}",
    "idempotency_required": false,
    "path_parameters": [
      "import_id"
    ]
  },
  "objects_v1_storage_objects_get": {
    "method": "GET",
    "path": "/v1/storage/objects",
    "idempotency_required": false,
    "path_parameters": []
  },
  "object_status_v1_storage_objects__object_id__get": {
    "method": "GET",
    "path": "/v1/storage/objects/{object_id}",
    "idempotency_required": false,
    "path_parameters": [
      "object_id"
    ]
  },
  "object_delete_v1_storage_objects__object_id__delete": {
    "method": "DELETE",
    "path": "/v1/storage/objects/{object_id}",
    "idempotency_required": false,
    "path_parameters": [
      "object_id"
    ]
  },
  "object_download_v1_storage_objects__object_id__download_link_get": {
    "method": "GET",
    "path": "/v1/storage/objects/{object_id}/download-link",
    "idempotency_required": false,
    "path_parameters": [
      "object_id"
    ]
  },
  "object_backup_v1_storage_objects__object_id__backup_post": {
    "method": "POST",
    "path": "/v1/storage/objects/{object_id}/backup",
    "idempotency_required": false,
    "path_parameters": [
      "object_id"
    ]
  },
  "object_restore_backup_v1_storage_objects__object_id__restore_backup_post": {
    "method": "POST",
    "path": "/v1/storage/objects/{object_id}/restore-backup",
    "idempotency_required": false,
    "path_parameters": [
      "object_id"
    ]
  },
  "object_archive_v1_storage_objects__object_id__archive_post": {
    "method": "POST",
    "path": "/v1/storage/objects/{object_id}/archive",
    "idempotency_required": false,
    "path_parameters": [
      "object_id"
    ]
  },
  "object_restore_v1_storage_objects__object_id__restore_post": {
    "method": "POST",
    "path": "/v1/storage/objects/{object_id}/restore",
    "idempotency_required": false,
    "path_parameters": [
      "object_id"
    ]
  },
  "object_hold_v1_storage_objects__object_id__hold_post": {
    "method": "POST",
    "path": "/v1/storage/objects/{object_id}/hold",
    "idempotency_required": false,
    "path_parameters": [
      "object_id"
    ]
  },
  "storage_audit_v1_storage_audit_get": {
    "method": "GET",
    "path": "/v1/storage/audit",
    "idempotency_required": false,
    "path_parameters": []
  },
  "usage_v1_usage_get": {
    "method": "GET",
    "path": "/v1/usage",
    "idempotency_required": false,
    "path_parameters": []
  },
  "history_v1_usage_jobs_get": {
    "method": "GET",
    "path": "/v1/usage/jobs",
    "idempotency_required": false,
    "path_parameters": []
  },
  "payments_v1_usage_payments_get": {
    "method": "GET",
    "path": "/v1/usage/payments",
    "idempotency_required": false,
    "path_parameters": []
  },
  "export_v1_usage_export_csv_get": {
    "method": "GET",
    "path": "/v1/usage/export.csv",
    "idempotency_required": false,
    "path_parameters": []
  },
  "budgets_v1_budgets_get": {
    "method": "GET",
    "path": "/v1/budgets",
    "idempotency_required": false,
    "path_parameters": []
  },
  "set_budget_v1_budgets_put": {
    "method": "PUT",
    "path": "/v1/budgets",
    "idempotency_required": false,
    "path_parameters": []
  },
  "alerts_v1_alerts_get": {
    "method": "GET",
    "path": "/v1/alerts",
    "idempotency_required": false,
    "path_parameters": []
  },
  "key_policy_v1_keys__key_id__policy_put": {
    "method": "PUT",
    "path": "/v1/keys/{key_id}/policy",
    "idempotency_required": false,
    "path_parameters": [
      "key_id"
    ]
  },
  "get_key_policy_v1_keys__key_id__policy_get": {
    "method": "GET",
    "path": "/v1/keys/{key_id}/policy",
    "idempotency_required": false,
    "path_parameters": [
      "key_id"
    ]
  },
  "audit_v1_governance_audit_get": {
    "method": "GET",
    "path": "/v1/governance/audit",
    "idempotency_required": false,
    "path_parameters": []
  },
  "cancel_v1_jobs__job_id__cancel_post": {
    "method": "POST",
    "path": "/v1/jobs/{job_id}/cancel",
    "idempotency_required": false,
    "path_parameters": [
      "job_id"
    ]
  },
  "operations_v1_operations_get": {
    "method": "GET",
    "path": "/v1/operations",
    "idempotency_required": false,
    "path_parameters": []
  },
  "deliveries_v1_webhooks_deliveries_get": {
    "method": "GET",
    "path": "/v1/webhooks/deliveries",
    "idempotency_required": false,
    "path_parameters": []
  },
  "replay_v1_webhooks_deliveries__kind___delivery_id__replay_post": {
    "method": "POST",
    "path": "/v1/webhooks/deliveries/{kind}/{delivery_id}/replay",
    "idempotency_required": true,
    "path_parameters": [
      "kind",
      "delivery_id"
    ]
  },
  "webhooks_v1_webhooks_get": {
    "method": "GET",
    "path": "/v1/webhooks",
    "idempotency_required": false,
    "path_parameters": []
  },
  "create_v1_webhooks_post": {
    "method": "POST",
    "path": "/v1/webhooks",
    "idempotency_required": false,
    "path_parameters": []
  },
  "delete_v1_webhooks__webhook_id__delete": {
    "method": "DELETE",
    "path": "/v1/webhooks/{webhook_id}",
    "idempotency_required": false,
    "path_parameters": [
      "webhook_id"
    ]
  },
  "plans_v1_billing_plans_get": {
    "method": "GET",
    "path": "/v1/billing/plans",
    "idempotency_required": false,
    "path_parameters": []
  },
  "status_v1_billing_subscription_get": {
    "method": "GET",
    "path": "/v1/billing/subscription",
    "idempotency_required": false,
    "path_parameters": []
  },
  "subscribe_v1_billing_subscribe_post": {
    "method": "POST",
    "path": "/v1/billing/subscribe",
    "idempotency_required": false,
    "path_parameters": []
  },
  "portal_v1_billing_portal_post": {
    "method": "POST",
    "path": "/v1/billing/portal",
    "idempotency_required": false,
    "path_parameters": []
  },
  "confirm_v1_billing_subscription_confirm_post": {
    "method": "POST",
    "path": "/v1/billing/subscription/confirm",
    "idempotency_required": false,
    "path_parameters": []
  },
  "review_v1_jobs__job_id__review_post": {
    "method": "POST",
    "path": "/v1/jobs/{job_id}/review",
    "idempotency_required": false,
    "path_parameters": [
      "job_id"
    ]
  }
};
