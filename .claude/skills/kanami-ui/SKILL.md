---
name: kanami-ui
description: Paleta, tokens, primitives y dark mode del sistema visual 版画 Hanga de Kanami. Usala antes de tocar cualquier estilo, pantalla o componente visual.
---

# kanami-ui · 版画 Hanga

Fuente de verdad: `src/theme/theme.ts`. Referencia: `handoff/referencia/*.png` + `handoff/SPEC-componentes.md` + `handoff/SPEC-pantallas.md`.

## Antes de escribir estilos
1. ¿Existe la primitive? `InkPressable`, `InkCard`/`GlassCard`, `PrimaryButton`, `ScreenHeader`, `GameHeader`, `InkSwitch`, `GradeMark`, `ProgressTrack`, `SectionStep`, `Segmented`, `Marker`, `Tanzaku`, `Seigaiha`, `ModeTile`, `SelectChip`, `CheckRow`, `StartBar`, `AnswerOptionButton`, `FeedbackBanner`, `StatPill`, `SpeakButton`. Usala.
2. Colores de `useAppTheme().theme.colors`. Medidas de `SIZES`, radios de `radii`, tipos de `typography`/`FONTS`.
3. Nada de hex, px de control ni familias de fuente sueltas en pantallas.

## Decisiones rápidas
| Necesito… | Uso |
|---|---|
| algo tocable con borde | `InkPressable` (`elevation` card/raised/flat) |
| marcar lo elegido | fondo `highlight` + `onHighlight` + `sunken` |
| la acción principal | `PrimaryButton variant="primary"` |
| acción secundaria | `secondary` (con contorno) · `ghost` (subrayado) |
| marcar acierto/error | `GradeMark` + `success*`/`error*` (`*Soft` fondo, `*Ink` texto) |
| un carácter japonés para leer | `FONTS.glyph` (Klee One) |
| título / glifo decorativo / número grande | `FONTS.display` (Dela Gothic One) |
| texto vertical | `Tanzaku` (RN no tiene writingMode) |
| texto chico en bermellón | `accentInk`, nunca `accent` |

## Prohibido
- Volver a un color por juego (`tints`).
- Sombras con blur en elementos tocables (la sombra de Hanga es dura: `Npx Npx 0`).
- `primary` como color de "elegido".
- Íconos check/close para corrección (es ○ / ×).
- Leer colores del `theme` estático (rompe dark mode).
- Mostrar la tab bar durante una partida.

## Dark mode
Mismas claves. El contorno pasa a crema (`#E9DFCB`), la sombra a `#000`, `primary` a `#7C94FF` con `onPrimary` oscuro. Validar SIEMPRE las dos pantallas (claro y oscuro) contra `handoff/referencia/light-*` y `dark-*`.
