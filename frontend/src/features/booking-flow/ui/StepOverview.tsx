import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  BookingFormValues,
  BookingLegRequest,
  BookingRequest,
} from "../../../entities/booking/model/booking";
import { useBookingContext } from "../../../entities/booking/model/BookingContext";
import { useBooking } from "../../../entities/booking/model/useBooking";
import { CancellationSection } from "../../../entities/booking/ui/CancellationSection";
import { PassengersSection } from "../../../entities/booking/ui/PassengerSection";
import { PriceSummary } from "../../../entities/booking/ui/PriceSummary";
import { RequiredTripSection } from "../../../entities/booking/ui/RequiredTripSection";
import { SeatingSection } from "../../seat-assignment/ui/SeatingSection";
import { ConfirmButton } from "./ConfirmButton";
import { PaymentSection } from "./PaymentSection";

export function StepOverview({
  onBackToPassengers,
  onBackToSeating,
}: {
  onBackToPassengers: () => void;
  onBackToSeating: () => void;
}) {
  const navigate = useNavigate();
  const { selectedFlight, passengerCount, passengers, seatsByLeg, setConfirmation } = useBookingContext();
  const allSeatIds = seatsByLeg.flat();

  const { book, loading, error } = useBooking();

  const { control, handleSubmit, formState: { isValid } } = useForm<BookingFormValues>({
    mode: "onChange",
    defaultValues: { cardNumber: "", expiration: "", cvv: "" },
  });

  async function onSubmit(values: BookingFormValues) {
    if (!selectedFlight) return;

    // Backend currently accepts a single passenger per booking (see api.yaml).
    const [primary] = passengers;
    if (!primary) return;

    // One seat per leg in the single-passenger case.
    const legs: BookingLegRequest[] = selectedFlight.legs.map((leg, i) => ({
      flightId: leg.flightId,
      seatNo: seatsByLeg[i]?.[0] ?? "",
    }));

    const request: BookingRequest = {
      passenger: { firstName: primary.firstName, lastName: primary.lastName },
      legs,
      payment: {
        cardNumber: values.cardNumber,
        // FE renders "MM / YY"; backend regex requires "MM/YY".
        expiration: values.expiration.replace(/\s+/g, ""),
        cvv: values.cvv,
      },
    };

    const result = await book(request);
    if (result) {
      setConfirmation(result);
      navigate("/confirmation");
    }
  }

  if (!selectedFlight) return null;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col md:flex-row gap-section relative"
    >
      <div className="w-full md:w-[58%] flex flex-col gap-xl">
        <PassengersSection passengers={passengers} onEdit={onBackToPassengers} />
        <SeatingSection seatIds={allSeatIds} onEdit={onBackToSeating} />
        <RequiredTripSection />
        <CancellationSection />
        <PaymentSection control={control} />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error.message}
          </div>
        )}

        <ConfirmButton loading={loading} disabled={!isValid || loading} />
      </div>

      <div className="w-full md:w-[42%]">
        <PriceSummary flight={selectedFlight} passengerCount={passengerCount} />
      </div>
    </form>
  );
}
