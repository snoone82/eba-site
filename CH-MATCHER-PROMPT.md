# Companies House Number Matcher — Master Prompt (v1)

**Commit this file to the repo before running. This is a task specification for Claude Code. Follow it exactly. Do not add scope.**

---

## What you are building

A single Python script that reads a CSV of warm subcontractor firms (company names, no company numbers), looks each one up against the **Companies House public REST API**, and writes back a company number **only where the match is unambiguous**. Where it is not unambiguous, it records the candidates for a human to decide. It never guesses.

Input file: `WARM_pending_avatar_classification.csv` (348 rows).
Output files: `warm_matched.csv`, `warm_needs_review.csv`, `warm_no_match.csv`, and a combined `warm_all_results.csv`.

---

## THE ONE RULE THAT OVERRIDES EVERYTHING

**This script's job is to be honest about what it could not confidently match.**

- You are NOT to fill in a company number unless the match clears the strict test defined below.
- Rows that are ambiguous MUST go to `warm_needs_review.csv` with their candidates listed — they are for a human to decide, not for you or the script to resolve.
- Rows with no plausible match MUST be left blank and go to `warm_no_match.csv`.
- **Do NOT, at any point, "complete" the file by picking a best-guess candidate for an ambiguous row. A file that looks fully populated but contains guessed numbers is the single worst outcome and defeats the entire purpose.** The review pile is a success, not a failure. If in doubt, a row goes to review — never to matched.
- If you are tempted to improve the completion rate by relaxing the test, STOP. Do not. Report the completion rate honestly instead.

This data is used to suppress warm relationships from a cold email campaign. A wrong company number here means either a warm business partner gets cold-spammed, or the wrong company is suppressed. Both are caused by a guessed match. Blanks are safe; guesses are not.

---

## Credentials

- Use the **Companies House REST API key** provided by the user as an environment variable: `CH_API_KEY`.
- Do NOT use any other Companies House connection, credential, or MCP connector that may be available in this environment. Use the user's key only, from the environment variable. If `CH_API_KEY` is not set, stop and tell the user to set it — do not fall back to anything else.
- Auth is HTTP Basic: the API key is the username, password blank. (`requests` supports `auth=(API_KEY, "")`.)
- Base URL: `https://api.company-information.service.gov.uk`
- Search endpoint: `GET /search/companies?q=<name>&items_per_page=10`

---

## Rate limiting

- The limit is **600 requests per 5 minutes**. Throttle to stay well under: sleep ~0.4s between requests.
- On HTTP 429, back off (sleep 60s, then retry, escalating). Never hammer.
- **Checkpoint after every 25 lookups** to a JSON file (`ch_checkpoint.json`) keyed by input company name, so a stopped run resumes without repeating work and without losing progress. On start, load the checkpoint if present.

---

## The matching logic (STRICT)

For each input row, search the API by the company name and get up to 10 candidates. Then score.

**Name normalisation** (apply to BOTH the input name and each candidate before comparing):
- Uppercase.
- Remove punctuation.
- Strip common suffixes and noise words: LIMITED, LTD, PLC, LLP, THE, UK, GROUP, HOLDINGS, SERVICES, CONTRACTORS, CONTRACTING, COMPANY, CO, AND, &.
- Collapse whitespace.

**Similarity**: use a string similarity ratio (Python `difflib.SequenceMatcher` ratio on the normalised strings — no external libs needed). Range 0.0–1.0.

**Classification per row — apply in this order:**

1. **AUTO-CONFIRMED** (write the number, flag `auto-high`) — ALL of these must hold:
   - Exactly ONE candidate has normalised similarity ≥ **0.90**, AND
   - that candidate's `company_status` is `active`, AND
   - no OTHER candidate has similarity ≥ 0.75 (i.e. the top match is clearly alone — no close rival that could confuse it).

2. **NEEDS REVIEW** (write nothing in the number field; list the top candidates) — if ANY of these:
   - The best similarity is between **0.75 and 0.90**, OR
   - Two or more candidates are ≥ 0.75 (ambiguous — genuine rivals), OR
   - The best match is ≥ 0.90 but its status is NOT active (e.g. dissolved/liquidation) — surface it for a human, do not auto-take a non-active company.

3. **NO MATCH** (leave blank, flag `no-match`) — if the best similarity is **below 0.75**.

Tune nothing looser than this. Strict is deliberate.

---

## Output

**`warm_all_results.csv`** — every input row, preserving all original columns, plus:
- `ch_status` — one of `auto-high`, `needs-review`, `no-match`
- `matched_company_number` — filled ONLY for `auto-high`; blank otherwise
- `matched_company_name` — the confirmed candidate's registered name (auto-high only)
- `match_similarity` — the top similarity score (rounded to 2dp)
- `candidate_1_name`, `candidate_1_number`, `candidate_1_status`, `candidate_1_address`
- `candidate_2_...`, `candidate_3_...` (up to 3 candidates listed for review rows; fewer if fewer returned)
- `human_decision_number` — an EMPTY column for the user to fill in during review
- `human_decision_notes` — an EMPTY column for the user

**`warm_matched.csv`** — only the `auto-high` rows (the ones safely keyed).
**`warm_needs_review.csv`** — only the `needs-review` rows, with candidates, for the human to work through.
**`warm_no_match.csv`** — only the `no-match` rows.

At the end, print a summary: total rows, how many auto-confirmed, how many need review, how many no-match — and state the auto-confirmed rate plainly without dressing it up.

---

## Verification before you report done

- Confirm the script ran against `CH_API_KEY` from the environment (print which host it called, not the key itself).
- Confirm the row counts across the three split files add up to the input row count (348).
- Confirm `matched_company_number` is populated on `auto-high` rows and BLANK on every `needs-review` and `no-match` row. If any review or no-match row has a number in that column, that is a bug — fix it.
- Do NOT fill `human_decision_number` for any row. It stays empty. It is the user's column.
- Report the honest completion rate. Do not inflate it. Do not offer to resolve the review rows.

---

## Final report

List: every file written, the four counts, the auto-confirmed rate, and any input rows that errored during lookup (recorded as `no-match` with an error note, never guessed). Then stop. The review rows are for the user.
