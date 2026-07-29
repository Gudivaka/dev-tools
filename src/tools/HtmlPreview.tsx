import React, { useState, useEffect, useRef } from 'react';
import { ToolHeader } from '../components/ToolHeader';
import { Play, Eye, Code } from 'lucide-react';

const SAMPLE_HTML_CODE = `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      background: #0f172a;
      color: #f8fafc;
      font-family: system-ui, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-h: 100vh;
      margin: 0;
      padding: 20px;
    }
    .card {
      background: rgba(30, 41, 59, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 24px;
      max-width: 400px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
      text-align: center;
    }
    .btn {
      background: #6366f1;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      font-weight: bold;
      cursor: pointer;
      transition: transform 0.2s;
    }
    .btn:hover {
      transform: scale(1.05);
    }
  </style>
</head>
<body>
  <div class="card">
    <h2>⚡ DevToolkit Studio</h2>
    <p>Live HTML/CSS/JS Sandbox Preview</p>
    <button class="btn" onclick="alert('Hello Developer!')">Click Me</button>
  </div>
</body>
</html>`;

export const HtmlPreview: React.FC = () => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [htmlCode, setHtmlCode] = useState(SAMPLE_HTML_CODE);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="space-y-6">
      <ToolHeader
        title="HTML & CSS Live Sandbox Preview"
        description="Write HTML, CSS, and JavaScript with instant live rendered preview in a sandboxed frame."
        onLoadSample={() => setHtmlCode(SAMPLE_HTML_CODE)}
        onClear={() => setHtmlCode('')}
        onCopy={() => navigator.clipboard.writeText(htmlCode)}
      />

      {/* Grid Editor and Live Frame */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-gray-300 flex items-center gap-2">
            <Code className="w-4 h-4 text-indigo-400" /> HTML / CSS / JS Code Editor
          </label>
          <textarea
            ref={inputRef}
            autoFocus
            rows={18}
            value={htmlCode}
            onChange={(e) => setHtmlCode(e.target.value)}
            placeholder="Write HTML & CSS code..."
            className="w-full glass-input p-4 rounded-2xl text-xs font-mono leading-relaxed"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold text-gray-300 flex items-center gap-2">
            <Eye className="w-4 h-4 text-emerald-400" /> Sandboxed Live Preview
          </label>
          <div className="w-full h-[400px] rounded-2xl border border-gray-800 bg-white overflow-hidden shadow-2xl">
            <iframe
              srcDoc={htmlCode}
              title="HTML Sandbox Preview"
              className="w-full h-full border-0"
              sandbox="allow-scripts"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
