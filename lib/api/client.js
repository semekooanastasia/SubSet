import { ApiError, toApiError } from './errors.js';
import { getToken } from '../session.js';

export const BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000').replace(/\/$/, '');

// Visas galvenes tiek veidotas vienā vietā.
function buildHeaders(hasBody) {
  const headers = {
    Accept: 'application/json',
    'X-Client': 'subset-web',
  };
  if (hasBody) headers['Content-Type'] = 'application/json';
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function parse(response) {
  if (response.status === 204) return null;
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    throw new ApiError({
      code: 'PARSE-01',
      status: response.status,
      message: 'Serveris atgrieza neatpazīstamu atbildi.',
    });
  }
}

export async function request(path, { method = 'GET', body, signal } = {}) {
  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: buildHeaders(body !== undefined),
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    });
  } catch (error) {
    if (error?.name === 'AbortError') throw error;
    throw toApiError(error);
  }

  const payload = await parse(response);

  if (!response.ok) {
    throw new ApiError({
      code: payload?.error?.code || `HTTP-${response.status}`,
      status: response.status,
      message: payload?.error?.message || 'Pieprasījums neizdevās.',
    });
  }

  return payload;
}
