import { buildColumnGroups } from "../lib/seatLayout";
import { Seat, SeatLayout } from "../model/seat";
import { ColumnHeader } from "./ColumnHeader";
import { SeatRow } from "./SeatRow";

type Props = {
  seatClass: string;
  seats: Seat[];
  layout: SeatLayout;
  selectedSeats: string[];
  seatAssignments: Map<string, number>;
  passengers: { firstName: string; lastName: string }[];
  onToggle: (seat: Seat) => void;
};

export function SeatSection({
  seatClass, seats, layout, selectedSeats, seatAssignments, passengers, onToggle,
}: Props) {
  const rows = [...new Set(seats.map((s) => s.row))].sort((a, b) => a - b);
  const classColumns = layout.columns.filter((col) => seats.some((s) => s.letter === col));
  const columnGroups = buildColumnGroups(classColumns, layout.aisles_after);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-title-md text-title-md text-ink">{seatClass}</h3>
        <div className="h-px bg-hairline flex-grow ml-4" />
      </div>

      <ColumnHeader columnGroups={columnGroups} seatClass={seatClass} />

      {rows.map((row) => (
        <SeatRow
          key={row}
          row={row}
          seats={seats.filter((s) => s.row === row)}
          columnGroups={columnGroups}
          selectedSeats={selectedSeats}
          seatAssignments={seatAssignments}
          passengers={passengers}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}
