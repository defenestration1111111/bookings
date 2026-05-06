import { Control, useController } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  CardNetwork,
  isValidCardNumber,
  isValidExpiryDate,
  isValidCvv,
  detectCardNetwork,
  formatCardNumber,
  formatExpiry,
  formatCvv,
} from "../../../shared/lib/paymentValidation";
import BookingField from "./BookingField";
import { BookingFormValues } from "../../../entities/booking/model/booking";

type PaymentSectionProps = {
  control: Control<BookingFormValues>;
};

function CardNetworkIcon({ network }: { network: CardNetwork }) {
  if (network === "unknown") return null;

  const labels: Record<Exclude<CardNetwork, "unknown">, string> = {
    visa: "VISA",
    mastercard: "MC",
    amex: "AMEX",
  };

  return (
    <span className="text-[11px] font-medium text-muted border border-hairline rounded px-1.5 py-0.5 bg-surface-soft">
      {labels[network as Exclude<CardNetwork, "unknown">]}
    </span>
  );
}

export function PaymentSection({ control }: PaymentSectionProps) {
  const { t } = useTranslation();

  const cardNumberCtrl = useController({
    control,
    name: "cardNumber",
    rules: {
      required: t("booking.payment.errors.cardRequired"),
      validate: (v) =>
        isValidCardNumber(v) || t("booking.payment.errors.cardInvalid"),
    },
  });

  const expiryCtrl = useController({
    control,
    name: "expiration",
    rules: {
      required: t("booking.payment.errors.expiryRequired"),
      validate: (v) =>
        isValidExpiryDate(v) || t("booking.payment.errors.expiryInvalid"),
    },
  });

  const cvvCtrl = useController({
    control,
    name: "cvv",
    rules: {
      required: t("booking.payment.errors.cvvRequired"),
      validate: (v) => isValidCvv(v) || t("booking.payment.errors.cvvInvalid"),
    },
  });

  const network = detectCardNetwork(cardNumberCtrl.field.value ?? "");

  function handleCardNumber(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatCardNumber(e.target.value);
    cardNumberCtrl.field.onChange(formatted);
  }

  function handleExpiry(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatExpiry(e.target.value);
    expiryCtrl.field.onChange(formatted);
  }

  function handleCvv(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatCvv(e.target.value);
    cvvCtrl.field.onChange(formatted);
  }

  return (
    <section className="border-b border-hairline pb-xl">
      <div className="flex justify-between items-center mb-lg">
        <h2 className="font-display-lg text-display-lg text-ink">
          {t("booking.payment.title")}
        </h2>
        <span className="material-symbols-outlined text-muted fill">
          credit_card
        </span>
      </div>

      <div className="flex flex-col border border-border-strong rounded-lg overflow-hidden">
        <div className="border-b border-border-strong">
          <BookingField
            inputId="cardNumber"
            label={t("booking.payment.cardNumber")}
            placeholder="0000 0000 0000 0000"
            registerProps={cardNumberCtrl.field}
            error={cardNumberCtrl.fieldState.error?.message}
            inputMode="numeric"
            autoComplete="cc-number"
            onChangeOverride={handleCardNumber}
            rightSlot={<CardNetworkIcon network={network} />}
          />
        </div>

        <div className="flex bg-canvas">
          <div className="w-1/2 border-r border-border-strong">
            <BookingField
              inputId="expiration"
              label={t("booking.payment.expiration")}
              placeholder="MM / YY"
              registerProps={expiryCtrl.field}
              error={expiryCtrl.fieldState.error?.message}
              inputMode="numeric"
              autoComplete="cc-exp"
              onChangeOverride={handleExpiry}
            />
          </div>

          <div className="w-1/2">
            <BookingField
              inputId="cvv"
              label={t("booking.payment.cvv")}
              placeholder="•••"
              registerProps={cvvCtrl.field}
              error={cvvCtrl.fieldState.error?.message}
              inputMode="numeric"
              autoComplete="cc-csc"
              onChangeOverride={handleCvv}
            />
          </div>
        </div>
      </div>

      <div className="mt-lg">
        <button
          className="font-title-md text-title-md text-ink underline hover:text-rausch transition-colors"
          type="button"
        >
          {t("booking.payment.enterCoupon")}
        </button>
      </div>
    </section>
  );
}
