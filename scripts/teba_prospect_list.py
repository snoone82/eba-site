#!/usr/bin/env python3
"""
TEBA prospect list builder — Companies House.

Pulls real, verifiable companies from the Companies House public API and
segments them into TEBA avatars using observable firmographic proxies.

WHAT THIS SCRIPT DOES NOT DO
----------------------------
  * It does not invent companies. Every row is a real company number you can
    check at https://find-and-update.company-information.service.gov.uk/
  * It does not produce email addresses. Companies House does not hold them.
    Email enrichment is a separate, paid, consented step (see the spec doc).
  * It does not estimate turnover. Most small UK companies file micro-entity or
    abridged accounts with no profit-and-loss. Any "revenue" column you see in
    a list that was not bought from a credit bureau is a guess. We use accounts
    filing category as an honest proxy and label it as such.

LEGAL NOTE
----------
Companies House contains only incorporated bodies (Ltd, PLC, LLP). Under PECR,
these are "corporate subscribers" and may be sent marketing email without prior
consent. Sole traders and ordinary partnerships are NOT on the register, so
sourcing from here structurally excludes the individual-subscriber problem.
UK GDPR still applies to any named individual you later contact. Do not use
this file to email named directors without a documented Legitimate Interests
Assessment. Every email needs sender ID, a postal address, and an opt-out.

SETUP
-----
  1. Register a free application: https://developer.company-information.service.gov.uk/
  2. Create a REST API key.
  3. export CH_API_KEY="your_key_here"
  4. pip install requests
  5. python teba_prospect_list.py

Rate limit is 600 requests per 5 minutes. The script self-throttles and
checkpoints, so it is safe to stop and restart.

REVIEW NOTES (applied fixes — see git history)
----------------------------------------------
  * THROTTLE was 0.35s = ~857 req/5min, OVER the 600 limit. Now 0.55s (~545).
  * Accounts-type map corrected to the real Companies House enumeration:
    "no-accounts-filed" is not a real value; abridged filings (very common
    for the target segment) were falling to UNCLASSIFIED; dormant companies
    were being classified as tools buyers despite not trading.
  * "private-limited-shares-section-30-exemption" (a real Ltd variant) was
    being dropped as non-corporate.
  * Failed profile fetches are no longer checkpointed, so a re-run retries
    them instead of permanently recording None.
  * sic_codes joined as a comma-separated string per the advanced-search spec.
"""

import csv
import json
import os
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

import requests

# --------------------------------------------------------------------------
# CONFIG — edit these
# --------------------------------------------------------------------------

API_KEY = os.environ.get("CH_API_KEY", "")

BASE = "https://api.company-information.service.gov.uk"

# Confirmed UK SIC 2007 codes.
#   43210 Electrical installation
#   43220 Plumbing, heat and air-conditioning installation
#   43290 Other construction installation
# Add others only after verifying them at resources.companieshouse.gov.uk/sic/
SIC_CODES = ["43210", "43220", "43290"]

# Optional geographic narrowing. Empty string = whole UK.
# Companies House matches this against the registered office address.
LOCATION = ""

# Only companies incorporated on or before this date are considered
# "established" for Avatar 1. Five years before today.
ESTABLISHED_YEARS = 5

# Safety cap. Companies House advanced search returns at most 10,000 results
# per query, so a nationwide pull on a busy SIC code WILL be truncated.
# Narrow by LOCATION or by incorporation date window to get full coverage.
MAX_COMPANIES = 2000

OUTPUT_CSV = "teba_prospects.csv"
CHECKPOINT = "checkpoint.json"

# Seconds between requests. The limit is 600 req / 5 min (= 2.0 req/sec
# maximum). 0.55s ≈ 545 req / 5 min, safely under it.
THROTTLE = 0.55

# --------------------------------------------------------------------------

SESSION = requests.Session()
SESSION.auth = (API_KEY, "")
SESSION.headers.update({"Accept": "application/json"})

# PECR corporate subscriber types. Anything not in this set is dropped.
CORPORATE_TYPES = {
    "ltd",
    "plc",
    "llp",
    "private-limited-guarant-nsc",
    "private-limited-guarant-nsc-limited-exemption",
    "private-limited-shares-section-30-exemption",
    "private-unlimited",
    "private-unlimited-nsc",
    "scottish-partnership",
}

