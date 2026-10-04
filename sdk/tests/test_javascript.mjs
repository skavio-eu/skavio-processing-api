import test from 'node:test';
import assert from 'node:assert/strict';
import {createHmac} from 'node:crypto';
import {SkavioClient, SkavioError, verifyWebhook} from '../javascript/index.mjs';
const json = (value,status=200,headers={}) => new Response(JSON.stringify(value),{status,headers});
test('origin guards',()=>{
  for(const baseUrl of ['http://example.com','https://key@example.com','https://example.com/other']) assert.throws(()=>new SkavioClient('key',{baseUrl}));
});
test('persisted submission key',async()=>{
  let options;const c=new SkavioClient('key',{fetchImpl:async(u,o)=>{options=o;return json({id:'j'});}});
  assert.equal((await c.submitJob({},'business-job-123')).id,'j');assert.equal(options.headers['Idempotency-Key'],'business-job-123');assert.equal(options.redirect,'error');
  assert.throws(()=>c.submitJob({}));
});
test('mutation network failure not retried',async()=>{
  let calls=0;const c=new SkavioClient('key',{fetchImpl:async()=>{calls++;throw new TypeError('connection lost');}});
  await assert.rejects(c.submitJob({},'business-job-123'));assert.equal(calls,1);
});
test('read rate limit retries',async()=>{
  let calls=0;const c=new SkavioClient('key',{fetchImpl:async()=>++calls===1?json({},429,{'Retry-After':'0'}):json({version:'1.8.0'})});
  assert.equal((await c.capabilities()).version,'1.8.0');assert.equal(calls,2);
});
test('structured error and request ID',async()=>{
  const c=new SkavioClient('key',{fetchImpl:async()=>json({error_code:'budget_exceeded',detail:'Monthly credit budget exceeded.'},409,{'X-Request-ID':'req-1'})});
  await assert.rejects(c.submitJob({},'business-job-123'),e=>e instanceof SkavioError&&e.code==='budget_exceeded'&&e.requestId==='req-1');
});
test('workflow review stops polling',async()=>{
  const c=new SkavioClient('key',{fetchImpl:async()=>json({status:'waiting_review'})});assert.equal((await c.wait('workflow','run')).status,'waiting_review');
});
test('poll timeout preserves ID',async()=>{
  const c=new SkavioClient('key',{fetchImpl:async()=>{await new Promise(r=>setTimeout(r,5));return json({status:'processing'});}});
  await assert.rejects(c.wait('job','persisted-job',{timeoutMs:1}),/persisted-job/);
});
test('result redirect strips key',async()=>{
  const calls=[];const c=new SkavioClient('key',{fetchImpl:async(u,o)=>{calls.push({url:String(u),...o});return calls.length===1?new Response(null,{status:307,headers:{Location:'https://storage.example/signed'}}):new Response('result');}});
  assert.equal((await c.download('/v1/jobs/j/results/r')).toString(),'result');assert.deepEqual(calls[1].headers,{});
});
test('reject HTTP result redirect',async()=>{
  const c=new SkavioClient('key',{fetchImpl:async()=>new Response(null,{status:307,headers:{Location:'http://storage.example/signed'}})});
  await assert.rejects(c.download('/v1/jobs/j/results/r'),/Unsafe/);
});
test('download byte limit',async()=>{
  const c=new SkavioClient('key',{fetchImpl:async()=>new Response('12345')});await assert.rejects(c.download('/v1/jobs/j/results/r',{maxBytes:4}),RangeError);
});
test('arbitrary request URL rejected',async()=>{
  const c=new SkavioClient('key',{fetchImpl:async()=>assert.fail('must not fetch')});
  for(const path of ['https://other.example','//other.example','/v1/../admin']) await assert.rejects(c.request('GET',path));
});
test('webhook integrity and freshness',async()=>{
  const body=Buffer.from('{"id":"event"}');const signature='v1='+createHmac('sha256','secret').update('1000.').update(body).digest('hex');
  assert.equal(await verifyWebhook('secret','1000',body,signature,{now:1001}),true);
  assert.equal(await verifyWebhook('secret','1000',Buffer.concat([body,Buffer.from(' ')]),signature,{now:1001}),false);
  assert.equal(await verifyWebhook('secret','1000',body,signature,{now:1301}),false);
});

import operations from '../javascript/operations.mjs';
test('all OpenAPI operation paths and verbs',async()=>{
 for(const [operationId, operation] of Object.entries(operations)) {
  let received;
  const c=new SkavioClient('key',{fetchImpl:async(url,options)=>{received={url:String(url),options};return json({ok:true});}});
  await c.call(operationId,{pathParams:Object.fromEntries(operation.path_parameters.map(name=>[name,'synthetic-id'])),idempotencyKey:operation.idempotency_required?'contract-test-123':undefined});
  assert.equal(received.options.method,operation.method);assert.equal(received.url.includes('{'),false);
 }
});
