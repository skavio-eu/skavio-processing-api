# Skavio Flow: no-account examples and real authenticated integration

Live free samples (no login and no credits): https://getskavio.com/demo/ .
German samples: https://dokutakt.de/demo/ .
Real Flow tool: https://getskavio.com/flow/ .
Processing API documentation: https://getskavio.com/api/docs/ .

## See a sample now — no account and no processing charges

    python3 fixture_flow.py
    python3 -m unittest test_fixture.py

The fictional sample invoice is a predefined input. The Python script demonstrates field extraction into a reviewable CSV row without uploading any data. **It is not an OCR/AI service call** and makes zero network requests. It does not imply that real OCR always achieves the same accuracy.

## Actual integration — authenticated Processing API

The authenticated API is on https://getskavio.com/ ; real operations require an appropriate company API key and prepaid credits:

1. POST /v1/uploads — upload an authorized invoice/document. Persist the returned upload ID.
2. POST /v1/estimate with operation flow-extract and upload IDs. Review the live quote, do not trust historic fixed rate tables.
3. Only after user authorization: POST /v1/jobs with the same operation and upload IDs, an explicit max_credits ceiling, and an Idempotency-Key persisted before submission.
4. Poll GET /v1/jobs/{id}, download the authenticated result and review extraction evidence, fields and totals.

The repository-root [Python quickstart](../../quickstart.py) and [Node.js quickstart](../../quickstart.mjs) perform **actual billed processing** when supplied with credentials and submitted. Do not run them merely to view a free sample. This standalone folder is safe to run without credentials.

Use your own credentials only on a trusted server, never in HTML, frontend JavaScript, GitHub repositories or bug reports. Retry ambiguous requests with the original idempotency key, never create duplicates or record 402 as payment. Respect the 7-day retention policy and validate output before accounting use.

Maintained by Skavio LLC. This is an illustrative integration kit, not a customer testimonial.
