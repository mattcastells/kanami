---
name: repaso-total-notion
description: Mantener la página "Repaso total | そうふくしゅう" de Notion — el resumen de todo el curso de japonés, por tema, con links a cada clase. Usala SIEMPRE al cerrar una clase nueva (después de crear la página Kurasu N con clase-a-notion), y también cuando el usuario pida corregir, completar o reorganizar el repaso. Decide qué de la clase entra al repaso y qué no; si no hay nada nuevo, no toca el contenido.
---

# Repaso total | そうふくしゅう

**Página:** `4106c47f-5f8d-811c-8bf6-d253b1c51145` (hija de **Clases**, `38c6c47f-5f8d-802c-95f0-d9585dd63bdd`).
URL: https://app.notion.com/p/4106c47f5f8d811c8bf6d253b1c51145

Es el resumen de **todo** lo visto en el curso. Lo pidió el usuario el 2026-11-06 con estas
condiciones, que son las reglas de la página:

- **Cada tema una sola vez**, con lo relacionado junto. Si algo nuevo toca un tema que ya está, va
  **dentro** de esa sección: no se abre otra.
- **Sin ejercicios** y sin juntar ejemplos: regla corta + estructura + **un ejemplo base** + la
  trampa principal.
- **Sencillo y concreto.** No hay límite de largo, pero cada renglón tiene que ganarse su lugar.
- **Links a la clase** donde se vio cada tema (la línea 📎).

> La página vieja **"Resumen del curso | まとめ"** (`3fa6c47f-5f8d-8133-a546-ebb4b008928d`) es la
> versión anterior. Tiene ejercicios, lecturas y diálogos, y quedó congelada en la clase 29.
> **No la actualices.** El repaso vigente es esta página.

## ¿Corresponde actualizar? — decidilo primero

Recorré la clase nueva (la página Kurasu N recién creada y `content/clases/kurasu-NN.md`) y
clasificá cada cosa:

| Entra al repaso | No entra |
|---|---|
| Un punto gramatical nuevo (una estructura, una forma, un tipo de palabra) | Ejercicios, tarea y sus correcciones |
| Un uso nuevo de algo que ya está (otra función de で, otro negativo) | Lecturas y diálogos de clase |
| Una trampa o irregularidad que el profe marcó y que no figura | Ejemplos extra de algo que ya tiene su ejemplo base |
| Las frases de una situación nueva (en el banco, en el médico…) | Repasos: lo que la clase volvió a practicar sin agregar nada |
| Verbos, adjetivos y pares de opuestos nuevos | Anécdotas, chistes y cultura que no son la regla |
| Vocabulario nuevo que sirve, con su significado | Nombres de personajes, marcas o lugares que no son de Japón |

- **Si nada entra:** cambiá **solo** la línea de arriba (`Kurasu 1 a N`), que dice hasta qué
  clase se revisó, y no toques el contenido. Avisale al usuario: "la clase N fue repaso, el
  repaso total no cambió".
- **Si algo entra:** seguí los pasos de abajo. Ante la duda, es "no": el repaso sirve porque es
  corto.
- **Una clase que solo practicó un tema** no se suma al 📎 de ese tema. Solo se suma si aportó
  algo a esa sección.

## Mapa de la página (dónde va cada cosa)

```
📅 Actualizado el <fecha> · Kurasu 1 a N      ← siempre se actualiza
# 🌱 Las bases
  ✍️ Escritura y pronunciación · 🧱 La oración y las partículas (tabla con 📎 por fila
  + "Las trampas de siempre" + なにも/だれにも/どこも) · 🟰 Sustantivo + です ·
  👉 Demostrativos · ❓ Las palabras que preguntan
# 🔠 Verbos
  🧩 Formas y grupos · 📋 Los verbos que vimos (por partícula) · 🛠️ Sustantivo + します ·
  🙌 Invitar · ⏳ もう／まだ · 🎁 Dar y recibir
# 🎨 Describir
  🔤 Adjetivos い y な · 🏷️ Delante del sustantivo · 💭 Opinar · ❤️ Gustos y habilidades ·
  ↔️ Los adjetivos que vimos (tabla de opuestos + listas)
# 🔢 Números, hora y fechas
  💯 Números · 🧮 Contadores · 🕐 La hora · 📅 Los días · 📆 Palabras de tiempo
# 💬 Situaciones
  👋 Saludar · 🙋 Presentarse · 🏫 En clase · 🛍️ Compras/teléfono/estación · 🏠 De visita
# 📚 Vocabulario por tema
  👨‍👩‍👧 Personas y familia · 🌎 Países · 🏙️ Lugares · 🎒 Objetos y transporte ·
  🍙 Comida · 🎬 Tiempo libre · 🐼 Animales
```

Dónde va lo nuevo:

