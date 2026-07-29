import React, { useState } from 'react';
import { ToolHeader } from '../components/ToolHeader';
import { Palette, CheckCircle2, XCircle } from 'lucide-react';

export const ColorConverter: React.FC = () => {
  const [hexColor, setHexColor] = useState('#6366F1');
  const [bgColor, setBgColor] = useState('#0F172A');

  // Convert Hex to RGB
  const hexToRgb = (hex: string) => {
    let clean = hex.replace('#', '');
    if (clean.length === 3) {
      clean = clean.split('').map((c) => c + c).join('');
    }
    if (clean.length !== 6) return null;

    const num = parseInt(clean, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255,
    };
  };

  const rgb = hexToRgb(hexColor) || { r: 99, g: 102, b: 241 };

  // RGB to HSL
  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
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

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  };

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  // Relative Luminance for WCAG Contrast
  const getLuminance = (r: number, g: number, b: number) => {
    const a = [r, g, b].map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  const bgRgb = hexToRgb(bgColor) || { r: 15, g: 23, b: 42 };
  const lum1 = getLuminance(rgb.r, rgb.g, rgb.b);
  const lum2 = getLuminance(bgRgb.r, bgRgb.g, bgRgb.b);

  const contrastRatio = (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);

  const passesAA = contrastRatio >= 4.5;
  const passesAAA = contrastRatio >= 7.0;

  return (
    <div className="space-y-6">
      <ToolHeader
        title="Color Converter & WCAG Contrast Checker"
        description="Convert HEX, RGB, and HSL colors while validating WCAG AA/AAA accessibility contrast ratios."
        onLoadSample={() => {
          setHexColor('#6366F1');
          setBgColor('#0F172A');
        }}
        onClear={() => {
          setHexColor('#ffffff');
          setBgColor('#000000');
        }}
      />

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Color Inputs & Swatch */}
        <div className="p-5 rounded-2xl bg-gray-900/80 border border-gray-800 space-y-4">
          <h2 className="text-xs font-semibold text-gray-300 flex items-center gap-2">
            <Palette className="w-4 h-4 text-indigo-400" /> Foreground & Color Inspector
          </h2>

          <div className="flex items-center gap-4">
            <input
              type="color"
              value={hexColor}
              onChange={(e) => setHexColor(e.target.value)}
              className="w-14 h-14 rounded-2xl cursor-pointer bg-transparent border-0"
            />
            <div className="flex-1">
              <label className="block text-xs text-gray-400 mb-1">HEX Color Code</label>
              <input
                type="text"
                value={hexColor}
                onChange={(e) => setHexColor(e.target.value)}
                className="w-full glass-input px-3.5 py-2 rounded-xl text-sm font-mono text-white font-bold"
              />
            </div>
          </div>

          {/* Formats Output */}
          <div className="p-4 rounded-xl bg-gray-950 border border-gray-800 space-y-2 text-xs font-mono">
            <div className="flex justify-between py-1 border-b border-gray-800">
              <span className="text-gray-400">RGB:</span>
              <span className="text-indigo-300">rgb({rgb.r}, {rgb.g}, {rgb.b})</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-800">
              <span className="text-gray-400">HSL:</span>
              <span className="text-purple-300">hsl({hsl.h}, {hsl.s}%, {hsl.l}%)</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-400">CSS Variable:</span>
              <span className="text-emerald-300">--color-brand: {hexColor};</span>
            </div>
          </div>
        </div>

        {/* Right: WCAG Contrast Checker */}
        <div className="p-5 rounded-2xl bg-gray-900/80 border border-gray-800 space-y-4">
          <h2 className="text-xs font-semibold text-gray-300">WCAG Accessibility Contrast Checker</h2>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Background Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0"
              />
              <input
                type="text"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-full glass-input px-3 py-1.5 rounded-xl text-xs font-mono"
              />
            </div>
          </div>

          {/* Preview Box */}
          <div
            className="p-6 rounded-2xl border border-gray-800 flex flex-col items-center justify-center text-center transition-all"
            style={{ backgroundColor: bgColor, color: hexColor }}
          >
            <span className="text-lg font-bold">Sample Text Preview</span>
            <span className="text-xs opacity-90 mt-1">DevToolkit Studio Accessibility Suite</span>
          </div>

          {/* Contrast Score */}
          <div className="p-4 rounded-xl bg-gray-950 border border-gray-800 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-400">Contrast Ratio:</span>
              <span className="text-base font-bold font-mono text-white">{contrastRatio.toFixed(2)}:1</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div
                className={`p-2.5 rounded-xl border flex items-center justify-between ${
                  passesAA ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'
                }`}
              >
                <span>WCAG AA (4.5:1)</span>
                {passesAA ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              </div>

              <div
                className={`p-2.5 rounded-xl border flex items-center justify-between ${
                  passesAAA ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'
                }`}
              >
                <span>WCAG AAA (7.0:1)</span>
                {passesAAA ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
