/**
 * Warm, muted style over OpenFreeMap's hosted "liberty" tiles. Rather than hand-authoring
 * colors for its ~110 layers (impractical to keep in sync and easy to miss layers), this fetches
 * the base style and applies one color-grade transform to every color found anywhere in it:
 * shift hue toward warm amber, desaturate, lighten slightly. Switching tile providers stays a
 * one-line URL change; only this function's target hue/amount would need retuning for a very
 * different base style.
 */

export const OPENFREEMAP_STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty';

/** Amber, matching the warm palette used by the stamp nav (ui-design.md). */
const WARM_HUE = 38;
const HUE_BLEND = 0.1;
const SATURATION_FACTOR = 0.4;
const MIN_SATURATION = 8;
const LIGHTEN_FACTOR = 0.12;
const MAX_LIGHTNESS = 96;

interface Hsla {
  h: number;
  s: number;
  l: number;
  a: number;
}

function rgbToHsl(r: number, g: number, b: number, a: number): Hsla {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  let h = 0;
  let s = 0;
  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1));
    switch (max) {
      case r:
        h = 60 * (((g - b) / d) % 6);
        break;
      case g:
        h = 60 * ((b - r) / d + 2);
        break;
      default:
        h = 60 * ((r - g) / d + 4);
    }
  }
  if (h < 0) h += 360;
  return { h, s: s * 100, l: l * 100, a };
}

const HEX_RE = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
const RGB_RE = /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)$/i;
const HSL_RE = /^hsla?\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%\s*(?:,\s*([\d.]+)\s*)?\)$/i;

/** Parses a color string in the forms MapLibre style specs use. Returns null for anything else
 * (expression keywords like "linear", property names like "zoom", etc. -- callers leave those
 * untouched). */
export function parseColor(input: string): Hsla | null {
  let m = HEX_RE.exec(input);
  if (m) {
    let hex = m[1]!;
    if (hex.length === 3) hex = hex.replace(/(.)/g, '$1$1');
    const r = parseInt(hex.slice(0, 2), 16) / 255;
    const g = parseInt(hex.slice(2, 4), 16) / 255;
    const b = parseInt(hex.slice(4, 6), 16) / 255;
    return rgbToHsl(r, g, b, 1);
  }
  m = RGB_RE.exec(input);
  if (m) {
    const r = Number(m[1]) / 255;
    const g = Number(m[2]) / 255;
    const b = Number(m[3]) / 255;
    const a = m[4] !== undefined ? Number(m[4]) : 1;
    return rgbToHsl(r, g, b, a);
  }
  m = HSL_RE.exec(input);
  if (m) {
    const a = m[4] !== undefined ? Number(m[4]) : 1;
    return { h: Number(m[1]), s: Number(m[2]), l: Number(m[3]), a };
  }
  return null;
}

export function hslaToString({ h, s, l, a }: Hsla): string {
  return `hsla(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%, ${+a.toFixed(3)})`;
}

/** Shifts a color toward warm amber: hue blended toward WARM_HUE, desaturated, lightened. */
export function warm(hsla: Hsla): Hsla {
  const diff = ((WARM_HUE - hsla.h + 540) % 360) - 180;
  const h = (hsla.h + diff * HUE_BLEND + 360) % 360;
  const s = Math.max(hsla.s * SATURATION_FACTOR, MIN_SATURATION);
  const l = Math.min(hsla.l + (100 - hsla.l) * LIGHTEN_FACTOR, MAX_LIGHTNESS);
  return { h, s, l, a: hsla.a };
}

function warmColorString(value: string): string {
  const hsla = parseColor(value);
  return hsla ? hslaToString(warm(hsla)) : value;
}

/** Recursively applies warmColorString to every string found in a paint value or expression. */
function warmify(value: unknown): unknown {
  if (typeof value === 'string') return warmColorString(value);
  if (Array.isArray(value)) return value.map(warmify);
  return value;
}

/** Fetches the base style and returns a warm-recolored copy. Network access, not pure. */
export async function buildStyle(): Promise<Record<string, unknown>> {
  const response = await fetch(OPENFREEMAP_STYLE_URL);
  const style = await response.json();
  const layers = (style.layers as Record<string, unknown>[]).map((layer) => {
    if (!layer['paint']) return layer;
    const paint: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(layer['paint'] as Record<string, unknown>)) {
      paint[key] = warmify(value);
    }
    return { ...layer, paint };
  });
  return { ...style, layers };
}
