/*
# Device Monitoring & Control Tables (single-tenant, no auth)

1. New Tables
- `device_activity` — log of all device inputs/outputs (calls, messages, apps, notifications, data events)
  - id (uuid PK)
  - type (text: call, message, app_install, app_uninstall, notification, data_sync, file_transfer, system_update, battery, network)
  - direction (text: incoming, outgoing)
  - source (text: phone number, app name, system service)
  - description (text: human-readable description)
  - status (text: success, failed, blocked, pending)
  - duration (int: seconds, nullable — for calls)
  - data_size (bigint: bytes, nullable — for data transfers)
  - created_at (timestamptz)
- `device_settings` — key-value store for device control settings
  - id (uuid PK)
  - key (text, unique)
  - value (text)
  - updated_at (timestamptz)
- `network_usage` — daily network usage records
  - id (uuid PK)
  - date (date, unique)
  - wifi_sent (bigint: bytes)
  - wifi_received (bigint: bytes)
  - mobile_sent (bigint: bytes)
  - mobile_received (bigint: bytes)
  - created_at (timestamptz)
- `security_events` — security-related events
  - id (uuid PK)
  - type (text: lock, unlock, failed_attempt, app_permission, suspicious_activity, scan)
  - severity (text: info, warning, critical)
  - description (text)
  - resolved (boolean, default false)
  - created_at (timestamptz)

2. Security
- Enable RLS on all tables.
- Allow anon + authenticated CRUD on all tables (single-tenant, no sign-in).
*/

CREATE TABLE IF NOT EXISTS device_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  direction text NOT NULL DEFAULT 'incoming',
  source text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'success',
  duration int,
  data_size bigint,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE device_activity ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_device_activity" ON device_activity;
CREATE POLICY "anon_select_device_activity" ON device_activity FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_device_activity" ON device_activity;
CREATE POLICY "anon_insert_device_activity" ON device_activity FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_device_activity" ON device_activity;
CREATE POLICY "anon_update_device_activity" ON device_activity FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_device_activity" ON device_activity;
CREATE POLICY "anon_delete_device_activity" ON device_activity FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS device_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE device_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_device_settings" ON device_settings;
CREATE POLICY "anon_select_device_settings" ON device_settings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_device_settings" ON device_settings;
CREATE POLICY "anon_insert_device_settings" ON device_settings FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_device_settings" ON device_settings;
CREATE POLICY "anon_update_device_settings" ON device_settings FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_device_settings" ON device_settings;
CREATE POLICY "anon_delete_device_settings" ON device_settings FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS network_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date UNIQUE NOT NULL DEFAULT CURRENT_DATE,
  wifi_sent bigint NOT NULL DEFAULT 0,
  wifi_received bigint NOT NULL DEFAULT 0,
  mobile_sent bigint NOT NULL DEFAULT 0,
  mobile_received bigint NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE network_usage ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_network_usage" ON network_usage;
CREATE POLICY "anon_select_network_usage" ON network_usage FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_network_usage" ON network_usage;
CREATE POLICY "anon_insert_network_usage" ON network_usage FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_network_usage" ON network_usage;
CREATE POLICY "anon_update_network_usage" ON network_usage FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_network_usage" ON network_usage;
CREATE POLICY "anon_delete_network_usage" ON network_usage FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS security_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  severity text NOT NULL DEFAULT 'info',
  description text,
  resolved boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_security_events" ON security_events;
CREATE POLICY "anon_select_security_events" ON security_events FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_security_events" ON security_events;
CREATE POLICY "anon_insert_security_events" ON security_events FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_security_events" ON security_events;
CREATE POLICY "anon_update_security_events" ON security_events FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_security_events" ON security_events;
CREATE POLICY "anon_delete_security_events" ON security_events FOR DELETE
  TO anon, authenticated USING (true);

