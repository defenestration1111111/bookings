import { useTranslation } from "react-i18next";
import { useSearchForm } from "../features/search-flights/model/useSearchForm";
import { useSearchSubmit } from "../features/search-flights/model/useSearchSubmit";
import { TripToggle, SearchForm, LoadingOverlay } from "../features/search-flights/ui";
import { HeroBackground } from "../shared/ui/HeroBackground";

export default function SearchPage() {
  const form = useSearchForm();
  const { isSearching, showOverlay, submitSearch } = useSearchSubmit(form);
  const { t } = useTranslation();

  return (
    <main className="flex-grow flex flex-col items-center justify-center relative min-h-[600px] w-full bg-surface-soft">
      <HeroBackground />

      <div
        className={`relative z-10 w-full ${
          form.isRoundTrip ? "max-w-[1000px]" : "max-w-[850px]"
        } px-4 flex flex-col items-center gap-10 mt-[-100px]`}
      >
        <div className="flex items-center gap-12 text-white font-medium drop-shadow-md">
          <TripToggle active={form.isRoundTrip} onClick={() => form.setTripType("roundTrip")}>
            {t("search.roundTrip")}
          </TripToggle>
          <TripToggle active={!form.isRoundTrip} onClick={() => form.setTripType("oneWay")}>
            {t("search.oneWay")}
          </TripToggle>
        </div>

        <SearchForm {...form} isSearching={isSearching} onSubmit={submitSearch} />
      </div>

      <LoadingOverlay visible={showOverlay} />
    </main>
  );
}