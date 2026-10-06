export type ActivityType =
  | 'call'
  | 'message'
  | 'app_install'
  | 'app_uninstall'
  | 'notification'
  | 'data_sync'
  | 'file_transfer'
  | 'system_update'
  | 'network'
  | 'battery';

export type Direction = 'incoming' | 'outgoing';

export type ActivityStatus = 'success' | 'failed' | 'blocked' | 'pending';

export interface DeviceActivity {
  id: string;
  type: ActivityType;
  direction: Direction;
  source: string;
  description: string | null;
  status: ActivityStatus;
  duration: number | null;
  data_size: number | null;
  created_at: string;
  device_id: string | null;
}

export interface DeviceSetting {
  id: string;
  key: string;
  value: string | null;
  updated_at: string;
}

export interface NetworkUsage {
  id: string;
  date: string;
  wifi_sent: number;
  wifi_received: number;
  mobile_sent: number;
  mobile_received: number;
  created_at: string;
  device_id: string | null;
}

export type SecuritySeverity = 'info' | 'warning' | 'critical';

export type SecurityEventType =
  | 'lock'
  | 'unlock'
  | 'failed_attempt'
  | 'app_permission'
  | 'suspicious_activity'
  | 'scan';

export interface SecurityEvent {
  id: string;
  type: SecurityEventType;
  severity: SecuritySeverity;
  description: string | null;
  resolved: boolean;
  created_at: string;
  device_id: string | null;
}

export type AppCategory =
  | 'social'
  | 'communication'
  | 'productivity'
  | 'entertainment'
  | 'system'
  | 'finance'
  | 'game'
  | 'other';

export interface InstalledApp {
  id: string;
  name: string;
  package_name: string;
  icon_color: string;
  category: AppCategory;
  size_bytes: number;
  data_usage_bytes: number;
  screen_time_minutes: number;
  is_blocked: boolean;
  is_system: boolean;
  installed_at: string;
  last_used: string | null;
  created_at: string;
  device_id: string | null;
}

export type CommandType =
  | 'lock'
  | 'wipe'
  | 'reboot'
  | 'screenshot'
  | 'location'
  | 'ring'
  | 'message'
  | 'block_app'
  | 'unblock_app'
  | 'clear_cache'
  | 'backup'
  | 'scan'
  | 'airplane_mode'
  | 'brightness'
  | 'volume'
  | 'install_app'
  | 'uninstall_app'
  | 'tap'
  | 'swipe'
  | 'back'
  | 'home'
  | 'recents'
  | 'notifications';

export type CommandStatus = 'pending' | 'executing' | 'completed' | 'failed';

export interface RemoteCommand {
  id: string;
  command_type: CommandType;
  status: CommandStatus;
  parameters: Record<string, unknown> | null;
  result: string | null;
  created_at: string;
  executed_at: string | null;
  device_id: string | null;
}

export interface DeviceInfo {
  id: string;
  key: string;
  value: string | null;
  updated_at: string;
  device_id: string | null;
}

export interface Contact {
  id: string;
  name: string;
  phone_number: string;
  email: string | null;
  is_blocked: boolean;
  last_contact: string | null;
  created_at: string;
  device_id: string | null;
}

export interface Device {
  id: string;
  device_name: string;
  device_model: string | null;
  os_version: string | null;
  phone_number: string | null;
  pairing_code: string | null;
  is_paired: boolean;
  is_online: boolean;
  last_seen: string | null;
  created_at: string;
}
