import { FieldErrors, UseFormRegister } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { BookingFormValues } from "../../../entities/booking/model/booking";

export function PassengerCard({
  index,
  register,
  errors,
  onRemove,
}: {
  index: number;
  register: UseFormRegister<BookingFormValues>;
  errors: FieldErrors<BookingFormValues>;
  onRemove?: () => void;
}) {
  const { t } = useTranslation();
  const passengerErrors = errors.passengers?.[index];

  const title = index === 0
    ? t("booking.passengers.primary")
    : `${index + 1}. ${t("booking.passengers.passenger")}`;

  return (
    <div className="border border-hairline rounded-2xl p-6 bg-canvas">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-surface-soft flex items-center justify-center">
            <span className="material-symbols-outlined text-[16px] text-muted">
              person
            </span>
          </div>
          <span className="font-title-md text-title-md text-ink">
            {title}
          </span>
        </div>

        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-muted hover:text-ink hover:bg-surface-soft transition-colors"
            aria-label="Remove passenger"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label={t("booking.passengerCard.firstName")} error={passengerErrors?.firstName?.message}>
          <input
            {...register(`passengers.${index}.firstName`, {
              required: t("booking.passengerCard.required"),
              minLength: { value: 2, message: t("booking.passengerCard.tooShort") },
            })}
            placeholder="John"
            className={fieldClass(!!passengerErrors?.firstName)}
          />
        </FormField>        

        <FormField label={t("booking.passengerCard.lastName")} error={passengerErrors?.lastName?.message}>
          <input
            {...register(`passengers.${index}.lastName`, {
              required: t("booking.passengerCard.required"),
              minLength: { value: 2, message: t("booking.passengerCard.tooShort") },
            })}
            placeholder="Doe"
            className={fieldClass(!!passengerErrors?.lastName)}
          />
        </FormField>
      </div>
    </div>
  );
}

function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-caption text-caption text-ink">{label}</label>
      {children}
      {error && <span className="font-caption text-caption text-red-500">{error}</span>}
    </div>
  );
}

function fieldClass(hasError: boolean) {
  return [
    "h-[44px] px-4 rounded-xl border font-body-md text-body-md text-ink bg-canvas",
    "placeholder:text-muted outline-none transition-colors",
    "focus:border-ink focus:ring-2 focus:ring-ink/10",
    hasError ? "border-red-400 focus:border-red-500 focus:ring-red-500/10" : "border-hairline",
  ].join(" ");
}
