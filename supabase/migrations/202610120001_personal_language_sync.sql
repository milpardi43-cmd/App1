-- Persistent English/German course and pronunciation sync for the signed-in learner.
-- Apply after the learning_progress table exists (202610050001_production_features.sql).
-- No service-role access is needed; all client writes are protected by auth.uid().
BEGIN;

ALTER TABLE public.learning_progress
  ADD COLUMN IF NOT EXISTS language_progress jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS pronunciation_progress jsonb NOT NULL DEFAULT '{}'::jsonb;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.learning_progress'::regclass
      AND conname = 'learning_progress_language_progress_object'
  ) THEN
    ALTER TABLE public.learning_progress
      ADD CONSTRAINT learning_progress_language_progress_object
      CHECK (jsonb_typeof(language_progress) = 'object');
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.learning_progress'::regclass
      AND conname = 'learning_progress_pronunciation_progress_object'
  ) THEN
    ALTER TABLE public.learning_progress
      ADD CONSTRAINT learning_progress_pronunciation_progress_object
      CHECK (jsonb_typeof(pronunciation_progress) = 'object');
  END IF;
END
$$;

ALTER TABLE public.learning_progress ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.learning_progress FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public.learning_progress TO authenticated;

-- Remove every historical policy first. Postgres combines permissive policies
-- with OR, so even one broad legacy rule would weaken the owner-only guarantee.
DO $$
DECLARE policy_row record;
BEGIN
  FOR policy_row IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'learning_progress'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.learning_progress', policy_row.policyname);
  END LOOP;
END
$$;

CREATE POLICY personal_learning_progress_owner ON public.learning_progress
  FOR ALL TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

COMMIT;
