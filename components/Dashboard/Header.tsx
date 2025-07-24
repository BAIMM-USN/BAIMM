"use client"
import React from "react"
import { Activity, LogOut, User, LogIn } from "lucide-react"

interface HeaderProps {
  user: { name: string; email: string } | null
  onLogout: () => void
  onLoginClick?: () => void
}

export default function Header({ user, onLogout, onLoginClick }: HeaderProps) {
  const [isTranslateLoaded, setIsTranslateLoaded] = React.useState(false)

  React.useEffect(() => {
    // Check if Google Translate is available and initialize
    const initializeTranslate = () => {
      if (typeof window !== "undefined" && window.google && window.google.translate) {
        // Trigger the initialization if not already done
        if (typeof window.googleTranslateElementInit === "function") {
          window.googleTranslateElementInit()
          setIsTranslateLoaded(true)
        }
      } else {
        // Retry after a short delay
        setTimeout(initializeTranslate, 500)
      }
    }

    // Start initialization after component mounts
    const timer = setTimeout(initializeTranslate, 100)

    return () => clearTimeout(timer)
  }, [])
  const resetTranslateIfNeeded = () => {
  const bannerFrame = document.querySelector('iframe.goog-te-banner-frame');
  if (!bannerFrame) {
    // If the top translate bar is gone, reinject the widget
    const element = document.getElementById('google_translate_element');
    if (element) element.innerHTML = ''; // Clear old instance

    if (typeof window.googleTranslateElementInit === 'function') {
      window.googleTranslateElementInit();
    }
  }
};
// const handleLanguageChange = (langCode: string) => {
//   resetTranslateIfNeeded(); // Reinitialize if needed

//   const select = document.querySelector<HTMLSelectElement>(
//     ".goog-te-combo"
//   );

//   if (select) {
//     select.value = langCode;
//     select.dispatchEvent(new Event("change"));
//   }
// };


  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 rounded-lg p-2">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">BAIMM</h1>
              <p className="text-sm text-gray-600">Medication Demand Forecasting</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
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
                display: isTranslateLoaded ? "block" : "none",
                minWidth: "10px",
                maxWidth: "220px",
                height: "32px", // Fixed height to fit header
                overflow: "hidden",
                position: "relative",
                zIndex: 50
              }}
            />
          </div>
        </div>
      </div>
    </header>
  )
}
