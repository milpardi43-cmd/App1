/*
# Multi-Device Support — Devices Table + Device ID Columns

1. New Tables
- `devices` — registered devices that can send data to the admin panel
  - id (uuid PK)
  - device_name (text, not null)
  - device_model (text)
  - os_version (text)
  - phone_number (text)
  - pairing_code (text, unique — 6-digit code used to pair)
  - is_paired (boolean, default false)
  - is_online (boolean, default true)
  - last_seen (timestamptz)
  - created_at (timestamptz)

2. Modified Tables
- `device_activity` — add `device_id` column (nullable for backward compat)
- `device_info` — add `device_id` column
- `installed_apps` — add `device_id` column
- `remote_commands` — add `device_id` column
- `security_events` — add `device_id` column
- `contacts` — add `device_id` column
- `network_usage` — add `device_id` column

3. Security
- Enable RLS on `devices`.
- Allow anon + authenticated CRUD (single-tenant, no sign-in).
- Existing policies remain unchanged; new columns are nullable so existing rows still work.
*/

CREATE TABLE IF NOT EXISTS devices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_name text NOT NULL,
  device_model text,
  os_version text,
  phone_number text,
  pairing_code text UNIQUE,
  is_paired boolean NOT NULL DEFAULT false,
  is_online boolean NOT NULL DEFAULT true,
  last_seen timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE devices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_devices" ON devices;
CREATE POLICY "anon_select_devices" ON devices FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_devices" ON devices;
CREATE POLICY "anon_insert_devices" ON devices FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_devices" ON devices;
CREATE POLICY "anon_update_devices" ON devices FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_devices" ON devices;
CREATE POLICY "anon_delete_devices" ON devices FOR DELETE
  TO anon, authenticated USING (true);

-- Add device_id columns (nullable for backward compatibility)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'device_activity' AND column_name = 'device_id') THEN
    ALTER TABLE device_activity ADD COLUMN device_id uuid REFERENCES devices(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'device_info' AND column_name = 'device_id') THEN
    ALTER TABLE device_info ADD COLUMN device_id uuid REFERENCES devices(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'installed_apps' AND column_name = 'device_id') THEN
    ALTER TABLE installed_apps ADD COLUMN device_id uuid REFERENCES devices(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'remote_commands' AND column_name = 'device_id') THEN
    ALTER TABLE remote_commands ADD COLUMN device_id uuid REFERENCES devices(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'security_events' AND column_name = 'device_id') THEN
    ALTER TABLE security_events ADD COLUMN device_id uuid REFERENCES devices(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contacts' AND column_name = 'device_id') THEN
    ALTER TABLE contacts ADD COLUMN device_id uuid REFERENCES devices(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'network_usage' AND column_name = 'device_id') THEN
    ALTER TABLE network_usage ADD COLUMN device_id uuid REFERENCES devices(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Seed a primary device
INSERT INTO devices (device_name, device_model, os_version, phone_number, is_paired, is_online)
VALUES ('گوشی اصلی من', 'Samsung Galaxy S24 Ultra', 'Android 14', '09123456789', true, true)
ON CONFLICT DO NOTHING;

-- Link existing data to the primary device
UPDATE device_activity SET device_id = (SELECT id FROM devices WHERE device_name = 'گوشی اصلی من' LIMIT 1) WHERE device_id IS NULL;
UPDATE device_info SET device_id = (SELECT id FROM devices WHERE device_name = 'گوشی اصلی من' LIMIT 1) WHERE device_id IS NULL;
UPDATE installed_apps SET device_id = (SELECT id FROM devices WHERE device_name = 'گوشی اصلی من' LIMIT 1) WHERE device_id IS NULL;
UPDATE remote_commands SET device_id = (SELECT id FROM devices WHERE device_name = 'گوشی اصلی من' LIMIT 1) WHERE device_id IS NULL;
UPDATE security_events SET device_id = (SELECT id FROM devices WHERE device_name = 'گوشی اصلی من' LIMIT 1) WHERE device_id IS NULL;
UPDATE contacts SET device_id = (SELECT id FROM devices WHERE device_name = 'گوشی اصلی من' LIMIT 1) WHERE device_id IS NULL;
UPDATE network_usage SET device_id = (SELECT id FROM devices WHERE device_name = 'گوشی اصلی من' LIMIT 1) WHERE device_id IS NULL;

-- Create indexes for device_id queries
CREATE INDEX IF NOT EXISTS idx_device_activity_device_id ON device_activity(device_id);
CREATE INDEX IF NOT EXISTS idx_device_info_device_id ON device_info(device_id);
CREATE INDEX IF NOT EXISTS idx_installed_apps_device_id ON installed_apps(device_id);
CREATE INDEX IF NOT EXISTS idx_remote_commands_device_id ON remote_commands(device_id);
CREATE INDEX IF NOT EXISTS idx_security_events_device_id ON security_events(device_id);
CREATE INDEX IF NOT EXISTS idx_contacts_device_id ON contacts(device_id);
CREATE INDEX IF NOT EXISTS idx_network_usage_device_id ON network_usage(device_id);
