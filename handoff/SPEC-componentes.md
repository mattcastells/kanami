# SPEC · Componentes (Hanga)

Unidades en dp. Colores = claves de `theme.colors` (cambian solas en oscuro). Tipos = `theme.typography` o `FONTS` + tamaño.
"Sombra N" = `inkShadow(colors.shadow, N)`. "Contorno" = `borderWidth: 2, borderColor: line`.

---

## 1 · Primitives nuevas (ya escritas en `handoff/src/components/ui/`)

| Componente | Qué es | Dónde se usa |
|---|---|---|
| `InkPressable` | contorno + sombra 3/4 + hundido al presionar; `sunken` = hundido fijo | todo lo tocable con borde |
| `InkSwitch` | switch contorneado 44×26 (small 36×22) | Invertido, Guía, Vibración, Recordatorio |
| `GradeMark` | ○ / ×, `badge` (círculo 30) o `inline` | FeedbackBanner, AnswerOption, input |
| `ProgressTrack` | barra de progreso con contorno | cabecera de partida, tablero, perfil |
| `SectionStep` | "① QUÉ QUERÉS HACER" | pantallas de selección |
| `Segmented` | control segmentado | silabario, tamaño de ronda, tema |
| `Marker` | resaltador amarillo bajo un carácter | oración de la tarjeta learn |
| `Seigaiha` | olas del hero | 練 Practicar |
| `Tanzaku` | etiqueta vertical | hero (練習), resumen (合格) |

---

## 2 · Primitives existentes — qué cambia

### `AppText`
API igual. Default `fontFamily: FONTS.medium`, `color: textPrimary`. Las variantes nuevas están en `theme.typography` (`labelSmall`, `caption`, `tileTitle`, `headlineRoot`, `stat`, `word`, `sentence`).
**Ojo:** `body` bajó de 15 a 13 y `bodyStrong` de 15 a 14 (la densidad del mock). Revisá visualmente las pantallas sin mock.

### `ScreenBackground`
- Fondo `background` liso. Sin gradiente ni decoración.
- Padding horizontal `SIZES.screenPaddingX` (18). Padding top 8 (bajo el safe area). Root de pestaña: top 12.
- `bottomOverlay` (StartBar) sigue midiéndose con `onLayout`.

### `GlassCard` (renombrar a `InkCard` es opcional; si se renombra, hacerlo en todo el repo)
- `backgroundColor: card`, `borderRadius: radii.card` (16), `padding: 14`, `...surfaces.raised` (sombra 4).
- Prop `flat` → `surfaces.outlined`, sin sombra (listas, stats).

### `PrimaryButton`
| variant | fondo | texto | borde/sombra | alto |
|---|---|---|---|---|
| `primary` | `primary` | `onPrimary` | contorno + sombra 3 | 52 |
| `secondary` | `card` | `textPrimary` | contorno + sombra 3 | 52 |
| `highlight` **[nuevo]** | `highlight` | `onHighlight` | contorno + sombra 3 | 52 |
| `ghost` | transparente | `textSecondary`, **subrayado** (offset 4) | nada | 44 |

- Radio `radii.md` (12). Label `typography.label` (Zen Maru 900 13, tracking 1.3), MAYÚSCULAS.
- `size="compact"` → alto 50 (StartBar). `size="small"` **[nuevo]** → alto 38, radio 10, `labelSmall`, contorno sin sombra (EXPORTAR/IMPORTAR).
- Presionado → `surfaces.press`. Disabled → opacity .45, sin sombra.
- Se borra el `boxShadow` sakura viejo. Usar `InkPressable` adentro.
- `icon` sigue soportado (gap 8).

### Botón pastilla de cabecera **[nuevo, variante de `PrimaryButton` o `ScreenHeader.action`]**
"TERMINAR", "+ AGREGAR": padding 8×12, `radii.pill`, contorno + **sombra 2**, `labelSmall` (900 11, tracking .9).
- Neutro: fondo `card`. Destacado (+ AGREGAR): fondo `highlight`.

### `ScreenHeader`
Dos layouts:
1. **Con back** (pantallas de stack): fila `alignItems:'flex-end'`, gap 12, mb 16.
   - Back: `InkPressable` 40×40 radio pill, fondo `card`, **sombra 2**, ícono `chevron-left` 22 `textPrimary` (MaterialCommunityIcons se queda para íconos utilitarios).
   - Bloque texto: eyebrow `overline` color `accentInk` + título `headline` (Dela 26). En pantallas de partida, `title` (Dela 20).
   - `rightSlot`/acción a la derecha (pastilla de cabecera).
2. **Raíz de pestaña** (sin back): eyebrow `overline` `accentInk` + título `headlineRoot` (Dela 28), mb 16.
- Formato eyebrow: `<kanji> · <SECCIÓN>` en mayúsculas: `かな · PRACTICAR`, `復習 · REPASO`, `私 · PERFIL`, `漢字 · LOTE 2`, `盤 · TABLERO`.

