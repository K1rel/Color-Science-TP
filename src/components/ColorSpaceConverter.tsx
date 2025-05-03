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
  
  const yCanalCanvasRef = useRef<HTMLCanvasElement>(null);
  const cbCanalCanvasRef = useRef<HTMLCanvasElement>(null);
  const crCanalCanvasRef = useRef<HTMLCanvasElement>(null);
  
  const hCanalCanvasRef = useRef<HTMLCanvasElement>(null);
  const sCanalCanvasRef = useRef<HTMLCanvasElement>(null);
  const vCanalCanvasRef = useRef<HTMLCanvasElement>(null);

  const [imageLoaded, setImageLoaded] = useState(false);
  const [originalImageData, setOriginalImageData] = useState<ImageData | null>(
    null
  );

  const [adjustments, setAdjustments] = useState<ColorAdjustments>({
    ycbcr: { y: 100, cb: 100, cr: 100 },
    hsv: { h: 100, s: 100, v: 100 },
  });

  function clamp(value: number): number {
    return Math.round(Math.max(0, Math.min(255, value)));
  }


  function rgbToYCbCr(rgb: RGB): YCbCr {
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;
    const y = 0.299 * r + 0.587 * g + 0.114 * b;
    const cb = -0.169 * r - 0.331 * g + 0.5 * b + 0.5;
    const cr = 0.5 * r - 0.419 * g - 0.081 * b + 0.5;
    return { y, cb, cr };
  }

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

  function hsvToRgb(h: number, s: number, v: number): RGB {
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

        if (colorSpace === "ycbcr") {
          const { y, cb, cr } = rgbToYCbCr({ r, g, b });
          
          const yAdj = factor.y > 0 ? y * (factor.y / 100) : 0.5;
          const cbAdj = factor.cb > 0 ? 0.5 + (cb - 0.5) * (factor.cb / 100) : 0.5;
          const crAdj = factor.cr > 0 ? 0.5 + (cr - 0.5) * (factor.cr / 100) : 0.5;

          const { r: rOut, g: gOut, b: bOut } = ycbcrToRgb(yAdj, cbAdj, crAdj);

          newImageData.data[i] = rOut;
          newImageData.data[i + 1] = gOut;
          newImageData.data[i + 2] = bOut;
          newImageData.data[i + 3] = alpha;
        } else {
       
          const { h, s, v } = rgbToHSV({ r, g, b });
          
          const hAdj = factor.h > 0 ? h * (factor.h / 100) : 0;
          const sAdj = factor.s > 0 ? s * (factor.s / 100) : 0;
          const vAdj = factor.v > 0 ? v * (factor.v / 100) : 1;

          const { r: rOut, g: gOut, b: bOut } = hsvToRgb(hAdj, sAdj, vAdj);

          newImageData.data[i] = rOut;
          newImageData.data[i + 1] = gOut;
          newImageData.data[i + 2] = bOut;
          newImageData.data[i + 3] = alpha;
        }
      }

      ctx.putImageData(newImageData, 0, 0);
    },
    [originalImageData, adjustments]
  );

  const processComponentCanvases = useCallback(() => {
    if (!originalImageData) return;

    const canvasRefs = {
      y: yCanalCanvasRef.current,
      cb: cbCanalCanvasRef.current,
      cr: crCanalCanvasRef.current,
      h: hCanalCanvasRef.current,
      s: sCanalCanvasRef.current,
      v: vCanalCanvasRef.current
    };
    
    const contexts: Record<string, CanvasRenderingContext2D | null> = {};
    Object.entries(canvasRefs).forEach(([key, canvas]) => {
      if (!canvas) return;
      
      canvas.width = originalImageData.width;
      canvas.height = originalImageData.height;
      contexts[key] = canvas.getContext("2d");
      
      if (contexts[key]) {
        const imageData = contexts[key]!.createImageData(
          originalImageData.width,
          originalImageData.height
        );
        contexts[key]!.putImageData(imageData, 0, 0);
      }
    });

    const imageDataObjects: Record<string, ImageData> = {};
    Object.entries(contexts).forEach(([key, ctx]) => {
      if (!ctx) return;
      imageDataObjects[key] = ctx.createImageData(
        originalImageData.width,
        originalImageData.height
      );
    });

    for (let i = 0; i < originalImageData.data.length; i += 4) {
      const r = originalImageData.data[i];
      const g = originalImageData.data[i + 1];
      const b = originalImageData.data[i + 2];
      const alpha = originalImageData.data[i + 3];
   
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
    
  }, [originalImageData]);

  // 1) Only run this once per new image.
  useEffect(() => {
    if (!originalImageData) return;
    processComponentCanvases();
  }, [originalImageData]);


  // 2) Throttle slider‐driven redraws via rAF,
  //    and stop re-generating the component canvases on every slider move.
  useEffect(() => {
    if (!originalImageData) return;
    // schedule one draw for this animation frame
    const id = requestAnimationFrame(() => {
      processImage("ycbcr");
      processImage("hsv");
    });
    return () => cancelAnimationFrame(id);
  }, [adjustments, originalImageData]);

  
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

      <div className="flex flex-wrap gap-8 mb-8">
       
        <div className="flex-1 min-w-64">
          <h3 className="text-xl font-bold mb-2">Original</h3>
          <canvas
            ref={originalCanvasRef}
            className="border border-gray-300 w-full h-auto"
          />
        </div>

        
        <div className="flex-1 min-w-64">
          <h3 className="text-xl font-bold mb-2">YCbCr</h3>
          <div className="mb-4">
            
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

  
      <h2 className="text-2xl font-bold mb-4 mt-8">YCbCr Individual Components</h2>
      <div className="flex flex-wrap gap-8 mb-8">
        <div className="flex-1 min-w-64">
          <h3 className="text-xl font-bold mb-2">Y Only (Luminance)</h3>
          <p className="text-sm mb-2">Shows only luminance information (grayscale)</p>
          <canvas
            ref={yCanalCanvasRef}
            className="border border-gray-300 w-full h-auto"
          />
        </div>
        
        <div className="flex-1 min-w-64">
          <h3 className="text-xl font-bold mb-2">Cb Only (Blue-Yellow)</h3>
          <p className="text-sm mb-2">Shows only blue-yellow chrominance</p>
          <canvas
            ref={cbCanalCanvasRef}
            className="border border-gray-300 w-full h-auto"
          />
        </div>
        
        <div className="flex-1 min-w-64">
          <h3 className="text-xl font-bold mb-2">Cr Only (Red-Green)</h3>
          <p className="text-sm mb-2">Shows only red-green chrominance</p>
          <canvas
            ref={crCanalCanvasRef}
            className="border border-gray-300 w-full h-auto"
          />
        </div>
      </div>
      
    
      <h2 className="text-2xl font-bold mb-4 mt-8">HSV Individual Components</h2>
      <div className="flex flex-wrap gap-8">
        <div className="flex-1 min-w-64">
          <h3 className="text-xl font-bold mb-2">H Only (Hue)</h3>
          <p className="text-sm mb-2">Shows only color information (full saturation)</p>
          <canvas
            ref={hCanalCanvasRef}
            className="border border-gray-300 w-full h-auto"
          />
        </div>
        
        <div className="flex-1 min-w-64">
          <h3 className="text-xl font-bold mb-2">S Only (Saturation)</h3>
          <p className="text-sm mb-2">Shows only saturation levels as red</p>
          <canvas
            ref={sCanalCanvasRef}
            className="border border-gray-300 w-full h-auto"
          />
        </div>
        
        <div className="flex-1 min-w-64">
          <h3 className="text-xl font-bold mb-2">V Only (Value/Brightness)</h3>
          <p className="text-sm mb-2">Shows only brightness information (grayscale)</p>
          <canvas
            ref={vCanalCanvasRef}
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