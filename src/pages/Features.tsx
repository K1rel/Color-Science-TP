// src/pages/Features.tsx
import React from 'react';

const FEATURES = [
    {
        icon: '🖼️',
        title: 'Image Upload & Preview',
        description:
            'Select any image from your device and immediately see it loaded into the converter.',
    },
    {
        icon: '🔍',
        title: 'Original vs. Converted Views',
        description:
            'Side-by-side comparison of the original image and its transformed versions.',
    },
    {
        icon: '🎨',
        title: 'YCbCr Color Space',
        description:
            'Switch to YCbCr and adjust luminance (Y) and chrominance (Cb & Cr) channels independently.',
    },
    {
        icon: '🌈',
        title: 'HSV Color Space',
        description:
            'Toggle to HSV for hue, saturation, and value controls on your image.',
    },
    {
        icon: '🎚️',
        title: 'Interactive Sliders',
        description:
            'Fine-tune each channel with smooth sliders that update the preview in real time.',
    },
    {
        icon: '🔴',
        title: 'Component Isolation',
        description:
            'Inspect individual channels in isolation—Y-only, Cb-only, Cr-only, H-only, S-only, or V-only.',
    },
    {
        icon: '🌑',
        title: 'Dark Theme UI',
        description:
            'Enjoy a sleek, eye-friendly dark interface throughout the app.',
    },
    {
        icon: '📱',
        title: 'Responsive Layout',
        description:
            'Our design adapts seamlessly from desktop to mobile.',
    },

    {
        icon: '🔧',
        title: 'Modular & Extensible',
        description:
            'Built with React & TypeScript and easily extended via utility modules.',
    },
    {
        icon: '📖',
        title: 'Built-in Documentation',
        description:
            'Quick links to in-app docs so you can learn how each color space works.',
    },
];

export default function Features() {
    return (
        <div className="features-container">
            <div className="components-section max-w-4xl mx-auto space-y-8">
                <h1 className="components-title text-center">Features</h1>
                {FEATURES.map(({ icon, title, description }) => (
                    <div key={title} className="about-section">
                        <h2 className="section-title flex items-center gap-2">
                            <span className="inline-block">{icon}</span>
                            {title}
                        </h2>
                        <p className="leading-relaxed text-gray-400">{description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
