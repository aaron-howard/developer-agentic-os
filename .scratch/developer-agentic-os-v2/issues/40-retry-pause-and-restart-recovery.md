# 40: Retry, Pause, And Restart Recovery

**What to build:** Automation supports bounded retries, explicit pause and cancellation, global pause, interrupted-run handling, restart catch-up, and visible missed-run records.

**Blocked by:** 36: Local Scheduled Automation

**Status:** ready-for-agent

- [ ] Transient failures enter an explicit retrying state with bounded backoff and attempt history.
- [ ] Permanent failures and exhausted retries become visible Incoming Signals.
- [ ] A developer can pause, resume, or cancel eligible runs.
- [ ] Global pause prevents new automation actions without erasing history.
- [ ] Interrupted runs are recorded with an explicit outcome.
- [ ] Eligible missed schedules catch up within a bounded window after restart.
- [ ] Older or ineligible schedules remain visibly missed and do not run silently.
- [ ] Unit, route, and browser tests cover retry, pause, cancellation, restart, catch-up, and missed work.