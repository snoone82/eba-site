#!/usr/bin/env node
/**
 * Tests for /api/lead — the teb-academy.com forms → HubSpot.
 *
 * Stubs global fetch, so this never touches the live portal and needs no token.
 * Zero dependencies; Node strips the endpoint's types on import.
 *
 *   node scripts/lead_endpoint_test.mjs
 *
 * The three payload cases mirror what client/src actually sends. If a form's body
 * changes, a case here should change with it — that is the point of pinning them.
 */
process.env.HUBSPOT_PRIVATE_APP_TOKEN = 'pat-test';

const calls = [];
let existingContact = null;
globalThis.fetch = async (url, init = {}) => {
  const path = String(url).replace('https://api.hubapi.com', '');
  calls.push({ m: init.method || 'GET', path, body: init.body ? JSON.parse(init.body) : undefined });
  const reply = (o, s = 200) => new Response(JSON.stringify(o), { status: s });
  if (path.includes('/contacts/search')) {
    return reply({ results: existingContact ? [{ id: existingContact }] : [] });
  }
  if (path === '/crm/v3/objects/contacts') return reply({ id: 'NEW1' });
  return reply({ id: 'NEW1' });
};

const { default: handler } = await import('../api/lead.ts');
const post = (body) => handler(new Request('https://teb-academy.com/api/lead', {
  method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body),
}));
const props = () => {
  const c = calls.find(x => x.m === 'POST' && x.path === '/crm/v3/objects/contacts');
  const p = calls.find(x => x.m === 'PATCH' && x.path.startsWith('/crm/v3/objects/contacts/'));
  return (c ?? p)?.body?.properties ?? {};
};

let pass = 0, fail = 0;
const t = async (name, fn) => {
  calls.length = 0; existingContact = null;
  try { await fn(); console.log('  PASS  ' + name); pass++; }
  catch (e) { console.log('  FAIL  ' + name + '\n        ' + e.message); fail++; }
};
const eq = (a, b, m) => {
  const A = JSON.stringify(a), B = JSON.stringify(b);
  if (A !== B) throw new Error(`${m}\n        got ${A}\n        want ${B}`);
};

console.log('\nMethod and payload guards');
await t('GET rejected', async () => {
  eq((await handler(new Request('https://x/api/lead'))).status, 405, 'expected 405');
});
await t('OPTIONS preflight answered', async () => {
  eq((await handler(new Request('https://x/api/lead', { method: 'OPTIONS' }))).status, 204, 'expected 204');
});
await t('malformed JSON → 400', async () => {
  const r = await handler(new Request('https://x/api/lead', { method: 'POST', body: 'not json' }));
  eq(r.status, 400, 'expected 400');
});
await t('missing email → 422', async () => {
  eq((await post({ name: 'No Email' })).status, 422, 'expected 422');
});
await t('junk email → 422', async () => {
  eq((await post({ email: 'not-an-email' })).status, 422, 'expected 422');
});
await t('no HubSpot call made when email invalid', async () => {
  await post({ email: 'bad' });
  eq(calls.length, 0, 'should not reach HubSpot');
});

console.log('\nThe three real site payloads');
await t('homepage health check', async () => {
  const r = await post({ name: 'Ste Noone', email: 'ste@firm.co.uk', source: 'lead-magnet:business-health-check', utm_source: 'linkedin' });
  eq(r.status, 200, 'status');
  const p = props();
  eq(p.email, 'ste@firm.co.uk', 'email');
  eq(p.firstname, 'Ste', 'firstname');
  eq(p.lastname, 'Noone', 'lastname');
  eq(p.teba_source, 'website', 'teba_source');
  eq(p.toolbox_talk_user, undefined, 'must not flag toolbox');
});
await t('toolbox generator sets the warm-lead flag', async () => {
  await post({ email: 'a@b.co.uk', source: 'lead-magnet:toolbox-talk-generator' });
  eq(props().toolbox_talk_user, 'true', 'toolbox_talk_user');
});
await t('contact enquiry maps company, message and interest', async () => {
  await post({ name: 'Jo Bloggs', email: 'jo@firm.co.uk', company: 'Bloggs M&E Ltd', enquiry: 'om-manual', message: 'Need a quote', source: 'contact-enquiry' });
  const p = props();
  eq(p.company, 'Bloggs M&E Ltd', 'company');
  eq(p.message, 'Need a quote', 'message');
  eq(p.product_interest, 'o_m', 'product_interest');
});

