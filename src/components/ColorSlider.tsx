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
    <>
      <div className="slider-container">
        <div className="label-container">
          <span className="slider-label">{label}</span>
          <span className="slider-value">{value}%</span>
        </div>
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="slider-input"
        />
      </div>
    </>
  );
};

export default ColorSlider; 