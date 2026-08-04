#!/usr/bin/env node
/**
 * TEBA — HubSpot CRM provisioner.
 *
 * Builds the structure described in scratchpad/TEBA_HUBSPOT_CRM_SPEC.md:
 *   §1  Two deal pipelines (Academy, Tools & Enterprise) with stages + probabilities
 *   §2  Custom contact properties
 *   §3  Company properties, so B2B opportunities are counted per firm not per person
 *
 * Idempotent. Run it as many times as you like — existing pipelines and properties
 * are detected by internal name and left alone (or patched, with --update).
 *
 * Usage:
 *   HUBSPOT_PRIVATE_APP_TOKEN=pat-... node scripts/hubspot_crm_setup.mjs --dry-run
 *   HUBSPOT_PRIVATE_APP_TOKEN=pat-... node scripts/hubspot_crm_setup.mjs
 *   HUBSPOT_PRIVATE_APP_TOKEN=pat-... node scripts/hubspot_crm_setup.mjs --verify
 *
 * Flags:
 *   --dry-run   Print every change that would be made. Writes nothing.
 *   --update    Patch drifted labels/options on things that already exist.
 *   --verify    Read-only audit: report what exists vs what the spec requires.
 *
 * Required private app scopes:
 *   crm.schemas.deals.write, crm.schemas.contacts.write, crm.schemas.companies.write
 *   (plus the matching .read scopes, which HubSpot grants alongside)
 *
 * See scripts/HUBSPOT_CRM_RUNBOOK.md for the steps HubSpot has no API for.
 */

const TOKEN = process.env.HUBSPOT_PRIVATE_APP_TOKEN;
const BASE = process.env.HUBSPOT_API_BASE_URL || 'https://api.hubapi.com';

const DRY_RUN = process.argv.includes('--dry-run');
const UPDATE = process.argv.includes('--update');
const VERIFY = process.argv.includes('--verify');

// ── Spec §2 shared option sets ───────────────────────────────────────────────
// Declared once because contacts and companies deliberately use the SAME internal
// names. HubSpot namespaces properties per object type, so `trade_discipline` can
// exist on both — which keeps the Zapier field mapping (spec §6) trivial.

const opts = (...labels) =>
  labels.map((label, displayOrder) => ({
    label,
    value: label
      .toLowerCase()
      .replace(/£/g, '')
      .replace(/\+/g, '_plus')
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, ''),
    displayOrder,
  }));

const TRADE_DISCIPLINE = opts('Mechanical', 'Electrical', 'M&E', 'Fire', 'HVAC', 'Other');
const TURNOVER_BAND = opts('Under £500k', '£500k–£1m', '£1m–£2m', '£2m–£5m', '£5m+');
const TEAM_SIZE = opts('1–5', '6–15', '16–50', '50+');
const TEBA_SOURCE = opts('Website', 'Social', 'Warm Network', 'Referral', 'Event');
const PRODUCT_INTEREST = opts(
  'Academy', 'RAMS', 'COSHH', 'O&M', 'Co-Pilot', 'Mentorship', 'Enterprise',
);
const REGION = opts(
  'London', 'South East', 'South West', 'East of England', 'East Midlands',
  'West Midlands', 'North West', 'North East', 'Yorkshire & Humber',
  'Scotland', 'Wales', 'Northern Ireland', 'International',
);
const YES_NO = [
  { label: 'Yes', value: 'true', displayOrder: 0 },
  { label: 'No', value: 'false', displayOrder: 1 },
];

const PROPERTY_GROUP = { name: 'teba_crm', label: 'TEBA CRM' };

// ── Spec §1 — the two pipelines ──────────────────────────────────────────────
// probability is a string 0–1. isClosed marks the terminal stages so HubSpot's
// native win-rate and forecast reporting works without further configuration.

const stage = (label, probability, isClosed = false) => ({
  label,
  metadata: isClosed ? { probability, isClosed: 'true' } : { probability },
});

