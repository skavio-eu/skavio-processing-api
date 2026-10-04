import operations from "./operations.mjs";
export class SkavioError extends Error {
  constructor(status, code, requestId, retryAfter) {
    super(`Skavio HTTP ${status}: ${code}`);
    this.name = 'SkavioError'; this.status = status; this.code = code;
    this.requestId = requestId; this.retryAfter = retryAfter;
  }
}
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const id = value => {
  if (typeof value !== 'string' || !value || ['.', '..'].includes(value)) throw new TypeError('Invalid resource ID');
  return encodeURIComponent(value);
};
export class SkavioClient {
  #key;
  constructor(apiKey, {baseUrl = 'https://www.skavio.eu', timeoutMs = 30000, readRetries = 2, allowHttp = false, fetchImpl = fetch} = {}) {
    const u = new URL(baseUrl);
    if (!apiKey || u.username || u.password || u.search || u.hash || u.pathname !== '/') throw new TypeError('Use API key and base origin');
    if (u.protocol !== 'https:' && !(allowHttp && u.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(u.hostname))) throw new TypeError('HTTPS required');
    if (timeoutMs <= 0 || !Number.isInteger(readRetries) || readRetries < 0 || readRetries > 5) throw new TypeError('Invalid timeout or retry limit');
    this.#key = apiKey; this.baseUrl = u.origin; this.timeoutMs = timeoutMs; this.readRetries = readRetries; this.fetch = fetchImpl;
  }
  async request(method, path, {data, query, idempotencyKey, body, raw = false, signal, timeoutMs, adminSession} = {}) {
    if (!/^\/v1\/[A-Za-z0-9_./%~-]+$/.test(path) || path.includes('..') || path.includes('//')) throw new TypeError('Expected relative /v1/ path');
    method = method.toUpperCase();
    const headers = {Authorization: `Bearer ${this.#key}`, 'User-Agent': 'skavio-javascript/1.1.0'};
    if (idempotencyKey !== undefined) {
      if (!/^[A-Za-z0-9._:-]{8,128}$/.test(idempotencyKey)) throw new TypeError('Invalid idempotency key');
      headers['Idempotency-Key'] = idempotencyKey;
    }
    if (data !== undefined) {headers['Content-Type'] = 'application/json'; body = JSON.stringify(data);}
    const url = new URL(this.baseUrl + path);
    for (const [k, v] of Object.entries(query || {})) if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    if (adminSession !== undefined) {
      if (!/^[A-Za-z0-9._~-]{16,4096}$/.test(adminSession)) throw new TypeError('Invalid admin session');
      delete headers.Authorization; headers.Cookie = `skavio_web_account=${adminSession}`;
    }
    const retries = method === 'GET' ? this.readRetries : 0;
    for (let attempt = 0; attempt <= retries; attempt++) {
      signal?.throwIfAborted();
      let response;
      try {
        response = await this.fetch(url, {method, headers, body, redirect: 'error', signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(timeoutMs || this.timeoutMs)]) : AbortSignal.timeout(timeoutMs || this.timeoutMs)});
      } catch (error) {
        if (attempt === retries || signal?.aborted) throw error;
        await sleep(Math.min(2 ** attempt, 10) * 1000); continue;
      }
      if ([429, 502, 503, 504].includes(response.status) && attempt < retries) {
        const after = response.headers.get('Retry-After');
        await response.body?.cancel();
        const parsed = /^\d+$/.test(after || '') ? Number(after) : (Date.parse(after) - Date.now()) / 1000;
        await sleep((Number.isFinite(parsed) ? Math.max(0, parsed) : 2 ** attempt) * 1000); continue;
      }
      if (!response.ok) {
        let value = {}; try {value = await response.json();} catch {}
        throw new SkavioError(response.status, value.error_code || value.error?.code || value.detail?.code || 'http_error', response.headers.get('X-Request-ID') || value.request_id, response.headers.get('Retry-After'));
      }
      if (raw) return new Uint8Array(await response.arrayBuffer());
      if (response.status === 204) return null;
      const text = await response.text(); return text ? JSON.parse(text) : null;
    }
  }
  call(operationId, {pathParams = {}, ...options} = {}) {
    const operation = operations[operationId];
    if (!operation) throw new TypeError('Unknown OpenAPI operation ID');
    if (operation.idempotency_required && !options.idempotencyKey) throw new TypeError('Persist an idempotency key');
    let path = operation.path;
    for (const name of operation.path_parameters) path = path.replace(`{${name}}`, id(pathParams[name]));
    return this.request(operation.method, path, options);
  }
  async upload(paths) {
    const {readFile} = await import('node:fs/promises');
    const {basename} = await import('node:path');
    if (!paths.length) throw new TypeError('At least one file required');
    const body = new FormData();
    for (const path of paths) body.append('files', new Blob([await readFile(path)]), basename(path));
    return this.request('POST', '/v1/uploads', {body, timeoutMs: Math.max(this.timeoutMs, 180000)});
  }
  submitJob(data, idempotencyKey) {if (!idempotencyKey) throw new TypeError('Persist an idempotency key'); return this.request('POST', '/v1/jobs', {data, idempotencyKey});}
  getJob(jobId) {return this.request('GET', `/v1/jobs/${id(jobId)}`);}
  estimate(data) {return this.request('POST', '/v1/estimate', {data});}
  submitBatch(data, idempotencyKey) {if (!idempotencyKey) throw new TypeError('Persist an idempotency key'); return this.request('POST', '/v1/batches', {data, idempotencyKey});}
  getBatch(batchId) {return this.request('GET', `/v1/batches/${id(batchId)}`);}
  createBulk(data, idempotencyKey) {if (!idempotencyKey) throw new TypeError('Persist an idempotency key'); return this.request('POST', '/v1/bulks', {data, idempotencyKey});}
  getBulk(bulkId) {return this.request('GET', `/v1/bulks/${id(bulkId)}`);}
  appendManifest(bulkId, data) {return this.request('PUT', `/v1/bulks/${id(bulkId)}/manifest`, {data});}
  sealBulk(bulkId) {return this.request('POST', `/v1/bulks/${id(bulkId)}/seal`);}
  resumeBulk(bulkId) {return this.request('POST', `/v1/bulks/${id(bulkId)}/resume`);}
  pauseBulk(bulkId, idempotencyKey) {if (!idempotencyKey) throw new TypeError('Persist an idempotency key'); return this.request('POST', `/v1/bulks/${id(bulkId)}/pause`, {idempotencyKey});}
  cancelBulk(bulkId, idempotencyKey) {if (!idempotencyKey) throw new TypeError('Persist an idempotency key'); return this.request('POST', `/v1/bulks/${id(bulkId)}/cancel`, {idempotencyKey});}
  notifications(query = {}) {return this.request('GET', '/v1/notifications', {query});}
  notificationSettings() {return this.request('GET', '/v1/notifications/settings');}
  updateNotificationSettings(data, adminSession) {if (!adminSession) throw new TypeError('Company admin web session required'); return this.request('PUT', '/v1/notifications/settings', {data, adminSession});}
  listJobs(query = {}) {return this.request('GET', '/v1/jobs', {query});}
  listBatches(query = {}) {return this.request('GET', '/v1/batches', {query});}
  listBulks(query = {}) {return this.request('GET', '/v1/bulks', {query});}
  bulkItems(bulkId, query = {}) {return this.request('GET', `/v1/bulks/${id(bulkId)}/items`, {query});}
  bulkOutputs(bulkId, query = {}) {return this.request('GET', `/v1/bulks/${id(bulkId)}/outputs`, {query});}
  retryBulk(bulkId, idempotencyKey) {if (!idempotencyKey) throw new TypeError('Persist an idempotency key'); return this.request('POST', `/v1/bulks/${id(bulkId)}/retry-failed`, {idempotencyKey});}
  storage() {return this.request('GET', '/v1/storage');}
  listObjects(query = {}) {return this.request('GET', '/v1/storage/objects', {query});}
  startWorkflow(data, idempotencyKey) {if (!idempotencyKey) throw new TypeError('Persist an idempotency key'); return this.request('POST', '/v1/workflow-runs', {data, idempotencyKey});}
  getWorkflow(runId) {return this.request('GET', `/v1/workflow-runs/${id(runId)}`);}
  controlWorkflow(runId, action, idempotencyKey, data = {}) {
    if (!['pause', 'resume', 'cancel', 'approve'].includes(action) || !idempotencyKey) throw new TypeError('Use known action and persisted idempotency key');
    return this.request('POST', `/v1/workflow-runs/${id(runId)}/${action}`, {data, idempotencyKey});
  }
  wallet() {return this.request('GET', '/v1/wallet');}
  capabilities() {return this.request('GET', '/v1/capabilities');}
  importCloud(data, idempotencyKey) {if (!idempotencyKey) throw new TypeError('Persist an idempotency key'); return this.request('POST', '/v1/storage/imports', {data, idempotencyKey});}
  getImport(importId) {return this.request('GET', `/v1/storage/imports/${id(importId)}`);}
  async wait(resource, resourceId, {timeoutMs = 3600000, intervalMs = 5000} = {}) {
    const getters = {job: 'getJob', batch: 'getBatch', bulk: 'getBulk', workflow: 'getWorkflow'};
    if (!getters[resource] || timeoutMs <= 0 || intervalMs <= 0) throw new TypeError('Invalid polling options');
    const deadline = performance.now() + timeoutMs;
    for (;;) {
      const item = await this[getters[resource]](resourceId);
      if (['completed', 'failed', 'cancelled', 'partial', 'paused', 'waiting_review', 'draft'].includes(item.status || item.state)) return item;
      const remaining = deadline - performance.now();
      if (remaining <= 0) throw new Error(`${resource} ${resourceId} still active; resume polling with this ID`);
      await sleep(Math.min(intervalMs, remaining));
    }
  }
  async download(path, {maxBytes = 524288000} = {}) {
    if (!/^\/v1\/[A-Za-z0-9_./%~-]+$/.test(path) || path.includes('..') || path.includes('//') || maxBytes <= 0) throw new TypeError('Invalid result path or byte limit');
    let url = new URL(this.baseUrl + path);
    let headers = {Authorization: `Bearer ${this.#key}`};
    for (let hop = 0; hop < 6; hop++) {
      const response = await this.fetch(url, {headers, redirect: 'manual', signal: AbortSignal.timeout(Math.max(this.timeoutMs, 180000))});
      if ([301, 302, 303, 307, 308].includes(response.status)) {
        const location = response.headers.get('Location');
        await response.body?.cancel();
        if (!location) throw new TypeError('Missing result redirect');
        const next = new URL(location, url);
        if (next.protocol !== 'https:' || next.username || next.password) throw new TypeError('Unsafe result redirect');
        if (hop === 5) throw new TypeError('Too many result redirects');
        if (next.origin !== url.origin) headers = {};
        url = next; continue;
      }
      if (!response.ok) {await response.body?.cancel(); throw new SkavioError(response.status, 'download_failed', response.headers.get('X-Request-ID'));}
      const chunks = []; let length = 0;
      for await (const chunk of response.body) {
        length += chunk.length;
        if (length > maxBytes) throw new RangeError('Result exceeds byte limit');
        chunks.push(chunk);
      }
      return Buffer.concat(chunks, length);
    }
    throw new TypeError('Too many result redirects');
  }

}

