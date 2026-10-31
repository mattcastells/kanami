# SPEC · Pantallas (Hanga)

Cada sección = un PNG en `referencia/` (`light-NN-*.png` y `dark-NN-*.png`, 360×780 dp @2x).
Ancho útil = 360 − 2×18 = **324**. Orden = de arriba a abajo. **[NUEVO]** = copy o elemento que no existe hoy.

## 0 · Reglas globales de pantalla
- Fondo `background`. Padding H 18. Contenido scrolleable salvo partidas (layout fijo con `flex:1` spacer antes de las acciones).
- **Tab bar visible**: 01, 02 (y todas las selecciones), 10, 11, 12. **Oculta**: 03–09 (partida y resumen).
- `AnimatedRow` (entrada escalonada) se mantiene en listas y grillas. Nada de animaciones nuevas salvo el hundido al presionar y la transición del switch.

---

## 01 · 練 Practicar — `PracticeScreen`
1. **Hero** (`InkCard` sin padding, alto 156, radio 18, contorno, sombra 4, overflow hidden):
   - Fondo `waveA` + `<Seigaiha a={waveA} b={waveB} />` absoluto (medir ancho con `onLayout`).
   - Sol: círculo 128, fondo `accent`, contorno 2, absoluto right −28, top −34.
   - `Tanzaku "練習"` size 17, absoluto right 22, top 18.
   - Abajo-izquierda (left 16, bottom 14, columna gap 6, `alignItems:flex-start`):
     - Chip: fondo `card`, contorno, pill, padding 3×10, Zen Maru 900 10 tracking 1.5: `KANAMI · 8 JUEGOS` (número = `cards.length`).
     - `Practicar` en `typography.display` (Dela 38), color `onWave`, text-shadow duro 3,3 `shadow`.
   - Se borra: GradientFill, heroSun sakura, kanji-marca de agua, subtítulo "N juegos para entrenar…".
2. **Grilla** (mt 20, filas de a 2 con gap 12 — se mantiene el armado por filas con `AnimatedRow`):
   - Card: `InkPressable` alto 92, radio 14, fondo `card`, padding 11×12, `justifyContent:'space-between'`.
   - Badge 38×38, radio 10, contorno, fondo `highlight`, glifo `FONTS.display` 18 `onHighlight`.
   - Título `typography.tileTitle` (700 15). Sin `numberOfLines`.
   - Sin marca de agua, sin tint. Glifos y orden: 字 Kanas · 語 Vocabulario · 意 Significados · 反 Antónimos · 数 Números · 暦 Fechas y hora · 絵 Imágenes · 訳 Traducción.

## 02 · Kanas / selección — `HiraganaSelectionScreen` (y mismo patrón en todas las selecciones)
1. `ScreenHeader` con back: eyebrow `かな · PRACTICAR`, título = silabario (`Hiragana` / `Katakana` / `Mixto`).
2. `Segmented` de silabario (Hiragana · Katakana · Mixto), mb 18. **Reemplaza** a los chips/botones actuales de script.
3. `SectionStep 1 "QUÉ QUERÉS HACER"` + grilla de `ModeTile` (読 Lectura · 書 Escritura · 描 Dibujo · 盤 Tablero · 文 Frases).
4. Fila "Invertido" con `InkSwitch` (solo si el modo lo soporta; nota = `invertedNote(script)`).
5. `SectionStep 2 "CON QUÉ"` + presets `SelectChip` (Todo · Solo base · Sin combos — los actuales) mb 10 + `CheckRow` por sección (Base · Alternativas · Combos) con su preview kana, plegables con `AnimatedCollapsible` como hoy.
6. `StartBar`: resumen `"{n} caracteres · {modo}"` + `COMENZAR LECTURA` (cta actual del modo).
7. Tab bar visible (練 activa).

Aplicar el mismo esqueleto (header → Segmented si hay variantes → Paso 1 tiles → Paso 2 chips/rows → StartBar) a: `KanasScreen`, `VocabularyScreen`, `MeaningSetupScreen`, `NumbersSetupScreen`, `DateTimeSetupScreen` (`ReadingDrillSetup`), `KanjiGrindScreen`.

## 03 · Opción múltiple — `GameScreen` (reading), `EmojiGame`, `MeaningGame`, `AntonymGame`, choice de `ReadingDrillPlay`
1. `GameHeader` (cerrar + progreso + `7/20`) y fila meta (`LECTURA · HIRAGANA` / `○ 5 × 1`).
2. **Prompt**: `InkCard` raised, alto 220, radio 18, centrado, mb 18.
   - Ayuda arriba-izquierda (14,12): `¿Cómo se lee?` 700 12 `textSecondary` **[NUEVO, opcional — el usuario puede quitarlo]**.
   - Carácter `typography.kana` (Klee 124).
   - `SpeakButton round` abajo-derecha, solo tras responder.
