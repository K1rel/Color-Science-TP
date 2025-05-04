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
    <div className="flex-1 min-w-64">
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-sm mb-2">{description}</p>
      <canvas
        ref={canvasRef}
        className="border border-gray-300 w-full h-auto"
      />
    </div>
  );
};

export default ColorChannel; 