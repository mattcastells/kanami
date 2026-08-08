# CLAUDE.md — Kanami

Guía operativa para trabajar en este repo con Claude Code. Este archivo se carga
automáticamente en cada sesión: mantenelo corto, cierto y actualizado. Si un cambio
contradice algo de acá, actualizá este archivo en el mismo commit.

> `guidelines.md` es **legacy y está desactualizado** (describe un diseño dark/glass/cyan
> con fuentes Sora/Manrope que ya no existe). La fuente de verdad de diseño es este archivo
> + el código en `src/theme/`. No sigas `guidelines.md` para decisiones visuales.

## Qué es

App mobile (Expo + React Native + TypeScript) para practicar **japonés**: hiragana,
katakana, kanji N5, vocabulario, números y frases. Incluye una asistente con IA (**Kyary**,
Gemini) y una sección de estudio con teoría. Español rioplatense en toda la UI.

- Package: `kanami` · Expo `~55` · React Native `0.83.6` · React `19.2` · TypeScript `strict`.
- Plataforma primaria de validación: **web** (`npm run web`). Android es el target de release.
- Entry: `index.ts` → `App.tsx`.

## Comandos

```bash
npm start              # Expo dev server
npm run web            # validación primaria (web-first)
npm run clases:generate# content/clases/*.md + content/repaso.md -> src/data/classNotes.generated.ts
npm run android        # dev build nativo Android
npm run android:release# APK release local (firma propia, no la de GitHub)
npm run ios            # iOS
npx tsc --noEmit       # typecheck (NO hay ESLint ni tests configurados hoy)
```

No hay linter ni test runner en el repo. El único gate automático es `tsc`.
**Antes de dar por terminado un cambio corré `npx tsc --noEmit`.**

## Arquitectura

```
App.tsx                 Fonts (Zen) + providers + NavigationContainer + ajustes web
index.ts                registerRootComponent
content/                FUENTE editable de los apuntes (markdown, no se bundlea directo)
  clases/kurasu-NN.md   transcripción de cada clase real (1-6, 8-16; la 7 no existió)
  repaso.md             hoja de repaso consolidada — se mantiene al día clase a clase
src/
  navigation/           RootNavigator: bottom tabs + stacks
  theme/                theme.ts (tokens light/dark) + AppThemeProvider
  settings/             AppSettingsProvider (persistencia local con expo-file-system)
  screens/              1 archivo por pantalla
  components/
    ui/                 primitives reutilizables (ScreenBackground, GlassCard, AppText, ...)
    practice/           cards de selección de grupos/modos
    game/               UI del loop de práctica (DrawingCanvas, FeedbackBanner, ...)
    study/              ClassBlockView: renderer de los bloques de apuntes
  features/
    game/               *Engine.ts (lógica PURA) + use*Game.ts (hooks con estado/timers/haptics)
    classes/            classNotes.ts: helpers puros sobre los apuntes (fecha, orden, búsqueda)
    progress/           ProgressProvider (progress.json) + useTrackProgress + progressStore.
                        Incluye racha diaria + meta (daily) — StreakCard en Home.
    srs/                SrsProvider (srs.json) + srsStore: repaso espaciado Leitner
                        autocontenido (deck = kana + vocab). Pantalla: ReviewScreen (flashcards).
    notifications/      reminders.ts: recordatorio diario local (expo-notifications, solo nativo).
    speech/             speak.ts (TTS con expo-speech; SpeakButton en components/ui). El
                        modo voz de Kyary (STT continuo + Gemini + TTS) usa expo-speech-recognition
                        (Web Speech API en web, reconocedor nativo en Android; free, sin costo).
    update/             releaseClient.ts (GitHub Releases) + androidUpdater.ts (instalar APK)
  services/             kyary.ts (cliente Gemini)
  data/                 datasets: kana, kanji, vocabulario, frases, números, strokes
  types/                tipos compartidos (navigation, game, hiragana, kanji)
```

### Navegación (`src/navigation/RootNavigator.tsx`)

4 tabs, sin header nativo (`headerShown: false`), animación `fade`:

- **練 Practicar** (`PracticeTab`) → stack: Home, KanaGroups, KanaGame, KanjiHub, KanjiLearn,
  KanjiPractice, KanjiDraw, KanjiGame, **EmojiGame** (matcheo palabra↔emoji), **TimesGame**
  (leer/escribir horarios 〜時〜分).
