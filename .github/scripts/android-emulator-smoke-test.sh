#!/usr/bin/env bash
set -Eeuo pipefail

apk_path="android/app/build/outputs/apk/release/app-release.apk"
diag_dir="${RUNNER_TEMP:-/tmp}"
log_file="$diag_dir/milomultiapp-emulator-smoke.log"
ui_file="$diag_dir/milomultiapp-emulator-window.xml"
screenshot_file="$diag_dir/milomultiapp-emulator-screen.png"
remote_ui_file="/sdcard/milomultiapp-window.xml"
failed_step="smoke-test setup"

mkdir -p "$diag_dir"
: > "$log_file"
exec > >(tee -a "$log_file") 2>&1

on_exit() {
  local status=$?
  trap - EXIT
  if (( status != 0 )); then
    set +e
    printf '\nSmoke test failed during: %s (exit %s)\n' "$failed_step" "$status"
    printf '\n--- ADB devices ---\n'
    adb devices -l
    printf '\n--- Emulator boot status ---\n'
    adb shell getprop sys.boot_completed
    printf '\n--- Resumed activity ---\n'
    adb shell dumpsys activity activities 2>&1 | grep -E 'mResumedActivity|topResumedActivity|ResumedActivity' | tail -n 8 || true
    printf '\n--- Relevant recent logcat ---\n'
    adb logcat -d -t 3000 2>&1 | grep -E 'FATAL EXCEPTION|Unable to load script|AppStartupError|ReactNativeJS|AndroidRuntime|ReactNative|SoLoader|ActivityTaskManager' | tail -n 80 || true
    if [[ -f "$ui_file" ]]; then
      printf '\n--- UI hierarchy (first 4000 bytes) ---\n'
      head -c 4000 "$ui_file"
      printf '\n'
    fi
    echo "::error title=Android emulator smoke test failed::${failed_step} (exit ${status}); inspect this step and the android-emulator-smoke diagnostics artifact."
  fi
  exit "$status"
}
trap on_exit EXIT

printf 'Testing standalone APK: %s\n' "$apk_path"
printf 'Diagnostics will be saved under: %s\n' "$diag_dir"

failed_step="listing emulator devices"
adb devices -l

failed_step="installing standalone APK"
adb install -r "$apk_path"

failed_step="clearing Android logcat"
adb logcat -c

failed_step="launching the main activity"
timeout 90s adb shell am start -W -n com.devicecontrol.companion/.MainActivity

failed_step="dumping the Android UI hierarchy"
timeout 60s adb shell uiautomator dump "$remote_ui_file"

failed_step="retrieving the Android UI hierarchy"
adb pull "$remote_ui_file" "$ui_file"

failed_step="capturing the launched screen"
if ! timeout 30s adb exec-out screencap -p > "$screenshot_file"; then
  echo 'Warning: screenshot capture failed; continuing with the UI hierarchy check.'
fi

failed_step="verifying the language-selection screen rendered"
if ! grep -Fq 'کدام دنیا را باز کنیم' "$ui_file"; then
  echo 'The expected language-selection text was not found in the UI hierarchy.'
  exit 1
fi

echo 'Android emulator opened MiloMultiApp and rendered the language-selection screen.'