-- Seed initial data
INSERT INTO device_activity (type, direction, source, description, status, duration, data_size)
VALUES
  ('call', 'incoming', '09123456789', 'تماس ورودی از علی رضایی', 'success', 185, NULL),
  ('call', 'outgoing', '09356789012', 'تماس خروجی به مریم حسینی', 'success', 240, NULL),
  ('call', 'incoming', '02188776655', 'تماس ورودی از ناشناس', 'blocked', 0, NULL),
  ('message', 'incoming', '09123456789', 'پیامک از علی رضایی: سلام، وقت بشه دیدار کنیم', 'success', NULL, NULL),
  ('message', 'outgoing', '09356789012', 'پیامک به مریم حسینی: باشه، ساعت ۵ بعدازظهر', 'success', NULL, NULL),
  ('app_install', 'incoming', 'Instagram', 'نصب برنامه اینستاگرام', 'success', NULL, 45000000),
  ('app_install', 'incoming', 'Telegram', 'نصب برنامه تلگرام', 'success', NULL, 38000000),
  ('app_uninstall', 'outgoing', 'TikTok', 'حذف برنامه تیک‌تاک', 'success', NULL, NULL),
  ('notification', 'incoming', 'WhatsApp', 'اعلان جدید از واتس‌اپ', 'success', NULL, NULL),
  ('data_sync', 'outgoing', 'Google Drive', 'همگام‌سازی فایل‌ها با گوگل درایو', 'success', NULL, 12000000),
  ('file_transfer', 'outgoing', 'Bluetooth', 'ارسال فایل از طریق بلوتوث', 'success', NULL, 5600000),
  ('system_update', 'incoming', 'System', 'به‌روزرسانی سیستم عامل', 'success', NULL, 850000000),
  ('network', 'incoming', 'WiFi', 'اتصال به شبکه وای‌فای: HomeNet', 'success', NULL, NULL),
  ('call', 'outgoing', '09191112233', 'تماس خروجی به شماره اضطراری', 'failed', 0, NULL),
  ('message', 'incoming', '5000', 'پیامک از بانک: تراکنش موفق', 'success', NULL, NULL)
ON CONFLICT DO NOTHING;

INSERT INTO network_usage (date, wifi_sent, wifi_received, mobile_sent, mobile_received)
VALUES
  (CURRENT_DATE, 45000000, 580000000, 12000000, 95000000),
  (CURRENT_DATE - 1, 38000000, 420000000, 15000000, 110000000),
  (CURRENT_DATE - 2, 52000000, 610000000, 8000000, 75000000),
  (CURRENT_DATE - 3, 41000000, 490000000, 18000000, 130000000),
  (CURRENT_DATE - 4, 35000000, 380000000, 22000000, 160000000),
  (CURRENT_DATE - 5, 48000000, 520000000, 10000000, 85000000),
  (CURRENT_DATE - 6, 39000000, 450000000, 14000000, 98000000)
ON CONFLICT DO NOTHING;

INSERT INTO security_events (type, severity, description, resolved)
VALUES
  ('lock', 'info', 'دستگاه قفل شد', true),
  ('unlock', 'info', 'دستگاه با اثر انگشت باز شد', true),
  ('failed_attempt', 'warning', '۳ تلاش ناموفق برای باز کردن قفل دستگاه', true),
  ('app_permission', 'warning', 'برنامه Instagram دسترسی به موقعیت مکانی را درخواست کرد', false),
  ('suspicious_activity', 'critical', 'تلاش برای دسترسی از یک برنامه ناشناخته شناسایی شد', false),
  ('scan', 'info', 'اسکن امنیتی کامل انجام شد - ۲ هشدار یافت شد', true),
  ('app_permission', 'warning', 'برنامه Telegram دسترسی به مخاطبین را درخواست کرد', false)
ON CONFLICT DO NOTHING;

INSERT INTO device_settings (key, value)
VALUES
  ('remote_lock', 'false'),
  ('remote_wipe', 'false'),
  ('find_device', 'true'),
  ('app_monitoring', 'true'),
  ('call_blocking', 'true'),
  ('auto_backup', 'true'),
  ('data_limit', '2000000000'),
  ('battery_saver', 'false'),
  ('airplane_mode', 'false'),
  ('do_not_disturb', 'false')
ON CONFLICT DO NOTHING;
