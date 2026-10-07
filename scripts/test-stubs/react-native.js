export const Platform = { get OS() { return globalThis.__RN_OS__ ?? 'ios'; }, select: (o) => (o[globalThis.__RN_OS__ ?? 'ios'] ?? o.default) };
export const Dimensions = { get: () => ({ width: 390, height: 844 }) };
export const I18nManager = { isRTL: true, allowRTL() {}, forceRTL() {} };
export const Appearance = { getColorScheme: () => 'light' };
export default { Platform };
