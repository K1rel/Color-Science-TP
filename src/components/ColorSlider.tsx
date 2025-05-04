import React from 'react';

interface ColorSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

const ColorSlider: React.FC<ColorSliderProps> = ({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
}) => {
  return (
    <div className="mb-2 flex items-center">
      <div className="w-28 flex justify-between">
        <span className="text-sm font-medium">{label}:</span>
        <span className="text-sm font-mono text-right">{value}%</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full ml-2"
      />
    </div>
  );
};

export default ColorSlider; 