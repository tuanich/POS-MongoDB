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
