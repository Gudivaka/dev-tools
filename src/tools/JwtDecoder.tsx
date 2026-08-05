import React, { useState, useEffect, useRef } from 'react';
import { ToolHeader } from '../components/ToolHeader';
import { KeyRound, ShieldAlert, ShieldCheck, Clock, CheckCircle2, XCircle } from 'lucide-react';
import CryptoJS from 'crypto-js';

const SAMPLE_JWT = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFsaWNlIERldmVsb3BlciIsImFkbWluIjp0cnVlLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MjUyNDYwODAwMH0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`;

export const JwtDecoder: React.FC = () => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [token, setToken] = useState<string>(SAMPLE_JWT);
  const [secretKey, setSecretKey] = useState<string>('your-256-bit-secret');

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const decodeJwt = (jwt: string) => {
    const parts = jwt.trim().split('.');
    if (parts.length !== 3) {
      return { error: 'Invalid JWT format. A valid JWT consists of 3 dot-separated parts (Header.Payload.Signature).' };
    }

    try {
      const base64UrlDecode = (str: string) => {
        let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4) {
          base64 += '=';
        }
        return decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
      };

      const headerObj = JSON.parse(base64UrlDecode(parts[0]));
      const payloadObj = JSON.parse(base64UrlDecode(parts[1]));
      const signatureStr = parts[2];

      return {
        rawHeader: parts[0],
        rawPayload: parts[1],
        rawSignature: parts[2],
        header: headerObj,
        payload: payloadObj,
        signature: signatureStr,
        error: null,
      };
    } catch (err: any) {
      return { error: 'Failed to decode base64 payload or parse JSON: ' + err.message };
    }
  };

  const decoded = decodeJwt(token);

  // Check Expiration
  const getExpirationStatus = () => {
    if (!decoded.payload || typeof decoded.payload.exp === 'undefined') {
      return { status: 'none', message: 'No exp (expiration) claim found in payload.' };
    }

    const expTimeSec = decoded.payload.exp;
    const expDate = new Date(expTimeSec * 1000);
    const nowSec = Math.floor(Date.now() / 1000);
    const isExpired = nowSec > expTimeSec;

    return {
      status: isExpired ? 'expired' : 'valid',
      date: expDate,
      diffSec: Math.abs(expTimeSec - nowSec),
      isExpired,
    };
  };

  const expInfo = getExpirationStatus();

  // HMAC Verification
  const verifySignature = () => {
    if (!decoded.rawHeader || !decoded.rawPayload || !decoded.rawSignature) return null;
    const message = `${decoded.rawHeader}.${decoded.rawPayload}`;
    const hash = CryptoJS.HmacSHA256(message, secretKey);
    const calculatedSig = CryptoJS.enc.Base64.stringify(hash)
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    return calculatedSig === decoded.rawSignature;
  };

  const sigVerified = decoded.header?.alg === 'HS256' ? verifySignature() : null;

  return (
    <div className="space-y-6">
      <ToolHeader
        title="JWT Token Decoder & Inspector"
        description="Decode JSON Web Tokens, inspect header/payload claims, check expiration, and verify HMAC signatures."
        onLoadSample={() => setToken(SAMPLE_JWT)}
        onClear={() => setToken('')}
        onCopy={() => {
          if (decoded.payload) {
            navigator.clipboard.writeText(JSON.stringify(decoded.payload, null, 2));
          }
        }}
      />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-2xl bg-white/90 dark:bg-gray-900/80 border border-slate-200/80 dark:border-gray-800 space-y-3 shadow-sm">
            <label className="block text-xs font-semibold text-slate-800 dark:text-gray-300 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Enter Encoded JWT Token
            </label>
            <textarea
              ref={inputRef}
              autoFocus
              rows={8}
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Paste your JWT token (e.g. eyJhbGciOi...)"
              className="w-full glass-input p-3 rounded-xl text-xs font-mono text-indigo-700 dark:text-indigo-300 leading-relaxed resize-y focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Expiration Banner */}
          {expInfo.status !== 'none' && (
            <div
              className={`p-4 rounded-2xl border flex items-center justify-between shadow-sm ${
                expInfo.isExpired
                  ? 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400'
                  : 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
              }`}
            >
              <div className="flex items-center gap-3">
                {expInfo.isExpired ? (
                  <ShieldAlert className="w-6 h-6 flex-shrink-0" />
                ) : (
                  <ShieldCheck className="w-6 h-6 flex-shrink-0" />
                )}
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider">
                    {expInfo.isExpired ? 'Token Expired' : 'Token Active / Valid'}
                  </div>
                  <div className="text-xs mt-0.5 opacity-90">
                    Expires: {expInfo.date?.toLocaleString()}
                  </div>
                </div>
              </div>
              <Clock className="w-5 h-5 opacity-60" />
            </div>
          )}

          {/* Signature Verification Card */}
          <div className="p-4 rounded-2xl bg-white/90 dark:bg-gray-900/80 border border-slate-200/80 dark:border-gray-800 space-y-3 shadow-sm">
            <h3 className="text-xs font-semibold text-slate-800 dark:text-gray-300">HMAC-SHA256 Signature Verifier</h3>
            <div>
              <label className="block text-[11px] text-slate-500 dark:text-gray-400 mb-1">Secret Key (for HS256)</label>
              <input
                type="text"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                className="w-full glass-input px-3 py-1.5 rounded-lg text-xs font-mono"
              />
            </div>
            {sigVerified !== null && (
              <div className="flex items-center gap-2 text-xs pt-1">
                {sigVerified ? (
                  <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-4 h-4" /> Signature Verified Successfully!
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-red-600 dark:text-red-400 font-semibold">
                    <XCircle className="w-4 h-4" /> Signature Invalid / Mismatched Secret
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Output Decoded Columns */}
        <div className="lg:col-span-7 space-y-4">
          {decoded.error ? (
            <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-sm shadow-sm">
              {decoded.error}
            </div>
          ) : (
            <>
              {/* Header Box */}
              <div className="p-4 rounded-2xl bg-white/90 dark:bg-gray-900/80 border border-slate-200/80 dark:border-gray-800 space-y-2 shadow-sm">
                <div className="flex items-center justify-between text-xs font-semibold text-red-600 dark:text-red-400 border-b border-slate-200 dark:border-gray-800 pb-2">
                  <span>HEADER: ALGORITHM & TOKEN TYPE</span>
                  <span className="font-mono text-[10px] text-slate-400 dark:text-gray-500">JSON</span>
                </div>
                <pre className="p-3 rounded-xl bg-slate-50 dark:bg-gray-950/80 border border-slate-200/80 dark:border-gray-800 text-xs font-mono text-red-700 dark:text-red-300 overflow-x-auto">
                  {JSON.stringify(decoded.header, null, 2)}
                </pre>
              </div>

              {/* Payload Box */}
              <div className="p-4 rounded-2xl bg-white/90 dark:bg-gray-900/80 border border-slate-200/80 dark:border-gray-800 space-y-2 shadow-sm">
                <div className="flex items-center justify-between text-xs font-semibold text-purple-600 dark:text-purple-400 border-b border-slate-200 dark:border-gray-800 pb-2">
                  <span>PAYLOAD: DATA CLAIMS</span>
                  <span className="font-mono text-[10px] text-slate-400 dark:text-gray-500">JSON</span>
                </div>
                <pre className="p-3 rounded-xl bg-slate-50 dark:bg-gray-950/80 border border-slate-200/80 dark:border-gray-800 text-xs font-mono text-purple-800 dark:text-purple-200 overflow-x-auto">
                  {JSON.stringify(decoded.payload, null, 2)}
                </pre>
              </div>

              {/* Signature Box */}
              <div className="p-4 rounded-2xl bg-white/90 dark:bg-gray-900/80 border border-slate-200/80 dark:border-gray-800 space-y-2 shadow-sm">
                <div className="flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400 border-b border-slate-200 dark:border-gray-800 pb-2">
                  <span>VERIFY SIGNATURE</span>
                  <span className="font-mono text-[10px] text-slate-400 dark:text-gray-500">BASE64URL</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-gray-950/80 border border-slate-200/80 dark:border-gray-800 text-xs font-mono text-indigo-700 dark:text-indigo-300 break-all">
                  HMACSHA256( base64UrlEncode(header) + "." + base64UrlEncode(payload), secret )
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
