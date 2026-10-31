---
name: kanami-ui
description: Construir o modificar UI en Kanami respetando el sistema "Japón moderno" (índigo + sakura), los tokens del theme, los primitives existentes y el dark mode. Usala para cualquier cambio visual, pantalla nueva, componente nuevo o ajuste de estilos.
---

# UI y sistema visual

## Cuándo usar esta skill

- Cualquier cambio que se vea: pantalla nueva, card, botón, spacing, tipografía.
- "Se ve mal en dark mode."
- Vas a crear un componente en `src/components/`.

**No sigas `guidelines.md`.** Es legacy y describe un diseño dark/glass/cyan con fuentes
Sora/Manrope que ya no existe. La fuente de verdad es `src/theme/theme.ts` + esta skill.

## Contexto a leer primero

1. `src/theme/theme.ts` — todos los tokens
2. Un ejemplo bien hecho: `src/screens/AntonymGameScreen.tsx` (pantalla) o
   `src/components/game/FeedbackBanner.tsx` (componente con colores de estado)

## La paleta — "Japón moderno" (desde 2026-10-27)

Reemplazó a "tinta y bermellón". El tema por defecto sigue al teléfono (`'system'`).

| Token | Light | Dark | Para qué |
|---|---|---|---|
| `background` | `#F4F5FA` | `#0E1322` | fondo de pantalla |
| `card` / `backgroundSecondary` | `#FFFFFF` | `#171E33` | superficies |
| `backgroundTertiary` | `#EAECF5` | `#0A0E1A` | opción apagada (muted) |
| `textPrimary` | `#151B30` | `#ECEEF7` | |
| `textSecondary` / `textMuted` | `#535B77` / `#868CA6` | `#A8AFC9` / `#7B829E` | |
| `brand` (+ `brandRaised`, `onBrand`) | `#1E2A4A` | `#26335E` | índigo: cabecera, chip elegido |
| `accent` (+ `onAccent`) | `#CF3866` (texto blanco) | `#F28FA8` (texto oscuro) | sakura: la acción principal |
| `success` / `error` / `warning` | `#1F9D74` / `#D93F55` / `#C77D12` | `#4FCB9E` / `#F26B7F` / `#F2B04A` | |

- **`theme.tints`**: un color tradicional por juego (`ai`, `sakura`, `matcha`, `kohaku`,
  `fuji`, `sora`, `beni`, `cha`). Va en el glifo y en fondos a `opacity.tintSoft`; nunca de
  fondo pleno. `ModeTile` acepta `tint`.
- **`theme.surfaces.card` / `.raised`**: spreadealas en el `style` de una card. En claro son
  sombra (`boxShadow`) sin borde; en oscuro borde fino sin sombra. No pongas
  `borderWidth: 1` + `colors.line` a mano para una card.
- Texto sobre un color pleno: `onBrand` / `onAccent`, nunca `'#FFF'` (en oscuro el sakura
  es claro y el texto va oscuro).

## La regla que más se rompe

```ts
// ✅ colores → SIEMPRE del theme activo
const { theme: activeTheme, mode } = useAppTheme();
<View style={{ backgroundColor: activeTheme.colors.backgroundSecondary }} />

// ✅ spacing / radii / typography → del theme estático importado (no dependen del modo)
import { theme } from '../theme/theme';
const styles = StyleSheet.create({ card: { padding: theme.spacing.lg } });

// ❌ un color del theme estático → siempre light → dark mode roto
import { theme } from '../theme/theme';
<View style={{ backgroundColor: theme.colors.card }} />

// ❌ un hex suelto
const SUCCESS_COLOR = '#3E7D5C';
```

El último caso llegó a estar en 9 archivos (deuda D2, ya limpiada). **Que no vuelva**: usá
`activeTheme.colors.success` / `.error` / `.accent`.

Para transparencias hay helper: `hexToRgba(color, alpha)` desde `theme.ts`.

## Tokens

- **spacing**: `xxs:4 · xs:8 · sm:12 · md:16 · lg:20 · xl:24 · xxl:32 · xxxl:40`
- **radii**: `sm:8 · md:14 · lg:20 · xl:28 · pill:999` — controles en md, cards en lg,
  la cabecera de Practicar en xl. No pongas `borderRadius` a mano.
