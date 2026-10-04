// Run only on a trusted Node.js server; never bundle keys for browsers/mobile.
import {SkavioClient} from '../index.mjs';
const api = new SkavioClient(process.env.SKAVIO_API_KEY);
const bulkId = process.env.SKAVIO_BULK_ID;
console.log(await api.pauseBulk(bulkId, process.env.SKAVIO_PAUSE_IDEMPOTENCY_KEY));
console.log(await api.notificationSettings());
console.log(await api.notifications());
// Cancel is permanent: await api.cancelBulk(bulkId, persistedCancelKey);
// Admin settings: await api.updateNotificationSettings({enabled:false}, privateAdminSession);
