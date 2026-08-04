#!/usr/bin/env node
/**
 * Tests for /api/kajabi-webhook — the Kajabi → HubSpot sync.
 *
 * Stubs global fetch, so this never touches the live HubSpot portal and needs
 * no token. Zero dependencies; Node strips the endpoint's types on import.
 *
 *   node scripts/kajabi_webhook_test.mjs
 *
 * The payload-shape cases matter most. Kajabi does not publish one stable
 * webhook envelope and the shape differs between contact, form and purchase
 * events, so the endpoint reads from a list of candidate paths. These tests pin
 * that behaviour — including that a shape it cannot read returns 422 echoing the
 * keys it did receive, rather than silently writing a blank contact.
 */
process.env.HUBSPOT_PRIVATE_APP_TOKEN = 'pat-test';
process.env.KAJABI_WEBHOOK_SECRET = 's3cret';

const calls = [];
globalThis.fetch = async (url, init = {}) => {
  const path = String(url).replace('https://api.hubapi.com', '');
  const body = init.body ? JSON.parse(init.body) : undefined;
  calls.push({ m: init.method || 'GET', path, body });
  const reply = (o, s = 200) => new Response(JSON.stringify(o), { status: s });
  if (path.includes('/contacts/search')) return reply({ results: [] });        // no existing contact
  if (path === '/crm/v3/objects/contacts') return reply({ id: 'C1' });
  if (path.startsWith('/crm/v3/objects/contacts/')) return reply({ id: 'C1' });
  if (path === '/crm/v3/objects/deals') return reply({ id: 'D1' });
  if (path.startsWith('/crm/v4/objects/deals/')) return reply({});
  return reply({});
};

const { default: handler } = await import('../api/kajabi-webhook.ts');
const post = (body, qs = '') => handler(new Request('https://x/api/kajabi-webhook?secret=s3cret' + qs, {
  method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body),
}));

let pass = 0, fail = 0;
const t = async (name, fn) => {
  calls.length = 0;
  try { await fn(); console.log('  PASS  ' + name); pass++; }
  catch (e) { console.log('  FAIL  ' + name + '\n        ' + e.message); fail++; }
};
const eq = (a, b, m) => { const A=JSON.stringify(a), B=JSON.stringify(b); if (A!==B) throw new Error(`${m}\n        got ${A}\n        want ${B}`); };

console.log('\nAuth + method');
await t('rejects wrong secret', async () => {
  const r = await handler(new Request('https://x/?secret=nope', { method:'POST', body:'{}' }));
  eq(r.status, 401, 'expected 401');
});
await t('rejects missing secret', async () => {
  const r = await handler(new Request('https://x/', { method:'POST', body:'{}' }));
  eq(r.status, 401, 'expected 401');
});
await t('accepts secret via header', async () => {
  const r = await handler(new Request('https://x/', { method:'POST',
    headers:{'x-teba-secret':'s3cret','content-type':'application/json'}, body: JSON.stringify({email:'a@b.com'}) }));
  eq(r.status, 200, 'expected 200');
});
await t('PUT rejected', async () => {
  const r = await handler(new Request('https://x/?secret=s3cret', { method:'PUT' }));
  eq(r.status, 405, 'expected 405');
});

console.log('\nPayload shape tolerance');
await t('flat {email,id}', async () => {
  const r = await post({ email:'ste@teba.com', id: 998877, name:'Ste Noone' });
  const j = await r.json();
  eq(j.ok, true, 'not ok');
  const created = calls.find(c => c.path === '/crm/v3/objects/contacts' && c.m === 'POST');
  eq(created.body.properties.kajabi_contact_id, '998877', 'join key wrong');
  eq(created.body.properties.firstname, 'Ste', 'firstname');
  eq(created.body.properties.lastname, 'Noone', 'lastname');
});
await t('nested {contact:{...}}', async () => {
  const r = await post({ contact: { email:'n@b.com', id: 42, first_name:'Nested' } });
  const j = await r.json();
  eq(j.ok, true, 'not ok');
  const c = calls.find(x => x.path === '/crm/v3/objects/contacts' && x.m === 'POST');
  eq(c.body.properties.kajabi_contact_id, '42', 'nested id');
});
await t('one-word name invents no surname', async () => {
  await post({ email:'x@b.com', name:'Cher' });
  const c = calls.find(x => x.path === '/crm/v3/objects/contacts' && x.m === 'POST');
  eq(c.body.properties.firstname, 'Cher', 'firstname');
  eq(c.body.properties.lastname, undefined, 'lastname should be absent');
});
await t('missing email → 422 echoing keys', async () => {
  const r = await post({ foo:1, bar:2 });
  eq(r.status, 422, 'expected 422');
  const j = await r.json();
  eq(j.received_keys, ['foo','bar'], 'should echo keys');
});

