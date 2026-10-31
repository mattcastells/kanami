## Sistema visual (fuente de verdad: `src/theme/theme.ts`)

Rediseño **"版画 Hanga"** (grabado ukiyo-e pop; reemplazó a "Japón moderno"). Referencia visual:
`handoff/referencia/*.png` (12 pantallas × claro/oscuro) y `handoff/SPEC-*.md` (medidas exactas).

- **Paleta única** — no hay color por juego (`tints`/`TintName` se borraron; no los vuelvas a agregar).
  - `primary` 藍 ruri: la acción principal (una por pantalla).
  - `highlight` 黄蘗 kihada: lo elegido/activo (tile, chip, tab, celda actual). Nunca `primary` para "elegido".
  - `accent` 朱 shu: SOLO decoración (sol del hero, círculo del resumen y del Repaso, insignias de trazo). Texto de ese tono → `accentInk`.
  - Light: bg `#F4ECDD` washi, card `#FFFAF0`, tinta `#1C1713`, primary `#2340D3`, highlight `#FFC62B`, accent `#FF5B1F`.
  - Dark ("sumi-ai"): bg `#10121B`, card `#1A1D2A`, texto/contorno crema `#F5EBD7`/`#E9DFCB`, primary `#7C94FF` (lleva texto oscuro), highlight `#FFD54D`.
  - Texto de color < 18px siempre en la variante `*Ink` (`successInk`, `errorInk`, `accentInk`).
- **Superficies**: todo lo tocable = contorno 2px `colors.line` + sombra dura sin blur (`surfaces.card` 3px, `surfaces.raised` 4px). Presionado/elegido = `surfaces.press` (se hunde 2px, sombra 1px). Usá `InkPressable`; no armes sombras a mano. Contenedores sin acción: `surfaces.outlined`. Lo no elegido: `surfaces.quiet` (borde `hair`).
- **Tipografía**: `FONTS.display` Dela Gothic One (títulos, glifos de tile/tab, números grandes) · Zen Maru Gothic (UI; 900 para botones/eyebrows) · `FONTS.glyph` Klee One (TODO carácter japonés que se lee, escribe o dibuja: forma de libro de texto).
- **Corrección**: ○ / × (`GradeMark`), no íconos check/close.
- **Formas**: `radii` — badge 8–10, controles/botones 12, tiles/opciones 14, cards 16, hero/prompt 18, pill.
- **Medidas** de control en `SIZES` (botón 52, tile 54/92, opción 66, input 60, back 40…). No uses números sueltos.
- `ScreenHeader`: eyebrow `<kanji> · SECCIÓN` en `accentInk` + título Dela (26 con back, 28 en raíz de pestaña).
- **Tab bar**: borde superior 2px `line`; activa = pastilla `highlight` con contorno. **Se oculta durante una partida.**
- Primitives Hanga: `InkPressable`, `InkSwitch` (reemplaza `Switch`), `InkBits` (`GradeMark`, `ProgressTrack`, `SectionStep`, `Segmented`, `Marker`), `Seigaiha` (olas del hero), `Tanzaku` (etiqueta vertical 練習/合格).
- **Regla dark-mode:** colores siempre de `useAppTheme().theme.colors`, nunca del `theme` estático.
- **Tema**: `themeMode` `'system' | 'light' | 'dark'`, default `'system'`.
