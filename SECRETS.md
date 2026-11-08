# Secrets and private data

This repository may be public. **Never commit** real guest names, addresses,
emails, invite codes, API keys, or service keys.

## Where secrets will live (Phase 2)

| Secret | Where it goes |
|---|---|
| Supabase service role key | Supabase Edge Function secrets only. Never in the browser or repo. |
| Resend API key | Supabase Edge Function secrets. |
| Supabase URL + anon (public) key | GitHub repository secrets, read at build time. The anon key is safe in the browser because row level security blocks direct reads of guest data. |
| Keep-alive ping | GitHub Actions scheduled workflow using the GitHub secrets above. |

Local development uses a `.env` file, which `.gitignore` already excludes.
Only `.env.example` (no real values) may be committed.

## Guest data

Only the two fictional seed households may live in this repository.
Real guest lists go straight into Supabase, never into a file here.
