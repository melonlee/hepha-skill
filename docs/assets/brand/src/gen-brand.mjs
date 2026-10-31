// Generates the Hepha logo SVGs from code so every variant stays geometrically identical.
// Usage: node docs/assets/brand/src/gen-brand.mjs   (writes into docs/assets/brand/)
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const out = join(dirname(fileURLToPath(import.meta.url)), "..");
mkdirSync(out, { recursive: true });

export const palette = {
  ink: "#1A1614",
  paper: "#F5F0E8",
  ember: "#F26A2E",
  ember2: "#F7934C",
  ember3: "#FBB46E",
};

// 64x64 mark: an anvil (the discipline) holding a glowing bar (the requirement)
// that breaks into ever smaller pieces (the tasks).
export function markBody(anvil) {
  return `<g transform="translate(0 7)">
  <rect x="24" y="12" width="22" height="5" rx="0.8" fill="${palette.ember}"/>
  <rect x="48" y="9" width="4" height="4" rx="0.5" fill="${palette.ember}"/>
  <rect x="54" y="4.5" width="3" height="3" rx="0.4" fill="${palette.ember2}"/>
  <rect x="58.5" y="0.8" width="2" height="2" rx="0.3" fill="${palette.ember3}"/>
  <path fill="${anvil}" d="M3 19 H59 V26.5 Q59 28.5 57 28.5 H46.5 Q42 28.5 42 33 V40 H49 Q52 40 52 43 V49 H16 V43 Q16 40 19 40 H26 V33 Q26 28.5 21.5 28.5 Q10 28.5 3 19 Z"/>
</g>`;
}

// Monoline geometric wordmark "hepha", built from strokes (no font dependency).
// x-height 40 (y 20..60), ascender y 0, descender y 80, stroke 7.5, bowl radius 18.
const S = 7.5;
const R = 18;
export function wordmarkBody(ink) {
  const h = (x) => `M${x} 0 V60 M${x} 40 A${R} ${R} 0 0 1 ${x + 2 * R} 40 V60`;
  const eBowl = (cx) => {
    const a = Math.PI / 4;
    const ex = (cx + R * Math.cos(a)).toFixed(2);
    const ey = (40 + R * Math.sin(a)).toFixed(2);
    return `M${cx + R} 40 A${R} ${R} 0 1 0 ${ex} ${ey}`;
  };
  const p = (x) => `M${x} 20 V80 M${x} 40 A${R} ${R} 0 1 1 ${x} 40.01`;
  const a = (cx) => `M${cx + R} 40 A${R} ${R} 0 1 0 ${cx + R} 40.01 M${cx + R} 20 V60`;
  // advance: glyph outer width + 11 gap
  const xs = { h1: 3.75, e: 76, p: 112.25, h2: 166.75, a: 239 };
  const strokes = [h(xs.h1), eBowl(xs.e), p(xs.p), h(xs.h2), a(xs.a)].join(" ");
  return `<path d="${strokes}" fill="none" stroke="${ink}" stroke-width="${S}" stroke-linecap="butt" stroke-linejoin="round"/>
  <path d="M${xs.e - R + S / 2} 40 H${xs.e + R + S / 2}" stroke="${palette.ember}" stroke-width="${S}" stroke-linecap="butt"/>`;
}
export const WORDMARK_W = 261;
export const WORDMARK_H = 80;

function svg(w, h, body, title) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${title}">
<title>${title}</title>
${body}
</svg>
`;
}

const files = {
  "hepha-mark.svg": svg(64, 64, markBody(palette.ink), "Hepha"),
  "hepha-mark-dark.svg": svg(64, 64, markBody(palette.paper), "Hepha"),
  "hepha-wordmark.svg": svg(WORDMARK_W, WORDMARK_H, wordmarkBody(palette.ink), "hepha"),
  "hepha-wordmark-dark.svg": svg(WORDMARK_W, WORDMARK_H, wordmarkBody(palette.paper), "hepha"),
};

// Horizontal lockup: mark scaled to the wordmark's ascender-to-baseline height.
function lockup(anvil, ink) {
  // Mark artwork spans y 7.8..56 and x 3..60.5; align its base with the wordmark baseline
  // and its top with the ascender.
  const s = 60 / 48.2;
  const top = 10;
  const baseline = top + 60;
  const gap = 20;
  const markW = 57.5 * s;
  const wx = Math.round(markW + gap);
  const w = Math.ceil(wx + WORDMARK_W);
  const h = 100;
  const body = `<g transform="translate(${(-3 * s).toFixed(2)} ${(baseline - 56 * s).toFixed(2)}) scale(${s.toFixed(4)})">${markBody(anvil)}</g>
<g transform="translate(${wx} ${top})">${wordmarkBody(ink)}</g>`;
  return svg(w, h, body, "Hepha");
}
files["hepha-logo.svg"] = lockup(palette.ink, palette.ink);
files["hepha-logo-dark.svg"] = lockup(palette.paper, palette.paper);

for (const [name, content] of Object.entries(files)) writeFileSync(join(out, name), content);
console.log(Object.keys(files).join("\n"));
