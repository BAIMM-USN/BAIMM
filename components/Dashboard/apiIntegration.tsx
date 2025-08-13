"use client";

import { useState } from "react";
import { Copy, Check, Code, X, Key, Shield, Zap, Settings } from "lucide-react";

interface ApiIntegrationGuideProps {
  apiEndpoint?: string;
  organizationName?: string;
}

export function ApiIntegrationGuide({
  apiEndpoint = "https://yourdomain.com/api/predict",
  organizationName = "Your Organization",
}: ApiIntegrationGuideProps) {
  const [showGuide, setShowGuide] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  // Simulate generating an API key (replace with backend call)
  const handleGenerateKey = async () => {
    // This should be replaced with an actual backend API call
    const fakeKey = "org_" + Math.random().toString(36).slice(2, 18);
    setApiKey(fakeKey);
  };

  const handleCopyKey = async () => {
    if (!apiKey) return;
    await navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const apiSnippet = `// Example API call using API Key
const response = await fetch('${apiEndpoint}', {
  method: 'GET',
  headers: {
    'X-API-Key': '${apiKey || "<YOUR_API_KEY>"}',
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data);`;

  const handleCopySnippet = async () => {
    await navigator.clipboard.writeText(apiSnippet);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  if (!showGuide) {
    return (
      <button
        onClick={() => setShowGuide(true)}
        className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200"
      >
        <Key className="w-4 h-4 mr-2" />
        Get API Access
      </button>
    );
  }

  return (
    <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-0 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h1 className="flex items-center gap-2 text-lg font-semibold">
          <Code className="w-5 h-5" />
          API Integration Guide
        </h1>
        <button
          onClick={() => setShowGuide(false)}
          className="p-1 hover:bg-gray-100 rounded-md transition-colors duration-200"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6 overflow-y-auto" style={{ maxHeight: "70vh" }}>
        <ol className="space-y-6 text-sm">
          {/* Step 1: Generate API Key */}
          <li className="flex gap-4">
            <span className="min-w-6 h-6 rounded-full flex items-center justify-center text-xs border border-gray-300 bg-white font-medium">
              1
            </span>
            <div className="flex-1 space-y-3">
              <div className="font-semibold text-gray-800 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Generate API Key
              </div>
              <p className="text-gray-700">
                Click below to generate your API key. Keep it safe — it will be shown only once.
              </p>
              {!apiKey ? (
                <button
                  onClick={handleGenerateKey}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm"
                >
                  Generate Key
                </button>
              ) : (
                <div className="bg-gray-100 p-3 rounded-md flex items-center justify-between">
                  <code className="text-xs">{apiKey}</code>
                  <button
                    onClick={handleCopyKey}
                    className={`ml-2 px-2 py-1 text-sm rounded-md ${
                      copiedKey
                        ? "bg-gray-300 text-gray-700"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    {copiedKey ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              )}
            </div>
          </li>

          {/* Step 2: Authenticate */}
          <li className="flex gap-4">
            <span className="min-w-6 h-6 rounded-full flex items-center justify-center text-xs border border-gray-300 bg-white font-medium">
              2
            </span>
            <div className="flex-1">
              <div className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Authenticate with API Key
              </div>
              <p className="text-gray-700">
                Include your API key in the <code>X-API-Key</code> header for all requests.
              </p>
            </div>
          </li>

          {/* Step 3: Call API */}
          <li className="flex gap-4">
            <span className="min-w-6 h-6 rounded-full flex items-center justify-center text-xs border border-gray-300 bg-white font-medium">
              3
            </span>
            <div className="flex-1 space-y-3">
              <div className="font-semibold text-gray-800 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Make a Request
              </div>
              <pre className="bg-gray-100 p-3 rounded-md text-xs border border-gray-200 font-mono overflow-x-auto max-w-full">
                {apiSnippet}
              </pre>
              <button
                onClick={handleCopySnippet}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors duration-200 ${
                  copiedSnippet
                    ? "bg-gray-200 text-gray-700"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {copiedSnippet ? (
                  <>
                    <Check className="w-4 h-4 mr-2" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" /> Copy Example
                  </>
                )}
              </button>
            </div>
          </li>
        </ol>
      </div>
    </div>
  );
}
