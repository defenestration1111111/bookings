import { PassengerAvatar } from "../../../entities/booking/ui/PassengerAvatar";
import { Seat } from "../../../entities/seat/model/seat";

export function SeatAssignPopup({
  seat,
  passengers,
  assignments,
  onAssign,
  onClose,
}: {
  seat: Seat;
  passengers: { firstName: string; lastName: string }[];
  assignments: Map<string, number>;
  onAssign: (passengerIdx: number) => void;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-canvas rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="font-caption text-caption text-muted mb-0.5">Seat</p>
            <p className="font-display-md text-display-md text-ink">{seat.id}</p>
            <p className="font-caption text-caption text-muted mt-1">
              {seat.seatClass} · ${seat.price}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-surface-soft flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[18px] text-muted">
              close
            </span>
          </button>
        </div>

        <div className="h-px bg-hairline" />

        <p className="font-body-sm text-body-sm text-muted">Assign this seat to:</p>

        <div className="flex flex-col gap-2">
          {passengers.map((p, i) => {
            const currentSeat = [...assignments.entries()].find(([, idx]) => idx === i)?.[0];
            const hasOther = currentSeat !== undefined && currentSeat !== seat.id;
            const isThisSeat = currentSeat === seat.id;

            return (
              <button
                key={i}
                onClick={() => onAssign(i)}
                className="flex items-center justify-between px-4 py-3 rounded-xl border border-hairline hover:border-ink hover:bg-surface-soft transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <PassengerAvatar firstName={p.firstName} lastName={p.lastName} />
                  <div>
                    <p className="font-title-md text-title-md text-ink">
                      {p.firstName} {p.lastName}
                    </p>
                    {hasOther && (
                      <p className="font-caption text-caption text-muted">
                        Currently in {currentSeat}
                      </p>
                    )}
                  </div>
                </div>

                <span
                  className={`text-[12px] font-semibold px-3 py-1 rounded-full ${
                    isThisSeat
                      ? "bg-rausch/10 text-rausch"
                      : "bg-surface-soft text-ink"
                  }`}
                >
                  {isThisSeat ? "Selected" : hasOther ? "Change" : "Select"}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}