### Cabecera de partida **[nuevo: `GameHeader` en `components/game/`]**
Fila gap 12, mb 14:
- Cerrar: igual al back pero ícono `close` 18.
- `ProgressTrack` (flex 1, alto 14).
- Contador `"7/20"`: Zen Maru 900 13.
Debajo (mb 10), fila space-between:
- Izquierda: eyebrow del modo (`LECTURA · HIRAGANA`), `overline` `accentInk`.
- Derecha: `○ 5` en `successInk` + `× 1` en `errorInk`, Zen Maru 900 13, gap 10. **[NUEVO]**

### `StatPill`
Caja `surfaces.outlined`, fondo `card`, radio 12, padding 10, flex 1.
Número `FONTS.display` 24 (tono: `successInk` / `errorInk` / `textPrimary`). Label `caption` `textSecondary` con prefijo ○ / × en aciertos/fallidos.

### `SpeakButton`
Dos tamaños, ambos fondo `highlight`, contorno, glifo **音** en `FONTS.display`, color `onHighlight`:
- `round` 38×38 radio pill, glifo 14, **sin sombra**, absoluto abajo-derecha (12,12) del prompt.
- `square` 52×52 radio 12, glifo 16, sombra 3, a la izquierda del botón SIGUIENTE.
Sigue apareciendo **solo después de responder**.

---

## 3 · Selección (`components/practice/`)

### `ModeTile`
- Alto 54, radio 12, padding H 9, fila gap 10. Grilla 2 col gap 10 (último impar NO se estira; queda a media fila).
- Badge 32×32, radio 8, contorno, glifo `FONTS.display` 15.
- **idle**: fondo `card`, sombra 3; badge fondo `surface2`, glifo `textPrimary`; título `bodyStrong` `textPrimary`.
- **selected**: fondo `highlight`, `surfaces.press` (hundido, sombra 1); badge fondo `textPrimary`, glifo color `background`; título `onHighlight`.
- Se borra la prop `tint`. `description` se mantiene (bodySmall `textSecondary`).

### `SelectChip`
- Padding 6×12 (con contador: 7 / 8 / 7 / 12), `radii.pill`, borde 2, Zen Maru 700 12 (13 con contador).
- **on**: borde `line`, fondo `highlight`, texto `onHighlight`. Contador: mín 20×20 pill, fondo `textPrimary`, texto `highlight`, 900 11.
- **off**: borde `hair`, transparente, texto `textSecondary` (presets) / `textMuted` (filtros del Repaso). Contador: fondo `surface2`, texto `textMuted`.
- Gap entre chips 8, `flexWrap`.

### `CheckRow`
- `surfaces.outlined`, fondo `card`, radio 12, padding 12, fila gap 10.
- Check 22×22 radio 6 contorno; marcado = fondo `primary` + ✓ (900 12 `onPrimary`); desmarcado = fondo `card`.
- Título `bodyStrong` + conteo `· 46` en 500 `textMuted`. A la derecha preview kana `FONTS.glyph` 14 `textSecondary` + chevron `textMuted`.
- Varias filas apiladas con gap 8.

### Fila "Invertido" (toggle de modo inverso)
Fondo `surface2`, radio 12, padding 10×12, margin 12 arriba / 20 abajo. Título `bodyStrong`, nota `bodySmall` `textSecondary`. `InkSwitch` a la derecha.

### `StartBar`
- Fondo `tabBar`, `borderTopWidth: 2, borderTopColor: line`, padding 10/18/12, gap 8.
- Resumen: `caption` 12 `textSecondary` ("104 caracteres · Lectura").
- `PrimaryButton` primary `size="compact"` (alto 50), ancho completo.

---

## 4 · Juego (`components/game/`)

### `AnswerOptionButton`
Grilla 2 col, gap 12. Alto 66 (kanji: 78), radio 14, label `typography.option` (Zen Maru 700 22; kanji: `FONTS.glyph` 40). `GradeMark inline` absoluto top 4 right 10.
| estado | fondo | borde | texto | sombra | marca |
|---|---|---|---|---|---|
| idle | `card` | 2 `line` | `textPrimary` | 3 | — |
| selected (antes de confirmar, kanji) | `highlight` | 2 `line` | `onHighlight` | `press` | — |
| correct | `successSoft` | **3** `success` | `successInk` | none | ○ |
| incorrect | `errorSoft` | **3** `error` | `errorInk` | none | × |
| muted | `surface2` | 2 `hair` | `textMuted` | none | — |
Animaciones pulse/shake actuales se mantienen igual.

