import React, { useState, useRef, useEffect, useCallback } from "react";
import ColorSpaceAdjustments from "./ColorSpaceAdjustments";
import ColorChannel from "./ColorChannel";
import { processImage, processComponentCanvases } from "../utils/imageProcessing";
import { ColorAdjustments } from "../types/color";

const ColorSpaceConverter = () => {
  // Canvas refs
  const originalCanvasRef = useRef<HTMLCanvasElement>(null);
  const ycbcrCanvasRef = useRef<HTMLCanvasElement>(null);
  const hsvCanvasRef = useRef<HTMLCanvasElement>(null);
  
  const yCanalCanvasRef = useRef<HTMLCanvasElement>(null);
  const cbCanalCanvasRef = useRef<HTMLCanvasElement>(null);
  const crCanalCanvasRef = useRef<HTMLCanvasElement>(null);
  
  const hCanalCanvasRef = useRef<HTMLCanvasElement>(null);
  const sCanalCanvasRef = useRef<HTMLCanvasElement>(null);
  const vCanalCanvasRef = useRef<HTMLCanvasElement>(null);

  // State
  const [imageLoaded, setImageLoaded] = useState(false);
  const [originalImageData, setOriginalImageData] = useState<ImageData | null>(null);
  const [adjustments, setAdjustments] = useState<ColorAdjustments>({
    ycbcr: { y: 100, cb: 100, cr: 100 },
    hsv: { h: 100, s: 100, v: 100 },
  });

  // Image upload handler
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

  // Adjustment handler
  const handleAdjustmentChange = (type: 'ycbcr' | 'hsv', key: string, value: number) => {
    setAdjustments((prev) => ({
      ...prev,
      [type]: { ...prev[type], [key]: value },
    }));
  };

  // Image processing
  const processImageWithAdjustments = useCallback(
    (colorSpace: "ycbcr" | "hsv") => {
      if (!originalImageData) return;

      const canvas = colorSpace === "ycbcr" ? ycbcrCanvasRef.current : hsvCanvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = originalImageData.width;
      canvas.height = originalImageData.height;

      const newImageData = processImage(originalImageData, colorSpace, adjustments);
      ctx.putImageData(newImageData, 0, 0);
    },
    [originalImageData, adjustments]
  );

  const processAllComponentCanvases = useCallback(() => {
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
    });

    processComponentCanvases(originalImageData, contexts);
  }, [originalImageData]);

  // Effects
  useEffect(() => {
    if (!originalImageData) return;
    processAllComponentCanvases();
  }, [originalImageData, processAllComponentCanvases]);

  useEffect(() => {
    if (!originalImageData) return;
    const id = requestAnimationFrame(() => {
      processImageWithAdjustments("ycbcr");
      processImageWithAdjustments("hsv");
    });
    return () => cancelAnimationFrame(id);
  }, [adjustments, originalImageData, processImageWithAdjustments]);

  // Render
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
          <ColorSpaceAdjustments
            type="ycbcr"
            values={adjustments.ycbcr}
            onChange={handleAdjustmentChange}
          />
          <canvas
            ref={ycbcrCanvasRef}
            className="border border-gray-300 w-full h-auto"
          />
        </div>

        <div className="flex-1 min-w-64">
          <h3 className="text-xl font-bold mb-2">HSV</h3>
          <ColorSpaceAdjustments
            type="hsv"
            values={adjustments.hsv}
            onChange={handleAdjustmentChange}
          />
          <canvas
            ref={hsvCanvasRef}
            className="border border-gray-300 w-full h-auto"
          />
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4 mt-8">YCbCr Individual Components</h2>
      <div className="flex flex-wrap gap-8 mb-8">
        <ColorChannel
          title="Y Only (Luminance)"
          description="Shows only luminance information (grayscale)"
          canvasRef={yCanalCanvasRef}
        />
        <ColorChannel
          title="Cb Only (Blue-Yellow)"
          description="Shows only blue-yellow chrominance"
          canvasRef={cbCanalCanvasRef}
        />
        <ColorChannel
          title="Cr Only (Red-Green)"
          description="Shows only red-green chrominance"
          canvasRef={crCanalCanvasRef}
        />
      </div>

      <h2 className="text-2xl font-bold mb-4 mt-8">HSV Individual Components</h2>
      <div className="flex flex-wrap gap-8">
        <ColorChannel
          title="H Only (Hue)"
          description="Shows only color information (full saturation)"
          canvasRef={hCanalCanvasRef}
        />
        <ColorChannel
          title="S Only (Saturation)"
          description="Shows only saturation levels as red"
          canvasRef={sCanalCanvasRef}
        />
        <ColorChannel
          title="V Only (Value/Brightness)"
          description="Shows only brightness information (grayscale)"
          canvasRef={vCanalCanvasRef}
        />
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