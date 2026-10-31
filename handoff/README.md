# Kanami → 版画 Hanga · Handoff para Claude Code

Este paquete trae todo lo necesario para migrar la app al rediseño **Hanga** (grabado ukiyo-e pop) en una sola pasada.
Dirección elegida por el usuario: **A · Hanga**. La B (Shuin) queda descartada; ignorala.

## Qué hay acá

```
handoff/
├── README.md                      ← este archivo: reglas, orden y checklist
├── PROMPT.md                      ← el prompt para pegar al abrir la sesión de Claude Code
├── SPEC-componentes.md            ← cada primitive con medidas, colores y estados exactos
├── SPEC-pantallas.md              ← cada pantalla, de arriba a abajo, con medidas
├── CLAUDE-sistema-visual.md       ← texto que reemplaza la sección "Sistema visual" de CLAUDE.md
├── skills/kanami-ui/SKILL.md      ← reemplazo de .claude/skills/kanami-ui/SKILL.md
├── src/                           ← código listo para copiar (mismas rutas que el repo)
│   ├── theme/theme.ts             ← REEMPLAZA src/theme/theme.ts
│   └── components/ui/
│       ├── InkPressable.tsx       ← base de todo lo tocable (contorno + sombra dura + hundido)
│       ├── InkSwitch.tsx          ← reemplaza al Switch nativo
│       ├── InkBits.tsx            ← GradeMark (○/×), ProgressTrack, SectionStep, Segmented, Marker
│       ├── Seigaiha.tsx           ← patrón de olas del hero (react-native-svg)
│       └── Tanzaku.tsx            ← etiqueta vertical amarilla (練習 / 合格)
└── referencia/
    ├── light-NN-*.png / dark-NN-*.png   ← 12 pantallas × 2 modos, @2x (720×1560 = 360×780 dp)
    └── Kanami A - Hanga.dc.html         ← el mock vivo (abrir en navegador junto a support.js)
```

**Fuente de verdad visual = los PNG de `referencia/` + los SPEC.** Si un PNG y un SPEC no coinciden, gana el SPEC (tiene los números).
El mock HTML sirve para inspeccionar valores con DevTools: cada pantalla tiene `data-screen-label="NN …"` y los tokens están en `[data-theme="light|dark"]`.

## Reglas que no se negocian

1. **Paleta única.** Se borran `theme.tints`, `TintName` y `opacity.watermark*`. Ningún juego tiene color propio. Todas las cards de la grilla son iguales.
2. **Todo lo tocable** = contorno 2px `colors.line` + sombra dura (`surfaces.card` = `3px 3px 0 shadow`). Al presionar: `surfaces.press` (translate 2,2 + sombra 1px). Usá `InkPressable`; no armes la sombra a mano.
3. **Lo elegido** = fondo `colors.highlight` (amarillo) + texto `onHighlight` + hundido (`press`). Nunca `primary` para "elegido".
4. **La acción principal** = `primary` (ruri). Una por pantalla.
5. **`accent` (bermellón) es decorativo**: sol del hero, círculo del resumen, círculo de conteo del Repaso, insignias de número de trazo. Para texto chico de ese tono: `accentInk` (eyebrows).
6. **Corrección con ○ / ×** (`GradeMark`), no con íconos check/close.
7. **Todo carácter japonés que se lee, escribe o dibuja va en `FONTS.glyph` (Klee One)**. Los glifos decorativos/de navegación (tile, tab, 音/訓, 合格) van en `FONTS.display` (Dela Gothic One). La UI en Zen Maru Gothic.
8. **Texto de color < 18px → variante `*Ink`** (`successInk`, `errorInk`, `accentInk`). Los tonos base solo para bordes, rellenos y texto grande.
9. **Colores siempre de `useAppTheme().theme`**, nunca del `theme` estático (regla dark-mode vigente).
10. **Los textos de los mocks no son definitivos.** El usuario va a recortar copy. Regla: conservá el copy actual del código salvo donde el SPEC marca **[NUEVO]**; ante la duda, más corto.
11. **Durante una partida se oculta la tab bar** (pantallas de juego, `KanjiDraw`, `KanaBoardGame`, resumen). Ver SPEC-pantallas §0.
12. Se mantienen todas las reglas de producto de `CLAUDE.md` (sin racha, sin subtítulos en la grilla, grilla pareja de 2, todo preseleccionado, audio recién después de responder, etc.).

## Orden de trabajo (un commit por paso, `npx tsc --noEmit` + `npm run web` en cada uno)

