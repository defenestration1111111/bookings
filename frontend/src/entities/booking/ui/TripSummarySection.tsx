import { formatPassengerLabel } from "../lib/pricing";

type TripSummarySectionProps = {
  passengerCount: number;
};

export function TripSummarySection({
  passengerCount,
}: TripSummarySectionProps) {
  return (
    <section className="border-b border-hairline pb-xl">
      <h2 className="font-display-lg text-display-lg text-ink mb-lg">Your trip</h2>

      <div className="flex flex-col gap-lg">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-title-md text-title-md text-ink">Dates</p>
            <p className="font-body-md text-body-md text-muted">Oct 12 – Oct 19, 2024</p>
          </div>
          <button
            className="font-title-md text-title-md text-ink underline hover:text-rausch transition-colors"
            type="button"
          >
            Edit
          </button>
        </div>

        <div className="flex justify-between items-start">
          <div>
            <p className="font-title-md text-title-md text-ink">Passengers</p>
            <p className="font-body-md text-body-md text-muted">
              {formatPassengerLabel(passengerCount)}
            </p>
          </div>
          <button
            className="font-title-md text-title-md text-ink underline hover:text-rausch transition-colors"
            type="button"
          >
            Edit
          </button>
        </div>
      </div>
    </section>
  );
}
