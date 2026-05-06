import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LanguageDropdown } from "../../features/change-language/ui/LanguageDropdown";

export default function Header() {
  const { t } = useTranslation();

  return (
    <header className="bg-white dark:bg-gray-900 text-sm font-medium h-20 w-full border-b sticky top-0 z-50 border-gray-100 dark:border-gray-800 shadow-[0_1px_2px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.05)]">
      <div className="flex justify-between items-center px-6 md:px-12 lg:px-20 w-full max-w-[1280px] mx-auto h-full">

        <Link to="/" className="flex items-center gap-2 cursor-pointer active:scale-95 duration-200">
          <span className="material-symbols-outlined text-[#ff385c] fill" style={{ fontSize: 32 }}>
            flight_takeoff
          </span>
          <span className="text-2xl font-bold text-[#ff385c]">SkyGlide</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 h-full pt-6">
          <a href="#" className="text-gray-900 dark:text-white border-b-2 border-gray-900 dark:border-white pb-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer active:scale-95 duration-200 font-semibold">
            {t("header.flights")}
          </a>
          <a href="#" className="text-gray-500 dark:text-gray-400 pb-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer active:scale-95 duration-200">
            {t("header.status")}
          </a>
          <a href="#" className="text-gray-500 dark:text-gray-400 pb-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer active:scale-95 duration-200">
            {t("header.checkIn")}
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 mr-4">
            <LanguageDropdown />
            <button
              type="button"
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors active:scale-95 duration-200 text-gray-900 dark:text-white"
            >
              <span className="material-symbols-outlined">account_circle</span>
            </button>
          </div>

          <button type="button" className="text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors px-4 py-2 rounded-full cursor-pointer active:scale-95 duration-200 hidden sm:block">
            {t("header.logIn")}
          </button>
          <button type="button" className="bg-[#ff385c] text-white px-6 py-2 rounded-full hover:bg-rausch-active transition-colors cursor-pointer active:scale-95 duration-200 hidden sm:block">
            {t("header.signUp")}
          </button>
        </div>
      </div>
    </header>
  );
}