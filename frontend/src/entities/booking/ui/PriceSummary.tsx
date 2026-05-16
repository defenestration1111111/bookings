import { useTranslation } from "react-i18next";
import { calculateBookingPrice } from "../lib/pricing";
import { Itinerary } from "../../flight/model/flight";

const flightSummaryImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD3yCyUpoPo7aJ4wMokwil0c01-EqbtGErqDWRzjmmgn8AkjyTmTw7f5vF4MvJm7DZMwCEeZK9j80-EWH9cbDvEwRL3eAlDix7DA4wdloHglwQke52WMW9enuGHFkncr3QKSfYsxCkj5jZrH7wHA_jzUMvsYJjm4chuSUSoqFkDkEfpknI2w8qjRrASTcWt0JZ8PLtK4h2gyzxl9WT6Ax0h1Awj06jv0vtMUA6TkJ9JYV2rGsXMwj_ZZUSP5sjYvVK8LOq4yTzKK20";

type PriceSummaryProps = {
  flight: Itinerary;
  passengerCount: number;
};

export function PriceSummary({ flight, passengerCount }: PriceSummaryProps) {
  const { t } = useTranslation();

  const firstLeg = flight.legs[0];
  const lastLeg = flight.legs[flight.legs.length - 1];
  const { fareTotal, taxes, baggageFee, total } = calculateBookingPrice(
    flight,
    passengerCount
  );

  return (
    <div className="sticky top-24 border border-border-strong rounded-[14px] p-lg bg-canvas shadow-[0_1px_2px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.05)] flex flex-col gap-lg">
      <div className="flex gap-base border-b border-hairline pb-lg">
        <div className="w-[120px] h-[100px] rounded-lg overflow-hidden bg-surface-soft flex-shrink-0">
          <img
            alt="Flight view"
            className="w-full h-full object-cover"
            src={flightSummaryImage}
          />
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <p className="font-caption text-caption text-muted">
              {t("booking.priceSummary.fareClass", { class: flight.fareClass })}
            </p>
            <p className="font-body-md text-body-md text-ink mt-xs">
              {t("booking.priceSummary.to", {
                from: firstLeg.fromAirport.airportCode,
                to: lastLeg.toAirport.airportCode,
              })}
            </p>
          </div>

          <div className="flex items-center gap-xs">
            <span className="material-symbols-outlined text-ink text-sm fill">
              star
            </span>
            <span className="font-caption text-caption text-ink">4.8</span>
            <span className="font-caption text-caption text-muted">
              {t("booking.priceSummary.reviews", { count: 124 })}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-surface-soft p-md rounded-lg flex gap-md items-start">
        <span className="material-symbols-outlined text-rausch mt-[2px]">
          local_fire_department
        </span>
        <div>
          <p className="font-title-md text-title-md text-ink text-[14px]">
            {t("booking.priceSummary.priceProtection")}
          </p>
          <p className="font-body-sm text-body-sm text-muted">
            {t("booking.priceSummary.priceProtectionBody")}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-md border-b border-hairline pb-lg">
        <h3 className="font-display-lg text-display-lg text-ink">
          {t("booking.priceSummary.priceDetails")}
        </h3>

        <div className="flex justify-between items-center font-body-md text-body-md text-ink">
          <p className="underline">
            {t(
              passengerCount === 1
                ? "booking.priceSummary.perPassenger"
                : "booking.priceSummary.perPassengerPlural",
              { price: flight.price, count: passengerCount }
            )}
          </p>
          <p>${fareTotal.toFixed(2)}</p>
        </div>

        <div className="flex justify-between items-center font-body-md text-body-md text-ink">
          <p className="underline">
            {t("booking.priceSummary.taxesAndFees")}
          </p>
          <p>${taxes.toFixed(2)}</p>
        </div>

        <div className="flex justify-between items-center font-body-md text-body-md text-ink">
          <p className="underline">
            {t("booking.priceSummary.baggageFee")}
          </p>
          <p>${baggageFee.toFixed(2)}</p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <p className="font-display-md text-display-md text-ink font-bold">
          {t("booking.priceSummary.total")}
        </p>
        <p className="font-display-md text-display-md text-ink font-bold">
          ${total.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