3. Opciones: `AnswerOptionButton` 2×2.
4. Spacer `flex:1`.
5. Respondido: `FeedbackBanner` + `PrimaryButton` SIGUIENTE. Sin responder: texto `ELEGÍ UNA OPCIÓN` (labelSmall `textMuted`, alto 52, centrado) **[NUEVO, opcional]**.

## 04 · Escribir — `GameScreen` (writing / syllables / word-builder / phrases), `TranslationGame`, input de `ReadingDrillPlay`
1. `GameHeader` + eyebrow `ESCRITURA · PALABRAS`.
2. Prompt alto 200: ayuda `Escribí la lectura`, palabra `typography.word` (Klee 76), debajo `2 moras` (700 12 `textMuted`) **[NUEVO, opcional]**.
3. Campo de respuesta (SPEC-componentes §4).
4. Spacer. Banner. Fila: `SpeakButton square` + SIGUIENTE (flex 1), gap 10.
Traducción con piezas para ordenar: las piezas son chips `InkPressable` radio 10, padding 8×12, `FONTS.glyph` 18; la pieza ya usada queda `surfaces.quiet` + `textMuted`.

## 05 · Trazos — `KanjiDrawScreen`, drawing de `GameScreen`
1. `GameHeader` (sin fila de puntaje).
2. Fila (mb 12): izquierda eyebrow `DIBUJO · HIRAGANA` + `Dibujá さ` (Dela 24, el carácter en `FONTS.glyph`); derecha chip romaji (`highlight`, contorno, pill, padding 5×12, 900 13).
3. Lienzo + controles (SPEC-componentes §4).
4. Spacer + BORRAR / LISTO.

## 06 · Kanji Grind · tarjeta learn — `KanjiGrindGameScreen` (fase learn)
1. Header de partida: cerrar + bloque texto (eyebrow `漢字 · LOTE 2`, título `Kanji nuevo` Dela 20) + chip `1 DE 3` (`highlight`, contorno, pill, 900 11 tracking .7).
2. `InkCard` raised radio 18, overflow hidden, sin padding:
   - Banda superior alto 190, fondo `primarySoft`, borde inferior 2 `line`. Kanji Klee 140. Tag `N5` arriba-izq (fondo `textPrimary`, texto `background`, radio 6, 900 10). `4 trazos` arriba-der (700 11 `textSecondary`).
   - Cuerpo padding 14/16/16, gap 12:
     - Significado `FONTS.display` 30.
     - Fila de 2 cajas (flex 1, gap 8): fondo `surface2`, radio 10, padding 8; etiqueta 26×26 radio 6 fondo `textPrimary` con 音 / 訓 (`FONTS.display` 12, color `background`); lectura `FONTS.glyph` 18.
     - Oración `typography.sentence` con el kanji objetivo envuelto en `Marker`; traducción `body` `textSecondary`.
3. Spacer + `ENTENDIDO` primary.

## 07 · Kanji Grind · ronda — `KanjiGrindGameScreen` (completar frase / palabra)
1. `GameHeader` + eyebrow `COMPLETÁ LA FRASE`.
2. Prompt alto 200: oración `FONTS.glyph` 32 con el hueco = caja 54×54, borde 3 **discontinuo** `primary`, fondo `primarySoft`, radio 10; traducción 500 14 `textSecondary`.
3. Opciones kanji 2×2 alto 78 (`FONTS.glyph` 40). Tocar = `selected` (amarillo hundido) y confirma con la lógica actual.
4. Spacer + `NO SÉ` ghost (si hoy existe "saltar"; si no, omitir).
Rondas kanji→significado / kanji→lectura: mismo layout que 03 con el kanji en Klee 124.

## 08 · Tablero — `KanaBoardGameScreen`
1. `ScreenHeader` con back: eyebrow `盤 · TABLERO`, título `Hiragana` (Dela 20), derecha pastilla `TERMINAR`.
2. Fila (mb 12): `ProgressTrack thin tone=success` + `17 / 46` (900 12).
3. Grilla 6 columnas, gap 6. Celda alto 50, radio 9, columna centrada:
   - pendiente: `surfaces.quiet`, fondo `card`, kana `FONTS.glyph` 20 `textPrimary`.
   - resuelta: borde 2 `success`, fondo `successSoft`, kana `successInk`, romaji debajo 900 9 `successInk`.
   - actual: borde **3** `line`, fondo `highlight`, sombra 2, kana `onHighlight`.
4. Dock inferior (reemplaza StartBar; fondo `tabBar`, borde sup 2 `line`, padding 10×14, gap 8):
   - Caja 46 `highlight` contorno radio 10 con la kana actual (Klee 24).
   - Input flex 1, alto 46, borde 2 `primary`, radio 12, 700 18.
   - Botón 46 `primary` contorno sombra 2 con `→`.

