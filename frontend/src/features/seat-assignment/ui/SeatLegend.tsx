import { useTranslation } from "react-i18next";

export function SeatLegend() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap justify-center gap-6 mb-10 font-caption text-caption text-ink w-full max-w-2xl">
      {[
        {
          className: "border border-hairline bg-canvas",
          label: t("booking.seating.legend.available"),
        },
        {
          className: "bg-rausch flex items-center justify-center",
          icon: "check",
          label: t("booking.seating.legend.selected"),
        },
        {
          className: "border border-hairline bg-surface-soft opacity-60",
          icon: "close",
          label: t("booking.seating.legend.unavailable"),
        },
        {
          className: "border border-hairline bg-[#f0f7ff]",
          label: t("booking.seating.legend.comfort"),
        },
      ].map(({ className, icon, label }) => (
        <div key={label} className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-lg ${className}`}>
            {icon && (
              <span className="material-symbols-outlined text-[16px] w-full h-full flex items-center justify-center text-ink">
                {icon}
              </span>
            )}
          </div>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}