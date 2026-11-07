// Colorea el japonés de los ejemplos y estructuras de los apuntes (solo dentro de <b>…</b>).
//
//   rojo     partículas            は が を に へ で と も の か から まで ね よ や (también pegadas:
//                                  なんじから, これは, ですね, でしたか)
//   azul     verbos                formas ます, て y de diccionario del curso, ください, おあがり
//                                  (べんきょう します, sin partícula en el medio: todo azul)
//   violeta  adjetivos             い y な (con el な que los une al sustantivo), 〜くない, けっこう
//   verde    personas              pronombres, gente, familia, ocupaciones, nombres (con 〜さん/くん/
//                                  ちゃん/さま o de la lista); un nombre con ・ va entero
//   naranja  こそあど y preguntas   これ この ここ こちら そう… · なに だれ いつ どんな いくら なにも…
//   rosa     conectores            が de "pero" (が、) · でも · そして · それから · つまり
//
//   Sin color: sustantivos, です/でした, じゃ ありません (pegado o separado), palabras de tiempo,
//   frases hechas (ございます, ございました, すみません) y los rótulos de diálogo ("A：", "マリア：").
//
// Uso:
//   node colorize.js <lineas.txt> <ops.json>          colorea (o recolorea) y arma las operaciones
//   node colorize.js <lineas.txt> <ops.json> --diff   igual, pero muestra palabra por palabra qué
//                                                     cambia respecto del color que ya tenía la línea
//   lineas.txt = una línea por renglón, copiada TAL CUAL del fetch de Notion (con o sin color)
//   ops.json   = [{ old_str, new_str, replace_all_matches: true }] para update_content
// Revisá lo que imprime antes de aplicar. Una línea sin espacios entre palabras puede necesitar
// retoque a mano; un nombre propio nuevo se suma a NAMES.
const fs = require('fs');

const set = (s) => new Set(s.trim().split(/\s+/));
const PARTICLES = set('は が を に へ で と も の か から まで ね よ や');
const CONNECTORS = set('でも そして それから つまり');
const KOSOADO = set(`これ それ あれ どれ この その あの どの ここ そこ あそこ どこ こちら そちら あちら
  どちら こんな そんな あんな どんな こう そう ああ どう なに なん なんで だれ どなた いつ いくら いかが
  おいくつ なにも だれにも どこも どこへも`);
const ADJ = set(`たかい やすい ひくい おおきい ちいさい あたらしい ふるい いい わるい ながい みじかい
  あつい さむい つめたい あたたかい すずしい やさしい むずかしい おもしろい つまらない おいしい まずい
  あかるい くらい うれしい かなしい いそがしい たのしい すごい あぶない あまい うるさい かわいい こわい
  さびしい ふとい ひろい せまい おもい かるい はやい おそい ちかい とおい あかい あおい きいろい しろい
  くろい よくない ひま にぎやか しずか べんり ふべん すき きらい だいすき だいきらい じょうず へた とくい
  にがて きれい ゆうめい しんせつ げんき おげんき たいへん すてき かんたん にんき ハンサム けっこう`);
const PERSONS = set(`わたし あたし ぼく おれ あなた かれ かのじょ わたしたち あなたたち みなさん ひと かた
  こ こども あかちゃん おとこ おんな ともだち かれし かぞく はは ちち あに あね おとうと いもうと そふ そぼ
  おっと つま りょうしん がくせい しゃいん せんせい きょうし いしゃ かいしゃいん ぎんこういん エンジニア べんごし
  はいゆう まんがか せんしゅ けんきゅうしゃ りゅうがくせい ファン`);
// Nombres propios sin honorífico que aparecen en los apuntes
const NAMES = set(`マティアス メッシ ルフィ ブラッド・ピット ブラッドピット Wally マリア・サントス ジョゼ・サントス ワン・シュエ
  やまだ いちろう ともこ`);
const NOT_PERSON = set('ふじさん たくさん');
const VERB_FORMS = set(`おきる ねる はたらく やすむ べんきょうする はじまる おわる いく くる かえる
  たべる のむ みる きく よむ かく かう とる すう する きる あける うたう わすれる はなす まつ およぐ
  あそぶ あう あげる もらう かす かりる おしえる ならう おくる かける
  たべて のんで みて きいて よんで かいて かって とって して きて いって かえって まって あるいて
  みせて こたえて おしえて いらっしゃって ください おあがり`);
