import React, { useState } from 'react';
import { ToolHeader } from '../components/ToolHeader';
import { Lock, RefreshCw, ShieldCheck } from 'lucide-react';

export const PasswordGenerator: React.FC = () => {
  const [length, setLength] = useState(24);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [avoidAmbiguous, setAvoidAmbiguous] = useState(false);

  const generatePassword = () => {
    let uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let lowercase = 'abcdefghijklmnopqrstuvwxyz';
    let numbers = '0123456789';
    let symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (avoidAmbiguous) {
      uppercase = uppercase.replace(/[O]/g, '');
      lowercase = lowercase.replace(/[l]/g, '');
      numbers = numbers.replace(/[01]/g, '');
      symbols = symbols.replace(/[{}[\]()/\'\`~,;:.<>]/g, '');
    }

    let charset = '';
    if (useUpper) charset += uppercase;
    if (useLower) charset += lowercase;
    if (useNumbers) charset += numbers;
    if (useSymbols) charset += symbols;

    if (!charset) return '';

    let password = '';
    const randomBytes = new Uint32Array(length);
    crypto.getRandomValues(randomBytes);

    for (let i = 0; i < length; i++) {
      password += charset[randomBytes[i] % charset.length];
    }
    return password;
  };

  const [password, setPassword] = useState(generatePassword());

  const handleRegenerate = () => {
    setPassword(generatePassword());
  };

  // Calculate Entropy
  const calculateEntropy = () => {
    let poolSize = 0;
    if (useUpper) poolSize += 26;
    if (useLower) poolSize += 26;
    if (useNumbers) poolSize += 10;
    if (useSymbols) poolSize += 26;

    if (!poolSize) return 0;
    return Math.round(length * Math.log2(poolSize));
  };

  const entropy = calculateEntropy();

  const getStrengthRating = () => {
    if (entropy < 40) return { label: 'Weak', color: 'text-red-400', bg: 'bg-red-500' };
    if (entropy < 65) return { label: 'Medium', color: 'text-amber-400', bg: 'bg-amber-500' };
    if (entropy < 90) return { label: 'Strong', color: 'text-emerald-400', bg: 'bg-emerald-500' };
    return { label: 'Extremely Strong', color: 'text-indigo-400', bg: 'bg-indigo-500' };
  };

  const strength = getStrengthRating();

  return (
    <div className="space-y-6">
      <ToolHeader
        title="Password & Key Generator"
        description="Generate cryptographically secure passwords, API keys, and secret tokens."
        onCopy={() => navigator.clipboard.writeText(password)}
      />

      {/* Output Display Card */}
      <div className="p-6 rounded-2xl bg-gray-900/80 border border-gray-800 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-gray-300 flex items-center gap-2">
            <Lock className="w-4 h-4 text-indigo-400" /> Generated Secure Key / Password
          </label>
          <button
            onClick={handleRegenerate}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Regenerate
          </button>
        </div>

        <div className="p-4 rounded-xl bg-gray-950 border border-gray-800 text-lg font-mono text-emerald-300 break-all select-all font-bold">
          {password || 'Select at least one character set'}
        </div>

        {/* Strength Meter */}
        <div className="flex items-center justify-between text-xs pt-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className={`w-4 h-4 ${strength.color}`} />
            <span className="text-gray-400">Strength Rating:</span>
            <span className={`font-bold ${strength.color}`}>{strength.label} ({entropy} bits entropy)</span>
          </div>
          <div className="w-36 h-2 rounded-full bg-gray-800 overflow-hidden">
            <div
              className={`h-full transition-all ${strength.bg}`}
              style={{ width: `${Math.min(100, (entropy / 120) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Options Panel */}
      <div className="p-6 rounded-2xl bg-gray-900/80 border border-gray-800 space-y-6">
        <h3 className="text-xs font-semibold text-gray-200">Generator Configuration</h3>

        {/* Length Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Password Length:</span>
            <span className="font-mono text-indigo-400 font-bold">{length} characters</span>
          </div>
          <input
            type="range"
            min={8}
            max={128}
            value={length}
            onChange={(e) => {
              setLength(Number(e.target.value));
              setPassword(generatePassword());
            }}
            className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
        </div>

        {/* Checkboxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs text-gray-300">
          <label className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-950 border border-gray-800 cursor-pointer">
            <input
              type="checkbox"
              checked={useUpper}
              onChange={(e) => {
                setUseUpper(e.target.checked);
                setPassword(generatePassword());
              }}
              className="w-4 h-4 rounded bg-gray-900 border-gray-700 text-indigo-500"
            />
            <span>Uppercase Letters (A-Z)</span>
          </label>

          <label className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-950 border border-gray-800 cursor-pointer">
            <input
              type="checkbox"
              checked={useLower}
              onChange={(e) => {
                setUseLower(e.target.checked);
                setPassword(generatePassword());
              }}
              className="w-4 h-4 rounded bg-gray-900 border-gray-700 text-indigo-500"
            />
            <span>Lowercase Letters (a-z)</span>
          </label>

          <label className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-950 border border-gray-800 cursor-pointer">
            <input
              type="checkbox"
              checked={useNumbers}
              onChange={(e) => {
                setUseNumbers(e.target.checked);
                setPassword(generatePassword());
              }}
              className="w-4 h-4 rounded bg-gray-900 border-gray-700 text-indigo-500"
            />
            <span>Digits (0-9)</span>
          </label>

          <label className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-950 border border-gray-800 cursor-pointer">
            <input
              type="checkbox"
              checked={useSymbols}
              onChange={(e) => {
                setUseSymbols(e.target.checked);
                setPassword(generatePassword());
              }}
              className="w-4 h-4 rounded bg-gray-900 border-gray-700 text-indigo-500"
            />
            <span>Symbols (!@#$%^&*)</span>
          </label>

          <label className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-950 border border-gray-800 cursor-pointer col-span-1 sm:col-span-2">
            <input
              type="checkbox"
              checked={avoidAmbiguous}
              onChange={(e) => {
                setAvoidAmbiguous(e.target.checked);
                setPassword(generatePassword());
              }}
              className="w-4 h-4 rounded bg-gray-900 border-gray-700 text-indigo-500"
            />
            <span>Avoid Ambiguous Characters (e.g. 1, l, O, 0)</span>
          </label>
        </div>
      </div>
    </div>
  );
};