console.log('\nEnquiry mapping — only the unambiguous rows');
for (const [enquiry, expected] of [
  ['academy', 'academy'], ['om-manual', 'o_m'], ['chatbot', 'co_pilot'],
  ['mentorship', 'mentorship'], ['white-label', 'enterprise'],
]) {
  await t(`${enquiry} → ${expected}`, async () => {
    await post({ email: 'x@y.co.uk', enquiry });
    eq(props().product_interest, expected, 'mapping');
  });
}
for (const enquiry of ['documents', 'other', 'nonsense', '']) {
  await t(`${enquiry || '(empty)'} left unmapped, not guessed`, async () => {
    await post({ email: 'x@y.co.uk', enquiry });
    eq(props().product_interest, undefined, 'should be absent');
  });
}

console.log('\nHygiene');
await t('email lowercased and trimmed', async () => {
  await post({ email: '  MiXeD@Case.COM  ' });
  eq(props().email, 'mixed@case.com', 'normalised email');
});
await t('one-word name invents no surname', async () => {
  await post({ email: 'x@y.co.uk', name: 'Madonna' });
  eq(props().firstname, 'Madonna', 'firstname');
  eq(props().lastname, undefined, 'lastname absent');
});
await t('oversized message is clipped, not rejected', async () => {
  await post({ email: 'x@y.co.uk', message: 'z'.repeat(9000) });
  eq(props().message.length, 5000, 'clipped to 5000');
});
await t('empty strings are dropped, not written blank', async () => {
  await post({ email: 'x@y.co.uk', name: '   ', company: '', message: '' });
  const p = props();
  eq(p.firstname, undefined, 'firstname');
  eq(p.company, undefined, 'company');
  eq(p.message, undefined, 'message');
});
await t('honeypot silently accepted but never written', async () => {
  const r = await post({ email: 'bot@spam.com', website_url: 'http://spam' });
  eq(r.status, 200, 'should look successful to the bot');
  eq((await r.json()).skipped, 'honeypot', 'flagged');
  eq(calls.length, 0, 'must not reach HubSpot');
});

console.log('\nLifecycle and duplicates');
await t('new contact gets lifecycle lead', async () => {
  await post({ email: 'new@firm.co.uk' });
  const patch = calls.find(x => x.m === 'PATCH' && x.body?.properties?.lifecyclestage);
  eq(patch?.body.properties.lifecyclestage, 'lead', 'lead set');
});
await t('existing contact is NOT reset to lead', async () => {
  existingContact = 'EXISTING';
  calls.length = 0;
  await post({ email: 'known@firm.co.uk' });
  eq(calls.some(x => x.m === 'POST' && x.path === '/crm/v3/objects/contacts'), false, 'no duplicate created');
  eq(calls.some(x => x.body?.properties?.lifecyclestage), false, 'lifecycle must not be touched');
});

console.log('\nFailure handling');
await t('HubSpot error → 502, detail not leaked to the browser', async () => {
  const orig = globalThis.fetch;
  globalThis.fetch = async () => new Response(JSON.stringify({ message: 'internal token detail' }), { status: 500 });
  const r = await post({ email: 'x@y.co.uk' });
  eq(r.status, 502, 'status');
  const j = await r.json();
  eq(j.error, 'upstream_error', 'generic error code');
  if (JSON.stringify(j).includes('internal token detail')) throw new Error('leaked upstream detail to the client');
  globalThis.fetch = orig;
});
await t('missing token → 501 naming it', async () => {
  const saved = process.env.HUBSPOT_PRIVATE_APP_TOKEN;
  delete process.env.HUBSPOT_PRIVATE_APP_TOKEN;
  const r = await post({ email: 'x@y.co.uk' });
  eq(r.status, 501, 'status');
  eq((await r.json()).missing, ['HUBSPOT_PRIVATE_APP_TOKEN'], 'names the variable');
  process.env.HUBSPOT_PRIVATE_APP_TOKEN = saved;
});

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
