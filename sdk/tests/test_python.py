import hashlib, hmac, json, sys, unittest
from pathlib import Path
from unittest.mock import Mock, patch
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'python'))
from skavio import SkavioClient, SkavioError, verify_webhook
import requests

def response(status=200, data=None, headers=None):
    r = requests.Response(); r.status_code = status; r.headers.update(headers or {})
    r._content = json.dumps(data if data is not None else {'ok': True}).encode(); r._content_consumed = True; return r

class SDKTests(unittest.TestCase):
    def client(self, outcomes):
        s = Mock(); s.request.side_effect = outcomes
        return SkavioClient('test-key', session=s), s
    def test_origin_guard(self):
        for url in ['http://example.com','https://key@example.com','https://example.com/other']:
            with self.assertRaises(ValueError): SkavioClient('test',base_url=url)
    def test_persisted_key(self):
        c,s=self.client([response(data={'id':'job'})]); self.assertEqual(c.submit_job({},idempotency_key='company-job-123')['id'],'job')
        self.assertEqual(s.request.call_args.kwargs['headers']['Idempotency-Key'],'company-job-123')
    def test_mutation_never_retried(self):
        c,s=self.client([requests.Timeout(),response()])
        with self.assertRaises(requests.Timeout): c.submit_job({},idempotency_key='company-job-123')
        self.assertEqual(s.request.call_count,1)
    @patch('skavio.client.time.sleep')
    def test_read_retry(self,_):
        c,s=self.client([response(429,headers={'Retry-After':'0'}),response(data={'version':'1.9.0'})])
        self.assertEqual(c.capabilities()['version'],'1.9.0'); self.assertEqual(s.request.call_count,2)
    def test_error_request_id(self):
        c,s=self.client([response(409,{'error_code':'budget_exceeded','detail':'Monthly credit budget exceeded.'},{'X-Request-ID':'req-123'})])
        with self.assertRaises(SkavioError) as caught: c.submit_job({},idempotency_key='company-job-123')
        self.assertEqual(caught.exception.code,'budget_exceeded'); self.assertEqual(caught.exception.request_id,'req-123')
    def test_stop_review(self):
        c,s=self.client([response(data={'status':'waiting_review'})]); self.assertEqual(c.wait('workflow','run')['status'],'waiting_review')
    def test_poll_timeout(self):
        c,s=self.client([response(data={'status':'processing'})])
        with patch('skavio.client.time.monotonic',side_effect=[0,2]):
            with self.assertRaises(TimeoutError): c.wait('job','persisted-job',timeout=1)
    def test_redirect_not_followed_on_mutation(self):
        c,s=self.client([response(307,headers={'Location':'https://other.example/'})])
        with self.assertRaises(SkavioError): c.submit_job({},idempotency_key='company-job-123')
        self.assertFalse(s.request.call_args.kwargs['allow_redirects'])
    def test_no_arbitrary_url(self):
        c,s=self.client([])
        for path in ['https://example.com','//example.com','/v1/../admin']:
            with self.assertRaises(ValueError): c.request('GET',path)
        s.request.assert_not_called()
    def test_webhook(self):
        body=b'{"id":"event"}'; sig='v1='+hmac.new(b'secret',b'1000.'+body,hashlib.sha256).hexdigest()
        self.assertTrue(verify_webhook('secret','1000',body,sig,now=1001))
        self.assertFalse(verify_webhook('secret','1000',body+b' ',sig,now=1001))
        self.assertFalse(verify_webhook('secret','1000',body,sig,now=1301))
        self.assertFalse(verify_webhook('secret',None,body,sig,now=1001))
        self.assertFalse(verify_webhook('secret','1000',body,'ž',now=1001))
    def test_all_openapi_operations(self):
        operations=json.loads((Path(__file__).resolve().parents[1]/'python/skavio/operations.json').read_text())
        for name,operation in operations.items():
            c,transport=self.client([response()])
            c.call(name,path_params={n:'synthetic-id' for n in operation['path_parameters']},idempotency_key='contract-test-123' if operation['idempotency_required'] else None)
            self.assertEqual(transport.request.call_args.args[0],operation['method'])
            self.assertNotIn('{',transport.request.call_args.args[1])

    @patch('skavio.client.requests.Session')
    def test_s3_redirect_strips_auth(self, Session):
        transport=Mock(); Session.return_value.__enter__.return_value=transport
        first=Mock(status_code=307,headers={'Location':'https://storage.example/signed'})
        second=Mock(status_code=200,headers={});second.iter_content.return_value=[b'result']
        first.__enter__=Mock(return_value=first);first.__exit__=Mock()
        second.__enter__=Mock(return_value=second);second.__exit__=Mock()
        transport.get.side_effect=[first,second]
        c=SkavioClient('test',session=Mock());self.assertEqual(c.download('/v1/jobs/j/results/r'),b'result')
        self.assertEqual(transport.get.call_args_list[1].kwargs['headers'],{})
    @patch('skavio.client.requests.Session')
    def test_download_byte_limit(self, Session):
        transport=Mock(); Session.return_value.__enter__.return_value=transport
        r=Mock(status_code=200,headers={});r.iter_content.return_value=[b'12345'];r.__enter__=Mock(return_value=r);r.__exit__=Mock();transport.get.return_value=r
        with self.assertRaises(ValueError): SkavioClient('test',session=Mock()).download('/v1/jobs/j/results/r',max_bytes=4)

if __name__=='__main__': unittest.main()
