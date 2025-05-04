export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface YCbCr {
  y: number;
  cb: number;
  cr: number;
}

export interface HSV {
  h: number;
  s: number;
  v: number;
}

export interface ColorAdjustments {
  ycbcr: { y: number; cb: number; cr: number };
  hsv: { h: number; s: number; v: number };
} 