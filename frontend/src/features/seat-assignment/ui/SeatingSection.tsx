import { useTranslation } from "react-i18next";

type Props = {
  seatIds: string[];
  onEdit: () => void;
};

export function SeatingSection({ seatIds, onEdit }: Props) {
  const { t } = useTranslation();

  return (
    <section className="border-b border-hairline pb-xl">
      <div className="flex justify-between items-center mb-lg">
        <h2 className="font-display-lg text-display-lg text-ink">
          {t("booking.overview.seating")}
        </h2>
        <button type="button" onClick={onEdit} className="font-title-md text-title-md text-ink underline hover:text-rausch transition-colors">
          {t("booking.overview.edit")}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {seatIds.length > 0 ? (
          seatIds.map((seatId) => (
            <div key={seatId} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-hairline bg-surface-soft">
              <span className="material-symbols-outlined text-[16px] text-rausch">airline_seat_recline_extra</span>
              <span className="font-title-md text-title-md text-ink">{seatId}</span>
            </div>
          ))
        ) : (
          <p className="font-body-sm text-body-sm text-muted">
            {t("booking.overview.seatsNotSelected")}
          </p>
        )}
      </div>
    </section>
  );
}