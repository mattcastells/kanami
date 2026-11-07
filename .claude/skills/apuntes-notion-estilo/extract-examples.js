// Saca de una página de Notion las líneas de ejemplo y estructura que lleva colores:
// las que están dentro de una cita ("> …" o un bloque <quote>…</quote>) y empiezan con <b>.
// Deja afuera párrafos, tablas, ⚠️/💡 y títulos.
//
// Uso: node extract-examples.js <fetch.txt|fetch.json> <lineas.txt>
//   La entrada puede ser el archivo que guarda el fetch cuando es muy grande (JSON con "text")
//   o el texto de la página pegado tal cual.
// Después: node colorize.js <lineas.txt> <ops.json>
const fs = require('fs');
const [src, out] = process.argv.slice(2);

let text = fs.readFileSync(src, 'utf8');
try {
  const j = JSON.parse(text);
  text = Array.isArray(j) ? j.map((x) => x.text || '').join('\n') : (j.text ?? text);
} catch { /* texto plano */ }

const lines = [];
let inQuote = false;
for (const raw of text.split(/\r?\n/)) {
  const l = raw.trim();
  if (l.startsWith('<quote')) { inQuote = true; continue; }
  if (l.startsWith('</quote>')) { inQuote = false; continue; }
  const quoted = l.startsWith('>') ? l.replace(/^>\s*/, '') : (inQuote ? l : null);
  if (quoted && quoted.startsWith('<b>') && /[぀-ヿ一-龯]/.test(quoted)) {
    lines.push(quoted);
  }
}
fs.writeFileSync(out, [...new Set(lines)].join('\n') + '\n');
console.log(`${new Set(lines).size} líneas de ejemplo`);
