import { useState } from "react";

type TripType = "roundTrip" | "oneWay";

export function useSearchForm() {
  const [tripType, setTripType] = useState<TripType>("roundTrip");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [depart, setDepart] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [travellers, setTravellers] = useState(1);

  const isRoundTrip = tripType === "roundTrip";

  return {
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
