# feldbuch-poc

> Proof of concept of the planned archeological 3D-Fieldbook

## Requirements

### Downloads 
 - [Java JDK-11](https://www.oracle.com/java/technologies/javase/jdk11-archive-downloads.html)
 - [Gradle v7.6](https://gradle.org/releases/)
 - [Android Studio](https://developer.android.com/studio)

### System Variables
- JAVA_HOME:  link to jdk-11
- PATH: add gradle

### Further requirements

- Android 8.0 (Oreo) SDK
- Android SDK Build-Tools v30.0.3
- Android SDK Plattform-Tools
- Android SDK Command-line Tools
- Android Emulator

(Install Android Studio and download required stuff from there)

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

## Cordova Build Setup for Android, iOS and Browser

``` bash
# building for supported platforms
cordova build android
cordova build iOS
cordova build browser

# run poc on the different platforms
cordova run android
cordova run ios
cordova run browser
```


For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