const PIPELINES = [
  {
    label: 'Academy',
    displayOrder: 1,
    stages: [
      stage('New Lead', '0.05'),
      stage('Contacted', '0.1'),
      stage('In Conversation', '0.3'),
      stage('Application / Checkout Started', '0.65'),
      stage('Closed Won — Enrolled', '1.0', true),
      stage('Closed Lost — Not Now', '0.0', true),
    ],
  },
  {
    label: 'Tools & Enterprise',
    displayOrder: 2,
    stages: [
      stage('Enquiry', '0.05'),
      stage('Discovery', '0.2'),
      stage('Demo / Trial', '0.4'),
      stage('Proposal', '0.6'),
      stage('Negotiation', '0.8'),
      stage('Closed Won', '1.0', true),
      stage('Closed Lost', '0.0', true),
    ],
  },
];

// ── Spec §2 — contact properties ─────────────────────────────────────────────

const CONTACT_PROPERTIES = [
  {
    name: 'kajabi_contact_id',
    label: 'Kajabi Contact ID',
    type: 'string',
    fieldType: 'text',
    description:
      'The join key between HubSpot and Kajabi. Without it the two databases drift '
      + 'within weeks. Written by the Kajabi→HubSpot Zap; never edit by hand.',
    hasUniqueValue: true,
  },
  {
    name: 'trade_discipline',
    label: 'Trade Discipline',
    type: 'enumeration',
    fieldType: 'select',
    options: TRADE_DISCIPLINE,
    description: 'The trade this contact works in.',
  },
  {
    name: 'company_turnover_band',
    label: 'Company Turnover Band',
    type: 'enumeration',
    fieldType: 'select',
    options: TURNOVER_BAND,
    description:
      'Turnover of the contact\'s firm. The Academy targets the £1m–£2m growth '
      + 'ceiling — this property makes that segment addressable instead of theoretical.',
  },
  {
    name: 'team_size',
    label: 'Team Size',
    type: 'enumeration',
    fieldType: 'select',
    options: TEAM_SIZE,
    description: 'Headcount of the contact\'s firm.',
  },
  {
    name: 'teba_source',
    label: 'TEBA Source',
    type: 'enumeration',
    fieldType: 'select',
    options: TEBA_SOURCE,
    description: 'Where this contact came from. Maps from the Kajabi "Source ·" tags.',
  },
  {
    name: 'product_interest',
    label: 'Product Interest',
    type: 'enumeration',
    fieldType: 'checkbox',
    options: PRODUCT_INTEREST,
    description:
      'What this contact has expressed interest in. Multi-select — maps from the '
      + 'Kajabi "Interest ·" tags.',
  },
  {
    name: 'toolbox_talk_user',
    label: 'Toolbox Talk User',
    type: 'enumeration',
    fieldType: 'booleancheckbox',
    options: YES_NO,
    description: 'Took the free toolbox talk generator. A warm-lead signal.',
  },
];

// ── Spec §3 — company properties ─────────────────────────────────────────────
// Employee count is deliberately absent: HubSpot's native `numberofemployees`
// already covers it. Adding a second field would split the data across two
// properties and break reporting.

const COMPANY_PROPERTIES = [
  {
    name: 'company_turnover_band',
    label: 'Company Turnover Band',
    type: 'enumeration',
    fieldType: 'select',
    options: TURNOVER_BAND,
    description: 'Turnover band of the firm. Same option set as the contact property.',
  },
  {
    name: 'trade_discipline',
    label: 'Trade Discipline',
    type: 'enumeration',
    fieldType: 'select',
    options: TRADE_DISCIPLINE,
    description: 'The trade this firm works in.',
  },
  {
    name: 'teba_region',
    label: 'Region',
    type: 'enumeration',
    fieldType: 'select',
    options: REGION,
    description: 'UK region the firm operates in.',
  },
];

// ── HTTP ─────────────────────────────────────────────────────────────────────

let calls = 0;

async function api(method, path, body) {
  calls += 1;
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const text = await res.text();
  const json = text ? JSON.parse(text) : {};

  if (!res.ok) {
    const detail = json.message || text || res.statusText;
    const err = new Error(`${method} ${path} → ${res.status}: ${detail}`);
    err.status = res.status;
    err.body = json;
    throw err;
  }
  return json;
}

// ── Reporting ────────────────────────────────────────────────────────────────

const results = { created: [], skipped: [], updated: [], failed: [] };

