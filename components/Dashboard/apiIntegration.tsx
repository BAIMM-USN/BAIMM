"use client";

import { useState } from "react";
import {
  Copy,
  Check,
  Code,
  Settings,
  X,
  Shield,
  Zap,
  CheckCircle,
  Key,
} from "lucide-react";

interface ApiIntegrationGuideProps {
  firebaseConfig: Record<string, any>;
  apiEndpoint?: string;
}

export function ApiIntegrationGuide({
  firebaseConfig,
  apiEndpoint = "https://baimm.vercel.app/api/predict",
}: ApiIntegrationGuideProps) {
  const [showGuide, setShowGuide] = useState(false);
  const [copiedConfig, setCopiedConfig] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [showSnippet, setShowSnippet] = useState(false);

  const handleGetApi = () => {
    setShowGuide(true);
  };

  const handleCloseGuide = () => {
    setShowGuide(false);
    setShowSnippet(false); // Reset snippet visibility when closing
  };

  const handleCopyConfig = async () => {
    try {
      await navigator.clipboard.writeText(
        JSON.stringify(firebaseConfig, null, 2)
      );
      setCopiedConfig(true);
      setTimeout(() => setCopiedConfig(false), 2000);
    } catch (err) {
      console.error("Failed to copy config:", err);
    }
  };

  const handleShowApi = () => {
    setShowSnippet(true);
  };

  const handleCopySnippet = async () => {
    const apiSnippet = `// Example API call with Firebase Auth
import { getAuth } from 'firebase/auth';

const auth = getAuth();
const user = auth.currentUser;

if (user) {
  const idToken = await user.getIdToken();
  
  const response = await fetch('${apiEndpoint}', {
    method: 'GET',
    headers: {
      'Authorization': \`Bearer \${idToken}\`,
      'Content-Type': 'application/json'
    }
  });
  
  const data = await response.json();
  console.log(data);
}`;

    try {
      await navigator.clipboard.writeText(apiSnippet);
      setCopiedSnippet(true);
      setTimeout(() => setCopiedSnippet(false), 2000);
    } catch (err) {
      console.error("Failed to copy snippet:", err);
    }
  };

  const apiSnippet = `// Example API call with Firebase Auth
import { getAuth } from 'firebase/auth';

const auth = getAuth();
const user = auth.currentUser;

if (user) {
  const idToken = await user.getIdToken();
  
  const response = await fetch('${apiEndpoint}', {
    method: 'GET',
    headers: {
      'Authorization': \`Bearer \${idToken}\`,
      'Content-Type': 'application/json'
    }
  });
  
  const data = await response.json();
  console.log(data);
}`;

  // Show button state
  if (!showGuide) {
    return (
      <button
        onClick={handleGetApi}
        className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200"
      >
        <Key className="w-4 h-4 mr-2" />
        Get API Access
      </button>
    );
  }

  // Show guide state
  return (
    <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-0 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h1 className="flex items-center gap-2 text-lg font-semibold">
          <Code className="w-5 h-5" />
          API Integration Guide
        </h1>
        <button
          onClick={handleCloseGuide}
          className="p-1 hover:bg-gray-100 rounded-md transition-colors duration-200"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content (scrollable if needed) */}
      <div
        className="p-6 space-y-6 overflow-y-auto"
        style={{ maxHeight: "70vh" }}
      >
        <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4">
          <div className="text-sm text-green-800 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span className="font-semibold">API Access Granted</span> - You're
            logged in and ready to integrate!
          </div>
        </div>

        <ol className="space-y-6 text-sm">
          {/* Step 1: Add Firebase */}
          <li className="flex gap-4">
            <span className="min-w-6 h-6 rounded-full flex items-center justify-center text-xs border border-gray-300 bg-white font-medium">
              1
            </span>
            <div className="flex-1 space-y-3">
              <div className="font-semibold text-gray-800 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Add Firebase to your project
              </div>
              <div className="text-gray-700">
                Use this config in your Firebase initialization:
              </div>
              <div className="space-y-2">
                <pre
                  className="bg-gray-100 p-3 rounded-md text-xs border border-gray-200 font-mono overflow-x-auto max-w-full"
                  style={{ maxWidth: "100%" }}
                >
                  {JSON.stringify(firebaseConfig, null, 2)}
                </pre>
                <button
                  onClick={handleCopyConfig}
                  className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-md transition-colors duration-200 ${
                    copiedConfig
                      ? "bg-gray-200 text-gray-700"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  {copiedConfig ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Config
                    </>
                  )}
                </button>
              </div>
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
                Authenticate with Firebase Auth
              </div>
              <div className="text-gray-700">
                Set up authentication (e.g., email/password, Google, etc.) in
                your system.
              </div>
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
                Call the API with your ID token
              </div>
              <div className="space-y-2">
                <button
                  onClick={handleShowApi}
                  className="inline-flex items-center px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors duration-200"
                >
                  <Code className="w-4 h-4 mr-2" />
                  Generate My API Example
                </button>
                {showSnippet && (
                  <div className="space-y-2">
                    <pre
                      className="bg-gray-100 p-3 rounded-md text-xs border border-gray-200 font-mono overflow-x-auto max-w-full"
                      style={{ maxWidth: "100%" }}
                    >
                      {apiSnippet}
                    </pre>
                    <button
                      onClick={handleCopySnippet}
                      className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-md transition-colors duration-200 ${
                        copiedSnippet
                          ? "bg-gray-200 text-gray-700"
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                      }`}
                    >
                      {copiedSnippet ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy to Clipboard
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </li>
        </ol>

        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <div className="text-xs text-blue-800">
            <span className="font-semibold">Note:</span> Your ID token is
            short-lived and user-specific. Always authenticate and get a fresh
            token before calling the API.
          </div>
        </div>
      </div>
    </div>
  );
}
