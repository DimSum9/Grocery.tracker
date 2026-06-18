# Grocery Expense Tracker

A grocery price / budget tracker: barcode scanning, receipt OCR, budgets, and
local grocery-tax estimation. One codebase, two forms:

- **Web app (PWA):** the files at the repo **root** (`index.html`, `manifest.json`,
  `sw.js`, icons). This is what GitHub Pages serves at
  https://dimsum9.github.io/Grocery.tracker/ — keep `index.html` at the root.
- **Native Android app:** [`Miscellelous/`](Miscellelous/) — a Capacitor wrapper that
  bundles the web app locally (installs as a normal app, no URL bar).
- **Signed release artifacts:** [`Grocery - Google Play package/`](Grocery%20-%20Google%20Play%20package/) — `Grocery.apk` / `Grocery.aab`.

## Rebuilding the Android app

```bash
cd Miscellelous
npm install                         # restore Capacitor (node_modules)
npx cap copy android                # copy www/ -> android assets/public
cd android
./gradlew :app:assembleRelease :app:bundleRelease
```

### Signing (kept out of source control)

Release signing reads `Miscellelous/android/keystore.properties` (git-ignored).
Create it with `storeFile`, `storePassword`, `keyAlias`, `keyPassword`, and place
the matching `signing.keystore` at `Miscellelous/android/app/signing.keystore`.
Keep these private — they are the key used to update the Play listing. Bump
`versionCode` in `Miscellelous/android/app/build.gradle` for each release.

## Editing the app

Edit the root `index.html` (the web app + Pages site). To update the native app,
mirror it into `Miscellelous/www/index.html` (swap the web service-worker
registration for the native no-SW cleanup), run `npx cap copy android`, and rebuild.
