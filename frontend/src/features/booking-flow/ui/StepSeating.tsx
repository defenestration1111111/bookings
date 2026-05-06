import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useBookingContext } from "../../../entities/booking/model/BookingContext";
import { Seat } from "../../../entities/seat/model/seat";
import SeatMap from "../../../entities/seat/ui/SeatMap";
import { useSeatAssignments } from "../../seat-assignment/model/useSeatAssignments";
import { useSeatSelection } from "../../seat-assignment/model/useSeatSelection";
import { LegProgress } from "../../seat-assignment/ui/LegProgress";
import { SeatAssignmentsPanel } from "../../seat-assignment/ui/SeatAssignmentsPanel";
import { SeatAssignPopup } from "../../seat-assignment/ui/SeatAssignPopup";
import { SeatLegend } from "../../seat-assignment/ui/SeatLegend";
import { SeatMapShell } from "../../seat-assignment/ui/SeatMapShell";
import { BackButton, NextButton } from "./BookingNavButtons";

type Props = {
  legIndex: number;
  totalLegs: number;
  onNext: () => void;
  onBack: () => void;
};

export function StepSeating({ legIndex, totalLegs, onNext, onBack }: Props) {
  const { t } = useTranslation();
  const { selectedFlight, passengers, setSeatsForLeg } = useBookingContext();
  const leg = selectedFlight!.legs[legIndex];
  const { seats, layout, loading } = useSeatSelection(selectedFlight!.id);
  const { assign, getAssignments, getSeatIdsForLeg } = useSeatAssignments(totalLegs);

  const [pendingSeat, setPendingSeat] = useState<Seat | null>(null);

  const assignments = getAssignments(legIndex);
  const assignedSeatIds = getSeatIdsForLeg(legIndex);
  const allAssigned = passengers.length > 0 && assignments.size === passengers.length;
  const isLastLeg = legIndex === totalLegs - 1;
  const isFirstLeg = legIndex === 0;

  function handleSeatClick(seat: Seat) {
    if (seat.unavailable) return;
    setPendingSeat(seat);
  }

  function handleAssign(passengerIdx: number) {
    if (!pendingSeat) return;
    assign(legIndex, pendingSeat, passengerIdx);
    setPendingSeat(null);
  }

  function handleNext() {
    setSeatsForLeg(legIndex, getSeatIdsForLeg(legIndex));
    onNext();
  }

  if (loading) {
    return <div className="p-12 text-center text-muted">{t("booking.seating.loading")}</div>;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-12">
      <div className="flex-1 flex flex-col items-center">
        <div className="w-full mb-6 flex items-center justify-between">
          <div>
            <p className="font-display-md text-display-md text-ink">
              {leg.from} → {leg.to}
            </p>
            <p className="font-body-sm text-body-sm text-muted mt-0.5">
              {leg.departTime} · {leg.duration}
            </p>
          </div>
          {totalLegs > 1 && (
            <span className="font-title-sm text-title-sm text-muted">
              {t("booking.seating.seatingOf", { current: legIndex + 1, total: totalLegs })}
            </span>
          )}
        </div>

        <SeatLegend />

        <SeatMapShell>
          {layout && (
            <SeatMap
              seats={seats}
              layout={layout}
              selectedSeats={assignedSeatIds}
              seatAssignments={assignments}
              passengers={passengers}
              onToggle={handleSeatClick}
            />
          )}
        </SeatMapShell>
      </div>

      <div className="lg:w-[300px] flex flex-col gap-6">
        <SeatAssignmentsPanel passengers={passengers} assignments={assignments} />
        <LegProgress totalLegs={totalLegs} currentLeg={legIndex} />

        <div className="flex flex-col gap-3 mt-auto">
          <BackButton 
            onClick={onBack} 
            label={isFirstLeg ? t("booking.seating.back") : t("booking.seating.previousSeating")}
          />
          <NextButton
            onClick={handleNext}
            label={isLastLeg ? t("booking.seating.continueToOverview") : t("booking.seating.next")}
            disabled={!allAssigned}
          />
        </div>
      </div>

      {pendingSeat && (
        <SeatAssignPopup
          seat={pendingSeat}
          passengers={passengers}
          assignments={assignments}
          onAssign={handleAssign}
          onClose={() => setPendingSeat(null)}
        />
      )}
    </div>
  );
}