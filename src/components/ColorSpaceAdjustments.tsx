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

  if (type === 'ycbcr') {
    return (
      <div className="mb-4">
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
      </div>
    );
  }

  return (
    <div className="mb-4">
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
    </div>
  );
};

export default ColorSpaceAdjustments; 