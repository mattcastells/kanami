// Genera los sonidos de acierto (assets/sounds/*.wav) por síntesis: no hay grabaciones ni
// licencias de por medio. Determinista (el ruido sale de una semilla fija): correrlo dos
// veces da los mismos archivos.
//
//   npm run sounds:generate
//
// Cada sonido es un motivo corto de dos notas que sube en una escala pentatónica japonesa
// (la sensación de "bien"), con el timbre de un instrumento:
//   campanita  · dos senos con armónicos (el primero que tuvo la app)
//   shamisen   · cuerda pulsada (Karplus-Strong), seca, con el zumbido del sawari y el
//                golpe del bachi
//
// Hubo también koto y shakuhachi: se sacaron (2026-11-10) porque sintetizados no sonaban
// convincentes. Antes de sumar otro instrumento, escuchalo: que esté afinado no alcanza.

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const RATE = 44100;
const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'sounds');

// ---------------------------------------------------------------- utilidades

function mulberry32(seed) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const NOTE = { E4: 329.63, A4: 440, A5: 880, E6: 1318.51 };

function buffer(seconds) {
  return new Float32Array(Math.floor(RATE * seconds));
}

function mixInto(target, source, startSeconds, gain = 1) {
  const offset = Math.floor(startSeconds * RATE);
  for (let i = 0; i < source.length && offset + i < target.length; i += 1) {
    target[offset + i] += source[i] * gain;
  }
}

// Filtro pasabanda RBJ (biquad).
function bandpass(input, freq, q) {
  const w0 = (2 * Math.PI * freq) / RATE;
  const alpha = Math.sin(w0) / (2 * q);
  const a0 = 1 + alpha;
  const b0 = alpha / a0;
  const b2 = -alpha / a0;
  const a1 = (-2 * Math.cos(w0)) / a0;
  const a2 = (1 - alpha) / a0;
  const out = new Float32Array(input.length);
  let x1 = 0;
  let x2 = 0;
  let y1 = 0;
  let y2 = 0;
  for (let i = 0; i < input.length; i += 1) {
    const x = input[i];
    const y = b0 * x + b2 * x2 - a1 * y1 - a2 * y2;
    x2 = x1;
    x1 = x;
    y2 = y1;
    y1 = y;
    out[i] = y;
  }
  return out;
}

// Se nivela por volumen percibido (RMS de los primeros 350 ms), no por pico: un pulsado
// tiene un pico enorme y poca energía, y a igual pico sonaba mucho más bajo que la flauta.
// Los picos que se pasan los redondea un limitador suave (tanh).
function writeWav(name, data, loudness) {
  const window = Math.min(data.length, Math.floor(RATE * 0.35));
  let energy = 0;
  for (let i = 0; i < window; i += 1) energy += data[i] * data[i];
  const gain = loudness / Math.sqrt(energy / window);
  const fade = Math.floor(RATE * 0.03);
  const bytes = Buffer.alloc(44 + data.length * 2);
  bytes.write('RIFF', 0);
  bytes.writeUInt32LE(36 + data.length * 2, 4);
  bytes.write('WAVE', 8);
  bytes.write('fmt ', 12);
  bytes.writeUInt32LE(16, 16);
  bytes.writeUInt16LE(1, 20);
  bytes.writeUInt16LE(1, 22);
  bytes.writeUInt32LE(RATE, 24);
  bytes.writeUInt32LE(RATE * 2, 28);
  bytes.writeUInt16LE(2, 32);
  bytes.writeUInt16LE(16, 34);
  bytes.write('data', 36);
  bytes.writeUInt32LE(data.length * 2, 40);
  for (let i = 0; i < data.length; i += 1) {
    const tail = i > data.length - fade ? (data.length - i) / fade : 1;
    const sample = Math.tanh(data[i] * gain) * 0.95 * tail;
    bytes.writeInt16LE(Math.round(sample * 32767), 44 + i * 2);
  }
  writeFileSync(join(OUT_DIR, `${name}.wav`), bytes);
  console.log(`${name}.wav  ${(data.length / RATE).toFixed(2)} s`);
}

// ---------------------------------------------------------------- cuerda pulsada

