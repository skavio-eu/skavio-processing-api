export default {
  "alerts_v1_alerts_get": {
    "admin_session_required": false,
    "idempotency_required": false,
    "method": "GET",
    "path": "/v1/alerts",
    "path_parameters": [],
    "security": [
      {
        "BearerKey": []
      },
      {
        "WebSession": []
      }
    ]
  },
  "append_v1_bulks__bulk_id__manifest_put": {
    "admin_session_required": false,
    "idempotency_required": false,
    "method": "PUT",
    "path": "/v1/bulks/{bulk_id}/manifest",
    "path_parameters": [
      "bulk_id"
    ],
    "security": [
      {
        "BearerKey": []
      },
      {
        "WebSession": []
      }
    ]
  },
  "approve_v1_workflow_runs__run_id__approve_post": {
    "admin_session_required": true,
    "idempotency_required": true,
    "method": "POST",
    "path": "/v1/workflow-runs/{run_id}/approve",
    "path_parameters": [
      "run_id"
    ],
    "security": [
      {
        "WebSession": []
      }
    ]
  },
  "audit_v1_governance_audit_get": {
    "admin_session_required": true,
    "idempotency_required": false,
    "method": "GET",
    "path": "/v1/governance/audit",
    "path_parameters": [],
    "security": [
      {
        "WebSession": []
      }
    ]
  },
  "batch_v1_batches__batch_id__get": {
    "admin_session_required": false,
    "idempotency_required": false,
    "method": "GET",
    "path": "/v1/batches/{batch_id}",
    "path_parameters": [
      "batch_id"
    ],
    "security": [
      {
        "BearerKey": []
      },
      {
        "WebSession": []
      }
    ]
  },
  "batch_zip_v1_batches__batch_id__results_zip_get": {
    "admin_session_required": false,
    "idempotency_required": false,
    "method": "GET",
    "path": "/v1/batches/{batch_id}/results.zip",
    "path_parameters": [
      "batch_id"
    ],
    "security": [
      {
        "BearerKey": []
      },
      {
        "WebSession": []
      }
    ]
  },
  "batches_v1_batches_get": {
    "admin_session_required": false,
    "idempotency_required": false,
    "method": "GET",
    "path": "/v1/batches",
    "path_parameters": [],
    "security": [
      {
        "BearerKey": []
      },
      {
        "WebSession": []
      }
    ]
  },
  "budgets_v1_budgets_get": {
    "admin_session_required": false,
    "idempotency_required": false,
    "method": "GET",
    "path": "/v1/budgets",
    "path_parameters": [],
    "security": [
      {
        "BearerKey": []
      },
      {
        "WebSession": []
      }
    ]
  },
  "cancel_control_v1_bulks__bulk_id__cancel_post": {
    "admin_session_required": false,
    "idempotency_required": true,
    "method": "POST",
    "path": "/v1/bulks/{bulk_id}/cancel",
    "path_parameters": [
      "bulk_id"
    ],
    "security": [
      {
        "BearerKey": []
      },
      {
        "WebSession": []
      }
    ]
  },
  "cancel_v1_bulks__bulk_id__delete": {
    "admin_session_required": false,
    "idempotency_required": false,
    "method": "DELETE",
    "path": "/v1/bulks/{bulk_id}",
    "path_parameters": [
      "bulk_id"
    ],
    "security": [
      {
        "BearerKey": []
      },
      {
        "WebSession": []
      }
    ]
  },
  "cancel_v1_jobs__job_id__cancel_post": {
    "admin_session_required": false,
    "idempotency_required": false,
    "method": "POST",
    "path": "/v1/jobs/{job_id}/cancel",
    "path_parameters": [
      "job_id"
    ],
    "security": [
      {
        "BearerKey": []
      },
      {
        "WebSession": []
      }
    ]
  },
  "cancel_v1_workflow_runs__run_id__cancel_post": {
    "admin_session_required": false,
    "idempotency_required": true,
    "method": "POST",
    "path": "/v1/workflow-runs/{run_id}/cancel",
    "path_parameters": [
      "run_id"
    ],
    "security": [
      {
        "BearerKey": []
      },
      {
        "WebSession": []
      }
    ]
  },
  "capabilities_v1_capabilities_get": {
    "admin_session_required": false,
    "idempotency_required": false,
    "method": "GET",
    "path": "/v1/capabilities",
    "path_parameters": [],
    "security": []
  },
  "checkout_v1_billing_checkout_post": {
    "admin_session_required": true,
    "idempotency_required": false,
    "method": "POST",
    "path": "/v1/billing/checkout",
    "path_parameters": [],
    "security": [
      {
        "WebSession": []
      }
    ]
  },
  "cloud_import_v1_storage_imports_post": {
    "admin_session_required": false,
    "idempotency_required": false,
    "method": "POST",
    "path": "/v1/storage/imports",
    "path_parameters": [],
    "security": [
      {
        "BearerKey": []
      },
      {
        "WebSession": []
      }
    ]
  },
  "complete_direct_v1_storage_direct_uploads__session_id__complete_post": {
    "admin_session_required": false,
    "idempotency_required": false,
    "method": "POST",
    "path": "/v1/storage/direct-uploads/{session_id}/complete",
    "path_parameters": [
      "session_id"
    ],
    "security": [
      {
        "BearerKey": []
      },
      {
        "WebSession": []
      }
    ]
  },
  "confirm_v1_billing_confirm_post": {
    "admin_session_required": true,
    "idempotency_required": false,
    "method": "POST",
    "path": "/v1/billing/confirm",
    "path_parameters": [],
    "security": [
      {
        "WebSession": []
      }
    ]
  },
  "confirm_v1_billing_subscription_confirm_post": {
    "admin_session_required": true,
    "idempotency_required": false,
    "method": "POST",
    "path": "/v1/billing/subscription/confirm",
    "path_parameters": [],
    "security": [
      {
        "WebSession": []
      }
    ]
  },
  "create_pipeline_v1_pipelines_post": {
    "admin_session_required": true,
    "idempotency_required": true,
    "method": "POST",
    "path": "/v1/pipelines",
    "path_parameters": [],
    "security": [
      {
        "WebSession": []
      }
    ]
  },
  "create_run_v1_workflow_runs_post": {
    "admin_session_required": false,
    "idempotency_required": true,
    "method": "POST",
    "path": "/v1/workflow-runs",
    "path_parameters": [],
    "security": [
      {
        "BearerKey": []
      },
      {
        "WebSession": []
      }
    ]
  },
  "create_v1_bulks_post": {
    "admin_session_required": false,
    "idempotency_required": true,
    "method": "POST",
    "path": "/v1/bulks",
    "path_parameters": [],
    "security": [
      {
        "BearerKey": []
      },
      {
        "WebSession": []
      }
    ]
  },
  "create_v1_webhooks_post": {
    "admin_session_required": true,
    "idempotency_required": false,
    "method": "POST",
    "path": "/v1/webhooks",
    "path_parameters": [],
    "security": [
      {
        "WebSession": []
      }
    ]
  },
  "delete_batch_v1_batches__batch_id__delete": {
    "admin_session_required": false,
    "idempotency_required": false,
    "method": "DELETE",
    "path": "/v1/batches/{batch_id}",
    "path_parameters": [
      "batch_id"
    ],
    "security": [
      {
        "BearerKey": []
      },
      {
        "WebSession": []
      }
    ]
  },
  "delete_job_v1_jobs__job_id__delete": {
    "admin_session_required": false,
    "idempotency_required": false,
    "method": "DELETE",
    "path": "/v1/jobs/{job_id}",
    "path_parameters": [
      "job_id"
    ],
    "security": [
      {
        "BearerKey": []
      },
      {
        "WebSession": []
      }
    ]
  },
  "delete_pipeline_v1_pipelines__pipeline_id__delete": {
    "admin_session_required": true,
    "idempotency_required": true,
    "method": "DELETE",
    "path": "/v1/pipelines/{pipeline_id}",
    "path_parameters": [
      "pipeline_id"
    ],
    "security": [
      {
        "WebSession": []
      }
    ]
  },
  "delete_upload_v1_uploads__upload_id__delete": {
    "admin_session_required": false,
    "idempotency_required": false,
    "method": "DELETE",
    "path": "/v1/uploads/{upload_id}",
    "path_parameters": [
      "upload_id"
    ],
    "security": [
      {
        "BearerKey": []
      },
      {
        "WebSession": []
      }
    ]
  },
  "delete_v1_webhooks__webhook_id__delete": {
    "admin_session_required": true,
    "idempotency_required": false,
    "method": "DELETE",
    "path": "/v1/webhooks/{webhook_id}",
    "path_parameters": [
      "webhook_id"
    ],
    "security": [
      {
        "WebSession": []
      }
    ]
  },
  "delete_workflow_v1_workflows__workflow_id__delete": {
    "admin_session_required": true,
    "idempotency_required": false,
    "method": "DELETE",
    "path": "/v1/workflows/{workflow_id}",
    "path_parameters": [
      "workflow_id"
    ],
    "security": [
      {
        "WebSession": []
      }
    ]
  },
  "deliveries_v1_webhooks_deliveries_get": {
    "admin_session_required": true,
    "idempotency_required": false,
    "method": "GET",
    "path": "/v1/webhooks/deliveries",
    "path_parameters": [],
    "security": [
      {
        "WebSession": []
      }
    ]
  },
  "direct_upload_v1_storage_direct_uploads_post": {
    "admin_session_required": false,
    "idempotency_required": false,
    "method": "POST",
    "path": "/v1/storage/direct-uploads",
    "path_parameters": [],
    "security": [
      {
        "BearerKey": []
      },
      {
        "WebSession": []
      }
    ]
  },
  "estimate_batch_v1_batches_estimate_post": {
    "admin_session_required": false,
    "idempotency_required": false,
    "method": "POST",
    "path": "/v1/batches/estimate",
    "path_parameters": [],
    "security": [
      {
        "BearerKey": []
      },
      {
        "WebSession": []
      }
    ]
  },
  "estimate_v1_estimate_post": {
    "admin_session_required": false,
    "idempotency_required": false,
    "method": "POST",
    "path": "/v1/estimate",
    "path_parameters": [],
    "security": [
      {
        "BearerKey": []
      },
      {
        "WebSession": []
      }
    ]
  },
  "export_v1_usage_export_csv_get": {
    "admin_session_required": false,
    "idempotency_required": false,
    "method": "GET",
    "path": "/v1/usage/export.csv",
    "path_parameters": [],
    "security": [
      {
        "BearerKey": []
      },
      {
        "WebSession": []
      }
    ]
  },
  "get_key_policy_v1_keys__key_id__policy_get": {
    "admin_session_required": true,
    "idempotency_required": false,
    "method": "GET",
    "path": "/v1/keys/{key_id}/policy",
    "path_parameters": [
      "key_id"
    ],
    "security": [
      {
        "WebSession": []
      }
    ]
  },
  "get_run_v1_workflow_runs__run_id__get": {
    "admin_session_required": false,
    "idempotency_required": false,
    "method": "GET",
    "path": "/v1/workflow-runs/{run_id}",
    "path_parameters": [
      "run_id"
    ],
    "security": [
      {
        "BearerKey": []
      },
      {
        "WebSession": []
      }
    ]
  },
  "get_storage_policy_v1_storage_policy_get": {
    "admin_session_required": false,
    "idempotency_required": false,
    "method": "GET",
    "path": "/v1/storage/policy",
    "path_parameters": [],
    "security": [
      {
        "BearerKey": []
      },
      {
        "WebSession": []
      }
    ]
  },
  "history_v1_usage_jobs_get": {
    "admin_session_required": false,
    "idempotency_required": false,
    "method": "GET",
    "path": "/v1/usage/jobs",
    "path_parameters": [],
    "security": [
      {
        "BearerKey": []
      },
      {
        "WebSession": []
      }
    ]
  },
  "import_status_v1_storage_imports__import_id__get": {
    "admin_session_required": false,
    "idempotency_required": false,
    "method": "GET",
    "path": "/v1/storage/imports/{import_id}",
    "path_parameters": [
      "import_id"
    ],
    "security": [
      {
        "BearerKey": []
      },
      {
        "WebSession": []
      }
    ]
  },
  "items_v1_bulks__bulk_id__items_get": {
    "admin_session_required": false,
    "idempotency_required": false,
    "method": "GET",
    "path": "/v1/bulks/{bulk_id}/items",
    "path_parameters": [
      "bulk_id"
    ],
    "security": [
      {
        "BearerKey": []
      },
      {
        "WebSession": []
      }
    ]
  },
  "job_v1_jobs__job_id__get": {
    "admin_session_required": false,
    "idempotency_required": false,
    "method": "GET",
    "path": "/v1/jobs/{job_id}",
    "path_parameters": [
      "job_id"
    ],
    "security": [
      {
        "BearerKey": []
      },
      {
        "WebSession": []
      }
    ]
  },
  "jobs_v1_jobs_get": {
    "admin_session_required": false,
    "idempotency_required": false,
    "method": "GET",
    "path": "/v1/jobs",
    "path_parameters": [],
    "security": [
      {
        "BearerKey": []
      },
      {
        "WebSession": []
      }
    ]
  },
  "key_policy_v1_keys__key_id__policy_put": {
    "admin_session_required": true,
    "idempotency_required": false,
    "method": "PUT",
    "path": "/v1/keys/{key_id}/policy",
    "path_parameters": [
      "key_id"
    ],
    "security": [
      {
        "WebSession": []
      }
    ]
  },
  "keys_v1_keys_get": {
    "admin_session_required": true,
    "idempotency_required": false,
    "method": "GET",
    "path": "/v1/keys",
    "path_parameters": [],
    "security": [
      {
        "WebSession": []
      }
    ]
  },
  "list_pipelines_v1_pipelines_get": {
    "admin_session_required": false,
    "idempotency_required": false,
    "method": "GET",
    "path": "/v1/pipelines",
    "path_parameters": [],
    "security": [
      {
        "BearerKey": []
      },
      {
        "WebSession": []
      }
    ]
  },
  "list_runs_v1_workflow_runs_get": {
    "admin_session_required": false,
    "idempotency_required": false,
    "method": "GET",
    "path": "/v1/workflow-runs",
    "path_parameters": [],
    "security": [
      {
        "BearerKey": []
      },
      {
        "WebSession": []
      }
    ]
  },
  "listing_v1_bulks_get": {
    "admin_session_required": false,
    "idempotency_required": false,
    "method": "GET",
    "path": "/v1/bulks",
    "path_parameters": [],
    "security": [
      {
        "BearerKey": []
      },
      {
        "WebSession": []
      }
    ]
  },
  "listing_v1_notifications_get": {
    "admin_session_required": false,
    "idempotency_required": false,
    "method": "GET",
    "path": "/v1/notifications",
    "path_parameters": [],
    "security": [
      {
        "BearerKey": []
      },
      {
        "WebSession": []
      }
    ]
  },
  "new_key_v1_keys_post": {
    "admin_session_required": true,
    "idempotency_required": false,
    "method": "POST",
    "path": "/v1/keys",
    "path_parameters": [],
    "security": [
      {
        "WebSession": []
      }
    ]
  },
  "object_archive_v1_storage_objects__object_id__archive_post": {
    "admin_session_required": false,
    "idempotency_required": false,
    "method": "POST",
    "path": "/v1/storage/objects/{object_id}/archive",
    "path_parameters": [
      "object_id"
    ],
    "security": [
      {
        "BearerKey": []
      },
      {
        "WebSession": []
      }
    ]
  },
  "object_backup_v1_storage_objects__object_id__backup_post": {
    "admin_session_required": true,
    "idempotency_required": false,
    "method": "POST",
    "path": "/v1/storage/objects/{object_id}/backup",
    "path_parameters": [
      "object_id"
    ],
    "security": [
      {
        "WebSession": []
      }
    ]
  },
  "object_delete_v1_storage_objects__object_id__delete": {
    "admin_session_required": false,
    "idempotency_required": false,
    "method": "DELETE",
    "path": "/v1/storage/objects/{object_id}",
    "path_parameters": [
      "object_id"
    ],
    "security": [
      {
        "BearerKey": []
      },
      {
        "WebSession": []
      }
    ]
  },
  "object_download_v1_storage_objects__object_id__download_link_get": {
    "admin_session_required": false,
    "idempotency_required": false,
    "method": "GET",
    "path": "/v1/storage/objects/{object_id}/download-link",
    "path_parameters": [
      "object_id"
    ],
    "security": [
      {
        "BearerKey": []
      },
      {
        "WebSession": []
      }
    ]
  },
  "object_hold_v1_storage_objects__object_id__hold_post": {
    "admin_session_required": true,
    "idempotency_required": false,
    "method": "POST",
    "path": "/v1/storage/objects/{object_id}/hold",
    "path_parameters": [
      "object_id"
    ],
    "security": [
      {
        "WebSession": []
      }
    ]
  },
  "object_restore_backup_v1_storage_objects__object_id__restore_backup_post": {
    "admin_session_required": true,
    "idempotency_required": false,
    "method": "POST",
    "path": "/v1/storage/objects/{object_id}/restore-backup",
    "path_parameters": [
      "object_id"
    ],
    "security": [
      {
        "WebSession": []
      }
    ]
  },
  "object_restore_v1_storage_objects__object_id__restore_post": {
    "admin_session_required": false,
    "idempotency_required": false,
    "method": "POST",
    "path": "/v1/storage/objects/{object_id}/restore",
    "path_parameters": [
      "object_id"
    ],
    "security": [
      {
        "BearerKey": []
      },
      {
        "WebSession": []
      }
    ]
  },
  "object_status_v1_storage_objects__object_id__get": {
    "admin_session_required": false,
    "idempotency_required": false,
    "method": "GET",
    "path": "/v1/storage/objects/{object_id}",
    "path_parameters": [
      "object_id"
    ],
    "security": [
      {
        "BearerKey": []
      },
      {
        "WebSession": []
      }
    ]
  },
  "objects_v1_storage_objects_get": {
    "admin_session_required": false,
    "idempotency_required": false,
    "method": "GET",
    "path": "/v1/storage/objects",
    "path_parameters": [],
    "security": [
      {
        "BearerKey": []
      },
      {
        "WebSession": []
      }
    ]
  },
  "operations_v1_operations_get": {
    "admin_session_required": false,
    "idempotency_required": false,
    "method": "GET",
    "path": "/v1/operations",
    "path_parameters": [],
    "security": [
      {
        "BearerKey": []
      },
      {
        "WebSession": []
      }
    ]
  },
  "outputs_v1_bulks__bulk_id__outputs_get": {
    "admin_session_required": false,
    "idempotency_required": false,
    "method": "GET",
    "path": "/v1/bulks/{bulk_id}/outputs",
    "path_parameters": [
      "bulk_id"
    ],
    "security": [
      {
        "BearerKey": []
      },
      {
        "WebSession": []
      }
    ]
  },
  "patch_storage_policy_v1_storage_policy_patch": {
    "admin_session_required": true,
    "idempotency_required": false,
    "method": "PATCH",
    "path": "/v1/storage/policy",
    "path_parameters": [],
    "security": [
      {
        "WebSession": []
      }
    ]
  },
  "pause_control_v1_bulks__bulk_id__pause_post": {
    "admin_session_required": false,
    "idempotency_required": true,
    "method": "POST",
    "path": "/v1/bulks/{bulk_id}/pause",
    "path_parameters": [
      "bulk_id"
    ],
    "security": [
      {
        "BearerKey": []
      },
      {
        "WebSession": []
      }
    ]
  },
  "pause_v1_workflow_runs__run_id__pause_post": {
    "admin_session_required": false,
    "idempotency_required": true,
    "method": "POST",
    "path": "/v1/workflow-runs/{run_id}/pause",
    "path_parameters": [
      "run_id"
    ],
    "security": [
      {
        "BearerKey": []
      },
      {
        "WebSession": []
      }
    ]
  },
  "payments_v1_usage_payments_get": {
    "admin_session_required": false,
    "idempotency_required": false,
    "method": "GET",
    "path": "/v1/usage/payments",
    "path_parameters": [],
    "security": [
      {
        "BearerKey": []
      },
      {
        "WebSession": []
      }
    ]
  },
  "plans_v1_billing_plans_get": {
    "admin_session_required": false,
    "idempotency_required": false,
    "method": "GET",
    "path": "/v1/billing/plans",
    "path_parameters": [],
    "security": []
  },
  "portal_v1_billing_portal_post": {
    "admin_session_required": true,
    "idempotency_required": false,
    "method": "POST",
    "path": "/v1/billing/portal",
    "path_parameters": [],
    "security": [
      {
        "WebSession": []
      }
    ]
  },
  "public_pricing_v1_pricing_get": {
    "admin_session_required": false,
    "idempotency_required": false,
    "method": "GET",
    "path": "/v1/pricing",
    "path_parameters": [],
    "security": []
  },
  "replay_v1_webhooks_deliveries__kind___delivery_id__replay_post": {
    "admin_session_required": true,
    "idempotency_required": true,
    "method": "POST",
    "path": "/v1/webhooks/deliveries/{kind}/{delivery_id}/replay",
    "path_parameters": [
      "kind",
      "delivery_id"
    ],
    "security": [
      {
        "WebSession": []
      }
    ]
  },
  "result_v1_jobs__job_id__results__result_id__get": {
    "admin_session_required": false,
    "idempotency_required": false,
    "method": "GET",
    "path": "/v1/jobs/{job_id}/results/{result_id}",
    "path_parameters": [
      "job_id",
      "result_id"
    ],
    "security": [
      {
        "BearerKey": []
      },
      {
        "WebSession": []
      }
    ]
  },
  "resume_v1_bulks__bulk_id__resume_post": {
    "admin_session_required": false,
    "idempotency_required": false,
    "method": "POST",
    "path": "/v1/bulks/{bulk_id}/resume",
    "path_parameters": [
      "bulk_id"
    ],
    "security": [
      {
        "BearerKey": []
      },
      {
        "WebSession": []
      }
    ]
  },
  "resume_v1_workflow_runs__run_id__resume_post": {
    "admin_session_required": false,
    "idempotency_required": true,
    "method": "POST",
    "path": "/v1/workflow-runs/{run_id}/resume",
    "path_parameters": [
      "run_id"
    ],
    "security": [
      {
        "BearerKey": []
      },
      {
        "WebSession": []
      }
    ]
  },
  "retry_failed_v1_batches__batch_id__retry_failed_post": {
    "admin_session_required": false,
    "idempotency_required": true,
    "method": "POST",
    "path": "/v1/batches/{batch_id}/retry-failed",
    "path_parameters": [
      "batch_id"
    ],
    "security": [
      {
        "BearerKey": []
      },
      {
        "WebSession": []
      }
    ]
  },
  "retry_v1_bulks__bulk_id__retry_failed_post": {
    "admin_session_required": false,
    "idempotency_required": true,
    "method": "POST",
    "path": "/v1/bulks/{bulk_id}/retry-failed",
    "path_parameters": [
      "bulk_id"
    ],
    "security": [
      {
        "BearerKey": []
      },
      {
        "WebSession": []
      }
    ]
  },
  "review_v1_jobs__job_id__review_post": {
    "admin_session_required": true,
    "idempotency_required": false,
    "method": "POST",
    "path": "/v1/jobs/{job_id}/review",
    "path_parameters": [
      "job_id"
    ],
    "security": [
      {
        "WebSession": []
      }
    ]
  },
  "revoke_v1_keys__key_id__delete": {
    "admin_session_required": true,
    "idempotency_required": false,
    "method": "DELETE",
    "path": "/v1/keys/{key_id}",
    "path_parameters": [
      "key_id"
    ],
    "security": [
      {
        "WebSession": []
      }
    ]
  },
  "save_workflow_v1_workflows_post": {
    "admin_session_required": true,
    "idempotency_required": false,
    "method": "POST",
    "path": "/v1/workflows",
    "path_parameters": [],
    "security": [
      {
        "WebSession": []
      }
    ]
  },
  "seal_v1_bulks__bulk_id__seal_post": {
    "admin_session_required": false,
    "idempotency_required": false,
    "method": "POST",
    "path": "/v1/bulks/{bulk_id}/seal",
    "path_parameters": [
      "bulk_id"
    ],
    "security": [
      {
        "BearerKey": []
      },
      {
        "WebSession": []
      }
    ]
  },
  "set_budget_v1_budgets_put": {
    "admin_session_required": true,
    "idempotency_required": false,
    "method": "PUT",
    "path": "/v1/budgets",
    "path_parameters": [],
    "security": [
      {
        "WebSession": []
      }
    ]
  },
  "settings_v1_notifications_settings_get": {
    "admin_session_required": false,
    "idempotency_required": false,
    "method": "GET",
    "path": "/v1/notifications/settings",
    "path_parameters": [],
    "security": [
      {
        "BearerKey": []
      },
      {
        "WebSession": []
      }
    ]
  },
  "status_v1_billing_subscription_get": {
    "admin_session_required": true,
    "idempotency_required": false,
    "method": "GET",
    "path": "/v1/billing/subscription",
    "path_parameters": [],
    "security": [
      {
        "WebSession": []
      }
    ]
  },
  "status_v1_bulks__bulk_id__get": {
    "admin_session_required": false,
    "idempotency_required": false,
    "method": "GET",
    "path": "/v1/bulks/{bulk_id}",
    "path_parameters": [
      "bulk_id"
    ],
    "security": [
      {
        "BearerKey": []
      },
      {
        "WebSession": []
      }
    ]
  },
  "storage_audit_v1_storage_audit_get": {
    "admin_session_required": true,
    "idempotency_required": false,
    "method": "GET",
    "path": "/v1/storage/audit",
    "path_parameters": [],
    "security": [
      {
        "WebSession": []
      }
    ]
  },
  "storage_status_v1_storage_get": {
    "admin_session_required": false,
    "idempotency_required": false,
    "method": "GET",
    "path": "/v1/storage",
    "path_parameters": [],
    "security": [
      {
        "BearerKey": []
      },
      {
        "WebSession": []
      }
    ]
  },
  "storage_usage_v1_storage_usage_get": {
    "admin_session_required": false,
    "idempotency_required": false,
    "method": "GET",
    "path": "/v1/storage/usage",
    "path_parameters": [],
    "security": [
      {
        "BearerKey": []
      },
      {
        "WebSession": []
      }
    ]
  },
  "submit_batch_v1_batches_post": {
    "admin_session_required": false,
    "idempotency_required": true,
    "method": "POST",
    "path": "/v1/batches",
    "path_parameters": [],
    "security": [
      {
        "BearerKey": []
      },
      {
        "WebSession": []
      }
    ]
  },
  "submit_v1_jobs_post": {
    "admin_session_required": false,
    "idempotency_required": true,
    "method": "POST",
    "path": "/v1/jobs",
    "path_parameters": [],
    "security": [
      {
        "BearerKey": []
      },
      {
        "WebSession": []
      }
    ]
  },
  "subscribe_v1_billing_subscribe_post": {
    "admin_session_required": true,
    "idempotency_required": false,
    "method": "POST",
    "path": "/v1/billing/subscribe",
    "path_parameters": [],
    "security": [
      {
        "WebSession": []
      }
    ]
  },
  "update_v1_notifications_settings_put": {
    "admin_session_required": true,
    "idempotency_required": false,
    "method": "PUT",
    "path": "/v1/notifications/settings",
    "path_parameters": [],
    "security": [
      {
        "WebSession": []
      }
    ]
  },
  "uploads_v1_uploads_post": {
    "admin_session_required": false,
    "idempotency_required": false,
    "method": "POST",
    "path": "/v1/uploads",
    "path_parameters": [],
    "security": [
      {
        "BearerKey": []
      },
      {
        "WebSession": []
      }
    ]
  },
  "usage_v1_usage_get": {
    "admin_session_required": false,
    "idempotency_required": false,
    "method": "GET",
    "path": "/v1/usage",
    "path_parameters": [],
    "security": [
      {
        "BearerKey": []
      },
      {
        "WebSession": []
      }
    ]
  },
  "wallet_v1_wallet_get": {
    "admin_session_required": false,
    "idempotency_required": false,
    "method": "GET",
    "path": "/v1/wallet",
    "path_parameters": [],
    "security": [
      {
        "BearerKey": []
      },
      {
        "WebSession": []
      }
    ]
  },
  "webhooks_v1_webhooks_get": {
    "admin_session_required": true,
    "idempotency_required": false,
    "method": "GET",
    "path": "/v1/webhooks",
    "path_parameters": [],
    "security": [
      {
        "WebSession": []
      }
    ]
  },
  "workflows_v1_workflows_get": {
    "admin_session_required": false,
    "idempotency_required": false,
    "method": "GET",
    "path": "/v1/workflows",
    "path_parameters": [],
    "security": [
      {
        "BearerKey": []
      },
      {
        "WebSession": []
      }
    ]
  }
};
