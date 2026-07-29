import React, { useState } from 'react';
import { ToolHeader } from '../components/ToolHeader';
import { ShieldCheck, Copy, Check, Upload, Key } from 'lucide-react';
import CryptoJS from 'crypto-js';

export const HashGenerator: React.FC = () => {
  const [inputText, setInputText] = useState('Hello DevToolkit!');
  const [secretKey, setSecretKey] = useState('');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // File hash state
  const [fileName, setFileName] = useState('');
  const [fileHashes, setFileHashes] = useState<{ md5?: string; sha256?: string } | null>(null);

  // Compute text hashes
  const computeHashes = (text: string, key: string) => {
    if (!text) return { md5: '', sha1: '', sha256: '', sha512: '' };

    if (key) {
      return {
        md5: CryptoJS.HmacMD5(text, key).toString(),
        sha1: CryptoJS.HmacSHA1(text, key).toString(),
        sha256: CryptoJS.HmacSHA256(text, key).toString(),
        sha512: CryptoJS.HmacSHA512(text, key).toString(),
      };
    }

    return {
      md5: CryptoJS.MD5(text).toString(),
      sha1: CryptoJS.SHA1(text).toString(),
      sha256: CryptoJS.SHA256(text).toString(),
      sha512: CryptoJS.SHA512(text).toString(),
    };
  };

  const hashes = computeHashes(inputText, secretKey);

  const handleCopy = (hash: string, algo: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(algo);
    setTimeout(() => setCopiedHash(null), 1500);
  };

  // Compute file checksum using Web Crypto API
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const buffer = await file.arrayBuffer();

    // SHA-256 via Web Crypto
    const sha256Buffer = await crypto.subtle.digest('SHA-256', buffer);
    const sha256Array = Array.from(new Uint8Array(sha256Buffer));
    const sha256Hex = sha256Array.map((b) => b.toString(16).padStart(2, '0')).join('');

    // MD5 via crypto-js
    const wordArray = CryptoJS.lib.WordArray.create(buffer as any);
    const md5Hex = CryptoJS.MD5(wordArray).toString();

    setFileHashes({ md5: md5Hex, sha256: sha256Hex });
  };

  return (
    <div className="space-y-6">
      <ToolHeader
        title="Hash & Checksum Generator"
        description="Compute MD5, SHA-1, SHA-256, SHA-512 hashes and HMAC signatures for text or local files."
        onLoadSample={() => {
          setInputText('Sample payload for cryptographic hash calculation');
          setSecretKey('');
        }}
        onClear={() => {
          setInputText('');
          setSecretKey('');
          setFileHashes(null);
        }}
      />

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-2">
          <label className="block text-xs font-semibold text-gray-300">Input Text String</label>
          <textarea
            rows={4}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type or paste text to compute hashes..."
            className="w-full glass-input p-3 rounded-xl text-xs font-mono"
          />
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 flex items-center gap-1.5 mb-1">
              <Key className="w-3.5 h-3.5 text-indigo-400" /> HMAC Secret Key (Optional)
            </label>
            <input
              type="text"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder="Enter secret for HMAC"
              className="w-full glass-input p-2.5 rounded-xl text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 flex items-center gap-1.5 mb-1">
              <Upload className="w-3.5 h-3.5 text-emerald-400" /> Compute Local File Hash
            </label>
            <input
              type="file"
              onChange={handleFileUpload}
              className="block w-full text-xs text-gray-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-gray-800 file:text-indigo-300 hover:file:bg-gray-700"
            />
          </div>
        </div>
      </div>

      {/* File Hash Results */}
      {fileHashes && (
        <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 space-y-2 text-xs font-mono">
          <div className="font-semibold text-indigo-300">File: {fileName}</div>
          <div className="flex justify-between py-1">
            <span className="text-gray-400">MD5:</span>
            <span className="text-emerald-300">{fileHashes.md5}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-gray-400">SHA-256:</span>
            <span className="text-emerald-300 break-all">{fileHashes.sha256}</span>
          </div>
        </div>
      )}

      {/* Text Hash Results List */}
      <div className="space-y-3">
        {[
          { name: 'MD5', value: hashes.md5, color: 'text-purple-400' },
          { name: 'SHA-1', value: hashes.sha1, color: 'text-indigo-400' },
          { name: 'SHA-256', value: hashes.sha256, color: 'text-emerald-400' },
          { name: 'SHA-512', value: hashes.sha512, color: 'text-amber-400' },
        ].map((algo) => (
          <div key={algo.name} className="p-4 rounded-2xl bg-gray-900/80 border border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className={`text-xs font-bold font-mono px-2.5 py-1 rounded-lg bg-gray-950 border border-gray-800 ${algo.color}`}>
                {algo.name}
              </span>
              <span className="text-xs font-mono text-gray-200 break-all">{algo.value || '—'}</span>
            </div>

            <button
              onClick={() => handleCopy(algo.value, algo.name)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 self-end sm:self-center"
            >
              {copiedHash === algo.name ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-gray-400" />
                  Copy
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
