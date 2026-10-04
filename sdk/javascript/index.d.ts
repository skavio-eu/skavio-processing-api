export type Json = null | boolean | number | string | Json[] | {[key: string]: Json};
export interface ClientOptions {baseUrl?: string; timeoutMs?: number; readRetries?: number; allowHttp?: boolean; fetchImpl?: typeof fetch;}
export interface RequestOptions {data?: unknown; query?: Record<string, string | number | boolean | null | undefined>; idempotencyKey?: string; body?: BodyInit; raw?: boolean; signal?: AbortSignal; timeoutMs?: number;}
export interface Resource {id: string; status?: string; state?: string; [key: string]: unknown;}
export class SkavioError extends Error {status: number; code: string; requestId?: string | null; retryAfter?: string | null;}
export class SkavioClient {
  constructor(apiKey: string, options?: ClientOptions);
  request<T = Record<string, unknown>>(method: string, path: string, options?: RequestOptions): Promise<T>;
  call<T = Record<string, unknown>>(operationId: string, options?: RequestOptions & {pathParams?: Record<string, string>}): Promise<T>;
  upload(paths: string[]): Promise<{uploads: Resource[]}>;
  estimate(data: unknown): Promise<{estimated_credits: number; [key: string]: unknown}>;
  submitJob(data: unknown, idempotencyKey: string): Promise<Resource>;
  getJob(jobId: string): Promise<Resource>;
  submitBatch(data: unknown, idempotencyKey: string): Promise<Resource>;
  getBatch(batchId: string): Promise<Resource>;
  createBulk(data: unknown, idempotencyKey: string): Promise<Resource>;
  getBulk(bulkId: string): Promise<Resource>;
  appendManifest(bulkId: string, data: unknown): Promise<Resource>;
  sealBulk(bulkId: string): Promise<Resource>;
  resumeBulk(bulkId: string): Promise<Resource>;
  startWorkflow(data: unknown, idempotencyKey: string): Promise<Resource>;
  getWorkflow(runId: string): Promise<Resource>;
  controlWorkflow(runId: string, action: 'pause' | 'resume' | 'cancel' | 'approve', idempotencyKey: string, data?: unknown): Promise<Resource>;
  wallet(): Promise<Record<string, unknown>>;
  capabilities(): Promise<Record<string, unknown>>;
  importCloud(data: unknown, idempotencyKey: string): Promise<Resource>;
  getImport(importId: string): Promise<Resource>;
  wait(resource: 'job' | 'batch' | 'bulk' | 'workflow', resourceId: string, options?: {timeoutMs?: number; intervalMs?: number}): Promise<Resource>;
  download(path: string, options?: {maxBytes?: number}): Promise<Uint8Array>;
  downloadObject(objectId: string, options?: {maxBytes?: number}): Promise<Uint8Array>;
}
export function verifyWebhook(secret: string, timestamp: string, rawBody: Uint8Array, signature: string, options?: {now?: number; tolerance?: number}): Promise<boolean>;
