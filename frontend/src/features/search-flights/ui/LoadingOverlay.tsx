import { useTranslation } from "react-i18next";

export function LoadingOverlay({ visible }: { visible: boolean }) {
  const { t } = useTranslation();

  return (
    <div
      className={`fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="relative w-64 h-2 flex items-center justify-center mb-8">
        <div className="absolute w-full h-[2px] border-t-2 border-dashed border-gray-200" />
        <div className="absolute left-0 animate-[fly_2s_infinite_linear]">
          <span className="material-symbols-outlined text-primary text-3xl rotate-90">
            flight
          </span>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-ink animate-pulse">
        {t("search.loading")}
      </h2>
    </div>
  );
}