const FIXED = set('ございます ございました すみません');
const MASU = /(ます|ません|ました|ませんでした|ましょう)$/;
const HONORIFIC = /.(さん|くん|ちゃん|さま|せんせい)$/;
const NANI = /^なん(じ|ぷん|ふん|ようび|がつ|にち|ねん|さい|がい|ばん|ばんせん|の)$/;
const COPULA_NEG = /^(じゃ|では)(ありません(でした)?|ない)$|^ありません(でした)?$/;
const TIME_LIKE = /(じ|じはん|ふん|ぷん|がつ|にち|ようび|ねん|さい|かい|がい|や|[0-9０-９])$/;
// Partículas que pueden venir pegadas al final de una palabra (orden: las largas primero)
const GLUED = [['から', 'red'], ['まで', 'red'], ['ぐらい', null], ['には', 'red'], ['では', 'red'],
  ['へは', 'red'], ['は', 'red'], ['が', 'red'], ['を', 'red'], ['に', 'red'], ['で', 'red'],
  ['と', 'red'], ['も', 'red'], ['へ', 'red'], ['の', 'red']];
const NO_SPLIT = set('いつも これから いまから それで ひとり ふたり なにも だれにも どこも どうも どうぞ');
const SURU = /^(する|します|しません|しました|しませんでした|しましょう|して)(か|ね|よ)?$/;
const SENTENCE_END = /^(です|でした|.*(ます|ません|ました|ませんでした|ましょう))(か|ね|よ|かね|よね)$/;
const DELIM_RE = /(\\\[[^\]]*\\\]|\s+|、|。|？|！|\?|!|\/|／|—|：|:|（|）|\(|\)|「|」|『|』)/;
const isDelim = (p) => /^(\s+|、|。|？|！|\?|!|\/|／|—|：|:|（|）|\(|\)|「|」|『|』)$/.test(p);

const span = (c, t) => `<span color="${c}">${t}</span>`;

function baseColor(t, prev) {
  if (/^\\\[(persona|compañía)[^\]]*\\\]$/.test(t)) return 'green';
  if (/^\\\[verbo[^\]]*\\\]$/.test(t) || t === 'V') return 'blue';
  if (/^\\\[adjetivo[^\]]*\\\]$/.test(t)) return 'purple';
  if (/^\\\[(は|が|を|に|へ|で|と|も|の)\\\]$/.test(t)) return 'red'; // どこ[へ]も
  if (FIXED.has(t) || COPULA_NEG.test(t) && (t.startsWith('じゃ') || t.startsWith('では') ||
    prev.text === 'じゃ' || prev.text === 'では')) return 'none';
  if (CONNECTORS.has(t)) return 'pink';
  if (PARTICLES.has(t)) return 'red';
  if (t === 'な' && prev.color === 'purple') return 'purple';
  if (/^(さん|くん|ちゃん)$/.test(t) && prev.color === 'green') return 'green';
  if (KOSOADO.has(t) || NANI.test(t)) return 'orange';
  if (MASU.test(t) || VERB_FORMS.has(t)) return 'blue';
  if (ADJ.has(t) || /くない$|くなかった$/.test(t)) return 'purple';
  if (NOT_PERSON.has(t)) return 'none';
  if (PERSONS.has(t) || NAMES.has(t) || HONORIFIC.test(t) || /.(じん|せんしゅ)$/.test(t)) return 'green';
  return null;
}

// Devuelve [[texto, color], …] para una palabra (puede partirla en base + partícula)
function colorWord(t, prev, next, nextWord) {
  if (next === '：' || next === ':') return [[t, null]]; // rótulo de diálogo
  if (t === 'が' && next === '、') return [[t, 'pink']];
  // じゃ / では + ありません es el negativo de です: sin color (no es で + は)
  if ((t === 'では' || t === 'じゃ') && nextWord && /^ありません/.test(nextWord)) return [[t, null]];
  const end = t.match(SENTENCE_END);
  if (end) {
    const base = end[1];
    const out = [[base, base === 'です' || base === 'でした' ? null : 'blue']];
    for (const ch of end[3]) out.push([ch, 'red']);
    return out;
  }
  const c = baseColor(t, prev);
  if (c) return [[t, c === 'none' ? null : c]];
  if (!NO_SPLIT.has(t)) {
    for (const [suf, sc] of GLUED) {
      if (t.length > suf.length && t.endsWith(suf)) {
        const pre = t.slice(0, -suf.length);
        const pc = baseColor(pre, prev);
        const ok = suf === 'から' || suf === 'まで' || suf === 'ぐらい' || (pc && pc !== 'none') ||
          TIME_LIKE.test(pre) || /^[A-Za-z]/.test(pre) || /^(ひとり|ふたり|みんな)$/.test(pre) ||
          (suf === 'は' && /^[おご].{2,}$/.test(pre));
        if (ok) return [[pre, pc && pc !== 'none' ? pc : null], [suf, sc]];
      }
    }
  }
  // sustantivo + します sin partícula en el medio (べんきょう します): es un verbo, todo azul
  if (nextWord && SURU.test(nextWord) && /^[぀-ヿ]+$/.test(t)) return [[t, 'blue']];
  // nombre extranjero en dos palabras: アンドリュー ガーフィールドさん
  if (nextWord && /^[ァ-ヶー]+$/.test(t) && /^[ァ-ヶー・]+(さん|くん|ちゃん|さま)$/.test(nextWord)) {
    return [[t, 'green']];
  }
  return [[t, null]];
}

