-- ============================================================
-- Live screen sharing (MediaProjection consent on phone 2).
--
-- supabase/SETUP-ALL-IN-ONE.sql already contained this table, but no migration
-- did — so the documented one-command setup (supabase db push) never created
-- screen_share_sessions and lib/liveScreen.native.tsx failed with
-- 'relation "public.screen_share_sessions" does not exist'.
--
-- Depends on the devices table (migration 20260915090623). Idempotent.
-- ============================================================

-- ==============================================
-- Live screen sharing (explicit MediaProjection consent on phone 2)
-- One short-lived WebRTC negotiation row per viewing session.
-- ==============================================
CREATE TABLE IF NOT EXISTS screen_share_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id uuid NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'offered' CHECK (status IN ('offered', 'connected', 'stopped', 'failed')),
  offer jsonb NOT NULL,
  answer jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE screen_share_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_screen_share_sessions" ON screen_share_sessions;
CREATE POLICY "anon_select_screen_share_sessions" ON screen_share_sessions FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_screen_share_sessions" ON screen_share_sessions;
CREATE POLICY "anon_insert_screen_share_sessions" ON screen_share_sessions FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_screen_share_sessions" ON screen_share_sessions;
CREATE POLICY "anon_update_screen_share_sessions" ON screen_share_sessions FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_screen_share_sessions" ON screen_share_sessions;
CREATE POLICY "anon_delete_screen_share_sessions" ON screen_share_sessions FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_screen_share_device_created
  ON screen_share_sessions(device_id, created_at DESC);
