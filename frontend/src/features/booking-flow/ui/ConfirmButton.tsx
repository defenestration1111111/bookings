import { useTranslation, Trans } from "react-i18next";

type Props = {
  loading: boolean;
  disabled: boolean;
};


export function ConfirmButton({ loading, disabled }: Props) {
  const { t } = useTranslation();

  return (
    <div className="pt-base">
      <p className="font-caption text-caption text-muted mb-lg">
        <Trans
          i18nKey="booking.overview.confirm.legal"
          values={{
            rules: t("booking.overview.confirm.airlinesRules"),
            terms: t("booking.overview.confirm.termsOfService"),
            privacy: t("booking.overview.confirm.privacyPolicy"),
          }}
          components={{
            rules: <a className="underline text-ink" href="#" />,
            terms: <a className="underline text-ink" href="#" />,
            privacy: <a className="underline text-ink" href="#" />,
          }}
        />
      </p>

      <button
        type="submit"
        disabled={disabled}
        className="bg-rausch text-white font-title-md text-title-md rounded-lg px-8 h-[48px] hover:bg-rausch-active transition-colors flex items-center gap-2 active:scale-95 duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
      >
        <span className="material-symbols-outlined fill text-[18px]">lock</span>
        {loading ? t("booking.overview.confirm.booking") : t("booking.overview.confirm.confirmPay")}
      </button>
    </div>
  );
}