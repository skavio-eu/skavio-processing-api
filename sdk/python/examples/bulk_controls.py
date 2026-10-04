"""Trusted-server example; persist one distinct key per business action."""
import os
from skavio import SkavioClient
with SkavioClient(os.environ['SKAVIO_API_KEY']) as api:
    bulk_id = os.environ['SKAVIO_BULK_ID']
    print(api.pause_bulk(bulk_id, idempotency_key=os.environ['SKAVIO_PAUSE_IDEMPOTENCY_KEY']))
    print(api.notification_settings())
    print(api.notifications())
    # Cancel is permanent. To cancel intentionally, use:
    # api.cancel_bulk(bulk_id, idempotency_key=persisted_cancel_key)
    # Company admin settings use an explicit private web session:
    # api.update_notification_settings({'enabled': False}, admin_session=private_admin_session)
