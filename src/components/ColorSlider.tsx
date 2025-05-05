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
            transition: background-color 0.2s ease;
          }

          .slider-container:hover {
            background-color: rgba(0, 0, 0, 0.02);
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
            color: #374151;
          }

          .slider-value {
            font-size: 0.875rem;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            color: #6B7280;
            min-width: 3rem;
            text-align: right;
          }

          .slider-input {
            flex: 1;
            -webkit-appearance: none;
            height: 6px;
            background: #E5E7EB;
            border-radius: 3px;
            outline: none;
            transition: background 0.2s ease;
          }

          .slider-input:hover {
            background: #D1D5DB;
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
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          .slider-input::-webkit-slider-thumb:hover {
            transform: scale(1.1);
            background: #2563EB;
          }

          .slider-input::-moz-range-thumb {
            width: 18px;
            height: 18px;
            background: #3B82F6;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          .slider-input::-moz-range-thumb:hover {
            transform: scale(1.1);
            background: #2563EB;
          }

          .slider-input:focus {
            outline: none;
          }

          .slider-input:focus::-webkit-slider-thumb {
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
          }

          .slider-input:focus::-moz-range-thumb {
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
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