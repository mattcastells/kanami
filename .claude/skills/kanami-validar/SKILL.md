---
name: kanami-validar
description: Verificar que un cambio en Kanami realmente funciona antes de darlo por terminado — typecheck, prueba de engines sin abrir la app, validación web-first y checklist de regresiones. Usala SIEMPRE como último paso antes de decir que una tarea está lista o de commitear.
---

# Validar un cambio antes de darlo por terminado

Este repo **no tiene linter ni test runner**. El único gate automático es `tsc`. Por eso la
validación es explícita y manual, y hay que hacerla de verdad.

## Cuándo usar esta skill

Siempre, antes de reportar una tarea como terminada. Y antes de cualquier commit.

## Nivel 0 — Typecheck (obligatorio, sin excepciones)

```bash
npx tsc --noEmit
```

**Baseline: hoy pasa limpio (exit 0).** No hay errores preexistentes que puedas ignorar. Si sale
algo, es tuyo y hay que arreglarlo. No uses `any` ni `@ts-ignore` para taparlo: el proyecto está
en `strict` y eso es parte del valor.

## Nivel 1 — Higiene del diff

```bash
git diff
```

Revisá a mano:

- [ ] Cero `console.log` / `console.warn` / `console.error` nuevos
- [ ] Cero imports sin usar y cero entradas huérfanas en `StyleSheet.create`
- [ ] Cero colores hex nuevos en pantallas o componentes (deben salir de `activeTheme.colors`)
- [ ] Cero `shuffle`/`pickRandom` nuevos (ya hay 20 copias)
- [ ] Los comentarios que explican *por qué* siguen ahí (los de `ScreenBackground`, `speak.ts`,
      `gameEngine.ts` documentan bugs ya pagados — borrarlos los hace volver)
- [ ] Nada de secretos ni `.env`

Grep rápido de los anti-patrones más comunes de este repo:

```bash
git diff -U0 | grep -nE "^\+.*(console\.(log|warn|error)|const [A-Z_]+ = '#[0-9A-Fa-f]{6}')"
```

## Nivel 2 — Probar un engine sin abrir la app

Los `*Engine.ts` y los `*Store.ts` son TS puro sin React: se pueden **ejecutar de verdad**
con el `tsc` que ya está instalado, sin agregar ninguna dependencia.

```bash
# 1. compilar el engine (arrastra sus imports)
npx tsc src/features/game/timesGameEngine.ts --outDir .tmp-check \
  --module commonjs --target es2020 --skipLibCheck --rootDir .

# 2. escribir un harness JS
cat > .tmp-check/run.js <<'EOF'
const e = require('./src/features/game/timesGameEngine.js');
const r = e.createTimesRound('time-to-reading');
console.log('opciones sin texto repetido:',
  new Set(r.options.map(o => o.text)).size === r.options.length);
const s = e.submitTimesAnswer(e.createInitialTimesState('time-to-reading'), 'bogus');
console.log('stats tras fallo:', JSON.stringify(s.stats));
EOF

# 3. correr y limpiar
node .tmp-check/run.js
rm -rf .tmp-check
```

Verificado el 2026-08-08 con `timesGameEngine`. **Node ESM directo no funciona**
(`node --experimental-strip-types` falla): los imports del repo son sin extensión y Node no
los resuelve. Compilá a CommonJS como arriba.

Qué chequear según lo que tocaste:

| Tocaste | Verificá |
|---|---|
| Engine de opción múltiple | Opciones sin texto duplicado · no repite el prompt anterior · `submit` ignora el segundo tap · `streak` se reinicia al fallar |
| `normalize*` de un store | Sobrevive a `null`, `{}`, `[]`, tipos equivocados y campos faltantes |
| `wordVocabulary` | `kanaSyllables.join('') === kana` y misma longitud que `syllables`, para **todas** las entries |
| Racha diaria | `applyDailyActivity` suma 1 solo por día; con gap > 1 día reinicia |

`.tmp-check/` es descartable — **borralo siempre** (no está en `.gitignore`).

## Nivel 2.5 — Propagación (solo si sumaste contenido)

Si el cambio agrega vocabulario, kanji, frases o una clase, el contenido nuevo tiene que
**llegar a las actividades que lo consumen**. Compilar no alcanza: los datasets están
desacoplados y el contenido puede quedar mudo sin que `tsc` diga nada.

Abrí la tabla **§ Mapa de propagación** de `kanami-contenido` y recorré la fila del dataset que
tocaste. Los tres olvidos históricos:

- Palabra de clase nueva sin mapeo en `vocabularyEmoji.ts` → nunca aparece en el modo Imágenes.
- Kanji nuevo sin `npm run kanji:strokes` → funciona en opción múltiple pero no en Dibujo.
- Clase nueva sin `npm run kanji:generate` → sus kanji siguen figurando como "todavía no dado".

Contalo de verdad, no lo mires a ojo:

```bash
# ¿cuántas palabras quedaron tagueadas con la clase N? ¿cuántas fotos suma el mazo de emojis?
npx tsc src/data/vocabularyEmoji.ts --outDir .tmp-check --module commonjs \
  --target es2020 --skipLibCheck --rootDir .
# harness: getEmojiVocabulary('mixed').length antes vs después, y 0 emojis duplicados
node .tmp-check/run.js && rm -rf .tmp-check
```

## Nivel 3 — Web-first (la validación real)

```bash
npm run web
```

Es la plataforma primaria de validación del proyecto. **No corras builds nativos salvo pedido
explícito.**

Checklist según el cambio:

- **Modo de práctica**: ~10 rondas con aciertos y fallos · doble tap rápido (no debe contar
  dos veces) · salir y volver → el progreso quedó registrado en Perfil
- **UI**: probalo en **light y dark** (Perfil → tema). El 90% de los bugs visuales de este repo
  son colores hardcodeados que solo se ven en dark
- **Persistencia**: hacé el cambio, **recargá la página**, confirmá que sobrevivió
- **Kyary**: mensaje de texto + un camino de error a propósito (sin key o sin red)
- **Contenido nuevo**: aparece en el modo que lo consume y el `SpeakButton` lo lee bien

Regresiones que este repo ya sufrió y conviene mirar de reojo:

- La última card de una pantalla se corta abajo (safe-area / tab bar)
- Scroll horizontal en ventana angosta
- El chat de Kyary deja de scrollear
- La UI salta cuando aparece el `FeedbackBanner` (falta `minHeight` en el slot)

## Nivel 4 — Android (solo si te lo piden)

`npm run android`. Necesario únicamente si tocaste: notificaciones, `expo-intent-launcher`,
el updater, permisos, o algo bajo `plugins/`. En web esas cosas no corren.

## Reportar honestamente

Al cerrar, decí qué corriste **y qué no**:

> `npx tsc --noEmit` pasa. Validado en `npm run web` en light y dark: X, Y, Z.
> No probé en Android (el cambio no toca nada nativo).

Si algo falló o quedó sin probar, decilo explícitamente. No reportes "listo" con pasos salteados.

## Errores a evitar

- Dar por terminado sin correr `tsc`.
- Correr `tsc` y no leer la salida.
- Asumir que compila = funciona: casi todos los bugs de este repo son de runtime y visuales.
- Probar solo en light.
- Dejar `.tmp-check/` en el árbol.
