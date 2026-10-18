import { request } from './client.js';

export async function fetchCatalog(signal) {
  const payload = await request('/api/catalog', { signal });
  return payload?.items ?? [];
}
