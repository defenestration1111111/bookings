import { Fragment } from "react";
import { getInitials } from "../../passenger/lib/name";
import { Seat } from "../model/seat";
import SeatButton from "./SeatButton";

type Props = {
  row: number;
  seats: Seat[];
  columnGroups: string[][];
  selectedSeats: string[];
  seatAssignments: Map<string, number>;
  passengers: { firstName: string; lastName: string }[];
  onToggle: (seat: Seat) => void;
};

export function SeatRow({
  row, seats, columnGroups, selectedSeats, seatAssignments, passengers, onToggle,
}: Props) {
  const seatByLetter = Object.fromEntries(seats.map((s) => [s.letter, s]));

  return (
    <div className="flex items-center justify-center gap-6 mb-3">
      {columnGroups.map((group, gi) => (
        <Fragment key={`${row}-${group.join("")}`}>
          {gi > 0 && (
            gi === Math.floor(columnGroups.length / 2) ? (
              <div className="w-8 flex items-center justify-center font-caption text-caption text-muted">
                {row}
              </div>
            ) : (
              <div className="w-8" />
            )
          )}
          <div className="flex gap-2">
            {group.map((col) => {
              const seat = seatByLetter[col];
              if (!seat) return <div key={col} className="w-9 h-9" />;

              const passengerIdx = seatAssignments.get(seat.id);
              const initials =
                passengerIdx !== undefined && passengers[passengerIdx]
                  ? getInitials(passengers[passengerIdx])
                  : undefined;

              return (
                <SeatButton
                  key={seat.id}
                  seat={seat}
                  selected={selectedSeats.includes(seat.id)}
                  assignedInitials={initials}
                  onToggle={onToggle}
                />
              );
            })}
          </div>
        </Fragment>
      ))}

      {columnGroups.length === 1 && (
        <div className="w-8 flex items-center justify-center font-caption text-caption text-muted">
          {row}
        </div>
      )}
    </div>
  );
}
