import React from 'react';
import ReactDOM from 'react-dom/client';
import ColorSpaceConverter from './src/components/ColorSpaceConverter';

const App = () => {
  return (
    <div>
      <h1>Color Space Converter</h1>
      <ColorSpaceConverter />
    </div>
  );
};

const root = document.getElementById('root');

if (root) {
  ReactDOM.createRoot(root).render(<App />);
}
