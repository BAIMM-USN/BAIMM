"use client";
import React from "react";
import { Activity, LogOut, User, LogIn } from "lucide-react";
import { useTranslation } from "react-i18next"; // or from "next-i18next"

interface HeaderProps {
  user: { name: string; email: string } | null;
  onLogout: () => void;
  onLoginClick?: () => void;
}

export default function Header({ user, onLogout, onLoginClick }: HeaderProps) {
  const { t, i18n } = useTranslation("header"); // "header" is the namespace

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;
    const path = typeof window !== "undefined" ? window.location.pathname : "/";
    let newPath;

    if (/^\/(en|no)/.test(path)) {
      newPath = path.replace(/^\/(en|no)/, `/${lang}`);
    } else {
      newPath = `/${lang}${path === "/" ? "" : path}`;
    }

    if (window.location.pathname === newPath) {
      i18n.changeLanguage(lang);
    } else {
      window.location.pathname = newPath;
    }
  };

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
              <p className="text-sm text-gray-600">{t("Baimm_des")}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <select
              value={i18n.language}
              onChange={handleLanguageChange}
              className="border rounded px-2 py-1 text-sm"
              style={{ minWidth: 70 }}
            >
              <option value="en">EN</option>
              <option value="no">NO</option>
            </select>

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
                  {t("Logout")}
                </button>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <div className="text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                  {t("Guest_mode")}
                </div>
                <button
                  onClick={onLoginClick}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
                >
                  <LogIn className="w-4 h-4" />
                  {t("Login")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
