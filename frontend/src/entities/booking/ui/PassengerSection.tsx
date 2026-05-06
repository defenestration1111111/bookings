import { useTranslation } from "react-i18next";
import { PassengerInfo } from "../../passenger/model/passenger";
import { PassengerAvatar } from "./PassengerAvatar";

type Props = {
  passengers: PassengerInfo[];
  onEdit: () => void;
};

export function PassengersSection({ passengers, onEdit }: Props) {
  const { t } = useTranslation();

  return (
    <section className="border-b border-hairline pb-xl">
      <div className="flex justify-between items-center mb-lg">
        <h2 className="font-display-lg text-display-lg text-ink">
          {t("booking.overview.passengers")}
        </h2>
        <button
          type="button"
          onClick={onEdit}
          className="font-title-md text-title-md text-ink underline hover:text-rausch transition-colors"
        >
          {t("booking.overview.edit")}
        </button>
      </div>

      <div className="flex flex-col gap-sm">
        {passengers.map((p, i) => (
          <div key={i} className="flex items-center gap-3">
            <PassengerAvatar firstName={p.firstName} lastName={p.lastName} />
            <span className="font-body-md text-body-md text-ink">
              {p.firstName} {p.lastName}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}