## 09 · Resumen — `SessionSummary` (todas las partidas)
Ver SPEC-componentes §4. Pantalla sin tab bar.

## 10 · 復 Repaso · intro — `ReviewScreen` (phase intro)
1. Header raíz: `復習 · REPASO` / `Lo que te cuesta`.
2. Card de conteo (`InkCard` raised, radio 16, padding 14, fila gap 14, mb 20): círculo 76 fondo `accent` contorno con el total (`FONTS.display` 32 `onAccent`) + texto (`body` 13/19 `textSecondary`, primeras palabras bold `textPrimary`): **"cosas en tu lista.** Cada una vuelve en el formato en que la erraste; lo más fallado, primero." (copy actual partido).
   Lista vacía: mismo card con `0` y el texto actual de lista vacía.
3. `QUÉ ENTRA EN LA RONDA` (overline `textSecondary`, mb 10) + `SelectChip` con contador por juego (wrap, gap 8, mb 20).
4. `CUÁNTOS EJERCICIOS` + `Segmented` (12 · 24 · Todos).
5. Spacer + `EMPEZAR` primary + `VER Y EDITAR TU LISTA` ghost (mt 6).
6. Tab bar (復 activa). La fase `playing` usa los layouts 03/04/05 y oculta la tab bar; `done` usa 09.

## 11 · Tu lista — `ReviewListScreen`
1. Header con back: `復習 · REPASO` / `Tu lista`, derecha pastilla `+ AGREGAR` (`highlight`) → `ReviewAdd`.
2. Por juego (mb 16):
   - Fila título: `KANJI GRIND · 3` (overline `textPrimary`) + `QUITAR TODO` (900 10 tracking 1 `textMuted`).
   - Contenedor `surfaces.outlined`, fondo `card`, radio 14, overflow hidden. Filas padding 9×10, gap 10, separador `borderTop 2 hair` (no en la primera):
     - Glifo 40×40 radio 10 fondo `surface2`, `FONTS.glyph` 22 (2 chars: 17, 3+: 14).
     - Título `bodyStrong`; sub `bodySmall` `textSecondary`: `みず · 3 fallos` / `Agregado a mano`.
     - Pastilla fijar: padding 4×8, pill, borde 2, 900 9 tracking .7. Fijado: `FIJADO`, fondo `highlight`, borde `line`. No: `FIJAR`, transparente, borde `hair`, `textMuted`.
     - Quitar: círculo 24 fondo `surface2`, `−` 900 14 `textSecondary`.
   - Se reemplaza el 📌 emoji por la pastilla.
3. `ReviewAddScreen`: header con back `復習 · REPASO` / `Agregar`, `Segmented` (Palabras · Kanji), chips por temática/categoría, filas como 11 con botón `+` (círculo 24 `highlight` contorno) en vez de `−`.

## 12 · 私 Perfil — `OptionsScreen` + `ProgressCard`
1. Header raíz: `私 · PERFIL` / `Tu progreso`.
2. `ProgressCard` (`InkCard` raised, radio 16, padding 14, mb 20):
   - 3 stats en fila (flex 1): número `typography.stat` (precisión en `successInk`), label `caption` `textSecondary`: sesiones · precisión · respuestas.
   - Barras por modo (mt 8 c/u): label 96 de ancho (700 12) + `ProgressTrack thin` (relleno `primary`) + valor 32 alineado a la derecha (900 12). Top 4 modos por sesiones; el resto colapsado si hoy existe.
   - EXPORTAR / IMPORTAR: `PrimaryButton secondary size="small"` en fila gap 8 (mt 14).
3. `APARIENCIA` + `Segmented` (Sistema · Claro · Oscuro), mb 16.
4. Lista de ajustes (contenedor `outlined`, radio 14, filas padding 12, separador 2 `hair`): título `bodyStrong` + sub `bodySmall`:
   - Vibración → `InkSwitch`.
   - Recordatorio diario (`Todos los días a las 20 h`) → `InkSwitch`; si está activo, debajo los chips de hora (`SelectChip`, 8 · 13 · 18 · 20 · 21).
   - Versión `v0.1.0` → texto acción `BUSCAR` (labelSmall `primary`); estados del updater como sub-línea.
   - (Kyary, si `KYARY_ENABLED`): fila API key con el mismo estilo.
5. Tab bar (私 activa).

---

## Pantallas sin mock (aplicar el sistema por analogía)
- `KanasScreen` (puerta a Hiragana/Katakana/Kanji): 3 cards como las de 01 pero de ancho completo (alto 76, badge 44).
- `KanjiGrindScreen` setup: patrón 02.
- `EmojiGame`: prompt con el emoji grande (64) en vez de Klee; opciones 03.
- `KyaryScreen` (escondida): no migrar ahora; solo que compile.
