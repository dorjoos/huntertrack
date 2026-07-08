# GitHub Actions Cron for YWH Tracker Polling

**Date:** 2026-07-08
**Status:** Approved

## Problem

The app polls the YesWeHack API via `GET /api/cron` (protected by `CRON_SECRET`).
Vercel Hobby plan limits cron jobs to once per day (`vercel.json` currently runs
at 08:00 UTC), which is too infrequent for activity monitoring. We want polling
every 30 minutes.

## Decision

Trigger the existing `/api/cron` endpoint from a GitHub Actions scheduled
workflow every 30 minutes. Keep the daily Vercel cron as a fallback.

## Design

### New file: `.github/workflows/cron.yml`

- **Triggers:**
  - `schedule: */30 * * * *` (every 30 minutes)
  - `workflow_dispatch` (manual runs from the Actions tab)
- **Job:** single step on `ubuntu-latest` that calls:
  `curl -fsS -m 290 -H "Authorization: Bearer $CRON_SECRET" "$APP_URL/api/cron"`
  - `-f` makes HTTP 4xx/5xx fail the step, so failed polls show as red runs
    and GitHub emails the repo owner.
  - `-m 290` bounds the request just under 5 minutes; the poller sleeps ~1s per
    hunter plus ~1s per hacktivity page, so runs are normally well under this.
- **Secrets** (repo Settings → Secrets and variables → Actions):
  - `CRON_SECRET` — same value as the Vercel env var.
  - `APP_URL` — `https://huntert.vercel.app` (kept as a secret so the workflow
    file stays deployment-agnostic).

### Unchanged: `vercel.json`

The daily 08:00 UTC Vercel cron stays as a fallback in case the GitHub workflow
is disabled. Duplicate polls are harmless: `Activity` has a unique constraint on
`(hunterId, date, bugTypeSlug, workflowState)` and duplicate inserts are skipped.

## Known constraints

- GitHub scheduled workflows may lag 3–15 minutes at busy times; acceptable for
  30-minute monitoring.
- GitHub disables scheduled workflows after 60 days without repo activity
  (public repos); GitHub emails a warning and the workflow can be re-enabled
  with one click. The Vercel daily cron covers the gap.
- Verified in production: `/api/cron` returns 401 without the bearer token, so
  auth is enforced and `CRON_SECRET` is configured on Vercel.
- Separate issue, out of scope: the production root page currently returns 500
  (likely the DB connection issue the uncommitted `src/lib/db.ts` change is
  addressing). The cron endpoint will also fail until the DB connection works.

## Testing

- Manually trigger the workflow via `workflow_dispatch` and confirm a green run
  and a new `PollLog` row.
- Confirm a run with a wrong secret fails red (auth guard works end to end).
