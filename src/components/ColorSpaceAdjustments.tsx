import React from 'react';
import ColorSlider from './ColorSlider';

interface ColorSpaceAdjustmentsProps {
  type: 'ycbcr' | 'hsv';
  values: {
    y?: number;
    cb?: number;
    cr?: number;
    h?: number;
    s?: number;
    v?: number;
  };
  onChange: (type: 'ycbcr' | 'hsv', key: string, value: number) => void;
}

const ColorSpaceAdjustments: React.FC<ColorSpaceAdjustmentsProps> = ({
  type,
  values,
  onChange,
}) => {
  const handleChange = (key: string) => (value: number) => {
    onChange(type, key, value);
  };

  return (
    <>
      <style>
        {`
          .adjustments-container {
            background: #1a1b1e;
            border-radius: 0.75rem;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
            border: 1px solid #2d2e32;
          }

          .adjustments-container:hover {
            box-shadow: 0 8px 12px -1px rgba(0, 0, 0, 0.3);
            transform: translateY(-2px);
            border-color: #3b82f6;
          }

          .adjustments-title {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 1.25rem;
            padding-bottom: 0.75rem;
            border-bottom: 2px solid #3b82f6;
          }

          .sliders-group {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
          }

          .ycbcr {
            background: linear-gradient(to bottom right, #1a1b1e, #1e293b);
          }

          .hsv {
            background: linear-gradient(to bottom right, #1a1b1e, #312e81);
          }

          .ycbcr .adjustments-title {
            color: #93c5fd;
            text-shadow: 0 0 10px rgba(147, 197, 253, 0.2);
          }

          .hsv .adjustments-title {
            color: #c4b5fd;
            text-shadow: 0 0 10px rgba(196, 181, 253, 0.2);
          }

          .ycbcr .sliders-group {
            color: #bfdbfe;
          }

          .hsv .sliders-group {
            color: #ddd6fe;
          }
        `}
      </style>
      <div className={`adjustments-container ${type}`}>
        <h3 className="adjustments-title">
          {type === 'ycbcr' ? 'YCbCr Adjustments' : 'HSV Adjustments'}
        </h3>
        <div className="sliders-group">
          {type === 'ycbcr' ? (
            <>
              <ColorSlider
                label="Y"
                value={values.y || 100}
                onChange={handleChange('y')}
              />
              <ColorSlider
                label="Cb"
                value={values.cb || 100}
                onChange={handleChange('cb')}
              />
              <ColorSlider
                label="Cr"
                value={values.cr || 100}
                onChange={handleChange('cr')}
              />
            </>
          ) : (
            <>
              <ColorSlider
                label="H"
                value={values.h || 100}
                onChange={handleChange('h')}
              />
              <ColorSlider
                label="S"
                value={values.s || 100}
                onChange={handleChange('s')}
              />
              <ColorSlider
                label="V"
                value={values.v || 100}
                onChange={handleChange('v')}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ColorSpaceAdjustments; 