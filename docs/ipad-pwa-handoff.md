# Handoff — Kanami en iPad (ruta PWA)

Fecha: 2026-08-08. Estado: **decisión tomada, implementación pendiente.**

## Decisión

Correr Kanami en el iPad **como PWA web**, no como app nativa iOS.

Se descartó el build nativo aunque hay una Mac disponible: con Apple ID gratis el
provisioning profile **caduca a los 7 días**, así que la app deja de abrir y hay que
reconectar el iPad a la Mac y reinstalar. Semanalmente, para siempre. La PWA es trabajo
de una sola vez. La cuenta paga de Apple Developer (USD 99/año) elimina ese ciclo pero
no se justifica para uso personal.

El camino nativo queda como fallback disponible: no requiere ningún cambio de código.

## Hallazgo que motiva el trabajo

`expo-file-system` **no funciona en web**. No es una limitación parcial: es un stub
donde todos los métodos son no-op con un `console.warn`. Ver
`node_modules/expo-file-system/src/ExpoFileSystem.web.ts`.

Consecuencia: en web hoy **no persiste nada**, y falla en silencio porque los tres
providers envuelven todo en `try/catch`.

| Provider | Archivo | Qué se pierde en web |
|---|---|---|
| `src/settings/AppSettingsProvider.tsx` | `app-settings.json` | tema, haptics, **API key de Gemini**, meta diaria |
| `src/features/progress/ProgressProvider.tsx` | `progress.json` | progreso por modo, racha diaria |
| `src/features/srs/SrsProvider.tsx` | `srs.json` | estado del repaso espaciado (Leitner) |

Esto también afecta el desarrollo: como la validación del repo es web-first, cada
sesión de desarrollo viene arrancando sin ajustes ni progreso. El fix sirve para las
dos cosas.

## Probar HOY en la tablet (sin cambios de código)

La PC y la tablet están en la misma red. IP de la PC: **192.168.1.84**.

```bash
npx expo start --web --host lan
```

En Safari del iPad: `http://192.168.1.84:8081`

Si no carga, es el Firewall de Windows bloqueando el puerto 8081 en red privada:
permitir `node.exe` o abrir el puerto entrante.

**Qué se puede evaluar así:** layout en pantalla grande, todos los juegos, Estudiar /
apuntes de clase, navegación, fuentes Zen, dark mode. Es la prueba real de si la app
se siente bien en tablet.

**Qué NO va a andar en esta prueba, y es esperable:**
- Nada persiste (el hallazgo de arriba). Recargar = empezar de cero.
- Kyary pide pegar la API key en cada recarga.
- Modo voz y pronunciación: **no van a funcionar y no es un bug**. Safari exige
  *secure context* para el micrófono, y `http://` sobre IP de LAN no lo es (solo
  `localhost` está exento). Recién se pueden evaluar sobre HTTPS, o sea después del
  deploy.

## Plan para mañana

### 1. Adapter de storage — el bloqueante real

Crear `src/features/storage/jsonStore.ts` + `jsonStore.web.ts` (Metro resuelve el
sufijo `.web` solo, es el mismo mecanismo que usa expo-file-system internamente).

API sugerida, que calca lo que ya hacen los providers:

```ts
readJson(filename: string): Promise<unknown | null>
writeJson(filename: string, data: unknown): void
```

- Nativo: `new File(Paths.document, filename)`, `.exists`, `await .text()`,
  `.create({ intermediates: true, overwrite: true })`, `.write(..., { encoding: 'utf8' })`.
- Web: `localStorage.getItem/setItem` con la misma clave. Alcanza de sobra — los tres
  JSON son chicos y localStorage persiste en el "Add to Home Screen" de iOS.

Después migrar los tres providers a usar el adapter. El patrón actual es idéntico en
los tres (`get*File()` → read en `useEffect` de montaje → write en `useEffect` keyed
por data), así que el reemplazo es mecánico:

- `AppSettingsProvider.tsx:167` `getSettingsFile()`
- `ProgressProvider.tsx:151` `getProgressFile()`
- `SrsProvider.tsx:86` `getSrsFile()`

Cuidado con mantener la lógica de hidratación existente (`dirtyRef` / `hydratedRef`)
— resuelve una race real, no tocarla.

Cerrar con `npx tsc --noEmit` y la skill `kanami-validar`.

### 2. Verificar persistencia en web

Con el adapter puesto: `npm run web`, ganar progreso, recargar, confirmar que
sobrevive. Repetir en Safari del iPad por LAN.

### 3. Metadatos de PWA

Para que "Agregar a pantalla de inicio" abra en pantalla completa sin la barra de
Safari hace falta un web manifest con `display: standalone` (iOS 17+ lo respeta) y/o
el meta `apple-mobile-web-app-capable`. Hoy `app.json` solo define `web.favicon`, así
que **hay que verificar qué genera realmente el export** antes de asumir que falta algo.
Sumar también ícono y `theme-color` acorde a la paleta (`#F7F4EF` light / `#1B1A17` dark).

### 4. Export y deploy

```bash
npx expo export --platform web   # genera dist/
```

Deploy a GitHub Pages (el repo ya usa GitHub Actions, se puede sumar un workflow) o
Netlify. **Requisito no negociable: HTTPS**, tanto para que el micrófono funcione como
para que la PWA sea instalable. Las dos opciones lo dan gratis.

### 5. Evaluar en el iPad ya con HTTPS

Recién acá se puede juzgar el modo voz de Kyary y `PronunciationGameScreen`. Ambos
usan `expo-speech-recognition`, que en web cae a Web Speech API; en Safari iOS eso es
`webkitSpeechRecognition` y es notoriamente caprichoso. **Puede no andar.** Si pasa,
la decisión es degradar esas dos features en web con un mensaje claro, no pelearlas.

## Lo que se pierde en web (aceptado)

- Recordatorio diario (`expo-notifications`) — ya está guardeado con `Platform.OS`.
- Haptics.
- Updater in-app — es Android-only por diseño.
- Export de progreso usa clipboard en vez de `Share` — ya contemplado en `ProgressCard`.

## Fallback: nativo en la Mac

Si la PWA no convence, no hay código que escribir:

1. Clonar el repo en la Mac, `npm install`, Xcode instalado.
2. Cambiar el bundle id — `app.json` tiene `com.anonymous.Kanami`, el default anónimo
   (ya figura como deuda técnica en `.claude/docs/estado-y-deuda.md`).
3. Abrir el proyecto en Xcode, seleccionar el Personal Team del Apple ID gratis.
4. `npx expo run:ios --device` con el iPad conectado.
5. Repetir cada 7 días cuando caduque el perfil.

Ahí sí andan haptics, notificaciones locales y el modo voz nativo.
