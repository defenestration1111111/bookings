import { useEffect, useState } from "react";
import { useAirports } from "./useAirports";
import { Airport } from "../../../entities/airport/model/airport";

type TripType = "roundTrip" | "oneWay";

function airportLabel(airport: Airport) {
  return `${airport.city}, ${airport.airport_code}`;
}

export function useSearchForm() {
  const { airports } = useAirports();

  const [tripType, setTripType] = useState<TripType>("roundTrip");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [depart, setDepart] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [travellers, setTravellers] = useState(1);

  const isRoundTrip = tripType === "roundTrip";

  useEffect(() => {
    if (!from && airports[0]) {
      setFrom(airportLabel(airports[0]));
    }
  }, [airports, from]);

  return {
    airports,
    tripType,
    isRoundTrip,
    from,
    to,
    depart,
    returnDate,
    travellers,
    setTripType,
    setFrom,
    setTo,
    setDepart,
    setReturnDate,
    setTravellers,
  };
}
