#!/bin/bash
# echo "Go to root of your project"
# cp ./.env.dev ./.env 
# yarn run rm
cd android
./gradlew clean
cd ..
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
cd android
./gradlew assembleDebug

cd ..

echo "The apk file will be at this location: mobile_app/android/app/build/outputs/apk/debug/app-debug.apk"