| # | Paso | Archivos |
|---|---|---|
| 1 | Fuentes | `package.json`, `App.tsx` (ver abajo) |
| 2 | Tokens | copiar `handoff/src/theme/theme.ts` → `src/theme/theme.ts`; arreglar lo que marque `tsc` (sobre todo `tints`, `FONTS.illustration`, `opacity.watermark*`) |
| 3 | Primitives nuevas | copiar `handoff/src/components/ui/*` → `src/components/ui/` |
| 4 | Primitives existentes | `AppText`, `ScreenBackground`, `GlassCard`, `PrimaryButton`, `ScreenHeader`, `StatPill`, `SpeakButton` (SPEC-componentes §2) |
| 5 | Selección | `ModeTile`, `SelectChip`, `CheckRow`, `StartBar`, `ReadingDrillSetup` (§3) |
| 6 | Juego | `AnswerOptionButton`, `FeedbackBanner`, `DrawingCanvas`, `DrawingPractice`, `HintToggle`, `SessionSummary`, `ReadingDrillPlay` (§4) |
| 7 | Navegación | `RootNavigator.tsx` (tab bar + ocultarla en partida) |
| 8 | Pantallas | en el orden de SPEC-pantallas (01 → 12, después las que no tienen mock) |
| 9 | Limpieza | grep de restos (abajo), borrar `GradientFill` si quedó huérfano, docs |
| 10 | Cierre | skills `kanami-validar` + `kanami-revisar`; actualizar `CLAUDE.md` y `.claude/skills/kanami-ui/` con los archivos de este paquete |

### Paso 1 · Fuentes
```bash
npx expo install @expo-google-fonts/dela-gothic-one @expo-google-fonts/zen-maru-gothic @expo-google-fonts/klee-one
npm uninstall @expo-google-fonts/zen-kaku-gothic-new @expo-google-fonts/zen-old-mincho
```
`App.tsx`:
```tsx
import { DelaGothicOne_400Regular } from '@expo-google-fonts/dela-gothic-one/400Regular';
import { ZenMaruGothic_400Regular } from '@expo-google-fonts/zen-maru-gothic/400Regular';
import { ZenMaruGothic_500Medium } from '@expo-google-fonts/zen-maru-gothic/500Medium';
import { ZenMaruGothic_700Bold } from '@expo-google-fonts/zen-maru-gothic/700Bold';
import { ZenMaruGothic_900Black } from '@expo-google-fonts/zen-maru-gothic/900Black';
import { KleeOne_400Regular } from '@expo-google-fonts/klee-one/400Regular';
import { KleeOne_600SemiBold } from '@expo-google-fonts/klee-one/600SemiBold';

const [fontsLoaded] = useFonts({
  DelaGothicOne_400Regular,
  ZenMaruGothic_400Regular, ZenMaruGothic_500Medium, ZenMaruGothic_700Bold, ZenMaruGothic_900Black,
  KleeOne_400Regular, KleeOne_600SemiBold,
});
```
(Si los subpaths `/400Regular` no existen en la versión instalada, importar desde la raíz del paquete.)
En `AppShell`, `navigationTheme.colors.primary` = `theme.colors.primary`, `notification` = `theme.colors.accent`.

### Paso 9 · Restos a buscar
```bash
grep -rnE "tints|TintName|watermark|FONTS\.illustration|ZenKaku|ZenOldMincho|GradientFill|check-circle-outline|close-circle-outline|brandRaised" src
```
`brand`/`brandRaised`/`onBrand` siguen existiendo como alias, pero no deberían quedar usos al final.

## Notas de React Native (lo que en el mock es CSS)

| Mock (CSS) | En RN |
|---|---|
| `box-shadow: 3px 3px 0 #1C1713` | `boxShadow` string (RN 0.76+, el repo ya lo usa) — está en `surfaces.*` |
| hover (web) | no aplica; solo `pressed` |
| `writing-mode: vertical-rl` | `Tanzaku` (un `Text` por carácter) |
| seigaiha con `radial-gradient` | `Seigaiha` (react-native-svg) |
| `text-shadow: 3px 3px 0` del título del hero | `textShadowColor: colors.shadow, textShadowOffset: {width:3,height:3}, textShadowRadius: 0` (en web RN, si `textShadowRadius: 0` no pinta, usar `0.01`) |
| marcador `linear-gradient(transparent 55%, …)` | `Marker` de `InkBits` |
| `aspect-ratio: 1` del lienzo | `aspectRatio: 1` |
| `border: 2px dashed` | `borderStyle: 'dashed'` (en Android solo funciona con `borderRadius` 0 o con un `View` por línea; las guías del lienzo son `View` de 2px de ancho con `borderStyle:'dashed'` en un solo lado — si no se ve, dibujarlas con `react-native-svg` `Line strokeDasharray="6 6"`) |
