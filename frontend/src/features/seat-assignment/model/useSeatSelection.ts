import { useState, useMemo } from "react";
import { getSeatMap } from "../../../entities/seat/api/seats.api";
import { Seat, SeatLayout } from "../../../entities/seat/model/seat";
import { useFetch } from "../../../shared/api/useFetch";

type UseSeatSelectionResult = {
  seats: Seat[];
  layout: SeatLayout | null;
  selectedSeats: Seat[];
  loading: boolean;
  error: Error | null;
  toggleSeat: (seat: Seat) => void;
  totalSeatPrice: number;
};

export function useSeatSelection(flightId: number): UseSeatSelectionResult {
  const { data, loading, error } = useFetch(
    (signal) => getSeatMap(flightId, signal),
    [flightId]
  );

  const seats = data?.seats ?? [];
  const layout = data?.layout ?? null;

  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);

  const selectedSeats = useMemo(
    () => seats.filter((seat) => selectedSeatIds.includes(seat.id)),
    [seats, selectedSeatIds]
  );

  const totalSeatPrice = useMemo(
    () => selectedSeats.reduce((sum, seat) => sum + seat.price, 0),
    [selectedSeats]
  );

  function toggleSeat(seat: Seat) {
    if (seat.unavailable) return;
    setSelectedSeatIds((current) =>
      current.includes(seat.id)
        ? current.filter((id) => id !== seat.id)
        : [...current, seat.id]
    );
  }

  return { seats, layout, selectedSeats, loading, error, toggleSeat, totalSeatPrice };
}