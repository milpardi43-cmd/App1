const { withAndroidManifest, withDangerousMod, withMainApplication } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const packageName = 'com.devicecontrol.companion';

module.exports = function withCompanionAccessibility(config) {
  config = withAndroidManifest(config, (result) => {
    const application = result.modResults.manifest.application?.[0];
    if (!application) throw new Error('Android application manifest node was not found');
    application.service = application.service || [];
    const serviceName = '.CompanionAccessibilityService';
    if (!application.service.some((item) => item.$?.['android:name'] === serviceName)) {
      application.service.push({
        $: {
          'android:name': serviceName,
          'android:permission': 'android.permission.BIND_ACCESSIBILITY_SERVICE',
          'android:exported': 'true',
          'android:label': 'کنترل رضایت‌محور گوشی دوم',
        },
        'intent-filter': [{ action: [{ $: { 'android:name': 'android.accessibilityservice.AccessibilityService' } }] }],
        'meta-data': [{ $: { 'android:name': 'android.accessibilityservice', 'android:resource': '@xml/companion_accessibility_service' } }],
      });
    }
    return result;
  });

  config = withDangerousMod(config, ['android', async (result) => {
    const androidRoot = result.modRequest.platformProjectRoot;
    const javaDir = path.join(androidRoot, 'app/src/main/java', ...packageName.split('.'));
    const xmlDir = path.join(androidRoot, 'app/src/main/res/xml');
    fs.mkdirSync(javaDir, { recursive: true });
    fs.mkdirSync(xmlDir, { recursive: true });

    fs.writeFileSync(path.join(xmlDir, 'companion_accessibility_service.xml'), `<?xml version="1.0" encoding="utf-8"?>
<accessibility-service xmlns:android="http://schemas.android.com/apk/res/android"
  android:accessibilityEventTypes="typeAllMask"
  android:accessibilityFeedbackType="feedbackGeneric"
  android:notificationTimeout="100"
  android:canRetrieveWindowContent="false"
  android:canPerformGestures="true"
  android:accessibilityFlags="flagDefault" />\n`);

    fs.writeFileSync(path.join(javaDir, 'CompanionAccessibilityService.kt'), `package ${packageName}

import android.accessibilityservice.AccessibilityService
import android.view.accessibility.AccessibilityEvent

class CompanionAccessibilityService : AccessibilityService() {
  companion object { @Volatile var instance: CompanionAccessibilityService? = null }
  override fun onServiceConnected() { super.onServiceConnected(); instance = this }
  override fun onAccessibilityEvent(event: AccessibilityEvent?) = Unit
  override fun onInterrupt() = Unit
  override fun onDestroy() { if (instance === this) instance = null; super.onDestroy() }
}
`);

    fs.writeFileSync(path.join(javaDir, 'CompanionControlModule.kt'), `package ${packageName}

import android.accessibilityservice.AccessibilityService
import android.accessibilityservice.GestureDescription
import android.content.ComponentName
import android.content.Intent
import android.graphics.Path
import android.provider.Settings
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class CompanionControlModule(private val context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {
  override fun getName() = "CompanionControl"

  private fun service(): CompanionAccessibilityService? = CompanionAccessibilityService.instance

  @ReactMethod fun isEnabled(promise: Promise) {
    val expected = ComponentName(context, CompanionAccessibilityService::class.java).flattenToString()
    val enabled = Settings.Secure.getString(context.contentResolver, Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES) ?: ""
    promise.resolve(enabled.split(':').any { it.equals(expected, ignoreCase = true) })
  }

  @ReactMethod fun openSettings(promise: Promise) {
    try {
      val intent = Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      context.startActivity(intent)
      promise.resolve(true)
    } catch (error: Exception) { promise.reject("SETTINGS_FAILED", error) }
  }

  private fun gesture(path: Path, duration: Long, promise: Promise) {
    val active = service()
    if (active == null) { promise.reject("SERVICE_DISABLED", "Accessibility control is not enabled"); return }
    val request = GestureDescription.Builder().addStroke(GestureDescription.StrokeDescription(path, 0, duration.coerceIn(1, 5000))).build()
    val accepted = active.dispatchGesture(request, object : AccessibilityService.GestureResultCallback() {
      override fun onCompleted(description: GestureDescription?) { promise.resolve(true) }
      override fun onCancelled(description: GestureDescription?) { promise.reject("GESTURE_CANCELLED", "Gesture was cancelled") }
    }, null)
    if (!accepted) promise.reject("GESTURE_REJECTED", "Gesture was rejected")
  }

  @ReactMethod fun tap(x: Double, y: Double, promise: Promise) {
    val path = Path().apply { moveTo(x.toFloat(), y.toFloat()) }
    gesture(path, 80, promise)
  }

  @ReactMethod fun swipe(x1: Double, y1: Double, x2: Double, y2: Double, durationMs: Double, promise: Promise) {
    val path = Path().apply { moveTo(x1.toFloat(), y1.toFloat()); lineTo(x2.toFloat(), y2.toFloat()) }
    gesture(path, durationMs.toLong(), promise)
  }

  @ReactMethod fun globalAction(action: String, promise: Promise) {
    val active = service()
    if (active == null) { promise.reject("SERVICE_DISABLED", "Accessibility control is not enabled"); return }
    val code = when (action) {
      "back" -> AccessibilityService.GLOBAL_ACTION_BACK
      "home" -> AccessibilityService.GLOBAL_ACTION_HOME
      "recents" -> AccessibilityService.GLOBAL_ACTION_RECENTS
      "notifications" -> AccessibilityService.GLOBAL_ACTION_NOTIFICATIONS
      else -> { promise.reject("INVALID_ACTION", "Unsupported global action"); return }
    }
    promise.resolve(active.performGlobalAction(code))
  }
}
`);

    fs.writeFileSync(path.join(javaDir, 'CompanionControlPackage.kt'), `package ${packageName}

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

class CompanionControlPackage : ReactPackage {
  override fun createNativeModules(context: ReactApplicationContext): List<NativeModule> = listOf(CompanionControlModule(context))
  override fun createViewManagers(context: ReactApplicationContext): List<ViewManager<*, *>> = emptyList()
}
`);
    return result;
  }]);

  config = withMainApplication(config, (result) => {
    if (result.modResults.language !== 'kt') throw new Error('Accessibility plugin expects MainApplication.kt');
    let source = result.modResults.contents;
    const importLine = `import ${packageName}.CompanionControlPackage`;
    if (!source.includes(importLine)) {
      const packageLine = source.match(/^package .*$/m)?.[0];
      if (!packageLine) throw new Error('MainApplication package declaration was not found');
      source = source.replace(packageLine, `${packageLine}\n\n${importLine}`);
    }
    if (!source.includes('add(CompanionControlPackage())')) {
      const marker = 'PackageList(this).packages.apply {';
      if (!source.includes(marker)) throw new Error('MainApplication package list marker was not found');
      source = source.replace(marker, `${marker}\n              add(CompanionControlPackage())`);
    }
    result.modResults.contents = source;
    return result;
  });
  return config;
};
