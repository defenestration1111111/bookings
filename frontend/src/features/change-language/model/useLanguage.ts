import { useTranslation } from "react-i18next";

export type Language = "en" | "ru";

export function useLanguage() {
  const { i18n } = useTranslation();

  const language = i18n.language as Language;

  function setLanguage(lang: Language) {
    i18n.changeLanguage(lang);
  }

  return { language, setLanguage };
}