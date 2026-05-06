import { ChangeEvent, FocusEvent, InputHTMLAttributes, ReactNode, Ref } from "react";

type BookingFieldInputProps = {
  name: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void | Promise<unknown>;
  onBlur: (event: FocusEvent<HTMLInputElement>) => void | Promise<unknown>;
  ref: Ref<HTMLInputElement>;
  value?: string;
  disabled?: boolean;
};

type BookingFieldProps = {
  inputId: string;
  label: string;
  placeholder: string;
  registerProps: BookingFieldInputProps;
  error?: string;
  icon?: string;
  rightSlot?: ReactNode;
  containerClassName?: string;
  inputClassName?: string;
  type?: InputHTMLAttributes<HTMLInputElement>["type"];
  autoComplete?: string;
  inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];
  onChangeOverride?: (e: ChangeEvent<HTMLInputElement>) => void;
};

export default function BookingField({
  inputId,
  label,
  placeholder,
  registerProps,
  error,
  icon,
  rightSlot,
  containerClassName = "form-input-focus relative bg-canvas",
  inputClassName = "w-full bg-transparent border-none p-0 pt-lg font-body-md text-body-md text-ink focus:ring-0",
  type = "text",
  autoComplete,
  inputMode,
  onChangeOverride,
}: BookingFieldProps) {
  const { onChange, ...restRegister } = registerProps;

  return (
    <div className={containerClassName}>
      <div className="px-md pt-sm pb-xs">
        <label
          className="font-caption text-muted block absolute top-sm left-md text-[12px]"
          htmlFor={inputId}
        >
          {label}
        </label>

        <input
          id={inputId}
          placeholder={placeholder}
          type={type}
          autoComplete={autoComplete}
          inputMode={inputMode}
          aria-invalid={Boolean(error)}
          className={inputClassName}
          onChange={onChangeOverride ?? onChange}
          {...restRegister}
        />

        {rightSlot && (
          <span className="absolute right-md top-1/2 -translate-y-1/2">
            {rightSlot}
          </span>
        )}
        {!rightSlot && icon && (
          <span className="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 text-muted">
            {icon}
          </span>
        )}
      </div>

      {error && (
        <p className="px-md pb-sm text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
