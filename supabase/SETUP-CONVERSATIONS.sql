-- ============================================================
-- Companion English: private real-person conversations
-- Run once in Supabase SQL Editor after SETUP-ALL-IN-ONE.sql.
-- Requires Authentication > Providers > Anonymous Sign-Ins = ON.
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL DEFAULT 'زبان‌آموز',
  avatar_emoji text NOT NULL DEFAULT '🙂',
  english_level text NOT NULL DEFAULT 'Foundation',
  last_seen timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL DEFAULT 'direct' CHECK (kind IN ('direct', 'ai')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS conversation_members (
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (conversation_id, user_id)
);

CREATE TABLE IF NOT EXISTS learning_contacts (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contact_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, contact_id),
  CHECK (user_id <> contact_id)
);

CREATE TABLE IF NOT EXISTS contact_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL CHECK (code ~ '^[0-9]{6}$'),
  creator_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  claimed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'claimed', 'revoked', 'expired')),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '24 hours'),
  created_at timestamptz NOT NULL DEFAULT now(),
  claimed_at timestamptz
);

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message_type text NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'voice', 'system')),
  body text,
  media_path text,
  reply_to uuid REFERENCES messages(id) ON DELETE SET NULL,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (body IS NOT NULL OR media_path IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_members_user ON conversation_members(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_contacts_user ON learning_contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_invites_code_status ON contact_invites(code, status);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_created ON messages(conversation_id, created_at);

-- Security-definer membership check avoids recursive RLS evaluation on
-- conversation_members while still binding every lookup to auth.uid().
CREATE OR REPLACE FUNCTION is_conversation_member(p_conversation_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT EXISTS (
    SELECT 1 FROM conversation_members
    WHERE conversation_id = p_conversation_id AND user_id = auth.uid()
  );
$$;
REVOKE ALL ON FUNCTION is_conversation_member(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION is_conversation_member(uuid) TO authenticated;

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS profiles_read_learning_contacts ON profiles;
CREATE POLICY profiles_read_learning_contacts ON profiles FOR SELECT TO authenticated
USING (
  id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM learning_contacts c
    WHERE c.user_id = auth.uid() AND c.contact_id = profiles.id
  )
);
DROP POLICY IF EXISTS profiles_insert_self ON profiles;
CREATE POLICY profiles_insert_self ON profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
DROP POLICY IF EXISTS profiles_update_self ON profiles;
CREATE POLICY profiles_update_self ON profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS conversations_read_members ON conversations;
CREATE POLICY conversations_read_members ON conversations FOR SELECT TO authenticated
USING (is_conversation_member(id));

DROP POLICY IF EXISTS members_read_same_conversation ON conversation_members;
CREATE POLICY members_read_same_conversation ON conversation_members FOR SELECT TO authenticated
USING (is_conversation_member(conversation_id));

DROP POLICY IF EXISTS learning_contacts_read_self ON learning_contacts;
CREATE POLICY learning_contacts_read_self ON learning_contacts FOR SELECT TO authenticated USING (user_id = auth.uid());
DROP POLICY IF EXISTS learning_contacts_delete_self ON learning_contacts;
CREATE POLICY learning_contacts_delete_self ON learning_contacts FOR DELETE TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS invites_read_own ON contact_invites;
CREATE POLICY invites_read_own ON contact_invites FOR SELECT TO authenticated
USING (creator_id = auth.uid() OR claimed_by = auth.uid());

DROP POLICY IF EXISTS messages_read_members ON messages;
CREATE POLICY messages_read_members ON messages FOR SELECT TO authenticated
USING (is_conversation_member(conversation_id));
DROP POLICY IF EXISTS messages_insert_members ON messages;
CREATE POLICY messages_insert_members ON messages FOR INSERT TO authenticated
WITH CHECK (sender_id = auth.uid() AND is_conversation_member(conversation_id));
DROP POLICY IF EXISTS messages_update_sender ON messages;
CREATE POLICY messages_update_sender ON messages FOR UPDATE TO authenticated
USING (sender_id = auth.uid()) WITH CHECK (sender_id = auth.uid());

-- Creates a short-lived six-digit invite. The function owns the write so the
-- client can never create an invite on behalf of another user.
CREATE OR REPLACE FUNCTION create_contact_invite(p_display_name text DEFAULT 'زبان‌آموز')
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  generated_code text;
  attempt int := 0;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;

  INSERT INTO profiles (id, display_name, last_seen)
  VALUES (auth.uid(), COALESCE(NULLIF(trim(p_display_name), ''), 'زبان‌آموز'), now())
  ON CONFLICT (id) DO UPDATE SET display_name = EXCLUDED.display_name, last_seen = now();

  UPDATE contact_invites SET status = 'revoked'
  WHERE creator_id = auth.uid() AND status = 'pending';

  LOOP
    attempt := attempt + 1;
    generated_code := lpad((floor(random() * 900000) + 100000)::int::text, 6, '0');
    BEGIN
      INSERT INTO contact_invites (code, creator_id) VALUES (generated_code, auth.uid());
      RETURN generated_code;
    EXCEPTION WHEN unique_violation THEN
      IF attempt >= 10 THEN RAISE EXCEPTION 'Could not generate invite code'; END IF;
    END;
  END LOOP;
END;
$$;

-- Atomically claims an invite, creates the private direct conversation and
-- adds symmetric contact rows for both people.
CREATE OR REPLACE FUNCTION claim_contact_invite(
  p_code text,
  p_display_name text DEFAULT 'زبان‌آموز'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  invite_row contact_invites%ROWTYPE;
  new_conversation_id uuid;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;

  SELECT * INTO invite_row FROM contact_invites
  WHERE code = trim(p_code) AND status = 'pending' AND expires_at > now()
  FOR UPDATE;

  IF NOT FOUND THEN RAISE EXCEPTION 'Invite is invalid or expired'; END IF;
  IF invite_row.creator_id = auth.uid() THEN RAISE EXCEPTION 'You cannot claim your own invite'; END IF;

  SELECT conversation_id INTO new_conversation_id FROM learning_contacts
  WHERE user_id = auth.uid() AND contact_id = invite_row.creator_id;
  IF new_conversation_id IS NOT NULL THEN RETURN new_conversation_id; END IF;

  INSERT INTO profiles (id, display_name, last_seen)
  VALUES (auth.uid(), COALESCE(NULLIF(trim(p_display_name), ''), 'زبان‌آموز'), now())
  ON CONFLICT (id) DO UPDATE SET display_name = EXCLUDED.display_name, last_seen = now();

  INSERT INTO conversations DEFAULT VALUES RETURNING id INTO new_conversation_id;
  INSERT INTO conversation_members (conversation_id, user_id)
  VALUES (new_conversation_id, invite_row.creator_id), (new_conversation_id, auth.uid());
  INSERT INTO learning_contacts (user_id, contact_id, conversation_id)
  VALUES
    (invite_row.creator_id, auth.uid(), new_conversation_id),
    (auth.uid(), invite_row.creator_id, new_conversation_id);

  UPDATE contact_invites
  SET status = 'claimed', claimed_by = auth.uid(), claimed_at = now()
  WHERE id = invite_row.id;

  RETURN new_conversation_id;
END;
$$;

REVOKE ALL ON FUNCTION create_contact_invite(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION claim_contact_invite(text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION create_contact_invite(text) TO authenticated;
GRANT EXECUTE ON FUNCTION claim_contact_invite(text, text) TO authenticated;

GRANT SELECT, INSERT, UPDATE ON profiles TO authenticated;
GRANT SELECT ON conversations, conversation_members, learning_contacts, contact_invites TO authenticated;
GRANT SELECT, INSERT, UPDATE ON messages TO authenticated;

-- Enable real-time delivery for chat messages once, without failing on reruns.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE messages;
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
