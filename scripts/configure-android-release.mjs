#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const rootDirectory = process.cwd();
const gradlePropertiesPath = path.join(rootDirectory, 'android', 'gradle.properties');
const appBuildGradlePath = path.join(rootDirectory, 'android', 'app', 'build.gradle');
const manifestPath = path.join(
  rootDirectory,
  'android',
  'app',
  'src',
  'main',
  'AndroidManifest.xml',
);

if (!fs.existsSync(gradlePropertiesPath) || !fs.existsSync(appBuildGradlePath)) {
  console.error('Android native project not found. Run prebuild first.');
  process.exit(1);
}

let gradleProperties = fs.readFileSync(gradlePropertiesPath, 'utf8');
gradleProperties = upsertProperty(
  gradleProperties,
  'org.gradle.jvmargs',
  '-Xmx3072m -XX:MaxMetaspaceSize=1024m',
);
gradleProperties = upsertProperty(gradleProperties, 'org.gradle.caching', 'true');
gradleProperties = upsertProperty(gradleProperties, 'reactNativeArchitectures', 'arm64-v8a');
gradleProperties = upsertProperty(
  gradleProperties,
  'android.enableMinifyInReleaseBuilds',
  'true',
);
gradleProperties = upsertProperty(
  gradleProperties,
  'android.enableShrinkResourcesInReleaseBuilds',
  'true',
);
fs.writeFileSync(gradlePropertiesPath, gradleProperties);

const appConfig = JSON.parse(fs.readFileSync(path.join(rootDirectory, 'app.json'), 'utf8'));
const appVersion = appConfig.expo.version;
const androidVersionCode = appConfig.expo.android?.versionCode ?? 1;

let appBuildGradle = fs.readFileSync(appBuildGradlePath, 'utf8');
appBuildGradle = replacePatternOrThrow(
  appBuildGradle,
  /^\s*versionCode\s+\d+$/m,
  `        versionCode ${androidVersionCode}`,
);
appBuildGradle = replacePatternOrThrow(
  appBuildGradle,
  /^\s*versionName\s+"[^"]+"$/m,
  `        versionName "${appVersion}"`,
);
appBuildGradle = replaceNamedBlock(
  appBuildGradle,
  'signingConfigs',
  `    signingConfigs {
        debug {
            storeFile file('debug.keystore')
            storePassword 'android'
            keyAlias 'androiddebugkey'
            keyPassword 'android'
        }
        release {
            if (
                project.hasProperty('KANAMI_UPLOAD_STORE_FILE') &&
                project.hasProperty('KANAMI_UPLOAD_STORE_PASSWORD') &&
                project.hasProperty('KANAMI_UPLOAD_KEY_ALIAS') &&
                project.hasProperty('KANAMI_UPLOAD_KEY_PASSWORD')
            ) {
                storeFile file(KANAMI_UPLOAD_STORE_FILE)
                storePassword KANAMI_UPLOAD_STORE_PASSWORD
                keyAlias KANAMI_UPLOAD_KEY_ALIAS
                keyPassword KANAMI_UPLOAD_KEY_PASSWORD
            }
        }
    }`,
);
appBuildGradle = replaceNamedBlock(
  appBuildGradle,
  'buildTypes',
  `    buildTypes {
        debug {
            signingConfig signingConfigs.debug
        }
        release {
            signingConfig project.hasProperty('KANAMI_UPLOAD_STORE_FILE')
                ? signingConfigs.release
                : signingConfigs.debug
            def enableShrinkResources = findProperty('android.enableShrinkResourcesInReleaseBuilds') ?: 'false'
            shrinkResources enableShrinkResources.toBoolean()
            minifyEnabled enableMinifyInReleaseBuilds
            proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
            def enablePngCrunchInRelease = findProperty('android.enablePngCrunchInReleaseBuilds') ?: 'true'
            crunchPngs enablePngCrunchInRelease.toBoolean()
        }
    }`,
);
fs.writeFileSync(appBuildGradlePath, appBuildGradle);

if (fs.existsSync(manifestPath)) {
  let manifest = fs.readFileSync(manifestPath, 'utf8');
  if (!manifest.includes('android.permission.REQUEST_INSTALL_PACKAGES')) {
    manifest = replaceOrThrow(
      manifest,
      '<uses-permission android:name="android.permission.INTERNET"/>',
      `<uses-permission android:name="android.permission.INTERNET"/>
  <uses-permission android:name="android.permission.REQUEST_INSTALL_PACKAGES"/>`,
    );
    fs.writeFileSync(manifestPath, manifest);
  }
}

console.log('Android release configuration prepared.');

function upsertProperty(fileContents, key, value) {
  const matcher = new RegExp(`^${escapeRegExp(key)}=.*$`, 'm');

  if (matcher.test(fileContents)) {
    return fileContents.replace(matcher, `${key}=${value}`);
  }

  return `${fileContents.trimEnd()}\n${key}=${value}\n`;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function replaceOrThrow(fileContents, searchValue, replacementValue) {
  if (!fileContents.includes(searchValue)) {
    throw new Error(`Could not find expected snippet: ${searchValue}`);
  }

  return fileContents.replace(searchValue, replacementValue);
}

function replacePatternOrThrow(fileContents, searchPattern, replacementValue) {
  if (!searchPattern.test(fileContents)) {
    throw new Error(`Could not find expected pattern: ${searchPattern}`);
  }

  return fileContents.replace(searchPattern, replacementValue);
}

function replaceNamedBlock(fileContents, blockName, replacementBlock) {
  const blockRange = findNamedBlock(fileContents, blockName);

  if (!blockRange) {
    throw new Error(`Could not find expected block: ${blockName}`);
  }

  return (
    fileContents.slice(0, blockRange.start) +
    replacementBlock +
    fileContents.slice(blockRange.end)
  );
}

function findNamedBlock(fileContents, blockName) {
  const matcher = new RegExp(`(^|\\n)([ \\t]*)${escapeRegExp(blockName)}\\s*\\{`, 'm');
  const match = matcher.exec(fileContents);

  if (!match || match.index === undefined) {
    return null;
  }

  const start = match.index + match[1].length;
  const openingBraceIndex = fileContents.indexOf('{', start);

  if (openingBraceIndex === -1) {
    return null;
  }

  let depth = 0;

  for (let index = openingBraceIndex; index < fileContents.length; index += 1) {
    const character = fileContents[index];

    if (character === '{') {
      depth += 1;
    } else if (character === '}') {
      depth -= 1;

      if (depth === 0) {
        return { start, end: index + 1 };
      }
    }
  }

  return null;
}
