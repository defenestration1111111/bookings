import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FareClass } from "../../../entities/flight/model/flight";
import { Range } from "../../../shared/types/common";
import DoubleRange from "../../../shared/ui/DoubleRange";

type FlightFiltersProps = {
  priceRange: Range;
  departureRange: Range;
  arrivalRange: Range;
  fareClasses: FareClass[];
  onPriceRange: (range: Range) => void;
  onDepartureRange: (range: Range) => void;
  onArrivalRange: (range: Range) => void;
  onFareClass: (fareClass: FareClass) => void;
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
  onArrivalRange,
  onDepartureRange,
  onFareClass,
  onPriceRange,
  priceRange
}: FlightFiltersProps) {
  const { t } = useTranslation();
  const [draftPriceRange, setDraftPriceRange] = useState(priceRange);
  const [draftDepartureRange, setDraftDepartureRange] = useState(departureRange);
  const [draftArrivalRange, setDraftArrivalRange] = useState(arrivalRange);

  useEffect(() => setDraftPriceRange(priceRange), [priceRange]);
  useEffect(() => setDraftDepartureRange(departureRange), [departureRange]);
  useEffect(() => setDraftArrivalRange(arrivalRange), [arrivalRange]);

  return (
    <aside className="w-full md:w-64 flex-shrink-0">
      <div className="sticky top-28 space-y-8">
        <div>
          <h3 className="font-title-md text-title-md text-ink mb-4">
            {t("results.filters.priceRange")}
          </h3>

          <DoubleRange
            max={1200}
            min={200}
            step={10}
            tone="rausch"
            range={draftPriceRange}
            onChange={setDraftPriceRange}
            onCommit={onPriceRange}
          />

          <div className="flex justify-between font-body-sm text-body-sm text-muted">
            <span>${draftPriceRange[0]}</span>
            <span>
              {draftPriceRange[1] >= 1200
                ? "$1,200+"
                : `$${draftPriceRange[1]}`}
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
      </div>
    </aside>
  );
}
