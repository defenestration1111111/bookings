import { useTranslation } from "react-i18next";

export function RequiredTripSection() {
  const { t } = useTranslation();

  return (
    <section className="border-b border-hairline pb-xl">
      <h2 className="font-display-lg text-display-lg text-ink mb-lg">
        {t("booking.overview.required.title")}
      </h2>
      <div className="flex justify-between items-start">
        <div>
          <p className="font-title-md text-title-md text-ink">
            {t("booking.overview.required.messageAirline")}
          </p>
          <p className="font-body-md text-body-md text-muted">
            {t("booking.overview.required.messageAirlineBody")}
          </p>
        </div>
        <button className="px-lg py-sm border border-ink rounded-lg font-title-md text-title-md text-ink hover:bg-surface-soft transition-colors h-[48px]" type="button">
          {t("booking.overview.required.add")}
        </button>
      </div>
    </section>
  );
}