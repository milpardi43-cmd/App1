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
  local activity_summary log_summary ui_summary annotation
  trap - EXIT
  if (( status != 0 )); then
    set +e
    printf '\nSmoke test failed during: %s (exit %s)\n' "$failed_step" "$status"
    printf '\n--- ADB devices ---\n'
    adb devices -l
    printf '\n--- Emulator boot status ---\n'
    adb shell getprop sys.boot_completed
    printf '\n--- Resumed activity ---\n'
    activity_summary="$(adb shell dumpsys activity activities 2>&1 | grep -E 'mResumedActivity|topResumedActivity|ResumedActivity' | tail -n 8 | tr '\n' ' ' || true)"
    printf '%s\n' "${activity_summary:-'(no resumed activity reported)'}"
    printf '\n--- Relevant recent logcat ---\n'
    log_summary="$(adb logcat -d -t 3000 2>&1 | grep -E 'FATAL EXCEPTION|Unable to load script|AppStartupError|ReactNativeJS|AndroidRuntime|ReactNative|SoLoader|ActivityTaskManager' | tail -n 80 || true)"
    printf '%s\n' "${log_summary:-'(no matching Android or React Native errors)'}"
    ui_summary='(UI hierarchy unavailable)'
    if [[ -f "$ui_file" ]]; then
      printf '\n--- UI hierarchy (first 4000 bytes) ---\n'
      head -c 4000 "$ui_file"
      printf '\n'
      ui_summary="$(python3 - "$ui_file" <<'PY' 2>/dev/null || true
import sys
import xml.etree.ElementTree as ET

root = ET.parse(sys.argv[1]).getroot()
values = []
for node in root.iter():
    for name in ('text', 'content-desc'):
        value = node.attrib.get(name, '').strip()
        if value and value not in values:
            values.append(value)
print(' | '.join(values)[:1800] or '(no accessible text nodes)')
PY
)"
    fi
    annotation="${failed_step} (exit ${status}); UI=${ui_summary}; ACTIVITY=${activity_summary:-none}; LOGCAT=$(printf '%s' "$log_summary" | tail -n 12 | tr '\n' ' ' | cut -c1-1800)"
    annotation="${annotation//'%'/'%25'}"
    annotation="${annotation//$'\r'/'%0D'}"
    annotation="${annotation//$'\n'/'%0A'}"
    echo "::error title=Android emulator smoke test failed::${annotation}"
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