- **Gramática nueva:** en el bloque `#` que le corresponde, como `##` nueva **solo si no encaja**
  en una existente. Una forma verbal nueva (〜て, 〜たい…) va en 🔠 Verbos; un uso nuevo de una
  partícula es una **fila** de la tabla de partículas, no una sección.
- **Una pregunta nueva** (どうして, どのくらい…): una fila en ❓.
- **Verbo nuevo:** en su línea de 📋, según la partícula que pide, con `ます + significado`.
- **Adjetivo nuevo:** el par en la tabla de ↔️, o la palabra en "Otros い / Otros な".
- **Vocabulario:** `palabra significado` en la línea del grupo, separado con ` · `. Un grupo
  nuevo (`- **Nombre:** …`) solo si hay 5 o más palabras de un campo que no existe, y una `##`
  nueva solo si el campo es grande (como Animales).
- **Situación nueva:** fila en la tabla de la situación, o `##` nueva en 💬 si es otro contexto.

## Formato (igual al de las clases, más compacto)

Seguí `apuntes-notion-estilo` (kana con espacios, romaji en itálica, rioplatense), con estas
reglas propias:

- Cada `##` lleva emoji, tiene debajo su línea 📎 y termina con `---` (la última de cada bloque
  `#` también, salvo la última de la página).
- **Línea 📎:** `📎 [K3](url) · [K8](url)`, en orden ascendente. URL =
  `https://app.notion.com/p/<id sin guiones>`, sacada del índice de Clases (la 13 también
  está ahí desde el 2026-11-06).
- **Nunca** cites "(K12)" en texto plano: siempre el link.
- Por sección: **un** ejemplo base (`> **japonés** \| *romaji* \| español`; un par pregunta y
  respuesta con `<br>` cuenta como uno), como mucho **un** `⚠️ Importante` y **un** `💡 Dato útil`.
- **Colores:** el japonés de cada ejemplo y de cada estructura va con los 6 colores de
  `apuntes-notion-estilo` (partículas, verbos, adjetivos, personas, こそあど y preguntas,
  conectores). La leyenda 🎨 está arriba de todo. Un ejemplo nuevo entra ya coloreado: podés
  usar `colorize.js` de esa skill.
- Tablas en formato pipe (`| a | b |`). **No** empieces una celda con `+` ni con `-`: Notion la
  convierte en viñeta (pasó con "+ sustantivo").

## Cómo editar

1. **Fetch** de la página. Si no entra en la respuesta, queda guardada en un archivo. Extraé el
   texto con node (en esta máquina es más confiable que Python):
   ```js
   // node extract.js <archivo> <salida.md>
   const fs = require('fs'); const [src, out] = process.argv.slice(2);
   fs.writeFileSync(out, JSON.parse(fs.readFileSync(src, 'utf8')).text);
   ```
2. **`notion-update-page` → `update_content`**, con cambios chicos. **Nunca `replace_content`.**
   El `old_str` tiene que copiar el formato **devuelto** por el fetch: negrita como `<b>`,
   itálica como `<i>`, `<br />`, `\|`, `\[ \]` y tablas pipe. Los ejemplos coloreados vuelven
   partidos (`<b>…</b><b><span color="red">は</span></b>…`): para cambiar uno, copiá la línea
   entera del fetch. Los links `[K28](url)` agregados
   así quedan como links y no se vuelven menciones (comprobado el 2026-11-06).
3. Actualizá la línea de arriba: `📅 Actualizado el <hoy en 2026年M月D日> · Kurasu 1 a N`.
4. **Poné la clase nueva delante del repaso.** El orden del índice es Kurasu 1 … N, Repaso total
   y Resumen viejo. Notion crea la página Kurasu N al final de todo, debajo del Resumen viejo. `notion-move-pages` dentro del mismo padre **no** reordena (probado el
   2026-11-06). Lo que funciona es editar el índice de Clases con `update_content`, en una sola
   llamada:
   - sacá el bloque `<page url="…Kurasu N…">…</page>` del final;
   - insertalo justo antes del bloque del Repaso total.

   El Resumen viejo tiene que quedar último.

   Copiá los bloques tal cual vienen del fetch de Clases y confirmá el orden con otro fetch. Así
   se movió la clase 13 a su lugar.
5. **Verificá** con un fetch: la sección nueva, los links (id correcto, etiqueta `KN` correcta) y
   que ninguna tabla se haya roto.
6. Reportá en una o dos líneas qué entró al repaso, o que la clase no agregó nada.

## Errores a evitar

- Copiar la página de la clase al repaso. El repaso **resume**: si una sección pasa de una
  regla, un ejemplo y una trampa, sobra algo.
- Abrir una sección nueva para algo que ya tiene su lugar ("Más sobre で").
- Repetir una palabra que ya figura en otra sección: buscala antes de agregarla.
- Sumar ejercicios, lecturas o diálogos "porque estaban en la clase".
- Actualizar el Resumen viejo (`3fa6c47f…`).
