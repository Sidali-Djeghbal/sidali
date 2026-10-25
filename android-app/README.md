# Command Center — Android App (Capacitor)

Dedicated Android native wrapper for your personal Command Center at `https://tools.sidali-djeghbal.dev/`.

## Features
- **Direct Access**: Launches directly into your Command Center SPA.
- **Full-Screen / Immersive**: Standalone app experience without browser navigation bars.
- **Native Back Button**: Uses Android back button to navigate backwards within the command center (tasks, books, sessions) without closing the app.
- **GitHub OAuth Support**: Third-party cookie handling enabled in Android WebView.
- **Offline / Loading Shell**: Local fallback screen if network is unavailable.
- **Custom Branding**: App icons generated directly from your geometric monogram logo on pitch-black background (`#000000`).

## Ready-to-Install APK
The debug APK is compiled and ready at:
- `command-center.apk` (workspace root)
- `android-app/android/app/build/outputs/apk/debug/app-debug.apk`

### Install on Device via ADB
```bash
adb install command-center.apk
```

Or copy `command-center.apk` directly to your Android device via USB / Google Drive / Telegram / etc. and tap to install.

## Rebuilding the APK
```bash
cd android-app
bun x cap sync android
cd android
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk
export ANDROID_HOME=/home/unknown/Android/Sdk
./gradlew assembleDebug
```
