// src/pages/About.tsx
import React from 'react';

export default function About() {
    return (
        <div className="about-container">
            <div className="components-section max-w-4xl mx-auto space-y-8">
                <h1 className="components-title text-center">About</h1>

                <div className="about-section">
                    <h2 className="section-title">What is Color Space Converter?</h2>
                    <p className="leading-relaxed">
                        Color Space Converter is a web-based tool that lets you explore and manipulate your images
                        across different color spaces—right in your browser. Whether you're a developer, designer,
                        or photography enthusiast, you can fine-tune luminance, chrominance, hue, saturation, and
                        value with smooth sliders and see instant results.
                    </p>
                </div>


                <div className="about-section">
                    <h2 className="section-title">Tech Stack</h2>
                    <ul className="list-disc pl-5 leading-relaxed">
                        <li><strong>React & TypeScript</strong> – Component-driven UI with strong typing</li>
                        <li><strong>Vite</strong> – Superfast dev server & hot-module replacement</li>
                        <li><strong>Tailwind CSS</strong> – Utility-first styling for our dark theme</li>
                        <li><strong>HTML Canvas API</strong> – Pixel-level rendering & high performance</li>
                    </ul>
                </div>

                <div className="about-section">
                    <h2 className="section-title">Getting Started</h2>
                    <p className="leading-relaxed ">
                        1. Clone the repo<br />
                        2. Run <code>npm install</code><br />
                        3. Run <code>npm run dev</code><br />
                        4. Visit <code>http://localhost:5173</code>
                    </p>
                </div>

                <div className="about-section">
                    <h2 className="section-title">Contributing</h2>
                    <p className="leading-relaxed">
                        Contributions are welcome! Open issues for bugs or feature requests, and send pull
                        requests on GitHub.
                    </p>
                </div>

                <div className="about-section">
                    <h2 className="section-title">Source</h2>
                    <p className="leading-relaxed">
                        The code is open-source. You can find the repo on GitHub - &nbsp;
                        <a href="https://github.com/K1rel/Color-Science-TP" className="text-blue-400 underline" target="_blank" rel="noopener noreferrer">github.com/K1rel/Color-Science-TP</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
