#URL API
edit .env
#install package in package.json
npm install
# Upgrape expo and fix
npm install -g expo-cli@latest
npx expo-doctor
npx expo install --check
npx expo install --fix
## for web
npx expo install @expo/metro-runtime
npx expo install expo-crypto
# start expo
expo start -c (press "s" switch to go)
# expo prebuild (create folder ./android & ./ios)
npx expo prebuild --clean
npx expo prebuild
# run with android emulator
npx expo run:android

# buid apk 
eas build --profile production --platform android
# run apk on android emalator
eas build:run -p android 