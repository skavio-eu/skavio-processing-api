// Node.js 22+; server-side only.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { basename } from 'node:path';
if (!process.env.SKAVIO_API_KEY || !process.env.SKAVIO_IDEMPOTENCY_KEY) throw new Error('Set SKAVIO_API_KEY and SKAVIO_IDEMPOTENCY_KEY');
const source = process.env.SKAVIO_SOURCE || 'sample-invoice.txt';
const base = 'https://www.skavio.eu';
const auth = { Authorization: `Bearer ${process.env.SKAVIO_API_KEY}` };
async function json(path, options = {}) {
  const r = await fetch(base + path, { signal: AbortSignal.timeout(180000), ...options,
    headers: { ...auth, ...options.headers } });
  const data = await r.json();
  if (!r.ok) throw new Error(JSON.stringify(data));
  return data;
}
const form = new FormData();
form.append('files', new Blob([await readFile(source)]), basename(source));
const uploaded = await json('/v1/uploads', { method: 'POST', body: form });
const payload = { operation: 'flow-extract',
  upload_ids: [uploaded.uploads[0].id], fields: ['supplier','total'] };
const opts = { method: 'POST', headers: { 'Content-Type':'application/json' },
  body: JSON.stringify(payload) };
const quote = await json('/v1/estimate', opts);
payload.max_credits = quote.estimated_credits;
const idem = process.env.SKAVIO_IDEMPOTENCY_KEY; // Persist before submission.
let job = await json('/v1/jobs', { ...opts,
  headers: { ...opts.headers, 'Idempotency-Key': idem },
  body: JSON.stringify(payload) });
const deadline = Date.now() + 3600000;
while (!['completed','failed'].includes(job.status)) {
  if (Date.now() > deadline) throw new Error('Polling timeout; resume with job ID ' + job.id);
  await new Promise(resolve => setTimeout(resolve, 5000));
  job = await json('/v1/jobs/' + job.id);
}
if (job.status === 'failed') throw new Error(job.error);
const file = job.result.files.find(f => f.name.endsWith('.json'));
if (!file || !file.download_path.startsWith('/v1/jobs/')) throw new Error('Unexpected result path');
const r = await fetch(base + file.download_path, { headers: auth });
if (!r.ok) throw new Error('Download failed');
await mkdir('results', { recursive: true });
await writeFile('results/' + basename(file.name), Buffer.from(await r.arrayBuffer()));
console.log('Completed:', job.id, 'charged credits:', job.charged_credits);

