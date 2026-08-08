---
name: kanami-release
description: Publicar una versión de Kanami (tag vX.Y.Z, GitHub Actions, APK Android, updater in-app) o tocar la configuración de build/versionado. Usala cuando el pedido sea "sacá una versión", "publicá una release" o al modificar app.json, los scripts de release o el workflow.
---

# Releases y versionado

## Cuándo usar esta skill

- "Publicá la versión X", "sacá una release".
- Tocás `app.json`, `scripts/set-release-version.mjs`,
  `scripts/configure-android-release.mjs`, `.github/workflows/android-release.yml`
  o `plugins/withProguardRules.js`.
- El updater in-app no encuentra o no instala la actualización.

## Contexto a leer primero

1. `docs/release-and-versioning.md` — la guía operativa extendida (ya existe, no la dupliques)
2. `.github/workflows/android-release.yml`
3. `src/features/update/releaseClient.ts` + `androidUpdater.ts`

## Cómo funciona

Todo se dispara con un **tag Git `vX.Y.Z`**:

```
git tag v0.2.0 && git push origin v0.2.0
```

El workflow (`android-release.yml`) entonces:

1. Valida los 4 secrets de firma (falla temprano si falta alguno)
2. `npm ci`
3. `node ./scripts/set-release-version.mjs $RELEASE_VERSION` → escribe `package.json` y `app.json`
4. `npx expo prebuild --platform android --no-install --clean` → **genera** `/android`
5. `node ./scripts/configure-android-release.mjs`
6. `./gradlew assembleRelease` con las props del keystore
7. Copia la APK a `dist/kanami-v<version>-arm64-v8a.apk`
8. Publica la GitHub Release con la APK adjunta

## Reglas duras

- **`versionCode = major*10000 + minor*100 + patch`.** No cambies la fórmula sin una razón muy
  fuerte: define el upgrade path de Android y no es reversible para quien ya instaló.
- **Todas las APKs se firman con la MISMA key.** Si cambia, Android **no** actualiza encima y
  el usuario tiene que desinstalar y perder su progreso local (los JSON viven en el sandbox
  de la app).
- **La Release debe traer una APK adjunta** o el updater falla: `releaseClient.ts:40-44` exige
  un asset que termine en `.apk`.
- **`/android` e `/ios` son generados y están gitignoreados.** Nunca los edites como fuente de
  verdad; los cambios nativos van en `app.json` o en `plugins/`.
- La versión se toma del **tag**, no de `package.json`. No hace falta commitear el bump antes.
- **El APK de release no lleva la API key de Gemini.** El CI no tiene ese secret, a propósito
  (BYOK). No agregues `EXPO_PUBLIC_GEMINI_API_KEY` al workflow.

## Secrets requeridos en GitHub

`ANDROID_KEYSTORE_BASE64` · `ANDROID_KEYSTORE_PASSWORD` · `ANDROID_KEY_ALIAS` ·
`ANDROID_KEY_PASSWORD`

## Updater in-app

- Consulta `https://api.github.com/repos/mattcastells/kanami/releases/latest`.
- Compara con `compareVersions` (semver, tolerante al prefijo `v`).
- Descarga la APK a `Paths.cache/updates` y lanza el intent `VIEW` con
  `FLAG_GRANT_READ_URI_PERMISSION`.
- **Solo Android.** En web e iOS tira un error explícito.
- Requiere el permiso `REQUEST_INSTALL_PACKAGES`, ya declarado en `app.json`.
- Se dispara desde Perfil/Opciones.

## Antes de taggear

1. `npx tsc --noEmit` pasa
2. Validado en `npm run web` (ver `kanami-validar`)
3. El working tree está limpio y pusheado
4. La versión del tag es mayor que la última release publicada
5. Si el cambio toca algo nativo (permisos, plugins, notificaciones, updater): probalo con
   `npm run android` **antes** de taggear — el CI no lo va a atrapar

## Antes de tocar la config de build

- `app.json`: `package` sigue siendo `com.anonymous.Kanami` (default anónimo, deuda pendiente).
  Cambiarlo es **irreversible para las instalaciones existentes**: Android lo trata como otra
  app. Si se cambia, tiene que ser una decisión consciente y antes de una distribución real.
- Cambios en `plugins/withProguardRules.js` solo se ven en un build release. Un dev build no
  los ejercita.

## Cómo validar

- **Antes del tag**: typecheck + web + (si aplica) `npm run android`.
- **Después del tag**: seguí el run en GitHub Actions hasta el final. Los puntos donde suele
  romper son la validación de secrets y `assembleRelease`.
- **Verificá la Release publicada**: que tenga la APK adjunta y que el nombre del archivo
  coincida con la versión.
- **Probá el updater de punta a punta**: con una APK previa instalada (misma firma), abrí
  Perfil → buscar actualización → tiene que ofrecer, descargar e instalar la nueva.

## Errores a evitar

- Taggear con `tsc` en rojo.
- Cambiar la fórmula de `versionCode`.
- Firmar con una key distinta a la de las releases anteriores.
- Editar `/android` a mano.
- Publicar una Release sin APK adjunta.
- Meter la key de Gemini en el build.
