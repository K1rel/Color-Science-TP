import './index.css'
import React from 'react';
import ReactDOM from 'react-dom/client';
import ColorSpaceConverter from './src/components/ColorSpaceConverter';
import Navbar from './src/components/Navbar';


const App = () => {
  return (
    <div>
      <Navbar />
      <main className='p-4'>
        <ColorSpaceConverter />
      </main>
    </div>
  );
};

const root = document.getElementById('root');

if (root) {
  ReactDOM.createRoot(root).render(<App />);
}
