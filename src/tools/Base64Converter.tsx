import React, { useState, useEffect, useRef } from 'react';
import { ToolHeader } from '../components/ToolHeader';
import { Binary, Upload, FileText, Image as ImageIcon } from 'lucide-react';

export const Base64Converter: React.FC = () => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [mode, setMode] = useState<'text' | 'file'>('text');
  const [direction, setDirection] = useState<'encode' | 'decode'>('encode');
  const [urlSafe, setUrlSafe] = useState(false);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Text state
  const [inputText, setInputText] = useState('Hello DevToolkit Studio! 🚀');

  // File state
  const [fileDataUri, setFileDataUri] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<number>(0);
  const [fileType, setFileType] = useState<string>('');

  // Process Text Conversion
  const convertText = (text: string, dir: 'encode' | 'decode', isUrlSafe: boolean) => {
    if (!text) return '';
    try {
      if (dir === 'encode') {
        const bytes = new TextEncoder().encode(text);
        let bin = '';
        bytes.forEach((b) => (bin += String.fromCharCode(b)));
        let b64 = btoa(bin);
        if (isUrlSafe) {
          b64 = b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        }
        return b64;
      } else {
        let b64 = text.trim();
        if (isUrlSafe) {
          b64 = b64.replace(/-/g, '+').replace(/_/g, '/');
          while (b64.length % 4) b64 += '=';
        }
        const bin = atob(b64);
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) {
          bytes[i] = bin.charCodeAt(i);
        }
        return new TextDecoder().decode(bytes);
      }
    } catch (err: any) {
      return `Error: Invalid Base64 string for decoding (${err.message})`;
    }
  };

  const outputText = convertText(inputText, direction, urlSafe);

  // File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setFileSize(file.size);
    setFileType(file.type);

    const reader = new FileReader();
    reader.onload = (event) => {
      setFileDataUri(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <ToolHeader
        title="Base64 & Data Converter"
        description="Encode and decode text strings or local files into Base64 / Data URI format instantly."
        onLoadSample={() => {
          setMode('text');
          setDirection('encode');
          setInputText('Sample data payload to convert to Base64');
        }}
        onClear={() => {
          setInputText('');
          setFileDataUri(null);
        }}
        onCopy={() => {
          const content = mode === 'text' ? outputText : fileDataUri || '';
          if (content) navigator.clipboard.writeText(content);
        }}
        onDownload={() => {
          const content = mode === 'text' ? outputText : fileDataUri || '';
          if (!content) return;
          const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `base64_output.${direction === 'encode' ? 'b64' : 'txt'}`;
          a.click();
        }}
      />

      {/* Mode & Toggle Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-gray-900/80 border border-gray-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode('text')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              mode === 'text' ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" /> Text Base64
          </button>
          <button
            onClick={() => setMode('file')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              mode === 'file' ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-4 h-4" /> File to Base64 Data URI
          </button>
        </div>

        {mode === 'text' && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 bg-gray-950 p-1 rounded-xl border border-gray-800">
              <button
                onClick={() => setDirection('encode')}
                className={`px-3 py-1 rounded-lg text-xs font-medium ${
                  direction === 'encode' ? 'bg-indigo-500 text-white' : 'text-gray-400'
                }`}
              >
                Encode
              </button>
              <button
                onClick={() => setDirection('decode')}
                className={`px-3 py-1 rounded-lg text-xs font-medium ${
                  direction === 'decode' ? 'bg-indigo-500 text-white' : 'text-gray-400'
                }`}
              >
                Decode
              </button>
            </div>

            <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={urlSafe}
                onChange={(e) => setUrlSafe(e.target.checked)}
                className="w-4 h-4 rounded bg-gray-950 border-gray-700 text-indigo-500 focus:ring-0"
              />
              <span>URL-Safe Base64</span>
            </label>
          </div>
        )}
      </div>

      {/* Mode 1: Text Conversion */}
      {mode === 'text' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-300">
              Input Text ({direction === 'encode' ? 'Plain Text' : 'Base64 Encoded'})
            </label>
            <textarea
              ref={inputRef}
              autoFocus
              rows={12}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter text to convert..."
              className="w-full glass-input p-4 rounded-2xl text-xs font-mono leading-relaxed"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-300">
              Converted Output ({direction === 'encode' ? 'Base64 Result' : 'Decoded Text'})
            </label>
            <textarea
              rows={12}
              readOnly
              value={outputText}
              placeholder="Output will appear here..."
              className="w-full glass-input p-4 rounded-2xl text-xs font-mono text-emerald-300 leading-relaxed bg-gray-950/90"
            />
          </div>
        </div>
      )}

      {/* Mode 2: File to Data URI */}
      {mode === 'file' && (
        <div className="space-y-6">
          <div className="p-8 rounded-2xl border-2 border-dashed border-gray-800 hover:border-indigo-500/50 bg-gray-900/40 text-center transition-all">
            <input
              type="file"
              id="file-input"
              onChange={handleFileUpload}
              className="hidden"
            />
            <label htmlFor="file-input" className="cursor-pointer flex flex-col items-center gap-3">
              <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-400">
                <Upload className="w-8 h-8" />
              </div>
              <div>
                <span className="text-sm font-semibold text-white">Click or drag a file to convert to Base64 Data URI</span>
                <p className="text-xs text-gray-400 mt-1">Supports Images, PDFs, SVGs, Audio, and text files</p>
              </div>
            </label>
          </div>

          {fileDataUri && (
            <div className="p-5 rounded-2xl bg-gray-900/80 border border-gray-800 space-y-4">
              <div className="flex items-center justify-between text-xs text-gray-300 border-b border-gray-800 pb-3">
                <div className="flex items-center gap-2">
                  <Binary className="w-4 h-4 text-indigo-400" />
                  <span className="font-semibold">{fileName}</span>
                  <span className="text-gray-500">({(fileSize / 1024).toFixed(1)} KB)</span>
                </div>
                <span className="font-mono text-purple-300">{fileType}</span>
              </div>

              {/* Preview image if file is image */}
              {fileType.startsWith('image/') && (
                <div className="p-4 rounded-xl bg-gray-950 border border-gray-800 flex justify-center">
                  <img src={fileDataUri} alt="Preview" className="max-h-48 object-contain rounded-lg" />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2">Base64 Data URI String</label>
                <textarea
                  rows={8}
                  readOnly
                  value={fileDataUri}
                  className="w-full glass-input p-3 rounded-xl text-xs font-mono text-emerald-300 leading-relaxed bg-gray-950"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
