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
# build local and issue android folder run with android emulator 
npx expo run:android

# buid apk 
eas build --profile production --platform android
# upload to expo server and run apk on android emalator
eas build:run -p android 
#### manager keystone
eas credentials
#### edit /android/app/build.gradle to change keystore .Because expo build & eas buid are difference keystore
 /*   signingConfigs {
        debug {
            storeFile file('debug.keystore')
            storePassword 'android'
            keyAlias 'androiddebugkey'
            keyPassword 'android'
        }
    }*/
    signingConfigs {
        debug {
            storeFile file('keystore.jks')
            storePassword 'b70da973888a2411971b645bd8975ee7'
            keyAlias '0795e0a88287533d36cca9c437c57aff'
            keyPassword 'bb18c16ad60efdc97fb1126a46236929'
        }
    }

###view keystore
cd android && ./gradlew signingreport