- **typography** (vía `<AppText variant="...">`):
  `overline · label · bodySmall · body · bodyStrong · title · headline · display · kana · option`
  - Todo es `ZenKakuGothicNew`; `headline`/`display` en peso Black (900). Si tenés que
    nombrar una fuente, usá las constantes `FONTS` de `theme.ts`.
  - `ZenOldMincho` (`FONTS.illustration`) **solo** para kanji-ilustración (marcas de agua):
    decora, no se lee.

**Nunca pongas `fontFamily` o `fontSize` a mano si hay un variant que sirve.** Si necesitás
ajustar el tamaño de un variant, pasá `style={{ fontSize: ... }}` sobre `AppText`
(patrón usado en `AntonymGameScreen.tsx`: `<AppText variant="kana" style={styles.prompt}>`).

## Primitives — reusá antes de crear

| Componente | Para qué | Notas |
|---|---|---|
| `ScreenBackground` | Contenedor raíz de **toda** pantalla | Resuelve safe-area, back button automático y scroll. `scrollable={false}` si no scrollea; `showBack={false}` en raíces de tab; `bottomOverlay` para CTAs fijos |
| `ScreenHeader` | Título de pantalla | Alineado a la izquierda: `eyebrow` (overline sakura) + `title` (Black) + `subtitle`; `actionLabel`/`onActionPress` a la derecha |
| `GlassCard` | Card estándar | El nombre es legacy: hoy es `surfaces.card` + fondo `card`, radio lg |
| `GradientFill` | Degradé de fondo | SVG (react-native-svg, sin deps nuevas); primer hijo de un contenedor con `overflow: 'hidden'` |
| `AppText` | **Todo** texto | Nunca uses `<Text>` de RN directo salvo que necesites `adjustsFontSizeToFit` |
| `PrimaryButton` | Botones | `variant`: `primary`/`accent`/`secondary`/`ghost`; `size`: `default`/`compact`. El título va en MAYÚSCULAS |
| `StatPill` | Métrica compacta | `label` + `value` + `accentColor` |
| `SpeakButton` | TTS de texto japonés | Poné uno donde haya japonés que se pueda escuchar. **Si lee lo que se pregunta, aparece recién después de responder**: el audio no puede dar la respuesta |
| `AnimatedCollapsible` | Secciones plegables | |
| `AnswerOptionButton` | Opción de respuesta | `visualState`: `idle`/`correct`/`incorrect`/`muted`; `fullWidth` para opciones largas |
| `FeedbackBanner` | Corrección tras responder | Ya lee los colores del theme correctamente |
| `SessionSummary` | Resumen al terminar sesión | |

## Convenciones

- **Idioma:** español rioplatense (vos/tenés/podés), directo y corto. Labels de acción en
  MAYÚSCULAS (`EMPEZAR`, `REPETIR`).
- Los `StyleSheet.create` van **al final del archivo**.
- Estilos dependientes del theme van inline en el array de `style`, no en el `StyleSheet`.
- Nada de `console.*`, imports sin usar ni estilos huérfanos.
- Animaciones: `Animated` de RN con `useNativeDriver: true` cuando se pueda, duraciones cortas
  (120-260ms), `Easing.out(Easing.cubic)`. Ver `AnimatedRow` (entrada escalonada), usado por `PracticeScreen`.

## Errores a evitar

- Agregar `paddingBottom` con el inset inferior en una pantalla: `ScreenBackground` lo omite a
  propósito (el tab bar es el dueño del borde inferior). Ver el comentario en
  `ScreenBackground.tsx:41-44` antes de "arreglarlo".
- Borrar `minHeight: 0` de `ScreenBackground.tsx:133`: es lo que permite que el chat de Kyary
  scrollee.
- Reintroducir blur/glass/glow. Ese lenguaje visual fue removido a propósito (el degradé de la
  cabecera de Practicar es la única excepción, y es plano).
- Volver a centrar títulos o a usar mincho para texto que se lee.
- Poner un slot de feedback sin `minHeight`: la UI salta cuando aparece el banner.

## Cómo validar

1. `npx tsc --noEmit`
2. `npm run web` y mirá el cambio.
3. **Probá los dos temas** (Perfil → tema). El 90% de los bugs visuales de este repo son
   colores hardcodeados que solo se ven en dark.
4. Ventana angosta: el contenido no debe scrollear horizontal (`ScreenBackground` fuerza
   `overflow: hidden`, pero un `width` fijo lo rompe igual).