- **学 Estudiar** (`StudyTab`) → stack: StudyTopics, StudyTopic, **ClassNotes** (Mis clases),
  **ClassNote** (apunte de una clase), **QuickReview** (Repaso rápido). Los apuntes y el repaso
  se generan desde `content/*.md` con `npm run clases:generate` → `src/data/classNotes.generated.ts`
  (nunca editar el generado). Ver skill `kanami-clases`.
- **話 Kyary** (`KyaryTab`) → chat con IA.
- **私 Perfil** (`ProfileTab`) → `ProfileScreen` = `OptionsScreen`, que hoy muestra la
  `ProgressCard` (progreso persistente + export/import) además de tema/haptics/updater.
  Cruzar de tab con `navigation.getParent()`.

### Kana mixto y progreso

- `KanaScript` incluye `'mixed'` (hiragana+katakana en simultáneo). La facade `src/data/kana.ts`
  y `wordVocabulary`/`phrases` concatenan ambos silabarios cuando `script === 'mixed'`. En modo
  mixto los ids de caracteres colisionan entre scripts (あ/ア = `a-a`): los engines de opción
  múltiple deduplican opciones por texto mostrado para que eso no rompa el matcheo.
- Progreso: `src/features/progress/` (`ProgressProvider` → `progress.json`, patrón de
  `AppSettingsProvider`). Las vistas de juego llaman `useTrackProgress(modeKey, stats)` y la
  sesión se registra al desmontar. Export/import sin deps nuevas: `Share` del core (Android) /
  clipboard (web) y pegado de JSON para importar.

### Regla de arquitectura (respetar)

- Lógica pura y testeable → `src/features/game/*Engine.ts`.
- Lógica con React / timers / refs / haptics → hooks `use*Game.ts`.
- **Los engines no importan React.** Los hooks orquestan al engine + efectos.
- Patrón visual que aparece 2+ veces → `src/components/ui/` o el subdominio correcto.
- Reutilizá `ScreenBackground`, `GlassCard`, `PrimaryButton`, `AppText`, `StatPill` antes de
  inventar variantes.
- No hardcodear colores/spacing/typography: usá tokens de `src/theme/theme.ts`.

### Efectos y estado (patrón importante)

- Los **updaters de `setState` deben ser puros**. NO dispares haptics, `setTimeout` ni otros
  `setX` dentro del callback de `setState` (rompe bajo StrictMode y es frágil). Hacé el efecto
  en un `useEffect` keyed por el estado. Referencia buena: `useDrawingGame` / `useWritingHiraganaGame`.
- Todo timer/interval debe limpiarse en reset y en unmount (ya se cumple en los hooks actuales).

## Sistema visual (fuente de verdad: `src/theme/theme.ts`)

- Paleta **"tinta y bermellón"**. **Light es el default** (papel); dark es "sumi".
  - Light: bg `#F7F4EF`, texto `#1C1A17`, accent `#C73E2E`.
  - Dark: bg `#1B1A17`, texto `#F0EDE6`, accent `#D4553F`.
- Fuentes **Zen** (se cargan en `App.tsx`):
  - `ZenOldMincho` → display / headline / kana (serif, acentos).
  - `ZenKakuGothicNew` → cuerpo, labels, botones, opciones.
- Esquinas casi rectas (`radii.sm=4`), sin glass/blur/glow (ese lenguaje fue removido).
- **Regla dark-mode:** al pintar un color de estado, leélo de `useAppTheme().theme.colors`,
  nunca del `theme` estático importado (ese es siempre light y rompe el dark mode).
- El toggle de tema vive en Perfil/Opciones y persiste en `AppSettingsProvider`.

## Contenido y práctica

- Cada silabario se divide en `base`, `alternatives` y `combos`. Cada grupo define `title`,
  `accentColor`, `romajiPreview`, `kanaPreview` y su set.
- `src/data/kana.ts` es el **selector/facade** sobre hiragana + katakana + vocabulario; no es
  redundante con `hiragana.ts`/`katakana.ts`.
- Datos de strokes: `hiraganaStrokes.ts` sirve hiragana, katakana **y** kanji vía `getStrokeGuide`
  (nombre engañoso), apoyado en los `*Strokes.generated.ts` (generados por `scripts/generate-kana-strokes.mjs`).
- Normalización de input: escritura → trim + lowercase + sin espacios; traducciones → además sin acentos.

## Kyary (IA) — `src/services/kyary.ts`

