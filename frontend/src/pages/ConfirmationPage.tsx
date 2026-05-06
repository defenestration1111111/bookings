import { useBookingContext } from "../entities/booking/model/BookingContext";

export default function ConfirmationPage() {
  const { selectedFlight, passengers, seatsByLeg } = useBookingContext();
  const allSeatIds = seatsByLeg.flat();
  const firstLeg = selectedFlight!.legs[0];

  return (
    <main className="w-full max-w-[1080px] mx-auto px-6 py-16 flex-1">
      <div className="flex flex-col items-center text-center mb-16">
        <span className="material-symbols-outlined text-4xl text-rausch mb-6">check_circle</span>
        <h1 className="font-display-xl text-ink mb-2">Booking Confirmed</h1>
        <p className="text-muted">Your booking details have been sent to your email.</p>
      </div>

      <div className="max-w-3xl mx-auto border rounded-[24px] overflow-hidden shadow-sm">
        <div className="bg-rausch text-white p-6 flex justify-between items-center">
          <span className="font-title-md">Flight SG{selectedFlight!.id}</span>
          <span className="font-body-md opacity-90">{firstLeg.departTime}</span>
        </div>

        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <div className="text-4xl font-bold">{firstLeg.from}</div>
              <div className="text-muted mt-1">{firstLeg.departTime}</div>
            </div>
            <span className="material-symbols-outlined text-rausch text-[32px]">flight</span>
            <div className="text-right">
              <div className="text-4xl font-bold">{firstLeg.to}</div>
              <div className="text-muted mt-1">{firstLeg.arriveTime}</div>
            </div>
          </div>

          <div className="h-px bg-hairline mb-6" />

          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="font-caption text-caption text-muted mb-2">
                {passengers.length === 1 ? "Passenger" : "Passengers"}
              </div>
              {passengers.map((p, i) => (
                <div key={i} className="font-title-md text-ink">
                  {p.firstName} {p.lastName}
                </div>
              ))}
            </div>
            <div>
              <div className="font-caption text-caption text-muted mb-2">
                {allSeatIds.length === 1 ? "Seat" : "Seats"}
              </div>
              <div className="flex flex-wrap gap-2">
                {allSeatIds.map((id) => (
                  <span
                    key={id}
                    className="px-3 py-1 rounded-lg border border-hairline bg-surface-soft font-title-md text-ink"
                  >
                    {id}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}