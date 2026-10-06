#!/usr/bin/env bash
set -euo pipefail

# Supabase does not support global npm installation. Use an existing native
# binary when available; otherwise npx downloads/runs the supported local CLI.
if command -v supabase >/dev/null 2>&1; then
  SUPABASE=(supabase)
else
  SUPABASE=(npx --yes supabase)
fi

if ! "${SUPABASE[@]}" projects list >/dev/null 2>&1; then
  echo "Supabase login is required. A browser window will open once."
  "${SUPABASE[@]}" login
fi

if ! "${SUPABASE[@]}" status >/dev/null 2>&1 && [ ! -f supabase/.temp/project-ref ]; then
  echo "This folder is not linked to the online Supabase project yet."
  echo "Run: npx supabase link --project-ref YOUR_PROJECT_REF"
  echo "The project ref is the first part of your Supabase URL: https://PROJECT_REF.supabase.co"
  exit 1
fi

echo "Applying the idempotent production database migration..."
"${SUPABASE[@]}" db push

echo "Deploying authenticated Edge Functions..."
for fn in emma-chat speech-evaluate human-chat-assist turn-credentials; do
  "${SUPABASE[@]}" functions deploy "$fn"
done

echo "Production backend setup finished. TURN provider secrets can be added later with:"
echo "npx supabase secrets set METERED_DOMAIN=YOUR_DOMAIN METERED_SECRET_KEY=YOUR_SECRET"
