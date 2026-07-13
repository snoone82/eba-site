#!/usr/bin/env python3
"""
Companies House Number Matcher — built exactly to docs/CH-MATCHER-PROMPT.md.

Reads a CSV of warm subcontractor firms (names, no numbers), looks each up on
the Companies House REST API, and writes a company number ONLY where the match
is unambiguous per the spec's strict test. Ambiguous rows go to review with
their candidates. It never guesses.

THE ONE RULE: a file that looks fully populated but contains guessed numbers
is the single worst outcome. Blanks are safe; guesses are not.
"""

import csv
import json
import os
import re
import string
import sys
import time
from difflib import SequenceMatcher
from pathlib import Path

import requests

API_KEY = os.environ.get("CH_API_KEY", "")
BASE = "https://api.company-information.service.gov.uk"
THROTTLE = 0.4          # seconds between requests (spec)
CHECKPOINT = "ch_checkpoint.json"

NOISE = {"LIMITED", "LTD", "PLC", "LLP", "THE", "UK", "GROUP", "HOLDINGS",
         "SERVICES", "CONTRACTORS", "CONTRACTING", "COMPANY", "CO", "AND"}


def die(msg):
    print(f"ERROR: {msg}", file=sys.stderr)
    sys.exit(1)


def normalise(name: str) -> str:
    n = name.upper()
    n = n.replace("&", " AND ")
    n = "".join(c if c not in string.punctuation else " " for c in n)
    words = [w for w in n.split() if w not in NOISE]
    return " ".join(words)


def similarity(a: str, b: str) -> float:
    return SequenceMatcher(None, a, b).ratio()


def search(session, name, tries=5):
    """Search with throttle and escalating 429 backoff. Returns items or None on error."""
    for attempt in range(tries):
        time.sleep(THROTTLE)
        try:
            r = session.get(f"{BASE}/search/companies",
                            params={"q": name, "items_per_page": 10}, timeout=30)
        except requests.RequestException as e:
            print(f"  network error on '{name}' ({e}); retrying...")
            time.sleep(5 * (attempt + 1))
            continue
        if r.status_code == 200:
            return r.json().get("items", [])
        if r.status_code == 401:
            die("401 Unauthorised — CH_API_KEY rejected. Check it is a REST key.")
        if r.status_code == 429:
            wait = 60 * (attempt + 1)
            print(f"  rate limited; sleeping {wait}s...")
            time.sleep(wait)
            continue
        print(f"  HTTP {r.status_code} on '{name}'; retrying...")
        time.sleep(3 * (attempt + 1))
    return None  # recorded as no-match with an error note — never guessed


def classify_row(input_name, items):
    """
    Apply the spec's strict test. Returns (status, matched_number, matched_name,
    top_similarity, candidates) where candidates is the scored top list.
    """
    n_in = normalise(input_name)
    scored = []
    for it in items or []:
        title = it.get("title", "") or ""
        scored.append({
            "name": title,
            "number": it.get("company_number", "") or "",
            "status": it.get("company_status", "") or "",
            "address": it.get("address_snippet", "") or "",
            "sim": similarity(n_in, normalise(title)),
        })
    scored.sort(key=lambda x: x["sim"], reverse=True)

    if not scored:
        return "no-match", "", "", 0.0, scored

    best = scored[0]
    at_90 = [c for c in scored if c["sim"] >= 0.90]
    at_75 = [c for c in scored if c["sim"] >= 0.75]

    # 1. AUTO-CONFIRMED: exactly one ≥0.90, active, and no other candidate ≥0.75.
    if (len(at_90) == 1 and at_90[0]["status"] == "active"
            and len(at_75) == 1):
        return "auto-high", at_90[0]["number"], at_90[0]["name"], best["sim"], scored

    # 2. NEEDS REVIEW.
    if (0.75 <= best["sim"] < 0.90) or len(at_75) >= 2 or \
       (best["sim"] >= 0.90 and best["status"] != "active"):
        return "needs-review", "", "", best["sim"], scored

    # 3. NO MATCH.
    return "no-match", "", "", best["sim"], scored


