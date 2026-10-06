/**
 * Custom entry point.
 *
 * This file runs BEFORE any app code (including lib/supabase.ts, lib/DeviceContext.tsx,
 * and every screen) is imported. Its only job is to install a global JS error handler
 * so that if anything throws during startup — even a synchronous error thrown while a
 * module is being imported — the app shows a readable on-screen message instead of
 * silently crashing with a native "keeps stopping" dialog.
 *
 * React Native's module loader wraps every `require()` call in the currently-registered
 * global error handler, so installing it here, first, lets us catch errors that happen
 * even before the React tree exists (where a React ErrorBoundary cannot help).
 */
import { Alert, I18nManager, Platform } from 'react-native';

// This is a Persian (Farsi) app — its UI is always RTL regardless of the
// phone's system language. Setting it here, at the very top of the entry file,
// makes sure it runs before ANY other module so the direction is applied
// from the very first frame.
try {
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(true);
} catch (rtlError) {
  // Fall through silently — the layout wrapper in app/_layout.tsx also
  // forces RTL visually via `direction: 'rtl'`.
}

// On web, `direction: 'rtl'` in StyleSheet is not supported by react-native-web,
// so set the DOM direction globally instead — the whole tree inherits it.
if (Platform.OS === 'web' && typeof document !== 'undefined') {
  try {
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'fa';
  } catch (webRtlError) {
    // ignore — web preview degrades gracefully
  }
}

try {
  const ErrorUtilsGlobal = global.ErrorUtils;

  if (ErrorUtilsGlobal && typeof ErrorUtilsGlobal.setGlobalHandler === 'function') {
    ErrorUtilsGlobal.setGlobalHandler((error, isFatal) => {
      const message = (error && error.message) || String(error);
      const stack = (error && error.stack) || '';

      // Always log it, in case a logcat/log viewer is available.
      // eslint-disable-next-line no-console
      console.error('[AppStartupError]', isFatal ? 'FATAL' : 'non-fatal', message, stack);

      try {
        Alert.alert(
          isFatal ? 'برنامه با خطا مواجه شد' : 'خطا',
          `${message}\n\n${stack}`.slice(0, 1800),
          [{ text: 'باشه' }],
          { cancelable: true }
        );
      } catch (alertError) {
        // If even Alert fails, there's nothing more we can safely do here.
      }

      // Intentionally NOT re-throwing / forwarding to the default handler:
      // the default handler for fatal errors terminates the app process,
      // which is exactly the "keeps stopping" crash we're trying to avoid.
      // Showing the message and staying alive (even if the UI is broken)
      // is far more useful for diagnosing the problem.
    });
  }
} catch (setupError) {
  // If installing the handler itself fails, fall through silently —
  // worst case we're back to default behavior.
}

require('expo-router/entry');
