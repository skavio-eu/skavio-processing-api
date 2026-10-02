"""Verify a Skavio webhook before processing it; caller must durably deduplicate event IDs."""
import hashlib
import hmac
import time

def verify(secret: str, timestamp: str, raw_body: bytes, signature: str) -> bool:
    try:
        ts = int(timestamp)
    except (ValueError, TypeError):
        return False
    if abs(time.time() - ts) > 300:
        return False
    expected = "v1=" + hmac.new(
        secret.encode(), timestamp.encode() + b"." + raw_body, hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(expected, signature)