### `FeedbackBanner`
- Fila gap 10, padding 10×12, radio 12, borde 2 del tono, fondo `*Soft` del tono. mb 12.
- `GradeMark badge` (círculo 30) a la izquierda.
- Línea 1 (`bodyStrong` 15 `textPrimary`): correcta primero — `Correcto: き — ki` / `き — ki`.
- Línea 2 (`bodySmall` `textSecondary`): traducción (ok) o `Elegiste: shi` / `Escribiste: …` (error).
- nearMiss: tono `warning`, fondo `warningSoft`, marca `△`.
- idle: no renderiza nada (el slot conserva su alto).

### Campo de texto de respuesta (en `GameScreen` / `ReadingDrillPlay` / Traducción)
Alto 60, radio 14, padding H 16, Zen Maru 700 22.
- idle: borde 2 `line`, fondo `card`. focus: borde 2 `primary`.
- correct: borde **3** `success`, fondo `successSoft`, texto `successInk`, `GradeMark inline` a la derecha.
- incorrect: igual con `error`.

### `DrawingCanvas` / `DrawingPractice`
- Lienzo: `aspectRatio: 1`, ancho completo, contorno, radio 18, sombra 4, fondo `card`, overflow hidden.
- Guías: cruz centrada (vertical + horizontal), 2px discontinua color `hair`.
- Carácter fantasma: `FONTS.glyphLight` ~ 78 % del lado (250 en 324), `textPrimary` opacity .08. Solo con "Guía" encendida.
- Trazos del usuario: `primary`, ancho 12, `strokeLinecap/Join: round`.
- Insignias de número de trazo: círculo 22, fondo `accent`, contorno, número 900 11 `onAccent`, centradas en el inicio de cada trazo (KanjiVG ya da el punto).
- Debajo (mt 14): `Trazo 3 de 3` (700 13) a la izquierda; `Guía` + `InkSwitch small` a la derecha (reemplaza `HintToggle`).
- Acciones: BORRAR `secondary` (flex 1) + LISTO `primary` (flex 1.4), gap 10.

### `SessionSummary`
Centrado, padding top 20.
1. Eyebrow `SESIÓN TERMINADA · LECTURA` (overline `accentInk`).
2. Sol: círculo 210, fondo `accent`, contorno, **sombra 5**, margin 22/0/18. Adentro `82%` (`FONTS.display` 58, `onAccent`) y `18 de 22` (700 13). `Tanzaku "合格"` size 15, absoluto right -14 top -6 — **solo si accuracy ≥ 70**.
3. Veredicto (`FONTS.display` 28): 素晴らしい / よくできました / もう少し / 頑張って (lógica actual). Debajo traducción `body` `textSecondary` **[NUEVO]**: "Excelente." / "Muy bien hecho." / "Casi." / "A seguir."
4. Fila de 3 `StatPill` (mt 22, gap 10).
5. **[NUEVO]** si hubo fallos: "Los N fallos ya están en tu **Repaso**." (body `textSecondary`, "Repaso" bold subrayado, navega a la pestaña).
6. Abajo: REPETIR `primary` + VOLVER `secondary`, columna gap 10.

### `ReadingDrillPlay`
Mismo esqueleto que opción múltiple / escribir (GameHeader + prompt + opciones o input + banner + SIGUIENTE). El prompt de cifras (347, 4:30, 10月3日) va en `FONTS.display` 56, la lectura en `FONTS.glyph`.

---

## 5 · Tab bar (`RootNavigator.tsx`)

- `tabBarStyle`: fondo `tabBar`, `borderTopWidth: 2`, `borderTopColor: line`, **sin** `boxShadow`, `paddingTop: 8`, `paddingHorizontal: 8`. Alto: `TAB_CONTENT_HEIGHT (60) + max(insets.bottom, MIN_BOTTOM_INSET)` — se mantiene.
- `TabGlyph`: pastilla 56×30 radio pill. Activa: fondo `highlight` + contorno 2 `line`, glifo `onHighlight`. Inactiva: transparente, borde 2 transparente (para no saltar), glifo `textMuted`. Glifo `FONTS.display` 15.
- `TabLabel`: Zen Maru 10; activa 900 `textPrimary`, inactiva 700 `textMuted`. mt 3.
- `allowFontScaling={false}` se mantiene.
- Ocultar en partida: en cada stack screen de juego `options={{ /* … */ }}` + en el navigator de tabs:
  ```tsx
  // RootNavigator: dentro de screenOptions de Tab.Screen PracticeTab/ReviewTab
  options={({ route }) => ({
    tabBarStyle: isPlaying(getFocusedRouteNameFromRoute(route)) ? { display: 'none' } : baseTabBarStyle,
  })}
  const PLAYING = ['KanaGame','KanaBoardGame','KanjiGrindGame','KanjiDraw','EmojiGame','TranslationGame','MeaningGame','AntonymGame','NumbersGame','DateTimeGame'];
  ```
  En `ReviewTab` la ronda es una fase de `ReviewScreen` (no ruta): exponer la fase con `navigation.setOptions` desde `ReviewScreen` (`tabBarStyle: {display:'none'}` mientras `phase==='playing'`) sobre `navigation.getParent()`.
