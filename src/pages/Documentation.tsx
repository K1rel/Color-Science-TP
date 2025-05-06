import React from 'react';

export default function Documentation() {
    return (
        <div className="docs-container">
            <div className="components-section max-w-4xl mx-auto space-y-8">
                <h1 className="components-title text-center">Documentation</h1>

                <section className="about-section">
                    <h2 className="section-title">1. Introduction</h2>
                    <p className="leading-relaxed">
                        Color Space Converter is a React + TypeScript web app that lets you upload images,
                        explore how they decompose into different color spaces (YCbCr & HSV), and interactively
                        adjust channels (luminance, chrominance, hue, saturation, value) with smooth sliders—all
                        rendered client-side in your browser.
                    </p>
                </section>

                <section className="about-section">
                    <h2 className="section-title">2. Quick Start</h2>
                    <pre className="bg-gray-700 p-4 rounded text-sm overflow-auto">
            <code>{`# Clone the repository
git clone https://github.com/K1rel/Color-Science-TP.git
cd Color-Science-TP

# Install dependencies
npm install

# Run in development mode
npm run dev

# Open your browser
http://localhost:5173`}</code>
          </pre>
                </section>

                <section className="about-section">
                    <h2 className="section-title">3. App Configuration (app.tsx)</h2>
                    <p className="leading-relaxed text-gray-400">
                        The root <code>App</code> component sets up React Router and links your pages:
                    </p>
                    <pre className="bg-gray-700 p-4 rounded text-sm overflow-auto">
            <code>{`import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ColorSpaceConverter from './components/ColorSpaceConverter';
import Features from './pages/Features';
import About from './pages/About';
import Documentation from './pages/Documentation';

export default function App() {
  return (
    <Router>
      <Navbar />
      <main className="converter-container">
        <Routes>
          <Route path="/" element={<ColorSpaceConverter />} />
          <Route path="/features" element={<Features />} />
          <Route path="/about" element={<About />} />
          <Route path="/documentation" element={<Documentation />} />
        </Routes>
      </main>
    </Router>
  );
}`}</code>
          </pre>
                </section>

                <section className="about-section">
                    <h2 className="section-title">4. Main Component (ColorSpaceConverter.tsx)</h2>
                    <p className="leading-relaxed text-gray-400">
                        <code>ColorSpaceConverter</code> handles image upload, stores raw pixel data, and
                        triggers canvas redraws whenever adjustments change:
                    </p>
                    <pre className="bg-gray-700 p-4 rounded text-sm overflow-auto">
            <code>{`useEffect(() => {
  if (!originalImageData) return;
  const id = requestAnimationFrame(() => {
    processImageWithAdjustments('ycbcr');
    processImageWithAdjustments('hsv');
  });
  return () => cancelAnimationFrame(id);
}, [adjustments, originalImageData, processImageWithAdjustments]);`}</code>
          </pre>
                </section>

                <section className="about-section">
                    <h2 className="section-title">5. Utility Functions (colorSpaceUtils.ts)</h2>
                    <pre className="bg-gray-700 p-4 rounded text-sm overflow-auto">
            <code>{`export function rgbToHsv({ r, g, b }: RGBColor): HSVColor { /* ... */ }
export function hsvToRgb({ h, s, v }: HSVColor): RGBColor { /* ... */ }
export function rgbToYcbcr({ r, g, b }: RGBColor): YCbCrColor { /* ... */ }
export function ycbcrToRgb({ y, cb, cr }: YCbCrColor): RGBColor { /* ... */ }`}</code>
          </pre>
                    <p className="text-gray-400 leading-relaxed">
                        These functions implement the standard mathematical conversions between RGB, HSV,
                        and YCbCr color spaces, used by <code>ColorSpaceConverter</code> to compute new
                        pixel values on each adjustment.
                    </p>
                </section>

                <section className="about-section">
                    <h2 className="section-title">6. Canvas Helpers (imageProcessing.ts)</h2>
                    <pre className="bg-gray-700 p-4 rounded text-sm overflow-auto">
            <code>{`export async function loadImage(url: string): Promise<HTMLImageElement> { /* ... */ }
export function getImageData(ctx: CanvasRenderingContext2D): ImageData { /* ... */ }
export function putImageData(
  ctx: CanvasRenderingContext2D,
  data: ImageData
): void { /* ... */ }`}</code>
          </pre>
                    <p className="text-gray-400 leading-relaxed">
                        Helpers for loading images into the canvas, extracting their raw pixel buffers,
                        and writing processed buffers back to the screen with high performance.
                    </p>
                </section>

                <section className="about-section">
                    <h2 className="section-title">7. Types (color.ts)</h2>
                    <pre className="bg-gray-700 p-4 rounded text-sm overflow-auto">
            <code>{`export interface RGBColor { r: number; g: number; b: number; }
export interface HSVColor { h: number; s: number; v: number; }
export interface YCbCrColor { y: number; cb: number; cr: number; }`}</code>
          </pre>
                </section>

                <section className="about-section">
                    <h2 className="section-title">8. Components Overview</h2>
                    <ul className="list-disc pl-5 leading-relaxed text-gray-300">
                        <li><strong>Navbar</strong> – Top navigation bar (<code>Navbar.tsx</code>).</li>
                        <li><strong>ColorSpaceConverter</strong> – Main orchestration (<code>ColorSpaceConverter.tsx</code>).</li>
                        <li><strong>ColorSpaceAdjustments</strong> – Slider groups (<code>ColorSpaceAdjustments.tsx</code>).</li>
                        <li><strong>ColorSlider</strong> – Individual slider (<code>ColorSlider.tsx</code>).</li>
                        <li><strong>ColorChannel</strong> – Single-channel canvas (<code>ColorChannel.tsx</code>).</li>
                    </ul>
                </section>

                <section className="about-section">
                    <h2 className="section-title">9. Styling (index.css)</h2>
                    <p className="leading-relaxed text-gray-400">
                        Global CSS is in <code>index.css</code> using Tailwind directives plus custom classes.
                        Key classes:
                    </p>
                    <ul className="list-disc pl-5 text-gray-300">
                        <li><code>.converter-container</code> – Main app wrapper.</li>
                        <li><code>.components-section</code> – Page section container.</li>
                        <li><code>.about-section</code> – Card panels for content blocks.</li>
                        <li><code>.slider-input</code> – Styled range inputs for sliders.</li>
                    </ul>
                </section>

                <section className="about-section">
                    <h2 className="section-title">10. Build & Deploy</h2>
                    <pre className="bg-gray-700 p-4 rounded text-sm overflow-auto">
            <code>{`# Produce optimized production build
npm run build

# Serve the contents of the dist/ directory
npx serve dist/`}</code>
          </pre>
                </section>

            </div>
        </div>
    );
}
