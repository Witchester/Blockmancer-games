# Build APK Instructions

## Prerequisites

### Windows
1. Install Node.js LTS
2. Install JDK 17
3. Install Android Studio
4. Install the Android SDK through Android Studio

### macOS/Linux
1. Install Node.js LTS
2. Install JDK 17
3. Install Android Studio
4. Install the Android SDK through Android Studio

## Web Build
```bash
npm install
npm run build
```

## Prepare Android Project
```bash
npm run android:init
npm run android:sync
npm run android:open
```

Equivalent direct commands:
```bash
npx cap add android
npx cap sync android
npx cap open android
```

## Build APK In Android Studio
Open the generated Android project, then use:

`Build > Build Bundle(s) / APK(s) > Build APK(s)`

## Build APK From Command Line

Windows:
```bash
cd android
gradlew.bat assembleDebug
```

macOS/Linux:
```bash
cd android
./gradlew assembleDebug
```

## APK Output Path
`android/app/build/outputs/apk/debug/app-debug.apk`

## Notes
- `npm run android:init` only adds the Android shell if the `android/` folder does not already exist.
- `npm run android:sync` rebuilds the web bundle and copies it into Capacitor.
- Android Studio is still required for SDK management and the most reliable local debugging workflow.
