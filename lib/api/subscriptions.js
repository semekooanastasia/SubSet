import { request } from './client.js';

export async function fetchSubscriptions(signal) {
  const payload = await request('/api/subscriptions', { signal });
  return payload?.items ?? [];
}

export function createSubscription(subscription) {
  return request('/api/subscriptions', { method: 'POST', body: subscription });
}

export function updateSubscription(id, changes) {
  return request(`/api/subscriptions/${id}`, { method: 'PATCH', body: changes });
}

export function deleteSubscription(id) {
  return request(`/api/subscriptions/${id}`, { method: 'DELETE' });
}
