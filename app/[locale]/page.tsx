import initTranslations from "@/app/i18n";
import TranslationsProvider from "@/components/TranslationProvider";
import App from "@/components/main";

const i18nNamespaces = [
  "header",
  "MedicationSelector",
  "ScatterPlot",
  "researchInfo",
  "login",
  "downloadModal",
  "mainPage",
  "ScatterFilters",
  "ScatterChart",
  "ScatterStats",
  "apiIntegrationGuide",
  "heatMap",
];

// Server component to fetch translations and pass as props
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { resources } = await initTranslations(locale, i18nNamespaces);

  return (
    <TranslationsProvider
      namespaces={i18nNamespaces}
      locale={locale}
      resources={resources}
    >
      <App />
    </TranslationsProvider>
  );
}

// Synchronous client component
// Synchronous client component