# Accounts filing categories per the Companies House account_type enumeration,
# used as the size proxy.
#   MICRO  — smallest trading companies (micro-entity regime / first period).
#   SMALL  — small-companies regime, incl. the abridged and exemption variants.
#   LARGE  — full/group/medium: past the small-companies regime.
#   Dormant is handled separately: a dormant company is not trading and is
#   not a buyer of anything.
MICRO = {"micro-entity", "initial"}
SMALL = {
    "small",
    "total-exemption-full",
    "total-exemption-small",
    "audit-exemption-subsidiary",
    "filing-exemption-subsidiary",
    "unaudited-abridged",
    "audited-abridged",
    "partial-exemption",
}
LARGE = {"full", "group", "medium"}
NOT_TRADING = {"dormant"}


def die(msg):
    print(f"ERROR: {msg}", file=sys.stderr)
    sys.exit(1)


def get(path, params=None, tries=4):
    """GET with throttling, 429 backoff, and honest failure."""
    for attempt in range(tries):
        time.sleep(THROTTLE)
        try:
            r = SESSION.get(f"{BASE}{path}", params=params, timeout=30)
        except requests.RequestException as e:
            print(f"  network error ({e}), retrying...")
            time.sleep(5 * (attempt + 1))
            continue

        if r.status_code == 200:
            return r.json()
        if r.status_code == 401:
            die("401 Unauthorised — check CH_API_KEY is a REST key, not a stream key.")
        if r.status_code == 404:
            return None
        if r.status_code == 429:
            wait = 60 * (attempt + 1)
            print(f"  rate limited, sleeping {wait}s...")
            time.sleep(wait)
            continue
        print(f"  HTTP {r.status_code} on {path}, retrying...")
        time.sleep(3 * (attempt + 1))

    print(f"  GIVING UP on {path} — recorded as unresolved, not guessed.")
    return "FETCH_FAILED"


def established_cutoff():
    """Now minus ESTABLISHED_YEARS, leap-day safe."""
    now = datetime.now(timezone.utc)
    try:
        return now.replace(year=now.year - ESTABLISHED_YEARS)
    except ValueError:  # 29 Feb on a non-leap target year
        return now.replace(year=now.year - ESTABLISHED_YEARS, day=28)


def search_companies():
    """Page through advanced search. Returns list of raw hits."""
    established_before = established_cutoff()
    print(f"Searching SIC {', '.join(SIC_CODES)}"
          f"{' in ' + LOCATION if LOCATION else ' (UK-wide)'}...")

    hits, start = [], 0
    page_size = 100

    while len(hits) < MAX_COMPANIES:
        params = {
            "sic_codes": ",".join(SIC_CODES),
            "company_status": "active",
            "size": page_size,
            "start_index": start,
        }
        if LOCATION:
            params["location"] = LOCATION

        data = get("/advanced-search/companies", params=params)
        if not data or data == "FETCH_FAILED":
            break

        items = data.get("items", [])
        if not items:
            break

        hits.extend(items)
        total = data.get("hits", 0)
        print(f"  {len(hits)} / {min(total, MAX_COMPANIES)}")

        start += page_size
        if start >= total:
            break

    if len(hits) >= 10000:
        print("\n  WARNING: hit the 10,000-result ceiling. This list is TRUNCATED.")
        print("  Narrow by LOCATION or incorporation window and re-run.\n")

    return hits[:MAX_COMPANIES], established_before


def profile(number):
    """Fetch company profile for the accounts filing category."""
    return get(f"/company/{number}")


def classify(hit, prof, established_before):
    """
    Map a company to a TEBA avatar using observable proxies only.

    Avatar A (Ceiling-Hit Operator) — the Academy buyer.
        Established 5+ yrs, files small-regime accounts (i.e. has grown
        beyond micro), corporate body.
    Avatar B (Compliance-Drowned) — the tools buyer.
        Micro-entity filer. Small, owner still hands-on.
    Avatar C (Enterprise) — chatbot only, relationship sale.
        Files full/group/medium accounts. NOT for the email campaign.
    Excluded — dormant (not trading) or not a PECR corporate subscriber.
    Unclassified — insufficient data. Flagged, never guessed.
    """
    ctype = hit.get("company_type", "")
    if ctype not in CORPORATE_TYPES:
        return "EXCLUDED_NOT_CORPORATE", "PECR: not a corporate subscriber"

    created = hit.get("date_of_creation", "")
    try:
        inc = datetime.fromisoformat(created).replace(tzinfo=timezone.utc)
    except (ValueError, TypeError):
        return "UNCLASSIFIED", "no incorporation date"

    established = inc <= established_before

    if prof == "FETCH_FAILED":
        return "UNCLASSIFIED", "profile fetch failed — re-run to retry"

    acc = ""
    if prof:
        acc = (prof.get("accounts", {})
                   .get("last_accounts", {})
                   .get("type", "")) or ""

    if not acc or acc in {"null", "no-accounts-type-available"}:
        return "UNCLASSIFIED", "no accounts filed yet — cannot size"

    if acc in NOT_TRADING:
        return "EXCLUDED_DORMANT", "dormant — not trading, not a buyer"
    if acc in LARGE:
        return "C_ENTERPRISE", "files full/group/medium accounts"
    if acc in MICRO:
        return "B_COMPLIANCE_DROWNED", f"micro filer ({acc})"
    if acc in SMALL:
        if established:
            return "A_CEILING_HIT", f"established {inc.year}, {acc} filer"
        return "B_COMPLIANCE_DROWNED", f"young ({inc.year}), {acc} filer"

    return "UNCLASSIFIED", f"unmapped accounts type: {acc}"


