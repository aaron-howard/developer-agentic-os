# 31: Cross-Repository Operations Verification

**What to build:** Prove the complete operations workflow across multiple Repository Contexts: refresh health, inspect GitHub and Vercel, see staged integrations, triage a failure, and create a linked Work Item.

**Blocked by:** 28: GitHub Operations MVP; 29: Vercel Operations MVP; 30: Integration Failure Triage

**Status:** ready-for-agent

- [x] Browser coverage verifies dashboard-load and manual refresh behavior.
- [x] Browser coverage verifies GitHub and Vercel success, missing credential, and unhealthy states.
- [x] Staged integrations show health or setup state without unsupported action controls.
- [x] A provider failure can be triaged into an Incoming Signal and linked Work Item from the browser.
- [x] Two Repository Contexts remain isolated throughout refresh, inspection, signal creation, and Work Item creation.
- [x] Existing Skills, Routines, Artifacts, Inbox, Work Items, and Second Brain behavior remains green.

**Status:** completed
