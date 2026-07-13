# Kanami

App mobile para practicar **japonés** (hiragana, katakana y kanji N5) con **Expo + React Native + TypeScript**.

## Requisitos

- Node.js 20 o superior
- npm
- Un celular Android o un emulador si querés probar la APK nativa

## Instalación

```bash
npm install
```

## Desarrollo local

```bash
npm start
```

Guia base del proyecto: [guidelines.md](guidelines.md)

Atajos útiles:

- Android dev build: `npm run android`
- Android release local: `npm run android:release`
- iOS: `npm run ios`
- Web: `npm run web`

Importante:

- `npm run android:release` sirve para pruebas locales, pero si querés probar las actualizaciones in-app la APK instalada en el teléfono tiene que estar firmada con la misma key que usan las releases de GitHub.

## Releases por tag

Guía operativa extendida: [docs/release-and-versioning.md](/Users/matiasgulincastells/Documents/hanami/docs/release-and-versioning.md)

El proyecto tiene un workflow en [`.github/workflows/android-release.yml`](/Users/matiasgulincastells/Documents/hanami/.github/workflows/android-release.yml) que:

1. Toma un tag `vX.Y.Z`
2. Ajusta `app.json` y `package.json` con esa versión
3. Genera el proyecto Android nativo
4. Compila una APK release `arm64-v8a`
5. Publica la release en GitHub con el APK adjunto

### Secrets requeridos en GitHub

Configurá estos secrets en el repo:

- `ANDROID_KEYSTORE_BASE64`
- `ANDROID_KEYSTORE_PASSWORD`
- `ANDROID_KEY_ALIAS`
- `ANDROID_KEY_PASSWORD`

Una forma simple de generar el keystore localmente es:

```bash
keytool -genkeypair -v \
  -storetype PKCS12 \
  -keystore kanami-upload.keystore \
  -alias kanami \
  -keyalg RSA \
  -keysize 2048 \
  -validity 3650
```

Y luego convertirlo a base64:

```bash
base64 -i kanami-upload.keystore | pbcopy
```

### Publicar una release

```bash
git tag v0.1.0
git push origin v0.1.0
```

### Flujo recomendado para probar updates

1. Configurá los secrets del keystore en GitHub.
2. Publicá `v0.1.0`.
3. Instalá en el teléfono la APK descargada desde la release de GitHub.
4. Hacé cambios, publicá `v0.1.1` o la versión que siga y buscá updates desde la pantalla de opciones.

La app consulta la última release publicada en GitHub desde la pantalla de opciones y, en Android, descarga e intenta instalar la APK nueva.