def main():
    if not API_KEY:
        die("CH_API_KEY not set. Set the environment variable and re-run. "
            "No other credential or connector will be used.")
    if len(sys.argv) < 2:
        die("usage: python ch_matcher.py <WARM_pending_avatar_classification.csv> [output_dir]")

    src = Path(sys.argv[1])
    outdir = Path(sys.argv[2]) if len(sys.argv) > 2 else Path(".")
    outdir.mkdir(parents=True, exist_ok=True)

    rows = list(csv.DictReader(open(src, newline="", encoding="utf-8")))
    print(f"Input: {len(rows)} rows from {src.name}")
    print(f"Calling host: {BASE} (auth: CH_API_KEY from environment)")

    session = requests.Session()
    session.auth = (API_KEY, "")
    session.headers.update({"Accept": "application/json"})

    ckpt_path = outdir / CHECKPOINT
    cache = {}
    if ckpt_path.exists():
        cache = json.loads(ckpt_path.read_text())
        print(f"Resuming — {len(cache)} lookups already cached.")

    results = []
    lookups = 0
    errors = 0
    for i, row in enumerate(rows, 1):
        name = row.get("company_name", "").strip()
        if name in cache:
            items = cache[name]
        else:
            items = search(session, name)
            if items is not None:
                # Errored lookups are NOT checkpointed, so a resumed run retries them.
                cache[name] = items
            lookups += 1
            if lookups % 25 == 0:
                ckpt_path.write_text(json.dumps(cache))
                print(f"  checkpoint at {i}/{len(rows)}")

        if items is None:
            errors += 1
            status, num, mname, sim, cands = "no-match", "", "", 0.0, []
            err_note = "lookup errored after retries — recorded as no-match, not guessed"
        else:
            status, num, mname, sim, cands = classify_row(name, items)
            err_note = ""

        out = dict(row)
        out["ch_status"] = status
        out["matched_company_number"] = num
        out["matched_company_name"] = mname
        out["match_similarity"] = f"{sim:.2f}"
        # Candidates are listed for the human on review rows only.
        for k in range(1, 4):
            c = cands[k - 1] if status == "needs-review" and k <= len(cands) else None
            out[f"candidate_{k}_name"] = c["name"] if c else ""
            out[f"candidate_{k}_number"] = c["number"] if c else ""
            out[f"candidate_{k}_status"] = c["status"] if c else ""
            out[f"candidate_{k}_address"] = c["address"] if c else ""
        out["human_decision_number"] = ""   # the user's column — always empty
        out["human_decision_notes"] = err_note
        results.append(out)

    ckpt_path.write_text(json.dumps(cache))

    fields = list(results[0].keys())

    def write(name, subset):
        with open(outdir / name, "w", newline="", encoding="utf-8") as f:
            w = csv.DictWriter(f, fieldnames=fields)
            w.writeheader()
            w.writerows(subset)

    matched = [r for r in results if r["ch_status"] == "auto-high"]
    review = [r for r in results if r["ch_status"] == "needs-review"]
    nomatch = [r for r in results if r["ch_status"] == "no-match"]

    write("warm_all_results.csv", results)
    write("warm_matched.csv", matched)
    write("warm_needs_review.csv", review)
    write("warm_no_match.csv", nomatch)

    # ── Verification (per spec) ──
    assert len(matched) + len(review) + len(nomatch) == len(rows), "split counts do not sum to input"
    assert all(r["matched_company_number"] for r in matched), "auto-high row missing number"
    assert all(not r["matched_company_number"] for r in review + nomatch), \
        "non-auto row has a number — bug"
    assert all(not r["human_decision_number"] for r in results), "human column must stay empty"

    total = len(rows)
    print("\n──────── RESULT ────────")
    print(f"total rows:      {total}")
    print(f"auto-confirmed:  {len(matched)}")
    print(f"needs review:    {len(review)}")
    print(f"no match:        {len(nomatch)}")
    print(f"lookup errors:   {errors} (recorded as no-match with a note)")
    print(f"auto-confirmed rate: {len(matched)/total*100:.1f}%")
    print("The review rows are for the user to decide. This script does not resolve them.")


if __name__ == "__main__":
    main()
