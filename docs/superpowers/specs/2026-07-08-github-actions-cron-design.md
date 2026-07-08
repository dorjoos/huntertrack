# GitHub Actions Cron for YWH Tracker Polling

**Date:** 2026-07-08
**Status:** Implemented (revised twice, see Amendments)

## Problem

The app polls the YesWeHack API on a schedule. Vercel Hobby plan limits cron
jobs to once per day, which is too infrequent for activity monitoring. We want
polling every 30 minutes.

## Decision

Trigger the app's poll endpoint from a GitHub Actions scheduled workflow every
30 minutes. Vercel cron is dropped entirely; GitHub Actions is the sole
scheduler.

## Design

### `.github/workflows/cron.yml`

- **Triggers:**
  - `schedule: */30 * * * *` (every 30 minutes)
  - `workflow_dispatch` (manual runs from the Actions tab)
- **Job:** single step on `ubuntu-latest`:
  `curl -fsS -m 290 -X POST "https://huntert.vercel.app/api/poll"`
  - `-f` makes HTTP 4xx/5xx fail the step, so failed polls show as red runs
    and GitHub emails the repo owner.
  - `-m 290` bounds the request just under 5 minutes; the poller sleeps ~1s per
    hunter plus ~1s per hacktivity page, so runs are normally well under this.
- No GitHub secrets required.

### Removed: `vercel.json`, `/api/cron`, `CRON_SECRET`

- `vercel.json` only contained the daily Vercel cron config; deleted.
- Per user decision, the poll trigger is unauthenticated. The dedicated
  `/api/cron` route (bearer-token wrapper around `runPoll()`) became redundant
  with the already-open `POST /api/poll`, so it was deleted and the workflow
  calls `/api/poll` directly.
- `CRON_SECRET` removed from `.env`, `.env.example`, and GitHub secrets.
- Accepted risk: anyone who finds the URL can trigger polls (resource use on
  Vercel/Neon and extra YesWeHack API traffic). Data integrity is unaffected —
  `Activity` has a unique constraint on
  `(hunterId, date, bugTypeSlug, workflowState)` and duplicates are skipped.

## Known constraints

- GitHub scheduled workflows may lag 3–15 minutes at busy times; acceptable for
  30-minute monitoring.
- GitHub disables scheduled workflows after 60 days without repo activity
  (public repos); GitHub emails a warning and the workflow can be re-enabled
  with one click.
- Blocker at time of writing: Vercel has NO environment variables configured,
  so production returns 500 (no `DATABASE_URL`). `DATABASE_URL` must be set in
  Vercel project settings and the app redeployed before polls succeed.

## Testing

- Manually trigger the workflow via `workflow_dispatch` and confirm a green run
  and a new `PollLog` row.

## Amendments

1. Original design kept the daily Vercel cron as fallback and protected the
   trigger with `CRON_SECRET` (GitHub secrets `CRON_SECRET` + `APP_URL`).
2. 2026-07-08: user dropped Vercel cron entirely.
3. 2026-07-08: user dropped `CRON_SECRET`; workflow simplified to an
   unauthenticated `POST /api/poll` with the URL inlined.