function tokenize(seg) {
  const parts = seg.split(DELIM_RE).filter((p) => p !== '');
  // ・ separa, salvo dentro de un nombre en katakana (ブラッド・ピットさん)
  // y dentro de 「」 (「は・さ・み」 es una palabra deletreada)
  const out = [];
  for (const [i, p] of parts.entries()) {
    const quoted = parts[i - 1] === '「' && parts[i + 1] === '」';
    if (!isDelim(p) && !quoted && p.includes('・') && !/^[ァ-ヶー・]+(さん|くん|ちゃん|さま)?$/.test(p)) {
      p.split(/(・)/).filter(Boolean).forEach((x) => out.push(x));
    } else out.push(p);
  }
  return out;
}

function colorSegment(seg) {
  const parts = tokenize(seg);
  // rótulo de diálogo: todo lo que va antes del primer ： (si antes no termina una oración)
  const colon = parts.findIndex((p) => p === '：' || p === ':');
  const labelUntil = colon > 0 && !parts.slice(0, colon).some((p) => /^(。|？|！|\?|!)$/.test(p)) ? colon : -1;
  let prev = { text: null, color: null };
  const html = parts.map((p, i) => {
    if (isDelim(p) || p === '・') return p;
    if (i < labelUntil) return p;
    // 「ね」: entre comillas japonesas es la palabra o el kana del que se habla, no se colorea
    if (parts[i - 1] === '「' && parts[i + 1] === '」') { prev = { text: p, color: null }; return p; }
    let k = i + 1;
    while (k < parts.length && /^\s+$/.test(parts[k])) k++;
    const nextWord = /^\s+$/.test(parts[i + 1] || '') ? parts[k] : null;
    const pieces = colorWord(p, prev, parts[i + 1] === '、' ? '、' : parts[k], nextWord);
    const last = pieces[pieces.length - 1];
    prev = { text: p, color: last[1] };
    return pieces.map(([t, c]) => (c ? span(c, t) : t)).join('');
  }).join('');
  // dos tramos seguidos del mismo color van en uno: \[persona\]さん, \[verbo\]ました
  let merged = html; let before;
  do {
    before = merged;
    merged = merged.replace(/<span color="([a-z]+)">([^<]*)<\/span><span color="\1">/g, '<span color="$1">$2');
  } while (merged !== before);
  return merged;
}

function normalize(line) {
  return line.replace(/<\/b><b>/g, '').replace(/<b>(.*?)<\/b>/g, (_, seg) =>
    `<b>${seg.replace(/<span color="[a-z_]+">(.*?)<\/span>/g, '$1')}</b>`);
}

function colorLine(line) {
  return normalize(line).replace(/<b>(.*?)<\/b>/g, (_, seg) => `<b>${colorSegment(seg)}</b>`);
}

// [[texto, color]] de lo coloreado en una línea, para comparar versiones
function coloredWords(line) {
  const out = [];
  line.replace(/<\/b><b>/g, '').replace(/<span color="([a-z_]+)">(.*?)<\/span>/g, (_, c, t) => {
    out.push(`${t}:${c}`);
    return '';
  });
  return out;
}

module.exports = { colorLine, normalize, coloredWords };

if (require.main === module) {
  const [src, out, flag] = process.argv.slice(2);
  const diff = flag === '--diff';
  const lines = [...new Set(fs.readFileSync(src, 'utf8').split(/\r?\n/)
    .map((l) => l.replace(/^>\s*/, '').trim()).filter((l) => l.startsWith('<b>')))];
  const ops = [];
  for (const line of lines) {
    const colored = colorLine(line);
    if (colored === line) continue;
    if (diff) {
      const a = coloredWords(line); const b = coloredWords(colored);
      if (a.join('|') === b.join('|')) continue; // mismo color, solo cambia cómo lo guarda Notion
      // diferencia contando apariciones (una palabra puede estar dos veces en la línea)
      const minus = (p, q) => { const r = [...q]; return p.filter((x) => { const k = r.indexOf(x); if (k < 0) return true; r.splice(k, 1); return false; }); };
      const lost = minus(a, b); const gained = minus(b, a);
      console.log(`#${ops.length}  ${normalize(line).replace(/<[^>]+>/g, '').split(' \\| ')[0].slice(0, 70)}`);
      console.log(`    − ${lost.join('  ') || '(nada)'}\n    + ${gained.join('  ') || '(nada)'}`);
    }
    ops.push({ old_str: line, new_str: colored, replace_all_matches: true });
  }
  ops.sort((x, y) => y.old_str.length - x.old_str.length); // las largas primero
  fs.writeFileSync(out, JSON.stringify(ops));
  if (!diff) for (const o of ops) console.log(o.new_str.replace(/ \\\| <i>[^]*?(?=<br \/><b>|$)/g, ' …'));
  console.log(`\n${ops.length} de ${lines.length} líneas cambian`);
}
