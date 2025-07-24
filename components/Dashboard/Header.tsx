"use client";
import React from "react";
import { Activity, LogOut, User, LogIn } from "lucide-react";

interface HeaderProps {
  user: { name: string; email: string } | null;
  onLogout: () => void;
  onLoginClick?: () => void;
}

export default function Header({ user, onLogout, onLoginClick }: HeaderProps) {
  const [isTranslateLoaded, setIsTranslateLoaded] = React.useState(false);
  const [scriptLoaded, setScriptLoaded] = React.useState(false);

  React.useEffect(() => {
    // Inject Google Translate script if not present
    const scriptId = "google-translate-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      console.log(isTranslateLoaded)
      script.id = scriptId;
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      script.onload = () => setScriptLoaded(true);
      document.body.appendChild(script);
    } else {
      setScriptLoaded(true);
    }
  }, []);

  React.useEffect(() => {
    // Define the global init function if not present
    if (typeof window !== "undefined" && !window.googleTranslateElementInit) {
      window.googleTranslateElementInit = function () {
        // eslint-disable-next-line no-undef
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,no", // Add more as needed
            layout:
              window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          "google_translate_element"
        );
      };
    }
  }, []);

  React.useEffect(() => {
    // Wait for script to load, then initialize
    if (scriptLoaded && typeof window !== "undefined") {
      const container = document.getElementById("google_translate_element");
      // Remove previous widget to avoid double rendering
      if (container) {
        container.innerHTML = "";
      }
      if (
        window.google &&
        window.google.translate &&
        typeof window.googleTranslateElementInit === "function"
      ) {
        window.googleTranslateElementInit();
        setIsTranslateLoaded(true);
      } else {
        // Retry after a short delay if not ready yet
        const timer = setTimeout(() => {
          const containerRetry = document.getElementById(
            "google_translate_element"
          );
          if (containerRetry) {
            containerRetry.innerHTML = "";
          }
          if (
            window.google &&
            window.google.translate &&
            typeof window.googleTranslateElementInit === "function"
          ) {
            window.googleTranslateElementInit();
            setIsTranslateLoaded(true);
          }
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [scriptLoaded]);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-0">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 rounded-lg p-2">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">BAIMM</h1>
              <p className="text-sm text-gray-600">
                Medication Demand Forecasting
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {user.name}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition-colors duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <div className="text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                  Guest Mode - Limited Access
                </div>
                <button
                  onClick={onLoginClick}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </button>
              </div>
            )}

            {/* Google Translate Widget Container */}
            <div
              id="google_translate_element"
              className="ml-2 google-translate-container"
              style={{
                minWidth: "10px",
                maxWidth: "220px",
                height: "32px", // Fixed height to fit header
                overflow: "hidden",
                position: "relative",
                zIndex: 50,
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
