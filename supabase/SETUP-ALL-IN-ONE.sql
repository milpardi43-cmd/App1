-- ==============================================
-- راه‌اندازی پایگاه‌داده «کنترل گوشی» — یک‌بار اجرا
-- این فایل را کامل کپی کنید و در Supabase > SQL Editor اجرا کنید
-- ==============================================

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
/*
# Expand Device Monitoring Schema — Apps, Commands, Device Info, Contacts

1. New Tables
- `installed_apps` — list of installed apps on the monitored device
  - id (uuid PK)
  - name (text, not null)
  - package_name (text, unique)
  - icon_color (text, hex color for app icon)
  - category (text: social, communication, productivity, entertainment, system, finance, game, other)
  - size_bytes (bigint)
  - data_usage_bytes (bigint, how much data the app has used)
  - screen_time_minutes (int, daily screen time)
  - is_blocked (boolean, default false)
  - is_system (boolean, default false)
  - installed_at (timestamptz)
  - last_used (timestamptz)
  - created_at (timestamptz)

- `remote_commands` — commands sent from admin panel to the device
  - id (uuid PK)
  - command_type (text: lock, wipe, reboot, screenshot, location, ring, message, block_app, unblock_app, clear_cache, backup, scan, airplane_mode, brightness, volume, install_app, uninstall_app)
  - status (text: pending, executing, completed, failed)
  - parameters (jsonb, command-specific parameters)
  - result (text, response from device)
  - created_at (timestamptz)
  - executed_at (timestamptz)

- `device_info` — device hardware/software info
  - id (uuid PK)
  - key (text, unique)
  - value (text)
  - updated_at (timestamptz)

- `contacts` — phone contacts
  - id (uuid PK)
  - name (text)
  - phone_number (text)
  - email (text, nullable)
  - is_blocked (boolean, default false)
  - last_contact (timestamptz, nullable)
  - created_at (timestamptz)

2. Security
- Enable RLS on all new tables.
- Allow anon + authenticated CRUD (single-tenant, no sign-in).
*/

CREATE TABLE IF NOT EXISTS installed_apps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  package_name text UNIQUE NOT NULL,
  icon_color text NOT NULL DEFAULT '#6366f1',
  category text NOT NULL DEFAULT 'other',
  size_bytes bigint NOT NULL DEFAULT 0,
  data_usage_bytes bigint NOT NULL DEFAULT 0,
  screen_time_minutes int NOT NULL DEFAULT 0,
  is_blocked boolean NOT NULL DEFAULT false,
  is_system boolean NOT NULL DEFAULT false,
  installed_at timestamptz DEFAULT now(),
  last_used timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE installed_apps ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_installed_apps" ON installed_apps;
CREATE POLICY "anon_select_installed_apps" ON installed_apps FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_installed_apps" ON installed_apps;
CREATE POLICY "anon_insert_installed_apps" ON installed_apps FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_installed_apps" ON installed_apps;
CREATE POLICY "anon_update_installed_apps" ON installed_apps FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_installed_apps" ON installed_apps;
CREATE POLICY "anon_delete_installed_apps" ON installed_apps FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS remote_commands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  command_type text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  parameters jsonb DEFAULT '{}',
  result text,
  created_at timestamptz DEFAULT now(),
  executed_at timestamptz
);

ALTER TABLE remote_commands ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_remote_commands" ON remote_commands;
CREATE POLICY "anon_select_remote_commands" ON remote_commands FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_remote_commands" ON remote_commands;
CREATE POLICY "anon_insert_remote_commands" ON remote_commands FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_remote_commands" ON remote_commands;
CREATE POLICY "anon_update_remote_commands" ON remote_commands FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_remote_commands" ON remote_commands;
CREATE POLICY "anon_delete_remote_commands" ON remote_commands FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS device_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE device_info ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_device_info" ON device_info;
CREATE POLICY "anon_select_device_info" ON device_info FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_device_info" ON device_info;
CREATE POLICY "anon_insert_device_info" ON device_info FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_device_info" ON device_info;
CREATE POLICY "anon_update_device_info" ON device_info FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_device_info" ON device_info;
CREATE POLICY "anon_delete_device_info" ON device_info FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone_number text NOT NULL,
  email text,
  is_blocked boolean NOT NULL DEFAULT false,
  last_contact timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_contacts" ON contacts;