const log = {
  created: (what) => { results.created.push(what); console.log(`  created  ${what}`); },
  skipped: (what, why) => {
    results.skipped.push(what);
    console.log(`  exists   ${what}${why ? `  (${why})` : ''}`);
  },
  updated: (what) => { results.updated.push(what); console.log(`  updated  ${what}`); },
  failed: (what, err) => {
    results.failed.push({ what, error: err.message });
    console.log(`  FAILED   ${what}\n           ${err.message}`);
  },
  planned: (what) => console.log(`  would create  ${what}`),
};

// ── Pipelines ────────────────────────────────────────────────────────────────

async function syncPipelines() {
  console.log('\nDeal pipelines (spec §1)');

  const existing = await api('GET', '/crm/v3/pipelines/deals');
  const byLabel = new Map(existing.results.map((p) => [p.label, p]));

  for (const spec of PIPELINES) {
    const found = byLabel.get(spec.label);
    const what = `pipeline "${spec.label}" (${spec.stages.length} stages)`;

    if (found) {
      const haveStages = found.stages
        .slice()
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map((s) => s.label);
      const wantStages = spec.stages.map((s) => s.label);
      const drifted = JSON.stringify(haveStages) !== JSON.stringify(wantStages);

      log.skipped(what, drifted ? 'STAGES DIFFER FROM SPEC — see below' : `id ${found.id}`);
      if (drifted) {
        console.log(`           in HubSpot: ${haveStages.join(' → ')}`);
        console.log(`           in spec:    ${wantStages.join(' → ')}`);
        console.log('           Stage edits are not automated: reordering or renaming a '
          + 'stage moves live deals.\n           Fix it in Settings → Objects → Deals → Pipelines.');
      }
      continue;
    }

    if (VERIFY) { log.failed(what, 'missing'); continue; }
    if (DRY_RUN) { log.planned(what); continue; }

    try {
      const created = await api('POST', '/crm/v3/pipelines/deals', {
        label: spec.label,
        displayOrder: spec.displayOrder,
        stages: spec.stages.map((s, displayOrder) => ({ ...s, displayOrder })),
      });
      log.created(`${what} — id ${created.id}`);
    } catch (err) {
      log.failed(what, err);
    }
  }
}

// ── Properties ───────────────────────────────────────────────────────────────

async function ensureGroup(objectType) {
  const groups = await api('GET', `/crm/v3/properties/${objectType}/groups`);
  if (groups.results.some((g) => g.name === PROPERTY_GROUP.name)) return true;

  if (VERIFY) { log.failed(`property group "${PROPERTY_GROUP.label}" on ${objectType}`, 'missing'); return false; }
  if (DRY_RUN) { log.planned(`property group "${PROPERTY_GROUP.label}" on ${objectType}`); return true; }

  try {
    await api('POST', `/crm/v3/properties/${objectType}/groups`, {
      name: PROPERTY_GROUP.name,
      label: PROPERTY_GROUP.label,
      displayOrder: -1,
    });
    log.created(`property group "${PROPERTY_GROUP.label}" on ${objectType}`);
    return true;
  } catch (err) {
    log.failed(`property group "${PROPERTY_GROUP.label}" on ${objectType}`, err);
    return false;
  }
}

function optionsDrifted(have = [], want = []) {
  const norm = (o) => o.map((x) => `${x.value}:${x.label}`).join('|');
  return norm(have) !== norm(want);
}

async function syncProperties(objectType, specs, heading) {
  console.log(`\n${heading}`);

  const groupReady = await ensureGroup(objectType);
  const existing = await api('GET', `/crm/v3/properties/${objectType}`);
  const byName = new Map(existing.results.map((p) => [p.name, p]));

  for (const spec of specs) {
    const what = `${objectType}.${spec.name}`;
    const found = byName.get(spec.name);

    if (found) {
      const drifted = spec.options && optionsDrifted(found.options, spec.options);

      if (drifted && UPDATE && !DRY_RUN && !VERIFY) {
        try {
          await api('PATCH', `/crm/v3/properties/${objectType}/${spec.name}`, {
            label: spec.label,
            description: spec.description,
            options: spec.options,
          });
          log.updated(`${what} — options realigned to spec`);
        } catch (err) {
          log.failed(what, err);
        }
      } else {
        log.skipped(what, drifted ? 'options differ from spec — rerun with --update' : undefined);
      }
      continue;
    }

    if (VERIFY) { log.failed(what, 'missing'); continue; }
    if (DRY_RUN) { log.planned(`${what} (${spec.fieldType})`); continue; }
    if (!groupReady) { log.failed(what, new Error('property group unavailable')); continue; }

    try {
      await api('POST', `/crm/v3/properties/${objectType}`, {
        ...spec,
        groupName: PROPERTY_GROUP.name,
      });
      log.created(`${what} (${spec.fieldType})`);
    } catch (err) {
      log.failed(what, err);
    }
  }
}

