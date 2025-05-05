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
            background: white;
            border-radius: 0.75rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            padding: 1.5rem;
            margin: 1rem;
            transition: box-shadow 0.3s ease;
          }
          
          .color-channel:hover {
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          }
          
          .channel-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 0.75rem;
            letter-spacing: -0.025em;
          }
          
          .channel-description {
            font-size: 0.875rem;
            color: #4b5563;
            margin-bottom: 1rem;
            line-height: 1.5;
          }
          
          .canvas-container {
            position: relative;
            border-radius: 0.5rem;
            overflow: hidden;
            border: 2px solid #e5e7eb;
            transition: all 0.3s ease;
          }
          
          .canvas-container:hover {
            border-color: #3b82f6;
            box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          
          .canvas-container canvas {
            width: 100%;
            height: auto;
            display: block;
          }
          
          .canvas-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(to top, rgba(0, 0, 0, 0.05), transparent);
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