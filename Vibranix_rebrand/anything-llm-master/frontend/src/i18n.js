import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { defaultNS, resources } from "./locales/resources";

// Ensure any remaining literal occurrences of the upstream project name
// in translations are shown as 'Vibranix' in the UI. This performs a
// shallow walk through the resources object and replaces string values
// containing "AnythingLLM" with "Vibranix". This is a safe visual-only
// override and does not modify the source locale files themselves.
function replaceBrandInResources(obj) {
  if (!obj || typeof obj !== "object") return;
  for (const lng of Object.keys(obj)) {
    const namespaces = obj[lng];
    if (!namespaces || typeof namespaces !== "object") continue;
    for (const ns of Object.keys(namespaces)) {
      const res = namespaces[ns];
      // walk keys
      const walk = (val) => {
        if (typeof val === "string") {
          return val.replace(/AnythingLLM/g, "Vibranix");
        }
        if (Array.isArray(val)) return val.map(walk);
        if (val && typeof val === "object") {
          const out = {};
          for (const k of Object.keys(val)) out[k] = walk(val[k]);
          return out;
        }
        return val;
      };
      namespaces[ns] = walk(res);
    }
  }
}

replaceBrandInResources(resources);

i18next
  // https://github.com/i18next/i18next-browser-languageDetector/blob/9efebe6ca0271c3797bc09b84babf1ba2d9b4dbb/src/index.js#L11
  .use(initReactI18next) // Initialize i18n for React
  .use(LanguageDetector)
  .init({
    fallbackLng: "en",
    debug: import.meta.env.DEV,
    defaultNS,
    resources,
    lowerCaseLng: true,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18next;