CREATE POLICY "anon_select_contacts" ON contacts FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_contacts" ON contacts;
CREATE POLICY "anon_insert_contacts" ON contacts FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_contacts" ON contacts;
CREATE POLICY "anon_update_contacts" ON contacts FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_contacts" ON contacts;
CREATE POLICY "anon_delete_contacts" ON contacts FOR DELETE
  TO anon, authenticated USING (true);

-- Seed installed apps
INSERT INTO installed_apps (name, package_name, icon_color, category, size_bytes, data_usage_bytes, screen_time_minutes, is_blocked, is_system, installed_at, last_used)
VALUES
  ('اینستاگرام', 'com.instagram.android', '#E1306C', 'social', 58000000, 1240000000, 145, false, false, '2025-08-15T10:00:00Z', '2026-09-13T08:30:00Z'),
  ('تلگرام', 'org.telegram.messenger', '#2AABEE', 'communication', 38000000, 420000000, 92, false, false, '2025-07-20T14:00:00Z', '2026-09-13T09:15:00Z'),
  ('واتس‌اپ', 'com.whatsapp', '#25D366', 'communication', 65000000, 680000000, 187, false, false, '2025-06-10T09:00:00Z', '2026-09-13T07:45:00Z'),
  ('یوتیوب', 'com.google.android.youtube', '#FF0000', 'entertainment', 95000000, 2100000000, 234, false, false, '2025-05-01T12:00:00Z', '2026-09-13T06:20:00Z'),
  ('گوگل کروم', 'com.android.chrome', '#4285F4', 'productivity', 120000000, 340000000, 78, false, false, '2025-01-15T08:00:00Z', '2026-09-13T09:00:00Z'),
  ('اسپاتیفای', 'com.spotify.music', '#1DB954', 'entertainment', 45000000, 890000000, 156, false, false, '2025-09-01T16:00:00Z', '2026-09-12T22:30:00Z'),
  ('تیک‌تاک', 'com.zhiliaoapp.musically', '#000000', 'social', 88000000, 1800000000, 198, true, false, '2025-09-10T18:00:00Z', '2026-09-12T23:45:00Z'),
  ('تلگرام طلایی', 'com.thunderdog.challegram', '#FFD700', 'communication', 42000000, 150000000, 34, false, false, '2026-01-05T11:00:00Z', '2026-09-11T15:00:00Z'),
  ('بانک ملت', 'ir.bankmellat.app', '#00A651', 'finance', 32000000, 45000000, 12, false, false, '2025-03-20T10:00:00Z', '2026-09-13T06:00:00Z'),
  ('بانک سامان', 'com.samanbank.app', '#0099CC', 'finance', 28000000, 32000000, 8, false, false, '2025-04-15T09:00:00Z', '2026-09-12T14:00:00Z'),
  ('تقویم', 'com.android.calendar', '#FF6B35', 'productivity', 15000000, 5000000, 15, false, true, '2025-01-01T00:00:00Z', '2026-09-13T07:00:00Z'),
  ('تنظیمات', 'com.android.settings', '#6B7280', 'system', 8000000, 0, 5, false, true, '2025-01-01T00:00:00Z', '2026-09-12T16:00:00Z'),
  ('فایل‌منیجر', 'com.android.documentsui', '#2196F3', 'system', 12000000, 0, 10, false, true, '2025-01-01T00:00:00Z', '2026-09-13T05:30:00Z'),
  ('پلی‌استور', 'com.android.vending', '#00B265', 'system', 25000000, 120000000, 20, false, true, '2025-01-01T00:00:00Z', '2026-09-13T04:00:00Z'),
  ('اسنپ', 'ir.alo.snapp', '#00D170', 'productivity', 35000000, 89000000, 18, false, false, '2026-02-10T13:00:00Z', '2026-09-12T19:00:00Z'),
  ('بازار', 'com.farsitel.bazaar', '#7C4DFF', 'productivity', 48000000, 230000000, 25, false, false, '2025-02-01T10:00:00Z', '2026-09-13T03:00:00Z')
