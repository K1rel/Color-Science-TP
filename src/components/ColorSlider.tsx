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
      <style>
        {`
          .slider-container {
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 0.5rem;
            border-radius: 0.5rem;
            transition: all 0.2s ease;
          }

          .slider-container:hover {
            background-color: rgba(255, 255, 255, 0.05);
          }

          .label-container {
            width: 7rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .slider-label {
            font-size: 0.875rem;
            font-weight: 500;
            color: #e2e8f0;
          }

          .slider-value {
            font-size: 0.875rem;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            color: #93c5fd;
            min-width: 3rem;
            text-align: right;
          }

          .slider-input {
            flex: 1;
            -webkit-appearance: none;
            height: 6px;
            background: #374151;
            border-radius: 3px;
            outline: none;
            transition: all 0.2s ease;
          }

          .slider-input:hover {
            background: #4B5563;
          }

          .slider-input::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 18px;
            height: 18px;
            background: #3B82F6;
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          }

          .slider-input::-webkit-slider-thumb:hover {
            transform: scale(1.1);
            background: #60A5FA;
            box-shadow: 0 0 0 4px rgba(96, 165, 250, 0.2);
          }

          .slider-input::-moz-range-thumb {
            width: 18px;
            height: 18px;
            background: #3B82F6;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          }

          .slider-input::-moz-range-thumb:hover {
            transform: scale(1.1);
            background: #60A5FA;
            box-shadow: 0 0 0 4px rgba(96, 165, 250, 0.2);
          }

          .slider-input:focus {
            outline: none;
          }

          .slider-input:focus::-webkit-slider-thumb {
            box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3);
          }

          .slider-input:focus::-moz-range-thumb {
            box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3);
          }
        `}
      </style>
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