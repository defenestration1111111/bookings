import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FareClass } from "../../../entities/flight/model/flight";
import { Range } from "../../../shared/types/common";
import DoubleRange from "../../../shared/ui/DoubleRange";
import { PRICE_MAX, PRICE_MIN } from "../model/useFlightFilters";

type FlightFiltersProps = {
  priceRange: Range;
  departureRange: Range;
  arrivalRange: Range;
  fareClasses: FareClass[];
  maxStopovers: number;
  maxTravelHours: number | null;
  onPriceRange: (range: Range) => void;
  onDepartureRange: (range: Range) => void;
  onArrivalRange: (range: Range) => void;
  onFareClass: (fareClass: FareClass) => void;
  onMaxStopovers: (n: number) => void;
  onMaxTravelHours: (h: number | null) => void;
};

function formatTime(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const period = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;
  return `${hour12}:${mins.toString().padStart(2, "0")} ${period}`;
}

export default function FlightFilters({
  arrivalRange,
  departureRange,
  fareClasses,
  maxStopovers,
  maxTravelHours,
  onArrivalRange,
  onDepartureRange,
  onFareClass,
  onPriceRange,
  priceRange,
  onMaxStopovers,
  onMaxTravelHours,
}: FlightFiltersProps) {
  const { t } = useTranslation();
  const [draftPriceRange, setDraftPriceRange] = useState(priceRange);
  const [draftDepartureRange, setDraftDepartureRange] = useState(departureRange);
  const [draftArrivalRange, setDraftArrivalRange] = useState(arrivalRange);
  const [draftTravelHours, setDraftTravelHours] = useState<number>(
    maxTravelHours ?? 24
  );

  useEffect(() => setDraftPriceRange(priceRange), [priceRange]);
  useEffect(() => setDraftDepartureRange(departureRange), [departureRange]);
  useEffect(() => setDraftArrivalRange(arrivalRange), [arrivalRange]);
  useEffect(
    () => setDraftTravelHours(maxTravelHours ?? 24),
    [maxTravelHours]
  );

  const travelHoursEnabled = maxTravelHours != null;

  return (
    <aside className="w-full md:w-64 flex-shrink-0">
      <div className="sticky top-28 space-y-8">
        <div>
          <h3 className="font-title-md text-title-md text-ink mb-4">
            {t("results.filters.priceRange")}
          </h3>

          <DoubleRange
            max={PRICE_MAX}
            min={PRICE_MIN}
            step={500}
            tone="rausch"
            range={draftPriceRange}
            onChange={setDraftPriceRange}
            onCommit={onPriceRange}
          />

          <div className="flex justify-between font-body-sm text-body-sm text-muted">
            <span>${draftPriceRange[0].toLocaleString()}</span>
            <span>
              {draftPriceRange[1] >= PRICE_MAX
                ? `$${PRICE_MAX.toLocaleString()}+`
                : `$${draftPriceRange[1].toLocaleString()}`}
            </span>
          </div>
        </div>

        <hr className="border-hairline-soft" />

        <div>
          <h3 className="font-title-md text-title-md text-ink mb-4">
            {t("results.filters.time")}
          </h3>

          <div className="space-y-6">
            <div>
              <p className="font-caption text-caption text-ink mb-3">
                {t("results.filters.departure")}
              </p>

              <DoubleRange
                max={1439}
                min={0}
                step={15}
                tone="ink"
                range={draftDepartureRange}
                onChange={setDraftDepartureRange}
                onCommit={onDepartureRange}
              />

              <div className="flex justify-between font-body-sm text-body-sm text-muted">
                <span>{formatTime(draftDepartureRange[0])}</span>
                <span>{formatTime(draftDepartureRange[1])}</span>
              </div>
            </div>

            <div>
              <p className="font-caption text-caption text-ink mb-3">
                {t("results.filters.arrival")}
              </p>

              <DoubleRange
                max={1439}
                min={0}
                step={15}
                tone="ink"
                range={draftArrivalRange}
                onChange={setDraftArrivalRange}
                onCommit={onArrivalRange}
              />

              <div className="flex justify-between font-body-sm text-body-sm text-muted">
                <span>{formatTime(draftArrivalRange[0])}</span>
                <span>{formatTime(draftArrivalRange[1])}</span>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-hairline-soft" />

        <div>
          <h3 className="font-title-md text-title-md text-ink mb-4">
            {t("results.filters.fareClass")}
          </h3>

          <div className="space-y-3">
            {(["Economy", "Comfort", "Business"] as FareClass[]).map(
              (fareClass) => (
                <label
                  key={fareClass}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={fareClasses.includes(fareClass)}
                    onChange={() => onFareClass(fareClass)}
                    className="w-5 h-5 rounded border-border-strong text-rausch focus:ring-rausch"
                  />

                  <span className="font-body-sm text-body-sm text-ink">
                    {fareClass}
                  </span>
                </label>
              )
            )}
          </div>
        </div>

        <hr className="border-hairline-soft" />

        <div>
          <h3 className="font-title-md text-title-md text-ink mb-4">Stops</h3>

          <div className="space-y-3">
            {[
              { value: 0, label: "Direct only" },
              { value: 1, label: "Up to 1 stop" },
              { value: 2, label: "Up to 2 stops" },
            ].map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-3 cursor-pointer"
              >
                <input
                  type="radio"
                  name="maxStopovers"
                  checked={maxStopovers === opt.value}
                  onChange={() => onMaxStopovers(opt.value)}
                  className="w-5 h-5 border-border-strong text-rausch focus:ring-rausch"
                />
                <span className="font-body-sm text-body-sm text-ink">
                  {opt.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <hr className="border-hairline-soft" />

        <div>
          <h3 className="font-title-md text-title-md text-ink mb-4">
            Max travel time
          </h3>

          <label className="flex items-center gap-3 cursor-pointer mb-3">
            <input
              type="checkbox"
              checked={travelHoursEnabled}
              onChange={(e) =>
                onMaxTravelHours(e.target.checked ? draftTravelHours : null)
              }
              className="w-5 h-5 rounded border-border-strong text-rausch focus:ring-rausch"
            />
            <span className="font-body-sm text-body-sm text-ink">
              Limit total trip time
            </span>
          </label>

          {travelHoursEnabled && (
            <>
              <input
                type="range"
                min={1}
                max={60}
                step={1}
                value={draftTravelHours}
                onChange={(e) => setDraftTravelHours(Number(e.target.value))}
                onMouseUp={() => onMaxTravelHours(draftTravelHours)}
                onTouchEnd={() => onMaxTravelHours(draftTravelHours)}
                className="w-full accent-rausch"
              />
              <div className="font-body-sm text-body-sm text-muted">
                Up to {draftTravelHours}h
              </div>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
