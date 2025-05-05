import React from 'react';

interface ColorChannelProps {
  title: string;
  description: string;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

const ColorChannel: React.FC<ColorChannelProps> = ({
  title,
  description,
  canvasRef,
}) => {
  return (
    <>
      <style>
        {`
          .color-channel {
            flex: 1;
            min-width: 16rem;
            background: #1a1b1e;
            border-radius: 0.75rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
            padding: 1.5rem;
            margin: 1rem;
            transition: all 0.3s ease;
            border: 1px solid #2d2e32;
          }
          
          .color-channel:hover {
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
            transform: translateY(-2px);
            border-color: #3b82f6;
          }
          
          .channel-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: #e2e8f0;
            margin-bottom: 0.75rem;
            letter-spacing: -0.025em;
          }
          
          .channel-description {
            font-size: 0.875rem;
            color: #cbd5e0;
            margin-bottom: 1rem;
            line-height: 1.5;
          }
          
          .canvas-container {
            position: relative;
            border-radius: 0.5rem;
            overflow: hidden;
            border: 2px solid #3b82f6;
            transition: all 0.3s ease;
            background: #0f1012;
          }
          
          .canvas-container:hover {
            border-color: #60a5fa;
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
          }
          
          .canvas-container canvas {
            width: 100%;
            height: auto;
            display: block;
          }
          
          .canvas-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(to top, rgba(0, 0, 0, 0.1), transparent);
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
            border-radius: 0.5rem;
          }
          
          .canvas-container:hover .canvas-overlay {
            opacity: 1;
          }
        `}
      </style>
      <div className="color-channel">
        <h3 className="channel-title">{title}</h3>
        <p className="channel-description">{description}</p>
        <div className="canvas-container">
          <canvas ref={canvasRef} />
          <div className="canvas-overlay" />
        </div>
      </div>
    </>
  );
};

export default ColorChannel; 