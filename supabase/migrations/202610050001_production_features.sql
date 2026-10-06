-- Production features for Companion English (idempotent).

CREATE TABLE IF NOT EXISTS learning_progress (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  progress jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE learning_progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS learning_progress_read_self ON learning_progress;
CREATE POLICY learning_progress_read_self ON learning_progress FOR SELECT TO authenticated
USING (user_id = auth.uid());
DROP POLICY IF EXISTS learning_progress_insert_self ON learning_progress;
CREATE POLICY learning_progress_insert_self ON learning_progress FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS learning_progress_update_self ON learning_progress;
CREATE POLICY learning_progress_update_self ON learning_progress FOR UPDATE TO authenticated
USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
GRANT SELECT, INSERT, UPDATE ON learning_progress TO authenticated;

CREATE TABLE IF NOT EXISTS daily_ai_usage (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  usage_date date NOT NULL DEFAULT current_date,
  category text NOT NULL CHECK (category IN ('emma', 'human_assist', 'speech')),
  request_count integer NOT NULL DEFAULT 0 CHECK (request_count >= 0),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, usage_date, category)
);

ALTER TABLE daily_ai_usage ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS daily_ai_usage_read_self ON daily_ai_usage;
CREATE POLICY daily_ai_usage_read_self ON daily_ai_usage FOR SELECT TO authenticated
USING (user_id = auth.uid());
GRANT SELECT ON daily_ai_usage TO authenticated;

CREATE OR REPLACE FUNCTION consume_daily_ai_usage(p_category text, p_limit integer)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  new_count integer;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;
  IF p_category NOT IN ('emma', 'human_assist', 'speech') THEN RAISE EXCEPTION 'Invalid category'; END IF;
  IF p_limit < 1 OR p_limit > 1000 THEN RAISE EXCEPTION 'Invalid limit'; END IF;

  INSERT INTO daily_ai_usage (user_id, usage_date, category, request_count, updated_at)
  VALUES (auth.uid(), current_date, p_category, 1, now())
  ON CONFLICT (user_id, usage_date, category)
  DO UPDATE SET request_count = daily_ai_usage.request_count + 1, updated_at = now()
  WHERE daily_ai_usage.request_count < p_limit
  RETURNING request_count INTO new_count;

  RETURN new_count IS NOT NULL AND new_count <= p_limit;
END;
$$;

REVOKE ALL ON FUNCTION consume_daily_ai_usage(text, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION consume_daily_ai_usage(text, integer) TO authenticated;

-- Private one-to-one WebRTC voice-call signaling. SDP is visible only to the
-- two conversation participants and contains no recorded call audio.
CREATE TABLE IF NOT EXISTS voice_calls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  caller_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'ringing' CHECK (status IN ('ringing', 'accepted', 'declined', 'ended', 'failed')),
  offer jsonb NOT NULL,
  answer jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  answered_at timestamptz,
  ended_at timestamptz
);
CREATE INDEX IF NOT EXISTS idx_voice_calls_conversation_status
ON voice_calls(conversation_id, status, created_at DESC);

ALTER TABLE voice_calls ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS voice_calls_read_participants ON voice_calls;
CREATE POLICY voice_calls_read_participants ON voice_calls FOR SELECT TO authenticated
USING (is_conversation_member(conversation_id));
DROP POLICY IF EXISTS voice_calls_start_participants ON voice_calls;
CREATE POLICY voice_calls_start_participants ON voice_calls FOR INSERT TO authenticated
WITH CHECK (caller_id = auth.uid() AND is_conversation_member(conversation_id));
DROP POLICY IF EXISTS voice_calls_update_participants ON voice_calls;
CREATE POLICY voice_calls_update_participants ON voice_calls FOR UPDATE TO authenticated
USING (is_conversation_member(conversation_id))
WITH CHECK (is_conversation_member(conversation_id));
GRANT SELECT, INSERT, UPDATE ON voice_calls TO authenticated;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'voice_calls'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE voice_calls;
  END IF;
END $$;
-- Private voice-note storage. The first path segment is the conversation id;
-- participant-only policies reuse the same membership check as text messages.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'chat-voice',
  'chat-voice',
  false,
  12582912,
  ARRAY['audio/mp4', 'audio/m4a', 'audio/webm', 'audio/aac', 'audio/ogg']
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS chat_voice_read_participants ON storage.objects;
CREATE POLICY chat_voice_read_participants ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'chat-voice'
  AND is_conversation_member(((storage.foldername(name))[1])::uuid)
);

DROP POLICY IF EXISTS chat_voice_insert_participants ON storage.objects;
CREATE POLICY chat_voice_insert_participants ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'chat-voice'
  AND is_conversation_member(((storage.foldername(name))[1])::uuid)
  AND (storage.foldername(name))[2] = auth.uid()::text
);

DROP POLICY IF EXISTS chat_voice_delete_owner ON storage.objects;
CREATE POLICY chat_voice_delete_owner ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'chat-voice'
  AND (storage.foldername(name))[2] = auth.uid()::text
);
