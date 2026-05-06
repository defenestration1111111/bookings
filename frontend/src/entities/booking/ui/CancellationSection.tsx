import { useTranslation } from "react-i18next";

export function CancellationSection() {
  const { t } = useTranslation();

  return (
    <section className="pb-base">
      <h2 className="font-display-lg text-display-lg text-ink mb-base">
        {t("booking.overview.cancellation.title")}
      </h2>
      <p className="font-body-md text-body-md text-ink">
        {t("booking.overview.cancellation.body")}
      </p>
      <button className="font-title-md text-title-md text-ink underline hover:text-rausch transition-colors mt-xs" type="button">
        {t("booking.overview.cancellation.learnMore")}
      </button>
    </section>
  );
}