import { FormEvent } from "react";
import { AirportInput } from "./AirportInput";
import { DateSegment } from "./DateSegment";
import { Divider } from "../../../shared/ui/Divider";
import { TravellerSelect } from "../../../shared/ui/TravellerSelect";
import { useTranslation } from "react-i18next";

type SearchFormProps = {
  isRoundTrip: boolean;
  from: string;
  setFrom: (v: string) => void;
  to: string;
  setTo: (v: string) => void;
  depart: string;
  setDepart: (v: string) => void;
  returnDate: string;
  setReturnDate: (v: string) => void;
  travellers: number;
  setTravellers: (v: number) => void;
  isSearching: boolean;
  onSubmit: (e: FormEvent) => void;
};

export function SearchForm({
  isRoundTrip,
  from,
  setFrom,
  to,
  setTo,
  depart,
  setDepart,
  returnDate,
  setReturnDate,
  travellers,
  setTravellers,
  isSearching,
  onSubmit,
}: SearchFormProps) {
  const { t } = useTranslation();

  return (
    <form
      className="bg-canvas rounded-[28px] md:rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.05)] flex flex-col md:flex-row md:items-center w-full md:h-[66px] relative group hover:shadow-[0_2px_4px_rgba(0,0,0,0.1),0_8px_24px_rgba(0,0,0,0.1)] transition-shadow duration-300"
      onSubmit={onSubmit}
    >
      <AirportInput
        flexClass="flex-[1.5]"
        id="from"
        label={t("search.whereFrom")}
        placeholder={t("search.addOrigin")}
        value={from}
        onChange={setFrom}
      />

      <Divider />

      <AirportInput
        flexClass={isRoundTrip ? "flex-[1.3]" : "flex-[1.5]"}
        id="to"
        label={t("search.whereTo")}
        placeholder={t("search.searchDestinations")}
        value={to}
        onChange={setTo}
      />

      <Divider />

      <DateSegment id="depart" label={t("search.depart")} value={depart} onChange={setDepart} />

      {isRoundTrip && (
        <>
          <Divider />
          <DateSegment
            id="return"
            label={t("search.return")}
            min={depart || undefined}
            value={returnDate}
            onChange={setReturnDate}
          />
        </>
      )}

      <Divider />

      <TravellerSelect
        flex={isRoundTrip ? "flex-[0.8]" : "flex-[1]"}
        value={travellers}
        onChange={setTravellers}
      />

      <div className="pr-2 pl-2 pb-2 md:pb-0 flex justify-end">
        <button
          className="bg-[#ff385c] hover:bg-rausch-active w-[50px] h-[50px] rounded-full flex items-center justify-center text-white transition-colors duration-200 active:scale-95 disabled:opacity-80"
          disabled={isSearching}
          type="submit"
        >
          <span
            className={`material-symbols-outlined ${isSearching ? "animate-spin" : ""}`}
            style={{ fontWeight: 600 }}
          >
            {isSearching ? "progress_activity" : "search"}
          </span>
        </button>
      </div>
    </form>
  );
}
