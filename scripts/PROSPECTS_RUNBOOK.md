# TEBA prospect list — runbook

How to run `teba_prospect_list.py` yourself and hand the results to Callum.

## One-time setup (~10 minutes)

1. Install Python 3.9+ (python.org → Downloads; tick "Add to PATH" on Windows).
2. In a terminal: `pip install requests`
3. Get a free Companies House API key:
   - https://developer.company-information.service.gov.uk/ → sign in / register
   - "Create an application" → any name (e.g. "TEBA prospects") → environment: **Live**
   - "Create new key" → type: **REST** (not Streaming) → copy the key.

## Running it

```bash
# Mac / Linux
export CH_API_KEY="paste_your_key_here"
python3 scripts/teba_prospect_list.py

# Windows (PowerShell)
$env:CH_API_KEY = "paste_your_key_here"
python scripts\teba_prospect_list.py
```

- Expect roughly **20 minutes per 2,000 companies** (the script deliberately
  stays under the Companies House rate limit).
- It writes `checkpoint.json` as it goes — you can stop it (Ctrl-C) and re-run
  and it picks up where it left off. Delete `checkpoint.json` only if you want
  a completely fresh pull.
- Output: `teba_prospects.csv` in the folder you ran it from.

## Getting full UK coverage

Companies House caps any one search at 10,000 results, and the three SIC codes
UK-wide are far bigger than that. Run it in slices and combine the CSVs:

- Easiest slice: set `LOCATION = "Manchester"` (etc.) at the top of the script,
  run, rename the CSV, repeat per region.
- Rename each output before the next run (`teba_prospects_manchester.csv` …)
  or it will be overwritten.

## What the segments mean

| avatar | who | what to do |
|---|---|---|
| `A_CEILING_HIT` | established, past-micro firms | Academy email segment |
| `B_COMPLIANCE_DROWNED` | micro / young firms | tools segment — content-led, free-tool CTA |
| `C_ENTERPRISE` | full/group/medium filers | **do not email** — Mark's relationship route |
| `EXCLUDED_*` | dormant / not corporate | never enters any list |
| `UNCLASSIFIED` | not enough public data | leave alone; do not guess |

## What to hand Callum

1. Filter the CSV to `A_CEILING_HIT` only → that file is the Academy campaign
   universe. Same again for `B_COMPLIANCE_DROWNED` if running a tools campaign.
2. Send the C_ENTERPRISE list to Mark, not to any email tool.
3. The `email` column is empty **on purpose** — enrichment is a separate paid
   step, and the enriched file needs its own compliance check (below).

## Before anything is actually emailed

- Companies (Ltd/PLC/LLP) can be emailed without prior consent under PECR,
  but a **Legitimate Interests Assessment must be documented first** — one
  short document, kept on file.
- Every email must carry: who it's from, a postal address, and a working
  unsubscribe. Suppress opt-outs permanently.
- If enrichment returns a personal-looking address (firstname@…), UK GDPR
  applies to that person — the LIA needs to cover it.
