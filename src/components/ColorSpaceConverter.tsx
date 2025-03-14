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
  const [originalImageData, setOriginalImageData] = useState<ImageData | null>(
    null
  );

  const [adjustments, setAdjustments] = useState<ColorAdjustments>({
    // 100% = no change, 0% = remove component entirely
    ycbcr: { y: 100, cb: 100, cr: 100 },
    hsv: { h: 100, s: 100, v: 100 },
  });

  // ---- HELPER FUNCTIONS ----

  // Clamp a value to [0..255] and round.
  function clamp(value: number): number {
    return Math.round(Math.max(0, Math.min(255, value)));
  }

  // Convert RGB [0..255] to YCbCr in [0..1], with 0.5 offsets for Cb/Cr.
  function rgbToYCbCr(rgb: RGB): YCbCr {
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;
    const y = 0.299 * r + 0.587 * g + 0.114 * b;
    const cb = -0.169 * r - 0.331 * g + 0.5 * b + 0.5;
    const cr = 0.5 * r - 0.419 * g - 0.081 * b + 0.5;
    return { y, cb, cr };
  }

  // Convert YCbCr [0..1] back to RGB [0..255].
  function ycbcrToRgb(y: number, cb: number, cr: number): RGB {
    const R = (y + 1.402 * (cr - 0.5)) * 255;
    const G =
      (y -
        0.344136 * (cb - 0.5) -
        0.714136 * (cr - 0.5)) *
      255;
    const B = (y + 1.772 * (cb - 0.5)) * 255;
    return {
      r: clamp(R),
      g: clamp(G),
      b: clamp(B),
    };
  }

  // Convert RGB [0..255] to HSV (h in [0..360], s,v in [0..1]).
  function rgbToHSV(rgb: RGB): HSV {
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

  // Convert HSV (h in [0..360], s,v in [0..1]) back to RGB [0..255].
  function hsvToRgb(h: number, s: number, v: number): RGB {
    const c = v * s; // chroma
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
      // 300 <= h < 360
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

  // ---- IMAGE UPLOAD ----
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

<<<<<<< HEAD
  // ---- PROCESSING ----
=======

  
>>>>>>> 3fced2a (promeni)
  const processImage = useCallback(
    (colorSpace: "ycbcr" | "hsv") => {
      if (!originalImageData) return;

      const canvas =
        colorSpace === "ycbcr"
          ? ycbcrCanvasRef.current
          : hsvCanvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = originalImageData.width;
      canvas.height = originalImageData.height;

      const newImageData = ctx.createImageData(
        originalImageData.width,
        originalImageData.height
      );

      const factor = adjustments[colorSpace];

      for (let i = 0; i < originalImageData.data.length; i += 4) {
        const r = originalImageData.data[i];
        const g = originalImageData.data[i + 1];
        const b = originalImageData.data[i + 2];
        const alpha = originalImageData.data[i + 3];

<<<<<<< HEAD
        // Convert from RGB
        if (colorSpace === "ycbcr") {
          const { y, cb, cr } = rgbToYCbCr({ r, g, b });
          // factor.y, factor.cb, factor.cr range [0..100]
          const yAdj = y * (factor.y / 100);
          // shift cb/cr around 0.5
          const cbAdj = 0.5 + (cb - 0.5) * (factor.cb / 100);
          const crAdj = 0.5 + (cr - 0.5) * (factor.cr / 100);

          const { r: rOut, g: gOut, b: bOut } = ycbcrToRgb(yAdj, cbAdj, crAdj);

          newImageData.data[i] = rOut;
          newImageData.data[i + 1] = gOut;
          newImageData.data[i + 2] = bOut;
          newImageData.data[i + 3] = alpha;
        } else {
          // HSV
          const { h, s, v } = rgbToHSV({ r, g, b });
          // factor.h, factor.s, factor.v range [0..100]
          const hAdj = h * (factor.h / 100);
          const sAdj = s * (factor.s / 100);
          const vAdj = v * (factor.v / 100);

          const { r: rOut, g: gOut, b: bOut } = hsvToRgb(hAdj, sAdj, vAdj);

          newImageData.data[i] = rOut;
          newImageData.data[i + 1] = gOut;
          newImageData.data[i + 2] = bOut;
          newImageData.data[i + 3] = alpha;
=======
        
        if (colorSpace === "ycbcr") {
          newImageData.data[i] = Math.min(255, Math.max(0, (converted.cr * factor.cr) / 100));
          console.log(newImageData.data[i]);
          newImageData.data[i + 1] = Math.min(255, Math.max(0, (converted.y * factor.y) / 100));
          newImageData.data[i + 2] = Math.min(255, Math.max(0, (converted.cb * factor.cb) / 100));
        } else {
          newImageData.data[i] = Math.min(255, Math.max(0, (converted.h / 360) * 255));
          console.log(newImageData.data[i]);
          newImageData.data[i + 1] = Math.min(255, Math.max(0, converted.s * factor.s * 2.55));
          newImageData.data[i + 2] = Math.min(255, Math.max(0, converted.v * factor.v * 2.55));
>>>>>>> 3fced2a (promeni)
        }
      }

      ctx.putImageData(newImageData, 0, 0);
    },
    [originalImageData, adjustments]
  );

  useEffect(() => {
    processImage("ycbcr");
    processImage("hsv");
  }, [processImage]);

  // ---- RENDER ----
  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="mb-6">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="p-2 border rounded mb-4"
        />
      </div>

      <div className="flex flex-wrap gap-8">
        {/* Original Canvas */}
        <div className="flex-1 min-w-64">
          <h3 className="text-xl font-bold mb-2">Original</h3>
          <canvas
            ref={originalCanvasRef}
            className="border border-gray-300 w-full h-auto"
          />
        </div>

        {/* YCbCr Canvas and Sliders */}
        <div className="flex-1 min-w-64">
          <h3 className="text-xl font-bold mb-2">YCbCr</h3>
          <div className="mb-4">
            {/* Y */}
            <div className="mb-2 flex items-center">
              <div className="w-28 flex justify-between">
                <span className="text-sm font-medium">Y:</span>
                <span className="text-sm font-mono text-right">
                  {adjustments.ycbcr.y}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={adjustments.ycbcr.y}
                onChange={(e) =>
                  setAdjustments((prev) => ({
                    ...prev,
                    ycbcr: { ...prev.ycbcr, y: parseInt(e.target.value) },
                  }))
                }
                className="w-full ml-2"
              />
            </div>
            {/* Cb */}
            <div className="mb-2 flex items-center">
              <div className="w-28 flex justify-between">
                <span className="text-sm font-medium">Cb:</span>
                <span className="text-sm font-mono text-right">
                  {adjustments.ycbcr.cb}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={adjustments.ycbcr.cb}
                onChange={(e) =>
                  setAdjustments((prev) => ({
                    ...prev,
                    ycbcr: { ...prev.ycbcr, cb: parseInt(e.target.value) },
                  }))
                }
                className="w-full ml-2"
              />
            </div>
            {/* Cr */}
            <div className="mb-2 flex items-center">
              <div className="w-28 flex justify-between">
                <span className="text-sm font-medium">Cr:</span>
                <span className="text-sm font-mono text-right">
                  {adjustments.ycbcr.cr}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={adjustments.ycbcr.cr}
                onChange={(e) =>
                  setAdjustments((prev) => ({
                    ...prev,
                    ycbcr: { ...prev.ycbcr, cr: parseInt(e.target.value) },
                  }))
                }
                className="w-full ml-2"
              />
            </div>
          </div>
          <canvas
            ref={ycbcrCanvasRef}
            className="border border-gray-300 w-full h-auto"
          />
        </div>

        {/* HSV Canvas and Sliders */}
        <div className="flex-1 min-w-64">
          <h3 className="text-xl font-bold mb-2">HSV</h3>
          <div className="mb-4">
            {/* H */}
            <div className="mb-2 flex items-center">
              <div className="w-28 flex justify-between">
                <span className="text-sm font-medium">H:</span>
                <span className="text-sm font-mono text-right">
                  {adjustments.hsv.h}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={adjustments.hsv.h}
                onChange={(e) =>
                  setAdjustments((prev) => ({
                    ...prev,
                    hsv: { ...prev.hsv, h: parseInt(e.target.value) },
                  }))
                }
                className="w-full ml-2"
              />
            </div>
            {/* S */}
            <div className="mb-2 flex items-center">
              <div className="w-28 flex justify-between">
                <span className="text-sm font-medium">S:</span>
                <span className="text-sm font-mono text-right">
                  {adjustments.hsv.s}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={adjustments.hsv.s}
                onChange={(e) =>
                  setAdjustments((prev) => ({
                    ...prev,
                    hsv: { ...prev.hsv, s: parseInt(e.target.value) },
                  }))
                }
                className="w-full ml-2"
              />
            </div>
            {/* V */}
            <div className="mb-2 flex items-center">
              <div className="w-28 flex justify-between">
                <span className="text-sm font-medium">V:</span>
                <span className="text-sm font-mono text-right">
                  {adjustments.hsv.v}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={adjustments.hsv.v}
                onChange={(e) =>
                  setAdjustments((prev) => ({
                    ...prev,
                    hsv: { ...prev.hsv, v: parseInt(e.target.value) },
                  }))
                }
                className="w-full ml-2"
              />
            </div>
          </div>
          <canvas
            ref={hsvCanvasRef}
            className="border border-gray-300 w-full h-auto"
          />
        </div>
      </div>

      {!imageLoaded && (
        <div className="mt-8 p-4 bg-gray-100 rounded text-center">
          Please upload an image to begin
        </div>
      )}
    </div>
  );
};

export default ColorSpaceConverter;
