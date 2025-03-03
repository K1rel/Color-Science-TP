import React, { useState, useRef, useEffect, useCallback } from "react";

interface RGB {
  r: number;
  g: number;
  b: number;
}

interface YCbCr {
  y: number;
  cb: number;
  cr: number;
}

interface HSV {
  h: number;
  s: number;
  v: number;
}

interface ColorAdjustments {
  ycbcr: { y: number; cb: number; cr: number };
  hsv: { h: number; s: number; v: number };
}

const ColorSpaceConverter = () => {
  const originalCanvasRef = useRef<HTMLCanvasElement>(null);
  const ycbcrCanvasRef = useRef<HTMLCanvasElement>(null);
  const hsvCanvasRef = useRef<HTMLCanvasElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [originalImageData, setOriginalImageData] = useState<ImageData | null>(null);
  const [adjustments, setAdjustments] = useState<ColorAdjustments>({
    ycbcr: { y: 100, cb: 100, cr: 100 },
    hsv: { h: 100, s: 100, v: 100 },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = originalCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.clearRect(0, 0, img.width, img.height);
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, img.width, img.height);
      setOriginalImageData(imageData);
      setImageLoaded(true);
      URL.revokeObjectURL(img.src);
    };
  };

  const processImage = useCallback(
    (colorSpace: "ycbcr" | "hsv", conversionFunction: (rgb: RGB) => any) => {
      if (!originalImageData) return;
      const canvas = colorSpace === "ycbcr" ? ycbcrCanvasRef.current : hsvCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = originalImageData.width;
      canvas.height = originalImageData.height;

      const newImageData = ctx.createImageData(originalImageData.width, originalImageData.height);
      const factor = adjustments[colorSpace];

      for (let i = 0; i < originalImageData.data.length; i += 4) {
        const rgb: RGB = {
          r: originalImageData.data[i],
          g: originalImageData.data[i + 1],
          b: originalImageData.data[i + 2],
        };
        const converted = conversionFunction(rgb);

        if (colorSpace === "ycbcr") {
          newImageData.data[i] = (converted.cr * factor.cr) / 100;
          newImageData.data[i + 1] = (converted.y * factor.y) / 100;
          newImageData.data[i + 2] = (converted.cb * factor.cb) / 100;
        } else {
          newImageData.data[i] = (converted.h / 360) * 255;
          newImageData.data[i + 1] = converted.s * factor.s * 2.55;
          newImageData.data[i + 2] = converted.v * factor.v * 2.55;
        }
        newImageData.data[i + 3] = originalImageData.data[i + 3];
      }

      ctx.putImageData(newImageData, 0, 0);
    },
    [originalImageData, adjustments]
  );

  useEffect(() => {
    processImage("ycbcr", rgbToYCbCr);
    processImage("hsv", rgbToHSV);
  }, [processImage]);

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <canvas ref={originalCanvasRef}></canvas>
      <canvas ref={ycbcrCanvasRef}></canvas>
      <canvas ref={hsvCanvasRef}></canvas>
    </div>
  );
};

export default ColorSpaceConverter;

const rgbToYCbCr = (rgb: RGB): YCbCr => {
  const r = rgb.r / 255,
    g = rgb.g / 255,
    b = rgb.b / 255;
  return {
    y: 0.299 * r + 0.587 * g + 0.114 * b,
    cb: -0.169 * r - 0.331 * g + 0.5 * b + 0.5,
    cr: 0.5 * r - 0.419 * g - 0.081 * b + 0.5,
  };
};

const rgbToHSV = (rgb: RGB): HSV => {
  const r = rgb.r / 255,
    g = rgb.g / 255,
    b = rgb.b / 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b),
    d = max - min;
  let h = 0;
  if (d !== 0) {
    h =
      max === r
        ? ((g - b) / d) % 6
        : max === g
        ? (b - r) / d + 2
        : (r - g) / d + 4;
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }
  return { h, s: max === 0 ? 0 : d / max, v: max };
};


