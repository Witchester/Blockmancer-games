# Release Checklist

## 1. General release gates

```text
[ ] Game has title screen
[ ] Game has settings
[ ] Game has credits/licenses
[ ] New run works
[ ] Continue works
[ ] One full run can be completed
[ ] Game over works
[ ] Victory works
[ ] Save/load works after refresh/restart
[ ] No blocker bugs
[ ] Build version visible
[ ] Known limitations documented
```

## 2. Web release checklist

```text
[ ] npm run build passes
[ ] npm run preview works
[ ] No broken assets
[ ] No console errors in normal gameplay
[ ] Works in Chrome
[ ] Works in at least one alternate browser
[ ] Mobile browser layout usable
[ ] Hosting target tested
```

## 3. Android release checklist

```text
[ ] Capacitor config correct
[ ] App ID final or intentionally temporary
[ ] App name final
[ ] App icon added
[ ] Splash screen added
[ ] Android build installs on device
[ ] Touch controls usable
[ ] Back button behavior acceptable
[ ] Audio behavior acceptable
[ ] Performance tested on low/mid device
[ ] Signed release build prepared
[ ] AAB prepared for Google Play if publishing there
```

Google Play currently expects new Android apps and updates to target Android 15 / API level 35 or higher for standard mobile apps, based on current official policy. Check again before submission.

Google Play publishing uses Android App Bundles as the upload/distribution format, while debug APKs are still useful for device testing.

## 4. Steam/PC release checklist

```text
[ ] Store page text complete
[ ] Screenshots complete
[ ] Trailer complete if using
[ ] Capsule art complete
[ ] Build uploaded
[ ] Store page submitted for review
[ ] Build submitted for review
[ ] Achievements optional/not required
[ ] Controller support clearly stated if absent
```

Steam requires store presence and builds to go through review before release.

## 5. Store metadata checklist

```text
[ ] Short description
[ ] Long description
[ ] Genre tags
[ ] Age/content rating
[ ] Privacy policy if analytics/crash reporting added
[ ] Support email/site
[ ] Screenshots
[ ] App icon
[ ] Feature graphic/key art where required
[ ] Trailer optional but recommended
```

## 6. Content rating checklist

```text
[ ] Violence level reviewed
[ ] Fantasy violence marked accurately
[ ] No gambling mechanics unless intended and disclosed
[ ] No user-generated content unless moderated
[ ] Ads/IAP disclosed if present
[ ] Rating questionnaire completed accurately
```

Google Play content ratings are handled through developer questionnaire/IARC flows in Play Console.

## 7. Legal/IP checklist

```text
[ ] Do not use protected names in title/marketing
[ ] Do not use third-party art/audio without license
[ ] Record all licenses
[ ] Credits page complete
[ ] Privacy policy if collecting analytics
[ ] Terms/support page if needed
```

## 8. Release candidate sign-off

```text
Version:
Build hash:
Date:
QA owner:
Known issues:
Release decision: Go / No-go
```

## 9. References

- Google Play target API level requirements: https://support.google.com/googleplay/android-developer/answer/11926878
- Android App Bundle docs: https://developer.android.com/guide/app-bundle
- Steamworks release process: https://partner.steamgames.com/doc/store/releasing
- Google Play content ratings: https://support.google.com/googleplay/answer/6209544

## V2 added release gates

Portrait/mobile gate:

```text
[ ] Portrait-only layout implemented
[ ] Top battle area / board / controls follow 1/5, 3/5, 1/5 target
[ ] Next block queue visible
[ ] Hold block visible
[ ] Inventory quick strip visible or accessible
[ ] Safe-area support verified
```

Content gate:

```text
[ ] At least 5 acts implemented or content-complete
[ ] At least 5 release bosses implemented
[ ] At least 30 monster entries exist
[ ] At least 5 hero entries exist
[ ] Every hero has story and unlock condition
[ ] Every boss has phase/intent/counterplay documentation
```

Art gate:

```text
[ ] Pixel-art UI skin applied
[ ] Commercially usable pixel fonts selected
[ ] Font licenses documented
[ ] Boss sprites/icons exist or approved placeholders exist
[ ] Store screenshots do not look like a classic falling-block clone
```
