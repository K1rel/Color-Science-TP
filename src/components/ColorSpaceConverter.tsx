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
    <>
      <div className="converter-container">
        <div className="file-upload-container">
          <label className="file-upload-label">
            Choose an image to upload
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="file-upload-input"
            />
          </label>
        </div>

        <div className="main-images-container">
          <div className="image-section">
            <h3 className="section-title">Original</h3>
            <div className="canvas-container">
              <canvas
                ref={originalCanvasRef}
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>

          <div className="image-section">
            <h3 className="section-title">YCbCr</h3>
            <div className="canvas-container">
              <canvas
                ref={ycbcrCanvasRef}
                className="w-full h-auto rounded-lg"
              />
            </div>
            <ColorSpaceAdjustments
              type="ycbcr"
              values={adjustments.ycbcr}
              onChange={handleAdjustmentChange}
            />
          </div>

          <div className="image-section">
            <h3 className="section-title">HSV</h3>
            <div className="canvas-container">
              <canvas
                ref={hsvCanvasRef}
                className="w-full h-auto rounded-lg"
              />
            </div>
            <ColorSpaceAdjustments
              type="hsv"
              values={adjustments.hsv}
              onChange={handleAdjustmentChange}
            />
          </div>
        </div>

        <div className="components-section">
          <h2 className="components-title">YCbCr Individual Components</h2>
          <div className="components-grid">
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

          <h2 className="components-title">HSV Individual Components</h2>
          <div className="components-grid">
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
        </div>

        {!imageLoaded && (
          <div className="upload-prompt">
            Please upload an image to begin
          </div>
        )}
      </div>
    </>
  );
};

export default ColorSpaceConverter;