"use client";

import { useState, useEffect } from "react";
import { ColorPicker } from "react-color-pro";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiSun, FiMoon } from "react-icons/fi";

// Utility function to convert HEX to RGB and HSL
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b, string: `rgb(${r}, ${g}, ${b})` };
}

function hexToHsl(hex) {
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);
  return `hsl(${h}, ${s}%, ${l}%)`;
}

// Calculate WCAG contrast ratio for accessibility
function getContrastRatio(hex, bgColor) {
  const rgb = hexToRgb(hex);
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const L1 = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const L2 = bgColor === '#111827' ? 0.03 : 0.94;

  const contrast = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
  return contrast.toFixed(2);
}

function CopyButton({ textToCopy, className = '' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Copy failed!");
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`ml-2 inline-flex items-center px-3 py-1 text-sm font-medium rounded bg-blue-600 hover:bg-blue-700 text-white transition focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer ${className}`}
      aria-label="Copy command"
      title={copied ? "Copied!" : "Copy to clipboard"}
    >
      {copied ? (
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      )}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

export default function Home() {
  const [color, setColor] = useState("#14b8a6");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedColor = localStorage.getItem("appColor");
    const savedTheme = localStorage.getItem("appTheme");
    if (savedColor) setColor(savedColor);
    if (savedTheme === "dark") setDarkMode(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("appColor", color);
    localStorage.setItem("appTheme", darkMode ? "dark" : "light");
  }, [color, darkMode]);

  const features = [
    { title: "Ultra Lightweight", description: "~4.37 kB gzipped, no runtime dependencies except React." },
    { title: "Framework-Agnostic", description: "Works with React, Preact, Next.js, Remix, and more." },
    { title: "TypeScript Support", description: "Full type definitions for seamless TypeScript integration." },
    { title: "Customizable", description: "Tailwind CSS styles, compatible with Bootstrap or custom CSS." },
    { title: "Modular", description: "Includes HueSlider, SaturationPicker, and HexInput components." },
    { title: "Accessible", description: "Keyboard navigation and mobile-friendly design." },
  ];

  const comparisonData = [
    { name: "react-color-pro", size: "10.39 kB", gzipped: "4.37 kB", deps: 0 },
    { name: "react-colorful", size: "123 kB", gzipped: "48 kB", deps: 5 },
    { name: "react-color", size: "143.7 kB", gzipped: "36.4 kB", deps: 7 },
    { name: "react-input-color", size: "54.1 kB", gzipped: "18.7 kB", deps: 6 },
    { name: "rc-color-picker", size: "114.5 kB", gzipped: "32.8 kB", deps: 5 },
  ];

  const backgroundColor = darkMode ? "#111827" : "#f9fafb";
  const textColor = darkMode ? "#f9fafb" : "#1f2937";

  return (
    <div
      className="min-h-screen transition-all duration-300"
      style={{ backgroundColor, color: textColor }}
    >
      {/* Navbar */}
      <header className="fixed top-0 w-full z-10 shadow-md" style={{ backgroundColor: color }}>
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold" style={{ color: darkMode ? "#fff" : "#000" }}>
            react-color-pro
          </Link>
          <ul className="flex space-x-6 items-center text-sm">
            <li><Link href="#features" className="hover:underline">Features</Link></li>
            <li><Link href="#demo" className="hover:underline">Demo</Link></li>
            <li><Link href="#comparison" className="hover:underline">Comparison</Link></li>
            <li><Link href="#installation" className="hover:underline">Docs</Link></li>
            <li>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-full hover:/10 transition"
                style={{ color: darkMode ? "#fff" : "#000" }}
                title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
              </button>
            </li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-12 min-h-[70vh] flex flex-col items-center justify-center" style={{ backgroundColor: color }}>
        <div className="container mx-auto px-6 text-center">
          <motion.h1
            className="text-5xl font-extrabold mb-4"
            style={{ color: darkMode ? "#fff" : "#000" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            react-color-pro
          </motion.h1>
          <motion.p
            className="text-xl mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            A lightweight, framework-agnostic color picker for React. Zero dependencies. Customizable.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link
              href="#installation"
              className="border border-gray-300 dark:border-gray-700 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Get Started
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20 dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.h2
            className="text-4xl font-bold text-center mb-10  dark:text-white"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Live Color Preview
          </motion.h2>

          <div className="rounded-2xl shadow-xl  dark:bg-gray-800 p-8 grid gap-10 md:grid-cols-2 items-center">
            {/* Color Display + Preview */}
            <div className="space-y-6">
              <div className="w-full h-40 rounded-lg shadow-inner border border-gray-300 dark:border-gray-600"
                style={{ backgroundColor: color }}
              />
              <div className="grid grid-cols-1 gap-4">
                {[
                  { label: 'HEX', value: color },
                  { label: 'RGB', value: hexToRgb(color).string },
                  { label: 'HSL', value: hexToHsl(color) },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 rounded px-4 py-2">
                    <span className="font-medium text-sm text-gray-700 dark:text-gray-200">
                      {label}: <span className="ml-1 font-mono">{value}</span>
                    </span>
                    <CopyButton textToCopy={value} />
                  </div>
                ))}
                <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 rounded px-4 py-2">
                  <span className="text-sm text-gray-700 dark:text-gray-200">
                    Contrast Ratio: <span className="font-mono">{getContrastRatio(color, darkMode ? "#111827" : "#f9fafb")}</span>
                    <span className="ml-2 text-xs">
                      {getContrastRatio(color, darkMode ? "#111827" : "#f9fafb") >= 4.5 ? "(WCAG AA)" : "(Low)"}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div className="w-full max-w-md mx-auto space-y-6">
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
    Pick a Color
  </label>

  <div className="rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800 shadow-md p-10">
    <ColorPicker
      value={color}
      onChange={(newColor) => setColor(newColor.hex || newColor)}
      className="w-full"
      style={{ width: "100%", height: "160px" }} // ensures all internal sliders visible
    />
  </div>
</div>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12 dark:text-white relative">
            Key Features
            <span className="absolute left-1/2 transform -translate-x-1/2 bottom-[-8px] w-16 h-1 bg-blue-600 rounded-full"></span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="p-6  dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <h3 className="text-xl font-semibold mb-4  dark:text-gray-100">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Usage Examples - React (Basic Usage) */}
      <section id="usage-react" className="py-16 dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold dark:text-white mb-6 border-b-2 dark:border-blue-600 pb-2 mx-auto">
            ⚛️ React (Basic Usage)
          </h2>
          <div className="dark:bg-gray-900 p-6 rounded-lg shadow-lg border-l-4 border-green-500">
            <pre className="dark:bg-gray-700 text-sm overflow-x-auto p-4 rounded">
              <code>
            {`import React, { useState } from "react";
            import { ColorPicker } from "react-color-pro";

            const App = () => {
              const [color, setColor] = useState("#14AE88");

              return (
                <div className="p-6">
                  <h2>🎨 Pick a Color</h2>
                  <ColorPicker value={color} onChange={setColor} />
                  <p className="mt-4">Selected Color: <span style={{ color }}>{color}</span></p>
                </div>
              );
            };

export default App;`}
              </code>
            </pre>
            <motion.div
              className="mt-4 p-4 dark:bg-blue-900 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="dark:text-gray-200">
                A simple React implementation with a color picker and live preview.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Usage Examples - Preact */}
      <section id="usage-preact" className="py-16 dark:bg-gray-700">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold dark:text-gray-100 mb-6 flex items-center justify-center">
            🔮 Preact
            <span className="ml-2 inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          </h2>
          <div className="dark:bg-gray-800 p-6 rounded-lg shadow-lg border-l-4 border-green-500">
            <pre className="dark:bg-gray-600 text-sm overflow-x-auto p-4 rounded">
              <code>
{`/** @jsx h */
import { h } from "preact";
import { useState } from "preact/hooks";
import { ColorPicker } from "react-color-pro";

export default function PreactApp() {
  const [color, setColor] = useState("#14AE88");

  return (
    <div>
      <ColorPicker value={color} onChange={setColor} />
      <p>Color: {color}</p>
    </div>
  );
}`}
              </code>
            </pre>
            <motion.div
              className="mt-4 p-4 dark:bg-green-900 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <p className="dark:text-gray-200">
                Lightweight Preact setup with a dynamic color picker.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Usage Examples - Laravel (Blade + CDN) */}
      <section id="usage-laravel" className="py-16 dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold dark:text-white mb-6 text-center">
            🧱 Laravel (Blade + CDN)
          </h2>
          <div className="dark:bg-gray-800 p-6 rounded-lg shadow-lg border-l-4 border-green-500">
            <pre className="dark:bg-gray-700 text-sm overflow-x-auto p-4 rounded">
              <code>
{`<!-- resources/views/color-picker.blade.php -->
<div id="color-picker-root"></div>

<script src="https://cdn.jsdelivr.net/npm/react/umd/react.production.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/react-dom/umd/react-dom.production.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/react-color-pro/dist/react-color-pro.umd.js"></script>

<script>
  const { ColorPicker } = window.ReactColorPro;
  const e = React.createElement;

  ReactDOM.render(
    e(ColorPicker, { value: "#14AE88", onChange: (val) => console.log(val) }),
    document.getElementById("color-picker-root")
  );
</script>`}
              </code>
            </pre>
            <motion.div
              className="mt-4 p-4 dark:bg-purple-900 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <p className="dark:text-gray-200">
                Integrate via CDN for Laravel Blade templates with ease.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Usage Examples - Plain HTML + JS (No Framework) */}
      <section id="usage-html" className="py-16  dark:bg-gray-700">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold  dark:text-gray-100 mb-6 flex justify-center items-center">
            ⚙️ Plain HTML + JS (No Framework)
            <span className="ml-2 text-yellow-500">★</span>
          </h2>
          <div className=" dark:bg-gray-800 p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
            <pre className=" dark:bg-gray-600 text-sm overflow-x-auto p-4 rounded">
              <code>
{`<div id="picker-container"></div>

<!-- Load via CDN -->
<script src="https://cdn.jsdelivr.net/npm/react/umd/react.development.js"></script>
<script src="https://cdn.jsdelivr.net/npm/react-dom/umd/react-dom.development.js"></script>
<script src="https://cdn.jsdelivr.net/npm/react-color-pro/dist/react-color-pro.umd.js"></script>

<script>
  const { ColorPicker } = ReactColorPro;

  ReactDOM.render(
    React.createElement(ColorPicker, {
      value: "#14AE88",
      onChange: (value) => console.log("Color:", value),
    }),
    document.getElementById("picker-container")
  );
</script>`}
              </code>
            </pre>
            <motion.div
              className="mt-4 p-4 dark:bg-yellow-900 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <p className=" dark:text-gray-200">
                Simple HTML integration without any framework dependencies.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Usage Examples - Tailwind CSS Integration */}
      <section id="usage-tailwind" className="py-16  dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold  dark:text-white mb-6 text-center underline decoration-blue-400 decoration-4">
            🌈 Tailwind CSS Integration
          </h2>
          <div className=" dark:bg-gray-800 p-6 rounded-lg shadow-xl border-l-4 border-blue-400">
            <pre className=" dark:bg-gray-700 text-sm overflow-x-auto p-4 rounded">
              <code>
{`<ColorPicker
  value={color}
  onChange={setColor}
  className="border p-4 rounded-lg shadow-lg"
/>`}
              </code>
            </pre>
            <motion.div
              className="mt-4 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <p className="text-gray-700 dark:text-gray-200">
                Seamlessly style with Tailwind CSS for a custom look.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Usage Examples - Bootstrap Usage */}
      <section id="usage-bootstrap" className="py-16  dark:bg-gray-700">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold  dark:text-gray-100 mb-6 text-center">
            🎨 Bootstrap Usage
          </h2>
          <div className=" dark:bg-gray-800 p-6 rounded-lg shadow-lg border-l-4 border-green-500">
            <pre className=" dark:bg-gray-600 text-sm overflow-x-auto p-4 rounded">
              <code>
{`<div className="card p-3">
  <h5 className="mb-3">Pick a Color</h5>
  <ColorPicker value={color} onChange={setColor} />
</div>`}
              </code>
            </pre>
            <motion.div
              className="mt-4 p-4 bg-indigo-50 dark:bg-indigo-900 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <p className="text-gray-700 dark:text-gray-200">
                Integrate with Bootstrap for a card-based design.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Installation Section */}
      <section id="installation" className="py-20  dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            📦 CDN vs NPM
          </h2>
          <div className=" dark:bg-gray-800 p-6 rounded-lg shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className=" dark:bg-gray-700">
                  <tr>
                    <th className="py-3 px-4 font-semibold  dark:text-gray-200">Method</th>
                    <th className="py-3 px-4 font-semibold  dark:text-gray-200">Recommended For</th>
                    <th className="py-3 px-4 font-semibold  dark:text-gray-200">Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                    <td className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300">**NPM**</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">React / Preact / Next.js apps</td>
                    <td className="py-3 px-4 font-mono text-gray-700 dark:text-gray-300">npm install react-color-pro</td>
                  </tr>
                  <tr className="hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                    <td className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300">**CDN**</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">Laravel / WordPress / Raw HTML</td>
                    <td className="py-3 px-4 font-mono text-gray-700 dark:text-gray-300">https://cdn.jsdelivr.net/npm/react-color-pro/dist/react-color-pro.umd.js</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <motion.div
              className="mt-6 p-4 bg-green-50 dark:bg-green-900 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-gray-700 dark:text-gray-200">
                Choose the method that best fits your project environment.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section id="comparison" className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Comparison with Other Packages</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse rounded-lg shadow-md" style={{ backgroundColor: darkMode ? "#1f2937" : "#fff" }}>
              <thead>
                <tr style={{ backgroundColor: color}}>
                  <th className="p-4 text-left">Package Name</th>
                  <th className="p-4 text-left">Bundle Size</th>
                  <th className="p-4 text-left">Gzipped Size</th>
                  <th className="p-4 text-left">Dependencies</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, index) => (
                  <tr
                    key={index}
                    className={`border-t ${row.name === "react-color-pro" ? "font-bold bg-blue-50 text-gray-700" : ""}`}
                  >
                    <td className="p-4">{row.name}</td>
                    <td className="p-4">{row.size}</td>
                    <td className="p-4">{row.gzipped}</td>
                    <td className="p-4">{row.deps}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8" style={{ backgroundColor: darkMode ? "#111827" : "#e5e7eb" }}>
        <div className="container mx-auto px-6 text-center">
          <p className="mb-4">© 2025 react-color-pro. MIT License.</p>
          <div className="flex justify-center space-x-4 text-sm">
            <Link href="https://github.com/your-username/react-color-pro" className="hover:underline">GitHub</Link>
            <Link href="https://npmjs.com/package/react-color-pro" className="hover:underline">npm</Link>
            <Link href="/license" className="hover:underline">License</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}