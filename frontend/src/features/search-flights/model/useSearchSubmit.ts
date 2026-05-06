import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBookingContext } from "../../../entities/booking/model/BookingContext";
import { buildFlightsUrl } from "../../../shared/lib/searchNavigation";

type SearchFormState = {
  from: string;
  to: string;
  depart: string;
  tripType: "oneWay" | "roundTrip";
  travellers: number;
};

export function useSearchSubmit(form: SearchFormState) {
  const navigate = useNavigate();
  const { setPassengerCount, setSearchParams } = useBookingContext();

  const [isSearching, setIsSearching] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const firstTimeoutRef = useRef<number | null>(null);
  const secondTimeoutRef = useRef<number | null>(null);

  function clearTimers() {
    if (firstTimeoutRef.current) {
      window.clearTimeout(firstTimeoutRef.current);
      firstTimeoutRef.current = null;
    }

    if (secondTimeoutRef.current) {
      window.clearTimeout(secondTimeoutRef.current);
      secondTimeoutRef.current = null;
    }
  }

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, []);

  function submitSearch(event: React.FormEvent) {
    event.preventDefault();

    clearTimers();
    setShowOverlay(false);
    setIsSearching(true);

    setPassengerCount(form.travellers);
    setSearchParams({
      from: form.from,
      to: form.to,
      departDate: form.depart,
      tripType: form.tripType,
      passengerCount: form.travellers,
    });

    firstTimeoutRef.current = window.setTimeout(() => {
      setShowOverlay(true);

      secondTimeoutRef.current = window.setTimeout(() => {
        setIsSearching(false);
        setShowOverlay(false);

        navigate(
          buildFlightsUrl({
            from: form.from,
            to: form.to,
            depart: form.depart,
            tripType: form.tripType,
            travellers: form.travellers,
          })
        );
      }, 1100);
    }, 600);
  }

  return {
    isSearching,
    showOverlay,
    submitSearch,
  };
}