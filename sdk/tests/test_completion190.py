import sys,json,unittest
from pathlib import Path
from unittest.mock import patch,Mock
sys.path.insert(0,str(Path(__file__).resolve().parent))
import test_python as base
response=base.response
class CompletionSDKTests(unittest.TestCase):
 def client(self,outcomes):return base.SDKTests().client(outcomes)
 def test_bulk_controls_keep_idempotency_and_no_retry(self):
  for action in ['pause_bulk','cancel_bulk']:
   c,s=self.client([response(503),response()])
   with self.assertRaises(Exception):getattr(c,action)('bulk',idempotency_key='persisted-control-190')
   self.assertEqual(s.request.call_count,1);self.assertEqual(s.request.call_args.kwargs['headers']['Idempotency-Key'],'persisted-control-190')
 def test_notification_admin_cookie_excludes_bearer(self):
  c,s=self.client([response()]);c.update_notification_settings({'enabled':False},admin_session='synthetic-admin-session-190')
  h=s.request.call_args.kwargs['headers'];self.assertNotIn('Authorization',h);self.assertEqual(h['Cookie'],'skavio_web_account=synthetic-admin-session-190')
 def test_notification_invalid_admin_cookie_rejected(self):
  c,s=self.client([])
  with self.assertRaises(ValueError):c.update_notification_settings({},admin_session='x\r\nInjected: header')
  s.request.assert_not_called()
 @patch('skavio.client.time.sleep')
 def test_retry_after_http_date(self,sleep):
  c,s=self.client([response(429,headers={'Retry-After':'Thu, 01 Jan 1970 00:01:00 GMT'}),response()])
  with patch('skavio.client.time.time',return_value=0):c.capabilities()
  sleep.assert_called_once_with(60)
 def test_bulk_retry_convenience_matches_contract(self):
  c,s=self.client([response()]);c.retry_bulk('synthetic-bulk',idempotency_key='durable-retry-190')
  spec=json.loads((Path(__file__).resolve().parents[2]/'openapi-v1.json').read_text())
  self.assertIn('/v1/bulks/{bulk_id}/retry-failed',spec['paths'])
  self.assertEqual(s.request.call_args.args[1],c.base_url+'/v1/bulks/synthetic-bulk/retry-failed')
  self.assertEqual(s.request.call_args.kwargs['headers']['Idempotency-Key'],'durable-retry-190')
 def test_registry_exact_openapi_parity(self):
  r=Path(__file__).resolve().parents[2];spec=json.loads((r/'openapi-v1.json').read_text());ops=json.loads((r/'sdk/python/skavio/operations.json').read_text())
  expected={o['operationId']:(m.upper(),p) for p,item in spec['paths'].items() for m,o in item.items() if m in ['get','post','put','patch','delete']}
  self.assertEqual({n:(v['method'],v['path']) for n,v in ops.items()},expected)
  js=json.loads((r/'sdk/javascript/operations.mjs').read_text()[len('export default '):].strip().rstrip(';'));self.assertEqual(ops,js)
if __name__=='__main__':unittest.main()