ON CONFLICT DO NOTHING;

-- Seed remote commands
INSERT INTO remote_commands (command_type, status, parameters, result, executed_at)
VALUES
  ('lock', 'completed', '{"duration": 0}', 'دستگاه با موفقیت قفل شد', '2026-09-13T08:00:00Z'),
  ('location', 'completed', '{"accuracy": "high"}', 'lat: 35.6892, lng: 51.3890, accuracy: 5m', '2026-09-13T08:05:00Z'),
  ('screenshot', 'completed', '{}', 'اسکرین‌شات با موفقیت گرفته شد', '2026-09-13T08:10:00Z'),
  ('scan', 'completed', '{}', 'اسکن کامل انجام شد، ۲ هشدار یافت شد', '2026-09-12T20:00:00Z'),
  ('block_app', 'completed', '{"package": "com.zhiliaoapp.musically"}', 'برنامه تیک‌تاک مسدود شد', '2026-09-12T18:00:00Z'),
  ('backup', 'completed', '{"target": "cloud"}', 'پشتیبان‌گیری کامل انجام شد (۲.۴ گیگابایت)', '2026-09-12T15:00:00Z'),
  ('ring', 'completed', '{"duration": 30}', 'دستگاه به مدت ۳۰ ثانیه به صدا درآمد', '2026-09-12T10:00:00Z'),
  ('clear_cache', 'completed', '{}', 'حافظه پنهان پاک شد (۸۵۰ مگابایت آزاد شد)', '2026-09-11T22:00:00Z'),
  ('message', 'completed', '{"text": "دستگاه گم شده، لطفاً بازگردانید"}', 'پیام روی صفحه نمایش داده شد', '2026-09-11T16:00:00Z'),
  ('brightness', 'pending', '{"level": 50}', NULL, NULL),
  ('reboot', 'pending', '{}', NULL, NULL)
ON CONFLICT DO NOTHING;

-- Seed device info
INSERT INTO device_info (key, value)
VALUES
  ('device_model', 'Samsung Galaxy S24 Ultra'),
  ('os_version', 'Android 14 (OneUI 6.1)'),
  ('serial_number', 'R58W123456Z'),
  ('imei', '35XXXXXXXXXXXXX'),
  ('storage_total', '268435456000'),
  ('storage_used', '187904819200'),
  ('ram_total', '12884901888'),
  ('ram_used', '7730941132'),
  ('battery_level', '85'),
  ('battery_health', 'good'),
  ('screen_resolution', '1440x3088'),
  ('screen_brightness', '65'),
  ('volume_level', '70'),
  ('wifi_connected', 'true'),
  ('wifi_name', 'HomeNet-5G'),
  ('bluetooth_enabled', 'true'),
  ('location_enabled', 'true'),
  ('airplane_mode', 'false'),
  ('do_not_disturb', 'false'),
  ('battery_saver', 'false'),
  ('cpu_usage', '32'),
  ('cpu_temp', '38'),
  ('gpu_usage', '15'),
  ('uptime', '172800'),
  ('last_boot', '2026-09-11T08:00:00Z'),
  ('phone_number', '09123456789'),
  ('carrier', 'Irancell'),
  ('signal_strength', '4'),
  ('vpn_connected', 'false'),
  ('hotspot_enabled', 'false')
ON CONFLICT DO NOTHING;

