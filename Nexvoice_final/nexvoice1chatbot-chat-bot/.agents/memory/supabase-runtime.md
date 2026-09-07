---
name: Supabase runtime compatibility
description: Runtime compatibility note for the Supabase dependencies used by NexVoice.
---

The current NexVoice runtime is Node.js 20, while the installed Supabase packages declare Node.js 22 or later as their supported engine.

**Why:** The backend starts and builds successfully on Node.js 20 today, but Supabase emits a deprecation/unsupported-engine warning and future package updates may stop supporting this runtime.

**How to apply:** Treat a Node.js 22 runtime upgrade as the preferred follow-up before upgrading Supabase dependencies or relying on new Supabase features.