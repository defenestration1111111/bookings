import { useForm, useFieldArray } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { BookingFormValues } from "../../../entities/booking/model/booking";
import { useBookingContext } from "../../../entities/booking/model/BookingContext";
import { PassengerCard } from "./PassengerCard";
import { BackButton, NextButton } from "./BookingNavButtons";

const MAX_PASSENGERS = 9;

export function StepPassengers({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  const { t } = useTranslation();
  const { passengerCount, passengers: savedPassengers, setPassengers, setPassengerCount } = useBookingContext();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<BookingFormValues>({
    mode: "onChange",
    defaultValues: {
      passengers: Array.from({ length: passengerCount }, (_, i) => ({
        firstName: savedPassengers[i]?.firstName ?? "",
        lastName: savedPassengers[i]?.lastName ?? "",
      })),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "passengers",
  });

  function addPassenger() {
    append({ firstName: "", lastName: "" });
    setPassengerCount(fields.length + 1);
  }

  function removePassenger(index: number) {
    remove(index);
    setPassengerCount(fields.length - 1);
  }

  function onSubmit(values: BookingFormValues) {
    setPassengers(values.passengers);
    onNext();
  }

  const atMax = fields.length >= MAX_PASSENGERS;

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-display-lg text-display-lg text-ink mb-1">
          {t("booking.passengers.title")}
        </h2>
        <p className="font-body-md text-body-md text-muted">
          {t("booking.passengers.subtitle")}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {fields.map((field, i) => (
          <PassengerCard
            key={field.id}
            index={i}
            register={register}
            errors={errors}
            onRemove={i > 0 ? () => removePassenger(i) : undefined}
          />
        ))}

        {/* Add passenger / max notice */}
        {atMax ? (
          <div className="rounded-2xl border border-hairline bg-surface-soft px-5 py-4">
            <p className="font-title-sm text-title-sm text-ink mb-0.5">
              {t("booking.passengers.maxNoticeTitle")}
            </p>
            <p className="font-body-sm text-body-sm text-muted">
              {t("booking.passengers.maxNoticeBody")}
            </p>
          </div>
        ) : (
          <button
            type="button"
            onClick={addPassenger}
            className="flex items-center gap-2 self-start border border-hairline rounded-xl px-4 h-[44px] font-title-sm text-title-sm text-ink hover:bg-surface-soft transition-colors active:scale-95 duration-200"
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            {t("booking.passengers.addAnother")}
          </button>
        )}

        <div className="flex justify-between pt-4">
          <BackButton onClick={onBack} />
          <NextButton type="submit" disabled={!isValid} label={t("booking.passengers.continueToSeating")} />
        </div>
      </form>
    </div>
  );
}
