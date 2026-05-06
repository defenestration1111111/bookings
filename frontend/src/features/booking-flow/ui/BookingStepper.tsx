import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useBookingContext } from "../../../entities/booking/model/BookingContext";
import { buildSavedSearchFlightsUrl } from "../../../entities/booking/lib/navigation";

export function BookingStepper({
  current,
  onStep,
}: {
  current: number;
  onStep: (s: number) => void;
}) {
  const navigate = useNavigate();
  const { searchParams: savedSearch } = useBookingContext();
  const { t } = useTranslation();

  const STEPS = [
    { label: t("booking.stepper.search"), icon: "search" },
    { label: t("booking.stepper.passengers"), icon: "group" },
    { label: t("booking.stepper.seating"), icon: "airline_seat_recline_extra" },
    { label: t("booking.stepper.overview"), icon: "credit_card" },
  ];

  function handleSearchStep() {
    navigate(buildSavedSearchFlightsUrl(savedSearch));
  }

  return (
    <nav className="flex items-center justify-center gap-0">
      {STEPS.map((s, i) => {
        const done = i < current;
        const active = i === current;

        return (
          <div key={s.label} className="flex items-center">
            <button
              type="button"
              onClick={() => {
                if (i === 0) {
                  handleSearchStep();
                  return;
                }
                if (done) onStep(i);
              }}
              disabled={!done && !active && i !== 0}
              className={`flex flex-col items-center gap-1.5 px-4 py-2 rounded-xl transition-colors
                ${active ? "text-rausch" : ""}
                ${done ? "text-rausch cursor-pointer" : ""}
                ${!active && !done ? "text-muted cursor-not-allowed" : ""}
              `}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors
                ${active ? "bg-rausch text-white" : ""}
                ${done ? "bg-rausch/15 text-rausch" : ""}
                ${!active && !done ? "bg-surface-soft text-muted" : ""}
              `}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {s.icon}
                </span>
              </div>
              <span className="text-[11px] font-medium tracking-wide uppercase whitespace-nowrap">
                {s.label}
              </span>
            </button>

            {i < STEPS.length - 1 && (
              <div
                className={`w-12 h-px mb-5 transition-colors ${
                  i < current ? "bg-rausch" : "bg-hairline"
                }`}
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}
