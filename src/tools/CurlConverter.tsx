import React, { useState, useEffect, useRef } from 'react';
import { ToolHeader } from '../components/ToolHeader';
import { Terminal, Code2 } from 'lucide-react';

const SAMPLE_CURL = `curl -X POST https://api.example.com/v1/auth/login \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer my_token_123" \\
  -d '{"email": "user@example.com", "password": "secretpassword"}'`;

export const CurlConverter: React.FC = () => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [curlInput, setCurlInput] = useState(SAMPLE_CURL);
  const [targetLang, setTargetLang] = useState<'js-fetch' | 'axios' | 'python' | 'go' | 'rust'>('js-fetch');

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Simple cURL parser
  const parseCurl = (cmd: string) => {
    let method = 'GET';
    let url = '';
    const headers: Record<string, string> = {};
    let data = '';

    // Clean multiline escapes
    const cleaned = cmd.replace(/\\\n/g, ' ').replace(/\s+/g, ' ');

    // Extract Method
    const methodMatch = cleaned.match(/-X\s+([A-Z]+)/i) || cleaned.match(/--request\s+([A-Z]+)/i);
    if (methodMatch) method = methodMatch[1].toUpperCase();

    // Extract Data
    const dataMatch = cleaned.match(/-d\s+['"]({[^'"]+})['"]/i) || cleaned.match(/--data-raw\s+['"]([^'"]+)['"]/i) || cleaned.match(/-d\s+['"]([^'"]+)['"]/i);
    if (dataMatch) {
      data = dataMatch[1];
      if (!methodMatch) method = 'POST';
    }

    // Extract Headers
    const headerRegex = /(?:-H|--header)\s+['"]([^'"]+)['"]/g;
    let match;
    while ((match = headerRegex.exec(cleaned)) !== null) {
      const parts = match[1].split(':');
      if (parts.length >= 2) {
        headers[parts[0].trim()] = parts.slice(1).join(':').trim();
      }
    }

    // Extract URL
    const urlMatch = cleaned.match(/curl\s+(?:-X\s+[A-Z]+\s+)?['"]?(https?:\/\/[^\s'"]+)['"]?/i);
    if (urlMatch) {
      url = urlMatch[1];
    } else {
      const genericUrl = cleaned.match(/(https?:\/\/[^\s'"]+)/i);
      if (genericUrl) url = genericUrl[1];
    }

    return { method, url, headers, data };
  };

  const parsed = parseCurl(curlInput);

  // Generate Snippets
  const generateCode = () => {
    const { method, url, headers, data } = parsed;
    if (!url) return '// Enter a valid cURL command starting with "curl https://..."';

    if (targetLang === 'js-fetch') {
      return `fetch("${url}", {
  method: "${method}",
  headers: ${JSON.stringify(headers, null, 4)},
  ${data ? `body: JSON.stringify(${data})` : ''}
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));`;
    }

    if (targetLang === 'axios') {
      return `import axios from 'axios';

axios({
  method: '${method.toLowerCase()}',
  url: '${url}',
  headers: ${JSON.stringify(headers, null, 2)},
  ${data ? `data: ${data}` : ''}
})
  .then(response => console.log(response.data))
  .catch(error => console.error(error));`;
    }

    if (targetLang === 'python') {
      const headerPy = Object.entries(headers)
        .map(([k, v]) => `    "${k}": "${v}"`)
        .join(',\n');
      return `import requests

url = "${url}"
headers = {
${headerPy}
}
${data ? `payload = ${data}` : ''}

response = requests.request("${method}", url, headers=headers${data ? ', json=payload' : ''})
print(response.json())`;
    }

    if (targetLang === 'go') {
      return `package main

import (
    "bytes"
    "fmt"
    "io"
    "net/http"
)

func main() {
    url := "${url}"
    var reqBody = bytes.NewBuffer([]byte(\`${data}\`))
    
    req, err := http.NewRequest("${method}", url, reqBody)
    if err != nil {
        panic(err)
    }

    ${Object.entries(headers)
      .map(([k, v]) => `req.Header.Add("${k}", "${v}")`)
      .join('\n    ')}

    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        panic(err)
    }
    defer resp.Body.Close()

    body, _ := io.ReadAll(resp.Body)
    fmt.Println(string(body))
}`;
    }

    if (targetLang === 'rust') {
      return `use reqwest::header::HeaderMap;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std.error.Error>> {
    let client = reqwest::Client::new();
    
    let response = client.${method.toLowerCase()}("${url}")
        ${Object.entries(headers)
          .map(([k, v]) => `.header("${k}", "${v}")`)
          .join('\n        ')}
        ${data ? `.body(r#"${data}"#)` : ''}
        .send()
        .await?;

    println!("{:#?}", response.text().await?);
    Ok(())
}`;
    }

    return '';
  };

  const generatedCode = generateCode();

  return (
    <div className="space-y-6">
      <ToolHeader
        title="cURL to Code Converter"
        description="Convert command-line cURL requests into JavaScript fetch, Axios, Python requests, Go, and Rust HTTP code."
        onLoadSample={() => setCurlInput(SAMPLE_CURL)}
        onClear={() => setCurlInput('')}
        onCopy={() => navigator.clipboard.writeText(generatedCode)}
      />

      {/* Selector */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-900/80 border border-gray-800">
        <div className="flex items-center gap-3">
          <Code2 className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-semibold text-gray-300">Target Language:</span>
          <div className="flex flex-wrap gap-1 bg-gray-950 p-1 rounded-xl border border-gray-800 text-xs">
            <button
              onClick={() => setTargetLang('js-fetch')}
              className={`px-3 py-1 rounded-lg ${targetLang === 'js-fetch' ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}
            >
              JS Fetch
            </button>
            <button
              onClick={() => setTargetLang('axios')}
              className={`px-3 py-1 rounded-lg ${targetLang === 'axios' ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}
            >
              Axios
            </button>
            <button
              onClick={() => setTargetLang('python')}
              className={`px-3 py-1 rounded-lg ${targetLang === 'python' ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}
            >
              Python
            </button>
            <button
              onClick={() => setTargetLang('go')}
              className={`px-3 py-1 rounded-lg ${targetLang === 'go' ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}
            >
              Go
            </button>
            <button
              onClick={() => setTargetLang('rust')}
              className={`px-3 py-1 rounded-lg ${targetLang === 'rust' ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}
            >
              Rust
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-gray-300 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-indigo-400" /> Paste cURL Command
          </label>
          <textarea
            ref={inputRef}
            autoFocus
            rows={16}
            value={curlInput}
            onChange={(e) => setCurlInput(e.target.value)}
            placeholder="curl -X POST https://..."
            className="w-full glass-input p-4 rounded-2xl text-xs font-mono leading-relaxed"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold text-gray-300">Generated Code Snippet</label>
          <textarea
            rows={16}
            readOnly
            value={generatedCode}
            className="w-full glass-input p-4 rounded-2xl text-xs font-mono text-emerald-300 leading-relaxed bg-gray-950/90"
          />
        </div>
      </div>
    </div>
  );
};
