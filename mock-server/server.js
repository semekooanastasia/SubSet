// SubSet testa serveris. Bez atkarībām: node mock-server/server.js
//
// Scenāriji demonstrācijai (vides mainīgais MOCK_SCENARIO):
//   ok    — normāla atbilde (noklusējums)
//   empty — abonementu saraksts ir tukšs
//   error — serveris atbild ar 500 (ekrāna kļūdas stāvoklis)
//   slow  — atbilde pēc 3 sekundēm (ekrāna ielādes stāvoklis)

import { createServer } from 'node:http';
import { CATALOG, seedSubscriptions } from './data.js';

const PORT = Number(process.env.MOCK_PORT || 4000);
const SCENARIO = process.env.MOCK_SCENARIO || 'ok';
const LATENCY = SCENARIO === 'slow' ? 3000 : 400;

let subscriptions = SCENARIO === 'empty' ? [] : seedSubscriptions();
let nextId = subscriptions.length + 1;

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Client',
  'Access-Control-Max-Age': '600',
};

function send(res, status, body) {
  const payload = body === undefined ? '' : JSON.stringify(body);
  res.writeHead(status, { ...CORS, 'Content-Type': 'application/json; charset=utf-8' });
  res.end(payload);
}

function fail(res, status, code, message) {
  send(res, status, { error: { code, message } });
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (chunks.length === 0) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    return null;
  }
}

function requireAuth(req, res) {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) {
    fail(res, 401, 'AUTH-01', 'Nepieciešama autorizācija.');
    return false;
  }
  return true;
}

function validate(body) {
  if (!body) return 'Nederīgs JSON.';
  if (!body.name || !String(body.name).trim()) return 'Nosaukums ir obligāts.';
  if (body.amount === undefined || Number.isNaN(Number(body.amount))) return 'Summa ir obligāta.';
  if (!body.nextPayment) return 'Nākamā maksājuma datums ir obligāts.';
  return null;
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const path = url.pathname;

  if (req.method === 'OPTIONS') {
    res.writeHead(204, CORS);
    res.end();
    return;
  }

  await new Promise((resolve) => setTimeout(resolve, LATENCY));

  if (SCENARIO === 'error' && path !== '/api/health') {
    fail(res, 500, 'SYNC-01', 'Testa serveris atgriež kļūdu (MOCK_SCENARIO=error).');
    return;
  }

  if (path === '/api/health') {
    send(res, 200, { status: 'ok', scenario: SCENARIO });
    return;
  }

  // Autentifikācija: tests pieņem jebkuru e-pastu un izsniedz pagaidu marķieri.
  if (path === '/api/auth/login' && req.method === 'POST') {
    const body = await readBody(req);
    if (!body?.email || !String(body.email).includes('@')) {
      fail(res, 400, 'AUTH-02', 'Nederīgs e-pasta formāts.');
      return;
    }
    send(res, 200, {
      token: `mock-token-${Buffer.from(String(body.email)).toString('base64url')}`,
      user: { email: String(body.email), name: String(body.email).split('@')[0] },
    });
    return;
  }

  if (path === '/api/catalog' && req.method === 'GET') {
    if (!requireAuth(req, res)) return;
    send(res, 200, { items: CATALOG });
    return;
  }

  if (path === '/api/subscriptions') {
    if (!requireAuth(req, res)) return;

    if (req.method === 'GET') {
      send(res, 200, { items: subscriptions });
      return;
    }

    if (req.method === 'POST') {
      const body = await readBody(req);
      const problem = validate(body);
      if (problem) {
        fail(res, 422, 'VALID-01', problem);
        return;
      }
      const created = {
        id: `sub-${nextId += 1}`,
        catalogId: body.catalogId ?? null,
        name: String(body.name).trim(),
        planLabel: body.planLabel ?? '',
        amount: Number(body.amount),
        cycle: body.cycle === 'yearly' ? 'yearly' : 'monthly',
        category: body.category ?? 'Cits',
        nextPayment: body.nextPayment,
        trialUntil: body.trialUntil ?? null,
        amountAfterTrial: body.amountAfterTrial ?? null,
      };
      subscriptions = [...subscriptions, created];
      send(res, 201, created);
      return;
    }
  }

  const match = path.match(/^\/api\/subscriptions\/([\w-]+)$/);
  if (match) {
    if (!requireAuth(req, res)) return;
    const id = match[1];
    const index = subscriptions.findIndex((item) => item.id === id);
    if (index === -1) {
      fail(res, 404, 'SUB-404', 'Abonements nav atrasts.');
      return;
    }

    if (req.method === 'GET') {
      send(res, 200, subscriptions[index]);
      return;
    }

    if (req.method === 'PATCH') {
      const body = await readBody(req);
      if (!body) {
        fail(res, 400, 'VALID-02', 'Nederīgs JSON.');
        return;
      }
      const updated = { ...subscriptions[index], ...body, id };
      subscriptions = subscriptions.map((item, i) => (i === index ? updated : item));
      send(res, 200, updated);
      return;
    }

    if (req.method === 'DELETE') {
      subscriptions = subscriptions.filter((item) => item.id !== id);
      send(res, 204);
      return;
    }
  }

  fail(res, 404, 'HTTP-404', `Nezināms ceļš: ${req.method} ${path}`);
});

server.listen(PORT, () => {
  console.log(`SubSet testa serveris: http://localhost:${PORT}  (scenārijs: ${SCENARIO})`);
});
