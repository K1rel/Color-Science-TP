import React, { useState, useRef, useEffect } from 'react';

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
  ycbcr: {
    y: number;
    cb: number;
    cr: number;
  };
  hsv: {
    h: number;
    s: number;
    v: number;
  };
}

const ColorSpaceConverter = () => {
  const originalCanvasRef = useRef<HTMLCanvasElement>(null);
  const ycbcrCanvasRef = useRef<HTMLCanvasElement>(null);
  const hsvCanvasRef = useRef<HTMLCanvasElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [originalImageData, setOriginalImageData] = useState<ImageData | null>(null);
  const [adjustments, setAdjustments] = useState<ColorAdjustments>({
    ycbcr: { y: 100, cb: 100, cr: 100 },
    hsv: { h: 100, s: 100, v: 100 }
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      const originalCanvas = originalCanvasRef.current;
      const ycbcrCanvas = ycbcrCanvasRef.current;
      const hsvCanvas = hsvCanvasRef.current;
      
      if (!originalCanvas || !ycbcrCanvas || !hsvCanvas) return;

      const width = img.width;
      const height = img.height;
      
      [originalCanvas, ycbcrCanvas, hsvCanvas].forEach(canvas => {
        canvas.width = width;
        canvas.height = height;
      });

      const originalCtx = originalCanvas.getContext('2d');
      if (!originalCtx) return;
      
      originalCtx.drawImage(img, 0, 0);
      const imageData = originalCtx.getImageData(0, 0, width, height);
      setOriginalImageData(imageData);
      setImageLoaded(true);
    };
  };

  const rgbToYCbCr = (rgb: RGB): YCbCr => {
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;

    const y = 0.299 * r + 0.587 * g + 0.114 * b;
    const cb = -0.169 * r - 0.3313 * g + 0.5 * b + 0.5;
    const cr = 0.5 * r - 0.4187 * g - 0.0813 * b + 0.5;

    return { y, cb, cr };
  };

  const rgbToHSV = (rgb: RGB): HSV => {
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;

    let h = 0;
    if (diff === 0) {
      h = 0;
    } else if (max === r) {
      h = 60 * (((g - b) / diff) % 6);
    } else if (max === g) {
      h = 60 * ((b - r) / diff + 2);
    } else {
      h = 60 * ((r - g) / diff + 4);
    }

    if (h < 0) h += 360;

    const s = max === 0 ? 0 : diff / max;
    const v = max;

    return { h, s, v };
  };

  const processYCbCr = (imageData: ImageData) => {
    const canvas = ycbcrCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const newImageData = ctx.createImageData(imageData.width, imageData.height);
    const { y: yFactor, cb: cbFactor, cr: crFactor } = adjustments.ycbcr;

    for (let i = 0; i < imageData.data.length; i += 4) {
      const rgb: RGB = {
        r: imageData.data[i],
        g: imageData.data[i + 1],
        b: imageData.data[i + 2],
      };

      const ycbcr = rgbToYCbCr(rgb);

      
      const adjustedY = ycbcr.y * (yFactor / 100);
      const adjustedCb = 0.5 + (ycbcr.cb - 0.5) * (cbFactor / 100);
      const adjustedCr = 0.5 + (ycbcr.cr - 0.5) * (crFactor / 100);

      newImageData.data[i] = adjustedCr * 255;
      newImageData.data[i + 1] = adjustedY * 255;
      newImageData.data[i + 2] = adjustedCb * 255;
      newImageData.data[i + 3] = imageData.data[i + 3];
    }

    ctx.putImageData(newImageData, 0, 0);
  };

  const processHSV = (imageData: ImageData) => {
    const canvas = hsvCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const newImageData = ctx.createImageData(imageData.width, imageData.height);
    const { h: hFactor, s: sFactor, v: vFactor } = adjustments.hsv;

    for (let i = 0; i < imageData.data.length; i += 4) {
      const rgb: RGB = {
        r: imageData.data[i],
        g: imageData.data[i + 1],
        b: imageData.data[i + 2],
      };

      const hsv = rgbToHSV(rgb);


      const adjustedH = hsv.h * (hFactor / 100);
      const adjustedS = hsv.s * (sFactor / 100);
      const adjustedV = hsv.v * (vFactor / 100);

      newImageData.data[i] = (adjustedH / 360) * 255;
      newImageData.data[i + 1] = adjustedS * 255;
      newImageData.data[i + 2] = adjustedV * 255;
      newImageData.data[i + 3] = imageData.data[i + 3];
    }

    ctx.putImageData(newImageData, 0, 0);
  };

  const handleSliderChange = (colorSpace: 'ycbcr' | 'hsv', channel: string, value: number) => {
    setAdjustments(prev => ({
      ...prev,
      [colorSpace]: {
        ...prev[colorSpace],
        [channel]: value
      }
    }));
  };

  useEffect(() => {
    if (originalImageData) {
      processYCbCr(originalImageData);
      processHSV(originalImageData);
    }
  }, [originalImageData, adjustments]);

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="mb-6">
        <input 
          type="file" 
          id="imageInput" 
          accept="image/*" 
          onChange={handleImageUpload}
          className="p-2 border rounded mb-4"
        />
      </div>

      <div className="flex flex-wrap gap-8">
        <div className="flex-1 min-w-64">
          <h3 className="text-xl font-bold mb-2">Original</h3>
          <canvas ref={originalCanvasRef} className="border border-gray-300 w-full h-auto"></canvas>
        </div>

        <div className="flex-1 min-w-64">
          <h3 className="text-xl font-bold mb-2">YCbCr</h3>
          <div className="mb-4">
            <div className="mb-2">
              <label className="block text-sm font-medium">Y: {adjustments.ycbcr.y}%</label>
              <input 
                type="range" 
                min="0" 
                max="200" 
                value={adjustments.ycbcr.y} 
                onChange={e => handleSliderChange('ycbcr', 'y', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium">Cb: {adjustments.ycbcr.cb}%</label>
              <input 
                type="range" 
                min="0" 
                max="200" 
                value={adjustments.ycbcr.cb} 
                onChange={e => handleSliderChange('ycbcr', 'cb', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium">Cr: {adjustments.ycbcr.cr}%</label>
              <input 
                type="range" 
                min="0" 
                max="200" 
                value={adjustments.ycbcr.cr} 
                onChange={e => handleSliderChange('ycbcr', 'cr', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
          <canvas ref={ycbcrCanvasRef} className="border border-gray-300 w-full h-auto"></canvas>
        </div>

        <div className="flex-1 min-w-64">
          <h3 className="text-xl font-bold mb-2">HSV</h3>
          <div className="mb-4">
            <div className="mb-2">
              <label className="block text-sm font-medium">H: {adjustments.hsv.h}%</label>
              <input 
                type="range" 
                min="0" 
                max="200" 
                value={adjustments.hsv.h} 
                onChange={e => handleSliderChange('hsv', 'h', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium">S: {adjustments.hsv.s}%</label>
              <input 
                type="range" 
                min="0" 
                max="200" 
                value={adjustments.hsv.s} 
                onChange={e => handleSliderChange('hsv', 's', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium">V: {adjustments.hsv.v}%</label>
              <input 
                type="range" 
                min="0" 
                max="200" 
                value={adjustments.hsv.v} 
                onChange={e => handleSliderChange('hsv', 'v', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
          <canvas ref={hsvCanvasRef} className="border border-gray-300 w-full h-auto"></canvas>
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