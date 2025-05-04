import { RGB, YCbCr, HSV, ColorAdjustments } from '../types/color';
import { rgbToYCbCr, ycbcrToRgb, rgbToHSV, hsvToRgb } from './colorSpaceUtils';

export function processImage(
  imageData: ImageData,
  colorSpace: 'ycbcr' | 'hsv',
  adjustments: ColorAdjustments
): ImageData {
  const newImageData = new ImageData(imageData.width, imageData.height);
  const factor = colorSpace === 'ycbcr' ? adjustments.ycbcr : adjustments.hsv;

  for (let i = 0; i < imageData.data.length; i += 4) {
    const r = imageData.data[i];
    const g = imageData.data[i + 1];
    const b = imageData.data[i + 2];
    const alpha = imageData.data[i + 3];

    if (colorSpace === 'ycbcr') {
      const { y, cb, cr } = rgbToYCbCr({ r, g, b });
      const ycbcrFactor = factor as { y: number; cb: number; cr: number };
      
      const yAdj = ycbcrFactor.y > 0 ? y * (ycbcrFactor.y / 100) : 0.5;
      const cbAdj = ycbcrFactor.cb > 0 ? 0.5 + (cb - 0.5) * (ycbcrFactor.cb / 100) : 0.5;
      const crAdj = ycbcrFactor.cr > 0 ? 0.5 + (cr - 0.5) * (ycbcrFactor.cr / 100) : 0.5;

      const { r: rOut, g: gOut, b: bOut } = ycbcrToRgb(yAdj, cbAdj, crAdj);

      newImageData.data[i] = rOut;
      newImageData.data[i + 1] = gOut;
      newImageData.data[i + 2] = bOut;
      newImageData.data[i + 3] = alpha;
    } else {
      const { h, s, v } = rgbToHSV({ r, g, b });
      const hsvFactor = factor as { h: number; s: number; v: number };
      
      const hAdj = hsvFactor.h > 0 ? h * (hsvFactor.h / 100) : 0;
      const sAdj = hsvFactor.s > 0 ? s * (hsvFactor.s / 100) : 0;
      const vAdj = hsvFactor.v > 0 ? v * (hsvFactor.v / 100) : 1;

      const { r: rOut, g: gOut, b: bOut } = hsvToRgb(hAdj, sAdj, vAdj);

      newImageData.data[i] = rOut;
      newImageData.data[i + 1] = gOut;
      newImageData.data[i + 2] = bOut;
      newImageData.data[i + 3] = alpha;
    }
  }

  return newImageData;
}

export function processComponentCanvases(
  imageData: ImageData,
  contexts: Record<string, CanvasRenderingContext2D | null>
): void {
  const imageDataObjects: Record<string, ImageData> = {};
  Object.entries(contexts).forEach(([key, ctx]) => {
    if (!ctx) return;
    imageDataObjects[key] = ctx.createImageData(imageData.width, imageData.height);
  });

  for (let i = 0; i < imageData.data.length; i += 4) {
    const r = imageData.data[i];
    const g = imageData.data[i + 1];
    const b = imageData.data[i + 2];
    const alpha = imageData.data[i + 3];

    const { y, cb, cr } = rgbToYCbCr({ r, g, b });
    
    const yOnly = ycbcrToRgb(y, 0.5, 0.5);
    imageDataObjects.y.data[i] = yOnly.r;
    imageDataObjects.y.data[i + 1] = yOnly.g;
    imageDataObjects.y.data[i + 2] = yOnly.b;
    imageDataObjects.y.data[i + 3] = alpha;
    
    const cbOnly = ycbcrToRgb(0.5, cb, 0.5);
    imageDataObjects.cb.data[i] = cbOnly.r;
    imageDataObjects.cb.data[i + 1] = cbOnly.g;
    imageDataObjects.cb.data[i + 2] = cbOnly.b;
    imageDataObjects.cb.data[i + 3] = alpha;
    
    const crOnly = ycbcrToRgb(0.5, 0.5, cr);
    imageDataObjects.cr.data[i] = crOnly.r;
    imageDataObjects.cr.data[i + 1] = crOnly.g;
    imageDataObjects.cr.data[i + 2] = crOnly.b;
    imageDataObjects.cr.data[i + 3] = alpha;

    const { h, s, v } = rgbToHSV({ r, g, b });
    
    const hOnly = hsvToRgb(h, 1, 1);
    imageDataObjects.h.data[i] = hOnly.r;
    imageDataObjects.h.data[i + 1] = hOnly.g;
    imageDataObjects.h.data[i + 2] = hOnly.b;
    imageDataObjects.h.data[i + 3] = alpha;
    
    const sOnly = hsvToRgb(0, s, 1);
    imageDataObjects.s.data[i] = sOnly.r;
    imageDataObjects.s.data[i + 1] = sOnly.g;
    imageDataObjects.s.data[i + 2] = sOnly.b;
    imageDataObjects.s.data[i + 3] = alpha;
    
    const vOnly = hsvToRgb(0, 0, v);
    imageDataObjects.v.data[i] = vOnly.r;
    imageDataObjects.v.data[i + 1] = vOnly.g;
    imageDataObjects.v.data[i + 2] = vOnly.b;
    imageDataObjects.v.data[i + 3] = alpha;
  }

  Object.entries(contexts).forEach(([key, ctx]) => {
    if (!ctx) return;
    ctx.putImageData(imageDataObjects[key], 0, 0);
  });
} 