-- Seed contacts
INSERT INTO contacts (name, phone_number, email, is_blocked, last_contact)
VALUES
  ('علی رضایی', '09123456789', 'ali.rezaei@email.com', false, '2026-09-13T08:30:00Z'),
  ('مریم حسینی', '09356789012', 'maryam.h@email.com', false, '2026-09-13T07:45:00Z'),
  ('حسن کریمی', '09191112233', 'hassan.k@email.com', false, '2026-09-12T19:00:00Z'),
  ('زهرا احمدی', '09384455667', 'zahra.a@email.com', false, '2026-09-12T14:00:00Z'),
  ('محمد قاسمی', '09125558899', 'm.ghasemi@email.com', false, '2026-09-11T11:00:00Z'),
  ('فاطمه نوری', '09397778899', 'f.nouri@email.com', false, '2026-09-10T16:00:00Z'),
  ('شماره ناشناس', '02188776655', NULL, true, '2026-09-12T22:00:00Z'),
  ('اسپام', '09120000000', NULL, true, '2026-09-11T03:00:00Z'),
  ('رضا مرادی', '09128889900', 'reza.m@email.com', false, '2026-09-09T10:00:00Z'),
  ('سارا کاظمی', '09381112233', 'sara.k@email.com', false, '2026-09-08T13:00:00Z'),
  ('پشتیبانی ایرانسل', '09370000000', NULL, false, '2026-09-07T09:00:00Z'),
  ('بانک ملت', '02126110000', NULL, false, '2026-09-06T15:00:00Z')
ON CONFLICT DO NOTHING;

-- Add more activity logs
INSERT INTO device_activity (type, direction, source, description, status, duration, data_size)
VALUES
  ('app_install', 'incoming', 'Snapp', 'نصب برنامه اسنپ', 'success', NULL, 35000000),
  ('app_install', 'incoming', 'Bazaar', 'نصب برنامه بازار', 'success', NULL, 48000000),
  ('call', 'incoming', 'حسن کریمی', 'تماس ورودی از حسن کریمی', 'success', 320, NULL),
  ('call', 'outgoing', 'زهرا احمدی', 'تماس خروجی به زهرا احمدی', 'success', 145, NULL),
  ('message', 'incoming', '09123456789', 'پیامک از علی: کجا هستی؟', 'success', NULL, NULL),
  ('message', 'outgoing', '09356789012', 'پیامک به مریم: میرم بیرون', 'success', NULL, NULL),
  ('notification', 'incoming', 'Instagram', 'اعلان: لایک جدید روی پست شما', 'success', NULL, NULL),
  ('notification', 'incoming', 'WhatsApp', 'اعلان: پیام جدید از گروه دوستان', 'success', NULL, NULL),
  ('data_sync', 'outgoing', 'Google Photos', 'همگام‌سازی عکس‌ها', 'success', NULL, 45000000),
  ('file_transfer', 'incoming', 'Bluetooth', 'دریافت فایل از دستگاه مجاور', 'success', NULL, 12000000),
  ('call', 'incoming', '02188776655', 'تماس ورودی از شماره مسدود شده', 'blocked', 0, NULL),
  ('app_uninstall', 'outgoing', 'TikTok', 'حذف برنامه تیک‌تاک', 'success', NULL, NULL),
  ('system_update', 'incoming', 'Samsung', 'به‌روزرسانی امنیتی سیستم', 'success', NULL, 320000000),
  ('network', 'incoming', 'WiFi', 'اتصال به شبکه وای‌فای: OfficeNet', 'success', NULL, NULL),
  ('message', 'incoming', '5000', 'پیامک بانکی: خرید ۲۵۰,۰۰۰ تومان', 'success', NULL, NULL)
ON CONFLICT DO NOTHING;

-- Add more security events
INSERT INTO security_events (type, severity, description, resolved)
VALUES
  ('app_permission', 'warning', 'برنامه Instagram به موقعیت مکانی دسترسی دارد', false),
  ('app_permission', 'warning', 'برنامه Telegram به دوربین دسترسی دارد', false),
  ('suspicious_activity', 'critical', 'تلاش برای نصب برنامه ناشناخته از منبع خارجی', false),
  ('failed_attempt', 'warning', '۵ تلاش ناموفق برای باز کردن قفل', true),
  ('scan', 'info', 'اسکن امنیتی روزانه انجام شد', true),
  ('app_permission', 'critical', 'برنامه ناشناخته به مخاطبین دسترسی پیدا کرد', false),
  ('suspicious_activity', 'warning', 'اتصال به شبکه وای‌فای عمومی شناسایی شد', false)
ON CONFLICT DO NOTHING;
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
