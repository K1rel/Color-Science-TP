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
            background: white;
            border-radius: 0.75rem;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
          }

          .adjustments-container:hover {
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          }

          .adjustments-title {
            font-size: 1.25rem;
            font-weight: 600;
            color: #1F2937;
            margin-bottom: 1.25rem;
            padding-bottom: 0.75rem;
            border-bottom: 2px solid #E5E7EB;
          }

          .sliders-group {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
          }

          .ycbcr .adjustments-title {
            color: #2563EB;
          }

          .hsv .adjustments-title {
            color: #7C3AED;
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