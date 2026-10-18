import { request } from './client.js';

export function login(email) {
  return request('/api/auth/login', { method: 'POST', body: { email } });
}
