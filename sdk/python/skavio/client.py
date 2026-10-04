import json
import re
import time
from pathlib import Path
from urllib.parse import quote, urlsplit
import requests

class SkavioError(Exception):
    def __init__(self, status, code, message, request_id=None, retry_after=None):
        self.status, self.code = status, code
        self.request_id, self.retry_after = request_id, retry_after
        super().__init__(f'Skavio HTTP {status}: {code}: {message}')

class SkavioClient:
    def __init__(self, api_key, base_url='https://www.skavio.eu', timeout=30, read_retries=2, allow_http=False, session=None):
        u = urlsplit(base_url)
        if not api_key or u.username or u.password or u.query or u.fragment or u.path not in ('', '/') or not u.hostname:
            raise ValueError('Use an API key and a base origin without credentials or paths')
        if u.scheme != 'https' and not (allow_http and u.scheme == 'http' and u.hostname in ('localhost', '127.0.0.1', '::1')):
            raise ValueError('HTTPS required; explicit allow_http is for localhost tests only')
        if timeout <= 0 or not 0 <= read_retries <= 5:
            raise ValueError('Invalid timeout or retry limit')
        self.base_url, self.timeout, self.read_retries = base_url.rstrip('/'), timeout, read_retries
        self._api_key, self._session = api_key, session or requests.Session()

    def close(self): self._session.close()
    def __enter__(self): return self
    def __exit__(self, *args): self.close()

    @staticmethod
    def id(value):
        if not isinstance(value, str) or not value or value in ('.', '..'):
            raise ValueError('Invalid resource ID')
        return quote(value, safe='')

    def request(self, method, path, *, data=None, query=None, idempotency_key=None, files=None, raw=False, timeout=None):
        if not re.fullmatch(r'/v1/[A-Za-z0-9_./%~-]+', path) or '..' in path or '//' in path:
            raise ValueError('Expected a relative /v1/ API path')
        method = method.upper()
        headers = {'Authorization': 'Bearer ' + self._api_key, 'User-Agent': 'skavio-python/1.0.0'}
        if idempotency_key is not None:
            if not re.fullmatch(r'[A-Za-z0-9._:-]{8,128}', idempotency_key): raise ValueError('Invalid idempotency key')
            headers['Idempotency-Key'] = idempotency_key
        retries = self.read_retries if method == 'GET' else 0
        for attempt in range(retries + 1):
            try:
                response = self._session.request(method, self.base_url + path, headers=headers, params=query,
                    json=data, files=files, timeout=timeout or self.timeout, allow_redirects=False)
            except requests.RequestException:
                if attempt == retries: raise
                time.sleep(min(2 ** attempt, 10)); continue
            if response.status_code in (429, 502, 503, 504) and attempt < retries:
                delay = response.headers.get('Retry-After', '')
                time.sleep(min(float(delay) if delay.isdigit() else 2 ** attempt, 30)); response.close(); continue
            if not 200 <= response.status_code < 300:
                try: body = response.json()
                except ValueError: body = {}
                detail = body.get('error', body.get('detail', {})) if isinstance(body, dict) else {}
                error = detail if isinstance(detail, dict) else {}
                request_id = response.headers.get('X-Request-ID') or (body.get('request_id') if isinstance(body, dict) else None)
                raise SkavioError(response.status_code, body.get('error_code', error.get('code', 'http_error')) if isinstance(body, dict) else 'http_error', error.get('message', 'API request failed'), request_id, response.headers.get('Retry-After'))
            if raw: return response.content
            if response.status_code == 204 or not response.content: return None
            return response.json()

    def call(self, operation_id, *, path_params=None, **options):
        from importlib.resources import files
        operations = json.loads(files('skavio').joinpath('operations.json').read_text())
        if operation_id not in operations: raise ValueError('Unknown OpenAPI operation ID')
        operation = operations[operation_id]
        if operation['idempotency_required'] and not options.get('idempotency_key'):
            raise ValueError('Persist an idempotency key')
        path = operation['path']
        for name in operation['path_parameters']:
            path = path.replace('{' + name + '}', self.id((path_params or {}).get(name)))
        return self.request(operation['method'], path, **options)

    def upload(self, paths):
        from contextlib import ExitStack
        with ExitStack() as stack:
            files = [('files', (Path(p).name, stack.enter_context(Path(p).open('rb')))) for p in paths]
            if not files: raise ValueError('At least one file required')
            return self.request('POST', '/v1/uploads', files=files, timeout=max(self.timeout, 180))

    def submit_job(self, payload, *, idempotency_key): return self.request('POST', '/v1/jobs', data=payload, idempotency_key=idempotency_key)
    def get_job(self, job_id): return self.request('GET', '/v1/jobs/' + self.id(job_id))
    def estimate(self, payload): return self.request('POST', '/v1/estimate', data=payload)
    def submit_batch(self, payload, *, idempotency_key): return self.request('POST', '/v1/batches', data=payload, idempotency_key=idempotency_key)
    def get_batch(self, batch_id): return self.request('GET', '/v1/batches/' + self.id(batch_id))
    def create_bulk(self, payload, *, idempotency_key): return self.request('POST', '/v1/bulks', data=payload, idempotency_key=idempotency_key)
    def get_bulk(self, bulk_id): return self.request('GET', '/v1/bulks/' + self.id(bulk_id))
    def append_manifest(self, bulk_id, payload): return self.request('PUT', '/v1/bulks/' + self.id(bulk_id) + '/manifest', data=payload)
    def seal_bulk(self, bulk_id): return self.request('POST', '/v1/bulks/' + self.id(bulk_id) + '/seal')
    def resume_bulk(self, bulk_id): return self.request('POST', '/v1/bulks/' + self.id(bulk_id) + '/resume')
    def start_workflow(self, payload, *, idempotency_key): return self.request('POST', '/v1/workflow-runs', data=payload, idempotency_key=idempotency_key)
    def get_workflow(self, run_id): return self.request('GET', '/v1/workflow-runs/' + self.id(run_id))
    def control_workflow(self, run_id, action, *, idempotency_key, payload=None):
        if action not in ('pause', 'resume', 'cancel', 'approve'): raise ValueError('Unknown workflow action')
        return self.request('POST', '/v1/workflow-runs/' + self.id(run_id) + '/' + action, data=payload or {}, idempotency_key=idempotency_key)
    def wallet(self): return self.request('GET', '/v1/wallet')
    def capabilities(self): return self.request('GET', '/v1/capabilities')
    def import_cloud(self, payload, *, idempotency_key): return self.request('POST', '/v1/storage/imports', data=payload, idempotency_key=idempotency_key)
    def get_import(self, import_id): return self.request('GET', '/v1/storage/imports/' + self.id(import_id))

    def wait(self, resource, resource_id, *, timeout=3600, interval=5):
        if resource not in ('job', 'batch', 'bulk', 'workflow'): raise ValueError('Unknown resource')
        if timeout <= 0 or interval <= 0: raise ValueError('Positive timeout and interval required')
        getter = getattr(self, 'get_' + resource)
        deadline = time.monotonic() + timeout
        while True:
            item = getter(resource_id)
            state = item.get('status', item.get('state'))
            if state in ('completed', 'failed', 'cancelled', 'partial', 'paused', 'waiting_review', 'draft'): return item
            remaining = deadline - time.monotonic()
            if remaining <= 0: raise TimeoutError(f'{resource} {resource_id} still active; resume polling with this ID')
            time.sleep(min(interval, remaining))

    def download(self, path, *, max_bytes=524288000):
        try:
            return self._download(path, max_bytes=max_bytes)
        except requests.RequestException:
            raise SkavioError(0, 'download_transport_error', 'Download interrupted; retry the same result path') from None

    def _download(self, path, *, max_bytes=524288000):
        """Fetch a result; never forward the API key to a redirected S3 origin."""
        from urllib.parse import urljoin
        if not re.fullmatch(r'/v1/[A-Za-z0-9_./%~-]+', path) or '..' in path or '//' in path:
            raise ValueError('Expected relative /v1/ result path')
        if max_bytes <= 0: raise ValueError('Positive byte limit required')
        url = self.base_url + path
        headers = {'Authorization': 'Bearer ' + self._api_key}
        # Separate transport ensures custom authenticated session defaults cannot leak.
        with requests.Session() as transport:
            transport.trust_env = False
            for hop in range(6):
                with transport.get(url, headers=headers, timeout=max(self.timeout, 180), allow_redirects=False, stream=True) as response:
                    if response.status_code in (301, 302, 303, 307, 308):
                        next_url = urljoin(url, response.headers.get('Location', ''))
                        target = urlsplit(next_url)
                        if target.scheme != 'https' or target.username or target.password or not target.hostname:
                            raise ValueError('Unsafe result redirect')
                        if hop == 5: raise ValueError('Too many redirects')
                        if urlsplit(next_url).netloc != urlsplit(url).netloc: headers = {}
                        url = next_url
                        continue
                    if not 200 <= response.status_code < 300:
                        raise SkavioError(response.status_code, 'download_failed', 'Result download failed', response.headers.get('X-Request-ID'))
                    output = bytearray()
                    for chunk in response.iter_content(65536):
                        if len(output) + len(chunk) > max_bytes: raise ValueError('Result exceeds byte limit')
                        output.extend(chunk)
                    return bytes(output)
        raise ValueError('Too many redirects')

def verify_webhook(secret, timestamp, raw_body, signature, *, now=None, tolerance=300):
    import hashlib, hmac
    if not isinstance(timestamp, str) or not isinstance(signature, str) or not isinstance(raw_body, bytes) or not secret or tolerance < 0:
        return False
    try: ts = int(timestamp)
    except ValueError: return False
    if abs((time.time() if now is None else now) - ts) > tolerance: return False
    expected = 'v1=' + hmac.new(secret.encode(), timestamp.encode() + b'.' + raw_body, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected.encode(), signature.encode())
