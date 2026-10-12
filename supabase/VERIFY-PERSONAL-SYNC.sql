-- Read-only post-migration checks for personal learning sync.
-- Run in Supabase SQL Editor after 202610120001_personal_language_sync.sql.
-- This queries schema and privileges only; it does not read learner progress rows.

-- 1) The legacy English progress field is retained and bilingual fields exist.
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'learning_progress'
  AND column_name IN ('user_id', 'progress', 'language_progress', 'pronunciation_progress')
ORDER BY column_name;

-- 2) RLS must be enabled. The forced flag is reported for visibility; the
-- migration enables RLS without changing that separate table setting.
SELECT n.nspname AS schema_name, c.relname AS table_name,
       c.relrowsecurity AS rls_enabled, c.relforcerowsecurity AS rls_forced
FROM pg_class AS c
JOIN pg_namespace AS n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' AND c.relname = 'learning_progress';

-- 3) Expect the single personal owner policy and an auth.uid()-based predicate.
SELECT policyname, cmd, roles, qual, with_check
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'learning_progress'
ORDER BY policyname;

-- 4) Expect anon to have no table privileges; authenticated needs SELECT,
-- INSERT and UPDATE only (there is intentionally no client DELETE privilege).
SELECT
  has_table_privilege('anon', 'public.learning_progress', 'SELECT') AS anon_select,
  has_table_privilege('anon', 'public.learning_progress', 'INSERT') AS anon_insert,
  has_table_privilege('authenticated', 'public.learning_progress', 'SELECT') AS authenticated_select,
  has_table_privilege('authenticated', 'public.learning_progress', 'INSERT') AS authenticated_insert,
  has_table_privilege('authenticated', 'public.learning_progress', 'UPDATE') AS authenticated_update,
  has_table_privilege('authenticated', 'public.learning_progress', 'DELETE') AS authenticated_delete;
