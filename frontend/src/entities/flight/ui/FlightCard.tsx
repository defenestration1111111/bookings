import { useTranslation } from "react-i18next";
import { Itinerary } from "../model/flight";
import FlightLegLine, { legToSummary } from "./FlightLegLine";

type FlightCardProps = {
  itinerary: Itinerary;
  onSelect: (itinerary: Itinerary) => void;
};

export default function FlightCard({ itinerary, onSelect }: FlightCardProps) {
  const { t } = useTranslation();
  const summary = legToSummary(itinerary.legs);

  return (
    <div className="group relative rounded-[14px] border border-hairline bg-canvas overflow-hidden flex flex-col md:flex-row shadow-sm hover:shadow-md transition-shadow">
      <div className="flex-1 p-6 flex flex-col gap-4 justify-center">
        <FlightLegLine summary={summary} />
      </div>

      <div className="w-full md:w-64 border-t md:border-t-0 md:border-l border-hairline p-6 flex flex-col justify-center items-center bg-surface-soft">
        <div className="font-body-sm text-body-sm text-muted mb-1">
          {itinerary.fareClass}
        </div>
        <div className="font-display-xl text-display-xl text-ink mb-4">
          ${itinerary.price.toFixed(0)}
        </div>
        <button
          className="bg-rausch text-canvas font-title-md text-title-md py-3 px-6 rounded-lg w-full hover:bg-rausch-active transition-colors flex justify-center items-center gap-2"
          onClick={() => onSelect(itinerary)}
          type="button"
        >
          {t("results.select")}
          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}
