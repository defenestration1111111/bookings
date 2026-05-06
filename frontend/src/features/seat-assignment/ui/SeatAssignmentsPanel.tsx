import { useTranslation } from "react-i18next";
import { PassengerAvatar } from "../../../entities/booking/ui/PassengerAvatar";
import { PassengerInfo } from "../../../entities/passenger/model/passenger";

type Props = {
  passengers: PassengerInfo[];
  assignments: Map<string, number>;
};

export function SeatAssignmentsPanel({ passengers, assignments }: Props) {
  const { t } = useTranslation();
  return (
    <div className="border border-hairline rounded-2xl p-5 bg-canvas">
      <h3 className="font-title-md text-title-md text-ink mb-4">
        {t("booking.seating.assignments")}
      </h3>

      <div className="flex flex-col gap-3">
        {passengers.map((p, i) => {
          const seatId = [...assignments.entries()].find(([, idx]) => idx === i)?.[0];

          return (
            <div
              key={i}
              className="flex items-center justify-between py-2 border-b border-hairline-soft last:border-0"
            >
              <div className="flex items-center gap-2">
                <PassengerAvatar firstName={p.firstName} lastName={p.lastName} />
                <span className="font-body-sm text-body-sm text-ink">
                  {p.firstName} {p.lastName}
                </span>
              </div>
              <span className={`font-title-md text-title-md ${seatId ? "text-ink" : "text-muted"}`}>
                {seatId ?? "—"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}