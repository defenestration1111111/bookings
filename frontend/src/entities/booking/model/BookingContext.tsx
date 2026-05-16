import { createContext, useContext, useState, ReactNode } from "react";
import { Itinerary, SearchParams } from "../../flight/model/flight";
import { PassengerInfo } from "../../passenger/model/passenger";

type BookingContextType = {
  selectedFlight: Itinerary | null;
  passengerCount: number;
  seatsByLeg: string[][];
  passengers: PassengerInfo[];
  searchParams: SearchParams | null;

  selectFlight: (flight: Itinerary) => void;
  setPassengerCount: (count: number) => void;
  setSeatsByLeg: (seatsByLeg: string[][]) => void;
  setSeatsForLeg: (legIndex: number, ids: string[]) => void;
  setPassengers: (passengers: PassengerInfo[]) => void;
  setSearchParams: (params: SearchParams) => void;
  reset: () => void;
};

const BookingContext = createContext<BookingContextType | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [selectedFlight, setSelectedFlight] = useState<Itinerary | null>(null);
  const [passengerCount, setPassengerCount] = useState(1);
  const [seatsByLeg, setSeatsByLeg] = useState<string[][]>([]);
  const [passengers, setPassengers] = useState<PassengerInfo[]>([]);
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);

  function selectFlight(flight: Itinerary) {
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