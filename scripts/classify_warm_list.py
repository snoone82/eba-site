#!/usr/bin/env python3
"""
Classify the KEYIS warm list against Companies House.

Takes the merged warm CSV (keyis_warm_master_all_regions.csv), looks each
company up on Companies House BY NAME, and — only when the top result is a
close name match — attaches the company number, accounts category and TEBA
avatar using the same rules as teba_prospect_list.py.

Companies it cannot confidently match stay PENDING — flagged, never guessed.

Usage:
  export CH_API_KEY="..."
  python classify_warm_list.py keyis_warm_master_all_regions.csv

Output: <input>_classified.csv
"""

import csv
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

# Reuse the vetted request/classify machinery from the main script.
sys.path.insert(0, str(Path(__file__).parent))
from teba_prospect_list import (  # noqa: E402
    get, classify, established_cutoff, CORPORATE_TYPES, API_KEY, die,
)


def norm(n):
    n = re.sub(r"\(.*?\)", " ", n)
    n = re.sub(r"[^A-Z0-9 ]", " ", n.upper())
    n = re.sub(r"\b(LTD|LIMITED|LLP|PLC|UK|NW|NORTH WEST|THE|CO|COMPANY|GROUP|SERVICES|CONTRACTORS|CONTRACTING)\b", " ", n)
    return re.sub(r"\s+", " ", n).strip()


def main():
    if not API_KEY:
        die("CH_API_KEY not set.")
    if len(sys.argv) < 2:
        die("usage: python classify_warm_list.py <warm_list.csv>")

    src = Path(sys.argv[1])
    rows = list(csv.DictReader(open(src, newline="", encoding="utf-8")))
    cutoff = established_cutoff()
    print(f"{len(rows)} warm companies to classify...\n")

    for i, r in enumerate(rows, 1):
        if r.get("avatar_if_matched") and r["avatar_if_matched"] != "PENDING_CLASSIFICATION":
            continue  # already classified via the cold list

        data = get("/search/companies", params={"q": r["company_name"], "items_per_page": 3})
        hit = None
        if data and data != "FETCH_FAILED":
            for item in data.get("items", []):
                if norm(item.get("title", "")) == norm(r["company_name"]):
                    hit = item
                    break
        if not hit:
            r["avatar_if_matched"] = "PENDING — no confident CH match"
            continue

        num = hit.get("company_number", "")
        prof = get(f"/company/{num}")
        pseudo = {
            "company_type": (prof or {}).get("type", "") if prof != "FETCH_FAILED" else "",
            "date_of_creation": (prof or {}).get("date_of_creation", "") if prof != "FETCH_FAILED" else "",
        }
        avatar, reason = classify(pseudo, prof, cutoff)
        r["company_number"] = num
        r["avatar_if_matched"] = avatar
        r["avatar_reason"] = reason
        r["classified_at"] = datetime.now(timezone.utc).isoformat(timespec="seconds")
        if i % 20 == 0:
            print(f"  {i}/{len(rows)}")

    out = src.with_name(src.stem + "_classified.csv")
    fields = list(rows[0].keys())
    for extra in ("avatar_reason", "classified_at"):
        if extra not in fields:
            fields.append(extra)
    with open(out, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fields, extrasaction="ignore")
        w.writeheader()
        w.writerows(rows)

    from collections import Counter
    print("\nResult:", dict(Counter(r.get("avatar_if_matched", "") for r in rows)))
    print("wrote", out)


if __name__ == "__main__":
    main()
