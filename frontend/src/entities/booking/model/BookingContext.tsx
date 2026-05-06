import { createContext, useContext, useState, ReactNode } from "react";
import { FlightOption, SearchParams } from "../../flight/model/flight";
import { PassengerInfo } from "../../passenger/model/passenger";

type BookingContextType = {
  selectedFlight: FlightOption | null;
  passengerCount: number;
  seatsByLeg: string[][];          // ← было: selectedSeatIds: string[]
  passengers: PassengerInfo[];
  searchParams: SearchParams | null;

  selectFlight: (flight: FlightOption) => void;
  setPassengerCount: (count: number) => void;
  setSeatsByLeg: (seatsByLeg: string[][]) => void;   // ← было: setSelectedSeatIds
  setSeatsForLeg: (legIndex: number, ids: string[]) => void; // ← новое
  setPassengers: (passengers: PassengerInfo[]) => void;
  setSearchParams: (params: SearchParams) => void;
  reset: () => void;
};

const BookingContext = createContext<BookingContextType | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [selectedFlight, setSelectedFlight] = useState<FlightOption | null>(null);
  const [passengerCount, setPassengerCount] = useState(1);
  const [seatsByLeg, setSeatsByLeg] = useState<string[][]>([]);
  const [passengers, setPassengers] = useState<PassengerInfo[]>([]);
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);

  function selectFlight(flight: FlightOption) {
    setSelectedFlight(flight);
  }

  function setSeatsForLeg(legIndex: number, ids: string[]) {
    setSeatsByLeg(prev => {
      const next = [...prev];
      next[legIndex] = ids;
      return next;
    });
  }

  function reset() {
    setSelectedFlight(null);
    setPassengerCount(1);
    setSeatsByLeg([]);
    setPassengers([]);
    setSearchParams(null);
  }

  return (
    <BookingContext.Provider value={{
      selectedFlight,
      passengerCount,
      seatsByLeg,
      passengers,
      searchParams,
      selectFlight,
      setPassengerCount,
      setSeatsByLeg,
      setSeatsForLeg,
      setPassengers,
      setSearchParams,
      reset,
    }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBookingContext(): BookingContextType {
  const context = useContext(BookingContext);
  if (!context) throw new Error("useBookingContext нужно использовать внутри BookingProvider");
  return context;
}