SkavioClient.prototype.downloadObject = async function(objectId, {maxBytes = 524288000} = {}) {
  if (maxBytes <= 0) throw new TypeError('Positive byte limit required');
  const link = await this.request('GET', `/v1/storage/objects/${id(objectId)}/download-link`);
  const url = new URL(link.url || link.download_url);
  if (url.protocol !== 'https:' || url.username || url.password) throw new TypeError('Unsafe signed URL');
  // No Authorization header on signed object URLs.
  const response = await this.fetch(url, {redirect: 'error', signal: AbortSignal.timeout(Math.max(this.timeoutMs, 180000))});
  if (!response.ok) throw new SkavioError(response.status, 'download_failed');
  const chunks = []; let length = 0;
  for await (const chunk of response.body) {
    length += chunk.length;
    if (length > maxBytes) throw new RangeError('Result exceeds byte limit');
    chunks.push(chunk);
  }
  return Buffer.concat(chunks, length);
};
export async function verifyWebhook(secret, timestamp, rawBody, signature, {now = Date.now() / 1000, tolerance = 300} = {}) {
  if (!secret || typeof timestamp !== 'string' || !/^\d+$/.test(timestamp) || typeof signature !== 'string' || !(rawBody instanceof Uint8Array) || tolerance < 0 || Math.abs(now - Number(timestamp)) > tolerance) return false;
  const {createHmac, timingSafeEqual} = await import('node:crypto');
  const expected = Buffer.from('v1=' + createHmac('sha256', secret).update(timestamp + '.').update(rawBody).digest('hex'));
  const supplied = Buffer.from(signature);
  return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}