// ── Association check (spec §3) ──────────────────────────────────────────────
// The contact↔company association is native to every HubSpot portal — there is
// nothing to create. What matters is that it is actually used, so this reports
// how many contacts are currently orphaned from a company record.

async function reportAssociations() {
  console.log('\nCompany associations (spec §3)');

  try {
    const total = await api('POST', '/crm/v3/objects/contacts/search', {
      limit: 1,
      properties: ['email'],
    });
    const orphans = await api('POST', '/crm/v3/objects/contacts/search', {
      limit: 1,
      properties: ['email'],
      filterGroups: [{
        filters: [{ propertyName: 'associatedcompanyid', operator: 'NOT_HAS_PROPERTY' }],
      }],
    });

    console.log(`  contacts total:            ${total.total}`);
    console.log(`  contacts with no company:  ${orphans.total}`);

    if (orphans.total > 0) {
      console.log('  Every contact should sit under a company record — a director and a');
      console.log('  contracts manager at the same firm are one opportunity, not two leads.');
    }
  } catch (err) {
    log.failed('association audit', err);
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  if (!TOKEN) {
    console.error(
      'HUBSPOT_PRIVATE_APP_TOKEN is not set.\n\n'
      + 'Create a private app at Settings → Integrations → Private Apps with scopes:\n'
      + '  crm.schemas.deals.write, crm.schemas.contacts.write, crm.schemas.companies.write\n\n'
      + 'Then:  HUBSPOT_PRIVATE_APP_TOKEN=pat-... node scripts/hubspot_crm_setup.mjs --dry-run\n\n'
      + 'See scripts/HUBSPOT_CRM_RUNBOOK.md.',
    );
    process.exit(1);
  }

  const mode = VERIFY ? 'VERIFY (read-only audit)'
    : DRY_RUN ? 'DRY RUN (no writes)'
      : UPDATE ? 'APPLY + UPDATE drifted options'
        : 'APPLY';
  console.log(`TEBA HubSpot CRM provisioner — ${mode}`);
  console.log(`API: ${BASE}`);

  await syncPipelines();
  await syncProperties('contacts', CONTACT_PROPERTIES, 'Contact properties (spec §2)');
  await syncProperties('companies', COMPANY_PROPERTIES, 'Company properties (spec §3)');
  await reportAssociations();

  console.log('\n─────────────────────────────────────────');
  console.log(`created ${results.created.length}  ·  updated ${results.updated.length}`
    + `  ·  already present ${results.skipped.length}  ·  failed ${results.failed.length}`
    + `  ·  ${calls} API calls`);

  if (results.failed.length) {
    console.log('\nFailures:');
    for (const f of results.failed) console.log(`  ${f.what}: ${f.error}`);
  }

  if (!VERIFY && !DRY_RUN) {
    console.log('\nStill to do by hand — HubSpot has no API for these.');
    console.log('See scripts/HUBSPOT_CRM_RUNBOOK.md §4:');
    console.log('  · saved deal views (Hot deals, Abandoned checkout, Enterprise, ICP-fit)');
    console.log('  · lifecycle stage automation');
    console.log('  · account currency — currently USD, the spec prices in GBP');
  }

  process.exit(results.failed.length ? 1 : 0);
}

main().catch((err) => {
  console.error(`\nAborted: ${err.message}`);
  if (err.status === 401 || err.status === 403) {
    console.error('That is an auth failure — check the token and that it carries the '
      + 'crm.schemas.*.write scopes listed at the top of this file.');
  }
  process.exit(1);
});
