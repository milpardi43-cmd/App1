const { withMainApplication } = require('@expo/config-plugins');

/**
 * Enables react-native-webrtc's built-in foreground MediaProjection service.
 * Android 10+ requires this service (and its visible notification) while the
 * user is sharing the screen.
 */
module.exports = function withMediaProjectionService(config) {
  return withMainApplication(config, (result) => {
    if (result.modResults.language !== 'kt') {
      throw new Error('withMediaProjectionService currently expects MainApplication.kt');
    }

    let source = result.modResults.contents;
    const importLine = 'import com.oney.WebRTCModule.WebRTCModuleOptions';
    if (!source.includes(importLine)) {
      const packageLine = source.match(/^package .*$/m)?.[0];
      if (!packageLine) throw new Error('Could not find package declaration in MainApplication.kt');
      source = source.replace(packageLine, `${packageLine}\n\n${importLine}`);
    }

    const enableLine = 'WebRTCModuleOptions.getInstance().enableMediaProjectionService = true';
    if (!source.includes(enableLine)) {
      const superCall = 'super.onCreate()';
      if (!source.includes(superCall)) throw new Error('Could not find super.onCreate() in MainApplication.kt');
      source = source.replace(superCall, `${superCall}\n    ${enableLine}`);
    }

    result.modResults.contents = source;
    return result;
  });
};
