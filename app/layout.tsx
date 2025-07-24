import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import Script from "next/script"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "BAIMM",
  description: "Medication Demand Prediction and Analysis",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />
        <Script id="google-translate-init" strategy="afterInteractive">
          {`
            window.googleTranslateElementInit = function() {
              // Wait for the target element to be available
              const checkElement = () => {
                const element = document.getElementById('google_translate_element');
                if (element) {
                  new google.translate.TranslateElement(
                    {
                      pageLanguage: 'en',
                      includedLanguages: 'en,no',
                      layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                      autoDisplay: false
                    },
                    'google_translate_element'
                  );
                } else {
                  // Retry after a short delay if element not found
                  setTimeout(checkElement, 100);
                }
              };
              checkElement();
            };
          `}
        </Script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  )
}