- Cliente de **Gemini `gemini-2.5-flash`** con soporte multimodal (texto/imagen/audio como `inline_data`).
- **API key = BYOK (bring your own key).** `sendKyaryMessage(history, userApiKey)` usa la key que el
  usuario carga en **Perfil** (persistida en `AppSettingsProvider.geminiApiKey`, solo en el dispositivo).
  Fallback a `EXPO_PUBLIC_GEMINI_API_KEY` solo para dev local (`.env`, en `.gitignore`). **El APK de
  release NO trae key embebida** (CI no tiene el secret, a propósito): cada usuario pone la suya. Si no
  hay ninguna, Kyary tira un error claro pidiendo cargarla.
- Modo voz (conversación hablada) en `KyaryScreen`: STT continuo (expo-speech-recognition) → Gemini → TTS.
- Al trabajar sobre Kyary o cualquier cosa LLM, leé la skill **`claude-api`** antes de tocar código.

## Releases y updater in-app

- Se publican por **tag Git `vX.Y.Z`** → GitHub Actions (`.github/workflows/android-release.yml`)
  ajusta versión, genera Android nativo y compila APK release `arm64-v8a` adjunta a la Release.
- `versionCode` = `major*10000 + minor*100 + patch`. No cambiar la fórmula sin razón fuerte.
- El updater in-app (`src/features/update/`) consulta la última Release de `mattcastells/kanami`,
  descarga e instala la APK. **Solo Android.** La Release debe traer APK adjunta o falla.
- **Firma:** todas las APKs deben estar firmadas con la MISMA key o Android no actualiza encima.
- `/android` e `/ios` son **generados** (no están en el repo): no son fuente de verdad.
- Fuentes de release a tocar: `app.json`, `scripts/set-release-version.mjs`,
  `scripts/configure-android-release.mjs`, el workflow. Doc extendida: `docs/release-and-versioning.md`.

## Convenciones

- Idioma de UI: español rioplatense, directo y corto. Labels de acción en MAYÚSCULAS.
- No dejar `console.*` ni imports/estilos sin usar.
- Web-first: validá en `npm run web`; no corras builds nativos salvo pedido explícito.

## Skills del proyecto (`.claude/skills/`)

Específicas de este repo. Empezá por `kanami-arquitectura` si no sabés dónde va algo.

- **`kanami-arquitectura`** — mapa del proyecto, capas e invariantes. Contexto base.
- **`kanami-modo-practica`** — agregar/modificar un modo de juego (engine + hook + pantalla).
- **`kanami-ui`** — paleta, tokens, primitives, dark mode.
- **`kanami-contenido`** — datasets de japonés y temas de Estudiar.
- **`kanami-clases`** — apuntes de clase y hoja de repaso (`content/*.md` → dataset generado).
- **`kanami-persistencia`** — providers, stores, normalize, versionado.
- **`kanami-kyary`** — Gemini/BYOK, modo voz, integraciones externas.
- **`kanami-validar`** — checklist de cierre. **Usala siempre antes de dar algo por terminado.**
- **`kanami-revisar`** — revisión de diff con los anti-patrones reales del repo.
- **`kanami-release`** — tags, versionCode, CI, updater.
- **`clase-a-notion`** / **`apuntes-notion-estilo`** — workflow de apuntes de clase en Notion.

Documentación de apoyo: `.claude/docs/arquitectura.md` y `.claude/docs/estado-y-deuda.md`.

Skills genéricas útiles: `/run`, `/code-review`, `/simplify`, y **`claude-api`**
(obligatoria antes de tocar Kyary / LLM).

## Deuda técnica conocida

Lista completa y priorizada en **`.claude/docs/estado-y-deuda.md`** (auditada el 2026-08-08).
Los ítems más relevantes al escribir código:

- **Colores de estado hardcodeados** (`#3E7D5C`/`#B03A2E`/`#356E8E`) en 9 archivos: rompen el
  dark mode. Usá `activeTheme.colors.success/.error/.accent`. No sumes uno más.
- **`GameScreen.tsx` tiene 1825 líneas** y multiplexa 6 modos de kana. Es legacy: los modos
  nuevos van a pantalla propia.
- `shuffle`/`pickRandom` duplicados 20 veces.
- `app.json`: `package: com.anonymous.Kanami` es el default anónimo (cambiar antes de una
  distribución real).
- El **código muerto ya fue eliminado** (2026-08-08): modo Números, `accentColor` de los
  grupos de kana, exports huérfanos, props no-op de `GlassCard` y `guidelines.md`.
</content>
