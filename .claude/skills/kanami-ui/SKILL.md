---
name: kanami-ui
description: Construir o modificar UI en Kanami respetando la paleta "tinta y bermellón", los tokens del theme, los primitives existentes y el dark mode. Usala para cualquier cambio visual, pantalla nueva, componente nuevo o ajuste de estilos.
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
2. Un ejemplo bien hecho: `src/screens/TimesGameScreen.tsx` (pantalla) o
   `src/components/game/FeedbackBanner.tsx` (componente con colores de estado)

## La paleta

**"Tinta y bermellón". Light es el default** (papel); dark es "sumi".

| Token | Light | Dark |
|---|---|---|
| `background` | `#F7F4EF` | `#1B1A17` |
| `backgroundSecondary` | `#FFFFFF` | `#242220` |
| `textPrimary` | `#1C1A17` | `#F0EDE6` |
| `textSecondary` | `#6B655C` | `#B7B1A4` |
| `textMuted` | `#8A8378` | `#989285` |
| `accent` | `#C73E2E` | `#D4553F` |
| `success` | `#3E7D5C` | `#5AA47C` |
| `error` | `#B03A2E` | `#C96A57` |
| `line` / `lineStrong` | rgba tinta | rgba papel |

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

El último caso ya está en 9 archivos (deuda D2). **No sumes uno más**: usá
`activeTheme.colors.success` / `.error` / `.accent`.

Para transparencias hay helper: `hexToRgba(color, alpha)` desde `theme.ts`.

## Tokens

- **spacing**: `xxs:4 · xs:8 · sm:12 · md:16 · lg:20 · xl:24 · xxl:32 · xxxl:40`
- **radii**: `sm:4 · md:6 · lg:8 · xl:12 · pill:999` — esquinas casi rectas, es identidad.
  No pongas `borderRadius: 16` a mano.
- **typography** (vía `<AppText variant="...">`):
  `overline · label · bodySmall · body · bodyStrong · title · headline · display · kana · option`
  - `ZenOldMincho` (serif) → `headline`, `display`, `kana`
  - `ZenKakuGothicNew` → todo el resto

**Nunca pongas `fontFamily` o `fontSize` a mano si hay un variant que sirve.** Si necesitás
ajustar el tamaño de un variant, pasá `style={{ fontSize: ... }}` sobre `AppText`
(patrón usado en `TimesGameScreen.tsx:131-140`).

## Primitives — reusá antes de crear

| Componente | Para qué | Notas |
|---|---|---|
| `ScreenBackground` | Contenedor raíz de **toda** pantalla | Resuelve safe-area, back button automático y scroll. `scrollable={false}` si no scrollea; `showBack={false}` en raíces de tab; `bottomOverlay` para CTAs fijos |
| `ScreenHeader` | Título de pantalla | `eyebrow` (overline en accent) + `title` + `subtitle` + `actionLabel`/`onActionPress` |
| `GlassCard` | Card estándar | El nombre es legacy: hoy es plano (borde + fondo). `glowColor`/`intensity` son no-ops |
| `AppText` | **Todo** texto | Nunca uses `<Text>` de RN directo salvo que necesites `adjustsFontSizeToFit` |
| `PrimaryButton` | Botones | `variant`: `primary`/`accent`/`secondary`/`ghost`; `size`: `default`/`compact`. El título va en MAYÚSCULAS |
| `StatPill` | Métrica compacta | `label` + `value` + `accentColor` |
| `SpeakButton` | TTS de texto japonés | Poné uno donde haya japonés que se pueda escuchar |
| `AnimatedCollapsible` | Secciones plegables | |
| `AnswerOptionButton` | Opción de respuesta | `visualState`: `idle`/`correct`/`incorrect`/`muted`; `fullWidth` para opciones largas |
| `FeedbackBanner` | Corrección tras responder | Ya lee los colores del theme correctamente |
| `SessionSummary` | Resumen al terminar sesión | |

## Convenciones

- **Idioma:** español rioplatense (vos/tenés/podés), directo y corto. Labels de acción en
  MAYÚSCULAS (`PRACTICAR ESTE TEMA`, `REPETIR`).
- Los `StyleSheet.create` van **al final del archivo**.
- Estilos dependientes del theme van inline en el array de `style`, no en el `StyleSheet`.
- Nada de `console.*`, imports sin usar ni estilos huérfanos.
- Animaciones: `Animated` de RN con `useNativeDriver: true` cuando se pueda, duraciones cortas
  (120-260ms), `Easing.out(Easing.cubic)`. Ver `AnimatedRow` (entrada escalonada), usado por `PracticeScreen` y `StudyTopicsScreen`.

## Errores a evitar

- Agregar `paddingBottom` con el inset inferior en una pantalla: `ScreenBackground` lo omite a
  propósito (el tab bar es el dueño del borde inferior). Ver el comentario en
  `ScreenBackground.tsx:41-44` antes de "arreglarlo".
- Borrar `minHeight: 0` de `ScreenBackground.tsx:133`: es lo que permite que el chat de Kyary
  scrollee.
- Reintroducir blur/glass/glow. Ese lenguaje visual fue removido a propósito.
- Poner un slot de feedback sin `minHeight`: la UI salta cuando aparece el banner.

## Cómo validar

1. `npx tsc --noEmit`
2. `npm run web` y mirá el cambio.
3. **Probá los dos temas** (Perfil → tema). El 90% de los bugs visuales de este repo son
   colores hardcodeados que solo se ven en dark.
4. Ventana angosta: el contenido no debe scrollear horizontal (`ScreenBackground` fuerza
   `overflow: hidden`, pero un `width` fijo lo rompe igual).