def addr(a):
    if not a:
        return "", ""
    parts = [a.get("address_line_1"), a.get("address_line_2"),
             a.get("locality"), a.get("region")]
    return ", ".join(p for p in parts if p), a.get("postal_code", "") or ""


def main():
    if not API_KEY:
        die("CH_API_KEY not set. See SETUP at the top of this file.")

    done = {}
    if Path(CHECKPOINT).exists():
        done = json.loads(Path(CHECKPOINT).read_text())
        print(f"Resuming — {len(done)} companies already enriched.\n")

    hits, established_before = search_companies()
    print(f"\nFound {len(hits)} active companies. Enriching...\n")

    rows = []
    for i, hit in enumerate(hits, 1):
        num = hit.get("company_number", "")
        if not num:
            continue

        if num in done:
            prof = done[num]
        else:
            prof = profile(num)
            # Only checkpoint real results — a failed fetch is retried on
            # the next run rather than being recorded as permanent truth.
            if prof != "FETCH_FAILED":
                done[num] = prof
            if i % 25 == 0:
                Path(CHECKPOINT).write_text(json.dumps(done))
                print(f"  enriched {i}/{len(hits)}")

        avatar, reason = classify(hit, prof, established_before)
        street, postcode = addr(hit.get("registered_office_address"))

        acc = "none"
        if prof and prof != "FETCH_FAILED":
            acc = (prof.get("accounts", {})
                       .get("last_accounts", {})
                       .get("type", "")) or "none"

        rows.append({
            "company_name": hit.get("company_name", ""),
            "company_number": num,
            "avatar": avatar,
            "avatar_reason": reason,
            "company_type": hit.get("company_type", ""),
            "pecr_status": "corporate subscriber"
                           if hit.get("company_type") in CORPORATE_TYPES
                           else "NOT corporate — do not email",
            "incorporated": hit.get("date_of_creation", ""),
            "accounts_filing_category": acc,
            "size_proxy_note": "accounts category, NOT turnover",
            "sic_codes": "; ".join(hit.get("sic_codes", []) or []),
            "registered_address": street,
            "postcode": postcode,
            "companies_house_url":
                f"https://find-and-update.company-information.service.gov.uk/company/{num}",
            "email": "",
            "email_source": "TO BE ENRICHED — not held by Companies House",
            "lawful_basis": "legitimate interests (LIA required before contact)",
            "source": "Companies House public API",
            "retrieved_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        })

    Path(CHECKPOINT).write_text(json.dumps(done))

    if not rows:
        die("No rows produced. Check SIC codes and API key.")

    with open(OUTPUT_CSV, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        w.writeheader()
        w.writerows(rows)

    counts = {}
    for r in rows:
        counts[r["avatar"]] = counts.get(r["avatar"], 0) + 1

    print(f"\nWrote {len(rows)} rows to {OUTPUT_CSV}\n")
    print("Segment breakdown:")
    for k in sorted(counts):
        print(f"  {k:<26} {counts[k]:>5}")

    print("\nBefore this goes to Callum:")
    print("  * A_CEILING_HIT is the Academy email segment.")
    print("  * B_COMPLIANCE_DROWNED is a tools segment — content-led, free tool CTA.")
    print("  * C_ENTERPRISE must NOT be emailed. Mark's relationship route.")
    print("  * EXCLUDED_* rows must not enter any campaign list.")
    print("  * UNCLASSIFIED rows are honest gaps. Do not backfill them by guessing.")
    print("  * The email column is empty on purpose. Enrichment is a paid,")
    print("    documented step — see the spec document.")


if __name__ == "__main__":
    main()
