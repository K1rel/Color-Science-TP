import { RGB, YCbCr, HSV } from '../types/color';

export function clamp(value: number): number {
  return Math.round(Math.max(0, Math.min(255, value)));
}

export function rgbToYCbCr(rgb: RGB): YCbCr {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  const y = 0.299 * r + 0.587 * g + 0.114 * b;
  const cb = -0.169 * r - 0.331 * g + 0.5 * b + 0.5;
  const cr = 0.5 * r - 0.419 * g - 0.081 * b + 0.5;
  return { y, cb, cr };
}

export function ycbcrToRgb(y: number, cb: number, cr: number): RGB {
  const R = (y + 1.402 * (cr - 0.5)) * 255;
  const G = (y - 0.344136 * (cb - 0.5) - 0.714136 * (cr - 0.5)) * 255;
  const B = (y + 1.772 * (cb - 0.5)) * 255;
  return {
    r: clamp(R),
    g: clamp(G),
    b: clamp(B),
  };
}

export function rgbToHSV(rgb: RGB): HSV {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;

  let h = 0;
  if (diff !== 0) {
    switch (max) {
      case r:
        h = 60 * (((g - b) / diff) % 6);
        if (h < 0) h += 360;
        break;
      case g:
        h = 60 * ((b - r) / diff + 2);
        break;
      case b:
        h = 60 * ((r - g) / diff + 4);
        break;
    }
  }

  const s = max === 0 ? 0 : diff / max;
  const v = max;

  return { h, s, v };
}

export function hsvToRgb(h: number, s: number, v: number): RGB {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;

  let rP = 0,
    gP = 0,
    bP = 0;

  if (h >= 0 && h < 60) {
    rP = c;
    gP = x;
    bP = 0;
  } else if (h >= 60 && h < 120) {
    rP = x;
    gP = c;
    bP = 0;
  } else if (h >= 120 && h < 180) {
    rP = 0;
    gP = c;
    bP = x;
  } else if (h >= 180 && h < 240) {
    rP = 0;
    gP = x;
    bP = c;
  } else if (h >= 240 && h < 300) {
    rP = x;
    gP = 0;
    bP = c;
  } else {
    rP = c;
    gP = 0;
    bP = x;
  }

  const R = (rP + m) * 255;
  const G = (gP + m) * 255;
  const B = (bP + m) * 255;

  return {
    r: clamp(R),
    g: clamp(G),
    b: clamp(B),
  };
} 