import './index.css'
import React from 'react';
import ReactDOM from 'react-dom/client';
import ColorSpaceConverter from './src/components/ColorSpaceConverter';
import Navbar from './src/components/Navbar';
import Features from './src/pages/Features';
import About from './src/pages/About';
import Documentation from "./src/pages/Documentation";
import {BrowserRouter, Route, Routes} from "react-router-dom";


const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <main className='p-4'>
          <Routes>
              <Route path="/" element={<ColorSpaceConverter/>}/>
              <Route path="/features" element={<Features/>}/>
              <Route path="/about" element={<About/>}/>
              <Route path="/documentation" element={<Documentation/>} />
          </Routes>
      </main>
    </BrowserRouter>
  );
};

const root = document.getElementById('root');

if (root) {
  ReactDOM.createRoot(root).render(<App />);
}
