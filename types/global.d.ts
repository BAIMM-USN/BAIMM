declare global {
  interface Window {
    google: {
      translate: {
        TranslateElement: {
          new (options: any, elementId: string): void
          InlineLayout: {
            SIMPLE: string
          }
        }
      }
    }
    googleTranslateElementInit: () => void
    changeGoogleTranslateLanguage: (langCode: string) => boolean
  }
}

export {}
