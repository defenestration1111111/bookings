import { useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useBookingContext } from "../entities/booking/model/BookingContext";
import { TripSummary } from "../entities/booking/ui/TripSummary";
import { BookingStepper } from "../features/booking-flow/ui/BookingStepper";
import { StepOverview } from "../features/booking-flow/ui/StepOverview";
import { StepPassengers } from "../features/booking-flow/ui/StepPassengers";
import { StepSeating } from "../features/booking-flow/ui/StepSeating";
import { buildSavedSearchFlightsUrl } from "../entities/booking/lib/navigation";

export default function BookingPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { selectedFlight, searchParams: savedSearch, passengerCount } = useBookingContext();

  const rawStep = Number(searchParams.get("step") ?? 1);
  const step = [1, 2, 3].includes(rawStep) ? rawStep : 1;

  // legIndex живёт в URL вместе со step
  const legIndex = Number(searchParams.get("leg") ?? 0);

  function goTo(s: number, leg = 0) {
    setSearchParams({ step: String(s), leg: String(leg) });
  }

  function goToSearchResults() {
    navigate(buildSavedSearchFlightsUrl(savedSearch));
  }

  if (!selectedFlight) {
    return <div className="p-12 text-center">{t("booking.noFlight")}</div>;
  }

  const totalLegs = selectedFlight.legs.length;

  function handleSeatingNext() {
    if (legIndex < totalLegs - 1) {
      goTo(2, legIndex + 1);  // следующий leg
    } else {
      goTo(3, 0);             // все legs пройдены → Overview
    }
  }

  function handleSeatingBack() {
    if (legIndex > 0) {
      goTo(2, legIndex - 1);  // предыдущий leg
    } else {
      goTo(1, 0);             // первый leg → Passengers
    }
  }

  return (
    <main className="flex-grow w-full max-w-[1080px] mx-auto px-6 md:px-12 pt-section pb-section">
      <BookingStepper current={step} onStep={goTo} />

      <div className="mt-10 flex gap-8 items-start">
        <div className="flex-1 min-w-0">
          {step === 1 && (
            <StepPassengers
              onNext={() => goTo(2, 0)}
              onBack={goToSearchResults}
            />
          )}
          {step === 2 && (
            <StepSeating
              legIndex={legIndex}
              totalLegs={totalLegs}
              onNext={handleSeatingNext}
              onBack={handleSeatingBack}
            />
          )}
          {step === 3 && (
            <StepOverview
              onBackToPassengers={() => goTo(1)}
              onBackToSeating={() => goTo(2, totalLegs - 1)}
            />
          )}
        </div>

        {step === 1 && (
          <div className="w-[300px] shrink-0 hidden md:block">
            <TripSummary flight={selectedFlight} passengerCount={passengerCount} />
          </div>
        )}
      </div>
    </main>
  );
}
