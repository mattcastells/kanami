# CHANGES — pasos para aplicar el rediseño en el repo

Repo: https://github.com/mattcastells/hanami
Mockups de referencia: `Hanami Rediseño.dc.html` (1d–1j, 2a–2b) · Detalle por fases: `HANDOFF.md`

Instrucción sugerida para Claude Code, parado en la raíz del repo con esta carpeta `handoff/` al lado:
"Aplicá el rediseño descripto en handoff/CHANGES.md paso a paso, verificando en web (npm run web) después de cada paso."

## Paso 1 — Limpieza
```
rm -rf NossaClima kanji.md
```
- Borrar engines/hooks de modos eliminados: `speedReading`, `matchingPairs`, `demonstratives` (juego), `scriptConversion` en `src/features/game/`, sus vistas en `GameScreen.tsx`, sus cards en `HiraganaSelectionScreen.tsx` y sus tipos en `types/game.ts`.
- Borrar el modo `words` oculto (`wordsModeEnabled`).
- Fusionar `syllables` + `fill-blank` + `word-builder` bajo un modo "Vocabulario" con 3 variantes (mismo selector, un solo card con sub-opciones).

## Paso 2 — Fuentes y tema
```
npx expo install @expo-google-fonts/zen-old-mincho @expo-google-fonts/zen-kaku-gothic-new
```
- Reemplazar `src/theme/theme.ts` por `handoff/src/theme/theme.ts`.
- En `App.tsx`: cargar `ZenOldMincho_400Regular`, `ZenOldMincho_700Bold`, `ZenKakuGothicNew_400Regular`, `ZenKakuGothicNew_500Medium`, `ZenKakuGothicNew_700Bold`; quitar Sora y Manrope.
- `AppThemeProvider`: default `'light'`; el toggle pasa a Perfil.
- Renombrar usos de `accentBlue` → `accent` (grep global). Los demás acentos (accentCyan/Pink/Orange/Green) se eliminan: donde había color por grupo, usar `accent` o `textMuted`.

## Paso 3 — Quitar el lenguaje glass
- `ScreenBackground`: eliminar imagen de fondo, blur, scrim y gradiente → `backgroundColor: theme.colors.background` plano. Borrar `assets/background-*.jpg`, `light-theme-bg.jpg` y `BackgroundChoice`.
- `GlassCard`: sin BlurView ni glow → View con `borderWidth:1, borderColor: line, borderRadius: radii.md, backgroundColor: backgroundSecondary`.
- `PrimaryButton`: rectángulo `radii.sm`, fondo `accent`, texto `#F7F4EF`, sin sombra.
- `BottomNavBar`: se elimina (lo reemplaza el tab bar del Paso 4).
- Sombras/glow (`shadowColor` con acento): eliminar en toda la app.

## Paso 4 — Navegación por tabs
```
npx expo install @react-navigation/bottom-tabs
```
- Reemplazar `src/navigation/RootNavigator.tsx` por `handoff/src/navigation/RootNavigator.tsx`.
- Copiar `handoff/src/screens/StudyTopicsScreen.tsx`, `StudyTopicScreen.tsx` y `handoff/src/data/studyTopics.ts`.
- `types/navigation.ts`: agregar `StudyTopics: undefined` y `StudyTopic: { topicId: string }`; quitar rutas de Theory* y Options del stack raíz.
- `HomeScreen`: rediseñar según mockup 1d (saludo こんにちは + card "Repaso de hoy" + lista Hiragana/Katakana/Kanji/Vocabulario con filas separadas por hairline). Las pantallas Theory* viejas se borran una vez migrado su contenido a `studyTopics.ts` (el dataset ya cubre los 9 temas; los detalles finos están en `content/clases/*.md`).
- `KyaryScreen`: avatar nuevo (`assets/kyary-avatar-light.png` / `-dark.png`, copiar desde `handoff/assets/`), header según mockup 2b.

## Paso 5 — Motion (sí, la app tiene animaciones)
Sistema de movimiento — sobrio, corto, con propósito (ya hay `react-native-reanimated` instalado):
- **Transición de ronda** (juego): el kana entra con fade + translateY 10→0 + scale 0.975→1, 130 ms, easing `Easing.out(Easing.cubic)` — igual timing que hoy, se conserva.
- **Respuesta correcta**: el borde de la opción pasa a `success` y la tarjeta hace un "pulse" de escala 1→1.02→1 en 180 ms; respuesta incorrecta: shake horizontal ±4 px, 3 ciclos, 240 ms.
- **Barra de progreso** del juego: width animada con spring suave (damping 20).
- **Cambio de tab**: fade cruzado 150 ms (el default de fade del stack se mantiene).
- **Listas** (Estudiar, Home): entrada escalonada opcional — fade + translateY 8→0, 120 ms, stagger 30 ms por fila, solo en el primer mount.
- **Racha en Home**: el punto bermellón "respira" (opacity 0.45↔1, 2.4 s loop) — único loop permanente de la app.
- Regla general: nada elástico, nada > 250 ms, y el feedback nunca depende solo de la animación (color + texto siempre).

## Paso 6 — SRS (siguiente release)
Ver `HANDOFF.md` fases 4–5 (scheduler SM-2, Perfil con grilla por carácter, y Kyary voz detrás de un proxy para la API key — recordá sacar la key de `EXPO_PUBLIC_*`).

## Verificación
1. `npm run web` → recorrer los 4 tabs comparando contra los mockups.
2. Publicar tag `vX.Y.Z` y probar el updater in-app (el pipeline no se toca).