// Karplus-Strong con afinación fina (allpass fraccional), posición de pulsado y un filtro
// de pérdida. `brightness` 0..1: cuánto agudo sobrevive en cada vuelta.
function pluck(freq, seconds, { decay, brightness, pickPosition, random, buzz = 0 }) {
  const out = buffer(seconds);
  // Filtro de pérdida de dos coeficientes (1 - s, s): s = 0.5 es el promediador clásico (el
  // más opaco); cuanto más chico, más agudo sobrevive. Retrasa `s` muestras: se descuenta.
  const s = 0.5 * (1 - brightness);
  const period = RATE / freq - s;
  const length = Math.floor(period);
  const fraction = period - length;
  const allpass = (1 - fraction) / (1 + fraction);

  // Excitación: ruido con un peine (dónde se pulsa la cuerda) y suavizado leve.
  const line = new Float32Array(length);
  const pick = Math.max(1, Math.round(length * pickPosition));
  const noise = Array.from({ length }, () => random() * 2 - 1);
  for (let i = 0; i < length; i += 1) {
    line[i] = noise[i] - (i >= pick ? noise[i - pick] : 0);
  }

  let index = 0;
  let previous = 0;
  let apIn = 0;
  let apOut = 0;
  for (let i = 0; i < out.length; i += 1) {
    const current = line[index];
    let next = decay * ((1 - s) * current + s * previous);
    previous = current;
    // allpass fraccional para clavar la afinación
    const filtered = allpass * next + apIn - allpass * apOut;
    apIn = next;
    apOut = filtered;
    next = filtered;
    // sawari: la cuerda roza el mástil y suma armónicos agudos. Pendiente 1 en señal chica
    // (si fuera mayor, la cuerda se autooscila y no se apaga nunca).
    if (buzz > 0) next = Math.tanh(next * (1 + buzz)) / (1 + buzz);
    line[index] = next;
    out[i] = current;
    index = (index + 1) % length;
  }
  return out;
}

// ---------------------------------------------------------------- instrumentos

function campanita() {
  const out = buffer(0.45);
  [
    { freq: NOTE.A5, start: 0 },
    { freq: NOTE.E6, start: 0.085 },
  ].forEach(({ freq, start }) => {
    for (let i = 0; i < out.length; i += 1) {
      const t = i / RATE - start;
      if (t < 0) continue;
      const env = Math.min(1, t / 0.004) * Math.exp(-t / 0.11);
      out[i] +=
        env *
        (Math.sin(2 * Math.PI * freq * t) +
          0.22 * Math.sin(4 * Math.PI * freq * t) +
          0.06 * Math.sin(6 * Math.PI * freq * t));
    }
  });
  return out;
}

// Shamisen: más seco y corto, con el zumbido del sawari y el golpe del bachi (la púa
// grande pega también en el parche). Mi → La, rápido: una cuarta más abajo que la primera
// versión (Si → Mi), que sonaba chillona.
function shamisen() {
  const random = mulberry32(23);
  const out = buffer(0.8);
  const opts = { decay: 0.991, brightness: 0.9, pickPosition: 0.08, random, buzz: 0.6 };
  [
    { freq: NOTE.E4, start: 0 },
    { freq: NOTE.A4, start: 0.1 },
  ].forEach(({ freq, start }) => {
    mixInto(out, pluck(freq, 0.8 - start, opts), start);
    // golpe del bachi: ruido agudo muy corto + un "tum" grave del parche
    const hit = buffer(0.05);
    for (let i = 0; i < hit.length; i += 1) {
      const t = i / RATE;
      hit[i] = (random() * 2 - 1) * Math.exp(-t / 0.006) * 0.5 + Math.sin(2 * Math.PI * 120 * t) * Math.exp(-t / 0.02) * 0.6;
    }
    mixInto(out, bandpass(hit, 2400, 0.8), start, 0.8);
    mixInto(out, hit, start, 0.25);
  });
  return out;
}

mkdirSync(OUT_DIR, { recursive: true });
// Mismo volumen percibido para los dos.
writeWav('campanita', campanita(), 0.16);
writeWav('shamisen', shamisen(), 0.16);
