import { useRef, useState, useEffect } from "react";
import { useLanguage, Language } from "../model/useLanguage";

const LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
];

export function LanguageDropdown() {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors active:scale-95 duration-200 text-gray-900 dark:text-white"
        aria-label="Change language"
      >
        <span className="material-symbols-outlined">language</span>
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] w-44 bg-canvas rounded-2xl shadow-xl border border-hairline overflow-hidden z-50">
          {LANGUAGES.map(lang => {
            const isActive = lang.code === language;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => { setLanguage(lang.code); setOpen(false); }}
                className={`w-full flex items-center justify-between px-4 py-3 transition-colors hover:bg-surface-soft ${isActive ? "text-ink" : "text-muted"}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">{lang.flag}</span>
                  <span className="font-body-sm text-body-sm">{lang.label}</span>
                </div>
                {isActive && (
                  <span className="material-symbols-outlined text-[16px] text-rausch">check</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}