console.log('\nTag mapping');
await t('known tags map, unknown dropped', async () => {
  await post({ email:'t@b.com', tags:['Source · Social Media','Interest · Academy','Interest · AI Tools','Random'] });
  const c = calls.find(x => x.path === '/crm/v3/objects/contacts' && x.m === 'POST');
  eq(c.body.properties.teba_source, 'social_media', 'source');
  eq(c.body.properties.product_interest, 'academy', 'AI Tools must NOT map');
});
await t('tag objects {name} work too', async () => {
  await post({ email:'t2@b.com', tags:[{name:'Source · Referral'}] });
  const c = calls.find(x => x.path === '/crm/v3/objects/contacts' && x.m === 'POST');
  eq(c.body.properties.teba_source, 'referral', 'source from object tag');
});
await t('enterprise long tag maps', async () => {
  await post({ email:'t3@b.com', tags:['Interest · Enterprise / In-House Training'] });
  const c = calls.find(x => x.path === '/crm/v3/objects/contacts' && x.m === 'POST');
  eq(c.body.properties.product_interest, 'enterprise', 'enterprise');
});

console.log('\nPurchase → deal');
await t('string amount stripped to number', async () => {
  const r = await post({ email:'p@b.com', id:7, amount:'£999.00 GBP', offer_title:'Founding Cohort', name:'A B' });
  const j = await r.json();
  eq(j.event, 'purchase', 'event');
  const d = calls.find(x => x.path === '/crm/v3/objects/deals');
  eq(d.body.properties.amount, '999', 'amount');
  eq(d.body.properties.pipeline, '4018643182', 'pipeline');
  eq(d.body.properties.dealstage, '5818433734', 'stage');
  eq(d.body.properties.dealname, 'Founding Cohort — A B', 'deal name');
});
await t('deal associated to contact', async () => {
  await post({ email:'p2@b.com', amount: 1299 });
  const a = calls.find(x => x.path.startsWith('/crm/v4/objects/deals/'));
  eq(a.path, '/crm/v4/objects/deals/D1/associations/default/contacts/C1', 'association path');
  eq(a.m, 'PUT', 'method');
});
await t('purchase sets lifecycle customer', async () => {
  await post({ email:'p3@b.com', amount: 999 });
  const patches = calls.filter(x => x.m === 'PATCH' && x.body?.properties?.lifecyclestage);
  eq(patches.some(p => p.body.properties.lifecyclestage === 'customer'), true, 'customer set');
  eq(patches.some(p => p.body.properties.lifecyclestage === 'lead'), false, 'must not set lead on purchase');
});
await t('contact event sets lifecycle lead', async () => {
  await post({ email:'l@b.com', id: 5 });
  const patches = calls.filter(x => x.m === 'PATCH' && x.body?.properties?.lifecyclestage);
  eq(patches.some(p => p.body.properties.lifecyclestage === 'lead'), true, 'lead set on new contact');
});
await t('?event=contact overrides amount inference', async () => {
  const r = await post({ email:'o@b.com', amount: 999 }, '&event=contact');
  const j = await r.json();
  eq(j.event, 'contact', 'should be contact');
  eq(calls.some(x => x.path === '/crm/v3/objects/deals'), false, 'no deal expected');
});
await t('no deal created for plain contact', async () => {
  await post({ email:'c@b.com' });
  eq(calls.some(x => x.path === '/crm/v3/objects/deals'), false, 'no deal expected');
});

console.log('\nExisting contact');
await t('existing contact is patched not duplicated', async () => {
  const orig = globalThis.fetch;
  globalThis.fetch = async (u, i={}) => {
    const p = String(u).replace('https://api.hubapi.com','');
    calls.push({m:i.method||'GET', path:p, body: i.body?JSON.parse(i.body):undefined});
    if (p.includes('/contacts/search')) return new Response(JSON.stringify({results:[{id:'EXISTING'}]}),{status:200});
    return new Response(JSON.stringify({id:'X'}),{status:200});
  };
  calls.length = 0;
  const r = await post({ email:'dupe@b.com', id: 11 });
  const j = await r.json();
  eq(j.created, false, 'should not report created');
  eq(calls.some(x => x.m==='POST' && x.path==='/crm/v3/objects/contacts'), false, 'must not POST a duplicate');
  eq(calls.some(x => x.m==='PATCH' && x.path==='/crm/v3/objects/contacts/EXISTING'), true, 'should PATCH existing');
  globalThis.fetch = orig;
});

console.log('\nError surfacing');
await t('403 becomes missing_scope with hint', async () => {
  const orig = globalThis.fetch;
  globalThis.fetch = async () => new Response(JSON.stringify({message:'no scope'}),{status:403});
  const r = await post({ email:'e@b.com' });
  eq(r.status, 403, 'status');
  const j = await r.json();
  eq(j.error, 'missing_scope', 'error code');
  if (!j.hint?.includes('crm.objects.contacts.write')) throw new Error('hint missing scope names');
  globalThis.fetch = orig;
});

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
