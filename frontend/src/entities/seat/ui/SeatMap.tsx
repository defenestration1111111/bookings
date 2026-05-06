import { Seat, SeatLayout } from "../model/seat";
import { SeatSection } from "./SeatSection";

type Props = {
  seats: Seat[];
  layout: SeatLayout;
  selectedSeats: string[];
  seatAssignments: Map<string, number>;
  passengers: { firstName: string; lastName: string }[];
  onToggle: (seat: Seat) => void;
};

export default function SeatMap({ seats, layout, selectedSeats, seatAssignments, passengers, onToggle }: Props) {
  const seatClasses = [...new Set(seats.map((s) => s.seatClass))];

  return (
    <div className="space-y-10">
      {seatClasses.map((seatClass) => (
        <SeatSection
          key={seatClass}
          seatClass={seatClass}
          seats={seats.filter((s) => s.seatClass === seatClass)}
          layout={layout}
          selectedSeats={selectedSeats}
          seatAssignments={seatAssignments}
          passengers={passengers}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}