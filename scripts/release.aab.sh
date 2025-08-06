#!/bin/bash
# echo "Go to root of your project"
# cp ./.env.dev ./.env 
# yarn run rm
cd android
./gradlew clean
cd ..
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/build/intermediates/res/merged/release/
cd android
./gradlew bundleRelease
cd ..

echo "The aab file will be at this location: mobile_app/android/app/build/outputs/bundle/release/app-release.aab"
