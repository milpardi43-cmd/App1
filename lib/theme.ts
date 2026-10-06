export const Colors = {
  primary: {
    50: '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#4338ca',
    400: '#4f46e5',
    500: '#6366f1',
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
  },
  accent: {
    50: '#ecfeff',
    100: '#cffafe',
    200: '#a5f3fc',
    300: '#0e7490',
    400: '#0891b2',
    500: '#06b6d4',
    600: '#0891b2',
    700: '#0e7490',
    800: '#155e75',
  },
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    300: '#15803d',
    400: '#16a34a',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    300: '#b45309',
    400: '#d97706',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    300: '#b91c1c',
    400: '#dc2626',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
  },
  neutral: {
    0: '#0f172a',
    50: '#1e293b',
    100: '#334155',
    200: '#475569',
    300: '#475569',
    400: '#64748b',
    500: '#94a3b8',
    600: '#b4bfcd',
    700: '#dde3ea',
    800: '#e6eaf0',
    850: '#ffffff',
    900: '#f4f6fa',
    950: '#f6f8fb',
  },
  onColor: '#ffffff',
  onColorSoft: 'rgba(255,255,255,0.85)',
} as const;

export const Shadows = {
  card: {
    shadowColor: '#0f172a',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const Typography = {
  fontFamily: 'Vazirmatn',
  sizes: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 18,
    xl: 22,
    xxl: 28,
    xxxl: 36,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    bold: '700' as const,
  },
};

export const CategoryColors: Record<string, string> = {
  social: '#E1306C',
  communication: '#2AABEE',
  productivity: '#4285F4',
  entertainment: '#FF6B35',
  system: '#6B7280',
  finance: '#00A651',
  game: '#7C4DFF',
  other: '#6366f1',
};

export const CategoryLabels: Record<string, string> = {
  social: 'شبکه اجتماعی',
  communication: 'ارتباطات',
  productivity: 'بهره‌وری',
  entertainment: 'سرگرمی',
  system: 'سیستمی',
  finance: 'مالی',
  game: 'بازی',
  other: 'سایر',
};
